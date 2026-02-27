import escapeHtml from 'escape-html';

const ALLOWED_THEME_FILES = [
  'theme/welcome.html',
  'theme/about-help.html',
  'theme/status-help.html'
];

const fetch_content_cache = {};
export async function fetch_content_into_element(url, dom_element) {
  if (!window.location.protocol.match(/^http/)) {
    dom_element.textContent = `Cannot display data from ${url} here. `
      + 'Browser security prevents loading content from file:// URLs.';
    return;
  }

  if (!ALLOWED_THEME_FILES.includes(url)) {
    dom_element.textContent = 'Loading content from ' + url + ' is not allowed.';
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
        const endpoint = escapeHtml(generate_nominatim_endpoint_url());
        html = html.replace('Nominatim_API_Endpoint', endpoint);
        dom_element.innerHTML = html;
        fetch_content_cache[url] = html;
      });
  } catch (error) {
    dom_element.textContent = `Error fetching content from ${url} (${error})`;
  }
}

function generate_nominatim_endpoint_url(endpoint_name) {
  const conf_endpoint = Nominatim_Config.Nominatim_API_Endpoint;

  if (typeof conf_endpoint === 'function') {
    return conf_endpoint(endpoint_name);
  }

  if (!endpoint_name) return conf_endpoint;

  return conf_endpoint + endpoint_name;
}

export function generate_nominatim_api_url(endpoint_name, params) {
  // default value for /search
  if (params.dedupe === 1) delete params.dedupe;

  Object.assign(params, Nominatim_Config.Nominatim_API_Endpoint_Params);
  return generate_nominatim_endpoint_url(endpoint_name)
         + '?'
         + Object.keys(clean_up_parameters(params)).map((k) => {
           return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
         }).join('&');
}

function clean_up_parameters(params) {
  // `&a=&b=&c=1` => '&c=1'
  for (const [key, val] of Object.entries(params)) {
    if (val === undefined || val === '' || val === null) {
      delete params[key];
    }
  }
  return params;
}

export function update_html_title(title) {
  document.title = [title, Nominatim_Config.Page_Title]
    .filter((val) => val && val.length > 1)
    .join(' | ');
}

