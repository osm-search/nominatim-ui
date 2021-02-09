<script>
  import { refresh_page } from '../lib/stores.js';

  export let extra_classes = '';
  export let feature = null;

  let url_params = '';

  function formatShortOSMType(sType) {
    if (sType === 'node') return 'N';
    if (sType === 'way') return 'W';
    if (sType === 'relation') return 'R';
    return '';
  }

  function handleClick() {
    window.history.pushState([], '', 'details.html' + url_params);
    refresh_page();
  }

  $: {
    if (feature !== null && feature.osm_type) {
      let param = '?osmtype=';
      if (feature.osm_type.length == 1) {
        param += encodeURIComponent(feature.osm_type);
      } else {
        param += formatShortOSMType(feature.osm_type);
      }
      param += '&osmid=' + encodeURIComponent(feature.osm_id);
      if (feature.class) {
        param += '&class=' + encodeURIComponent(feature.class);
      } else if (feature.category) {
        param += '&class=' + encodeURIComponent(feature.category);
      }
      url_params = param
    } else {
        url_params = '';
    }
 }
</script>

<a on:click|preventDefault|stopPropagation={handleClick} href="details.html{url_params}" class={extra_classes}><slot></slot></a>
