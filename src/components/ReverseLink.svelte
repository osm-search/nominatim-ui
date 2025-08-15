<script>
import { refresh_page } from '../lib/stores.js';
import { SvelteURLSearchParams } from 'svelte/reactivity';

let { lat = null, lon = null, zoom = null, extra_classes = '' } = $props();

const params = $derived.by(() => {
  let new_params = new SvelteURLSearchParams();

  if (lat && lon) {
    new_params.set('lat', lat);
    new_params.set('lon', lon);

    if (zoom) {
      new_params.set('zoom', zoom);
    }
  }

  return new_params;
});

const href = $derived.by(() => {
  let param_str = params.toString();
  return 'reverse.html' + (param_str ? '?' : '') + param_str;
});

function onClick(e) {
  e.preventDefault();
  e.stopPropagation();
  refresh_page('reverse', params);
}

</script>

<a onclick={onClick} href={href} class={extra_classes}>
  <slot></slot>
</a>
