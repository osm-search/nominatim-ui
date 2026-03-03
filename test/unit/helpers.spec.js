import { test, expect } from '@playwright/test';
import { identifyLinkInQuery, formatLabel } from '../../src/lib/helpers.js';

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
