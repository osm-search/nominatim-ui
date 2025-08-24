<script>
  import { appState } from '../state/AppState.svelte.js';
</script>

{#if appState.errorMessage}
  <div id="error" class="container-fluid alert-danger py-3 px-4">
    {appState.errorMessage}

    <button type="button"
            class="btn-close float-end"
            aria-label="dismiss"
            onclick={() => appState.errorMessage = null}></button>
  </div>
{/if}
