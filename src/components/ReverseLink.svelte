<script>
import { refresh_page } from '../lib/stores.js';

export let lat;
export let lon;
export let zoom = null;
export let extra_classes = '';

let params = new URLSearchParams();
let href = 'reverse.html';

$: {
  let new_params = new URLSearchParams();

  if (lat && lon) {
    new_params.set('lat', lat);
    new_params.set('lon', lon);

    if (zoom) {
      new_params.set('zoom', zoom);
    }
  }

  params = new_params;
}

$: {
  let param_str = params.toString();
  href = 'reverse.html' + (param_str ? '?' : '') + param_str;
}
</script>

<a on:click|preventDefault|stopPropagation={() => refresh_page('reverse', params)} href={href} class={extra_classes}><slot></slot></a>
