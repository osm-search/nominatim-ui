<script>
  import { refresh_page } from '../lib/stores.js';

  export let api_request_params = {};

  function handleFormSubmit(event) {
    let form_el = event.target;
    let val = form_el.querySelector('input[type=edit]').value.trim();
    let type_and_id_match = val.match(/^\s*([NWR])(\d+)\s*$/i)
                            || val.match(/\/(relation|way|node)\/(\d+)\s*$/);

    var params = new URLSearchParams();
    if (type_and_id_match) {
      params.set('osmtype', type_and_id_match[1].charAt(0).toUpperCase());
      params.set('osmid', type_and_id_match[2]);
    } else if (val.match(/^\d+$/)) {
      params.set('place_id', val);
    } else {
      alert('invalid input');
      return;
    }

    refresh_page('details', params);
  }
</script>

<form on:submit|preventDefault={handleFormSubmit} class="form-inline" action="details.html">
  <input type="edit"
         class="form-control form-control-sm mr-1"
         pattern="^[NWRnwr]?[0-9]+$|.*openstreetmap.*"
         value="{api_request_params.osmtype || ''}{api_request_params.osmid || ''}{api_request_params.place_id || ''}" />
  <button type="submit" class="btn btn-primary btn-sm">Show</button>
</form>
<small class="form-text text-muted">
  OSM type+id (<em>N123</em>, <em>n123</em>, <em>W123</em>, <em>w123</em>, <em>R123</em>, <em>r123</em>),
  Place id (<em>1234</em>) or
  URL (<em>https://openstreetmap.org/way/123</em>)
</small>

<style>
  form .form-control{
    width: 500px;
    max-width: 100%;
  }
  .form-text em {
    font-family: monospace;
    font-style: normal;
  }
</style>
