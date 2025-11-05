import * as THREE from 'three';
import { createBuildingGeometry } from './objectsCreator.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';

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
    function onMouseMove(event) {
        // Convert mouse to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersection = raycaster.intersectObject(groundPlane);
        if (intersection.length < 1) return; // No intersection

        const hoverPoint = intersection[0].point.clone();
        if (line) scene.remove(line);
        if (points.length > 1) {
            const geometry = new LineGeometry();
            geometry.setPositions(points.flatMap(p => [p.x, 0.001, p.z]).concat([hoverPoint.x, 0.001, hoverPoint.z]));
            line = new Line2(
                geometry,
                new LineMaterial(
                    {
                        color: 'crimson',
                        linewidth: 3,
                        opacity: 0.1,
                        alphaToCoverage: false,
                        depthTest: false
                    }
                ))
            line.computeLineDistances();
            console.log("asdding to the scent");

            scene.add(line);
        }
    }
    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersection = raycaster.intersectObject(groundPlane);
        if (!intersection) return; // No intersection
        points.push(intersection[0].point.clone());
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
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
    }

    function disable() {
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
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
