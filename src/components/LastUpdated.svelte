<script>
  import { last_api_request_url_store } from '../lib/stores.js';
  import { fetch_from_api } from '../lib/api_utils.js';

  let last_updated_date;
  let last_api_request_url;

  last_api_request_url_store.subscribe(url => {
    last_api_request_url = url;
    fetch_from_api('status', { format: 'json' }, function (data) {
      last_updated_date = data.data_updated;
    });
  });
</script>

<style>
  #last-updated {
    font-size: 0.7em;
    white-space: nowrap;
    text-align: center;
  }
  #loading {
    display: none;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: #eee;
    z-index: 100;
    padding: 10px;
    text-align: center;
  }
</style>

<div id="last-updated">
  <div id="loading">loading...</div>
  {#if last_updated_date}
    {#if last_api_request_url}
      <div id="api-request">
        Data from <a href="{last_api_request_url}">API request</a>
        <span id="api-request-debug">
          (<a href="{last_api_request_url}&debug=1">debug output</a>)
        </span>
      </div>
    {/if}
    Data last updated: <span id="data-date">{last_updated_date}</span>
  {/if}
</div>
