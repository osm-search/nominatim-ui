<script>
  import { onMount } from 'svelte';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import { formatOSMType, osmLink } from '../lib/helpers.js';

  import Header from '../components/Header.svelte';

  let aPolygons = [];

  function loaddata() {
    fetch_from_api('polygons', { format: 'json' }, function (data) {
      aPolygons = data;
    });
    update_html_title('Broken polygons');
  }
  onMount(loaddata);
</script>

<Header/>
<div class="container">
  <div class="row">
    <div class="col-sm-12">
      <h1>Broken polygons</h1>

      <p>
        Total number of broken polygons: {aPolygons.length}.
      </p>

      <table class="table table-striped table-hover">
        <thead>
          <th>OSM type</th>
          <th>OSM id</th>
          <th>Class</th>
          <th>Type</th>
          <th>Name</th>
          <th>Country Code</th>
          <th>Error message</th>
          <th>Updated</th>
          <th></th>
        </thead>
        <tbody>
          {#each aPolygons as polygon}
            <tr>
              <td>{polygon.osm_type}</td>
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <td>{@html osmLink(polygon)}</td>
              <td>{polygon.class}</td>
              <td>{polygon.type}</td>
              <td>{polygon.name}</td>
              <td>{polygon.country_code || ''}</td>
              <td>{polygon.errormessage}</td>
              <td>{polygon.updated}</td>
              <td>
                <a href="http://localhost:8111/import?url=https://www.openstreetmap.org/api/0.6/{formatOSMType(polygon.osm_type)}/{polygon.osm_id}/full" target="josm">josm</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
