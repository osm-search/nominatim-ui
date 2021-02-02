<script>

  export let addressLine;
  export let bDistanceInMeters;

  $: bAddressLineUsed = addressLine.isaddress;

  import {
    formatPlaceType, osmLink, formatAdminLevel, formatDistance, detailsURL
  } from '../lib/helpers.js';

</script>

<tr class:notused={!bAddressLineUsed}>
  <td class="name">
    {#if addressLine.localname}
      {addressLine.localname}
    {:else}
      <span class="noname">No Name</span>
    {/if}
  </td>
  <td>{formatPlaceType(addressLine)}</td>
  <td>{@html osmLink(addressLine)}</td>
  <td>{addressLine.rank_address}</td>
  <td>{formatAdminLevel(addressLine.admin_level)}</td>
  <td>{@html formatDistance(addressLine.distance, bDistanceInMeters)}</td>
  <td>{#if addressLine.osm_id}<a href="{detailsURL(addressLine)}">details</a>{/if}</td>
</tr>

<style>
  .notused {
    color:#ddd;
  }
  .name{
    font-weight: bold;
  }
  .noname{
    color:#800;
  }
</style>
