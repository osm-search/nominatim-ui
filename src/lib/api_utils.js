
import { get_config_value } from './config_reader.js';
import { last_api_request_url_store } from './stores.js';


function api_request_progress(status) {
  var loading_el = document.getElementById('loading');
  if (!loading_el) return; // might not be on page yet

  loading_el.style.display = (status === 'start') ? 'block' : null;
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

var fetch_content_cache = {};
export async function fetch_content_into_element(url, dom_element) {
  if (fetch_content_cache[url]) {
    dom_element.innerHTML = fetch_content_cache[url];
    return;
  }
  await fetch(url)
    .then(response => response.text())
    .then(html => {
      html = html.replace('Nominatim_API_Endpoint', get_config_value('Nominatim_API_Endpoint'));
      dom_element.innerHTML = html;
      fetch_content_cache[url] = html;
    });
}

function generate_nominatim_api_url(endpoint_name, params) {
  return get_config_value('Nominatim_API_Endpoint') + endpoint_name + '.php?'
         + Object.keys(clean_up_parameters(params)).map((k) => {
           return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
         }).join('&');
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
  document.title = [title, get_config_value('Page_Title')]
    .filter((val) => val && val.length > 1)
    .join(' | ');
}

