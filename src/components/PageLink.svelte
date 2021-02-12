<script>
import { refresh_page } from '../lib/stores.js';

export let page;

function handleClick() {
  refresh_page(page);
}
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href="{page}.html"><slot></slot></a>
