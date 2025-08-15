<script>
  import UrlSubmitForm from '../components/UrlSubmitForm.svelte';

  import { map_store } from '../lib/stores.js';
  import { get } from 'svelte/store';

  let { bStructuredSearch = false, api_request_params = {} } = $props();

  let sViewBox = $state();

  // lat,lon are later set in update_reverse_link()
  let lat; // eslint-disable-line no-unused-vars
  let lon; // eslint-disable-line no-unused-vars

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

  function set_viewbox(map) {
    let use_viewbox = document.getElementById('use_viewbox');
    if (use_viewbox && use_viewbox.checked) {
      sViewBox = map_viewbox_as_string(map);
    } else {
      sViewBox = '';
    }
  }

  function update_reverse_link(map) {
    let center_lat_lng = map.wrapLatLng(map.getCenter());
    lat = center_lat_lng.lat.toFixed(5);
    lon = center_lat_lng.lng.toFixed(5);
  }

  map_store.subscribe(map => {
    if (!map) { return; }

    map.on('move', function () {
      set_viewbox(map);
      update_reverse_link(map);
    });

    map.on('load', function () {
      set_viewbox(map);
      update_reverse_link(map);
    });
  });

  function reset_viewbox() {
    let map = get(map_store);
    if (map) { set_viewbox(map); }
  }

  function set_bounded(e) {
    document.querySelector('input[name=bounded]').value = e.target.checked ? 1 : '';
  }

  function set_dedupe(e) {
    document.querySelector('input[name=dedupe]').value = e.target.checked ? 1 : 0;
  }

  function set_api_param(e) {
    document.querySelector('input[name=' + e.target.dataset.apiParam + ']').value = e.target.value;
  }
</script>

<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link" class:active={!bStructuredSearch} data-bs-toggle="tab" href="#simple">
      Simple
    </a>
  </li>
  <li class="nav-item">
    <a class="nav-link" class:active={bStructuredSearch} data-bs-toggle="tab" href="#structured">
      Structured
    </a>
  </li>
</ul>

<div class="tab-content py-2">
  <div class="tab-pane" class:active={!bStructuredSearch} id="simple" role="tabpanel">
    <UrlSubmitForm page="search">
      <div class="col-auto">
        <input id="q"
               name="q"
               type="text"
               class="form-control form-control-sm"
               placeholder="Search"
               value="{api_request_params.q || ''}" />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary btn-sm mx-1">Search</button>
        <input type="hidden"
               name="viewbox" value="{sViewBox || ''}" />
        <input type="hidden"
               name="dedupe" value="{api_request_params.dedupe === 0 ? 0 : 1}" />
        <input type="hidden"
               name="bounded" value="{api_request_params.bounded ? 1 : ''}" />
        <input type="hidden"
               name="accept-language"value="{api_request_params['accept-language'] || ''}" />
        <input type="hidden"
               name="countrycodes" value="{api_request_params.countrycodes || ''}"
                                   pattern="^[a-zA-Z]{'{2}'}(,[a-zA-Z]{'{2}'})*$" />
        <input type="hidden"
               name="limit" value="{api_request_params.limit || ''}" />
        <input type="hidden"
               name="polygon_threshold" value="{api_request_params.polygon_threshold || ''}" />
        <input type="hidden"
               name="layer" value="{api_request_params.layer || ''}" />
      </div>
    </UrlSubmitForm>
  </div>
  <div class="tab-pane" class:active={bStructuredSearch} id="structured" role="tabpanel">
    <UrlSubmitForm page="search">
      <div class="col-auto">
        <input name="street" type="text" class="form-control form-control-sm me-1"
               placeholder="House number/Street"
               value="{api_request_params.street || ''}" />
      </div>
      <div class="col-auto">
        <input name="city" type="text" class="form-control form-control-sm me-1"
               placeholder="City"
               value="{api_request_params.city || ''}" />
      </div>
      <div class="col-auto">
        <input id="county" name="county" type="text" class="form-control form-control-sm me-1"
               placeholder="County"
               value="{api_request_params.county || ''}" />
      </div>
      <div class="col-auto">
        <input name="state" type="text" class="form-control form-control-sm me-1"
               placeholder="State"
               value="{api_request_params.state || ''}" />
      </div>
      <div class="col-auto">
        <input name="country" type="text" class="form-control form-control-sm me-1"
               placeholder="Country"
               value="{api_request_params.country || ''}" />
      </div>
      <div class="col-auto">
        <input name="postalcode" type="text" class="form-control form-control-sm me-1"
               placeholder="Postal Code"
               value="{api_request_params.postalcode || ''}" />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary btn-sm">Search</button>
        <input type="hidden"
               name="viewbox" value="{sViewBox || ''}" />
        <input type="hidden"
               name="dedupe" value="{api_request_params.dedupe === 0 ? 0 : 1}" />
        <input type="hidden"
               name="bounded" value="{api_request_params.bounded ? 1 : ''}" />
        <input type="hidden"
               name="accept-language" value="{api_request_params['accept-language'] || ''}" />
        <input type="hidden"
               name="countrycodes" value="{api_request_params.countrycodes || ''}"
                                   pattern="^[a-zA-Z]{'{2}'}(,[a-zA-Z]{'{2}'})*$" />
        <input type="hidden"
               name="limit" value="{api_request_params.limit || ''}" />
        <input type="hidden"
               name="polygon_threshold" value="{api_request_params.polygon_threshold || ''}" />
        <input type="hidden"
               name="layer" value="{api_request_params.layer || ''}" />
      </div>
    </UrlSubmitForm>
  </div>
