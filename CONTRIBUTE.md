# Developing Nominatim-UI

## Background

The user interface used to be included in the geocoder. Thus the
first version avoid being a redesign and still uses some of the
same configuration values.

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

## Prepare a release

1. Update version number in `package.json` file

2. Update `CHANGES.md` file

3. Run `yarn build` to make sure the `dist/build/` files don't contain lifereload.js

4. Commit your changes: `git add... `, `git commit ...`, `git push ...` etc

5. Tag release: `git tag THE_VERSION_NUMBER`, `git push --tags`

6. Upload release