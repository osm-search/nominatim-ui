import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The app is a single SPA. Multiple HTML entry points exist only so the
// distribution can be served as a static directory and users can bookmark
// /search.html, /reverse.html, etc.; all of them load the same SPA, and
// AppState reads window.location.pathname to pick the page to render.
//
// We keep a single source HTML (search.html) and copy it after the build to
// the other page names. In dev mode, a middleware rewrites those URLs to
// /search.html so Vite serves the SPA.
const PAGES = ['reverse', 'details', 'deletable', 'polygons', 'status', 'about'];

function nominatimPages() {
  return {
    name: 'nominatim-pages',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        const slug = url.replace(/^\//, '').replace(/\.html$/, '');
        if (PAGES.includes(slug)) {
          const qs = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
          req.url = '/search.html' + qs;
        }
        next();
      });
    },

    closeBundle() {
      const distDir = resolve('dist');
      const src = resolve(distDir, 'search.html');
      for (const page of PAGES) {
        copyFileSync(src, resolve(distDir, `${page}.html`));
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [svelte(), nominatimPages()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        search: resolve(__dirname, 'search.html')
      }
    }
  }
});
