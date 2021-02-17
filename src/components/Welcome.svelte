<script>
  import { onMount } from 'svelte';
  import { fetch_content_into_element } from '../lib/api_utils.js';

  onMount(() => {
    fetch_content_into_element('theme/welcome.html', document.getElementById('welcome'));
  });
</script>

<div id="welcome"></div>
