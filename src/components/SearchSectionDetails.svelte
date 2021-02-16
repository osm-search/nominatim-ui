<script>
  export let api_request_params = {};

  function handleFormSubmit(event) {

    let form_el = event.target;
    let val = form_el.querySelector('input[type=edit]').value;
    let matches = val.match(/^\s*([NWR])(\d+)\s*$/i);

    if (!matches) {
      matches = val.match(/\/(relation|way|node)\/(\d+)\s*$/);
    }

    if (!matches) {
      alert('invalid input');
      return;
    }

    let osmtype_short = matches[1].charAt(0).toUpperCase();
    form_el.querySelector('input[name=osmtype]').setAttribute('value', osmtype_short);
    form_el.querySelector('input[name=osmid]').setAttribute('value', matches[2]);
    form_el.submit();
  }
</script>

<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link" data-toggle="tab" href="#by-osm-type-and-id" class:active={!api_request_params.place_id}>OSM type and OSM id</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-toggle="tab" href="#by-place-id" class:active={api_request_params.place_id}>Place id</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-toggle="tab" href="#by-osm-url">openstreetmap.org URL</a>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane" id="by-osm-type-and-id" role="tabpanel" class:active={!api_request_params.place_id}>
    <form on:submit|preventDefault={handleFormSubmit}
          id="form-by-type-and-id"
          class="form-inline"
          action="details.html">
      <input type="edit"
             class="form-control form-control-sm"
             pattern="^[NWR][0-9]+$"
             placeholder="e.g. N123 or W123 or R123"
             value="{api_request_params.osmtype || ''}{api_request_params.osmid || ''}" />
      <input type="hidden" name="osmtype" />
      <input type="hidden" name="osmid" />
      <input type="submit" class="btn btn-primary btn-sm" value="Show" />
    </form>
  </div>

  <div class="tab-pane" id="by-place-id" role="tabpanel" class:active={api_request_params.place_id}>
    <form class="form-inline" action="details.html">
      <input type="edit"
             class="form-control form-control-sm"
             pattern="^[0-9]+$"
             name="place_id"
             placeholder="e.g. 12345"
             value="{api_request_params.place_id || ''}" />
      <input type="submit"
             class="btn btn-primary btn-sm"
             value="Show" />
    </form>
  </div>

  <div class="tab-pane" id="by-osm-url" role="tabpanel">
    <form on:submit|preventDefault={handleFormSubmit}
          id="form-by-osm-url"
          class="form-inline"
          action="details.html">
      <input type="url"
             class="form-control form-control-sm"
             pattern=".*openstreetmap.*"
             placeholder="e.g. https://www.openstreetmap.org/relation/123" />
      <input type="hidden" name="osmtype" />
      <input type="hidden" name="osmid" />
      <input type="submit" class="btn btn-primary btn-sm" value="Show" />
    </form>
  </div>
</div>

<style>
  .nav-tabs {
    font-size: 0.8em;
  }
  .tab-pane {
    padding-top: 1rem;
  }
  form .form-control{
    margin-right: 5px;
    width: 30em;
  }
</style>
