#!/bin/bash

mkdir -p dist/assets/
rsync --quiet --recursive src/assets/css/ dist/assets/css/
rsync --quiet --recursive src/assets/images/ dist/assets/images/

mkdir -p dist/assets/js/
cat src/assets/js/base.js src/assets/js/detailpage.js src/assets/js/searchpage.js > dist/assets/js/nominatim-ui.js

rsync --quiet --recursive src/vendor/js/* dist/assets/js/
rsync --quiet --recursive node_modules/jquery/dist/jquery.min.js dist/assets/js/
rsync --quiet --recursive node_modules/leaflet/dist/leaflet.js dist/assets/js/
rsync --quiet --recursive node_modules/leaflet/dist/leaflet.js.map dist/assets/js/
rsync --quiet --recursive node_modules/leaflet/dist/leaflet.css dist/assets/css/
rsync --quiet --recursive node_modules/leaflet/dist/images/ dist/assets/css/images/

rsync --quiet --recursive node_modules/leaflet-minimap/dist/Control.MiniMap.min.js dist/assets/js/
rsync --quiet --recursive node_modules/leaflet-minimap/dist/Control.MiniMap.min.css dist/assets/css/
rsync --quiet --recursive node_modules/leaflet-minimap/dist/images/ dist/assets/css/images/

rsync --quiet --recursive node_modules/bootstrap/dist/js/bootstrap.min.js dist/assets/js/
rsync --quiet --recursive node_modules/bootstrap/dist/css/bootstrap.min.css dist/assets/css/
rsync --quiet --recursive node_modules/bootstrap/dist/css/bootstrap-theme.min.css dist/assets/css/

rsync --quiet --recursive node_modules/handlebars/dist/handlebars.min.js dist/assets/js/
rsync --quiet --recursive node_modules/@ungap/url-search-params/min.js dist/assets/js/url-search-params.js
# rsync --quiet --recursive src/vendor/css/* dist/assets/css/
# rsync --quiet --recursive src/vendor/images/* dist/assets/images/
rsync --quiet --recursive src/templates dist/

rsync --quiet src/*.js dist/


cat src/layout.html | perl -pe'use File::Slurper qw(read_text); s/\@include\((.+?)\)/read_text($1)/eg' > /tmp/included.html

cat /tmp/included.html | perl -pe's/BODYID/search-page/g' > dist/search.html
cat /tmp/included.html | perl -pe's/BODYID/reverse-page/g' > dist/reverse.html
cat /tmp/included.html | perl -pe's/BODYID/details-page/g' > dist/details.html
cp src/index.html dist/
