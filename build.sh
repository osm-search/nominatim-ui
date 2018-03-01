#!/bin/bash

# mkdir dist/

rsync --quiet --recursive src/assets dist/
rsync --quiet --recursive src/templates dist/
rsync --quiet --recursive src/partials dist/

rsync --quiet src/*.js dist/


cat src/layout.html | perl -pe'use File::Slurper qw(read_text); s/\@include\((.+?)\)/read_text($1)/eg' > /tmp/included.html

cat /tmp/included.html | perl -pe's/BODYID/search-page/g' > dist/search.html
cat /tmp/included.html | perl -pe's/BODYID/reverse-page/g' > dist/reverse.html
cat /tmp/included.html | perl -pe's/BODYID/details-page/g' > dist/details.html

