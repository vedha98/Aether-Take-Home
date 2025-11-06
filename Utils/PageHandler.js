/**
 * Setup event handlers for load button
 * @param {HTMLElement} loadButton
 * @param {HTMLElement} uploadContainer
 * @param {HTMLElement} loader
 * @param {function} startScene
 */
export function setupEventHandlers(loadButton, uploadContainer, loader, startScene) {
  loadButton.addEventListener('click', (event) => {
    uploadContainer.style.display = 'none';
    loader.style.display = 'block';
    startScene();
  });
}

/**
 * Setup Google Maps and return function to get current map location
 * @returns {function(): {lat: number, lng: number, zoom: number}}
 */
export function setupGoogleMaps() {
  //Google Maps Initialization
  let map;
  let mapLocation = {
    lat: -34.02607768084851,
    lng: 150.84073423804892,
    zoom: 21
  };
  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
      center: {
        lat: -34.02607768084851, lng:
          150.84073423804892
      },
      mapTypeId: 'satellite',
      zoom: 21,
    });
    map.addListener("center_changed", () => {
      setMapLocation()
    });
    map.addListener("zoom_changed", () => {
      setMapLocation()
    });
    function setMapLocation() {
      const center = map.getCenter();
      mapLocation = { lat: center.lat(), lng: center.lng(), zoom: map.getZoom() };
    };

  }
  initMap();
  return function getMapLocation(){
    return mapLocation;
  }
}