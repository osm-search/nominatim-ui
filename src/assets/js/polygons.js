// *********************************************************
// BROKEN POLYGON PAGE
// *********************************************************

jQuery(document).ready(function () {
  if (!$('#polygons-page').length) { return; }

  var api_request_params = {
    format: 'json'
  };

  fetch_from_api('polygons', api_request_params, function (aPolygons) {
    var context = { aPolygons: aPolygons };

    render_template($('main'), 'polygons-template', context);
    update_html_title('Broken polygons');

    update_data_date();
  });
});
