<script>
  import { onDestroy } from 'svelte';
  import UrlSubmitForm from '../components/UrlSubmitForm.svelte';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  import { zoomLevels } from '../lib/helpers.js';
  import { map_store, refresh_page } from '../lib/stores.js';

  export let lat = '';
  export let lon = '';
  export let zoom = '';
  export let api_request_params = {};

  function gotoCoordinates(newlat, newlon, newzoom) {
    if (newlat === null || newlon === null) return;

    let params = new SvelteURLSearchParams();
    params.set('lat', newlat);
    params.set('lon', newlon);
    params.set('zoom', newzoom || zoom);
    refresh_page('reverse', params);
  }

  const unsubscribe = map_store.subscribe(map => {
    if (map) {
      map.on('click', (e) => {
        let coords = e.latlng.wrap();
        gotoCoordinates(coords.lat.toFixed(5), coords.lng.toFixed(5));
      });
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

  onDestroy(unsubscribe);
</script>

<UrlSubmitForm page="reverse">
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
           on:change={maybeSplitLatitude} />
  </div>
  <div class="col-auto">
    <button id="switch-coords"
       on:click|preventDefault|stopPropagation={() => gotoCoordinates(lon, lat)}
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
</UrlSubmitForm>

<!-- Additional options -->
<details id="searchAdvancedOptions" class="mt-2">
  <summary><small>Advanced options</small></summary>
  <ul>
    <li>
      <label for="option_layer">Layer</label>
      <input id="option_layer" name="layer" placeholder="e.g. address,poi,railway,natural,manmade"
        value="{api_request_params.layer || ''}"
        data-api-param="layer" on:change={set_api_param}
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
