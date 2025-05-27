import { last_api_request_url_store, error_store } from './stores.js';

function api_request_progress(status) {
  var loading_el = document.getElementById('loading');
  if (!loading_el) return; // might not be on page yet

  loading_el.style.display = (status === 'start') ? 'block' : null;
}

export async function fetch_from_api(endpoint_name, params, callback) {
  var api_url = generate_nominatim_api_url(endpoint_name, params);

  const mock_api_error = (new URLSearchParams(window.location.search)).get('mock_api_error');

  api_request_progress('start');
  if (endpoint_name !== 'status') last_api_request_url_store.set(null);

  try {
    await fetch(api_url, { headers: Nominatim_Config.Nominatim_API_Endpoint_Headers || {} })
      .then(async (response) => {
        if ((!((response.status >= 200 && response.status < 300) || response.status === 404))
            || mock_api_error === 'fetch'
        ) {
          error_store.set(`Error fetching data from ${api_url} (${response.statusText})`);
          return undefined;
        }

        // Parse JSON here instead of returning a promise so we can catch possible
        // errors.
        var data;
        try {
          if (mock_api_error === 'parse') {
            data = JSON.parse('{');
          } else {
            data = await response.json();
          }
        } catch (err) {
          // e.g. 'JSON.parse: unexpected non-whitespace character after JSON data at line 1'
          error_store.set(`Error parsing JSON data from ${api_url} (${err})`);
          return undefined;
        }
        return data;
      })
      .then((data) => {
        if (data) {
          if (data.error) {
            error_store.set(data.error.message);
          }
          callback(data);
        }
        api_request_progress('finish');
      });
  } catch (error) {
    error_store.set(`Error fetching data from ${api_url} (${error})`);
    api_request_progress('finish');
  }

  if (endpoint_name !== 'status') last_api_request_url_store.set(api_url);
}

var fetch_content_cache = {};
export async function fetch_content_into_element(url, dom_element) {
  if (!window.location.protocol.match(/^http/)) {
    dom_element.innerHTML = `Cannot display data from ${url} here. `
      + 'Browser security prevents loading content from file:// URLs.';
    return;
  }

  if (fetch_content_cache[url]) {
    dom_element.innerHTML = fetch_content_cache[url];
    return;
  }
  try {
    await fetch(url)
      .then(response => response.text())
      .then(html => {
        html = html.replace('Nominatim_API_Endpoint', generate_nominatim_endpoint_url());
        dom_element.innerHTML = html;
        fetch_content_cache[url] = html;
      });
  } catch (error) {
    dom_element.innerHTML = `Error fetching content from ${url} (${error})`;
  }
}

function generate_nominatim_endpoint_url(endpoint_name) {
  var conf_endpoint = Nominatim_Config.Nominatim_API_Endpoint;

  console.log(typeof conf_endpoint);
  if (typeof conf_endpoint === 'function') {
    return conf_endpoint(endpoint_name);
  }

  if (!endpoint_name) return conf_endpoint;

  return conf_endpoint + endpoint_name;
}

function generate_nominatim_api_url(endpoint_name, params) {
  // default value for /search
  if (params.dedupe === 1) delete params.dedupe;

  extend_parameters(params, Nominatim_Config.Nominatim_API_Endpoint_Params);
  return generate_nominatim_endpoint_url(endpoint_name)
         + '?'
         + Object.keys(clean_up_parameters(params)).map((k) => {
           return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
         }).join('&');
}

function extend_parameters(params, params2) {
  var param_names = Object.keys(params2);
  for (var i = 0; i < param_names.length; i += 1) {
    params[param_names[i]] = params2[param_names[i]];
  }
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
  document.title = [title, Nominatim_Config.Page_Title]
    .filter((val) => val && val.length > 1)
    .join(' | ');
}

