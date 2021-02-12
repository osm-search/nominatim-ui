<script>
  import { refresh_page } from '../lib/stores.js';

  export let extra_classes = '';
  export let feature = null;

  let url_params = new URLSearchParams();
  let href = 'details.html';

  function formatShortOSMType(sType) {
    if (sType === 'node') return 'N';
    if (sType === 'way') return 'W';
    if (sType === 'relation') return 'R';
    return '';
  }

  function handleClick() {
    refresh_page('details', url_params);
  }

  $: {
    let new_params = new URLSearchParams();

    if (feature !== null && feature.osm_type) {
      if (feature.osm_type.length == 1) {
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
    }

    url_params = new_params;
 }

 $: {
   let param_str = url_params.toString();
   href = 'details.html' + (param_str ? '?' : '') + param_str;
 }
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href={href} class={extra_classes}><slot></slot></a>
