var map;
var last_click_latlng;


/*********************************************************
* HELPERS
*********************************************************/

function get_config_value(str, default_val) {
    return (typeof Nominatim_Config[str] !== 'undefined' ? Nominatim_Config[str] :  default_val);
}

function parse_and_normalize_geojson_string(raw_string){
    // normalize places the geometry into a featurecollection, similar to
    // https://github.com/mapbox/geojson-normalize
    var parsed_geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: JSON.parse(raw_string),
                properties: {}
            }
        ]
    };
    return parsed_geojson;
}

function map_link_to_osm(){
    return "https://openstreetmap.org/#map=" + map.getZoom() + "/" + map.getCenter().lat + "/" + map.getCenter().lng;
}

function map_viewbox_as_string() {
    // since .toBBoxString() doesn't round numbers
    return [
        map.getBounds().getSouthWest().lng.toFixed(5), // left
        map.getBounds().getNorthEast().lat.toFixed(5), // top
        map.getBounds().getNorthEast().lng.toFixed(5), // right
        map.getBounds().getSouthWest().lat.toFixed(5)  // bottom
    ].join(',');
}


/*********************************************************
* PAGE HELPERS
*********************************************************/

function fetch_from_api(endpoint_name, params, callback) {
    var api_url = get_config_value('Nominatim_API_Endpoint') + endpoint_name + '.php?' + $.param(params);
    if (endpoint_name !== 'status') {
        $('#api-request-link').attr('href', api_url);
    }
    $.get(api_url, function(data){
        callback(data);
    });
}

function update_data_date() {
    fetch_from_api('status', {format: 'json'}, function(data){
        $('#data-date').text(data.data_last_updated.formatted);
    });
}

function render_template(el, template_name, page_context) {
    var template_source = $('#' + template_name).text();
    var template = Handlebars.compile(template_source);
    var html    = template(page_context);
    el.html(html);
}


/*********************************************************
* FORWARD/REVERSE SEARCH PAGE
*********************************************************/


function display_map_position(mouse_lat_lng){

    html_mouse = "mouse position " + (mouse_lat_lng ? [mouse_lat_lng.lat.toFixed(5), mouse_lat_lng.lng.toFixed(5)].join(',') : '-');
    html_click = "last click: " + (last_click_latlng ? [last_click_latlng.lat.toFixed(5),last_click_latlng.lng.toFixed(5)].join(',') : '-');

    html_center = 
        "map center: " + 
        map.getCenter().lat.toFixed(5) + ',' + map.getCenter().lng.toFixed(5) +
        " <a target='_blank' href='" + map_link_to_osm() + "'>view on osm.org</a>";

    html_zoom = "map zoom: " + map.getZoom();

    html_viewbox = "viewbox: " + map_viewbox_as_string();

    $('#map-position-inner').html([html_center,html_zoom,html_viewbox,html_click,html_mouse].join('<br/>'));

    var reverse_params = {
        // lat: map.getCenter().lat.toFixed(5),
        // lon: map.getCenter().lng.toFixed(5),
        // zoom: 2,
        // format: 'html'
    }
    $('#switch-to-reverse').attr('href', 'reverse.html?' + $.param(reverse_params));

    $('input#use_viewbox').trigger('change');
}




