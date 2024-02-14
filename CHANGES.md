# CHANGES

* version 3.5.1 - 2024-02-14
    * Automatic release creation for 3.5.0 failed on Github Actions

* version 3.5.0 - 2024-02-14
    * Requires nodejs version 18 now
    * Reverse page: add optional 'layer' parameter
    * NPM package updates (Puppeteer 21 => 22, Rollup 3 => 4)
    * Documentation: Show how to install into a nominatim-docker installation

* version 3.4.0 - 2023-08-29
    * Search map: delete old viewbox rectangle before adding a new one
    * Details page: Allow searching for negative OSM ids.
    * Details page: Nominatim started returning empty hash instead of empty array when a place has no
       names
    * test-suite: Nominatim no longer returns streets as children of a city. Adjusted test to
       look for children of a street instead
    * NPM package updates

* version 3.3.0 - 2023-06-26
    * Reverse map: show search position (red circle) also when no search results
    * test-suite: remove httpbin HTTP calls, server is unreliable
    * test-suite: replace eslint-plugin-svelte3 with eslint-plugin-svelte plus lint fixes
    * NPM package updates (Bootstrap 5.3, Leaflet 1.9.4)
    * NPM package updates (Svelte 3.x => 4.0)

* version 3.2.12 - 2023-04-04
    * Reverse page: remove uncommon zoom labels, align with Nominatim 4.x
    * NPM package updates

* version 3.2.11 - 2023-03-08
    * Configuration: You can now set Map_Default_Bounds als alternative to lat,lon, zoom. Thanks Piskvor
    * NPM package updates

* version 3.2.10 - 2023-01-06

    * Search page: When searching for OSM URL redirect to detail page automatically
    * Reverse page: Search for "12.34%2C56.78" now also auto-splits into two fields
    * Detail page: Another link to documentation about postcodes
    * NPM package updates

* version 3.2.9 - 2022-11-16

    * Fix: For places tagged bulding=yes display the formatted label 'Building', not 'Yes'
    * migrate remaining modules to ESM style (import instead of require)
    * NPM package updates
    * test suite: use JSON files for mocha and eslint configuration
    * test suite: update outdated Github Actions

* version 3.2.8 - 2022-09-26

    * Use OSM's preferred tile URL for faster map loading
    * NPM package updates

* version 3.2.7 - 2022-08-07

    * Documentation: Add a config.theme.js.example file. Thanks coleman-rik

* version 3.2.6 - 2022-07-14

    * Fix: New URL for postcode documentation. Thanks otbutz

* version 3.2.5 - 2022-05-24

    * Reverse map: add tooltips to circles as hint what is the search and what is result position

* version 3.2.4 - 2022-05-05

    * Configuration: Nominatim_API_Endpoint can now also be a callback
    * NPM package updates

* version 3.2.3 - 2022-04-05

    * Fix: On Search page the 'deduplication' checkbox needs to be checked by default

* version 3.2.2 - 2022-02-08

    * NPM package updates

* version 3.2.1 - 2021-05-11

    * Fix: some npm modules no longer support node version 10

* version 3.2.0 - 2021-05-10

    * Upgrade layout framework to Bootstrap version 5
    * Removed polygon parameters from debug URLs, rarely needed. Thanks darkshredder
    * Fix: Search page didn't load when Nominatim_API_Endpoint was set to a relative path. Thanks darkshredder
    * Fix: Detail search allows lowercase OSM types, e.g. n123. Thanks darkshredder
    * Fix: Better deal with empty child place responses from the API
    * Fix: Make sure a full build happens before running tests

* version 3.1.0 - 2021-04-26

    * Configuration: new options to set API endpoint headers and additional paramters, thanks petoc
    * Test suite: New test suite using a headless browser for UI interaction, thanks darkshredder
    * Fix: Links to API URL weren't displayed after a search
    * Fix: On result pages the map icons were not cleared between searches (caching issue)
    * Fix: On reverse page switching empty coordinates no longer leads to string 'null' searches

* version 3.0.5 - 2021-04-14

    * Details page: better indicate places having no name, thanks darkshredder
    * Last updated: avoid race conditions, make less API requests

