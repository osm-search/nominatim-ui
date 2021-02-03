<script>
  import { onMount, onDestroy } from 'svelte';

  import {
    page, results_store, current_request_latlon
  } from '../lib/stores.js';
  import { get_config_value } from '../lib/config_reader.js';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import SearchBar from '../components/SearchBar.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params;
  let bStructuredSearch;

  function loaddata() {
    let search_params = new URLSearchParams(window.location.search);

    update_html_title();

    api_request_params = {
      q: search_params.get('q'),
      street: search_params.get('street'),
      city: search_params.get('city'),
      county: search_params.get('county'),
      state: search_params.get('state'),
      country: search_params.get('country'),
      postalcode: search_params.get('postalcode'),
      polygon_geojson: get_config_value('Search_AreaPolygons', false) ? 1 : 0,
      viewbox: search_params.get('viewbox'),
      bounded: search_params.get('bounded'),
      dedupe: search_params.get('dedupe'),
      'accept-language': search_params.get('accept-language'),
      countrycodes: search_params.get('countrycodes'),
      limit: search_params.get('limit'),
      polygon_threshold: search_params.get('polygon_threshold'),
      exclude_place_ids: search_params.get('exclude_place_ids'),
      format: 'jsonv2'
    };

    let anyStructuredFieldsSet = (api_request_params.street
                                || api_request_params.city
                                || api_request_params.county
                                || api_request_params.state
                                || api_request_params.country
                                || api_request_params.postalcode);

    if (api_request_params.q || anyStructuredFieldsSet) {
      fetch_from_api('search', api_request_params, function (data) {
        results_store.set(data);

        update_html_title('Result for ' + api_request_params.q);

        document.querySelector('input[name=q]').focus();
      });
    }
  }

  let page_subscription;
  onMount(() => { page_subscription = page.subscribe(loaddata); });
  onDestroy(() => { page_subscription(); });
</script>

<SearchBar reverse_search={false} api_request_params={api_request_params} bStructuredSearch={bStructuredSearch} />

<div id="content">
  <div class="sidebar">
    <ResultsList reverse_search={false} />
  </div>
  <div id="map-wrapper">
    <Map display_minimap={true} />
  </div>
</div>


<style>
  .sidebar {
    width: 25%;
    padding: 15px;
    padding-top: 0;
    display: inline-block;
    float: left;
  }

  #map-wrapper {
    position: relative;
    min-height: 300px;
    height: calc(100vh - 250pt);
    width: 75%;
    padding-right: 20px;
    display: inline-block;
    float: left;
  }

  @media (max-width: 768px) {
    #content {
      top: 0;
      position: relative;
    }
    .sidebar {
      width: 100%;
    }
    #map-wrapper {
      height: 300px;
    }
  }
</style>
