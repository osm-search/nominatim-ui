import { untrack } from 'svelte';
import { generate_nominatim_api_url } from '../lib/api_utils.js';
import { identifyLinkInQuery } from '../lib/helpers.js';

const default_pagename = Nominatim_Config.Reverse_Only ? 'reverse' : 'search';
const pagenames = [
  default_pagename,
  'reverse',
  'details',
  'deletable',
  'polygons',
  'status',
  'about'
];

class AppState {
  page = $state();

  lastApiRequestURL = $state(null);
  errorMessage = $state(null);
  requestProgress = $state('finish');

  #abortController;

  constructor() {
    this.refreshPage();
  }

  refreshPage(pagename, params) {
    if (typeof pagename === 'undefined') {
      pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

      if (!pagenames.includes(pagename)) pagename = default_pagename;

      params = new URLSearchParams(window.location.search);
    } else {
      if (!pagenames.includes(pagename)) pagename = default_pagename;

      if (typeof params === 'undefined') {
        params = new URLSearchParams();
      }

      let param_str = params.toString();
      if (param_str) {
        param_str = '?' + param_str;
      }
      let new_url = pagename + '.html' + param_str;

      if (window.location.protocol.match(/^http/)) {
        window.history.pushState([], '', new_url);
      } else {
        window.location.href = new_url;
      }
    }

    if (pagename === 'search' && params.has('q')) {
      const arrTypeAndId = identifyLinkInQuery(params.get('q'));
      if (arrTypeAndId instanceof Array) {
        pagename = 'details';
        params = new URLSearchParams({osmtype: arrTypeAndId[0], osmid: arrTypeAndId[1]});
      }
    }

    untrack(() => {
      if (this.page?.tab !== pagename && this.#abortController) {
        this.#abortController.abort();
        this.#abortController = undefined;
      }
      this.page = { tab: pagename, params: params };
      this.lastApiRequestURL = null;
      this.errorMessage = null;
    });
  }

  async fetchFromApi(endpoint_name, params, callback) {
    const api_url = generate_nominatim_api_url(endpoint_name, params);

    const mock_api_error = (new URLSearchParams(window.location.search)).get('mock_api_error');

    const fetchOptions = {};

    this.requestProgress = 'start';
    if (endpoint_name !== 'status') {
      this.lastApiRequestURL = null;
      // avoid API requests running in parallel
      this.#abortController?.abort();
      this.#abortController = new AbortController();
      fetchOptions.signal = this.#abortController.signal;
    }

    if (Nominatim_Config.Nominatim_API_Endpoint_Headers) {
      fetchOptions.headers = Nominatim_Config.Nominatim_API_Endpoint_Headers;
    }

    try {
      await fetch(api_url, fetchOptions)
        .then(async (response) => {
          if ((!((response.status >= 200 && response.status < 300) || response.status === 404))
              || mock_api_error === 'fetch'
          ) {
            this.errorMessage = `Error fetching data from ${api_url} (${response.statusText})`;
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
            this.errorMessage = `Error parsing JSON data from ${api_url} (${err})`;
            return undefined;
          }
          return data;
        })
        .then((data) => {
          if (data) {
            if (data.error) {
              this.errorMessage = data.error.message;
            }
            callback(data);
          }
          this.requestProgress = 'finish';
        });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.errorMessage = `Error fetching data from ${api_url} (${error})`;
        this.requestProgress = 'finish';
      }
    }

    if (endpoint_name !== 'status') this.lastApiRequestURL = api_url;
  }
}

export const appState = new AppState();
