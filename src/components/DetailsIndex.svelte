<script>
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
<div class="container" id="details-index-page">
  <div class="row">
    <div class="col-md-12">

      <h1>Show details for place</h1>

      <div class="search-form">
        <h4>Search by place id</h4>

        <form class="form-inline" action="details.html">
          <input type="edit"
                 class="form-control form-control-sm"
                 pattern="^[0-9]+$"
                 name="place_id"
                 placeholder="12345" />
          <input type="submit"
                 class="btn btn-primary btn-sm"
                 value="Show" />
        </form>
      </div>

      <div class="search-form">
        <h4>Search by OSM type and OSM id</h4>

        <form on:submit|preventDefault={handleFormSubmit}
              id="form-by-type-and-id"
              class="form-inline"
              action="details.html">
          <input type="edit"
                 class="form-control form-control-sm"
                 pattern="^[NWR][0-9]+$"
                 placeholder="N123 or W123 or R123" />
          <input type="hidden" name="osmtype" />
          <input type="hidden" name="osmid" />
          <input type="submit" class="btn btn-primary btn-sm" value="Show" />
        </form>
      </div>

      <div class="search-form">
        <h4>Search by openstreetmap.org URL</h4>

        <form on:submit|preventDefault={handleFormSubmit}
              id="form-by-osm-url"
              class="form-inline"
              action="details.html">
          <input type="edit"
                 class="form-control form-control-sm"
                 pattern=".*openstreetmap.*"
                 placeholder="https://www.openstreetmap.org/relation/123" />
          <input type="hidden" name="osmtype" />
          <input type="hidden" name="osmid" />
          <input type="submit" class="btn btn-primary btn-sm" value="Show" />
        </form>
      </div>

    </div>
  </div>
</div>

<style>
  .search-form {
    padding: 20px 10px;
    margin: 2em 0;
  }
  .search-form h4 {
    margin-top: 0;
  }
  .search-form .form-control{
    margin-right: 5px;
    width: 30em;
  }
</style>
