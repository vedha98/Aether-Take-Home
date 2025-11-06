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

export function askForHeight(onSubmit) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.step = '0.1';
  input.placeholder = 'Enter building height (m)';
  Object.assign(input.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff',
    zIndex: 9999,
  });

  document.body.appendChild(input);
  input.focus();

  function handleKey(e) {
    if (e.key === 'Enter') {
      const val = parseFloat(input.value);
      document.body.removeChild(input);
      window.removeEventListener('keydown', handleKey);
      if (!isNaN(val) && val > 0) onSubmit(val);
      else alert('Invalid height');
    } else if (e.key === 'Escape') {
      document.body.removeChild(input);
      window.removeEventListener('keydown', handleKey);
    }
  }

  window.addEventListener('keydown', handleKey);
}
