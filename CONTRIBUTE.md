# Developing Nominatim-UI

## Background

The user interface used to be included in the geocoder. Thus the
first version avoid being a redesign and still uses some of the
same configuration values. For simplicity it's not a single
page application (SPA) written in a framework though it could
be in the future if complexity grows.

Uses [jQuery](https://jquery.com/) for browser DOM interaction,
[handlebar](http://handlebarsjs.com/) templates to build pages,
[leaflet](https://leafletjs.com/) for map interaction,
[bootstrap](https://getbootstrap.com/) for layout styling.


## Building the frontend

* Install dependencies

   ```
   yarn install
   ```

* After you change files in `src` directory run

   ```
   yarn build
   ```

* Start a webserver on port 8000 to preview changes

   ```
   yarn start
   ```

* Run code style check

   ```
   yarn lint
   ```

## Prepare a release

1. Update version number in `package.json` file

2. Update `CHANGES.md` file

3. Commit your changes: `git add... `, `git commit ...`, `git push ...` etc

4. Tag release: `git tag THE_VERSION_NUMBER`, `git push --tags`

5. Upload release