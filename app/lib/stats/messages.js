import { parse as parseCSV } from 'papaparse';

import { readFile } from '../extract';
import { channelTypes } from '../constants';

export const collectMessages = async (files) => {
  const messageIndex = JSON.parse(await readFile(files, 'messages/index.json'));
  const dmChannels = [];
  const guildChannels = [];

  let oldPackage = false;
  const file = files.find((f) => /messages\/([0-9]{16,32})\/$/.test(f.name));
  if (file) {
    oldPackage = true;
    console.debug('Old messages package detected');
  }
  let jsonMessages = false;
  const jsonFile = files.find((f) => /messages\/c([0-9]{16,32})\/messages\.json$/.test(f.name));
  if (jsonFile) {
    jsonMessages = true;
    console.debug('JSON messages package detected');
  }

  await Promise.all(Object.entries(messageIndex).map(async ([channelID, description]) => {
    const cleanUpDescription = (desc) => {
      if (!desc) {
        return 'Unknown conversation';
      }
      // remove fake discriminators
      if (desc.endsWith('#0000')) {
        return desc.substring(0, desc.length - 5);
      }
      return desc;
    };

    const channelData = {
      id: channelID,
      description: cleanUpDescription(description),
    };

    // fetch the channel metadata
    const channelMetadata = JSON.parse(await readFile(files, `messages/${oldPackage ? '' : 'c'}${channelData.id}/channel.json`));
    channelData.type = channelMetadata.type;

    // fetch the channel messages
    if (jsonMessages) {
      // new JSON format for messages
      const rawMessages = await readFile(files, `messages/c${channelData.id}/messages.json`);
      if (!rawMessages) {
        // ignore empty channels
        return;
      }
      const messageData = JSON.parse(rawMessages);
      channelData.messages = messageData.map((message) => ({
        timestamp: message.Timestamp,
        content: message.Contents || '',
        attachments: message.Attachments || null,
      }));
    } else {
      // old CSV format for messages
      const rawMessages = await readFile(files, `messages/${oldPackage ? '' : 'c'}${channelData.id}/messages.csv`);
      if (!rawMessages) {
      // ignore empty channels
        return;
      }
      const messageData = parseCSV(rawMessages, {
        header: true,
        newline: ',\r',
      })
        .data
        .filter((m) => m.Timestamp)
        .map((m) => ({
          timestamp: m.Timestamp,
          content: m.Contents || '',
          attachments: m['Attachments\r'] || null, // header ends here, so the header field contains the newline char
        }));
      channelData.messages = messageData;
    }

    // fetch additional metadata and store the channels
    if (
      channelData.type === channelTypes.DM
      || channelData.type === channelTypes.groupDM
    ) {
      // dms
      channelData.name = channelMetadata.name || channelData.description || 'Unknown conversation';
      if (channelData.name === 'Unknown conversation') {
        channelData.unknown = true;
      }
      channelData.recipientIDs = channelMetadata.recipients;
      dmChannels.push(channelData);
    } else {
      // guild channels and unknowns
      channelData.name = channelMetadata.name || 'Unknown channel';
      if (channelData.name === 'Unknown channel') {
        channelData.unknown = true;
      }
      channelData.guild = channelMetadata.guild;
      guildChannels.push(channelData);
    }
  }));

  return {
    dmChannels,
    guildChannels,
  };
};
export default collectMessages;
