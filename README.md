# Nominatim-UI

Debugging user interface for [Nominatim](https://nominatim.org/)
([source](https://github.com/openstreetmap/Nominatim/)) geocoder.
The frontend runs standalone as website and will requests data
from a separate Nominatim API (either on the same server or
remote).

Uses [jQuery](https://jquery.com/) for browser DOM interaction,
[handlebar](http://handlebarsjs.com/) templates to build pages,
[leaflet](https://leafletjs.com/) for map interaction,
[bootstrap](https://getbootstrap.com/) for layout styling.


## Background

The user interface used to be included in the geocoder. Thus the
first version avoid being a redesign and still uses some of the
same configuration values. For simplicity it's not a single
page application (SPA) written in a framework though it could
be if complexity grows.


## Starting the frontend

You can open the `dist` directory in your browser.

You can start a simple webserver

   * PHP

   ```
   php -S 0.0.0.0:8000 -t dist
   ```

   * Python 

   ```
   cd dist
   python -m SimpleHTTPServer 8000
   # python 3
   python -m http.server 8000
   ```

   * NodeJS
   
   ```
   # npm install -g light-server
   light-server -s dist -p 8000
   ```


## Configuration

In `dist/config.js` you will find configuration options. The first
you want to doublecheck is the `Nominatim_API_Endpoint` URL.


## Building the frontend

* Install dependencies

   ```
   yarn install
   ```

* After you change files in `src` directory

   ```
   ./build.sh
   ```

## License

The source code is available under a GPLv2 license.
