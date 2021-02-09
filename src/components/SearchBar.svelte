<script>
  import UrlSubmitForm from '../components/UrlSubmitForm.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';

  import { map_store } from '../lib/stores.js';
  import { get } from 'svelte/store';

  export let bStructuredSearch = false;
  export let api_request_params = {};
  let sViewBox;

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
    let link = document.getElementById('switch-to-reverse');
    if (link) {
      let center_lat_lng = map.wrapLatLng(map.getCenter());
      link.href = 'reverse.html?lat=' + center_lat_lng.lat.toFixed(5)
                   + '&lon=' + center_lat_lng.lng.toFixed(5);
    }
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
    console.log('setting', e.target);
    document.querySelector('input[name=bounded]').value = e.target.checked ? 1 : '';
  }

  function set_dedupe(e) {
    document.querySelector('input[name=dedupe]').value = e.target.checked ? 1 : '';
  }

  function set_api_param(e) {
    document.querySelector('input[name=' + e.target.dataset.apiParam + ']').value = e.target.value;
  }
</script>

<div class="top-bar">
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <a class="nav-link" class:active={!bStructuredSearch} data-toggle="tab" href="#simple">simple</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" class:active={bStructuredSearch} data-toggle="tab" href="#structured">structured</a>
    </li>
    <div class="search-type-link">
      <DetailsLink extra_classes="mr-2">search by id</DetailsLink>
      <a id="switch-to-reverse" href="reverse.html">reverse search</a>
    </div>
  </ul>
  <div class="tab-content p-2">
    <div class="tab-pane" class:active={!bStructuredSearch} id="simple" role="tabpanel">
      <UrlSubmitForm>
        <input id="q"
               name="q"
               type="text"
               class="form-control form-control-sm"
               placeholder="Search"
               value="{api_request_params.q || ''}" />

        <div class="form-group search-button-group">
          <button type="submit" class="btn btn-primary btn-sm mx-1">Search</button>
          <input type="hidden" name="viewbox" value="{sViewBox || ''}" />
          <input type="hidden" name="dedupe" value="{!api_request_params.dedupe ? '' : 1}" />
          <input type="hidden" name="bounded" value="{api_request_params.bounded ? 1 : ''}" />
          <input type="hidden" name="accept-language" value="{api_request_params['accept-language'] || ''}" />
          <input type="hidden" name="countrycodes" value="{api_request_params.countrycodes || ''}" />
          <input type="hidden" name="limit" value="{api_request_params.limit || ''}" />
          <input type="hidden" name="polygon_threshold" value="{api_request_params.polygon_threshold || ''}" />
        </div>
      </UrlSubmitForm>
    </div>
    <div class="tab-pane" class:active={bStructuredSearch} id="structured" role="tabpanel">
      <UrlSubmitForm>
        <input name="street" type="text" class="form-control form-control-sm mr-1"
               placeholder="House number/Street"
               value="{api_request_params.street || ''}" />
        <input name="city" type="text" class="form-control form-control-sm mr-1"
               placeholder="City"
               value="{api_request_params.city || ''}" />
        <input id="county" name="county" type="text" class="form-control form-control-sm mr-1"
               placeholder="County"
               value="{api_request_params.county || ''}" />
        <input name="state" type="text" class="form-control form-control-sm mr-1"
               placeholder="State"
               value="{api_request_params.state || ''}" />
        <input name="country" type="text" class="form-control form-control-sm mr-1"
               placeholder="Country"
               value="{api_request_params.country || ''}" />
        <input name="postalcode" type="text" class="form-control form-control-sm mr-1"
               placeholder="Postal Code"
               value="{api_request_params.postalcode || ''}" />

        <div class="form-group search-button-group">
          <button type="submit" class="btn btn-primary btn-sm mx-1">Search</button>
          <input type="hidden" name="viewbox" value="{sViewBox || ''}" />
          <input type="hidden" name="dedupe" value="{!api_request_params.dedupe ? '' : 1}" />
          <input type="hidden" name="bounded" value="{api_request_params.bounded ? 1 : ''}" />
          <input type="hidden" name="accept-language" value="{api_request_params['accept-language'] || ''}" />
          <input type="hidden" name="countrycodes" value="{api_request_params.countrycodes || ''}" />
          <input type="hidden" name="limit" value="{api_request_params.limit || ''}" />
          <input type="hidden" name="polygon_threshold" value="{api_request_params.polygon_threshold || ''}" />
        </div>
      </UrlSubmitForm>
    </div>
    <!-- Additional options -->
    <a href="#advanced" class="btn btn-outline-secondary btn-sm" data-toggle="collapse" data-target="#searchAdvancedOptions" role="button" aria-expanded="false" aria-controls="collapseAdvancedOptions">
      Advanced options
    </a>
    <div class="collapse" id="searchAdvancedOptions">
      <div id="searchAdvancedOptionsContent">
          <div class="form-check form-check-inline">
            <span><input type="checkbox" class="form-check-input api-param-setting"
                   id="use_viewbox" checked={api_request_params.viewbox} on:change={reset_viewbox}>
            <label class="form-check-label" for="use_viewbox">apply viewbox</label></span>
            <span><input type="checkbox" class="form-check-input api-param-setting"
                   id="option_bounded" checked={!!api_request_params.bounded} on:change={set_bounded}>
            <label class="form-check-label" for="option_bounded">bounded to viewbox</label></span>
            <span><input type="checkbox" class="form-check-input api-param-setting"
                   id="option_dedupe" checked={!!api_request_params.dedupe} on:change={set_dedupe}>
            <label class="form-check-label" for="option_dedupe">deduplicate results</label></span>
          </div>
          <div class="form-check form-check-inline">
            <span><label class="form-check-label" for="option_limit">Maximum number of results: </label>
            <input type="number" class="form-check-input api-param-setting" data-api-param="limit" id="option_limit" size="5" min="1" max="50" value="{api_request_params.limit || ''}" on:change={set_api_param}></span>
            <span><label class="form-check-label" for="option_polygon_threashold">Polygon simplification: </label>
            <input type="number" class="form-check-input api-param-setting" data-api-param="polygon_threshold" id="option_polygon_threshold" size="5" min="0.0" step="0.01" value="{api_request_params.polygon_threshold || ''}" on:change={set_api_param}></span>
          </div>
          <div class="form-check form-check-inline">
            <span><label class="form-check-label" for="accept_lang">Languages: </label>
            <input type="text" placeholder="e.g. en,zh-Hant" class="form-check-input api-param-setting" data-api-param="accept-language" id="accept_lang" size="15" value="{api_request_params['accept-language'] || ''}" on:change={set_api_param}></span>
            <span><label class="form-check-label" for="option_ccode">Countries: </label>
            <input type="text" placeholder="e.g. de,gb" class="form-check-input api-param-setting" data-api-param="countrycodes" id="option_ccode" size="15" value="{api_request_params.countrycodes || ''}" on:change={set_api_param}></span>
          </div>
       </div>
    </div>
  </div> <!-- /tab-content -->
</div> <!-- /top-bar -->

<style>
  .top-bar {
    width: 100%;
    padding: 1em 15px;
  }

  .top-bar #q {
    max-width: 500px;
  }

  .tab-content {
    border: 1px solid #ddd;
    border-top: none;
    display: flex;
    align-items: baseline
  }

  #q {
    min-width: 500px;
  }
  @media (max-width: 850px) {
    #q {
      min-width: 400px;
    }
  }

  label {
    font-weight: normal;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
  }

  #searchAdvancedOptionsContent {
    display: flex;
    flex-direction: column;
    padding: 0 10px
  }

  #searchAdvancedOptionsContent label {
    padding: 0 3px;
  }

  #searchAdvancedOptionsContent span {
    padding: 4px 10px;
  }

  .search-type-link {
    display: inline;
    margin-right: 2em;
    position: absolute;
    right: 0
  }

  @media (max-width: 768px) {
    .search-button-group {
      display: inline;
    }
  }
</style>
