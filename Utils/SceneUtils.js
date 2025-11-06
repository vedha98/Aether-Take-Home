import * as THREE from 'three';
import { createPolygonTool } from '../Tools/CreatePolygonTool.js';

/**
 * Setup ground plane with texture
 * @param {THREE.Scene} scene
 * @param {THREE.Texture} texture
 * @returns {THREE.Mesh} ground plane
 */
export async function setupGroundPlane(scene, texture) {
  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  scene.add(dirLight, new THREE.AmbientLight(0xffffff, 1));
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide})
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}
/**
 * Setup tools for the scene
 * @param {THREE.Scene} mainScene
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 * @param {THREE.Mesh} groundPlane
 */
export function setupTools(mainScene, camera, renderer, groundPlane) {
      document.getElementById('create-tool').addEventListener('click', () => {
        createPolygonTool(mainScene, camera, renderer, groundPlane).enable();
    });
}