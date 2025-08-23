<script>
  import { untrack } from 'svelte';
  import { results_store } from '../lib/stores.js';
  import { update_html_title } from '../lib/api_utils.js';
  import { appState } from '../state/AppState.svelte.js';

  import Header from '../components/Header.svelte';
  import SearchSection from '../components/SearchSection.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params = $state.raw();
  let bStructuredSearch = $state();
  let current_result = $state();

  function loaddata(search_params) {
    update_html_title();

    api_request_params = {
      q: search_params.get('q'),
      street: search_params.get('street'),
      city: search_params.get('city'),
      county: search_params.get('county'),
      state: search_params.get('state'),
      country: search_params.get('country'),
      postalcode: search_params.get('postalcode'),
      polygon_geojson: Nominatim_Config.Search_AreaPolygons ? 1 : 0,
      viewbox: search_params.get('viewbox'),
      bounded: search_params.get('bounded'),
      dedupe: (!search_params.has('dedupe') || search_params.get('dedupe') === '1') ? 1 : 0,
      'accept-language': search_params.get('accept-language'),
      countrycodes: search_params.get('countrycodes'),
      layer: search_params.get('layer'),
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
      appState.fetchFromApi('search', api_request_params, function (data) {
        results_store.set(data);

        if (anyStructuredFieldsSet) {
          update_html_title('Result for ' + [
            api_request_params.street,
            api_request_params.city,
            api_request_params.county,
            api_request_params.state,
            api_request_params.country,
            api_request_params.postalcode
          ].filter((text) => text && text.length > 1).join(', '));

          document.querySelector(".nav-tabs a[href='#structured']").click();
          document.querySelector('input[name=street]').focus();
        } else {
          update_html_title('Result for ' + api_request_params.q);

          document.querySelector('input[name=q]').focus();
        }
      });
    } else {
      results_store.set(undefined);
    }
  }

  $effect(() => {
    if (appState.page.tab === 'search') {
      const params = appState.page.params;
      untrack(() => loaddata(params));
    }
  });
</script>

{#snippet subheader()}
  <SearchSection api_request_params={api_request_params} bStructuredSearch={bStructuredSearch} />
{/snippet}
<Header {subheader} />

<div id="content">
  <div class="sidebar">
    <ResultsList bind:current_result reverse_search={false} />
  </div>
  <div id="map-wrapper">
    <Map {current_result} display_minimap={true} />
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
