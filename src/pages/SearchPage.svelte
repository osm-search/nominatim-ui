<script>
  import { onMount, onDestroy } from 'svelte';

  import { page, results_store, current_result_store, current_request_latlon } from '../lib/stores.js';
  import { get_config_value } from '../lib/config_reader.js'
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import SearchBar from '../components/SearchBar.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  export let reverse_search = false;

  let api_request_params;
  let bStructuredSearch;

  function loaddata() {
    let search_params = new URLSearchParams(window.location.search);

    update_html_title();

    if (reverse_search) {
      api_request_params = {
        lat: search_params.get('lat'),
        lon: search_params.get('lon'),
        zoom: (search_params.get('zoom') > 1
          ? Number(search_params.get('zoom'))
          : Number(get_config_value('Reverse_Default_Search_Zoom'))),
        format: 'jsonv2'
      };

      if (api_request_params.lat || api_request_params.lat) {

        fetch_from_api('reverse', api_request_params, function(data){
          if (data && !data.error){
            current_request_latlon.set([api_request_params.lat, api_request_params.lon]);
            results_store.set([data]);
          } else {
            results_store.set([]);
          }

          update_html_title('Reverse result for '
                              + api_request_params.lat
                              + ','
                              + api_request_params.lon);
          document.querySelector('input[name=lat]').focus();
        });
      }
    } else {
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

      let bStructuredSearch = (api_request_params.street ||
                               api_request_params.city ||
                               api_request_params.county ||
                               api_request_params.state ||
                               api_request_params.country ||
                               api_request_params.postalcode);

      if (api_request_params.q || bStructuredSearch) {
        fetch_from_api('search', api_request_params, function(data){
          results_store.set(data);

          update_html_title('Result for ' + api_request_params.q);

          document.querySelector('input[name=q]').focus();
        });
      }
    }
  }

  let page_subscription;
  onMount(() => { page_subscription = page.subscribe(loaddata); });
  onDestroy(() => { page_subscription(); });
</script>

<SearchBar reverse_search={reverse_search} api_request_params={api_request_params} bStructuredSearch={bStructuredSearch} />

<div id="content">
  <div class="sidebar">
    <ResultsList reverse_search={reverse_search} />
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
