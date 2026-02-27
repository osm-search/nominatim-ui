<script>
  import { appState } from '../state/AppState.svelte.js';
  import { SvelteURLSearchParams } from 'svelte/reactivity';

  const { page, content } = $props();

  function serialize_form(form) {
    const params = new SvelteURLSearchParams();

    for (const field of form.elements) {
      if (!field.name || field.disabled || ['submit', 'button'].includes(field.type)) continue;

      if (['checkbox', 'radio'].includes(field.type) && !field.checked) continue;
      if (typeof field.value === 'undefined' || field.value === '') continue;

      // Default value for /search endpoint
      if (field.name === 'dedupe' && (field.value === 1 || field.value === '1')) continue;

      params.set(field.name, field.value);
    }

    return params;
  }

  // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
  // doesn't support hidden fields, so we check those in an extra step
  function validate_field(field) {
    if (field.type === 'hidden') {
      if (field.value.length) {
        if (field.pattern && !field.value.match(field.pattern)) return false;
      }
    }
    return field.checkValidity(); // for hidden field always true
  }

  function handle_submit(event) {
    event.preventDefault();

    const form = event.target;

    for (const field of form.elements) {
      if (!validate_field(field)) {
        alert(`Invalid input in ${field.name}`);
        return;
      }
    }

    appState.refreshPage(page, serialize_form(form));
  }
</script>

<form onsubmit={handle_submit}
      class="form-inline"
      role="search"
      accept-charset="UTF-8"
      action="">
  <div class="row g-2">
    {@render content?.()}
  </div>
</form>
