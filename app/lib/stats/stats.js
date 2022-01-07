import emojiRegex from 'emoji-regex';

import { readFile } from '../extract';
import { collectMessages } from './messages';
import { collectAnalytics } from './analytics';
import {
  incrementTextStats, incrementEmoteMatches, incrementWordMatches, updateFirstAndLastMessage, initializeYearStats,
} from '../utils';
import { storeStats } from '../store';
import {
  channelTypes, promotionEventTypes, technicalEventTypes, relationshipTypes, getBaseStats, emoteRegex, mentionRegex,
} from '../constants';

export const collectStats = async (files) => {
  const messages = await collectMessages(files);
  const analytics = await collectAnalytics(files);

  await collectGlobalStats(files, messages, analytics);
};
export default collectStats;

// global information about the account (to be shown on the main stats page)
const collectGlobalStats = async (files, { dmChannels, guildChannels }, analytics) => {
  const userData = JSON.parse(await readFile(files, 'account/user.json'));
  const serverData = JSON.parse(await readFile(files, 'servers/index.json'));

  const getConnections = () => {
    const connections = [];
    userData.connections.forEach((connection) => {
      connections.push({
        type: connection.type,
        name: connection.name,
      });
    });

    return connections;
  };

  const getPaymentsTotal = () => {
    const payments = [];
    userData.payments.forEach((payment) => {
      const paymentObject = ({
        amount: payment.amount,
        description: payment.description,
        date: new Date(payment.created_at),
      });
      payments.push(paymentObject);
    });

    return payments.map((p) => p.amount).reduce((sum, amount) => sum + amount, 0);
  };

  let darkModeEnabled = false;
  let darkModeSetting = userData.settings?.settings?.appearance?.theme;
  if (!darkModeSetting) {
    darkModeSetting = userData.settings.theme;
  }
  if (darkModeSetting.toLowerCase() === 'dark') {
    darkModeEnabled = true;
  }

  let stats = {
    // account stats
    userID: userData.id,
    userTag: `${userData.username}#${userData.discriminator}`,
    darkMode: darkModeEnabled,
    connections: getConnections(),
    totalPaymentAmount: getPaymentsTotal(),
  };

  const messageStats = {
    mentionCount: 0,
    emoteCount: 0,
    emojiCount: 0,
    ...getBaseStats(),
    directMessages: {
      count: dmChannels.length,
      userCount: 0,
      friendCount: 0,
      blockedCount: 0,
      noteCount: 0,
      ...getBaseStats(),
      channels: [], // array of dm stats objects
    },
    serverMessages: {
      count: Object.entries(serverData).length,
      mutedCount: 0,
      channelCount: guildChannels.length,
      ...getBaseStats(),
      servers: [], // array of guild stats objects
    },
    yearMessages: initializeYearStats(),
  };

  // get global message stats
  messageStats.directMessages.userCount = dmChannels
    ? dmChannels.filter((channel) => channel.type === channelTypes.DM).length
    : 0;
  messageStats.directMessages.friendCount = userData.relationships
    ? userData.relationships.filter((relationship) => relationship.type === relationshipTypes.friend).length
    : 0;
  messageStats.directMessages.blockedCount = userData.relationships
    ? userData.relationships.filter((relationship) => relationship.type === relationshipTypes.blocked).length
    : 0;
  messageStats.directMessages.noteCount = Object.keys(userData.notes).length;
  messageStats.serverMessages.mutedCount = userData.guild_settings
    ? userData.guild_settings.filter((setting) => setting.muted).length
    : 0;

  const getMessageStats = (channelData, message) => {
    const isDM = channelData.type === channelTypes.DM || channelData.type === channelTypes.groupDM;
    const messageTimestamp = new Date(message.timestamp);
    const year = messageTimestamp.getFullYear();
    const words = message.content.split(/\s/g);

    // initialize all levels of stats objects
    const yearStats = messageStats.yearMessages;
    const dmStats = messageStats.directMessages;
    let dmChannelStats;
    const allServerStats = messageStats.serverMessages;
    let serverStats;
    let serverChannelStats;

    if (isDM) {
      dmChannelStats = messageStats.directMessages.channels.find((dm) => dm.id === channelData.id);
      if (!dmChannelStats) {
        dmChannelStats = {
          id: channelData.id,
          name: channelData.name,
          unknown: channelData.unknown,
          ...getBaseStats(),
        };
        if (channelData.type === channelTypes.DM) {
          dmChannelStats.userID = channelData.recipientIDs.find((recipient) => recipient.id !== stats.userID);
          // TODO: resolve user details by ID through some API
        } else {
          dmChannelStats.userIDs = channelData.recipientIDs
            ? channelData.recipientIDs.filter((recipient) => recipient.id !== stats.userID)
            : [];
        }

        messageStats.directMessages.channels.push(dmChannelStats);
      }
    } else {
      serverStats = allServerStats.servers.find((server) => server.id === channelData.guild?.id);
      if (!serverStats) {
        serverStats = {
          id: channelData.guild?.id,
          name: channelData.guild?.name,
          channelCount: 0,
          ...getBaseStats(),
          channels: [], // array of channel stats objects
        };
        allServerStats.servers.push(serverStats);
      }
      serverChannelStats = serverStats.channels.find((channel) => channel.id === channelData.id);
      if (!serverChannelStats) {
        serverChannelStats = {
          id: channelData.id,
          name: channelData.name,
          unknown: channelData.unknown,
          serverID: channelData.guild?.id,
          serverName: channelData.guild?.name,
          ...getBaseStats(),
        };
        serverStats.channels.push(serverChannelStats);
        serverStats.channelCount += 1; // count channels for the server
      }
    }

    // increase message counts
    incrementTextStats(messageStats, words.length, message.content.length, messageTimestamp);
    if (isDM) {
      incrementTextStats(dmStats, words.length, message.content.length, messageTimestamp);
      incrementTextStats(dmChannelStats, words.length, message.content.length, messageTimestamp);
    } else {
      incrementTextStats(allServerStats, words.length, message.content.length, messageTimestamp);
      incrementTextStats(serverStats, words.length, message.content.length, messageTimestamp);
      incrementTextStats(serverChannelStats, words.length, message.content.length, messageTimestamp);
    }
    incrementTextStats(yearStats[year], words.length, message.content.length, messageTimestamp);

    // collect mentions (only global)
    const mentionMatches = message.content.match(mentionRegex);
    mentionMatches?.forEach(() => {
      messageStats.mentionCount += 1;
    });

    // process emote statistics
    const emoteMatches = message.content.matchAll(emoteRegex);
    // eslint-disable-next-line no-restricted-syntax -- matchAll returns an iterator
    for (const emoteMatch of emoteMatches) {
      // ignore spotify matches since playalongs can confuse the regex
      if (!emoteMatch.input.startsWith('spotify')) {
        messageStats.emoteCount += 1;
        const emoteName = emoteMatch[2];
        const emoteID = emoteMatch[4];

        incrementEmoteMatches(messageStats, emoteName, emoteID);
        incrementEmoteMatches(yearStats[year], emoteName, emoteID);
        if (isDM) {
          incrementEmoteMatches(dmStats, emoteName, emoteID);
          incrementEmoteMatches(dmChannelStats, emoteName, emoteID);
        } else {
          incrementEmoteMatches(allServerStats, emoteName, emoteID);
          incrementEmoteMatches(serverStats, emoteName, emoteID);
          incrementEmoteMatches(serverChannelStats, emoteName, emoteID);
        }
      }
    }
    // process default emoji
    const emojiMatches = message.content.matchAll(emojiRegex());
    // eslint-disable-next-line no-restricted-syntax -- matchAll returns an iterator
    for (const emojiMatch of emojiMatches) {
      messageStats.emojiCount += 1;
      const emoji = emojiMatch[0];

      incrementEmoteMatches(messageStats, emoji);
      incrementEmoteMatches(yearStats[year], emoji);
      if (isDM) {
        incrementEmoteMatches(dmStats, emoji);
        incrementEmoteMatches(dmChannelStats, emoji);
      } else {
        incrementEmoteMatches(allServerStats, emoji);
        incrementEmoteMatches(serverStats, emoji);
        incrementEmoteMatches(serverChannelStats, emoji);
      }
    }

    // process word statistics
    words.forEach((word) => {
      if (
        !word.startsWith('<')
        && !word.startsWith('https://')
        && !word.startsWith('http://')
        && word !== ''
        && word !== '-'
        && word.length > 5
      ) {
        incrementWordMatches(messageStats, word);
        incrementWordMatches(yearStats[year], word);
        if (isDM) {
          incrementWordMatches(dmStats, word);
          incrementWordMatches(dmChannelStats, word);
        } else {
          incrementWordMatches(allServerStats, word);
          incrementWordMatches(serverStats, word);
          incrementWordMatches(serverChannelStats, word);
        }
      }
    });

    // find first messages
    updateFirstAndLastMessage(messageStats, message, channelData, messageTimestamp);
    updateFirstAndLastMessage(yearStats[year], message, channelData, messageTimestamp);
    if (isDM) {
      updateFirstAndLastMessage(dmStats, message, channelData, messageTimestamp);
      updateFirstAndLastMessage(dmChannelStats, message, channelData, messageTimestamp);
    } else {
      updateFirstAndLastMessage(allServerStats, message, channelData, messageTimestamp);
      updateFirstAndLastMessage(serverStats, message, channelData, messageTimestamp);
      updateFirstAndLastMessage(serverChannelStats, message, channelData, messageTimestamp);
    }
  };

  const combinedChannels = dmChannels.concat(guildChannels);
  combinedChannels.forEach((channelData) => {
    channelData.messages.forEach((message) => {
      getMessageStats(channelData, message);
    });
  });

  const sortMatches = (matches) => {
    const sortedMatches = Object.entries(matches).sort(
      ([, aValue], [, bValue]) => bValue.count - aValue.count,
    );
    const cleanMatches = [];
    sortedMatches.forEach(([name, { count, id }]) => {
      const cleanedMatch = {
        name,
        count,
      };
      if (id) {
        cleanedMatch.id = id;
      }
      cleanMatches.push(cleanedMatch);
    });
    return cleanMatches;
  };

  // sort top emotes and words (and cut off the top 20)
  messageStats.topEmotes = sortMatches(messageStats.topEmotes).slice(0, 20);
  messageStats.topWords = sortMatches(messageStats.topWords).slice(0, 20);
  messageStats.directMessages.topEmotes = sortMatches(messageStats.directMessages.topEmotes).slice(0, 20);
  messageStats.directMessages.topWords = sortMatches(messageStats.directMessages.topWords).slice(0, 20);
  messageStats.serverMessages.topEmotes = sortMatches(messageStats.serverMessages.topEmotes).slice(0, 20);
  messageStats.serverMessages.topWords = sortMatches(messageStats.serverMessages.topWords).slice(0, 20);

  messageStats.directMessages.channels.forEach((channel) => {
    const updatedChannel = channel;
    updatedChannel.topEmotes = sortMatches(channel.topEmotes).slice(0, 20);
    updatedChannel.topWords = sortMatches(channel.topWords).slice(0, 20);
  });

  messageStats.serverMessages.servers.forEach((server) => {
    const updatedServer = server;
    updatedServer.topEmotes = sortMatches(server.topEmotes).slice(0, 20);
    updatedServer.topWords = sortMatches(server.topWords).slice(0, 20);
    updatedServer.channels.forEach((channel) => {
      const updatedChannel = channel;
      updatedChannel.topEmotes = sortMatches(channel.topEmotes).slice(0, 20);
      updatedChannel.topWords = sortMatches(channel.topWords).slice(0, 20);
    });
  });

  Object.entries(messageStats.yearMessages).forEach(([, yearStats]) => {
    const updatedYearStats = yearStats;
    updatedYearStats.topEmotes = sortMatches(yearStats.topEmotes).slice(0, 20);
    updatedYearStats.topWords = sortMatches(yearStats.topWords).slice(0, 20);
  });

  // go through servers without IDs and pull them together
  messageStats.serverMessages.servers.forEach((server) => {
    if (!server.id) {
      const updatedServer = server;
      updatedServer.name = 'Unknown/Deleted Servers';
      updatedServer.unknown = true;
      updatedServer.id = 'unknown';
    }
  });

  // clean up event statistics
  const eventStats = { ...analytics, promotionShown: 0, errorDetected: 0 };
  // correct reaction count
  eventStats.reactionAdded -= eventStats.reactionRemoved;
  delete eventStats.reactionRemoved;
  // summarize promotion and technical events
  const eventCountEntries = Object.entries(eventStats);
  eventCountEntries.forEach(([eventKey, eventCount]) => {
    if (promotionEventTypes[eventKey]) {
      eventStats.promotionShown += eventCount;
      delete eventStats[eventKey];
    }
    if (technicalEventTypes[eventKey]) {
      eventStats.errorDetected += eventCount;
      delete eventStats[eventKey];
    }
  });

  stats = { messageStats, eventStats, ...stats };

  storeStats(stats);
};
