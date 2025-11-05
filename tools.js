import * as THREE from 'three';
import { createBuildingGeometry } from './objectsCreator.js';

/**
 * Polygon drawing tool
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 */
export function createPolygonTool(scene, camera, renderer, groundPlane) {
    const points = [];
    let line = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
        // Convert mouse to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersection = raycaster.intersectObject(groundPlane);

        if (!intersection) return; // No intersection
        console.log(intersection);

        points.push(intersection[0].point.clone());

        // Draw line connecting points
        if (line) scene.remove(line);
        console.log(points);

        if (points.length > 1) {
            const geometry = new THREE.BufferGeometry().setFromPoints([...points, points[0]]);
            line = new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({ color: 0xff0000 })
            );
            scene.add(line);
        }
    }

    function finishPolygon() {
        if (points.length < 3) return alert("Need at least 3 points to create a polygon!");

       const buildingMesh = createBuildingGeometry(points, 5, groundPlane);

        scene.add(buildingMesh);

        // Clear temp line and points
        if (line) scene.remove(line);
        points.length = 0;
        line = null;
        disable();
    }

    function enable() {
        renderer.domElement.addEventListener('click', onClick);
        window.addEventListener('keydown', onKeyDown);
    }

    function disable() {
        renderer.domElement.removeEventListener('click', onClick);
        window.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(event) {
        if (event.key === 'Enter') finishPolygon(); // press Enter to finish
        if (event.key === 'Escape') { // cancel
            if (line) scene.remove(line);
            points.length = 0;
            line = null;
        }
    }

    return { enable, disable };
}
