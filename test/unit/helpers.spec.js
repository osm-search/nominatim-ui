import { test, expect } from '@playwright/test';
import {
  identifyLinkInQuery, formatLabel, formatShortOSMType, formatOSMType
} from '../../src/lib/helpers.js';

test.describe('Helpers', () => {

  test('.identifyLinkInQuery', () => {
    expect(identifyLinkInQuery('')).toBeUndefined();
    expect(identifyLinkInQuery('http://example.com')).toBeUndefined();

    expect(identifyLinkInQuery(
      'https://www.openstreetmap.org/relation/1234#map=11/41.2388/-8.3867'
    )).toEqual(['R', 1234]);
    expect(identifyLinkInQuery('n1234')).toEqual(['N', 1234]);
    expect(identifyLinkInQuery('W1234')).toEqual(['W', 1234]);
    expect(identifyLinkInQuery('R-123')).toEqual(['R', -123]);
  });

  // N => node
  test('.formatOSMType', () => {
    expect(formatOSMType('N')).toBe('node');
    expect(formatOSMType('W')).toBe('way');
    expect(formatOSMType('R')).toBe('relation');
    expect(formatOSMType('T')).toBe('');
    expect(formatOSMType('T', true)).toBe('way');
    expect(formatOSMType('I', true)).toBe('way');
    expect(formatOSMType('X')).toBe('');
    expect(formatOSMType('X', true)).toBe('');
  });

  // node => N
  test('.formatShortOSMType', () => {
    expect(formatShortOSMType('node')).toBe('N');
    expect(formatShortOSMType('way')).toBe('W');
    expect(formatShortOSMType('relation')).toBe('R');
    expect(formatShortOSMType('N')).toBe('N');
    expect(formatShortOSMType('W')).toBe('W');
    expect(formatShortOSMType('R')).toBe('R');
    expect(formatShortOSMType('')).toBe('');
    expect(formatShortOSMType(undefined)).toBe('');
  });

  test('.formatLabel', () => {
    // not enough data
    expect(formatLabel({})).toBe('');

    // if label set, that becomes the label
    expect(formatLabel({ label: 'A Label' })).toBe('A Label');

    // type, but nicely formatted
    expect(formatLabel({ category: 'highway', type: 'bus_stop' })).toBe('Bus stop');

    // type=yes, so we use the category
    expect(formatLabel({ category: 'building', type: 'yes' })).toBe('Building');
  });
});
