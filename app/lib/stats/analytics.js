import { DecodeUTF8 } from 'fflate';

import { dataEventTypes, eventTypes } from '../constants';

const updateEvents = (events, event) => {
  const updatedEvents = { ...events };
  const type = event.event_type;

  const eventTypeKey = Object.keys(eventTypes).find((k) => eventTypes[k] === type);
  if (!eventTypeKey) {
    // check for data event types (that are not handled as counters)
    for (const [key, field] of Object.entries(dataEventTypes)) {
      if (
        event[field]
        && (!updatedEvents[key] || new Date(event.day_pt) > new Date(updatedEvents[key].day_pt))
      ) {
        // update this data event type if the field exists and day_pt is later than the currently stored one
        updatedEvents[key] = event;
        break;
      }
    }

    return updatedEvents;
  }

  updatedEvents[eventTypeKey] += 1;
  return updatedEvents;
};

const updateCountries = (events, event) => {
  const updatedEvents = { ...events };
  const country = event.country_code;
  if (!country || country === `null`) {
    return updatedEvents;
  }

  if (!updatedEvents.countries) {
    updatedEvents.countries = [];
  }

  const countryAlreadyExists = updatedEvents.countries.find((countryInStats) => countryInStats === country);
  if (!countryAlreadyExists) {
    debugger;
    updatedEvents.countries.push(country);
  }
  return updatedEvents;
}

export const collectAnalytics = (files) => new Promise((resolve) => {
  let file = files.find((f) => /activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(f.name));
  if (!file) {
    // backup is /modeling - /activity only exists with the right privacy settings
    file = files.find((f) => /activity\/modeling\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(f.name));
    if (!file) {
      // last backup is /tns
      file = files.find((f) => /activity\/tns\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(f.name));
      if (!file) {
        resolve({});
        return;
      }
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
        events = updateCountries(events, lineData);
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
