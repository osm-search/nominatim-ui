<script>
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import { appState } from './state/AppState.svelte.js';

  import Footer from './components/Footer.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import ReversePage from './pages/ReversePage.svelte';
  import DetailsPage from './pages/DetailsPage.svelte';
  import PolygonsPage from './pages/PolygonsPage.svelte';
  import DeletablePage from './pages/DeletablePage.svelte';
  import StatusPage from './pages/StatusPage.svelte';
  import AboutPage from './pages/AboutPage.svelte';
</script>

<!-- deal with back-button and other user action -->
<svelte:window onpopstate={() => appState.refreshPage()} />

{#if appState.page.tab === 'search'}
<SearchPage />
{:else if appState.page.tab === 'reverse'}
<ReversePage />
{:else if appState.page.tab === 'details'}
<DetailsPage />
{:else if appState.page.tab === 'deletable'}
<DeletablePage />
{:else if appState.page.tab === 'polygons'}
<PolygonsPage />
{:else if appState.page.tab === 'status'}
<StatusPage />
{:else if appState.page.tab === 'about'}
<AboutPage />
{/if}
<Footer/>
