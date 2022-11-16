# Developing Nominatim-UI

[![Continuous Integration](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml)

## Background

Uses [Svelte](https://svelte.dev/) framework,
[Leaflet](https://leafletjs.com/) for map interaction,
[Bootstrap](https://getbootstrap.com/) for layout styling.

The user interface used to be included in the geocoder. Thus the
first version avoided being a redesign and still uses some of the
same configuration values. Version 2 was a full refactor using
Svelte. Version 3 added theme and easier configuration.



## Building the frontend

* Install dependencies

   ```
   yarn install
   ```

* After you change files in `src` directory run

   ```
   yarn dev
   ```
   which will start a webserver on port 9080 and auto-reloads
   whenever you edit files. Configuration in `rollup.config.js`.

## Testing

The `test/` setup uses [Mocha](https://mochajs.org/) to run tests. Tests use [Puppeteer](https://pptr.dev/) to control a Google Chrome headless browser and evaluate with [Assert](https://nodejs.org/api/assert.html).


* Run integration test suite (configuration in `.mocharc.json`)

   ```
   yarn test
   API_ON_SAME_PORT=1 yarn test
   ```

   Setting API_ON_SAME_PORT simulates having both the API and UI on the same server
   port. That's a rare setup but something https://nominatim.openstreetmap.org/ does
   so worth testing.

   To run a single test file only

   ```
   yarn run rollup -c && yarn run mocha test/details.js
   ```

* Run syntax linter (configuration in `.eslint.json`)

   ```
   yarn lint
   ```


## Prepare a release

1. Update version number in `package.json` file

2. Update `CHANGES.md` file

3. Commit your changes: `git add... `, `git commit ...`, `git push ...` etc

4. Tag release: `git tag THE_VERSION_NUMBER`, `git push --tags`

5. Create release on https://github.com/osm-search/nominatim-ui/releases
   This (a triggered Github Action) will run `yarn build` and add the `dist/build/bundle.*` files.
