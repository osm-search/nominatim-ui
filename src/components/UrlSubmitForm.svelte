<script>
  import { refresh_page } from '../lib/stores.js';

  /*!
   * Serialize all form data into a SearchParams string
   * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}   form The form to serialize
   * @return {String}      The serialized form data
   */
  function serialize_form(form) {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.name || field.disabled || ['submit', 'button'].indexOf(field.type) > -1) return;

      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
      if (typeof field.value === 'undefined') return;
      arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
    });
    return arr.join('&');
  }

  // remove any URL paramters with empty values
  // '&empty=&filled=value' => 'filled=value'
  function clean_up_url_parameters(url) {
    var url_params = new URLSearchParams(url);
    var to_delete = []; // deleting inside loop would skip iterations
    url_params.forEach(function (value, key) {
      if (value === '') to_delete.push(key);
    });
    for (var i = 0; i < to_delete.length; i += 1) {
      url_params.delete(to_delete[i]);
    }
    return url_params.toString();
  }

  function handleSubmit(event) {
    event.preventDefault();

    var target_url = serialize_form(event.target);
    target_url = clean_up_url_parameters(target_url);

    window.history.pushState({}, '', '?' + target_url);
    refresh_page(page, );
  }
</script>

<form on:submit={handleSubmit} class="form-inline" role="search" accept-charset="UTF-8" action="">
    <slot></slot>
</form>
