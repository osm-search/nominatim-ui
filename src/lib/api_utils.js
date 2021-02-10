
import { get_config_value } from './config_reader.js';
import { last_api_request_url_store } from './stores.js';


function api_request_progress(status) {
  var loading_el = document.getElementById('loading');
  if (!loading_el) return; // might not be on page yet

  loading_el.style.display = (status === 'start') ? 'block' : 'none';
}

export async function fetch_from_api(endpoint_name, params, callback) {
  var api_url = generate_nominatim_api_url(endpoint_name, params);

  api_request_progress('start');

  await fetch(api_url)
    .then(response => response.json())
    .then(data => {
      callback(data);
      api_request_progress('finish');
    });

  if (endpoint_name !== 'status') last_api_request_url_store.set(api_url);
}

function generate_nominatim_api_url(endpoint_name, params) {
  return get_config_value('Nominatim_API_Endpoint') + endpoint_name + '.php?'
         + Object.keys(clean_up_parameters(params)).map((k) => {
           return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
         }).join('&');
}

/*!
 * Serialize all form data into a SearchParams string
 * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
export function serialize_form(form) {
  var arr = [];
  Array.prototype.slice.call(form.elements).forEach(function (field) {
    if (!field.name || field.disabled || ['submit', 'button'].indexOf(field.type) > -1) return;
    // if (field.type === 'select-multiple') {
    //   Array.prototype.slice.call(field.options).forEach(function (option) {
    //     if (!option.selected) return;
    //     arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(option.value));
    //   });
    //   return;
    // }
    if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
    if (typeof field.value === 'undefined') return;
    arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
  });
  return arr.join('&');
}


// remove any URL paramters with empty values
// '&empty=&filled=value' => 'filled=value'
export function clean_up_url_parameters(url) {
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

function clean_up_parameters(params) {
  // `&a=&b=&c=1` => '&c=1'
  var param_names = Object.keys(params);
  for (var i = 0; i < param_names.length; i += 1) {
    var val = params[param_names[i]];
    if (typeof (val) === 'undefined' || val === '' || val === null) {
      delete params[param_names[i]];
    }
  }
  return params;
}

export function update_html_title(title) {
  document.title = [title, 'OpenStreetMap Nominatim']
    .filter((val) => val && val.length > 1)
    .join(' | ');
}

