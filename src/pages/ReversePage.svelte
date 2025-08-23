<script>
  import { untrack } from 'svelte';
  import { results_store } from '../lib/stores.js';
  import { update_html_title } from '../lib/api_utils.js';
  import { appState } from '../state/AppState.svelte.js';

  import Header from '../components/Header.svelte';
  import SearchSectionReverse from '../components/SearchSectionReverse.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params = $state.raw();
  let current_result = $state();
  let position_marker = $state(); // what the user searched for

  function loaddata(search_params) {
    update_html_title();

    api_request_params = {
      lat: search_params.get('lat'),
      lon: search_params.get('lon'),
      zoom: (search_params.get('zoom') > 1
        ? Number(search_params.get('zoom'))
        : Number(Nominatim_Config.Reverse_Default_Search_Zoom)),
      layer: search_params.get('layer'),
      format: 'jsonv2'
    };

    if (api_request_params.lat && api_request_params.lon) {
      position_marker = [api_request_params.lat, api_request_params.lon];

      appState.fetchFromApi('reverse', api_request_params, function (data) {
        if (data && !data.error) {
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
    } else {
      results_store.set(undefined);
    }
  }

  $effect(() => {
    if (appState.page.tab === 'reverse') {
      const params = appState.page.params;
      untrack(() => loaddata(params));
    }
  });
</script>

{#snippet subheader()}
  <SearchSectionReverse lat={api_request_params?.lat}
                        lon={api_request_params?.lon}
                        zoom={api_request_params?.zoom}
                        api_request_params={api_request_params} />
{/snippet}
<Header {subheader} />

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
    min-width: 200px;
    padding: 15px;
    padding-top: 0;
    display: block;
    float: left;
  }

  #map-wrapper {
    position: relative;
    height: calc(100vh - 250pt);
    min-height: 300px;
    width: 75%;
    padding-right: 20px;
    display: block;
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
      width: 100%;
      height: 300px;
      padding-left: 20px;
    }
  }
</style>
