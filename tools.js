import * as THREE from 'three';
import { createBuildingGeometry } from './objectsCreator.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { askForHeight } from './UIManager.js';

/**
 * Polygon drawing tool
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 */
export function createPolygonTool(scene, camera, renderer, groundPlane) {
    const points = [];
    let line = null;
    let startPoint = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dotGroup = new THREE.Group();
    function onMouseMove(event) {
        // Convert mouse to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersection = raycaster.intersectObject(groundPlane);
        if (intersection.length < 1) return; // No intersection

        const hoverPoint = intersection[0].point.clone();
        if (line){
            scene.remove(line);
            scene.remove(dotGroup);
            dotGroup.clear();
        }
        if (points.length > 0) {
            const vertices = points.flatMap(p => [p.x, 0.001, p.z]).concat([hoverPoint.x, 0.001, hoverPoint.z]);
            // add lines to show user the polygon being drawn
            const geometry = new LineGeometry();
            geometry.setPositions(vertices);
            line = new Line2(
                geometry,
                new LineMaterial(
                    {
                        color: '#f9f9f9',
                        linewidth: 5,
                        opacity: 0.8,
                        alphaToCoverage: false,
                        depthTest: false,
                        transparent: true
                    }
                ))
            line.computeLineDistances();
            scene.add(line);
            points.forEach(point => {
                const dotGeometry = new THREE.SphereGeometry(0.07, 16, 16);
                const dotMaterial = new THREE.MeshBasicMaterial({ color: "##f9f9f9", opacity: 1, depthTest: false, transparent: true });
                const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
                dotMesh.position.copy(point);
                dotMesh.renderOrder = 999;
                dotGroup.add(dotMesh);
            });

            scene.add(dotGroup);
        }

    }
    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersection = raycaster.intersectObject(groundPlane);
        if (intersection.length < 1) return; // No intersection


        if (points.length === 0) {
            startPoint = intersection[0].point.clone();
        } else if (points.length > 2) {
            const distToStart = intersection[0].point.distanceTo(startPoint);
            if (distToStart < 0.5) {
                return finishPolygon();
            }
        }
        points.push(intersection[0].point.clone());
    }

    function finishPolygon() {
        if (points.length < 3) return alert("Need at least 3 points to create a polygon!");
        askForHeight(async (height) => {
            const buildingMesh = createBuildingGeometry(points, height, groundPlane);
            scene.add(buildingMesh);
            if (line){
            scene.remove(line);
            scene.remove(dotGroup);
            dotGroup.clear();
        }
        points.length = 0;
        line = null;
        })
        // Clear temp line and points
        
        disable();
    }

    function enable() {
        renderer.domElement.addEventListener('click', onClick);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        document.body.style.cursor = "crosshair";
    }

    function disable() {
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('keydown', onKeyDown);
        document.body.style.cursor = "pointer";

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
