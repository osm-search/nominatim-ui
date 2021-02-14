<script>
import { refresh_page } from '../lib/stores.js';

export let page;
export let extra_classes = '';

function handleClick() {
  refresh_page(page);
}
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href="{page}.html" class={extra_classes}><slot></slot></a>
