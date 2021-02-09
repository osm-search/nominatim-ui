<script>
  import { onMount, onDestroy } from 'svelte';
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import { page } from '../lib/stores.js';

  import {
    osmLink, wikipediaLink, coverageType, isAdminBoundary,
    formatAddressRank, formatKeywordToken
  } from '../lib/helpers.js';
  import MapIcon from '../components/MapIcon.svelte';
  import DetailsIndex from '../components/DetailsIndex.svelte';
  import DetailsOneRow from '../components/DetailsOneRow.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';
  import Map from '../components/Map.svelte';

  let aPlace;
  let errorResponse;
  let base_url = window.location.search;
  let current_result;

  function loaddata() {
    var search_params = new URLSearchParams(window.location.search);

    var api_request_params = {
      place_id: search_params.get('place_id'),
      osmtype: search_params.get('osmtype'),
      osmid: search_params.get('osmid'),
      class: search_params.get('class'),
      keywords: search_params.get('keywords'),
      addressdetails: 1,
      hierarchy: (search_params.get('hierarchy') === '1' ? 1 : 0),
      group_hierarchy: 1,
      polygon_geojson: 1,
      format: 'json'
    };

    if (api_request_params.place_id || (api_request_params.osmtype && api_request_params.osmid)) {

      if (api_request_params.place_id) {
        update_html_title('Details for ' + api_request_params.place_id);
      } else {
        update_html_title('Details for ' + api_request_params.osmtype + api_request_params.osmid);
      }

      fetch_from_api('details', api_request_params, function (data) {
        if (data.error) {
          errorResponse = data;
          current_result = undefined;
        } else {
          aPlace = data;
          errorResponse = undefined;
          current_result = data;
        }
      });
    } else {
      aPlace = undefined;
    }
  }

  let page_subscription;
  onMount(() => { page_subscription = page.subscribe(loaddata); });
  onDestroy(() => { page_subscription(); });

</script>

