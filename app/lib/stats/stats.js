import { readFile } from '../extract';
import { collectMessages } from './messages';
import { collectAnalytics } from './analytics';
import { storeStats } from '../store';
import {
  getBaseHours, getBaseDays, getBaseYears, channelTypes, promotionEventTypes, technicalEventTypes, relationshipTypes,
} from '../constants';

const emoteRegex = /(<a?)?:(\w+):((\d{18})>)?/g;
const mentionRegex = /<(?:@[!&]?|#)\d+>/g;

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

  const getPayments = () => {
    const payments = [];
    userData.payments.forEach((payment) => {
      const paymentObject = ({
        amount: payment.amount,
        description: payment.description,
        date: new Date(payment.created_at),
      });
      payments.push(paymentObject);
    });

    return {
      totalAmount: payments.map((p) => p.amount).reduce((sum, amount) => sum + amount, 0),
      history: payments,
    };
  };

  let stats = {
    // account stats
    userID: userData.id,
    tag: `${userData.username}#${userData.discriminator}`,
    darkMode: userData.settings.settings.appearance.theme === 'DARK',
    connections: getConnections(),
    payments: getPayments(),
  };

  const messageStats = {
    mentionCount: 0,
    emoteCount: 0,
    messageCount: 0,
    wordCount: 0,
    characterCount: 0,
    firstMessage: null,
    topWords: {},
    topEmotes: {},
    messageCountPerHour: getBaseHours(),
    messageCountPerDay: getBaseDays(),
    messageCountPerYear: getBaseYears(),
    directMessages: {
      count: dmChannels.length,
      userCount: 0,
      friendCount: 0,
      blockedCount: 0,
      noteCount: 0,
      messageCount: 0,
      wordCount: 0,
      characterCount: 0,
      firstMessage: null,
      topWords: {},
      topEmotes: {},
      messageCountPerHour: getBaseHours(),
      messageCountPerDay: getBaseDays(),
      messageCountPerYear: getBaseYears(),
      channels: [], // array of dm stats objects
    },
    serverMessages: {
      count: Object.entries(serverData).length,
      mutedCount: 0,
      channelCount: guildChannels.length,
      messageCount: 0,
      wordCount: 0,
      characterCount: 0,
      firstMessage: null,
      topWords: {},
      topEmotes: {},
      messageCountPerHour: getBaseHours(),
      messageCountPerDay: getBaseDays(),
      messageCountPerYear: getBaseYears(),
      servers: [], // array of guild stats objects
    },
  };

  // get global message stats
  messageStats.directMessages.userCount = dmChannels
    .filter((channel) => channel.type === channelTypes.DM).length;
  messageStats.directMessages.friendCount = userData.relationships
    .filter((relationship) => relationship.type === relationshipTypes.friend).length;
  messageStats.directMessages.blockedCount = userData.relationships
    .filter((relationship) => relationship.type === relationshipTypes.blocked).length;
  messageStats.directMessages.noteCount = Object.keys(userData.notes).length;
  messageStats.serverMessages.mutedCount = userData.guild_settings.filter((setting) => setting.muted).length;

  const getMessageStats = (channelData, message) => {
    const isDM = channelData.type === channelTypes.DM || channelData.type === channelTypes.groupDM;

    const words = message.content.split(/\s/g);
    const messageTimestamp = new Date(message.timestamp);

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
          messageCount: 0,
          wordCount: 0,
          characterCount: 0,
          firstMessage: null,
          topWords: {},
          topEmotes: {},
          messageCountPerHour: getBaseHours(),
          messageCountPerDay: getBaseDays(),
          messageCountPerYear: getBaseYears(),
        };
        if (channelData.type === channelTypes.DM) {
          dmChannelStats.userID = channelData.recipientIDs.find((recipient) => recipient.id !== stats.userID);
          // TODO: resolve user details by ID through some API
        } else {
          dmChannelStats.userIDs = channelData.recipientIDs.filter((recipient) => recipient.id !== stats.userID);
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
          messageCount: 0,
          wordCount: 0,
          characterCount: 0,
          firstMessage: null,
          topWords: {},
          topEmotes: {},
          messageCountPerHour: getBaseHours(),
          messageCountPerDay: getBaseDays(),
          messageCountPerYear: getBaseYears(),
          channels: [], // array of channel stats objects
        };
        allServerStats.servers.push(serverStats);
      }
      serverChannelStats = serverStats.channels.find((channel) => channel.id === channelData.id);
      if (!serverChannelStats) {
        serverChannelStats = {
          id: channelData.id,
          name: channelData.name,
          serverID: channelData.guild?.id,
          serverName: channelData.guild?.name,
          messageCount: 0,
          wordCount: 0,
          characterCount: 0,
          firstMessage: null,
          topWords: {},
          topEmotes: {},
          messageCountPerHour: getBaseHours(),
          messageCountPerDay: getBaseDays(),
          messageCountPerYear: getBaseYears(),
        };
        serverStats.channels.push(serverChannelStats);
        serverStats.channelCount += 1; // count channels for the server
      }
    }

    // increase message counts
    messageStats.messageCount += 1;
    messageStats.wordCount += words.length;
    messageStats.characterCount += message.content.length;

    if (isDM) {
      dmStats.messageCount += 1;
      dmStats.wordCount += words.length;
      dmStats.characterCount += message.content.length;
      dmChannelStats.messageCount += 1;
      dmChannelStats.wordCount += words.length;
      dmChannelStats.characterCount += message.content.length;
    } else {
      allServerStats.messageCount += 1;
      allServerStats.wordCount += words.length;
      allServerStats.characterCount += message.content.length;
      serverStats.messageCount += 1;
      serverStats.wordCount += words.length;
      serverStats.characterCount += message.content.length;
      serverChannelStats.messageCount += 1;
      serverChannelStats.wordCount += words.length;
      serverChannelStats.characterCount += message.content.length;
    }

    const mentionMatches = message.content.match(mentionRegex);
    mentionMatches?.forEach(() => {
      messageStats.mentionCount += 1;
    });

    const emoteMatches = message.content.matchAll(emoteRegex);
    // eslint-disable-next-line no-restricted-syntax -- matchAll returns an iterator
    for (const emoteMatch of emoteMatches) {
      messageStats.emoteCount += 1;
      const emoteName = emoteMatch[2];
      const emoteID = emoteMatch[4];
      // update global emote stats
      if (messageStats.topEmotes[emoteName]) {
        messageStats.topEmotes[emoteName].count += 1;
      } else {
        messageStats.topEmotes[emoteName] = {
          id: emoteID,
          count: 1,
        };
      }
      if (isDM) {
        // update global DM emote stats
        if (dmStats.topEmotes[emoteName]) {
          dmStats.topEmotes[emoteName].count += 1;
        } else {
          dmStats.topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
        // update DM channel emote stats
        if (dmChannelStats.topEmotes[emoteName]) {
          dmChannelStats.topEmotes[emoteName].count += 1;
        } else {
          dmChannelStats.topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
      } else {
        // update global server emote stats
        if (allServerStats.topEmotes[emoteName]) {
          allServerStats.topEmotes[emoteName].count += 1;
        } else {
          allServerStats.topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
        // update server emote stats
        if (serverStats.topEmotes[emoteName]) {
          serverStats.topEmotes[emoteName].count += 1;
        } else {
          serverStats.topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
        // update server channel emote stats
        if (serverChannelStats.topEmotes[emoteName]) {
          serverChannelStats.topEmotes[emoteName].count += 1;
        } else {
          serverChannelStats.topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
      }
    }

    words.forEach((word) => {
      if (
        !word.startsWith('<')
          && !word.startsWith('https://')
          && !word.startsWith('http://')
          && word !== ''
          && word !== '-'
      ) {
        // update global word stats
        if (messageStats.topWords[word]) {
          messageStats.topWords[word].count += 1;
        } else {
          messageStats.topWords[word] = {
            count: 1,
          };
        }
        if (isDM) {
          // update global DM word stats
          if (dmStats.topWords[word]) {
            dmStats.topWords[word].count += 1;
          } else {
            dmStats.topWords[word] = {
              count: 1,
            };
          }
          // update DM channel word stats
          if (dmChannelStats.topWords[word]) {
            dmChannelStats.topWords[word].count += 1;
          } else {
            dmChannelStats.topWords[word] = {
              count: 1,
            };
          }
        } else {
          // update global server word stats
          if (allServerStats.topWords[word]) {
            allServerStats.topWords[word].count += 1;
          } else {
            allServerStats.topWords[word] = {
              count: 1,
            };
          }
          // update server word stats
          if (serverStats.topWords[word]) {
            serverStats.topWords[word].count += 1;
          } else {
            serverStats.topWords[word] = {
              count: 1,
            };
          }
          // update server channel word stats
          if (serverChannelStats.topWords[word]) {
            serverChannelStats.topWords[word].count += 1;
          } else {
            serverChannelStats.topWords[word] = {
              count: 1,
            };
          }
        }
      }
    });

    if (!messageStats.firstMessage || messageTimestamp < messageStats.firstMessage.date) {
      messageStats.firstMessage = {
        date: messageTimestamp,
        message: message.content,
        channel: { ...channelData, messages: null },
      };
    }

    if (isDM) {
      if (!dmStats.firstMessage || messageTimestamp < dmStats.firstMessage.date) {
        dmStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }
      if (!dmChannelStats.firstMessage || messageTimestamp < dmChannelStats.firstMessage.date) {
        dmChannelStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }
    } else {
      if (!allServerStats.firstMessage || messageTimestamp < allServerStats.firstMessage.date) {
        allServerStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }
      if (!serverStats.firstMessage || messageTimestamp < serverStats.firstMessage.date) {
        serverStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }
      if (!serverChannelStats.firstMessage || messageTimestamp < serverChannelStats.firstMessage.date) {
        serverChannelStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }
    }

    messageStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
    messageStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
    messageStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;

    if (isDM) {
      dmStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      dmStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      dmStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
      dmChannelStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      dmChannelStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      dmChannelStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
    } else {
      allServerStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      allServerStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      allServerStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
      serverStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      serverStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      serverStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
      serverChannelStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      serverChannelStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      serverChannelStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
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

  // sort top emotes and words (and cut off the top 25)
  messageStats.topEmotes = sortMatches(messageStats.topEmotes).slice(0, 25);
  messageStats.topWords = sortMatches(messageStats.topWords).slice(0, 25);
  messageStats.directMessages.topEmotes = sortMatches(messageStats.directMessages.topEmotes).slice(0, 25);
  messageStats.directMessages.topWords = sortMatches(messageStats.directMessages.topWords).slice(0, 25);
  messageStats.serverMessages.topEmotes = sortMatches(messageStats.serverMessages.topEmotes).slice(0, 25);
  messageStats.serverMessages.topWords = sortMatches(messageStats.serverMessages.topWords).slice(0, 25);

  messageStats.directMessages.channels.forEach((channel) => {
    const updatedChannel = channel;
    updatedChannel.topEmotes = sortMatches(channel.topEmotes).slice(0, 25);
    updatedChannel.topWords = sortMatches(channel.topWords).slice(0, 25);
  });

  messageStats.serverMessages.servers.forEach((server) => {
    const updatedServer = server;
    updatedServer.topEmotes = sortMatches(server.topEmotes).slice(0, 25);
    updatedServer.topWords = sortMatches(server.topWords).slice(0, 25);
    updatedServer.channels.forEach((channel) => {
      const updatedChannel = channel;
      updatedChannel.topEmotes = sortMatches(channel.topEmotes).slice(0, 25);
      updatedChannel.topWords = sortMatches(channel.topWords).slice(0, 25);
    });
  });

  const eventStats = { ...analytics, promotionShown: 0, errorDetected: 0 };

  // fix reaction count
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

  storeStats('stats', stats);
};
