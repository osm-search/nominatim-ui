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
  return 'https://openstreetmap.org/#map=' + map.getZoom() + '/' + map.getCenter().lat + '/' + map.getCenter().lng;
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
  // `&a=&b=&c=1` => '&c='
  for (var k in params) {
    if (typeof (params[k]) === 'undefined' || params[k] === '' || params[k] === null) delete params[k];
  }

  var api_url = get_config_value('Nominatim_API_Endpoint') + endpoint_name + '.php?' + $.param(params);
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

function show_error(html) {
  $('#error-overlay').html(html).show();
}

function hide_error() {
  $('#error-overlay').empty().hide();
}


$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
  // console.log(thrownError);
  // console.log(ajaxSettings);
  show_error('Error fetching results from <a href="' + ajaxSettings.url + '">' + ajaxSettings.url + '</a>');
});


jQuery(document).ready(function () {
  hide_error();
});
// *********************************************************
// DETAILS PAGE
// *********************************************************


function init_map_on_detail_page(lat, lon, geojson) {
  map = new L.map('map', {
    // center: [nominatim_map_init.lat, nominatim_map_init.lon],
    // zoom:   nominatim_map_init.zoom,
    attributionControl: (get_config_value('Map_Tile_Attribution') && get_config_value('Map_Tile_Attribution').length),
    scrollWheelZoom: true, // !L.Browser.touch,
    touchZoom: false,
  });

  L.tileLayer(get_config_value('Map_Tile_URL'), {
    // moved to footer
    attribution: (get_config_value('Map_Tile_Attribution') || null) // '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var layerGroup = new L.layerGroup().addTo(map);

  var circle = L.circleMarker([lat, lon], {
    radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75
  });
  map.addLayer(circle);

  if (geojson) {
    var geojson_layer = L.geoJson(
      // https://leafletjs.com/reference-1.0.3.html#path-option
      parse_and_normalize_geojson_string(geojson),
      {
        style: function (feature) {
          return { interactive: false, color: 'blue' };
        }
      }
    );
    map.addLayer(geojson_layer);
    map.fitBounds(geojson_layer.getBounds());
  } else {
    map.setView([lat, lon], 10);
  }

  var osm2 = new L.TileLayer(get_config_value('Map_Tile_URL'), { minZoom: 0, maxZoom: 13, attribution: (get_config_value('Map_Tile_Attribution') || null) });
  var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);
}


jQuery(document).ready(function () {
  if (!$('#details-page').length) { return; }

  var search_params = new URLSearchParams(location.search);
  // var place_id = search_params.get('place_id');

  var api_request_params = {
    place_id: search_params.get('place_id'),
    osmtype: search_params.get('osmtype'),
    osmid: search_params.get('osmid'),
    keywords: search_params.get('keywords'),
    addressdetails: 1,
    hierarchy: (search_params.get('hierarchy') === '1' ? 1 : 0),
    group_hierarchy: 1,
    polygon_geojson: 1,
    format: 'json'
  };

  if (api_request_params.place_id || (api_request_params.osmtype && api_request_params.osmid)) {
    fetch_from_api('details', api_request_params, function (aFeature) {
      var context = { aPlace: aFeature, base_url: location.search };

      render_template($('main'), 'detailspage-template', context);

      update_data_date();

      var lat = aFeature.centroid.coordinates[1];
      var lon = aFeature.centroid.coordinates[0];
      init_map_on_detail_page(lat, lon, aFeature.geometry);
    });
  } else {
    render_template($('main'), 'detailspage-index-template');
  }

  $('#form-by-type-and-id,#form-by-osm-url').on('submit', function (e) {
    e.preventDefault();

    var val = $(this).find('input[type=edit]').val();
    var matches = val.match(/^\s*([NWR])(\d+)\s*$/i);

    if (!matches) {
      matches = val.match(/\/(relation|way|node)\/(\d+)\s*$/);
    }

    if (matches) {
      $(this).find('input[name=osmtype]').val(matches[1].charAt(0).toUpperCase());
      $(this).find('input[name=osmid]').val(matches[2]);
      $(this).get(0).submit();
    } else {
      alert('invalid input');
    }
  });
});

// *********************************************************
// FORWARD/REVERSE SEARCH PAGE
// *********************************************************


function display_map_position(mouse_lat_lng) {
  //
  if (mouse_lat_lng) {
    mouse_lat_lng = map.wrapLatLng(mouse_lat_lng);
  }

  html_mouse = 'mouse position ' + (mouse_lat_lng ? [mouse_lat_lng.lat.toFixed(5), mouse_lat_lng.lng.toFixed(5)].join(',') : '-');
  html_click = 'last click: ' + (last_click_latlng ? [last_click_latlng.lat.toFixed(5), last_click_latlng.lng.toFixed(5)].join(',') : '-');

  html_center = 'map center: '
    + map.getCenter().lat.toFixed(5) + ',' + map.getCenter().lng.toFixed(5)
    + ' <a target="_blank" href="' + map_link_to_osm() + '">view on osm.org</a>';

  html_zoom = 'map zoom: ' + map.getZoom();

  html_viewbox = 'viewbox: ' + map_viewbox_as_string();

  $('#map-position-inner').html([html_center, html_zoom, html_viewbox, html_click, html_mouse].join('<br/>'));

  var center_lat_lng = map.wrapLatLng(map.getCenter());
  var reverse_params = {
    lat: center_lat_lng.lat.toFixed(5),
    lon: center_lat_lng.lng.toFixed(5)
    // zoom: 2,
    // format: 'html'
  };
  $('#switch-to-reverse').attr('href', 'reverse.html?' + $.param(reverse_params));

  $('input#use_viewbox').trigger('change');
}

function init_map_on_search_page(is_reverse_search, nominatim_results, request_lat, request_lon, init_zoom) {
  //
  map = new L.map('map', {
    // center: [nominatim_map_init.lat, nominatim_map_init.lon],
    // zoom:   nominatim_map_init.zoom,
    attributionControl: (get_config_value('Map_Tile_Attribution') && get_config_value('Map_Tile_Attribution').length),
    scrollWheelZoom: true, // !L.Browser.touch,
    touchZoom: false,
  });


  L.tileLayer(get_config_value('Map_Tile_URL'), {
    // moved to footer
    attribution: (get_config_value('Map_Tile_Attribution') || null ) // '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // console.log(Nominatim_Config);

  map.setView([request_lat, request_lon], init_zoom);

  var osm2 = new L.TileLayer(get_config_value('Map_Tile_URL'), { minZoom: 0, maxZoom: 13, attribution: (get_config_value('Map_Tile_Attribution') || null ) });
  new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

  if (is_reverse_search) {
    // We don't need a marker, but an L.circle instance changes radius once you zoom in/out
    var cm = L.circleMarker(
      [request_lat, request_lon],
      {
        radius: 5,
        weight: 2,
        fillColor: '#ff7800',
        color: 'red',
        opacity: 0.75,
        zIndexOffset: 100,
        clickable: false
      }
    );
    cm.addTo(map);
  } else {
    var search_params = new URLSearchParams(location.search);
    var viewbox = search_params.get('viewbox');
    if (viewbox) {
      var coords = viewbox.split(','); // <x1>,<y1>,<x2>,<y2>
      var bounds = L.latLngBounds([coords[1], coords[0]], [coords[3], coords[2]]);
      L.rectangle(bounds, {color: "#69d53e", weight: 3, dashArray: '5 5', opacity: 0.8, fill: false}).addTo(map);
    }
  }

  var MapPositionControl = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function (/* map */) {
      var container = L.DomUtil.create('div', 'my-custom-control');

      $(container).text('show map bounds').addClass('leaflet-bar btn btn-sm btn-default').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#map-position').show();
        $(container).hide();
      });
      $('#map-position-close a').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#map-position').hide();
        $(container).show();
      });

      return container;
    }
  });

  map.addControl(new MapPositionControl());





  function update_viewbox_field() {
    // hidden HTML field
    $('input[name=viewbox]').val($('input#use_viewbox').prop('checked') ? map_viewbox_as_string() : '');
  }

  map.on('move', function () {
    display_map_position();
    update_viewbox_field();
  });

  map.on('mousemove', function (e) {
    display_map_position(e.latlng);
  });

  map.on('click', function (e) {
    last_click_latlng = e.latlng;
    display_map_position();
  });

  map.on('load', function () {
    display_map_position();
  });

  $('input#use_viewbox').on('change', function () {
    update_viewbox_field();
  });




  function get_result_element(position) {
    return $('.result').eq(position);
  }
  function marker_for_result(result) {
    return L.marker([result.lat, result.lon], { riseOnHover: true, title: result.name });
  }
  function circle_for_result(result) {
    var cm_style = {
      radius: 10,
      weight: 2,
      fillColor: '#ff7800',
      color: 'blue',
      opacity: 0.75,
      clickable: !is_reverse_search
    };
    return L.circleMarker([result.lat, result.lon], cm_style);
  }

  var layerGroup = new L.layerGroup().addTo(map);

  function highlight_result(position, bool_focus) {
    var result = nominatim_results[position];
    if (!result) { return; }
    var result_el = get_result_element(position);

    $('.result').removeClass('highlight');
    result_el.addClass('highlight');

    layerGroup.clearLayers();

    if (result.lat) {
      var circle = circle_for_result(result);
      circle.on('click', function () {
        highlight_result(position);
      });
      layerGroup.addLayer(circle);
    }

    if (result.boundingbox) {
      var bounds = [
        [result.boundingbox[0] * 1, result.boundingbox[2] * 1],
        [result.boundingbox[1] * 1, result.boundingbox[3] * 1]
      ];
      map.fitBounds(bounds);

      if (result.geojson && result.geojson.type.match(/(Polygon)|(Line)/)) {
        //
        var geojson_layer = L.geoJson(
          parse_and_normalize_geojson_string(result.geojson),
          {
            // https://leafletjs.com/reference-1.0.3.html#path-option
            style: function (feature) {
              return { interactive: false, color: 'blue' };
            }
          }
        );
        layerGroup.addLayer(geojson_layer);
      }
      // else {
      //     var layer = L.rectangle(bounds, {color: "#ff7800", weight: 1} );
      //     layerGroup.addLayer(layer);
      // }
    } else {
      var result_coord = L.latLng(result.lat, result.lon);
      if (result_coord) {
        if (is_reverse_search) {
          // console.dir([result_coord, [request_lat, request_lon]]);
          // make sure the search coordinates are in the map view as well
          map.fitBounds(
            [result_coord, [request_lat, request_lon]],
            {
              padding: [50, 50],
              maxZoom: map.getZoom()
            }
          );
        } else {
          map.panTo(result_coord, result.zoom || get_config_value('Map_Default_Zoom'));
        }
      }
    }
    if (bool_focus) {
      $('#map').focus();
    }
  }


  $('.result').on('click', function () {
    highlight_result($(this).data('position'), true);
  });

  if (is_reverse_search) {
    map.on('click', function (e) {
      $('form input[name=lat]').val(e.latlng.lat);
      $('form input[name=lon]').val(e.latlng.wrap().lng);
      $('form').submit();
    });

    $('#switch-coords').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var lat = $('form input[name=lat]').val();
      var lon = $('form input[name=lon]').val();
      $('form input[name=lat]').val(lon);
      $('form input[name=lon]').val(lat);
      $('form').submit();
    });
  }

  highlight_result(0, false);

  // common mistake is to copy&paste latitude and longitude into the 'lat' search box
  $('form input[name=lat]').on('change', function () {
    var coords = $(this).val().split(',');
    if (coords.length === 2) {
      $(this).val(L.Util.trim(coords[0]));
      $(this).siblings('input[name=lon]').val(L.Util.trim(coords[1]));
    }
  });
}







