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

You can start a simple HTTP webserver ([Big list of http static server one-liners](https://gist.github.com/willurd/5720255)).

```
php -S localhost:8000 -t dist
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
