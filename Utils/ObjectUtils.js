import * as THREE from 'three';
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
    const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points.map(p => new THREE.Vector2(p.x, p.z))), {
        depth: -height,
        bevelEnabled: false,
        steps: 1
    });
    const buildingMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
            color: "#6b6b6b",
            opacity: 1,
            side: THREE.DoubleSide
        })
    );
    buildingMesh.rotation.x = Math.PI / 2;
    buildingMesh.position.y = 0.001;
    const groundSize = 20;
    const topVertices = points.map(p => new THREE.Vector3(p.x, height + 0.001, p.z));
    const topGeometry = new THREE.ShapeGeometry(new THREE.Shape(topVertices.map(v => new THREE.Vector2(v.x, v.z)), 100));
    topGeometry.attributes.position.array.forEach((val, i) => {
        if (i % 3 === 0) {
            // x coordinate
            const x = val;
            uvs.push(((x + groundSize / 2) / groundSize));
        }
        if (i % 3 === 1) {
            // y coordinate
            const y = val;
            uvs.push(1 - ((y + groundSize / 2) / groundSize));
        }
    });
    topGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    topGeometry.computeVertexNormals();
    const topMesh = new THREE.Mesh(
        topGeometry,
        new THREE.MeshBasicMaterial({ map: topTexture, side: THREE.DoubleSide })
    );
    topMesh.position.y = height + 0.003;
    topMesh.rotation.x = Math.PI / 2;
    
    building.add(topMesh);
    building.add(buildingMesh);
    return building;
}