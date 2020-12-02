'use strict';

function formatOSMType(sType, bExcludeExternal) {
  if (sType === 'N') return 'node';
  if (sType === 'W') return 'way';
  if (sType === 'R') return 'relation';

  if (!bExcludeExternal) return '';

  if (sType === 'T') return 'way';
  if (sType === 'I') return 'way';

  return '';
}

function formatShortOSMType(sType) {
  if (sType === 'node') return 'N';
  if (sType === 'way') return 'W';
  if (sType === 'relation') return 'R';
  return '';
}

function getIcon(aPlace) {
  // equivalent to PHP Nominatim::ClassTypes::getIcon
  // covers 83 of 214 available icon filenames, e.g. transport_roundabout_anticlockwise
  // transport_rental_bicycle or place_of_worship_christian would need more data from
  // the place.
  var aIcons = {
    'boundary:administrative': 'poi_boundary_administrative',
    'place:city': 'poi_place_city',
    'place:town': 'poi_place_town',
    'place:village': 'poi_place_village',
    'place:hamlet': 'poi_place_village',
    'place:suburb': 'poi_place_village',
    'place:locality': 'poi_place_village',
    'place:airport': 'transport_airport2',
    'aeroway:aerodrome': 'transport_airport2',
    'railway:station': 'transport_train_station2',
    'amenity:place_of_worship': 'place_of_worship_unknown3',
    'amenity:pub': 'food_pub',
    'amenity:bar': 'food_bar',
    'amenity:university': 'education_university',
    'tourism:museum': 'tourist_museum',
    'amenity:arts_centre': 'tourist_art_gallery2',
    'tourism:zoo': 'tourist_zoo',
    'tourism:theme_park': 'poi_point_of_interest',
    'tourism:attraction': 'poi_point_of_interest',
    'leisure:golf_course': 'sport_golf',
    'historic:castle': 'tourist_castle',
    'amenity:hospital': 'health_hospital',
    'amenity:school': 'education_school',
    'amenity:theatre': 'tourist_theatre',
    'amenity:library': 'amenity_library',
    'amenity:fire_station': 'amenity_firestation3',
    'amenity:police': 'amenity_police2',
    'amenity:bank': 'money_bank2',
    'amenity:post_office': 'amenity_post_office',
    'tourism:hotel': 'accommodation_hotel2',
    'amenity:cinema': 'tourist_cinema',
    'tourism:artwork': 'tourist_art_gallery2',
    'historic:archaeological_site': 'tourist_archaeological2',
    'amenity:doctors': 'health_doctors',
    'leisure:sports_centre': 'sport_leisure_centre',
    'leisure:swimming_pool': 'sport_swimming_outdoor',
    'shop:supermarket': 'shopping_supermarket',
    'shop:convenience': 'shopping_convenience',
    'amenity:restaurant': 'food_restaurant',
    'amenity:fast_food': 'food_fastfood',
    'amenity:cafe': 'food_cafe',
    'tourism:guest_house': 'accommodation_bed_and_breakfast',
    'amenity:pharmacy': 'health_pharmacy_dispensing',
    'amenity:fuel': 'transport_fuel',
    'natural:peak': 'poi_peak',
    'natural:wood': 'landuse_coniferous_and_deciduous',
    'shop:bicycle': 'shopping_bicycle',
    'shop:clothes': 'shopping_clothes',
    'shop:hairdresser': 'shopping_hairdresser',
    'shop:doityourself': 'shopping_diy',
    'shop:estate_agent': 'shopping_estateagent2',
    'shop:car': 'shopping_car',
    'shop:garden_centre': 'shopping_garden_centre',
    'shop:car_repair': 'shopping_car_repair',
    'shop:bakery': 'shopping_bakery',
    'shop:butcher': 'shopping_butcher',
    'shop:apparel': 'shopping_clothes',
    'shop:laundry': 'shopping_laundrette',
    'shop:beverages': 'shopping_alcohol',
    'shop:alcohol': 'shopping_alcohol',
    'shop:optician': 'health_opticians',
    'shop:chemist': 'health_pharmacy',
    'shop:gallery': 'tourist_art_gallery2',
    'shop:jewelry': 'shopping_jewelry',
    'tourism:information': 'amenity_information',
    'historic:ruins': 'tourist_ruin',
    'amenity:college': 'education_school',
    'historic:monument': 'tourist_monument',
    'historic:memorial': 'tourist_monument',
    'historic:mine': 'poi_mine',
    'tourism:caravan_site': 'accommodation_caravan_park',
    'amenity:bus_station': 'transport_bus_station',
    'amenity:atm': 'money_atm2',
    'tourism:viewpoint': 'tourist_view_point',
    'tourism:guesthouse': 'accommodation_bed_and_breakfast',
    'railway:tram': 'transport_tram_stop',
    'amenity:courthouse': 'amenity_court',
    'amenity:recycling': 'amenity_recycling',
    'amenity:dentist': 'health_dentist',
    'natural:beach': 'tourist_beach',
    'railway:tram_stop': 'transport_tram_stop',
    'amenity:prison': 'amenity_prison',
    'highway:bus_stop': 'transport_bus_stop2'
  };

  var sCategoryPlace = aPlace.category + ':' + aPlace.type;

  return aIcons[sCategoryPlace];
}


