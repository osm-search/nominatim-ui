<script>
import { refresh_page } from '../lib/stores.js';

export let page;

function handleClick() {
  window.history.pushState([], '', page + '.html');
  refresh_page();
}
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href="{page}.html"><slot></slot></a>
