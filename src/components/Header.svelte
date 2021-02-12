<script>
  import LastUpdated from './LastUpdated.svelte';
  import PageLink from './PageLink.svelte';
</script>

<style>
  header {
    width: 100%;
    padding: 5px 15px;
    z-index: 5;
  }

  .brand {
    white-space: nowrap;
  }

  .brand :global(a:hover) {
    text-decoration: none;
  }

  .brand h1 {
    display: inline;
    font-size: 1.5em;
    color: #333;
  }

  .brand img {
    display: inline-block;
    margin-right: 5px;
    margin-top: -5px;
  }

  .dropdown-menu {
    z-index: 1005;
  }
</style>

<header class="container-fluid">
  <div class="row">
    <div class="col-4">
      <div class="brand">
        <PageLink page="search">
          <img alt="logo" src="images/osm_logo.120px.png" width="30" height="30"/>
          <h1>Nominatim</h1>
        </PageLink>
      </div>
    </div>
    <div class="col-4">
      <LastUpdated/>
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
