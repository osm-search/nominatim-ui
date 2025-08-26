<script>
  import escapeHtml from 'escape-html';

  let { wikipedia } = $props();

  const linkParts = $derived(wikipedia ? wikipedia.split(':', 2) : null);
  const href= $derived(
    `https://${escapeHtml(linkParts[0])}.wikipedia.org/wiki/${escapeHtml(linkParts[1])}`);
</script>

{#if wikipedia}
<a {href} target="_blank">{wikipedia}</a>
{/if}
