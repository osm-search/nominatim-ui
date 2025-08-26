<script>
  import DetailsLink from '../components/DetailsLink.svelte';
  import PageLink from '../components/PageLink.svelte';
  import OsmLink from '../components/OsmLink.svelte';
  import {
    formatPlaceType, formatAdminLevel, formatDistance
  } from '../lib/helpers.js';

  let {
    addressLine,
    bDistanceInMeters,
    bMarkUnusedLines = false,
    sCountryCode
  } = $props();

  const bAddressLineUsed = $derived(addressLine.isaddress);
  const reverse_only = $derived(Nominatim_Config.Reverse_Only);
</script>

<tr class:notused={bMarkUnusedLines && !bAddressLineUsed}>
  <td class="name fw-bold">
    {#if addressLine.localname}
      {addressLine.localname}
    {:else}
      <span class="noname">No Name</span>
    {/if}
  </td>
  <td>{formatPlaceType(addressLine)}</td>
  <td><OsmLink osmType={addressLine.osm_type} osmId={addressLine.osm_id} /></td>
  <td>{addressLine.rank_address}</td>
  <td>{formatAdminLevel(addressLine.admin_level)}</td>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <td>{@html formatDistance(addressLine.distance, bDistanceInMeters)}</td>
  <td>
    {#if addressLine.osm_id}
      <DetailsLink feature={addressLine} />
    {:else if !reverse_only && addressLine.type.match(/^country/)}
      <PageLink page='search'
                text='search by name'
                params_hash={{ country: addressLine.localname }} />
    {:else if !reverse_only && addressLine.type === 'postcode'}
      <PageLink page='search'
                text='search by name'
                params_hash={{ postalcode: addressLine.localname, country: sCountryCode }} />
    {/if}
  </td>
</tr>

<style>
  .notused td {
    color: var(--bs-secondary-color);
    font-style: italic;
  }

  td {
    padding: 2px 8px;
    font-size: 0.9em;
  }
</style>
