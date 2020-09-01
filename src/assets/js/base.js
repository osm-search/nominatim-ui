'use strict';

var map;
var last_click_latlng;

// *********************************************************
// DEFAULTS
// *********************************************************

var Nominatim_Config_Defaults = {
  Nominatim_API_Endpoint: 'http://localhost/nominatim/',
  Images_Base_Url: '/mapicons/',
  Search_AreaPolygons: 1,
  Reverse_Default_Search_Zoom: 18,
  Map_Default_Lat: 20.0,
  Map_Default_Lon: 0.0,
  Map_Default_Zoom: 2,
  Map_Tile_URL: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
  Map_Tile_Attribution: '<a href="https://osm.org/copyright">OpenStreetMap contributors</a>'
};

// *********************************************************
// HELPERS
// *********************************************************


function get_config_value(str, default_val) {
  var value = ((typeof Nominatim_Config !== 'undefined')
               && (typeof Nominatim_Config[str] !== 'undefined'))
    ? Nominatim_Config[str]
    : Nominatim_Config_Defaults[str];
  return (typeof value !== 'undefined' ? value : default_val);
}

function parse_and_normalize_geojson_string(part) {
  // normalize places the geometry into a featurecollection, similar to
  // https://github.com/mapbox/geojson-normalize
  var parsed_geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: part,
        properties: {}
      }
    ]
  };
  return parsed_geojson;
}

function map_link_to_osm() {
  var zoom = map.getZoom();
  var lat = map.getCenter().lat;
  var lng = map.getCenter().lng;
  return 'https://openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lng;
}

function map_viewbox_as_string() {
  var bounds = map.getBounds();
  var west = bounds.getWest();
  var east = bounds.getEast();

  if ((east - west) >= 360) { // covers more than whole planet
    west = map.getCenter().lng - 179.999;
    east = map.getCenter().lng + 179.999;
  }
  east = L.latLng(77, east).wrap().lng;
  west = L.latLng(77, west).wrap().lng;

  return [
    west.toFixed(5), // left
    bounds.getNorth().toFixed(5), // top
    east.toFixed(5), // right
    bounds.getSouth().toFixed(5) // bottom
  ].join(',');
}


// *********************************************************
// PAGE HELPERS
// *********************************************************

function generate_full_api_url(endpoint_name, params) {
  //
  // `&a=&b=&c=1` => '&c=1'
  var param_names = Object.keys(params);
  for (var i = 0; i < param_names.length; i += 1) {
    var val = params[param_names[i]];
    if (typeof (val) === 'undefined' || val === '' || val === null) {
      delete params[param_names[i]];
    }
  }

  var api_url = get_config_value('Nominatim_API_Endpoint') + endpoint_name + '.php?'
                  + $.param(params);
  return api_url;
}

function update_last_updated(endpoint_name, params) {
  if (endpoint_name === 'status') return;

  var api_url = generate_full_api_url(endpoint_name, params);
  $('#last-updated').show();

  $('#api-request a').attr('href', api_url);
  $('#api-request').show();

  if (endpoint_name === 'search' || endpoint_name === 'reverse') {
    $('#api-request-debug a').attr('href', api_url + '&debug=1');
    $('#api-request-debug').show();
  } else {
    $('#api-request-debug').hide();
  }
}

function fetch_from_api(endpoint_name, params, callback) {
  var api_url = generate_full_api_url(endpoint_name, params);
  $.get(api_url, function (data) {
    if (endpoint_name !== 'status') {
      update_last_updated(endpoint_name, params);
    }
    callback(data);
  });
}

function update_data_date() {
  fetch_from_api('status', { format: 'json' }, function (data) {
    $('#last-updated').show();
    $('#data-date').text(data.data_updated);
  });
}

function render_template(el, template_name, page_context) {
  var template_source = $('#' + template_name).text();
  var template = Handlebars.compile(template_source);
  var html = template(page_context);
  el.html(html);
}

function update_html_title(title) {
  var prefix = '';
  if (title && title.length > 1) {
    prefix = title + ' | ';
  }
  $('head title').text(prefix + 'OpenStreetMap Nominatim');
}

function show_error(html) {
  $('#error-overlay').html(html).show();
}

function hide_error() {
  $('#error-overlay').empty().hide();
}


jQuery(document).ready(function () {
  hide_error();

  $('#last-updated').hide();

  $(document).ajaxStart(function () {
    $('#loading').fadeIn('fast');
  }).ajaxComplete(function () {
    $('#loading').fadeOut('fast');
  }).ajaxError(function (event, jqXHR, ajaxSettings/* , thrownError */) {
    // console.log(thrownError);
    // console.log(ajaxSettings);
    var url = ajaxSettings.url;
    show_error('Error fetching results from <a href="' + url + '">' + url + '</a>');
  });
});
