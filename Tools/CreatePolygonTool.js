import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { getHeightFromInfoBox } from '../Utils/InterfaceUItils.js';
import { Building } from '../Geometry/Building.js';

/**
 * Create a tool to draw polygons on the ground plane
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 * @param {THREE.Mesh} groundPlane
 * @return {Object} Tool with enable and disable methods
 */
export function createPolygonTool(scene, camera, renderer, groundPlane) {
    const points = [];
    let line = null;
    let startPoint = null;
    let altPressed = false;
    let ctrlPressed = false;
    let pressStartTime;
    const endTolerance = 0.2;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dotGroup = new THREE.Group();
    const dotTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
    const closeDot = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]),
        new THREE.PointsMaterial({ color: "white", size: 25, opacity: 0.4, sizeAttenuation: false, depthTest: false, transparent: true, map: dotTexture })
    );
    closeDot.renderOrder = 1000;
    function onMouseMove(event) {
        if (altPressed || ctrlPressed) return;
        // Convert mouse to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersection = raycaster.intersectObject(groundPlane);
        if (intersection.length < 1) return; // No intersection

        const hoverPoint = intersection[0].point.clone();
        if (hoverPoint.distanceTo(startPoint) < endTolerance && points.length > 2) {
            closeDot.position.copy(startPoint);
            hoverPoint.copy(startPoint);
            scene.add(closeDot);
        } else {
            scene.remove(closeDot);
        }
        if (line) {
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
            let dotsGeometry = new THREE.BufferGeometry().setFromPoints(points);
            dotGroup.add(new THREE.Points(
                dotsGeometry,
                new THREE.PointsMaterial({ color: "#f9f9f9", size: 10, opacity: 1, sizeAttenuation: false, depthTest: false, transparent: true, map: dotTexture })
            ));

            scene.add(dotGroup);
        }

    }
    function onClick(event) {
        if (altPressed || ctrlPressed) return; // ignore clicks when alt or ctrl is pressed
        raycaster.setFromCamera(mouse, camera);
        const intersection = raycaster.intersectObject(groundPlane);
        if (intersection.length < 1) return; // No intersection


        if (points.length === 0) {
            startPoint = intersection[0].point.clone();
        } else if (points.length > 2) {
            const distToStart = intersection[0].point.distanceTo(startPoint);
            if (distToStart < endTolerance) {
                return finishPolygon();
            }
        }
        points.push(intersection[0].point.clone());
    }

    function finishPolygon() {
        if (points.length < 3) return alert("Need at least 3 points to create a polygon!");
        disable();
        getHeightFromInfoBox(async (height) => {
            new Building(scene, groundPlane, height, points).addToScene();
            clearCache();
        }, err => {
            console.log(err);
            clearCache();
        }
        );
    }
    function clearCache() {
        if (line) {
            scene.remove(line);
            scene.remove(dotGroup);
            dotGroup.clear();
        }
        scene.remove(closeDot);
        points.length = 0;
        line = null;
    }
    function enable() {
        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onkeyup);
        document.body.style.cursor = "crosshair";
        document.getElementById("create-tool").setAttribute("disabled", "true");
    }

    function disable() {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onkeyup);
        document.body.style.cursor = "default";
        document.getElementById("create-tool").removeAttribute("disabled");
    }

    function onKeyDown(event) {
        if (event.key === 'Enter') finishPolygon(); // press Enter to finish
        if (event.key === 'Escape') { // cancel
            disable();
            clearCache();
        }
        if (event.key === 'Alt') {
            altPressed = true;
        }
        if (event.key === 'Control') {
            ctrlPressed = true;
        }
    }
    function onkeyup(event) {
        if (event.key === 'Alt') {
            altPressed = false;
        }
        if (event.key === 'Control') {
            ctrlPressed = false;
        }
    }

    function onMouseDown(event) {
        pressStartTime = performance.now();
    }
    function onMouseUp(event) {
        const pressDuration = performance.now() - pressStartTime;
        if (pressDuration < 200) {
            onClick(event);
        }
    }

    return { enable, disable };
}
