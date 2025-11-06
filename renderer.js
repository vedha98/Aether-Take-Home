import * as THREE from 'three';

/**
 * Create and configure a Three.js WebGL renderer
 * @returns {THREE.WebGLRenderer} Configured renderer
 */
export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#EDF2F0");
  return renderer;
}
