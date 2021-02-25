
<script>
  import * as L from 'leaflet';
  import 'leaflet-minimap';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-minimap/dist/Control.MiniMap.min.css';

  import { get } from 'svelte/store';
  import { map_store } from '../lib/stores.js';
  import MapPosition from '../components/MapPosition.svelte';

  export let display_minimap = false;
  export let current_result = null;
  export let position_marker = null;

  let dataLayers = [];

  function createMap(container) {
    const attribution = Nominatim_Config.Map_Tile_Attribution;
    let map = new L.map(container, {
      attributionControl: (attribution && attribution.length),
      scrollWheelZoom: true, // !L.Browser.touch,
      touchZoom: false,
      center: [
        Nominatim_Config.Map_Default_Lat,
        Nominatim_Config.Map_Default_Lon
      ],
      zoom: Nominatim_Config.Map_Default_Zoom
    });

    L.tileLayer(Nominatim_Config.Map_Tile_URL, {
      attribution: attribution
    }).addTo(map);

    if (display_minimap) {
      let osm2 = new L.TileLayer(Nominatim_Config.Map_Tile_URL, {
        minZoom: 0,
        maxZoom: 13,
        attribution: attribution
      });
      new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);
    }

    const MapPositionControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: () => { return document.getElementById('show-map-position'); }
    });
    map.addControl(new MapPositionControl());

    return map;
  }

  function mapAction(container) {
    let map = createMap(container);
    map_store.set(map);
    setMapData(current_result);

    return {
      destroy: () => {
        map_store.set(null);
        map.remove();
      }
    };
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

  function resetMapData() {
    let map = get(map_store);
    if (!map) { return; }

    dataLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });
  }

  function setMapData(aFeature) {
    let map = get(map_store);
    if (!map) { return; }

    resetMapData();

    if (position_marker) {
      // We don't need a marker, but L.circle would change radius when you zoom in/out
      let cm = L.circleMarker(
        position_marker,
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
      dataLayers.push(cm);
    }

    var search_params = new URLSearchParams(window.location.search);
    var viewbox = search_params.get('viewbox');
    if (viewbox) {
      let coords = viewbox.split(','); // <x1>,<y1>,<x2>,<y2>
      let bounds = L.latLngBounds([coords[1], coords[0]], [coords[3], coords[2]]);
      L.rectangle(bounds, {
        color: '#69d53e',
        weight: 3,
        dashArray: '5 5',
        opacity: 0.8,
        fill: false
      }).addTo(map);
    }

    if (!aFeature) return;

    let lat = aFeature.centroid ? aFeature.centroid.coordinates[1] : aFeature.lat;
    let lon = aFeature.centroid ? aFeature.centroid.coordinates[0] : aFeature.lon;
    let geojson = aFeature.geometry || aFeature.geojson;

    if (lat && lon) {
      let circle = L.circleMarker([lat, lon], {
        radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75
      });
      map.addLayer(circle);
      dataLayers.push(circle);
    }


    if (geojson) {
      var geojson_layer = L.geoJson(
        // https://leafletjs.com/reference-1.7.1.html#path-option
        parse_and_normalize_geojson_string(geojson),
        {
          style: function () {
            return { interactive: false, color: 'blue' };
          }
        }
      );
      map.addLayer(geojson_layer);
      dataLayers.push(geojson_layer);
      map.fitBounds(geojson_layer.getBounds());
    } else if (lat && lon && position_marker) {
      map.fitBounds([[lat, lon], position_marker], { padding: [50, 50] });
    } else if (lat && lon) {
      map.setView([lat, lon], 10);
    }
  }

  $: setMapData(current_result);

  function show_map_position_click(e) {
    e.target.style.display = 'none';
    document.getElementById('map-position').style.display = 'block';
  }
</script>

<MapPosition />
<div id="map" use:mapAction />
<div id="show-map-position" class="leaflet-bar btn btn-sm btn-outline-secondary"
      on:click|stopPropagation={show_map_position_click}
>show map bounds</div>

<style>
  #map {
    height: 100%;
    background:#eee;
  }

  .btn-outline-secondary {
    background-color: white;
  }

  .btn-outline-secondary:hover {
    color: #111;
  }

  @media (max-width: 768px) {
    #map {
      height: 300px;
    }
  }

</style>
