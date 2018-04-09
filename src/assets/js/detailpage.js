/*********************************************************
* DETAILS PAGE
*********************************************************/



function init_map_on_detail_page(lat, lon, geojson) {
    map = new L.map('map', {
        // center: [nominatim_map_init.lat, nominatim_map_init.lon],
        // zoom:   nominatim_map_init.zoom,
        attributionControl: (get_config_value('Map_Tile_Attribution') && get_config_value('Map_Tile_Attribution').length),
        scrollWheelZoom:    true, // !L.Browser.touch,
        touchZoom:          false,
    });

    L.tileLayer(get_config_value('Map_Tile_URL'), {
        // moved to footer
        attribution: (get_config_value('Map_Tile_Attribution') || null ) //'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var layerGroup = new L.layerGroup().addTo(map);

    var circle = L.circleMarker([lat,lon], { radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75});
    map.addLayer(circle);

    if (geojson) {
        var geojson_layer = L.geoJson(
            // http://leafletjs.com/reference-1.0.3.html#path-option
            parse_and_normalize_geojson_string(geojson),
            {
                style: function(feature) {
                    return { interactive: false, color: 'blue' }; 
                }
            }
        );
        map.addLayer(geojson_layer);
        map.fitBounds(geojson_layer.getBounds());
    } else {
        map.setView([lat,lon],10);
    }

    var osm2 = new L.TileLayer(get_config_value('Map_Tile_URL'), {minZoom: 0, maxZoom: 13, attribution: (get_config_value('Map_Tile_Attribution') || null )});
    var miniMap = new L.Control.MiniMap(osm2, {toggleDisplay: true}).addTo(map);
}



jQuery(document).ready(function(){

    if ( !$('#details-page').length ){ return; }

    var search_params = new URLSearchParams(location.search);
    // var place_id = search_params.get('place_id');

    var api_request_params = {
        place_id: search_params.get('place_id'),
        osmtype: search_params.get('osmtype'),
        osmid: search_params.get('osmid'),
        keywords: search_params.get('keywords'),
        addressdetails: 1,
        hierarchy: 1,
        group_hierarchy: 1,
        polygon_geojson: 1,
        format: 'json'
    };

    fetch_from_api('details', api_request_params, function(aFeature){

        var context = { aPlace: aFeature };

        render_template($('main'), 'detailspage-template', context);

        update_data_date();

        var lat = aFeature.centroid.coordinates[1];
        var lon = aFeature.centroid.coordinates[0];
        init_map_on_detail_page(lat, lon, aFeature.geometry);
    });
});