import { writable } from 'svelte/store';

export const map_store = writable();
export const results_store = writable();
export const current_result_store = writable();
export const current_request_latlon = writable();
export const last_updated_store = writable();
