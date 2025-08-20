<script>
  import { onMount } from 'svelte';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';

  import Header from '../components/Header.svelte';

  let aStatusData = $state({});
  const configuration = Nominatim_Config;

  const endpoint_url = (typeof configuration.Nominatim_API_Endpoint === 'function') ?
                      configuration.Nominatim_API_Endpoint() :
                      configuration.Nominatim_API_Endpoint;

  function loaddata() {
    fetch_from_api('status', { format: 'json' }, function (data) {
      aStatusData = data;
    });
    update_html_title('Server status');
  }
  onMount(loaddata);
</script>

<Header/>
<div class="container">
  <div class="row">
    <div class="col-sm-12">
      <h1>Server status</h1>

      <dl>
        <dt>API Endpoint</dt>
        <dd><a href={endpoint_url}>{endpoint_url}</a></dd>

        <dt>Software version</dt>
        <dd>{aStatusData.software_version}</dd>

        <dt>Database version</dt>
        <dd>{aStatusData.database_version}</dd>

        <dt>Data last updated</dt>
        <dd>{aStatusData.data_updated}</dd>
      </dl>
    </div>
  </div>
</div>
