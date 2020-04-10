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

rsync --quiet node_modules/bootstrap/dist/js/bootstrap.min.js dist/assets/js/
rsync --quiet node_modules/bootstrap/dist/css/bootstrap.min.css* dist/assets/css/
rsync --quiet node_modules/bootstrap/dist/css/bootstrap-theme.min.css* dist/assets/css/

rsync --quiet node_modules/handlebars/dist/handlebars.min.js dist/assets/js/
rsync --quiet node_modules/@ungap/url-search-params/min.js dist/assets/js/url-search-params.js
rsync --quiet src/templates/*.hbs dist/

rsync --quiet src/*.js dist/


# replaced the Perl one-liner with shell logic to remove the dependency
# cat src/layout.html | perl -pe'use File::Slurper qw(read_text); s/\@include\((.+?)\)/read_text($1)/eg' > /tmp/included.html

cat src/layout.html | grep -v '</body>' | grep -v '</html>' | sed -e 's/BODYID/search-page/' > dist/search.html
echo '<script id="searchpage-template" type="text/x-handlebars-template">' >> dist/search.html
cat src/templates/searchpage.hbs >> dist/search.html
echo '</script>' >> dist/search.html
echo '</body>' >> dist/search.html
echo '</html>' >> dist/search.html

cat src/layout.html | grep -v '</body>' | grep -v '</html>' | sed -e 's/BODYID/reverse-page/' > dist/reverse.html
echo '<script id="reversepage-template" type="text/x-handlebars-template">' >> dist/reverse.html
cat src/templates/reversepage.hbs >> dist/reverse.html
echo '</script>' >> dist/reverse.html
echo '</body>' >> dist/reverse.html
echo '</html>' >> dist/reverse.html

cat src/layout.html | grep -v '</body>' | grep -v '</html>' | sed -e 's/BODYID/details-page/' > dist/details.html
echo '<script id="detailspage-template" type="text/x-handlebars-template">' >> dist/details.html
cat src/templates/detailspage.hbs >> dist/details.html
echo '</script>' >> dist/details.html
echo '<script id="detailspage-index-template" type="text/x-handlebars-template">' >> dist/details.html
cat src/templates/detailspage-index.hbs >> dist/details.html
echo '</script>' >> dist/details.html
echo '</body>' >> dist/details.html
echo '</html>' >> dist/details.html

cat src/layout.html | grep -v '</body>' | grep -v '</html>' | sed -e 's/BODYID/deletable-page/' > dist/deletable.html
echo '<script id="deletable-template" type="text/x-handlebars-template">' >> dist/deletable.html
cat src/templates/deletable.hbs >> dist/deletable.html
echo '</script>' >> dist/deletable.html
echo '</body>' >> dist/deletable.html
echo '</html>' >> dist/deletable.html

cat src/layout.html | grep -v '</body>' | grep -v '</html>' | sed -e 's/BODYID/polygons-page/' > dist/polygons.html
echo '<script id="polygons-template" type="text/x-handlebars-template">' >> dist/polygons.html
cat src/templates/polygons.hbs >> dist/polygons.html
echo '</script>' >> dist/polygons.html
echo '</body>' >> dist/polygons.html
echo '</html>' >> dist/polygons.html

cp src/index.html dist/
