import { writable } from 'svelte/store';

export const map_store = writable();
export const results_store = writable();
export const current_request_latlon = writable();
export const last_api_request_url_store = writable();
export const page = writable({ count: 0 });

export function refresh_page() {
  let pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

  if (['search', 'reverse', 'details', 'deletable', 'polygons'].indexOf(pagename) === -1) {
    pagename = 'search';
  }

  // Add a counter here to make sure the store change is triggered
  // everytime we refresh, not just when the page changes.
  page.update(function (v) { return { tab: pagename, count: v.count + 1 }; });
}