</div> <!-- /tab-content -->

<!-- Additional options -->
<details id="searchAdvancedOptions">
  <summary><small>Advanced options</small></summary>
  <ul>
    <li>
      <div class="form-check form-check-inline">
        <label class="form-check-label" for="use_viewbox">apply viewbox</label>
        <input type="checkbox" class="form-check-input api-param-setting"
               id="use_viewbox" checked={api_request_params.viewbox} onchange={reset_viewbox}>
      </div>
    </li>

    <li>
      <div class="form-check form-check-inline">
        <label class="form-check-label" for="option_bounded">bounded to viewbox</label>
        <input type="checkbox" class="form-check-input api-param-setting"
               id="option_bounded" checked={!!api_request_params.bounded} onchange={set_bounded}>
      </div>
    </li>

    <li>
      <div class="form-check form-check-inline">
        <label class="form-check-label" for="option_dedupe">deduplicate results</label>
        <input type="checkbox"
               class="form-check-input api-param-setting"
               id="option_dedupe"
               checked={api_request_params.dedupe === 0 ? 0 : 1}
               onchange={set_dedupe}>
      </div>
    </li>

    <li>
      <label for="option_limit">Maximum number of results</label>
      <input type="number"
             class="form-control form-control-sm d-inline w-auto api-param-setting"
             data-api-param="limit" id="option_limit" min="1" max="50"
             value="{api_request_params.limit || ''}"
             onchange={set_api_param}>
    </li>

    <li>
      <label for="option_polygon_threshold">Polygon simplification</label>
      <input type="number"
             class="form-control form-control-sm d-inline w-auto api-param-setting"
             data-api-param="polygon_threshold" id="option_polygon_threshold"
             min="0.0" max="1.0" step="0.001"
             value="{api_request_params.polygon_threshold || ''}"
             onchange={set_api_param}>
    </li>

    <li>
      <label for="accept_lang">Languages</label>
      <input type="text" placeholder="e.g. en,zh-Hant"
             class="form-control form-control-sm d-inline w-auto api-param-setting"
             data-api-param="accept-language" id="accept_lang" size="15"
             value="{api_request_params['accept-language'] || ''}"
             onchange={set_api_param}>
    </li>

    <li>
      <label for="option_ccode">Country Codes</label>
      <input type="text" placeholder="e.g. de,gb"
            class="form-control form-control-sm d-inline w-auto api-param-setting"
             data-api-param="countrycodes" id="option_ccode" size="15"
             value="{api_request_params.countrycodes || ''}"
             pattern="^[a-zA-Z]{'{2}'}(,[a-zA-Z]{'{2}'})*$"
             onchange={set_api_param}>
    </li>
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
  .nav-tabs {
    font-size: 0.8em;
    margin-top: -1em;
  }

  .nav-link {
    padding: 0.1rem 1rem;
  }

  #q {
    width: 500px;
    max-width: 100%;
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

</style>
