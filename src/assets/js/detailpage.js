// *********************************************************
// DETAILS PAGE
// *********************************************************


function init_map_on_detail_page(lat, lon, geojson) {
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

  // var layerGroup = new L.layerGroup().addTo(map);

  var circle = L.circleMarker([lat, lon], {
    radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75
  });
  map.addLayer(circle);

  if (geojson) {
    var geojson_layer = L.geoJson(
      // https://leafletjs.com/reference-1.0.3.html#path-option
      parse_and_normalize_geojson_string(geojson),
      {
        style: function () {
          return { interactive: false, color: 'blue' };
        }
      }
    );
    map.addLayer(geojson_layer);
    map.fitBounds(geojson_layer.getBounds());
  } else {
    map.setView([lat, lon], 10);
  }

  var osm2 = new L.TileLayer(
    get_config_value('Map_Tile_URL'),
    {
      minZoom: 0,
      maxZoom: 13,
      attribution: (get_config_value('Map_Tile_Attribution') || null)
    }
  );
  (new L.Control.MiniMap(osm2, { toggleDisplay: true })).addTo(map);
}


function details_page_load() {

  var search_params = new URLSearchParams(window.location.search);
  // var place_id = search_params.get('place_id');

  var api_request_params = {
    place_id: search_params.get('place_id'),
    osmtype: search_params.get('osmtype'),
    osmid: search_params.get('osmid'),
    class: search_params.get('class'),
    keywords: search_params.get('keywords'),
    addressdetails: 1,
    hierarchy: (search_params.get('hierarchy') === '1' ? 1 : 0),
    group_hierarchy: 1,
    polygon_geojson: 1,
    format: 'json'
  };

  if (api_request_params.place_id || (api_request_params.osmtype && api_request_params.osmid)) {
    fetch_from_api('details', api_request_params, function (aFeature) {
      var context = { aPlace: aFeature, base_url: window.location.search };

      render_template($('main'), 'detailspage-template', context);
      if (api_request_params.place_id) {
        update_html_title('Details for ' + api_request_params.place_id);
      } else {
        update_html_title('Details for ' + api_request_params.osmtype + api_request_params.osmid);
      }

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
}
