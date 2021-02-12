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
</script>

<form on:submit|preventDefault={() => refresh_page(page, serialize_form(event.target))} class="form-inline" role="search" accept-charset="UTF-8" action="">
    <slot></slot>
</form>
