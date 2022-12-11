import escapeHtml from 'escape-html';

export function formatOSMType(sType, bExcludeExternal) {
  if (sType === 'N') return 'node';
  if (sType === 'W') return 'way';
  if (sType === 'R') return 'relation';

  if (!bExcludeExternal) return '';

  if (sType === 'T') return 'way';
  if (sType === 'I') return 'way';

  return '';
}

// https://www.openstreetmap.org/relation/123 => ['R', 123]
// w123 => ['W', 123]
export function identifyLinkInQuery(query) {
  if (!query) return undefined;
  const m = query.match(/\/(relation|way|node)\/(\d+)/) || query.match(/^([nwr])(\d+)$/i);
  if (!m) return undefined;
  return [m[1][0].toUpperCase(), Number(m[2])];
}

export function osmLink(aPlace) {
  if (!aPlace.osm_type) return '';
  var sOSMType = formatOSMType(aPlace.osm_type, false);
  if (!sOSMType) return '';

  return '<a href="https://www.openstreetmap.org/' + sOSMType + '/' + aPlace.osm_id + '">' + sOSMType + ' ' + aPlace.osm_id + '</a>';
}

export function formatLabel(aPlace) {
  if (aPlace.label) return aPlace.label;

  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  if (aPlace.type && aPlace.type === 'yes' && aPlace.category) {
    return capitalize(aPlace.category.replace(/_/g, ' '));
  }
  if (aPlace.type) {
    return capitalize(aPlace.type.replace(/_/g, ' '));
  }
  return '';
}

/* en:London_Borough_of_Redbridge => https://en.wikipedia.org/wiki/London_Borough_of_Redbridge */
export function wikipediaLink(aPlace) {
  if (!aPlace.calculated_wikipedia) return '';

  var parts = aPlace.calculated_wikipedia.split(':', 2);

  var sTitle = escapeHtml(aPlace.calculated_wikipedia);
  var sLanguage = escapeHtml(parts[0]);
  var sArticle = escapeHtml(parts[1]);

  return '<a href="https://' + sLanguage + '.wikipedia.org/wiki/' + sArticle + '" target="_blank">' + sTitle + '</a>';
}

export function coverageType(aPlace) {
  return (aPlace.isarea ? 'Polygon' : 'Point');
}

export function isAdminBoundary(aPlace) {
  return aPlace.category === 'boundary' && aPlace.type === 'administrative';
}

export function formatAddressRank(iRank) {
  if (iRank < 4) return 'other';
  if (iRank < 6) return 'country';
  if (iRank < 8) return 'region';
  if (iRank < 10) return 'state';
  if (iRank < 12) return 'state district';
  if (iRank < 14) return 'county';
  if (iRank < 16) return 'municipality';
  if (iRank < 18) return 'city / town / village';
  if (iRank < 20) return 'city / village district';
  if (iRank < 22) return 'suburb / hamlet';
  if (iRank < 24) return 'neighbourhood';
  if (iRank < 26) return 'city block / square';
  if (iRank === 26) return 'major street';
  if (iRank === 27) return 'minory street / path';
  if (iRank <= 30) return 'house / building';
  return 'other';
}

export function formatPlaceType(aPlace) {
  var sOut = aPlace.class + ':' + aPlace.type;
  if (aPlace.type && aPlace.type === 'administrative' && aPlace.place_type) {
    sOut = sOut + ' (' + aPlace.place_type + ')';
  }
  return escapeHtml(sOut);
}

// Any over 15 are invalid data in OSM anyway
export function formatAdminLevel(iLevel) {
  return (iLevel && iLevel < 15 ? iLevel : '');
}

export function formatDistance(fDistance, bInMeters) {
  if (bInMeters) {
    if (fDistance < 1) return '0';
    var sFormatted = (fDistance >= 1000)
      ? Math.round(fDistance / 1000, 1) + ' km'
      : Math.round(fDistance, 0) + ' m';

    return '<abbr class="distance" title="' + fDistance + ' meters">~' + sFormatted + '</abbr>';
  }

  // spheric distance, http://postgis.net/docs/ST_Distance_Spheroid.html
  if (fDistance === 0) return '0';

  return '<abbr class="distance" title="spheric distance ' + fDistance + '">~'
      + (Math.round(fDistance * 1000, 4) / 1000)
      + '</abbr>';
}

// mark partial tokens (those starting with a space) with a star for readability
export function formatKeywordToken(sToken) {
  return (sToken[0] === ' ' ? '*' : '') + escapeHtml(sToken);
}

export function zoomLevels() {
  const aZoomLevels = [
    /*  0 */ 'Continent / Sea',
    /*  1 */ '',
    /*  2 */ '',
    /*  3 */ 'Country',
    /*  4 */ '',
    /*  5 */ 'State',
    /*  6 */ 'Region',
    /*  7 */ '',
    /*  8 */ 'County',
    /*  9 */ '',
    /* 10 */ 'City',
    /* 11 */ '',
    /* 12 */ 'Town / Village',
    /* 13 */ '',
    /* 14 */ 'Suburb',
    /* 15 */ '',
    /* 16 */ 'Street',
    /* 17 */ '',
    /* 18 */ 'Building',
    /* 19 */ '',
    /* 20 */ '',
    /* 21 */ ''
  ];
  return aZoomLevels;
}
