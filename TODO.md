# TODO list



## Essential

* JS error on http://localhost:8000/reverse.html?format=html&lat=51.72702815704774&lon=8.701171874999998&zoom=
* need polyfill for URLSearchParams https://caniuse.com/#feat=urlsearchparams
* Nominatim backend API
   * need /status to support &format=json
   * need /details to support &format=json
* reverse: zoom not set
http://localhost:8000/reverse.html?format=html&lat=52.3755991766591&lon=7.646484374999999&zoom=
* error message on API error or timeout
* detail: support `osm_type`, `osm_id` paramters
* search page: add pagination, moreurl
* search page: add viewbox
* details page: add "There are more child objects which are not shown" back in
* set acceptlanguage to API request
* move this TODO.txt to github issues
* write install instructions
* check output of /dist into repository


## Unknown

* config vs config.local.js
* should it be possible to add comments to config?
* snake_case vs camelCase
* support for proxy environment variables?
* support nearlat,nearlon parameters
* need a `<link href="nominatim.xml" rel="search" title="Nominatim Search" type="application/opensearchdescription+xml">` file
* do we an /src/assets directory?
* in which repository should the images/mapicons/ live?


## Nice-to-have

* don't show unset parameters in URL, e.g. `&a=&b=&c=1` => '&c='
* different content for official OSM, e.g. github urls
* set HTML title
* cache `update_data_date` result
* a new search causes a new pageview
* webpack or grunt build framework
* don't copy jquery/leaflet in /src, use dependency manager instead, e.g. https://bower.io/
* update jquery 2 => 3
* update leaflet
* add tests with fixtures
* concatenate/minify JS and CSS
* reverse: get coordinate switcher working again


## Code cleanup

* we have marker-icon twice
* remove Perl dependency from build
* show map bounds section => move to handlebar template, map to partial
* make sure we use https URL to external sites where possible
* aResults vs aPlace vs aFeature variable naming
* use CSS preprocessor and linter
* use eslint
* add a /vendor directory for third-party files

