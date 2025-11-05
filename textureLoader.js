import * as THREE from 'three';

export async function loadMapTexture({ centerLatLng, zoom, sizePx, mapType, apiKey, loaderElement }) {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(centerLatLng)}`
        + `&zoom=${zoom}&size=${sizePx}x${sizePx}`
        + `&maptype=${mapType}&key=${apiKey}`;
    try {
        loaderElement.textContent = 'Loading map texture…';
        const texture = await new THREE.TextureLoader().loadAsync(url);
        loaderElement.style.display = 'none';
        return texture;
    } catch (err) {
        loaderElement.textContent = 'Error loading map texture!';
        console.error(err);
        throw err;
    }
}