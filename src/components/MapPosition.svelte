<script>
  import { mapState } from '../state/MapState.svelte.js';

  let visible = $state(false);

  const view_on_osm_link = $derived(
      `https://openstreetmap.org/#map=${mapState.zoom}/${mapState.center.lat.toFixed(5)}/${mapState.center.lng.toFixed(5)}`
  );

  function coordToString(c) {
    return c ? `${c.lat.toFixed(5)},${c.lng.toFixed(5)}` : '-';
  }
</script>

<div id="map-position">
{#if visible}
  <div id="map-position-inner">
    map center: {coordToString(mapState.center)}
    <a target="_blank" rel="noreferrer" href="{view_on_osm_link}">view on osm.org</a>
    <br>
    map zoom: {mapState.zoom}
    <br>
    viewbox: {mapState.viewboxStr}
    <br>
    last click: {coordToString(mapState.lastClick)}
    <br>
    mouse position: {coordToString(mapState.mousePos)}
  </div>
  <div id="map-position-close"><a href="#hide" onclick={() => visible = false}>hide</a></div>
{:else}
<button id="show-map-position"
        class="btn btn-sm btn-outline-secondary"
        onclick={() => visible = true}>
  show map bounds
</button>
{/if}
</div>

<style>
  #map-position {
    display: block;
    position: absolute;
    top: 0;
    right: 20px;
    color: #333;
    font-size: 11px;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
    margin: 5px
  }

  #map-position-inner {
    padding: 0 5px;
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

  .btn-outline-secondary {
    background-color: white;
  }

  .btn-outline-secondary:hover {
    color: #111;
  }


</style>
