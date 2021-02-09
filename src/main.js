import App from './App.svelte';
import { refresh_page } from './lib/stores.js';

let myhistory = [];

const app = new App({ // eslint-disable-line no-unused-vars
  target: document.body
});

/*
function is_relative_url(url) {
  if (!url) return false;
  if (url.indexOf('?') === 0) return true;
  if (url.indexOf('/') === 0) return true;
  if (url.indexOf('#') === 0) return false;
  if (url.match(/^http/)) return false;
  if (!url.match(/\.html/)) return true;

  return false;
}


// load page after click on relative URL
document.addEventListener('click', function (e) {

  // loop parent nodes from the target to the delegation node
  for (var target = e.target; target && target !== this; target = target.parentNode) {

    if (target.matches('a') && target.href) {
      // target.href always contains the full absolute URL, inspect the raw value instead
      var target_url = target.attributes.href.value;

      if (!is_relative_url(target_url)) return;

      e.preventDefault();
      e.stopPropagation();

      window.history.pushState(myhistory, '', target_url);

      refresh_page();
      break;
    }
  }
});
*/
