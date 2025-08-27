import assert from 'assert';
import { identifyLinkInQuery, formatLabel } from '../../src/lib/helpers.js';

describe('Helpers', function () {

  it('.identifyLinkInQuery', function () {
    assert.equal(identifyLinkInQuery(''), undefined);
    assert.equal(identifyLinkInQuery('http://example.com'), undefined);

    assert.deepStrictEqual(identifyLinkInQuery('https://www.openstreetmap.org/relation/1234#map=11/41.2388/-8.3867'), ['R', 1234]);
    assert.deepStrictEqual(identifyLinkInQuery('n1234'), ['N', 1234]);
    assert.deepStrictEqual(identifyLinkInQuery('W1234'), ['W', 1234]);
    assert.deepStrictEqual(identifyLinkInQuery('R-123'), ['R', -123]);
  });

  it('.formatLabel', function () {
    // not enough data
    assert.equal(formatLabel({}), '');

    // if label set, that becomes the label
    assert.equal(formatLabel({ label: 'A Label' }), 'A Label');

    // type, but nicely formatted
    assert.equal(formatLabel({ category: 'highway', type: 'bus_stop' }), 'Bus stop');

    // type=yes, so we use the category
    assert.equal(formatLabel({ category: 'building', type: 'yes' }), 'Building');
  });
});
