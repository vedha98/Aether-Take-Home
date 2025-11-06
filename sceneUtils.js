import * as THREE from 'three';
import { createPolygonTool } from './tools.js';

export async function setupGroundPlane(scene, texture) {
  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  scene.add(dirLight, new THREE.AmbientLight(0xffffff, 0.5));
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide})
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}
export function setupTools(mainScene, camera, renderer, currentTool, groundPlane) {
      document.getElementById('create-tool').addEventListener('click', () => {
        if (currentTool) currentTool.disable();
        currentTool = createPolygonTool(mainScene, camera, renderer, groundPlane);
        currentTool.enable();
    });
}