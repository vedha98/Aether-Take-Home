import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
export function createBuildingGeometry(points, height, groundPlane) {
    let building = new THREE.Group();
    let vertices = [];
    let uvs = [];
    const topTexture = groundPlane.material.map.clone();
    // Create base shape
    points.forEach(pt => {
        vertices.push(new THREE.Vector3(pt.x, pt.y, pt.z));
    })
    // Create top shape
    points.forEach(pt => {
        vertices.push(new THREE.Vector3(pt.x, pt.y + height, pt.z));
    });
    const geometry = new ConvexGeometry(vertices);
    const buildingMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
            color: "#6b6b6b",
            opacity: 1
        })
    );

    const groundSize = 20;
    const topVertices = points.map(p => new THREE.Vector3(p.x, height + 0.001, p.z));
    const topGeometry = new ConvexGeometry(topVertices);

    topGeometry.attributes.position.array.forEach((val, i) => {
        if (i % 3 === 0) {
            // x coordinate
            const x = val;
            uvs.push(((x + groundSize / 2) / groundSize));
        }
        if (i % 3 === 2) {
            // z coordinate
            const z = val;
            uvs.push(1 - ((z + groundSize / 2) / groundSize));
        }
    });
    topGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const topMesh = new THREE.Mesh(
        topGeometry,
        new THREE.MeshStandardMaterial({ map: topTexture, side: THREE.DoubleSide })
    );
    building.add(topMesh);
    building.add(buildingMesh);
    return building;
}