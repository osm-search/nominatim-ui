<script>
  import PageLink from './PageLink.svelte';
  import ReverseLink from './ReverseLink.svelte';
  import LastUpdated from './LastUpdated.svelte';

  import { page } from '../lib/stores.js';

  $: view = $page.tab;
</script>

<style>
  .navbar-brand :global(a:hover) {
    text-decoration: none;
  }

  .navbar-brand h1 {
    display: inline;
    font-size: 1.2em;
    color: #333;
  }

  .navbar-brand img {
    display: inline-block;
    margin-right: 5px;
    margin-top: -5px;
  }

  .nav-item {
    white-space: nowrap;
  }

  .dropdown-menu { /* need to be above map markers */
    z-index: 1005;
  }

  .search-section {
    padding: 1em 30px;
    background-color: #f5f5f5;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
  }
</style>

<header class="container-fluid">
  <nav class="navbar navbar-expand-sm navbar-light">
    <div class="navbar-brand">
      <PageLink page="search">
        <img alt="logo" src="images/osm_logo.120px.png" width="30" height="30"/>
        <h1>Nominatim</h1>
      </PageLink>
    </div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item {view === 'search' ? 'active' : ''}">
          <PageLink page="search" extra_classes="nav-link ">Search</PageLink>
        </li>
        <li class="nav-item {view === 'reverse' ? 'active' : ''}">
          <ReverseLink extra_classes="nav-link ">Reverse</ReverseLink>
        </li>
        <li class="nav-item {view === 'details' ? 'active' : ''}">
          <PageLink page="details" extra_classes="nav-link ">Search By ID</PageLink>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#open-about-dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            About &amp; Help
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="https://nominatim.org/release-docs/develop/api/Overview/" target="_blank">API Reference</a>
            <a class="dropdown-item" href="https://nominatim.org/release-docs/develop/api/Faq/" target="_blank">FAQ</a>
            <a class="dropdown-item" href="https://help.openstreetmap.org/tags/nominatim/">OpenStreetMap Help</a>
            <a class="dropdown-item" href="https://github.com/osm-search/Nominatim">Nominatim on Github</a>
            <a class="dropdown-item" href="https://github.com/osm-search/nominatim-ui">This frontend on Github</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#report-issue" data-toggle="modal" data-target="#report-modal">Report problem with results</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</header>
<section class="search-section">
  <slot/>
</section>
<LastUpdated/>