Handlebars.registerHelper({
  formatOSMType: function (sType, bExcludeExternal) {
    return formatOSMType(sType, bExcludeExternal);
  },
  shortOSMType: function (sType) {
    return formatShortOSMType(sType);
  },
  // { osm_type: 'R', osm_id: 12345 }
  // <a href="https://www.openstreetmap.org/relation/12345">relation 12345</a
  osmLink: function (aPlace) {
    if (!aPlace.osm_type) return '';
    var sOSMType = formatOSMType(aPlace.osm_type, false);
    if (!sOSMType) return '';

    return new Handlebars.SafeString(
      '<a href="https://www.openstreetmap.org/' + sOSMType + '/' + aPlace.osm_id + '">' + sOSMType + ' ' + aPlace.osm_id + '</a>'
    );
  },
  /* en:London_Borough_of_Redbridge => https://en.wikipedia.org/wiki/London_Borough_of_Redbridge */
  wikipediaLink: function (aPlace) {
    if (!aPlace.calculated_wikipedia) return '';

    var parts = aPlace.calculated_wikipedia.split(':', 2);

    var sTitle = Handlebars.escapeExpression(aPlace.calculated_wikipedia);
    var sLanguage = Handlebars.escapeExpression(parts[0]);
    var sArticle = Handlebars.escapeExpression(parts[1]);

    return new Handlebars.SafeString(
      '<a href="https://' + sLanguage + '.wikipedia.org/wiki/' + sArticle + '" target="_blank">' + sTitle + '</a>'
    );
  },
  // 'details.html?osmtype=R&osmid=2181874&class=boundary'
  detailsURL: function (aFeature) {
    if (!aFeature) return '';

    var sOSMType = aFeature.osm_type;
    if (sOSMType && sOSMType.length !== 1) {
      sOSMType = formatShortOSMType(aFeature.osm_type, false); // node => N
    }
    if (!sOSMType) return '';

    var sURL = 'details.html?osmtype=' + sOSMType + '&osmid=' + aFeature.osm_id;
    if (aFeature.class) {
      sURL = sURL + '&class=' + aFeature.class;
    } else if (aFeature.category) {
      sURL = sURL + '&class=' + aFeature.category;
    }
    return sURL;
  },
  formatPlaceType: function (aPlace) {
    var sOut = aPlace.class + ':' + aPlace.type;
    if (aPlace.type && aPlace.type === 'administrative' && aPlace.place_type) {
      sOut = sOut + ' (' + aPlace.place_type + ')';
    }
    return new Handlebars.SafeString(sOut);
  },
  coverageType: function (aPlace) {
    return (aPlace.isarea ? 'Polygon' : 'Point');
  },
  formatDistance: function (fDistance, bInMeters) {
    if (bInMeters) {
      if (fDistance < 1) return '0';
      var sFormatted = (fDistance >= 1000)
        ? Math.round(fDistance / 1000, 1) + ' km'
        : Math.round(fDistance, 0) + ' m';

      return new Handlebars.SafeString(
        '<abbr class="distance" title="' + fDistance + ' meters">~' + sFormatted + '</abbr>'
      );
    }

    // spheric distance, http://postgis.net/docs/ST_Distance_Spheroid.html
    if (fDistance === 0) return '0';

    return new Handlebars.SafeString(
      '<abbr class="distance" title="spheric distance ' + fDistance + '">~'
        + (Math.round(fDistance * 1000, 4) / 1000)
        + '</abbr>'
    );
  },
  // mark partial tokens (those starting with a space) with a star for readability
  formatKeywordToken: function (sToken) {
    return (sToken[0] === ' ' ? '*' : '') + Handlebars.escapeExpression(sToken);
  },
  // Any over 15 are invalid data in OSM anyway
  formatAdminLevel: function (iLevel) {
    return (iLevel < 15 ? iLevel : '');
  },
  formatMapIcon: function (aPlace) {
    var sIcon = getIcon(aPlace);

    if (!sIcon) return '';

    var title = 'icon for ' + aPlace.category + ' ' + aPlace.type;
    var url = get_config_value('Images_Base_Url') + sIcon + '.p.20.png';

    return new Handlebars.SafeString(
      '<img class="mapicon" src="' + url + '" alt="' + title + '"/>'
    );
  },
  formatLabel: function (aPlace) {
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
  },
  formatAddressRank: function (iRank) {
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
  },
  isAdminBoundary: function (aPlace) {
    return aPlace.category === 'boundary' && aPlace.type === 'administrative';
  },
  tooManyHierarchyLinesWarning: function (aPlace) {
    if (!aPlace.hierarchy) return '';

    var c = Object.keys(aPlace.hierarchy);
    if (c < 500) return '';

    return new Handlebars.SafeString(
      '<p>There are more child objects which are not shown.</p>'
    );
  },
  zoomLevels: function (iSelectedZoom) {
    var aZoomLevels = [
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

    var select = $('<select>');
    var option = jQuery('<option>', { value: '', text: '--' });
    if (typeof (iSelectedZoom) === 'undefined') {
      option.attr('selected', 'selected');
    }
    option.appendTo(select);

    jQuery.each(aZoomLevels, function (i, title) {
      option = jQuery('<option>', { value: i, text: i + ' ' + title });
      if (i === iSelectedZoom) option.attr('selected', 'selected');
      option.appendTo(select);
    });
    return new Handlebars.SafeString(select.html());
  }
});
