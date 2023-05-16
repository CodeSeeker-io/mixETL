import { randomUUID } from 'crypto';
import { ImportEventsBodyParam } from '@api/mixpaneldevdocs/types';
import { MappingType } from './mapping.js';

type MixpanelEventType = {
  properties: {
    [x: string]: unknown;
    time: number;
    $insert_id: string;
    distinct_id: string;
  };
  event: string;
};

const digest = (data: string[][], map: MappingType) => {
  // Define an empty obejct to serve as a map of indexes
  const hash: { [key: string]: number } = {};

  // Store the header row for reference
  const headerRow = data[0];

  // Iterate over each col in header row, and add its index to the hash map
  headerRow.forEach((col, index) => {
    hash[col] = index;
  });

  // Define an array of events that will be returned
  const events: ImportEventsBodyParam = [];

  // Iterate over all not header rows
  for (let i = 1; i < data.length; i += 1) {
    // Copy the row reference
    const row = data[i];

    // Define the event object with the required fields
    const eventObject: MixpanelEventType = {
      event: row[hash[map.eventName]],
      properties: {
        $insert_id: randomUUID(),
        distinct_id: row[hash[map.distinct_id]],
        time: (map.time !== '' ? Number(row[hash[map.time]]) : Date.now()),
      },
    };

    // Add the custom properties to the event object
    Object.entries(map.custom).forEach(([prop, col]) => {
      eventObject.properties[prop] = row[hash[col]];
    });

    // Push the current event object into the events array
    events.push(eventObject);
  }

  // Return the events array
  return events;
};

export default digest;
