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
  if (!updatedCategory.topEmotes[emoteName]) {
    updatedCategory.topEmotes[emoteName] = {
      count: 1,
      id: emoteID,
    };
  } else {
    updatedCategory.topEmotes[emoteName].count += 1;
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

export const updateFirstMessage = (category, message, channelData, messageTimestamp) => {
  const updatedCategory = category;
  if (!updatedCategory.firstMessage || messageTimestamp < updatedCategory.firstMessage.date) {
    updatedCategory.firstMessage = {
      date: messageTimestamp,
      content: message.content,
      channel: { ...channelData, messages: null },
    };
  }
};
