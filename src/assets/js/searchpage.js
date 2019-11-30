
/*********************************************************
* FORWARD/REVERSE SEARCH PAGE
*********************************************************/


function display_map_position(mouse_lat_lng){

    if (mouse_lat_lng) {
        mouse_lat_lng = map.wrapLatLng(mouse_lat_lng);
    }

    html_mouse = "mouse position " + (mouse_lat_lng ? [mouse_lat_lng.lat.toFixed(5), mouse_lat_lng.lng.toFixed(5)].join(',') : '-');
    html_click = "last click: " + (last_click_latlng ? [last_click_latlng.lat.toFixed(5),last_click_latlng.lng.toFixed(5)].join(',') : '-');

    html_center = 
        "map center: " + 
        map.getCenter().lat.toFixed(5) + ',' + map.getCenter().lng.toFixed(5) +
        " <a target='_blank' href='" + map_link_to_osm() + "'>view on osm.org</a>";

    html_zoom = "map zoom: " + map.getZoom();

    html_viewbox = "viewbox: " + map_viewbox_as_string();

    $('#map-position-inner').html([html_center,html_zoom,html_viewbox,html_click,html_mouse].join('<br/>'));

    var center_lat_lng = map.wrapLatLng(map.getCenter());
    var reverse_params = {
        lat: center_lat_lng.lat.toFixed(5),
        lon: center_lat_lng.lng.toFixed(5)
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
        // moved to footer
        attribution: (get_config_value('Map_Tile_Attribution') || null ) //'&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
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
        if (result.boundingbox){

            var bounds = [[result.boundingbox[0]*1,result.boundingbox[2]*1], [result.boundingbox[1]*1,result.boundingbox[3]*1]];
            map.fitBounds(bounds);

            if (result.geojson && result.geojson.type.match(/(Polygon)|(Line)/) ){

                var geojson_layer = L.geoJson(
                    parse_and_normalize_geojson_string(result.geojson),
                    {
                        // https://leafletjs.com/reference-1.0.3.html#path-option
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
            $('form input[name=lon]').val( e.latlng.wrap().lng);
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
            // lat: typeof(search_params.get('lat') !== 'undefined') ? search_params.get('lat') : get_config_value('Map_Default_Lat'),
            // lon: typeof(search_params.get('lon') !== 'undefined') ? search_params.get('lon') : get_config_value('Map_Default_Lon'),
            lat: search_params.get('lat'),
            lon: search_params.get('lon'),
            zoom: (search_params.get('zoom') !== '' ? search_params.get('zoom') : get_config_value('Reverse_Default_Search_Zoom')),
            format: 'jsonv2'
        }

        var context = {
            // aPlace: aPlace,
            fLat: api_request_params.lat,
            fLon: api_request_params.lon,
            iZoom: (search_params.get('zoom') !== '' ? api_request_params.zoom : get_config_value('Reverse_Default_Search_Zoom'))
        };


        if (api_request_params.lat && api_request_params.lon) {

            fetch_from_api('reverse', api_request_params, function(aPlace){

                if (aPlace.error) {
                    aPlace = null;
                }

                context.aPlace = aPlace;

                render_template($('main'), 'reversepage-template', context);

                init_map_on_search_page(is_reverse_search, [aPlace], api_request_params.lat, api_request_params.lon, api_request_params.zoom);

                update_data_date();
            });
        } else {
            render_template($('main'), 'reversepage-template', context);

            init_map_on_search_page(is_reverse_search, [], get_config_value('Map_Default_Lat'), get_config_value('Map_Default_Lon'), get_config_value('Map_Default_Zoom'));
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
            sViewBox: '',
            env: Nominatim_Config,
            sMoreURL: ''
        };

        if (api_request_params.q) {

            fetch_from_api('search', api_request_params, function(aResults){

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




