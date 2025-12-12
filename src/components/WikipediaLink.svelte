<script>
  // de:Überwasserkirche
  let { wikipedia } = $props();

  const linkParts = $derived(wikipedia ? wikipedia.split(':', 2) : null);
  const subDomain = $derived(String(linkParts[0]).toLowerCase().replace(/[^a-z0-9-]/g, ''));

  // https://de.wikipedia.org/wiki/%C3%9Cberwasserkirche
  const href= $derived(
    `https://${subDomain || 'en'}.wikipedia.org/wiki/${encodeURIComponent(linkParts[1])}`);
</script>

{#if wikipedia}
<a {href} target="_blank">{wikipedia}</a>
{/if}
