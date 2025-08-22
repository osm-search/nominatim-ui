<script>
  import UrlSubmitForm from '../components/UrlSubmitForm.svelte';

  import { zoomLevels } from '../lib/helpers.js';
  import { refresh_page } from '../lib/stores.js';
  import { mapState } from '../state/MapState.svelte.js';

  let { lat = '', lon = '', zoom = '', api_request_params = {} } = $props();

  $effect(() => {
    const newCenter = mapState.lastClick;
    if (newCenter) {
      refresh_page('reverse', new URLSearchParams({
        'lat': newCenter.lat,
        'lon': newCenter.lng,
        'zoom': zoom
      }));
    }
  });

  // common mistake is to copy&paste latitude and longitude into the 'lat' search box
  function maybeSplitLatitude(e) {
    var coords_split = e.target.value.split(/,|%2C/);
    if (coords_split.length === 2) {
      document.querySelector('input[name=lat]').value = L.Util.trim(coords_split[0]);
      document.querySelector('input[name=lon]').value = L.Util.trim(coords_split[1]);
    }
  }

  function set_api_param(e) {
    document.querySelector('input[name=' + e.target.dataset.apiParam + ']').value = e.target.value;
  }

  function onSwitchCoords(e) {
    e.preventDefault();
    e.stopPropagation();
    refresh_page('reverse', new URLSearchParams({
        lat: lon || '',
        lon: lat || '',
        zoom: zoom
      }));
  }
</script>

{#snippet content()}
  <div class="col-auto">
    <label for="reverse-lat">lat</label>
  </div>
  <div class="col-auto">
    <input id="reverse-lat"
           name="lat"
           type="text"
           class="form-control form-control-sm d-inline"
           placeholder="latitude"
           pattern="^-?\d+(\.\d+)?$"
           bind:value={lat}
           onchange={maybeSplitLatitude} />
  </div>
  <div class="col-auto">
    <button id="switch-coords"
       onclick={onSwitchCoords}
       class="btn btn-outline-secondary btn-sm"
       title="switch lat and lon">&lt;&gt;</button>
  </div>
  <div class="col-auto">
    <label for="reverse-lon">lon</label>
  </div>
  <div class="col-auto">
    <input id="reverse-lon"
           name="lon"
           type="text"
           class="form-control form-control-sm"
           placeholder="longitude"
           pattern="^-?\d+(\.\d+)?$"
           bind:value={lon} />
  </div>
  <div class="col-auto">
    <label for="reverse-zoom">max zoom</label>
  </div>
  <div class="col-auto">
    <select id="reverse-zoom" name="zoom" class="form-select form-select-sm" bind:value={zoom}>
      <option value="">---</option>
      {#each zoomLevels() as zoomTitle, i}
        <option value="{i}">{i} - {zoomTitle}</option>
      {/each}
    </select>
  </div>
  <input type="hidden"
         name="layer" value="{api_request_params.layer || ''}" />
  <div class="col-auto">
    <button type="submit" class="btn btn-primary btn-sm mx-1">Search</button>
  </div>
{/snippet}
<UrlSubmitForm page="reverse" {content} />

<!-- Additional options -->
<details id="searchAdvancedOptions" class="mt-2">
  <summary><small>Advanced options</small></summary>
  <ul>
    <li>
      <label for="option_layer">Layer</label>
      <input id="option_layer" name="layer" placeholder="e.g. address,poi,railway,natural,manmade"
        value="{api_request_params.layer || ''}"
        data-api-param="layer" onchange={set_api_param}
        class="form-control form-control-sm d-inline w-auto api-param-setting">
    </li>
  </ul>
</details>

<style>
  label {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  #switch-coords {
    font-size: 0.6rem;
    font-weight: bold;
    cursor: pointer;
    padding: 2px;
    margin: 5px;
  }

  #searchAdvancedOptions ul {
    list-style-type: none;
    padding: 0;
    font-size: 0.85rem;
  }

  #searchAdvancedOptions li {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 5px;
    border: 1px dotted #ccc;
    margin-right: 1em;
  }

  #searchAdvancedOptions label {
    margin-right: 0.5em;
  }

  @media (max-width: 850px) {
    #reverse-lon, #reverse-lat, #reverse-zoom {
      width: 8em;
    }
  }
</style>
