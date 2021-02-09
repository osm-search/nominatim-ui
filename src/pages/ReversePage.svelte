<script>
  import { onMount, onDestroy } from 'svelte';

  import { page, results_store, } from '../lib/stores.js';
  import { get_config_value } from '../lib/config_reader.js';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import ReverseBar from '../components/ReverseBar.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params;
  let current_result;
  let position_marker;

  function loaddata() {
    let search_params = new URLSearchParams(window.location.search);

    update_html_title();

    api_request_params = {
      lat: search_params.get('lat'),
      lon: search_params.get('lon'),
      zoom: (search_params.get('zoom') > 1
        ? Number(search_params.get('zoom'))
        : Number(get_config_value('Reverse_Default_Search_Zoom'))),
      format: 'jsonv2'
    };

    if (api_request_params.lat || api_request_params.lat) {

      fetch_from_api('reverse', api_request_params, function (data) {
        if (data && !data.error) {
          position_marker = [api_request_params.lat, api_request_params.lon];
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
  }

  let page_subscription;
  onMount(() => { page_subscription = page.subscribe(loaddata); });
  onDestroy(() => { page_subscription(); });
</script>

<ReverseBar api_request_params={api_request_params} />

<div id="content">
  <div class="sidebar">
    <ResultsList bind:current_result reverse_search={true} />
  </div>
  <div id="map-wrapper">
    <Map {current_result} {position_marker} display_minimap={true} />
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
