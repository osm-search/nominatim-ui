import App from './App.svelte';
import SearchPage from './pages/SearchPage.svelte';
import DetailsPage from './pages/DetailsPage.svelte';
import PolygonsPage from './pages/PolygonsPage.svelte';
import DeletablePage from './pages/DeletablePage.svelte';

import { serialize_form, clean_up_url_parameters } from './lib/api_utils.js'

let myhistory = [];

const app = new App({
  target: document.body
});




// inspects window.location
function identify_current_page() {
  var pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

  if (pagename === '') { return 'search' }

  if (['search', 'reverse', 'details', 'deletable', 'polygons'].indexOf(pagename) != '-1') {
    return pagename;
  }
}



function parse_url_and_load_page() {
  let pagename = identify_current_page();

  document.getElementById('main').replaceChildren();

  if (pagename === 'search' || pagename === 'reverse') {
    new SearchPage({
      target: document.getElementById('main'),
      props: {
        reverse_search: (pagename === 'reverse')
      }
    });
  } else if (pagename === 'details') {
    new DetailsPage({
      target: document.getElementById('main')
    });
  } else if (pagename === 'deletable') {
    new DeletablePage({
      target: document.getElementById('main')
    });
  } else if (pagename === 'polygons') {
    new PolygonsPage({
      target: document.getElementById('main')
    });
  }
}



function is_relative_url(url) {
  if (!url) return false;
  if (url.indexOf('?') === 0) return true;
  if (url.indexOf('/') === 0) return true;
  if (url.indexOf('#') === 0) return false;
  if (url.match(/^http/)) return false;
  if (!url.match(/\.html/)) return true;

  return false;
}


parse_url_and_load_page();

// load page after form submit
document.addEventListener('submit', function (e) {

  // loop parent nodes from the target to the delegation node
  for (var target = e.target; target && target != this; target = target.parentNode) {
    if (target.matches('form')) {
      e.preventDefault();

      var target_url = serialize_form(target);
      target_url = clean_up_url_parameters(target_url);

      window.history.pushState(myhistory, '', '?' + target_url);

      parse_url_and_load_page();
      break;
    }
  }

});

// load page after click on relative URL
document.addEventListener('click', function (e) {

  // loop parent nodes from the target to the delegation node
  for (var target = e.target; target && target != this; target = target.parentNode) {
    if (target.matches('a')) {

      var target_url = target.href;

      if (!is_relative_url(target_url)) return;

      e.preventDefault();
      e.stopPropagation();

      window.history.pushState(myhistory, '', target_url);

      parse_url_and_load_page();
      break;
    }
  }
});

// deal with back-button and other user action
window.onpopstate = function () {
  parse_url_and_load_page();
};