jQuery(document).ready(function () {
  //
  if (!$('#search-page,#reverse-page').length) { return; }

  var is_reverse_search = !!($('#reverse-page').length);
  var endpoint = is_reverse_search ? 'reverse' : 'search';


  var search_params = new URLSearchParams(location.search);

  // return view('search', [
  //     'sQuery' => $sQuery,
  //     'bAsText' => '',
  //     'sViewBox' => '',
  //     'aSearchResults' => $aSearchResults,
  //     'sMoreURL' => 'example.com',
  //     'sDataDate' => $this->fetch_status_date(),
  //     'sApiURL' => $url
  // ]);

  if (is_reverse_search) {
    var api_request_params = {
      lat: search_params.get('lat'),
      lon: search_params.get('lon'),
      zoom: (search_params.get('zoom') > 1 ? search_params.get('zoom') : get_config_value('Reverse_Default_Search_Zoom')),
      format: 'jsonv2'
    };

    var context = {
      // aPlace: aPlace,
      fLat: api_request_params.lat,
      fLon: api_request_params.lon,
      iZoom: (search_params.get('zoom') > 1 ? api_request_params.zoom : get_config_value('Reverse_Default_Search_Zoom'))
    };


    if (api_request_params.lat && api_request_params.lon) {

      fetch_from_api('reverse', api_request_params, function (aPlace) {

        if (aPlace.error) {
          aPlace = null;
        }

        context.aPlace = aPlace;

        render_template($('main'), 'reversepage-template', context);

        init_map_on_search_page(
          is_reverse_search,
          [aPlace],
          api_request_params.lat,
          api_request_params.lon,
          api_request_params.zoom
        );

        update_data_date();
      });
    } else {
      render_template($('main'), 'reversepage-template', context);

      init_map_on_search_page(
        is_reverse_search,
        [],
        get_config_value('Map_Default_Lat'),
        get_config_value('Map_Default_Lon'),
        get_config_value('Map_Default_Zoom')
      );
    }

  } else {
    var api_request_params = {
      q: search_params.get('q'),
      polygon_geojson: search_params.get('polygon_geojson') ? 1 : 0,
      viewbox: search_params.get('viewbox'),
      format: 'jsonv2'
    };

    var context = {
      // aSearchResults: aResults,
      sQuery: api_request_params.q,
      sViewBox: search_params.get('viewbox'),
      env: Nominatim_Config,
      sMoreURL: ''
    };

    if (api_request_params.q) {

      fetch_from_api('search', api_request_params, function (aResults) {

        context.aSearchResults = aResults;

        render_template($('main'), 'searchpage-template', context);

        init_map_on_search_page(is_reverse_search, aResults, get_config_value('Map_Default_Lat'), get_config_value('Map_Default_Lon'), get_config_value('Map_Default_Zoom'));

        $('#q').focus();

        update_data_date();
      });
    } else {
      render_template($('main'), 'searchpage-template', context);

      init_map_on_search_page(is_reverse_search, [], get_config_value('Map_Default_Lat'), get_config_value('Map_Default_Lon'), get_config_value('Map_Default_Zoom'));
    }
  }
});
