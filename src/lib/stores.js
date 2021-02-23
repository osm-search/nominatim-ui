import { writable } from 'svelte/store';

export const map_store = writable();
export const results_store = writable();
export const last_api_request_url_store = writable();
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
const pagenames = ['search', 'reverse', 'details', 'deletable', 'polygons', 'about'];

export function refresh_page(pagename, params) {
  if (typeof pagename === 'undefined') {
    pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

    if (!pagenames.includes(pagename)) pagename = 'search';

    params = new URLSearchParams(window.location.search);
  } else {
    if (typeof params === 'undefined') {
      params = new URLSearchParams();
    }

    let param_str = params.toString();
    if (param_str) {
      param_str = '?' + param_str;
    }
    window.history.pushState([], '', pagename + '.html' + param_str);
  }

  page.set({ tab: pagename, params: params });
}
