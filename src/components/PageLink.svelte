<script>
  import { refresh_page } from '../lib/stores.js';

  export let page;
  export let params_hash = {};
  export let extra_classes = '';
  let href = page + '.html';

  function handleClick() {
    refresh_page(page, new URLSearchParams(params_hash));
  }

  $: {
    let param_str = new URLSearchParams(params_hash).toString();
    href = page + '.html' + (param_str ? '?' : '') + param_str;
  }
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href={href} class={extra_classes}><slot></slot></a>
