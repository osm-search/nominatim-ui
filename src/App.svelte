<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import { page, refresh_page } from './lib/stores.js';

  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import ReportIssueModal from './components/ReportIssueModal.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import ReversePage from './pages/ReversePage.svelte';
  import DetailsPage from './pages/DetailsPage.svelte';
  import PolygonsPage from './pages/PolygonsPage.svelte';
  import DeletablePage from './pages/DeletablePage.svelte';

  $: view = $page.tab;

  refresh_page();
</script>

// deal with back-button and other user action
<svelte:window on:popstate={refresh_page} />

<Header/>
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
{/if}
<Footer/>
<ReportIssueModal/>