{#if errorResponse}
  {errorResponse.error.message}
{/if}
{#if aPlace}
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>
          {aPlace.localname}
          <small><DetailsLink feature={aPlace}>link to this page</DetailsLink></small>
        </h1>
      </div>
      <div class="col-sm-2 text-right">
        <MapIcon aPlace={aPlace} />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <table id="locationdetails" class="table table-striped">
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                {#each Object.keys(aPlace.names) as name}
                  <div class="line">
                    <span class="name">{aPlace.names[name]}</span> ({name})
                  </div>
                {/each}
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{aPlace.category}:{aPlace.type}</td>
            </tr>
            <tr>
              <td>Last Updated</td>
              <td>{aPlace.indexed_date}</td>
            </tr>
            {#if (isAdminBoundary(aPlace)) }
            <tr>
              <td>Admin Level</td>
              <td>{aPlace.admin_level}</td>
            </tr>
            {/if}
            <tr>
              <td>Search Rank</td>
              <td>{aPlace.rank_search}</td>
            </tr>
            <tr>
              <td>Address Rank</td>
              <td>{aPlace.rank_address} ({formatAddressRank(aPlace.rank_address)})</td>
            </tr>
            {#if aPlace.calculated_importance}
              <tr>
                <td>Importance</td>
                <td>
                  {aPlace.calculated_importance}
                  {#if !aPlace.importance} (estimated){/if}
                </td>
              </tr>
            {/if}
            <tr>
              <td>Coverage</td>
              <td>{coverageType(aPlace)}</td>
            </tr>
            <tr>
              <td>Centre Point (lat,lon)</td>
              <td>
                {aPlace.centroid.coordinates[1]},{aPlace.centroid.coordinates[0]}
              </td>
            </tr>
            <tr>
              <td>OSM</td>
              <td>{@html osmLink(aPlace)}
            </tr>
            <tr>
              <td>
                Place Id
                (<a href="https://nominatim.org/release-docs/develop/api/Output/#place_id-is-not-a-persistent-id">on this server</a>)
              </td>
              <td>{aPlace.place_id}</td>
            </tr>
            {#if aPlace.calculated_wikipedia}
              <tr>
                <td>Wikipedia Calculated</td>
                <td>{@html wikipediaLink(aPlace)}</td>
              </tr>
            {/if}
            <tr>
              <td>Computed Postcode</td>
              <td>{aPlace.calculated_postcode}</td>
            </tr>
            <tr>
              <td>Address Tags</td>
              <td>
                {#each Object.keys(aPlace.addresstags) as name}
                  <div class="line">
                    <span class="name">{aPlace.addresstags[name]}</span> ({name})
                  </div>
                {/each}
              </td>
            </tr>
            <tr>
              <td>Extra Tags</td>
              <td>
                {#each Object.keys(aPlace.extratags) as name}
                  <div class="line">
                    <span class="name">{aPlace.extratags[name]}</span> ({name})
                  </div>
                {/each}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-6">
        <div id="map-wrapper">
          <Map {current_result} />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>Address</h2>
         <table id="address" class="table table-striped table-small">
          <thead>
            <tr>
              <th>Local name</th>
              <th>Type</th>
              <th>OSM</th>
              <th>Address rank</th>
              <th>Admin level</th>
              <th>Distance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#if aPlace.address}
              {#each aPlace.address as addressLine}
                <DetailsOneRow addressLine={addressLine} bDistanceInMeters=false />
              {/each}
            {/if}

            {#if aPlace.linked_places}
              <tr class="all-columns"><td colspan="6"><h2>Linked Places</h2></td></tr>
              {#each aPlace.linked_places as addressLine}
                <DetailsOneRow addressLine={addressLine} bDistanceInMeters=true />
              {/each}
            {/if}

            <tr class="all-columns"><td colspan="6"><h2>Keywords</h2></td></tr>
            {#if aPlace.keywords}
              <tr class="all-columns"><td colspan="6"><h3>Name Keywords</h3></td></tr>
              {#each aPlace.keywords.name as keyword}
                <tr>
                  <td>{formatKeywordToken(keyword.token)}</td>
                  {#if keyword.id}
                    <td>word id: {keyword.id}</td>
                  {/if}
                </tr>
              {/each}

              <tr class="all-columns"><td colspan="6"><h3>Address Keywords</h3></td></tr>
              {#each aPlace.keywords.address as keyword}
                <tr>
                  <td>{formatKeywordToken(keyword.token)}</td>
                  {#if keyword.id}
                    <td>word id: {keyword.id}</td>
                  {/if}
              </tr>
              {/each}
            {:else}
              <tr>
                <td>
                   <a class="btn btn-outline-secondary btn-sm"
                    href="{base_url}&keywords=1">display keywords</a>
                </td>
              </tr>
            {/if}

            <tr class="all-columns"><td colspan="6"><h2>Parent Of</h2></td></tr>
            {#if aPlace.hierarchy}

              {#each Object.keys(aPlace.hierarchy) as type}
                <tr class="all-columns"><td colspan="6"><h3>{type}</h3></td></tr>
                {#each aPlace.hierarchy[type] as line}
                  <DetailsOneRow addressLine={line} bDistanceInMeters=true />
               {/each}
              {/each}

              {#if Object.keys(aPlace.hierarchy) > 500}
                <p>There are more child objects which are not shown.</p>
              {/if}
            {:else}
              <tr>
                <td>
                   <a class="btn btn-outline-secondary btn-sm"
                    href="{base_url}&hierarchy=1">display child places</a>
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{:else if (window.location.search === '')}
  <DetailsIndex/>
{:else}
  No such place found.
{/if}



<style>
  h1 {
    margin: 10px 0;
    padding-left: 8px;
  }

  h1 small :global(a) {
    font-size: 0.5em;
    white-space: nowrap;
  }

  h2 {
    font-size: 2em;
    padding-left: 8px;
    background-color: white;
  }
  h3 {
    font-size: 1.5em;
    padding-left: 8px;
  }

  tr.all-columns {
    background-color: white !important; 
    border: none;
  }
  tr.all-columns td {
    border-top: none !important;
    padding-left: 0 !important;
  }

  .table {
    width: 100%;
  }
  .table td {
    font-size: 0.9em;
  }
  .table>thead>tr>th, .table>tbody>tr>td {
    padding: 2px 8px;
  }
  .name{
    font-weight: bold;
  }
  #map-wrapper {
    width:100%;
    min-height: auto;
    height:300px;
    border: 1px solid #666;
  }
</style>
