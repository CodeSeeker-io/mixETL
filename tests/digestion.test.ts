/* eslint-disable @typescript-eslint/naming-convention */
import { randomUUID } from 'crypto';
import * as utils from './utils';

const data = [
  ['EventName', 'hasDeclaredMajor', 'Name', 'studentId'],
  ['paidTuition', 'true', 'Jane Smith', 'JaneSmith1050ee42'],
  ['graduated', 'true', 'Mary Doe', 'MaryDoe1060ee42'],
  ['enrolled', 'false', 'Jon Smythe', 'JonSmythe1070ee42'],
];

const mapping = {
  event: 'EventName',
  distinct_id: 'studentId',
  time: '',
  custom: {
    custom1: 'hasDeclaredMajor',
    custom2: 'Name',
  },
};

// To be replaced with const declaration in describe block, store result of calling transform func
const transformed = {
  events: [
    {
      event: 'paidTuition',
      properties: {
        custom1: true, // from hasDeclaredMajor
        custom2: 'Jane Smith', // from Name
        time: '1670003123567',
        distinct_id: 'JaneSmith1050ee42',
        $insert_id: '8d45bbb4-c4e9-4a3a-ab22-5935243a94db',
      },
    },
    {
      event: 'graduated',
      properties: {
        custom1: true,
        custom2: 'Mary Doe',
        time: '1670003122567',
        distinct_id: 'MaryDoe1060ee42',
        $insert_id: '02916bdf-4b4e-4446-a1d7-32f8aceb5535',
      },
    },
    {
      event: 'enrolled',
      properties: {
        custom1: false,
        custom2: 'Jon Smyth',
        time: '1670003122267',
        distinct_id: 'JonSmythe1070ee42',
        $insert_id: '24c6f952-730a-420f-bace-0c79bccd52a6',
      },
    },
  ],
};

describe('transforms ingested data', () => {
  describe('creates ingestion object with required properties', () => {
    // const transformed = digest(data, mapping);

    // Store the event objects from the value of events key
    const eventArray = transformed.events;

    test('creates object with events property', () => {
      // Object has correct property name
      expect(transformed).toHaveProperty('events');

      // Events value should be an Array
      expect(Array.isArray(transformed.events)).toBe(true);

      // Events value should have the correct length
      expect(transformed.events).toHaveLength(data.length - 1);
    });

    test('creates event objects with required properties', () => {
      // Each properties object on the event objects should have the required keys
      eventArray.forEach(({ properties }) => {
        expect(properties).toHaveProperty('time');
        expect(properties).toHaveProperty('distinct_id');
        expect(properties).toHaveProperty('$insert_id');
      });
    });

    test('stores correct values for required properties', () => {
      // Get the properties object of every event object
      eventArray.forEach(({ properties }) => {
        // Store the values for keys to be tested
        const { $insert_id, time } = properties;

        // $insert_id value should be a valid UUID
        expect(utils.isValidUUID($insert_id)).toBe(true);

        /** Note: time value should be valid according to destination
         * @see https://developer.mixpanel.com/reference/import-events#propertiestime
        */
        expect(utils.isValidTimestamp(time)).toBe(true);
      });
    });

    test('stores values from mapping', () => {
      // Store the index of the distinct_id column in the header row
      const distinct_idIndex = data[0].indexOf(mapping.distinct_id);

      // Every properties object on the event objects should have correct value from data source
      eventArray.forEach(({ properties }, eventIndex) => {
        // Save the distinct_id of current property object for readibility
        const { distinct_id } = properties;

        // Store the data row that will be used in test for readibility
        const row = data[eventIndex + 1];

        // The distinct_id value should correspond to value in data rows (ignoring header row)
        expect(distinct_id).toBe(row[distinct_idIndex]);
      });
    });
  });

  describe('creates objects with timestamps based on mapping', () => {
    // Update mapping to contain a custom time column string
    const mappingWithTime = { ...mapping, time: 'timeColumn' };

    // Update data to include time values
    const dataWithTime = data.map((row, rowIndex) => {
      // Add the string 'timeColumn' to the header row
      if (rowIndex === 0) row.push('timeColumn');

      // Add a valid timestamp value to the non-header rows
      else row.push('1670003123567');

      // Return the updated row
      return row;
    });

    // const transformed = digest(dataWithTime, mappingWithTime);

    // Store the event objects from the value of events key
    const eventArray = transformed.events;

    test('stores time values from data when provided', () => {
      // Every properties object on the event objects should have correct value from data source
      eventArray.forEach(({ properties }) => {
        // Save the time of current property object for readibility
        const { time } = properties;

        // The time value should correspond to value in data rows (ignoring header row)
        expect(time).toBe('1670003123567');
      });
    });

    test('creates event objects with custom properties', () => {
      // Store a map for the user added custom properties (from mapping object)
      const customPropertiesMap: { [key:string]: number } = {};

      // Iterate over the key value pairs under the custom key (from mapping object)
      Object.entries(mapping.custom).forEach(([destinationName, sourceName]) => {
        // Store the index of the data column that corresponds to the custom property
        const sourceIndex = data[0].indexOf(sourceName);

        // Add the custom property and associated data column index to the map object
        customPropertiesMap[destinationName] = sourceIndex;
      });

      eventArray.forEach(({ properties }, eventIndex) => {
        // Store a type safe version of the properties object
        const safeProperties = properties as { [key:string]: boolean | number | string };

        // Store the data row that will be used in test for readibility
        const row = data[eventIndex + 1];

        // Iterate over custom properties to test that correct values from data rows are stored
        Object.entries(customPropertiesMap).forEach(([destinationName, sourceIndex]) => {
          // Value stored on transformed object should have correct value for custom property
          expect(safeProperties[destinationName]).toBe(row[sourceIndex]);
        });
      });
    });
  });
});
