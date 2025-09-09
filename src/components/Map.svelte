
<script>
  import * as L from 'leaflet';
  import 'leaflet-minimap';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-minimap/dist/Control.MiniMap.min.css';

  import { mapState } from '../state/MapState.svelte.js';
  import MapPosition from '../components/MapPosition.svelte';

  let {
    display_minimap = false,
    current_result = null,
    position_marker = null
  } = $props();

  let map;
  let dataLayers = [];

  function mapViewboxAsString(map) {
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

  function setMapState() {
    mapState.viewboxStr = mapViewboxAsString(map);
    mapState.center = map.getCenter();
    mapState.zoom = map.getZoom();
  }

  function createMap(container) {
    const attribution = Nominatim_Config.Map_Tile_Attribution;

    map = new L.map(container, {
      attributionControl: false,
      scrollWheelZoom: true, // !L.Browser.touch,
      touchZoom: false,
      center: L.latLng(Nominatim_Config.Map_Default_Lat,
                       Nominatim_Config.Map_Default_Lon),
      zoom: Nominatim_Config.Map_Default_Zoom
    });
    if (typeof Nominatim_Config.Map_Default_Bounds !== 'undefined'
      && Nominatim_Config.Map_Default_Bounds) {
      map.fitBounds(Nominatim_Config.Map_Default_Bounds);
    }

    if (attribution && attribution.length) {
      L.control.attribution({ prefix: '<a href="https://leafletjs.com/">Leaflet</a>' }).addTo(map);
    }

    setMapState();

    L.control.scale().addTo(map);

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

    map.on('move', setMapState);
    map.on('mousemove', (e) => { mapState.mousePos = e.latlng; });
    map.on('click', (e) => { mapState.lastClick = e.latlng; });
  }

  function mapAction(container) {
    createMap(container);
    setMapData(position_marker, current_result);

    return {
      destroy: () => {
        mapState.reset();
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
    if (!map) { return; }

    dataLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });
  }

  function setMapData(marker, aFeature) {
    if (!map) { return; }

    resetMapData();

    if (marker) {
      // We don't need a marker, but L.circle would change radius when you zoom in/out
      let cm = L.circleMarker(
        marker,
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
      cm.bindTooltip(`Search (${marker[0]},${marker[1]})`).openTooltip();
      cm.addTo(map);
      dataLayers.push(cm);
    }

    var search_params = new URLSearchParams(window.location.search);
    var viewbox = search_params.get('viewbox');
    if (viewbox) {
      let coords = viewbox.split(','); // <x1>,<y1>,<x2>,<y2>
      let bounds = L.latLngBounds([coords[1], coords[0]], [coords[3], coords[2]]);
      let viewbox_on_map = L.rectangle(bounds, {
        color: '#69d53e',
        weight: 3,
        dashArray: '5 5',
        opacity: 0.8,
        fill: false,
        interactive: false
      });
      map.addLayer(viewbox_on_map);
      dataLayers.push(viewbox_on_map);
    }

    if (!aFeature) return;

    let lat = aFeature.centroid ? aFeature.centroid.coordinates[1] : aFeature.lat;
    let lon = aFeature.centroid ? aFeature.centroid.coordinates[0] : aFeature.lon;
    let geojson = aFeature.geometry || aFeature.geojson;
    let entrances = aFeature.entrances;

    if (lat && lon) {
      let circle = L.circleMarker([lat, lon], {
        radius: 10, weight: 2, fillColor: '#ff7800', color: 'blue', opacity: 0.75
      });
      if (marker) { // reverse result
        circle.bindTooltip('Result').openTooltip();
      }
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
    } else if (lat && lon && marker) {
      map.fitBounds([[lat, lon], marker], { padding: [50, 50] });
    } else if (lat && lon) {
      map.setView([lat, lon], 10);
    }

    if (entrances) {
      entrances.forEach((entrance, i) => {
        let entranceCircle = L.circleMarker([entrance.lat, entrance.lon], {
          radius: 5, weight: 2, fillColor: '#ff7800', color: 'red', opacity: 0.75
        });
        entranceCircle.bindTooltip(`Entrance ${i + 1} (type=${entrance.type})`).openTooltip();
        map.addLayer(entranceCircle);
        dataLayers.push(entranceCircle);
      });
    }
  }

  $effect(() => {
    setMapData(position_marker, current_result);
  });

</script>

<div id="map" use:mapAction></div>
<MapPosition />

<style>
  #map {
    height: 100%;
    background:#eee;
  }

  @media (max-width: 768px) {
    #map {
      height: 300px;
    }
  }

</style>
