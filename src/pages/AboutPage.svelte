<script>
  import Header from '../components/Header.svelte';
  import { onMount } from 'svelte';
  import { fetch_content_into_element } from '../lib/api_utils.js';

  onMount(() => {
    fetch_content_into_element('theme/about-help.html', document.getElementById('about-help'));
  });
</script>

<Header />
<div id="about-help" class="container"></div>

<style>
  #about-help {
    max-width: 800px;
    padding: 4em;
  }
</style>