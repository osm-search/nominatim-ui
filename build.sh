#!/bin/bash

mkdir -p dist/assets/
rsync --quiet --recursive src/assets/css/ dist/assets/css/
rsync --quiet --recursive src/assets/images/ dist/assets/images/

mkdir -p dist/assets/js/
cat src/assets/js/base.js src/assets/js/detailpage.js src/assets/js/searchpage.js src/assets/js/deletable.js src/assets/js/polygons.js > dist/assets/js/nominatim-ui.js

rsync --quiet node_modules/jquery/dist/jquery.min.js dist/assets/js/
rsync --quiet node_modules/leaflet/dist/leaflet.js dist/assets/js/
rsync --quiet node_modules/leaflet/dist/leaflet.js.map dist/assets/js/
rsync --quiet node_modules/leaflet/dist/leaflet.css dist/assets/css/
rsync --quiet node_modules/leaflet/dist/images/* dist/assets/css/images/

rsync --quiet node_modules/leaflet-minimap/dist/Control.MiniMap.min.js dist/assets/js/
rsync --quiet node_modules/leaflet-minimap/dist/Control.MiniMap.min.css dist/assets/css/
rsync --quiet node_modules/leaflet-minimap/dist/images/* dist/assets/css/images/

rsync --quiet node_modules/bootstrap/dist/js/bootstrap.bundle.min.js* dist/assets/js/
rsync --quiet node_modules/bootstrap/dist/css/bootstrap.min.css dist/assets/css/

rsync --quiet node_modules/handlebars/dist/handlebars.min.js dist/assets/js/
rsync --quiet node_modules/@ungap/url-search-params/min.js dist/assets/js/url-search-params.js
rsync --quiet src/templates/*.hbs dist/

rsync --quiet src/*.js dist/


{
  sed -e 's/BODYID/search-page/' src/layout.html | grep -v '</body>' | grep -v '</html>'
  echo '<script id="searchpage-template" type="text/x-handlebars-template">'
  cat src/templates/searchpage.hbs
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/search.html

{
  sed -e 's/BODYID/reverse-page/' src/layout.html | grep -v '</body>' | grep -v '</html>'
  echo '<script id="reversepage-template" type="text/x-handlebars-template">'
  cat src/templates/reversepage.hbs
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/reverse.html

{
  sed -e 's/BODYID/details-page/' src/layout.html | grep -v '</body>' | grep -v '</html>'
  echo '<script id="detailspage-template" type="text/x-handlebars-template">'
  cat src/templates/detailspage.hbs
  echo '</script>'
  echo '<script id="detailspage-index-template" type="text/x-handlebars-template">'
  cat src/templates/detailspage-index.hbs
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/details.html

{
  sed -e 's/BODYID/deletable-page/' src/layout.html | grep -v '</body>' | grep -v '</html>'
  echo '<script id="deletable-template" type="text/x-handlebars-template">'
  cat src/templates/deletable.hbs
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/deletable.html

{
  sed -e 's/BODYID/polygons-page/' src/layout.html | grep -v '</body>' | grep -v '</html>'
  echo '<script id="polygons-template" type="text/x-handlebars-template">'
  cat src/templates/polygons.hbs
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/polygons.html

cp src/index.html dist/
