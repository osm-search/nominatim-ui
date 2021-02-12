import { writable } from 'svelte/store';

export const map_store = writable();
export const results_store = writable();
export const last_api_request_url_store = writable();
export const page = writable();

export function refresh_page(pagename, params) {
  if (typeof pagename === 'undefined') {
    pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

    if (['search', 'reverse', 'details', 'deletable', 'polygons'].indexOf(pagename) === -1) {
      pagename = 'search';
    }

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
