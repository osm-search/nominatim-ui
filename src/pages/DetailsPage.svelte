<script>
  import { untrack } from 'svelte';
  import { update_html_title } from '../lib/api_utils.js';
  import { appState } from '../state/AppState.svelte.js';

  import {
    coverageType, isAdminBoundary,
    formatAddressRank, formatKeywordToken, formatOSMType
  } from '../lib/helpers.js';
  import Header from '../components/Header.svelte';
  import MapIcon from '../components/MapIcon.svelte';
  import SearchSectionDetails from '../components/SearchSectionDetails.svelte';
  import DetailsTableHeader from '../components/DetailsTableHeader.svelte';
  import DetailsOneRow from '../components/DetailsOneRow.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';
  import DetailsPostcodeHint from '../components/DetailsPostcodeHint.svelte';
  import InfoRowList from '../components/DetailsInfoRowList.svelte';
  import WikipediaLink from '../components/WikipediaLink.svelte';
  import OsmLink from '../components/OsmLink.svelte';
  import Map from '../components/Map.svelte';

  let aPlace = $state();
  let base_url = $state();
  let api_request_params = $state.raw();
  let api_request_finished = $state(false);

  function loaddata(search_params) {
    api_request_params = {
      place_id: search_params.get('place_id'),
      osmtype: search_params.get('osmtype'),
      osmid: search_params.get('osmid'),
      class: search_params.get('class'),
      keywords: search_params.get('keywords'),
      addressdetails: 1,
      entrances: 1,
      hierarchy: (search_params.get('hierarchy') === '1' ? 1 : 0),
      group_hierarchy: 1,
      polygon_geojson: 1,
      format: 'json'
    };
    api_request_finished = false;

    if (api_request_params.place_id || (api_request_params.osmtype && api_request_params.osmid)) {

      if (api_request_params.place_id) {
        update_html_title('Details for ' + api_request_params.place_id);
      } else {
        update_html_title('Details for ' + api_request_params.osmtype + api_request_params.osmid);
      }

      appState.fetchFromApi('details', api_request_params, function (data) {
        window.scrollTo(0, 0);
        api_request_finished = true;
        aPlace = (data && !data.error) ? data : undefined;
      });
    } else {
      aPlace = undefined;
    }
  }

  function place_has_keywords(aThisPlace) {
    // Return false if Nominatim API sends 'keywords: { name: [], address: [] }'
    // Like no longer needed after Nominatim version 4.3
    return (
      aThisPlace.keywords && aThisPlace.keywords.name && aThisPlace.keywords.address
      && (aThisPlace.keywords.name.length > 0 || aThisPlace.keywords.address.length > 0)
    );
  }

  function country_code(aThisPlace) {
    let aLine = aThisPlace.address.find((address_line) => address_line.type === 'country_code');
    return aLine ? aLine.localname : null;
  }

  $effect(() => {
    if (appState.page.tab === 'details') {
      const params = appState.page.params;
      untrack(() => {
        loaddata(params);
        base_url = window.location.search;
      });
    }
  });

  const reverse_only = Nominatim_Config.Reverse_Only;
</script>

