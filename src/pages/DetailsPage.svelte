<script>
  import { fetch_from_api, update_html_title } from '../lib/api_utils.js';
  import { page } from '../lib/stores.js';

  import {
    osmLink, wikipediaLink, coverageType, isAdminBoundary,
    formatAddressRank, formatKeywordToken, formatOSMType
  } from '../lib/helpers.js';
  import Header from '../components/Header.svelte';
  import MapIcon from '../components/MapIcon.svelte';
  import SearchSectionDetails from '../components/SearchSectionDetails.svelte';
  import DetailsOneRow from '../components/DetailsOneRow.svelte';
  import DetailsLink from '../components/DetailsLink.svelte';
  import DetailsPostcodeHint from '../components/DetailsPostcodeHint.svelte';
  import InfoRow from '../components/DetailsInfoRow.svelte';
  import InfoRowList from '../components/DetailsInfoRowList.svelte';
  import Map from '../components/Map.svelte';

  let aPlace;
  let base_url;
  let api_request_params;
  let api_request_finished = false;

  function loaddata(search_params) {
    api_request_params = {
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
    api_request_finished = false;

    if (api_request_params.place_id || (api_request_params.osmtype && api_request_params.osmid)) {

      if (api_request_params.place_id) {
        update_html_title('Details for ' + api_request_params.place_id);
      } else {
        update_html_title('Details for ' + api_request_params.osmtype + api_request_params.osmid);
      }

      fetch_from_api('details', api_request_params, function (data) {
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

  $: {
    let pageinfo = $page;
    if (pageinfo.tab === 'details') {
      loaddata(pageinfo.params);
      base_url = window.location.search;
    }
  }
  $: reverse_only = Nominatim_Config.Reverse_Only;
</script>

<Header>
  <SearchSectionDetails api_request_params={api_request_params}/>
</Header>

<div class="container">
  {#if aPlace}
    <div class="row">
      <div class="col-sm-10">
        <h1>
          {aPlace.localname || `${formatOSMType(aPlace.osm_type)} ${aPlace.osm_id}` }
          <small><DetailsLink feature={aPlace}>link to this page</DetailsLink></small>
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
            <InfoRow title="Name">
            {#if aPlace.names && typeof (aPlace.names) === 'object'
              && Object.keys(aPlace.names).length}
              <InfoRowList items={aPlace.names} />
            {:else}
              <span class="noname fw-bold">No Name</span>
            {/if}
            </InfoRow>
            <InfoRow title="Type">{aPlace.category}:{aPlace.type}</InfoRow>
            <InfoRow title="Last Updated">{aPlace.indexed_date}</InfoRow>
            {#if (isAdminBoundary(aPlace)) }
              <InfoRow title="Admin Level">{aPlace.admin_level}</InfoRow>
            {/if}
            <InfoRow title="Search Rank">{aPlace.rank_search}</InfoRow>
            <InfoRow title="Address Rank">
              {aPlace.rank_address} ({formatAddressRank(aPlace.rank_address)})
            </InfoRow>
            {#if aPlace.calculated_importance}
              <InfoRow title="Importance">
                  {aPlace.calculated_importance}
                  {#if !aPlace.importance} (estimated){/if}
              </InfoRow>
            {/if}
            <InfoRow title="Coverage">{coverageType(aPlace)}</InfoRow>
            <InfoRow title="Centre Point (lat,lon)">
                {aPlace.centroid.coordinates[1]},{aPlace.centroid.coordinates[0]}
            </InfoRow>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <InfoRow title="OSM">{@html osmLink(aPlace)}</InfoRow>
            <InfoRow title="Place Id">
               {aPlace.place_id}
               (<a href="https://nominatim.org/release-docs/develop/api/Output/#place_id-is-not-a-persistent-id">
                 on this server
               </a>)
            </InfoRow>
            {#if aPlace.calculated_wikipedia}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <InfoRow title="Wikipedia Calculated">{@html wikipediaLink(aPlace)}</InfoRow>
            {/if}
            <InfoRow title="Computed Postcode">
              {#if aPlace.calculated_postcode}
                {aPlace.calculated_postcode}
                <DetailsPostcodeHint postcode={aPlace.calculated_postcode}
                                     lat={aPlace.centroid.coordinates[1]}
                                     lon={aPlace.centroid.coordinates[0]} />
              {/if}
            </InfoRow>
            <InfoRow title="Address Tags"><InfoRowList items={aPlace.addresstags} /></InfoRow>
            <InfoRow title="Extra Tags"><InfoRowList items={aPlace.extratags} /></InfoRow>
          </tbody>
        </table>
      </div>
      <div class="col-md-6">
        <div id="map-wrapper">
          <Map current_result={aPlace} />
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
                <DetailsOneRow addressLine={addressLine}
                               bMarkUnusedLines={true}
                               bDistanceInMeters={false}
                               sCountryCode={country_code(aPlace)} />
              {/each}
            {/if}

            {#if aPlace.linked_places}
              <tr class="all-columns"><td colspan="7"><h2>Linked Places</h2></td></tr>
              {#each aPlace.linked_places as addressLine}
                <DetailsOneRow addressLine={addressLine}
                               bMarkUnusedLines={true}
                               bDistanceInMeters={true} />
              {/each}
            {/if}

            {#if !reverse_only}
              <tr class="all-columns"><td colspan="7"><h2>Keywords</h2></td></tr>
              {#if api_request_params.keywords}

                {#if place_has_keywords(aPlace)}
                  <tr class="all-columns"><td colspan="7"><h3>Name Keywords</h3></td></tr>
                  {#each aPlace.keywords.name as keyword}
                    <tr>
                      <td>{formatKeywordToken(keyword.token)}</td>
                      {#if keyword.id}
                        <td>word id: {keyword.id}</td>
                      {/if}
                    </tr>
                  {/each}

                  {#if aPlace.keywords.address}
                    <tr class="all-columns"><td colspan="7"><h3>Address Keywords</h3></td></tr>
                    {#each aPlace.keywords.address as keyword}
                      <tr>
                        <td>{formatKeywordToken(keyword.token)}</td>
                        {#if keyword.id}
                          <td>word id: {keyword.id}</td>
                        {/if}
                      </tr>
                    {/each}
                  {/if}
                {:else}
                  <tr><td>Place has no keywords</td></tr>
                {/if}
              {:else}
                <tr>
                  <td>
                     <a class="btn btn-outline-secondary btn-sm"
                      href="{base_url}&keywords=1">display keywords</a>
                  </td>
                </tr>
              {/if}
            {/if}

            <tr class="all-columns"><td colspan="7"><h2>Parent Of</h2></td></tr>
            {#if api_request_params.hierarchy}
              {#if aPlace.hierarchy && typeof (aPlace.hierarchy) === 'object'
                && Object.keys(aPlace.hierarchy).length}
                {#each Object.keys(aPlace.hierarchy) as type}
                  <tr class="all-columns"><td colspan="7"><h3>{type}</h3></td></tr>
                  {#each aPlace.hierarchy[type] as line}
                    <DetailsOneRow addressLine={line} bDistanceInMeters={true} />
                 {/each}
                {/each}

                {#if Object.keys(aPlace.hierarchy) > 500}
                  <tr><td><p>There are more child objects which are not shown.</p></td></tr>
                {/if}
              {:else}
                <tr><td>Place is not parent of other places</td></tr>
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
  {:else if (window.location.search !== '' && api_request_finished)}
    No such place found.
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
    padding-left: 8px;
    background-color: var(--bs-body-bg);
  }
  h3 {
    font-size: 1.5em;
    padding-left: 8px;
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
