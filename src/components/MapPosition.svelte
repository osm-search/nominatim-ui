<script>

  import { map_store } from '../lib/stores.js';
  let last_click_latlng;

  let map_center;
  let map_zoom;
  let map_viewbox;
  let view_on_osm_link;
  let last_click;
  let mouse_position;

  function map_link_to_osm(map) {
    var zoom = map.getZoom();
    var lat = map.getCenter().lat.toFixed(5);
    var lng = map.getCenter().lng.toFixed(5);
    return 'https://openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lng;
  }

  function map_viewbox_as_string(map) {
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

  function display_map_position(map, mouse_lat_lng) {
    map_center = map.getCenter().lat.toFixed(5) + ',' + map.getCenter().lng.toFixed(5);
    view_on_osm_link = map_link_to_osm(map);
    map_zoom = map.getZoom();
    map_viewbox = map_viewbox_as_string(map);
    mouse_position = '-';
    if (mouse_lat_lng) {
      mouse_position = [mouse_lat_lng.lat.toFixed(5), mouse_lat_lng.lng.toFixed(5)].join(',');
    }
    if (last_click_latlng) {
      last_click = [last_click_latlng.lat.toFixed(5), last_click_latlng.lng.toFixed(5)].join(',');
    }
  }


  map_store.subscribe(map => {
    if (!map) return;

    map.on('move', function () {
      display_map_position(map);
      // update_viewbox_field();
    });

    map.on('mousemove', function (e) {
      display_map_position(map, e.latlng);
    });

    map.on('click', function (e) {
      last_click_latlng = e.latlng;
      display_map_position(map);
    });

    map.on('load', function () {
      display_map_position(map);
    });
  });

  function handleHideClick() {
    document.getElementById('map-position').style.display = 'none';
    document.getElementById('show-map-position').style.display = 'block';
  }

</script>

<div id="map-position">
  <div id="map-position-inner">
    map center: {map_center}
    <a target="_blank" href="{view_on_osm_link}">view on osm.org</a>
    <br>
    map zoom: {map_zoom}
    <br>
    viewbox: {map_viewbox}
    <br>
    last click: {last_click}
    <br>
    mouse position: {mouse_position}
  </div>
  <div id="map-position-close"><a href="#hide" on:click={handleHideClick}>hide</a></div>
</div>


<style>
  #map-position {
    display: none;
    position: absolute;
    top: 0;
    right: 20px;
    padding: 0 5px;
    color: #333;
    font-size: 11px;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
  }

  #map-position-close {
    text-align: right;
  }

  
  

  @media (max-width: 768px) {
    #map-position {
      top: 20px;
      right: 20px;
    }
  }
</style>
