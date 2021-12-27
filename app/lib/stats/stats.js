import { readFile } from '../extract';
import { collectAllMessages } from './messages';
import { storeStats } from '../store';
import {
  getBaseHours, getBaseDays, getBaseYears, channelTypes,
} from '../constants';

const emoteRegex = /(<a?)?:(\w+):((\d{18})>)?/g;
const mentionRegex = /<(?:@[!&]?|#)\d+>/g;

export const collectStats = async (files) => {
  const messages = await collectAllMessages(files);
  // const analytics = await collectAllAnalytics(files);

  await collectGlobalStats(files, messages);
};
export default collectStats;

// global information about the account (to be shown on the main stats page)
const collectGlobalStats = async (files, { dmChannels, guildChannels }) => {
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

  let stats = {
    // account stats
    id: userData.id,
    tag: `${userData.username}#${userData.discriminator}`,
    darkMode: userData.settings.settings.appearance.theme === 'DARK',
    connections: getConnections(),
    serverCount: Object.entries(serverData).length,
    // activity stats
    reactionCount: null,
    editCount: null,
    replyCount: null, // might not exist
    deleteCount: null,
    slashCommandCount: null,
    notificationClickCount: null,
    openDiscordCount: null,
    voiceChannelsJoinedCount: null,
    directVoiceCallsCount: null,
    firstVoiceCall: null,

  };

  const messageStats = {
    messageCount: 0,
    directMessageCount: 0,
    guildMessageCount: 0,
    wordCount: 0,
    characterCount: 0,
    mentionCount: 0,
    emoteCount: 0,
    firstMessage: null,
    messageCountPerHour: getBaseHours(),
    messageCountPerDay: getBaseDays(),
    messageCountPerYear: getBaseYears(),
    channelCount: guildChannels.length,
    dmChannelCount: dmChannels.length,
  };
  const topWords = {};
  const topEmotes = {};

  const combinedChannels = dmChannels.concat(guildChannels);
  combinedChannels.forEach((channelData) => {
    channelData.messages.forEach((message) => {
      const words = message.content.split(/\s/g);
      const messageTimestamp = new Date(message.timestamp);

      messageStats.messageCount += 1;
      messageStats.wordCount += words.length;
      messageStats.characterCount += message.content.length;

      if (
        channelData.type === channelTypes.DM
        || channelData.type === channelTypes.groupDM
      ) {
        messageStats.directMessageCount += 1;
      } else {
        messageStats.guildMessageCount += 1;
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
        if (topEmotes[emoteName]) {
          topEmotes[emoteName].count += 1;
        } else {
          topEmotes[emoteName] = {
            id: emoteID,
            count: 1,
          };
        }
      }

      words.forEach((word) => {
        if (
          !word.startsWith('<')
          && !word.startsWith('https://')
          && !word.startsWith('http://')
          && word !== ''
        ) {
          if (topWords[word]) {
            topWords[word].count += 1;
          } else {
            topWords[word] = {
              count: 1,
            };
          }
        }
      });

      if (
        !messageStats.firstMessage
        || messageTimestamp < messageStats.firstMessage.date
      ) {
        messageStats.firstMessage = {
          date: messageTimestamp,
          message: message.content,
          channel: { ...channelData, messages: null },
        };
      }

      messageStats.messageCountPerHour[messageTimestamp.getHours()] += 1;
      messageStats.messageCountPerDay[messageTimestamp.getDay()] += 1;
      messageStats.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
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
  messageStats.topEmotes = sortMatches(topEmotes).slice(0, 25);
  messageStats.topWords = sortMatches(topWords).slice(0, 25);

  stats = { ...messageStats, ...stats };

  storeStats('stats', stats);
};

/* const collectStatsForAllDMs = async (files) => {
  const stats = {
    userCount: null,
    friendCount: null,
    blockCount: null,
    noteCount: null,
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
    directMessages: null, // array of dm stats objects
  };
};

const collectStatsForDM = async (files, dmID) => {
  const stats = {
    id: dmID,
    userTag: null,
    userID: null,
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
  };
};

const collectStatsForAllServers = async (files) => {
  const stats = {
    count: null,
    mutedCount: null,
    ownedCount: null,
    channelCount: null,
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
  };
};

const collectStatsForServer = async (files, serverID) => {
  const stats = {
    id: serverID,
    name: null,
    serverID: null,
    serverName: null,
    channelCount: null,
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
  };
};

const collectStatsForAllChannels = async (files) => {
  const stats = {
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
  };
};

const collectStatsForChannel = async (files, channelID) => {
  const stats = {
    id: channelID,
    name: null,
    serverID: null,
    messageCount: null,
    wordCount: null,
    characterCount: null,
    firstMessage: null,
    topWords: null,
    topEmotes: null,
    messageCountPerHour: null,
    messageCountPerDay: null,
    messageCountPerYear: null,
  };
}; */