* version 3.0.4 - 2021-04-12

    * Search page: when clicking to reverse page keep the map position
    * Search page: automatically switch to structured form when URL contains structured fields
    * Search page: validate country-codes fields with a regular expression before form submission, thanks otbutz
    * Reverse page: validate latitude and longitude fields before form submission
    * Details page: help text next to 'calculated postcode'
    * fix a build warning

* version 3.0.3 - 2021-03-12

    * new Status page
    * fixed validation of polygon simplification form field

* version 3.0.2 - 2021-03-05

    * Details page: don't print 'null' when postcode is missing
    * Details page: make sure links to children,hierarcy update after pageload, thx LiteratimBi for the report
    * Details page: in hierachy list all addresslines were marked unused (grayed out)
    * Details page: API doesn't always return address keywords
    * PageLinks/ReverseLink: fix warnings when properties not set

* version 3.0.1 - 2021-03-05

    * Details page: table is now responsive, no longer overflows
    * Documentation: fix link to theme configuration file

* version 3.0.0 - 2021-02-25

    Version 3 add a new directory dist/theme/. It changes the default welcome, about and
    help text, and moves the configuration into dist/theme/. Admins should review those
    (explained in README.md) before deploying the nominatim-ui.

    * Major change: Add theming
    * Major change: Replace dist/config.js with dist/config.default.js and dist/theme/config.theme.js
    * Refactored and added API error output
    * Build: dist/build/bundle.* files are now created by a Github Action upon release, no longer in version control
    * Documentation: removed TODO.md, we use github issues now
    * Documentation: README.md is part of the release, moved some development content to CONTRIBUTE.md
    * Documentation: badge showing latest release version in README.md
    * Documentation: badge showing latest test (Github CI) output in CONTRIBUTE.md

* version 2.3.0 - 2021-02-19

    * New top-level navigation: Search, Reverse, Search-by-id
    * Details page: now has a search form, all 3 search fields merged into one
    * Details page: add links for countries and postalcodes
    * Last updated: now display as "x minutes/hours/days ago"
    * Layout fixes for small browsers/mobile
    * Simple automatic test setup (Github actions)

* version 2.2.0 - 2021-02-13

    * Less page reloading
    * Handle all page changes via page store
    * Reverse search: click on map no longer triggers form submission
    * Convert some lib/helpers that returned HTML into Svelte components

* version 2.1.0 - 2021-02-10

    * Reverse search: better initial zoom when result found
    * Reverse search: split value when copy&pasting a coordinate pair into first search field
    * Further split reverse from search logic/templates 
    * Details page: display error when place not found
    * replaced development webserver node-static with static-server
    * Less page reloading
    * LastUpdated is now its own component
    * Add linting (run: yarn lint)

* version 2.0.2 - 2021-02-02

    * Reverse search: click on map triggers new search
    * Report-issue modal from version 1 was missing
    * Removed search-url-params polyfill. Svelte doesnt support MSIE11 either

* version 2.0.1 - 2021-01-31

    * removed debug files from dist/build/ [PR47]

* version 2.0.0 - 2021-01-29

    * Complete refactor into Svelte framework
    * Removed most of jQuery usage

* version 1.2.5 - 2021-03-04

    * Another fix to make sure pages work when app is in a subdirectory

* version 1.2.4 - 2020-09-01

    * All links to detail page should include the class parameter

* version 1.2.3 - 2020-09-01

    * Favicon URLs did not work when app is installed in a subdirectory
    * On detail page in parents and linked-places sections address lines were all grayed out

* version 1.2.2 - 2020-09-01

    * Don't intercept link clicks when the target is the raw API output

* version 1.2.1 - 2020-08-04

    * URL parsing now works if app is in a subdirectory

* version 1.2 - 2020-07-07

    * Use window.history.pushState to minimize page reloads

* version 1.1 - 2020-06-19

    * Configuration now optional with example file.
    * New CONTRIBUTE.md documentation.

* version 1.0 - November 2019 during a hackweekend at Linuxhotel
