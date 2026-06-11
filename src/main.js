import { mount } from 'svelte';
import App from './App.svelte';
import './global_style.css';

const app = mount(App, {
  target: document.body
});

export default app;
