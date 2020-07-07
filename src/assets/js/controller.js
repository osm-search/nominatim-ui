jQuery(document).ready(function () {
  var myhistory = [];

  function parse_url_and_load_page() {
    // 'search', 'reverse', 'details'
    var pagename = window.location.pathname.replace('.html', '').replace(/^\//, '');

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

  parse_url_and_load_page();

  // load page after form submit
  $(document).on('submit', 'form', function (e) {
    e.preventDefault();

    window.history.pushState(myhistory, '', '?' + $(this).serialize());

    parse_url_and_load_page();
  });

  // load page after click on relative URL
  $(document).on('click', 'a', function (e) {
    var target_url = $(this).attr('href');
    if (target_url && target_url.match(/^http/)) return;
    if (target_url && !target_url.match(/\.html/)) return;

    e.preventDefault();

    window.history.pushState(myhistory, '', target_url);

    parse_url_and_load_page();
  });

  // deal with back-button and other user action
  window.onpopstate = function () {
    parse_url_and_load_page();
  };
});

