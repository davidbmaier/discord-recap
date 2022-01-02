import { DecodeUTF8 } from 'fflate';

import { eventTypes } from '../constants';

const updateEvents = (events, event) => {
  const updatedEvents = { ...events };
  const type = event.event_type;

  const eventTypeKey = Object.keys(eventTypes).find((k) => eventTypes[k] === type);
  if (!eventTypeKey) {
    // only process events we care about
    return events;
  }

  updatedEvents[eventTypeKey] += 1;
  return updatedEvents;
};

export const collectAnalytics = (files) => new Promise((resolve) => {
  let file = files.find((f) => /activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(f.name));
  if (!file) {
    // backup is /reporting - /activity only exists with the right privacy settings
    file = files.find((f) => /activity\/reporting\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(f.name));
    if (!file) {
      resolve({});
      return;
    }
  }

  let events = {};
  Object.keys(eventTypes).forEach((eventType) => {
    events[eventType] = 0;
  });

  const decoder = new DecodeUTF8();
  const startAt = Date.now();
  let bytesRead = 0;

  file.ondata = (_err, data, final) => {
    bytesRead += data.length;
    console.log(`Loading user statistics... ${Math.ceil((bytesRead / file.originalSize) * 100)}%`);
    const remainingBytes = file.originalSize - bytesRead;
    const timeToReadByte = (Date.now() - startAt) / bytesRead;
    const remainingTime = parseInt((remainingBytes * timeToReadByte) / 1000, 10);
    console.log(`Estimated time: ${remainingTime + 1}s`);
    decoder.push(data, final);
  };

  let previousData = '';
  decoder.ondata = (str, final) => {
    // add the previous leftover to this string
    const data = previousData + str;
    const lines = data.split('\n');
    lines.forEach((line) => {
      try {
        const lineData = JSON.parse(line);
        events = updateEvents(events, lineData);
      } catch (error) {
        console.debug('Unable to parse line, chunk probably ended');
        // save this partial line for next pass
        previousData = line;
      }
    });

    if (final) {
      resolve(events);
    }
  };
  file.start();
});
export default collectAnalytics;
