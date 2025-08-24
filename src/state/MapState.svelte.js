class MapState {
  center = $state();
  zoom = $state();
  viewboxStr = $state();
  lastClick = $state();
  mousePos = $state();

  reset() {
    this.center = undefined;
    this.zoom = undefined;
    this.viewboxStr = '';
    this.lastClick = undefined;
    this.mousePos = undefined;
  }
}

export const mapState = new MapState();