function init_map_on_search_page(is_reverse_search, nominatim_results, request_lat, request_lon, init_zoom) {

    map = new L.map('map', {
        // center: [nominatim_map_init.lat, nominatim_map_init.lon],
        // zoom:   nominatim_map_init.zoom,
        attributionControl: (get_config_value('Map_Tile_Attribution') && get_config_value('Map_Tile_Attribution').length),
        scrollWheelZoom:    true, // !L.Browser.touch,
        touchZoom:          false,
    });


    L.tileLayer(get_config_value('Map_Tile_URL'), {
        noWrap: true, // otherwise we end up with click coordinates like latitude -728
        // moved to footer
        attribution: (get_config_value('Map_Tile_Attribution') || null ) //'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // console.log(Nominatim_Config);

    map.setView([request_lat, request_lon], init_zoom);

    var osm2 = new L.TileLayer(get_config_value('Map_Tile_URL'), {minZoom: 0, maxZoom: 13, attribution: (get_config_value('Map_Tile_Attribution') || null )});
    var miniMap = new L.Control.MiniMap(osm2, {toggleDisplay: true}).addTo(map);

    if (is_reverse_search) {
        // We don't need a marker, but an L.circle instance changes radius once you zoom in/out
        var cm = L.circleMarker([request_lat, request_lon], { radius: 5, weight: 2, fillColor: '#ff7800', color: 'red', opacity: 0.75, clickable: false});
        cm.addTo(map);
    }

    var MapPositionControl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'my-custom-control');

            $(container).text('show map bounds').addClass('leaflet-bar btn btn-sm btn-default').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#map-position').show();
                $(container).hide();
            });
            $('#map-position-close a').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                $('#map-position').hide();
                $(container).show();
            });

            return container;
        }
    });

    map.addControl(new MapPositionControl());





    function update_viewbox_field(){
        // hidden HTML field
        $('input[name=viewbox]').val( $('input#use_viewbox').prop('checked') ? map_viewbox_as_string() : '');
    }

    map.on('move', function(e) {
        display_map_position();
        update_viewbox_field();
    });

    map.on('mousemove', function(e) {
        display_map_position(e.latlng);
    });

    map.on('click', function(e) {
        last_click_latlng = e.latlng;
        display_map_position();
    });

    map.on('load', function(e){
        display_map_position();
    });


    $('input#use_viewbox').on('change', function(){
        update_viewbox_field();
    });




    function get_result_element(position){
        return $('.result').eq(position);
    }
    function marker_for_result(result){
        return L.marker([result.lat,result.lon], {riseOnHover:true,title:result.name });
    }
    function circle_for_result(result){
        return L.circleMarker([result.lat,result.lon], { radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75, clickable: !is_reverse_search});
    }

    var layerGroup = new L.layerGroup().addTo(map);
    function highlight_result(position, bool_focus){
        var result = nominatim_results[position];
        if (!result){ return }
        var result_el = get_result_element(position);

        $('.result').removeClass('highlight');
        result_el.addClass('highlight');

        layerGroup.clearLayers();

        if (result.lat){
            var circle = circle_for_result(result);
            circle.on('click', function(){
                highlight_result(position);
            });
            layerGroup.addLayer(circle);            
        }
        if (result.aBoundingBox){

            var bounds = [[result.aBoundingBox[0]*1,result.aBoundingBox[2]*1], [result.aBoundingBox[1]*1,result.aBoundingBox[3]*1]];
            map.fitBounds(bounds);

            if (result.asgeojson && result.asgeojson.match(/(Polygon)|(Line)/) ){

                var geojson_layer = L.geoJson(
                    parse_and_normalize_geojson_string(result.asgeojson),
                    {
                        // http://leafletjs.com/reference-1.0.3.html#path-option
                        style: function(feature) {
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
        }
        else {
            var result_coord = L.latLng(result.lat, result.lon);
            if ( result_coord ){
                if ( is_reverse_search ){
                    // console.dir([result_coord, [request_lat, request_lon]]);
                    // make sure the search coordinates are in the map view as well
                    map.fitBounds([result_coord, [request_lat, request_lon]], {padding: [50,50], maxZoom: map.getZoom()});

                    // better, but causes a leaflet warning
                    // map.panInsideBounds([[result.lat,result.lon], [nominatim_map_init.lat,nominatim_map_init.lon]], {animate: false});
                }
                else {
                    map.panTo(result_coord, result.zoom || get_config_value('Map_Default_Zoom'));
                }
            }
        }
        if (bool_focus){
            $('#map').focus();
        }
    }


    $('.result').on('click', function(e){
        highlight_result($(this).data('position'), true);
    });

    if ( is_reverse_search ){
        map.on('click', function(e){
            $('form input[name=lat]').val( e.latlng.lat);
            $('form input[name=lon]').val( e.latlng.lng);
            $('form').submit();
        });

        $('#switch-coords').on('click', function(e){
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
    $('form input[name=lat]').on('change', function(){
        var coords = $(this).val().split(',');
        if (coords.length == 2) {
            $(this).val(L.Util.trim(coords[0]));
            $(this).siblings('input[name=lon]').val(L.Util.trim(coords[1]));
        }
    });
};










jQuery(document).ready(function(){

    if ( !$('#search-page,#reverse-page').length ){ return; }
    
    var is_reverse_search = !!( $('#reverse-page').length );
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
            lat: typeof(search_params.get('lat') !== 'undefined') ? search_params.get('lat') : get_config_value('Map_Default_Lat'),
            lon: typeof(search_params.get('lon') !== 'undefined') ? search_params.get('lon') : get_config_value('Map_Default_Lon'),
            zoom: (search_params.get('zoom') !== '' ? search_params.get('zoom') : get_config_value('Map_Default_Zoom')),
            format: 'jsonv2'
        }

        fetch_from_api('reverse', api_request_params, function(aPlace){

            if (aPlace.error) {
                aPlace = null;
            }

            var context = {
                aPlace: aPlace,
                fLat: api_request_params.lat,
                fLon: api_request_params.lon,
                iZoom: (search_params.get('zoom') !== '' ? api_request_params.zoom : undefined)
            };

            render_template($('main'), 'reversepage-template', context);

            init_map_on_search_page(is_reverse_search, [aPlace], api_request_params.lat, api_request_params.lon, api_request_params.zoom);

            update_data_date();
        });
    } else {
        var api_request_params = {
            q: search_params.get('q'),
            polygon_geojson: search_params.get('polygon_geojson') ? 1 : 0,
            polygon: search_params.get('polygon'),
            format: 'jsonv2'
        };

        fetch_from_api('search', api_request_params, function(aResults){

            var context = {
                aSearchResults: aResults,
                sQuery: api_request_params.q,
                sViewBox: '',
                env: Nominatim_Config,
                sMoreURL: ''
            };

            render_template($('main'), 'searchpage-template', context);

            init_map_on_search_page(is_reverse_search, aResults);

            $('#q').focus();

            update_data_date();
        });
    }
});


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
        group_parents: 1,
        format: 'json'
    };

    fetch_from_api('details', api_request_params, function(aFeature){

        var context = { aPlace: aFeature };

        render_template($('main'), 'detailspage-template', context);

        update_data_date();

        init_map_on_detail_page(aFeature.lat, aFeature.lon, aFeature.asgeojson);
    });
});

