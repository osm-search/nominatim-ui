# TODO list

* check output of /dist into repository?


## Might never work

* pagination. API returns an array without indication if more results exist
* API returns category, type, but without admin_level we can't derive e.g. state,country
* seeting acceptlanguage whichout a server component https://github.com/dansingerman/jQuery-Browser-Language

## Nice-to-have

* support nearlat,nearlon parameters
* should images/mapicons/ be served from API server or this repo?
* different content for official OSM, e.g. github urls
* set HTML title
* cache `update_data_date` result somehow?
* a new search causes a new pageview
* add tests with fixtures
* detailpage: make linkedplaces, childplaces optional (rarely used? second click to enable?)
* set better alt tag for icons
* print text "loading..." instead of an error (which the user sees for a split second)
* concatenate/minify JS and CSS

## Code cleanup

* move TODO list into github issues
* show map bounds section => move to handlebar template, map to partial
* aResults vs aPlace vs aFeature variable naming
* use CSS preprocessor and linter
* use eslint. It's already a dependency but throws errors
* cut line length (eslint warns when longer than 100)
* upgrade bootstrap v3 to v4
