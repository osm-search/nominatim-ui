<script>
  import { onMount } from 'svelte';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import { osmLink } from '../lib/helpers.js';

  import Header from '../components/Header.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';

  let aPolygons = $state([]);

  function loaddata() {
    fetch_from_api('deletable', { format: 'json' }, function (data) {
      aPolygons = data;
    });
    update_html_title('Deletable objects');
  }
  onMount(loaddata);
</script>

<Header/>
<div class="container">
  <div class="row">
    <div class="col-sm-12">
      <h1>Deletable</h1>

      <p>
        {aPolygons.length} objects have been deleted in OSM but
        are still in the Nominatim database.
      </p>

      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Place id</th>
            <th>Country Code</th>
            <th>Name</th>
            <th>OSM object</th>
            <th>Class</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {#each aPolygons as polygon}
          <tr>
            <td><DetailsLink feature={polygon}>{polygon.place_id}</DetailsLink></td>
            <td>{polygon.country_code}</td>
            <td>{polygon.name}</td>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <td>{@html osmLink(polygon)}</td>
            <td>{polygon.class}</td>
            <td>{polygon.type}</td>
          </tr>
          {/each}
        </tbody>
      </table>

    </div>
  </div>
</div>

