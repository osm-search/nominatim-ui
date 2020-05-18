'use strict';

var map;
var last_click_latlng;


// *********************************************************
// HELPERS
// *********************************************************

function get_config_value(str, default_val) {
  return (typeof Nominatim_Config[str] !== 'undefined' ? Nominatim_Config[str] : default_val);
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

function fetch_from_api(endpoint_name, params, callback) {
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
  if (endpoint_name !== 'status') {
    $('#api-request-link').attr('href', api_url);
  }
  $.get(api_url, function (data) {
    callback(data);
  });
}

function update_data_date() {
  fetch_from_api('status', { format: 'json' }, function (data) {
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


$(document).ajaxError(function (event, jqXHR, ajaxSettings/* , thrownError */) {
  // console.log(thrownError);
  // console.log(ajaxSettings);
  var url = ajaxSettings.url;
  show_error('Error fetching results from <a href="' + url + '">' + url + '</a>');
});


jQuery(document).ready(function () {
  hide_error();
});
