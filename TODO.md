# TODO list


## Might never work

* API returns category, type, but without admin_level we can't derive e.g. state,country
* setting accept-language without a server component https://github.com/dansingerman/jQuery-Browser-Language

## Nice-to-have

* on /details page differenciate between not found (HTTP 404 from API) and missing parameters (HTTP 400 from API)
* display API errors, e.g. Object { code: 400, message: "Integer number expected for parameter 'limit'" }
* cache `update_data_date` result somehow?
* add tests with fixtures
* add .travis-ci.yml again

## Code cleanup

* move all bootstrap CSS overwrite rules into a bootstrap.theme.css file
* move TODO list into github issues
* aResults vs aPlace vs aFeature variable naming
* remove jquery completely (once bootstrap v5 is used)
* in package.json clarify which dependencies are used in dev and production
