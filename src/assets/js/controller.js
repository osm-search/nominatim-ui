jQuery(document).ready(function () {
  var myhistory = [];

  function parse_url_and_load_page() {
    // 'search', 'reverse', 'details'
    var pagename = window.location.pathname.replace('.html', '').replace(/^.*\//, '');

    if (pagename === '') pagename = 'search';

    $('body').attr('id', pagename + '-page');

    if (pagename === 'search' || pagename === 'reverse') {
      search_page_load();
    } else if (pagename === 'details') {
      details_page_load();
    } else if (pagename === 'deletable') {
      deletable_page_load();
    } else if (pagename === 'polygons') {
      polygons_page_load();
    }
  }

  function is_relative_url(url) {
    if (!url) return false;
    if (url.match(/debug=1/)) return false;
    if (url.indexOf('?') === 0) return true;
    if (url.indexOf('/') === 0) return true;
    if (url.indexOf('#') === 0) return false;
    if (url.match(/^http/)) return false;
    if (!url.match(/\.html/)) return true;

    return false;
  }

  // remove any URL paramters with empty values
  // '&empty=&filled=value' => 'filled=value'
  function clean_up_url_parameters(url) {
    var url_params = new URLSearchParams(url);
    var to_delete = []; // deleting inside loop would skip iterations
    url_params.forEach(function (value, key) {
      if (value === '') to_delete.push(key);
    });
    for (var i = 0; i < to_delete.length; i += 1) {
      url_params.delete(to_delete[i]);
    }
    return url_params.toString();
  }

  parse_url_and_load_page();

  // load page after form submit
  $(document).on('submit', 'form', function (e) {
    e.preventDefault();

    var target_url = $(this).serialize();
    target_url = clean_up_url_parameters(target_url);

    window.history.pushState(myhistory, '', '?' + target_url);

    parse_url_and_load_page();
  });

  // load page after click on relative URL
  $(document).on('click', 'a', function (e) {
    var target_url = $(this).attr('href');
    if (!is_relative_url(target_url)) return;

    e.preventDefault();
    e.stopPropagation();

    window.history.pushState(myhistory, '', target_url);

    parse_url_and_load_page();
  });

  // deal with back-button and other user action
  window.onpopstate = function () {
    parse_url_and_load_page();
  };
});

