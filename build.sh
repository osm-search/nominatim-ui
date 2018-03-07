#!/bin/bash

rsync --quiet --recursive src/assets/css dist/css/
rsync --quiet --recursive src/assets/images/ dist/images/
cat src/assets/js/base.js src/assets/js/detailpage.js src/assets/js/searchpage.js > dist/assets/js/nominatim-ui.js

rsync --quiet --recursive src/vendor/js/* dist/assets/js/
rsync --quiet --recursive src/vendor/css/* dist/assets/css/
# rsync --quiet --recursive src/vendor/images/* dist/assets/images/
rsync --quiet --recursive src/templates dist/
# rsync --quiet --recursive src/partials dist/

rsync --quiet src/*.js dist/


cat src/layout.html | perl -pe'use File::Slurper qw(read_text); s/\@include\((.+?)\)/read_text($1)/eg' > /tmp/included.html

cat /tmp/included.html | perl -pe's/BODYID/search-page/g' > dist/search.html
cat /tmp/included.html | perl -pe's/BODYID/reverse-page/g' > dist/reverse.html
cat /tmp/included.html | perl -pe's/BODYID/details-page/g' > dist/details.html

