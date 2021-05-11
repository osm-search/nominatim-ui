<script>
  import { error_store } from '../lib/stores.js';

  let error_message;

  error_store.subscribe(text => { error_message = text; });

  function dismiss_message() {
    error_store.set(null);
  }
</script>

{#if error_message}
  <div id="error" class="container-fluid alert-danger py-3 px-4">
    {error_message}

    <button type="button" class="btn-close" aria-label="dismiss" on:click={dismiss_message}></button>
  </div>
{/if}
