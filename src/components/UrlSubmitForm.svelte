<script>
  import { refresh_page } from '../lib/stores.js';

  export let page;

  function serialize_form(form) {
    var params = new URLSearchParams();

    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.name || field.disabled || ['submit', 'button'].indexOf(field.type) > -1) return;

      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
      if (typeof field.value === 'undefined' || field.value === '') return;

      params.set(field.name, field.value);
    });

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
    let form = event.target;

    let allow_submit = true;

    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!validate_field(field)) {
        alert('Invalid input in ' + field.name);
        allow_submit = false;
      }
    });

    if (allow_submit) refresh_page(page, serialize_form(form));
  }
</script>

<form on:submit|preventDefault={handle_submit} class="form-inline" role="search" accept-charset="UTF-8" action="">
  <div class="row g-2">
    <slot></slot>
  </div>
</form>
