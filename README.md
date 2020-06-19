# Nominatim-UI

Debugging user interface for [Nominatim](https://nominatim.org/)
([source](https://github.com/osm-search/Nominatim/)) geocoder.
The frontend runs standalone as website and will requests data
from a separate Nominatim API (either on the same server or
remote).

For technical details see [CONTRIBUTING.md]() file.

![Screenshot](screenshot.png)

## Starting the frontend

* You can open the `dist` directory in your browser.

* If you have python installed (part of the Nominatim server installation):

   1. `cd dist`
   2. start webserver `python3 -m http.server 8765` 
   3. open [http://localhost:8765/]() in your browser

* Start a webserver using ([Big list of http static server one-liners](https://gist.github.com/willurd/5720255)) or configure Apache, nginx or other webservers to serve the `dist` directory.


## Configuration

Create a `dist/config.js` file, you can use `dist/config.example.js` as basis (just copy it). All settings are optional. Usually you want to set the `Nominatim_API_Endpoint` value at least.

Defaults:

| setting | default |
|---|---|
| `Nominatim_API_Endpoint` | http://localhost/nominatim/ (port 80) |
| `Images_Base_Url` | images in [mapicons]() |
| `Search_AreaPolygons` | yes, print boundaries of search results on map |
| `Reverse_Default_Search_Zoom` | 18 (house-number level) |
| `Map_Default_Lat`, `Map_Default_Lon`, `Map_Default_Zoom` | display whole world |
| `Map_Tile_URL` | load from openstreetmap.org |
| `Map_Tile_Attribution` | [OpenStreetMap](https://openstreetmap.org/copyright) obviously |


## License

The source code is available under a [GPLv2 license](LICENSE).
