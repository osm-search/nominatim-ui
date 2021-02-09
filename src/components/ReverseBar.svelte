<script>
  import UrlSubmitForm from '../components/UrlSubmitForm.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';

  import { zoomLevels } from '../lib/helpers.js';
  import { map_store } from '../lib/stores.js';

  export let api_request_params = {};

  map_store.subscribe(map => {
    if (!map) { return; }

    map.on('click', function (e) {
      document.querySelector('input[name=lat]').value = e.latlng.lat.toFixed(5);
      document.querySelector('input[name=lon]').value = e.latlng.wrap().lng.toFixed(5);
      document.querySelector('form').submit();
    });
  });

  function handleSwitchCoords() {
    let lat = document.querySelector('input[name=lat]').value;
    let lon = document.querySelector('input[name=lon]').value;
    document.querySelector('input[name=lat]').value = lon;
    document.querySelector('input[name=lon]').value = lat;
    document.querySelector('form').submit();
  }

  // common mistake is to copy&paste latitude and longitude into the 'lat' search box
  function maybeSplitLatitude(e) {
    var coords_split = e.target.value.split(',');
    if (coords_split.length === 2) {
      document.querySelector('input[name=lat]').value = L.Util.trim(coords_split[0]);
      document.querySelector('input[name=lon]').value = L.Util.trim(coords_split[1]);
    }
  }

</script>

<div class="top-bar">
  <UrlSubmitForm>
    <div class="form-group">
      <input name="format" type="hidden" value="html">
      <label for="reverse-lat">lat</label>
      <input id="reverse-lat"
             name="lat"
             type="text"
             class="form-control form-control-sm"
             placeholder="latitude"
             value="{api_request_params.lat || ''}"
             on:change={maybeSplitLatitude} />
      <a id="switch-coords"
         on:click|preventDefault|stopPropagation={handleSwitchCoords}
         class="btn btn-outline-secondary btn-sm"
         title="switch lat and lon">&lt;&gt;</a>
      <label for="reverse-lon">lon</label>
      <input id="reverse-lon"
             name="lon"
             type="text"
             class="form-control form-control-sm"
             placeholder="longitude"
             value="{api_request_params.lon || ''}" />
      <label for="reverse-zoom">max zoom</label>
      <select id="reverse-zoom" name="zoom" class="form-control form-control-sm" value="{api_request_params.zoom}">
        <option value="" selected={!api_request_params.zoom}>---</option>
        {#each zoomLevels() as zoomTitle, i}
          <option value="{i}" selected={i === api_request_params.zoom}>{i} - {zoomTitle}</option>
        {/each}
      </select>
      <button type="submit" class="btn btn-primary btn-sm mx-1">
        Search
      </button>
    </div>
    <div class="search-type-link">
      <DetailsLink extra_classes="mr-2">search by id</DetailsLink>
      <a href="search.html">forward search</a>
    </div>
  </UrlSubmitForm>
</div>

<style>
  .top-bar {
    width: 100%;
    padding: 1em 15px;
  }

  label {
    font-weight: normal;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
  }

  .search-type-link {
    display: inline;
    margin-right: 2em;
    position: absolute;
    right: 0
  }

  #switch-coords {
    font-size: 0.6rem;
    font-weight: bold;
    cursor: pointer;
    padding: 2px;
    margin: 5px;
  }
</style>
