<script>
  import { results_store, current_result_store } from '../lib/stores.js';
  import { formatLabel, detailsURL } from '../lib/helpers.js';

  import Welcome from './Welcome.svelte';
  import MapIcon from './MapIcon.svelte';

  export let reverse_search = false;

  let aSearchResults;
  let iHighlightNum;
  let sMoreURL;

  results_store.subscribe(data => {
    if (!data) { return; }
    aSearchResults = data;
    iHighlightNum = 0;
    current_result_store.set(aSearchResults[0]);


    let search_params = new URLSearchParams(window.location.search);

    let aResults = data;
    // lonvia wrote: https://github.com/osm-search/nominatim-ui/issues/24
    // I would suggest to remove the guessing and always show the link. Nominatim only returns
    // one or two results when it believes the result to be a good enough match.
    // if (aResults.length >= 10) {
    var aExcludePlaceIds = [];
    if (search_params.has('exclude_place_ids')) {
      aExcludePlaceIds = search_params.get('exclude_place_ids').split(',');
    }
    for (var i = 0; i < aResults.length; i += 1) {
      aExcludePlaceIds.push(aResults[i].place_id);
    }
    var parsed_url = new URLSearchParams(window.location.search);
    parsed_url.set('exclude_place_ids', aExcludePlaceIds.join(','));
    sMoreURL = '?' + parsed_url.toString();
  });

  function handleClick(e) {
    let result_el = e.target;
    if (!result_el.className.match('result')) {
      result_el = result_el.parentElement;
    }
    let pos = Number(result_el.dataset.position);

    current_result_store.set(aSearchResults[pos]);
    iHighlightNum = pos;
  }

</script>

{#if aSearchResults && aSearchResults.length > 0}
  <div id="searchresults">

    {#each aSearchResults as aResult, iResNum}
      <div class="result" class:highlight={iResNum === iHighlightNum} data-position="{iResNum}" on:click|stopPropagation={handleClick}>
        <div style="float:right">
          <MapIcon aPlace={aResult} />
        </div>
        <span class="name">{aResult.display_name}</span>
        <span class="type">{formatLabel(aResult)}</span>
        <p class="coords">{aResult.lat},{aResult.lon}</p>  

        <a class="details btn btn-outline-secondary btn-sm" href="{detailsURL(aResult)}">details</a>
      </div>
    {/each}

    {#if sMoreURL && !reverse_search}
      <div class="more">
        <a class="btn btn-primary" href="{sMoreURL}">
          Search for more results
        </a>
      </div>
    {/if}
  </div>
{:else if aSearchResults}
  {#if reverse_search}
    <div id="intro" class="sidebar">Search for coordinates or click anywhere on the map.</div>
  {:else}
    <div class="noresults">No search results found</div>
  {/if}
{:else}
  <Welcome/>
{/if}

<style>
  .result {
    font-size: 0.8em;
    margin: 5px;
    margin-top:0px;
    padding: 4px 8px;
    border-radius: 2px;
    background:#F0F7FF;
    border: 2px solid #D7E7FF;
    cursor:pointer;
    min-height: 5em;
  }

  .result.highlight {
    background-color: #D9E7F7;
    border-color: #9DB9E4;
  }
  .result.highlight .details {
    margin: 10px auto;
    display: block;
    max-width: 10em;
    padding: 1px;
  }
  .result .type{
    color: gray;
    font-size: 0.8em;
  }
  .result .details {
    display: none;
  }

  .result .coords {
    display: none;  
  }

  .noresults{
    text-align: center;
    padding: 1em;
  }

  .more{
    text-align:center;
    margin-top: 1em;
  }

  .btn-outline-secondary {
    background-color: white;
  }

  .btn-outline-secondary:hover {
    color: #111;
  }
</style>