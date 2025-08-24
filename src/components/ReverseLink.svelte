<script>
import { appState } from '../state/AppState.svelte.js';

let {
  lat = null,
  lon = null,
  zoom = null,
  text,
  extra_classes = ''
} = $props();

const params = $derived.by(() => {
  const new_params = {};

  if (lat && lon) {
    new_params.lat = lat;
    new_params.lon = lon;

    if (zoom) {
      new_params.set('zoom', zoom);
    }
  }

  return new URLSearchParams(new_params);
});

const href = $derived.by(() => {
  let param_str = params.toString();
  return 'reverse.html' + (param_str ? '?' : '') + param_str;
});

function onClick(e) {
  e.preventDefault();
  e.stopPropagation();
  appState.refreshPage('reverse', params);
}

</script>

<a onclick={onClick} href={href} class={extra_classes}>{text}</a>
