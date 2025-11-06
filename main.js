import { createRenderer } from './renderer.js';
import { setupGroundPlane, setupTools } from './sceneUtils.js';
import { setupEventHandlers } from './eventHandlers.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadMapTexture } from './textureLoader.js';
import { API_KEY } from './config.js';

const uploadContainer = document.getElementById('upload-container');
const loader = document.getElementById('loader');
const fileInput = document.getElementById('fileInput');
const toolsUI = document.getElementById('tools-menu');
let map;
let mapLocation = {
    lat: -34.02607768084851,
    lng:150.84073423804892,
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
        const center = map.getCenter();
        mapLocation = { lat: center.lat(), lng: center.lng(), zoom: map.getZoom() };
    });

}
initMap();
setupEventHandlers(fileInput, uploadContainer, loader, startScene);
let currentTool = null;
async function startScene() {
    loader.style.display = 'flex';

    // Create renderer
    const renderer = createRenderer();
    document.body.appendChild(renderer.domElement);

    // Create camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    console.log(mapLocation);

    const texture = await loadMapTexture({
        centerLatLng: mapLocation.lat + ',' + mapLocation.lng,
        zoom: mapLocation.zoom,
        sizePx: 1024,
        mapType: "satellite",
        apiKey: API_KEY,
        loaderElement: loader
    });
    // Create scene
    const mainScene = new THREE.Scene();
    // Build scene
    const groundPlane = await setupGroundPlane(mainScene, texture);
    // Setup tools
    toolsUI.style.display = 'flex';
    setupTools(mainScene, camera, renderer, currentTool, groundPlane);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(mainScene, camera);
    }

    animate();
}
