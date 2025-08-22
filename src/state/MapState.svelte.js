import {latLng } from 'leaflet';

class MapState {
  center = $state(latLng(Nominatim_Config.Map_Default_Lat,
                         Nominatim_Config.Map_Default_Lon));
  zoom = $state(Nominatim_Config.Map_Default_Zoom);
  viewboxStr = $state();
  lastClick = $state();
  mousePos = $state();
}

export const mapState = new MapState();
