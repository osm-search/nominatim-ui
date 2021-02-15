module.exports.formatOSMType = formatOSMType;
module.exports.osmLink = osmLink;
module.exports.formatLabel = formatLabel;
module.exports.wikipediaLink = wikipediaLink;
module.exports.coverageType = coverageType;
module.exports.isAdminBoundary = isAdminBoundary;
module.exports.formatAddressRank = formatAddressRank;
module.exports.formatPlaceType = formatPlaceType;
module.exports.formatAdminLevel = formatAdminLevel;
module.exports.formatDistance = formatDistance;
module.exports.formatKeywordToken = formatKeywordToken;
module.exports.zoomLevels = zoomLevels;

const escapeHtml = require('escape-html');

function formatOSMType(sType, bExcludeExternal) {
  if (sType === 'N') return 'node';
  if (sType === 'W') return 'way';
  if (sType === 'R') return 'relation';

  if (!bExcludeExternal) return '';

  if (sType === 'T') return 'way';
  if (sType === 'I') return 'way';

  return '';
}

function osmLink(aPlace) {
  if (!aPlace.osm_type) return '';
  var sOSMType = formatOSMType(aPlace.osm_type, false);
  if (!sOSMType) return '';

  return '<a href="https://www.openstreetmap.org/' + sOSMType + '/' + aPlace.osm_id + '">' + sOSMType + ' ' + aPlace.osm_id + '</a>';
}

function formatLabel(aPlace) {
  if (aPlace.label) return aPlace.label;

  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  if (aPlace.type && aPlace.type === 'yes' && aPlace.class) {
    return capitalize(aPlace.class.replace(/_/g, ' '));
  }
  if (aPlace.type) {
    return capitalize(aPlace.type.replace(/_/g, ' '));
  }
  return '';
}

/* en:London_Borough_of_Redbridge => https://en.wikipedia.org/wiki/London_Borough_of_Redbridge */
function wikipediaLink(aPlace) {
  if (!aPlace.calculated_wikipedia) return '';

  var parts = aPlace.calculated_wikipedia.split(':', 2);

  var sTitle = escapeHtml(aPlace.calculated_wikipedia);
  var sLanguage = escapeHtml(parts[0]);
  var sArticle = escapeHtml(parts[1]);

  return '<a href="https://' + sLanguage + '.wikipedia.org/wiki/' + sArticle + '" target="_blank">' + sTitle + '</a>';
}

function coverageType(aPlace) {
  return (aPlace.isarea ? 'Polygon' : 'Point');
}

function isAdminBoundary(aPlace) {
  return aPlace.category === 'boundary' && aPlace.type === 'administrative';
}

function formatAddressRank(iRank) {
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

function formatPlaceType(aPlace) {
  var sOut = aPlace.class + ':' + aPlace.type;
  if (aPlace.type && aPlace.type === 'administrative' && aPlace.place_type) {
    sOut = sOut + ' (' + aPlace.place_type + ')';
  }
  return escapeHtml(sOut);
}

// Any over 15 are invalid data in OSM anyway
function formatAdminLevel(iLevel) {
  return (iLevel && iLevel < 15 ? iLevel : '');
}

function formatDistance(fDistance, bInMeters) {
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
function formatKeywordToken(sToken) {
  return (sToken[0] === ' ' ? '*' : '') + escapeHtml(sToken);
}

function zoomLevels() {
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
