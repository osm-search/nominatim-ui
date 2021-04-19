# Developing Nominatim-UI

[![Continuous Integration](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/osm-search/nominatim-ui/actions/workflows/ci.yml)

## Background

The user interface used to be included in the geocoder. Thus the
first version avoid being a redesign and still uses some of the
same configuration values. Version 2 was a full refactor using
Svelte. Version 3 added theme and easier configuration.

Uses [svelte](https://svelte.dev/) framework,
[leaflet](https://leafletjs.com/) for map interaction,
[bootstrap](https://getbootstrap.com/) for layout styling.


## Building the frontend

* Install dependencies

   ```
   yarn install
   ```

* After you change files in `src` directory run

   ```
   yarn dev
   ```
   which will start a webserver on port 9880 and auto-reloads
   whenever you edit files.

## Testing

* Run syntax linter

   ```
   yarn lint
   ```

* Run mocha test suite

   ```
   yarn test
   ```

## Prepare a release

1. Update version number in `package.json` file

2. Update `CHANGES.md` file

3. Commit your changes: `git add... `, `git commit ...`, `git push ...` etc

4. Tag release: `git tag THE_VERSION_NUMBER`, `git push --tags`

5. Create release on https://github.com/osm-search/nominatim-ui/releases
   This (a triggered Github Action) will run `yarn build` and add the `dist/build/bundle.*` files.
