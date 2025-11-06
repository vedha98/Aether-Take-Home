import * as THREE from 'three';
/**
 * Load map texture from Google Maps Static API
 * @param {Object} params
 * @param {string} params.centerLatLng - Center latitude and longitude (e.g., "37.7749,-122.4194")
 * @param {number} params.zoom - Zoom level
 * @param {number} params.sizePx - Size of the texture in pixels (e.g., 1024)
 * @param {string} params.mapType - Type of map (e.g., "satellite", "roadmap")
 * @param {string} params.apiKey - Google Maps API key
 * @param {HTMLElement} params.loaderElement - Loader element to show loading status
 * @returns {Promise<THREE.Texture>} Loaded texture
 */
export async function loadMapTexture({ centerLatLng, zoom, sizePx, mapType, apiKey, loaderElement }) {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(centerLatLng)}`
        + `&zoom=${zoom}&size=${sizePx}x${sizePx}`
        + `&maptype=${mapType}&key=${apiKey}`;
    try {
        document.getElementById("loader-text").textContent = 'Loading map texture…';
        const texture = await new THREE.TextureLoader().loadAsync(url);
        loaderElement.style.display = 'none';
        return texture;
    } catch (err) {
        document.getElementById("loader-text").textContent = 'Error loading map texture!';
        console.error(err);
        throw err;
    }
}