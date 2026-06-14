# Developing Nominatim-UI

[![Continuous Integration](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml)

## Background

Uses [Svelte](https://svelte.dev/) 5 framework,
[Leaflet](https://leafletjs.com/) 1.9 for map interaction,
[Bootstrap](https://getbootstrap.com/) 5 for layout styling.

The user interface used to be included in the geocoder. Thus the
first version avoided being a redesign and still uses some of the
same configuration values. Version 2 was a full refactor using
Svelte. Version 3 added themes and easier configuration.



## Project layout

* `search.html` is the single-page-application (SPA) entry point
* `index.html` does a meta-refresh to `search.html`
* At build time (see `vite.config.js`) `search.html` is copied to `reverse.html`, `details.html`, `about.html` etc so each page name has its own bookmark-able URL.
* `src/`: Svelte components and JavaScript sources.
* `public/`: static assets, build copies them to `dist/`
* `dist/`: build output. Not checked into git.

## Building the frontend

* Install dependencies

   ```
   yarn install
   ```

* After you change source files run

   ```
   yarn dev
   ```
   which will start a Vite dev server on port 5173 (the Vite default),
   it will refresh whenever a source file changes (hot module reload (HMR)).

* To build a production bundle into `dist/`:

   ```
   yarn build
   ```

* To preview the production build locally:

   ```
   yarn preview
   ```

## Testing

The `test/` setup uses [Playwright](https://playwright.dev/) to run E2E tests in headless Chromium.


* Run integration test suite (configuration in `playwright.config.js`)

   ```
   yarn test
   API_ON_SAME_PORT=1 yarn test
   ```

   Setting API_ON_SAME_PORT simulates having both the API and UI on the same server
   port. That's a rare setup but something https://nominatim.openstreetmap.org/ does
   so worth testing.

   To run a single test file:

   ```
   yarn test test/details.spec.js
   ```

   To run a single test by name:

   ```
   yarn test -g "should have a HTML page title"
   ```

* Run syntax linter (configuration in `eslint.config.mjs`)

   ```
   yarn lint
   ```


## Upgrade dependencies

With yarn 4 that's `yarn outdated; yarn up '*'`.

## Prepare a release

1. Update version number in `package.json` file

2. Update `CHANGES.md` file

3. Commit your changes: `git add ... `, `git commit ...`, `git push ...` etc

4. Tag release: `git tag THE_VERSION_NUMBER`, `git push --tags`

5. Create release on https://github.com/osm-search/nominatim-ui/releases
   This (a triggered Github Action) will run `yarn build` and bundle the
   `dist/` directory (built HTML pages, `assets/` JS+CSS, `theme/`, `mapicons/`,
   `config.defaults.js`) into a release tarball and zip.
