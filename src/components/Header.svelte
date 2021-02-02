<script>

  import { last_updated_store } from '../lib/stores.js';

  let last_updated;

  last_updated_store.subscribe(data => {
    if (!data) { return; }
    last_updated = data;
  });

</script>
<style>
  header {
    width: 100%;
    padding: 5px 15px;
    z-index: 5;
  }

  header .brand {
    white-space: nowrap;
  }

  header .brand a:hover{
    text-decoration: none;
  }

  header .brand h1 {
    display: inline;
    font-size: 1.5em;
    color: #333;
  }

  header .brand img {
    display: inline-block;
    margin-right: 5px;
    margin-top: -5px;
  }

  header #last-updated {
    font-size: 0.7em;
    white-space: nowrap;
    text-align: center;
/*    display: none;
*/  }

  header .dropdown-menu {
    z-index: 1005;
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

<header class="container-fluid">
  <div class="row">
    <div class="col-4">
      <div class="brand">
        <a href="search.html">
          <img alt="logo" src="images/osm_logo.120px.png" width="30" height="30"/>
          <h1>Nominatim</h1>
        </a>
      </div>
    </div>
    <div class="col-4">
      <div id="last-updated" class="text-center">
        <div id="loading">loading...</div>
        {#if last_updated}
          <div id="api-request">
            Data from <a href="{last_updated.api_request_url}">API request</a>
            <span id="api-request-debug">(<a href="{last_updated.api_request_url_debug}">debug output</a>)</span>
          </div>
          Data last updated: <span id="data-date">{last_updated.date}</span>
        {/if}
      </div>
    </div>
    <div class="col-4 text-right">
      <div class="dropdown">
        <button class="dropdown-toggle btn btn-sm btn-outline-secondary" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          About &amp; Help
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <a class="dropdown-item" href="https://nominatim.org/release-docs/develop/api/Overview/" target="_blank">API Reference</a>
          <a class="dropdown-item" href="https://nominatim.org/release-docs/develop/api/Faq/" target="_blank">FAQ</a>
          <a class="dropdown-item" href="https://help.openstreetmap.org/tags/nominatim/">OpenStreetMap Help</a>
          <a class="dropdown-item" href="https://github.com/osm-search/Nominatim">Nominatim on Github</a>
          <a class="dropdown-item" href="https://github.com/osm-search/nominatim-ui">This frontend on Github</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#report-issue" data-toggle="modal" data-target="#report-modal">Report problem with results</a>
        </div>
      </div>
    </div>
  </div>
</header>
