<script>
  import { appState } from '../state/AppState.svelte.js';

  let { text = 'details', extra_classes = '', feature = null } = $props();

  function formatShortOSMType(sType) {
    if (sType === 'node') return 'N';
    if (sType === 'way') return 'W';
    if (sType === 'relation') return 'R';
    return '';
  }

  const url_params = $derived.by(() => {
    const new_params = {};

    if (feature !== null) {
      if (feature.osm_type) {
        if (feature.osm_type.length === 1) {
          new_params.osmtype = feature.osm_type;
        } else {
          new_params.osmtype = formatShortOSMType(feature.osm_type);
        }

        new_params.osmid = feature.osm_id;

        if (feature.class) {
          new_params.class = feature.class;
        } else if (feature.category) {
          new_params.class = feature.category;
        }
      } else if (feature.place_id) {
        new_params.place_id = feature.place_id;
      }
    }
    return new URLSearchParams(new_params);
  });

  const href = $derived.by(() => {
    const param_str = url_params.toString();
    return 'details.html' + (param_str ? '?' : '') + param_str;
  });

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    appState.refreshPage('details', url_params);
  }
</script>

<a onclick={handleClick} href={href} class={extra_classes}>{text}</a>
