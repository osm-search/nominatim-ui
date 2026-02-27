<script>
  import { formatLabel } from '../lib/helpers.js';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  import DetailsLink from './DetailsLink.svelte';
  import Welcome from './Welcome.svelte';
  import MapIcon from './MapIcon.svelte';

  // eslint-disable-next-line prefer-const
  let { results, reverse_search = false, current_result = $bindable() } = $props();

  let iHighlightNum = $state();

  const sMoreURL = $derived.by(() => {
    const search_params = new URLSearchParams(window.location.search);
    const aResults = results;
    // lonvia wrote: https://github.com/osm-search/nominatim-ui/issues/24
    // I would suggest to remove the guessing and always show the link. Nominatim only returns
    // one or two results when it believes the result to be a good enough match.
    // if (aResults.length >= 10) {
    let aExcludePlaceIds = [];
    if (search_params.has('exclude_place_ids')) {
      aExcludePlaceIds = search_params.get('exclude_place_ids').split(',');
    }
    for (let i = 0; i < aResults.length; i += 1) {
      aExcludePlaceIds.push(aResults[i].place_id);
    }
    const parsed_url = new SvelteURLSearchParams(window.location.search);
    parsed_url.set('exclude_place_ids', aExcludePlaceIds.join(','));
    return '?' + parsed_url.toString();
  });

  function handleClick(e) {
    e.stopPropagation();
    let result_el = e.target;
    if (!result_el.className.match('result')) {
      result_el = result_el.parentElement;
    }
    const pos = Number(result_el.dataset.position);

    iHighlightNum = pos;
  }

  $effect(() => {
    if (results) {
      iHighlightNum = 0;
    }
  });

  $effect(() => {
    current_result = (results && results.length > iHighlightNum) ? results[iHighlightNum] : null;
  });

</script>

{#if results && results.length > 0}
  <div id="searchresults" role="list">

    {#each results as aResult, iResNum}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div class="result"
           class:highlight={iResNum === iHighlightNum}
           role="listitem"
           data-position="{iResNum}"
           onclick={handleClick}
           onkeypress={handleClick}>
        <div style="float:right">
          <MapIcon aPlace={aResult} />
        </div>
        <span class="name">{aResult.display_name}</span>
        <span class="type">{formatLabel(aResult)}</span>
        <p class="coords">{aResult.lat},{aResult.lon}</p>

        <DetailsLink extra_classes="btn btn-outline-secondary btn-sm" feature={aResult} />
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
{:else if results}
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
    margin-top: 0;
    padding: 4px 8px;
    border-radius: 2px;
    background: var(--bs-secondary-bg);
    border: 1px solid var(--bs-secondary-color);
    cursor: pointer;
    min-height: 5em;
  }

  .result.highlight {
    background-color: var(--bs-primary-bg-subtle);
    border-color: var(--bs-primary-color-subtle);
  }
  .result.highlight :global(a) {
    margin: 10px auto;
    display: block;
    max-width: 10em;
    padding: 1px;
    color: var(--bs-secondary-color);
    background-color: var(--bs-secondary-bg);
  }
  .result .type {
    color: var(--bs-secondary-color);
    font-size: 0.8em;
  }
  .result :global(a) {
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

  .result.highlight :global(a):hover {
    background-color: var(--bs-primary-bg-subtle);
  }
</style>
