import { createRenderer } from './renderer.js';
import { setupGroundPlane, setupTools } from './Utils/SceneUtils.js';
import { setupEventHandlers, setupGoogleMaps } from './Utils/PageHandler.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadMapTexture } from './Loaders/TextureLoader.js';
import { API_KEY } from './config.js';

const uploadContainer = document.getElementById('upload-container');
const loader = document.getElementById('loader');
const loadButton = document.getElementById('load-button');
const toolsUI = document.getElementById('tools-menu');

// Setup Google Maps and get location function
const getMapLocation = setupGoogleMaps();

// Setup event handlers to manage UI
setupEventHandlers(loadButton, uploadContainer, loader, startScene);

// Main function to start the 3D scene
async function startScene() {
    // Show loader
    loader.style.display = 'flex';
    const mapLocation = getMapLocation();
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

    // Load map texture
    const texture = await loadMapTexture({
        centerLatLng: mapLocation.lat + ',' + mapLocation.lng,
        zoom: mapLocation.zoom,
        sizePx: 4096,
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
    setupTools(mainScene, camera, renderer, groundPlane);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(mainScene, camera);
    }

    animate();
}
