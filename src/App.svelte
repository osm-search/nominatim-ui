<script>
  import * as jquery from 'jquery';
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap/dist/js/bootstrap.bundle.js';

  import { page, refresh_page } from './lib/stores.js';

  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import ReportIssueModal from './components/ReportIssueModal.svelte';
  import SearchPage from './pages/SearchPage.svelte';
  import DetailsPage from './pages/DetailsPage.svelte';
  import PolygonsPage from './pages/PolygonsPage.svelte';
  import DeletablePage from './pages/DeletablePage.svelte';

  $: view = $page.tab;

  $: console.log('siwtch-->', view);

  refresh_page()
</script>

<Header/>
{#if view === 'search'}
<SearchPage reverse_search={false} />
{:else if view === 'reverse'}
<SearchPage reverse_search={true}/>
{:else if view === 'details'}
<DetailsPage />
{:else if view === 'deletable'}
<DeletablePage />
{:else if view === 'polygons'}
<PolygonsPage />
{/if}
<Footer/>
<ReportIssueModal/>
