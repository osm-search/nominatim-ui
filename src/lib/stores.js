import { writable } from 'svelte/store';
import { identifyLinkInQuery } from './helpers.js';

export const map_store = writable();
export const results_store = writable();
export const last_api_request_url_store = writable();
export const error_store = writable();
export const page = writable();

/**
 * Update the global page state.
 *
 * When called without a parameter, then the current window.location is
 * parsed and the page state is set accordingly. Otherwise the page state
 * is set from the parameters. 'pagename' is the overall subpage (without
 * .html extension). 'params' must be an URLSearchParams object and contain
 * the requested query parameters. It may also be omitted completely for a
 * link without query parameters.
 */
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

export function refresh_page(pagename, params) {
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
      params = new URLSearchParams();
      params.set('osmtype', arrTypeAndId[0]);
      params.set('osmid', arrTypeAndId[1]);
    }
  }

  page.set({ tab: pagename, params: params });
  last_api_request_url_store.set(null);
  error_store.set(null);
}
