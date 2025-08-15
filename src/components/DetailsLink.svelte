<script>
  import { refresh_page } from '../lib/stores.js';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  let { text = 'details', extra_classes = '', feature = null } = $props();

  function formatShortOSMType(sType) {
    if (sType === 'node') return 'N';
    if (sType === 'way') return 'W';
    if (sType === 'relation') return 'R';
    return '';
  }

  const url_params = $derived.by(() => {
    const new_params = new SvelteURLSearchParams();

    if (feature !== null) {
      if (feature.osm_type) {
        if (feature.osm_type.length === 1) {
          new_params.set('osmtype', feature.osm_type);
        } else {
          new_params.set('osmtype', formatShortOSMType(feature.osm_type));
        }

        new_params.set('osmid', feature.osm_id);

        if (feature.class) {
          new_params.set('class', feature.class);
        } else if (feature.category) {
          new_params.set('class', feature.category);
        }
      } else if (feature.place_id) {
        new_params.set('place_id', feature.place_id);
      }
    }
    return new_params;
  });

  const href = $derived.by(() => {
    const param_str = url_params.toString();
    return 'details.html' + (param_str ? '?' : '') + param_str;
  });

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    refresh_page('details', url_params);
  }
</script>

<a onclick={handleClick} href={href} class={extra_classes}>{text}</a>
