<script>
  import { appState } from '../state/AppState.svelte.js';

  const {
    page,
    text,
    text_snippet,
    params_hash = {},
    extra_classes = '' } = $props();

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    appState.refreshPage(page, new URLSearchParams(params_hash));
  }

  const href = $derived.by(() => {
    const param_str = new URLSearchParams(params_hash).toString();
    return page + '.html' + (param_str ? '?' : '') + param_str;
  });
</script>

<a onclick={handleClick} href={href} class={extra_classes}>
  {#if text_snippet}{@render text_snippet()}{:else}{text}{/if}
</a>
