export function setupEventHandlers(fileInput, uploadContainer, loader, startScene) {
  fileInput.addEventListener('click', (event) => {
    uploadContainer.style.display = 'none';
    loader.style.display = 'block';
    startScene();
  });
}
