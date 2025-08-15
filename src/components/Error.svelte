<script>
  import { error_store } from '../lib/stores.js';

  let error_message = $state();

  error_store.subscribe(text => { error_message = text; });

  function dismiss_message() {
    error_store.set(null);
  }
</script>

{#if error_message}
  <div id="error" class="container-fluid alert-danger py-3 px-4">
    {error_message}

    <button type="button"
            class="btn-close float-end"
            aria-label="dismiss"
            onclick={dismiss_message}></button>
  </div>
{/if}
