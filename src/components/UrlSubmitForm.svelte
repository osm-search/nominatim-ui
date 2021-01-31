<script>
  import { serialize_form, clean_up_url_parameters } from '../lib/api_utils.js';
  import { refresh_page } from '../lib/stores.js';

  function handleSubmit(event) {
    event.preventDefault();

    var target_url = serialize_form(event.target);
    target_url = clean_up_url_parameters(target_url);

    window.history.pushState({}, '', '?' + target_url);
    refresh_page();
  }
</script>

<form on:submit={handleSubmit} class="form-inline" role="search" accept-charset="UTF-8" action="">
    <slot></slot>
</form>
