// *********************************************************
// DELETABLE PAGE
// *********************************************************

function deletable_page_load() {

  var api_request_params = {
    format: 'json'
  };

  fetch_from_api('deletable', api_request_params, function (aPolygons) {
    var context = { aPolygons: aPolygons };

    render_template($('main'), 'deletable-template', context);
    update_html_title('Deletable objects');

    update_data_date();
  });
}
