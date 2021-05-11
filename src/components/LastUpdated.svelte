<script>
  import PageLink from './PageLink.svelte';
  import * as timeago from 'timeago.js';
  import { last_api_request_url_store } from '../lib/stores.js';
  import { fetch_from_api } from '../lib/api_utils.js';

  let last_updated_date;
  let last_api_request_url;
  let fetch_running = false; // prevent multiple parallel fetch runs

  last_api_request_url_store.subscribe(url => {
    last_api_request_url = url;

    if (last_api_request_url) {
      last_api_request_url = new URL(last_api_request_url, window.location.origin);
      last_api_request_url.searchParams.delete('polygon_geojson');
      last_api_request_url = last_api_request_url.toString();
    }

    if (fetch_running || last_updated_date) return;

    fetch_running = true;

    fetch_from_api('status', { format: 'json' }, function (data) {
      last_updated_date = data.data_updated;
      fetch_running = false;
    });
  });
</script>

<style>
  #last-updated {
    position: relative;
    font-size: 0.8rem;
    font-style: italic;
  }
  #loading {
    display: none;
    position: absolute;
    padding: 0.5em 1em;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #eee;
    z-index: 100;
  }
</style>

<div id="last-updated" class="container-fluid py-2 px-4 mb-3">
  <div id="loading" class="py-2 px-4">
    <div class="spinner-border spinner-border-sm text-primary me-1" role="status"></div>
    Loading data from API ...
  </div>
  <div class="row">
    <div class="col-sm-6">
      {#if last_api_request_url}
        <div id="api-request">
          Data from <a href="{last_api_request_url}">API request</a>
          <span id="api-request-debug">
            (<a href="{last_api_request_url}&debug=1">debug output</a>)
          </span>
        </div>
      {/if}
    </div>
    <div class="col-sm-6 text-end">
      {#if last_updated_date}
        Data last updated:
        <abbr id="data-date" title="{last_updated_date} (UTC timezone)">{timeago.format(new Date(last_updated_date))}</abbr>
      {/if}
      (<PageLink page="status">Details</PageLink>)
    </div>
  </div>
</div>