{#snippet subheader()}
  <SearchSectionDetails api_request_params={api_request_params}/>
{/snippet}
<Header {subheader} />

<div class="container">
  {#if aPlace}
    <div class="row">
      <div class="col-sm-10">
        <h1>
          {aPlace.localname || `${formatOSMType(aPlace.osm_type)} ${aPlace.osm_id}` }
          <small><DetailsLink feature={aPlace} text="link to this page" /></small>
        </h1>
      </div>
      <div class="col-sm-2 text-end">
        <MapIcon aPlace={aPlace} />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <table id="locationdetails" class="table table-striped table-responsive">
          <tbody>
            <tr><td>Name</td><td>
            {#if aPlace.names && typeof (aPlace.names) === 'object'
              && Object.keys(aPlace.names).length}
              <InfoRowList items={aPlace.names} />
            {:else}
              <span class="noname fw-bold">No Name</span>
            {/if}
            </td></tr>
            <tr><td>Type</td><td>{aPlace.category}:{aPlace.type}</td></tr>
            <tr><td>Last Updated</td><td>{aPlace.indexed_date}</td></tr>
            {#if (isAdminBoundary(aPlace)) }
              <tr><td>Admin Level</td><td>{aPlace.admin_level}</td></tr>
            {/if}
            <tr><td>Search Rank</td><td>{aPlace.rank_search}</td></tr>
            <tr><td>Address Rank</td><td>
              {aPlace.rank_address} ({formatAddressRank(aPlace.rank_address)})
            </td></tr>
            {#if aPlace.calculated_importance}
              <tr><td>Importance</td><td>
                  {aPlace.calculated_importance}
                  {#if !aPlace.importance} (estimated){/if}
              </td></tr>
            {/if}
            <tr><td>Coverage</td><td>{coverageType(aPlace)}</td></tr>
            <tr><td>Centre Point (lat,lon)</td><td>
                {aPlace.centroid.coordinates[1]},{aPlace.centroid.coordinates[0]}
            </td></tr>
            <tr><td>OSM</td><td>
              <OsmLink osmType={aPlace.osm_type} osmId={aPlace.osm_id}/>
            </td></tr>
            <tr><td>Place Id</td><td>
               {aPlace.place_id}
               (<a href="https://nominatim.org/release-docs/develop/api/Output/#place_id-is-not-a-persistent-id">
                 on this server
               </a>)
            </td></tr>
            {#if aPlace.calculated_wikipedia}
              <tr><td>Wikipedia Calculated</td><td>
              <WikipediaLink wikipedia={aPlace.calculated_wikipedia} />
              </td></tr>
            {/if}
            <tr><td>Computed Postcode</td><td>
              {#if aPlace.calculated_postcode}
                {aPlace.calculated_postcode}
                <DetailsPostcodeHint postcode={aPlace.calculated_postcode}
                                     lat={aPlace.centroid.coordinates[1]}
                                     lon={aPlace.centroid.coordinates[0]} />
              {/if}
            </td></tr>
            <tr><td>Address Tags</td><td>
              <InfoRowList items={aPlace.addresstags} />
            </td></tr>
            <tr><td>Extra Tags</td><td>
              <InfoRowList items={aPlace.extratags} />
            </td></tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-6">
        <div id="map-wrapper">
          <Map current_result={aPlace} />
        </div>
      </div>
    </div>
  {:else if (window.location.search !== '' && api_request_finished)}
    No such place found.
  {/if}

  {#if aPlace}
    <div class="row">
      <div class="col-md-12">

        <h2>Address</h2>
        {#if aPlace.address}
          <table id="address" class="table table-striped table-small">
            <DetailsTableHeader />
            <tbody>
              {#each aPlace.address as addressLine}
                <DetailsOneRow addressLine={addressLine}
                               bMarkUnusedLines={true}
                               bDistanceInMeters={false}
                               sCountryCode={country_code(aPlace)} />
              {/each}
            </tbody>
          </table>
        {/if}

        <h2>Linked Places</h2>
        {#if aPlace.linked_places}
          <table class="table table-striped table-small">
            <DetailsTableHeader />
            <tbody>
              {#each aPlace.linked_places as addressLine}
                <DetailsOneRow addressLine={addressLine}
                               bMarkUnusedLines={true}
                               bDistanceInMeters={true} />
              {/each}
            </tbody>
          </table>
        {/if}

        <h2>Entrances</h2>
        {#if aPlace.entrances && aPlace.entrances.length}
          <table class="table table-striped table-small">
            <thead>
              <tr>
                <th></th>
                <th>Entrance Type</th>
                <th>OSM</th>
                <th>Extra Tags</th>
              </tr>
            </thead>
            <tbody>
              {#each aPlace.entrances as entrance, i}
                <tr class="all-columns">
                  <td>{i + 1}</td>
                  <td>{entrance.type}</td>
                  <td><OsmLink osmType='N' osmId={entrance.osm_id} /></td>
                  <td><InfoRowList items={entrance.extratags || {}} /></td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <p>Place does not have entrances</p>
        {/if}

      {#if !reverse_only}
        <h2>Keywords</h2>
        {#if api_request_params.keywords}
          {#if place_has_keywords(aPlace)}
            <h3>Name Keywords</h3>

            <table class="table table-striped table-small">
              <tbody>
                {#each aPlace.keywords.name as keyword}
                  <tr>
                    <td>{formatKeywordToken(keyword.token)}</td>
                    {#if keyword.id}
                      <td>word id: {keyword.id}</td>
                    {/if}
                  </tr>
                {/each}
              </tbody>
            </table>
            {#if aPlace.keywords.address}
              <h3>Address Keywords</h3>

              <table class="table table-striped table-small">
                <tbody>
                  {#each aPlace.keywords.address as keyword}
                    <tr>
                      <td>{formatKeywordToken(keyword.token)}</td>
                      <td>word id: {keyword.id || '?'}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {/if}
          {:else}
            <p>Place has no keywords</p>
          {/if}
        {:else}
          <a class="btn btn-outline-secondary btn-sm"
            href="{base_url}&keywords=1">display keywords</a>
        {/if}
      {/if}

      <h2>Parent Of</h2>
      {#if api_request_params.hierarchy}
        {#if aPlace.hierarchy && typeof (aPlace.hierarchy) === 'object'
          && Object.keys(aPlace.hierarchy).length}

          {#each Object.keys(aPlace.hierarchy) as type}
            <h3>{type}</h3>
            <table class="table table-striped table-small">
              <DetailsTableHeader />
              <tbody>
                {#each aPlace.hierarchy[type] as line}
                  <DetailsOneRow addressLine={line} bDistanceInMeters={true} />
                {/each}
              </tbody>
            </table>
          {/each}
          {#if Object.keys(aPlace.hierarchy) > 500}
            <p>There are more child objects which are not shown.</p>
          {/if}
        {:else}
          <p>Place is not parent of other places</p>
        {/if}
      {:else}
        <a class="btn btn-outline-secondary btn-sm"
            href="{base_url}&hierarchy=1">display child places</a>
      {/if}
    </div>
  </div>
  {/if}
</div>



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
    background-color: var(--bs-body-bg);
    border-bottom: 2px solid silver;
    margin-top: 2em;
    margin-bottom: 0.5em;
  }
  h3 {
    font-size: 1.5em;
  }

  table#locationdetails td {
    padding: 2px 8px;
    font-size: 0.9em;
  }

  tr.all-columns {
    background-color: var(--bs-body-bg) !important;
    border: none;
  }
  tr.all-columns td {
    border-top: none !important;
    padding-left: 0 !important;
  }
  :global(span.noname){
    color: var(--bs-danger);
  }

  #map-wrapper {
    position: relative;
    width:100%;
    min-height: auto;
    height:300px;
    border: 1px solid #666;
  }
</style>
