import * as THREE from 'three';

export function createMousePositionLabel(camera, renderer, plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)) {
  const label = document.createElement('div');
  label.id = 'mouse-position-label';

  document.body.appendChild(label);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const point = new THREE.Vector3();

  function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Intersect with given plane (default: ground plane y=0)
    if (raycaster.ray.intersectPlane(plane, point)) {
      label.style.left = `${event.clientX}px`;
      label.style.top = `${event.clientY}px`;
      label.style.display = 'block';
      label.textContent = `${point.x.toFixed(2)},${point.z.toFixed(2)}`;
    } else {
      label.style.display = 'none';
    }
  }

  function enable() {
    renderer.domElement.addEventListener('mousemove', onMouseMove);
  }

  function disable() {
    renderer.domElement.removeEventListener('mousemove', onMouseMove);
    label.style.display = 'none';
  }

  return { enable, disable, element: label };
}
