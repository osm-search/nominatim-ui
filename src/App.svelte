<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import { onMount } from 'svelte';
  import { page, refresh_page } from './lib/stores.js';

  import Footer from './components/Footer.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import ReversePage from './pages/ReversePage.svelte';
  import DetailsPage from './pages/DetailsPage.svelte';
  import PolygonsPage from './pages/PolygonsPage.svelte';
  import DeletablePage from './pages/DeletablePage.svelte';
  import StatusPage from './pages/StatusPage.svelte';
  import AboutPage from './pages/AboutPage.svelte';

  let view = $state();

  onMount(() => {
    page.subscribe((pageinfo) => {
      if (pageinfo.tab !== view) {
        view = pageinfo.tab;
      }
    })
  });

  refresh_page();
</script>

<!-- deal with back-button and other user action -->
<svelte:window on:popstate={() => refresh_page()} />

{#if view === 'search'}
<SearchPage />
{:else if view === 'reverse'}
<ReversePage />
{:else if view === 'details'}
<DetailsPage />
{:else if view === 'deletable'}
<DeletablePage />
{:else if view === 'polygons'}
<PolygonsPage />
{:else if view === 'status'}
<StatusPage />
{:else if view === 'about'}
<AboutPage />
{/if}
<Footer/>
