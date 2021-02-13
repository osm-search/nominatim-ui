# CHANGES

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
