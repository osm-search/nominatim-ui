
// *********************************************************
// FORWARD/REVERSE SEARCH PAGE
// *********************************************************


function display_map_position(mouse_lat_lng) {
  //
  if (mouse_lat_lng) {
    mouse_lat_lng = map.wrapLatLng(mouse_lat_lng);
  }

  var html_mouse = 'mouse position: -';
  if (mouse_lat_lng) {
    html_mouse = 'mouse position: '
                  + [mouse_lat_lng.lat.toFixed(5), mouse_lat_lng.lng.toFixed(5)].join(',');
  }
  var html_click = 'last click: -';
  if (last_click_latlng) {
    html_click = 'last click: '
                  + [last_click_latlng.lat.toFixed(5), last_click_latlng.lng.toFixed(5)].join(',');
  }

  var html_center = 'map center: '
    + map.getCenter().lat.toFixed(5) + ',' + map.getCenter().lng.toFixed(5)
    + ' <a target="_blank" href="' + map_link_to_osm() + '">view on osm.org</a>';

  var html_zoom = 'map zoom: ' + map.getZoom();
  var html_viewbox = 'viewbox: ' + map_viewbox_as_string();

  $('#map-position-inner').html([
    html_center,
    html_zoom,
    html_viewbox,
    html_click,
    html_mouse
  ].join('<br/>'));

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

function init_map_on_search_page(is_reverse_search, nominatim_results, request_lat,
  request_lon, init_zoom) {

  var attribution = get_config_value('Map_Tile_Attribution') || null;
  map = new L.map('map', {
    // center: [nominatim_map_init.lat, nominatim_map_init.lon],
    // zoom:   nominatim_map_init.zoom,
    attributionControl: (attribution && attribution.length),
    scrollWheelZoom: true, // !L.Browser.touch,
    touchZoom: false
  });


  L.tileLayer(get_config_value('Map_Tile_URL'), {
    // moved to footer
    // '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    attribution: attribution
  }).addTo(map);

  // console.log(Nominatim_Config);

  map.setView([request_lat, request_lon], init_zoom);

  var osm2 = new L.TileLayer(get_config_value('Map_Tile_URL'), {
    minZoom: 0,
    maxZoom: 13,
    attribution: attribution
  });
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
    var search_params = new URLSearchParams(window.location.search);
    var viewbox = search_params.get('viewbox');
    if (viewbox) {
      var coords = viewbox.split(','); // <x1>,<y1>,<x2>,<y2>
      var bounds = L.latLngBounds([coords[1], coords[0]], [coords[3], coords[2]]);
      L.rectangle(bounds, {
        color: '#69d53e',
        weight: 3,
        dashArray: '5 5',
        opacity: 0.8,
        fill: false
      }).addTo(map);
    }
  }

  var MapPositionControl = L.Control.extend({
    options: {
      position: 'topright'
    },
    onAdd: function (/* map */) {
      var container = L.DomUtil.create('div', 'my-custom-control');

      $(container).text('show map bounds')
        .addClass('leaflet-bar btn btn-sm btn-default')
        .on('click', function (e) {
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
    $('input[name=viewbox]')
      .val($('input#use_viewbox')
        .prop('checked') ? map_viewbox_as_string() : '');
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

  $("input[name='query-selector']").click(function () {
    var query_val = $("input[name='query-selector']:checked").val();
    if (query_val === 'simple') {
      $('div.form-group-simple').removeClass('hidden');
      $('div.form-group-structured').addClass('hidden');
      $('.form-group-structured').find('input:text').val('');
    } else if (query_val === 'structured') {
      console.log('here');
      $('div.form-group-simple').addClass('hidden');
      $('div.form-group-structured').removeClass('hidden');
      $('.form-group-simple').find('input:text').val('');
    }
  });

  function get_result_element(position) {
    return $('.result').eq(position);
  }
  // function marker_for_result(result) {
  //   return L.marker([result.lat, result.lon], { riseOnHover: true, title: result.name });
  // }
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

  var layerGroup = (new L.layerGroup()).addTo(map);

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
      var bbox = [
        [result.boundingbox[0] * 1, result.boundingbox[2] * 1],
        [result.boundingbox[1] * 1, result.boundingbox[3] * 1]
      ];
      map.fitBounds(bbox);

      if (result.geojson && result.geojson.type.match(/(Polygon)|(Line)/)) {
        //
        var geojson_layer = L.geoJson(
          parse_and_normalize_geojson_string(result.geojson),
          {
            // https://leafletjs.com/reference-1.0.3.html#path-option
            style: function (/* feature */) {
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
    var coords_split = $(this).val().split(',');
    if (coords_split.length === 2) {
      $(this).val(L.Util.trim(coords_split[0]));
      $(this).siblings('input[name=lon]').val(L.Util.trim(coords_split[1]));
    }
  });
}




jQuery(document).ready(function () {
  //
  if (!$('#search-page,#reverse-page').length) { return; }

  var is_reverse_search = !!($('#reverse-page').length);

  var search_params = new URLSearchParams(window.location.search);

  // return view('search', [
  //     'sQuery' => $sQuery,
  //     'bAsText' => '',
  //     'sViewBox' => '',
  //     'aSearchResults' => $aSearchResults,
  //     'sMoreURL' => 'example.com',
  //     'sDataDate' => $this->fetch_status_date(),
  //     'sApiURL' => $url
  // ]);

  var api_request_params;
  var context;

  if (is_reverse_search) {
    api_request_params = {
      lat: search_params.get('lat'),
      lon: search_params.get('lon'),
      zoom: (search_params.get('zoom') > 1
        ? search_params.get('zoom')
        : get_config_value('Reverse_Default_Search_Zoom')),
      format: 'jsonv2'
    };

    context = {
      // aPlace: aPlace,
      fLat: api_request_params.lat,
      fLon: api_request_params.lon,
      iZoom: (search_params.get('zoom') > 1
        ? api_request_params.zoom
        : get_config_value('Reverse_Default_Search_Zoom'))
    };

    update_html_title();
    if (api_request_params.lat && api_request_params.lon) {

      fetch_from_api('reverse', api_request_params, function (aPlace) {

        if (aPlace.error) {
          aPlace = null;
        }

        context.aPlace = aPlace;

        render_template($('main'), 'reversepage-template', context);
        update_html_title('Reverse result for '
                            + api_request_params.lat
                            + ','
                            + api_request_params.lon);

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
    api_request_params = {
      q: search_params.get('q'),
      street: search_params.get('street'),
      city: search_params.get('city'),
      county: search_params.get('county'),
      state: search_params.get('state'),
      country: search_params.get('country'),
      postalcode: search_params.get('postalcode'),
      polygon_geojson: search_params.get('polygon_geojson') ? 1 : 0,
      viewbox: search_params.get('viewbox'),
      exclude_place_ids: search_params.get('exclude_place_ids'),
      format: 'jsonv2'
    };

    context = {
      sQuery: api_request_params.q,
      sViewBox: search_params.get('viewbox'),
      env: Nominatim_Config
    };

    if (api_request_params.street || api_request_params.city || api_request_params.county
      || api_request_params.state || api_request_params.country || api_request_params.postalcode) {
      context.hStructured = {
        street: api_request_params.street,
        city: api_request_params.city,
        county: api_request_params.county,
        state: api_request_params.state,
        country: api_request_params.country,
        postalcode: api_request_params.postalcode
      };
    }

    if (api_request_params.q || context.hStructured) {

      fetch_from_api('search', api_request_params, function (aResults) {

        context.aSearchResults = aResults;

        if (aResults.length >= 10) {
          var aExcludePlaceIds = [];
          if (search_params.has('exclude_place_ids')) {
            aExcludePlaceIds.search_params.get('exclude_place_ids').split(',');
          }
          for (var i = 0; i < aResults.length; i += 1) {
            aExcludePlaceIds.push(aResults[i].place_id);
          }

          var parsed_url = new URLSearchParams(window.location.search);
          parsed_url.set('exclude_place_ids', aExcludePlaceIds.join(','));
          context.sMoreURL = '?' + parsed_url.toString();
        }

        render_template($('main'), 'searchpage-template', context);
        update_html_title('Result for ' + api_request_params.q);

        init_map_on_search_page(
          is_reverse_search,
          aResults,
          get_config_value('Map_Default_Lat'),
          get_config_value('Map_Default_Lon'),
          get_config_value('Map_Default_Zoom')
        );

        $('#q').focus();

        update_data_date();
      });
    } else {
      render_template($('main'), 'searchpage-template', context);

      init_map_on_search_page(
        is_reverse_search,
        [],
        get_config_value('Map_Default_Lat'),
        get_config_value('Map_Default_Lon'),
        get_config_value('Map_Default_Zoom')
      );
    }
  }
});
