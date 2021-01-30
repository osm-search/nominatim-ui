module.exports.get_config_value = get_config_value;


const Nominatim_Config_Defaults = {
  Nominatim_API_Endpoint: 'http://localhost/nominatim/',
  Images_Base_Url: 'mapicons/',
  Search_AreaPolygons: 1,
  Reverse_Default_Search_Zoom: 18,
  Map_Default_Lat: 20.0,
  Map_Default_Lon: 0.0,
  Map_Default_Zoom: 2,
  Map_Tile_URL: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
  Map_Tile_Attribution: '<a href="https://osm.org/copyright">OpenStreetMap contributors</a>'
};

function get_config_value(str, default_val) {
  var value = ((typeof Nominatim_Config !== 'undefined')
               && (typeof Nominatim_Config[str] !== 'undefined'))
    ? Nominatim_Config[str]
    : Nominatim_Config_Defaults[str];
  return (typeof value !== 'undefined' ? value : default_val);
}
