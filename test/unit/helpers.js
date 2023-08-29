import assert from 'assert';
import { identifyLinkInQuery, formatLabel, wikipediaLink } from '../../src/lib/helpers.js';

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

  it('.wikipediaLink', function () {
    assert.equal(
      wikipediaLink({}),
      ''
    );

    assert.equal(
      wikipediaLink({ calculated_wikipedia: 'de:Brandenburg Gate' }),
      '<a href="https://de.wikipedia.org/wiki/Brandenburg Gate" target="_blank">de:Brandenburg Gate</a>'
    );

    // title includes HTML
    assert.equal(
      wikipediaLink({ calculated_wikipedia: 'en:Slug & Lattuce' }),
      '<a href="https://en.wikipedia.org/wiki/Slug &amp; Lattuce" target="_blank">en:Slug &amp; Lattuce</a>'
    );
  });
});
