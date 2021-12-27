import { parse as parseCSV } from 'papaparse';

import { readFile } from '../extract';
import { channelTypes } from '../constants';

export const collectAllMessages = async (files) => {
  const messageIndex = JSON.parse(await readFile(files, 'messages/index.json'));
  const dmChannels = [];
  const guildChannels = [];

  await Promise.all(Object.entries(messageIndex).map(async ([channelID, description]) => {
    const channelData = {
      id: channelID,
      description: description || 'Unknown conversation',
    };

    // fetch the channel metadata
    const channelMetadata = JSON.parse(await readFile(files, `messages/c${channelData.id}/channel.json`));
    channelData.type = channelMetadata.type;

    // fetch the channel messages
    const rawMessages = await readFile(files, `messages/c${channelData.id}/messages.csv`);
    const messageData = parseCSV(rawMessages, {
      header: true,
      newline: ',\r',
    })
      .data
      .filter((m) => m.Contents)
      .map((m) => ({
        timestamp: m.Timestamp,
        content: m.Contents,
      }));
    channelData.messages = messageData;

    // fetch additional metadata and store the channels
    if (
      channelData.type === channelTypes.DM
      || channelData.type === channelTypes.groupDM
    ) {
      // dms
      channelData.name = channelMetadata.name || description || 'Unknown conversation';
      channelData.recipientIDs = channelMetadata.recipients;
      dmChannels.push(channelData);
    } else {
      // guild channels and unknowns
      channelData.name = channelMetadata.name;
      channelData.guild = channelMetadata.guild;
      guildChannels.push(channelData);
    }
  }));

  return {
    dmChannels,
    guildChannels,
  };
};
export default collectAllMessages;
