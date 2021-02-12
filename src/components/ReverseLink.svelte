<script>
import { refresh_page } from '../lib/stores.js';

export let lat;
export let lon;
export let zoom = null;

let params = '';

$: {
  if (lat && lon) {
    let new_params = '?lat=' + encodeURIComponent(lat);
    new_params += '&lon=' + encodeURIComponent(lon);

    if (zoom) {
      new_params += '&zoom=' + encodeURIComponent(zoom);
    }

    params = new_params;
  } else {
    params = '';
  }
}

function handleClick() {
  window.history.pushState([], '', 'reverse.html' + params);
  refresh_page();
}
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href="reverse.html{params}"><slot></slot></a>
