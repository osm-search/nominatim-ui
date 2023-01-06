<script>
  export let postcode;
  export let lat;
  export let lon;

  let overpass_query = `
    // Based on the map bounds, you can zoom out and rerun the query

    [timeout:30]; // in seconds

    // we define a shortcut
    // https://wiki.openstreetmap.org/wiki/Overpass_turbo/Extended_Overpass_Turbo_Queries
    {{postcode=${postcode}}}

    (
      node["addr:postcode"="{{postcode}}"]({{bbox}});
      way["addr:postcode"="{{postcode}}"]({{bbox}});
      relation["addr:postcode"="{{postcode}}"]({{bbox}});

      node["postal_code"="{{postcode}}"]({{bbox}});
      way["postal_code"="{{postcode}}"]({{bbox}});
      relation["postal_code"="{{postcode}}"]({{bbox}});
    );

    out body;
    >;
    out skel qt;
  `.replace(/^ {4}/gm, '');

  // https://wiki.openstreetmap.org/wiki/Overpass_turbo/Development#URL_Parameters
  // Q: the query
  // C: map position
  // R: run the query
  let url = 'https://overpass-turbo.eu/'
    + '?Q=' + encodeURIComponent(overpass_query)
    + '&C=' + encodeURIComponent([lat, lon, 15].join(';'))
    + '&R';

  function openHint() {
    document.getElementById('postcode-hint').style.display = 'block';
  }
  function closeHint() {
    document.getElementById('postcode-hint').style.display = 'none';
  }
</script>

(<a href="#openHint" on:click|preventDefault|stopPropagation={openHint}>how?</a>)

<div id="postcode-hint" class="my-2 p-2">
  <button type="button" class="btn-close float-end m-1" aria-label="Close" on:click|stopPropagation={closeHint} />

  <p>
    Nightly calculated from nearby places having this postcode.
    <a href="https://nominatim.org/release-docs/latest/admin/Maintenance/#updating-postcodes">Documentation</a>.
  </p>
  <p>
    You can search for those with an <a href={url} target="_blank" rel="noreferrer">Overpass Turbo query</a>.
  </p>
  <p>
    <a href="https://nominatim.org/2022/06/26/state-of-postcodes.html" target="_blank" rel="noreferrer">How Nominatim uses postcodes</a>.
</div>

<style>
  #postcode-hint {
    font-size: 0.9em;
    background-color: #ededff;
    display: none;
  }
</style>