<script>
  import PageLink from './PageLink.svelte';
  import ReverseLink from './ReverseLink.svelte';
  import LastUpdated from './LastUpdated.svelte';
  import Error from './Error.svelte';

  import { map_store, page } from '../lib/stores.js';

  let { subheader } = $props();

  const page_title = Nominatim_Config.Page_Title;
  const reverse_only = Nominatim_Config.Reverse_Only;

  let view = $state();
  let map_lat = $state();
  let map_lon = $state();

  map_store.subscribe(map => {
    if (!map) return;

    map.on('move', function () {
      map_lat = map.getCenter().lat.toFixed(5);
      map_lon = map.getCenter().lng.toFixed(5);
    });
  });

  page.subscribe(pg => { view = pg.tab; });
</script>

<style>
  .navbar-brand :global(a:hover) {
    text-decoration: none;
  }

  .navbar-brand h1 {
    display: inline;
    font-size: 1.2em;
    color: var(--bs-body-color);
  }

  .navbar-brand img {
    display: inline-block;
    margin-right: 5px;
    margin-top: -5px;
  }

  .nav-item {
    white-space: nowrap;
  }

  .page-title-section {
    display: none;
    text-align: center;
    padding: 1em;
  }
  @media (max-width: 600px) {
    .page-title-section {
      display: block;
    }
  }

  .search-section {
    padding: 1em 30px;
    background-color: var(--bs-tertiary-bg);
    border-top: 2px solid var(--bs-border-color);
    border-bottom: 2px solid var(--bs-border-color);
  }

</style>

{#snippet mainPageLink()}
  <img alt="logo" id="theme-logo" src="theme/logo.png" />
  <h1>{page_title}</h1>
{/snippet}

<header class="container-fluid">
  <nav class="navbar navbar-expand-sm navbar-light">
    <div class="container-fluid">
      <!-- Brand -->
      <div class="navbar-brand">
        <PageLink text_snippet={mainPageLink} page={reverse_only ? 'reverse' : 'search'} />
      </div>
      <!-- Toggler (hamburger button) -->
      <button class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Left-aligned links -->
        <ul class="navbar-nav me-auto">
          {#if !reverse_only}
            <li class="nav-item">
              <PageLink page="search"
                        text="Search"
                        extra_classes="nav-link {view === 'search' ? 'active' : ''}" />
            </li>
          {/if}
          <li class="nav-item">
            <ReverseLink lat={map_lat}
                         lon={map_lon}
                         extra_classes="nav-link {view === 'reverse' ? 'active' : ''}">
              Reverse
            </ReverseLink>
          </li>
          <li class="nav-item">
            <PageLink page="details"
                      text="Search By ID"
                      extra_classes="nav-link {view === 'details' ? 'active' : ''}" />
          </li>
        </ul>
      </div>
      <!-- Right aligned links -->
      <ul class="navbar-nav">
        <li class="nav-item position-relative">
          <button class="btn nav-link dropdown-toggle" id="bd-theme" type="button"
                  data-bs-toggle="dropdown" aria-label="Toggle color theme">
            <span id="bd-theme-text">Color</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
            <li>
              <button type="button" class="dropdown-item" data-bs-theme-value="light">
                Light
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" data-bs-theme-value="dark">
                Dark
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" data-bs-theme-value="auto">
                Auto
              </button>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <PageLink page="about"
                    text="Abount & Help"
                    extra_classes="nav-link {view === 'about' ? 'active' : ''}" />
        </li>
      </ul>
    </div>
  </nav>
</header>
<section class="page-title-section">
  <h2>{view}</h2>
</section>
<section class="search-section">
  {@render subheader?.()}
</section>
<Error/>
<LastUpdated/>
