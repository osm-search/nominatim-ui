<script>
  import { page, results_store } from '../lib/stores.js';
  import { get_config_value } from '../lib/config_reader.js';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';
  import SearchSectionReverse from '../components/SearchSectionReverse.svelte';
  import ResultsList from '../components/ResultsList.svelte';
  import Map from '../components/Map.svelte';

  let api_request_params;
  let current_result;
  let position_marker; // what the user searched for

  function loaddata(search_params) {
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
    } else {
      results_store.set(undefined);
    }
  }

  $: {
    let pageinfo = $page;
    if (pageinfo.tab === 'reverse') {
      loaddata(pageinfo.params);
    }
  }
</script>

<Header>
  <SearchSectionReverse {...api_request_params} />
</Header>

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
