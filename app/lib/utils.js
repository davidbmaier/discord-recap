import { channelTypes, getBaseStats } from './constants';
import { testIDB } from './store';

export const incrementTextStats = (category, wordLength, characterLength, messageTimestamp) => {
  const updatedCategory = category;
  updatedCategory.messageCount += 1;
  updatedCategory.wordCount += wordLength;
  updatedCategory.characterCount += characterLength;
  updatedCategory.messageCountPerHour[messageTimestamp.getHours()] += 1;
  // move sundays to the back
  let day = messageTimestamp.getDay() - 1;
  if (day === -1) {
    day = 6;
  }
  updatedCategory.messageCountPerDay[day] += 1;
  updatedCategory.messageCountPerYear[messageTimestamp.getFullYear()] += 1;
};

export const incrementEmoteMatches = (category, emoteName, emoteID) => {
  const updatedCategory = category;
  const lowerCaseName = emoteName.toLowerCase();
  if (!updatedCategory.topEmotes[lowerCaseName]) {
    updatedCategory.topEmotes[lowerCaseName] = {
      originalName: emoteName,
      count: 1,
      id: emoteID,
    };
  } else {
    updatedCategory.topEmotes[lowerCaseName].count += 1;
  }
};

export const incrementWordMatches = (category, word) => {
  const updatedCategory = category;
  if (!updatedCategory.topWords[word]) {
    updatedCategory.topWords[word] = {
      count: 1,
    };
  } else {
    updatedCategory.topWords[word].count += 1;
  }
};

export const updateFirstAndLastMessage = (category, message, channelData, messageTimestamp) => {
  const unknownData = {};
  if (
    (channelData.type !== channelTypes.DM && channelData.type !== channelTypes.groupDM)
    && !channelData.guild
  ) {
    unknownData.guild = {
      id: 'unknown',
      name: 'Unknown/Deleted Servers',
    };
  }

  const updatedCategory = category;
  if (!updatedCategory.firstMessage || messageTimestamp < updatedCategory.firstMessage.date || updatedCategory.firstMessage?.content === ``) {
    updatedCategory.firstMessage = {
      date: messageTimestamp,
      content: message.content,
      channel: { ...channelData, messages: null, ...unknownData },
    };
  }
  if (!updatedCategory.lastMessage || messageTimestamp > updatedCategory.lastMessage.date || updatedCategory.lastMessage?.content === ``) {
    updatedCategory.lastMessage = {
      date: messageTimestamp,
      content: message.content,
      channel: { ...channelData, messages: null, ...unknownData },
    };
  }
};

export const cleanChartData = (data) => Object.entries(data).map(([category, count]) => ({ category, count }));

export const usePlural = (word, value, plural) => {
  if (value === 1) {
    return word;
  }
  return `${plural || `${word}s`}`;
};

export const formatNumber = (number) => number?.toLocaleString('en-US');

export const initializeYearStats = () => {
  const baseYears = {};
  // Discord was founded in 2015
  for (let i = 2015; i < new Date().getFullYear() + 1; i += 1) {
    baseYears[i] = {
      ...getBaseStats(),
    };
  }
  return baseYears;
};

export const checkForMobile = (userAgent) => /Mobi/i.test(userAgent);

export const checkForFFPrivate = async () => {
  try {
    await testIDB();
    return false;
  } catch (error) {
    return true;
  }
};

export const resolveUserTag = (name, discriminator) => {
  if (discriminator.toString() === '0') {
    return name;
  }
  return `${name}#${discriminator.toString().padStart(4, '0')}`;
};
