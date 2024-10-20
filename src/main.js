import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { // eslint-disable-line no-unused-vars
  target: document.body
});

export default app;
