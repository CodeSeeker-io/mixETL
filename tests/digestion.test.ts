import { randomUUID } from 'crypto';
import * as utils from './utils';

const { data } = {
  data: [
    ['EventName', 'hasDeclaredMajor', 'Name', 'studentId'],
    ['paidTuition', 'true', 'Jane Smith', 'JaneSmith1050ee42'],
    ['graduated', 'true', 'Mary Doe', 'MaryDoe1060ee42'],
    ['enrolled', 'false', 'Jon Smythe', 'JonSmythe1070ee42'],
  ],
};

const mapping = {
  event: 'EventName',
  distinct_id: 'studentId',
  time: '',
  custom: [
    'hasDeclaredMajor',
    'Name',
  ],
};

const transformed = {
  events: [
    {
      event: 'paidTuition',
      properties: {
        hasDeclaredMajor: true,
        name: 'Jane Smith',
        time: '1670003123567',
        distinct_id: 'JaneSmith1050ee42',
        $insert_id: '8d45bbb4-c4e9-4a3a-ab22-5935243a94db',
      },
    },
    {
      event: 'graduated',
      properties: {
        hasDeclaredMajor: true,
        name: 'Mary Doe',
        time: '1670003122567',
        distinct_id: 'MaryDoe1060ee42',
        $insert_id: '02916bdf-4b4e-4446-a1d7-32f8aceb5535',
      },
    },
    {
      event: 'enrolled',
      properties: {
        hasDeclaredMajor: false,
        name: 'Jon Smyth',
        time: '1670003122267',
        distinct_id: 'JonSmythe1070ee42',
        $insert_id: '24c6f952-730a-420f-bace-0c79bccd52a6',
      },
    },
  ],
};

describe('transforms ingested data', () => {
  describe('creates ingestion object with required properties', () => {
    it('creates object with events property', () => {
      expect(transformed).toHaveProperty('events');
      expect(Array.isArray(transformed.events)).toBe(true);
    });
    it('creates event objects with required properties', () => {
      const eventArray = transformed.events;
      eventArray.forEach(({ properties }) => {
        expect(properties).toHaveProperty('time');
        expect(properties).toHaveProperty('distinct_id');
        expect(properties).toHaveProperty('$insert_id');
      });
    });
    it('stores correct values for required properties', () => {
      const eventArray = transformed.events;
      eventArray.forEach(({ properties }) => {
        const { $insert_id, time } = properties;
        expect(utils.isValidUUID($insert_id)).toBe(true);
        expect(utils.isValidTimestamp(time)).toBe(true);
      });
    });
    it('stores values from mapping', () => {
      const eventArray = transformed.events;
      const distinct_idIndex = data[0].indexOf(mapping.distinct_id);
      eventArray.forEach(({ properties }, index) => {
        const { distinct_id } = properties;
        expect(distinct_id).toBe(data[index + 1][distinct_idIndex]);
      });
    });
  });
  describe('creates objects with timestamps based on mapping', () => {
    const mappedTime = { ...mapping, time: 'timeColumn' };
    const dataWithTime = data.map((row, index) => {
      if (index === 0) row.push('timeColumn');
      else row.push('1670003123567');
      return row;
    });
    it('stores timestamp as now if none in mapping', () => {
      const eventArray = transformed.events;
      const customProperties = data[0].slice(1);

      eventArray.forEach(({ properties }) => {
        customProperties.forEach((property) => {
          expect(properties).toHaveProperty(property);
        });
      });
    })
  })
  describe('creates objects with custom properties', () => {
    it('creates event objects with custom properties', () => {
      const eventArray = transformed.events;
      const customProperties = data[0].slice(1);

      eventArray.forEach(({ properties }) => {
        customProperties.forEach((property) => {
          expect(properties).toHaveProperty(property);
        });
      });
    })
  })
})
