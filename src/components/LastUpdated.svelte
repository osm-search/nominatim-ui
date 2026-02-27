<script>
  import { onMount } from 'svelte';
  import PageLink from './PageLink.svelte';
  import * as timeago from 'timeago.js';
  import { appState } from '../state/AppState.svelte.js';

  let last_updated_date = $state();

  const last_api_request_url = $derived.by(() => {
    const url = appState.lastApiRequestURL;

    if (url) {
      const urlobj = new URL(url, window.location.origin);
      urlobj.searchParams.delete('polygon_geojson');
      return urlobj.toString();
    }
  });

  onMount(() => {
    appState.fetchFromApi('status', { format: 'json' }, function (data) {
      last_updated_date = data.data_updated;
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
    background-color: var(--bs-primary-bg-subtle);
    z-index: 100;
  }
</style>

<div id="last-updated" class="container-fluid py-2 px-4 mb-3">
  <div id="loading"
       class="py-2 px-4"
       style:display={appState.requestProgress === 'start' ? 'block' : 'none'}>
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
        <abbr id="data-date" title="{last_updated_date} (UTC timezone)">
          {timeago.format(new Date(last_updated_date))}
        </abbr>
      {/if}
      (<PageLink page="status" text="Details" />)
    </div>
  </div>
</div>
