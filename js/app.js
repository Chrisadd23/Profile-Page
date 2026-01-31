// Helper function to start the app
function initApp() {
  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    alert('Error: Three.js library is not loaded. Please check your internet connection.');
    return;
  }

  const container = document.getElementById('three-container');
  if (!container) {
    alert('Error: Container element not found.');
    return;
  }

  // Clear previous canvas if any
  container.innerHTML = '';

  // Dimensions
  let width = container.clientWidth;
  let height = container.clientHeight;

  // Fallback if dimensions are 0
  if (width === 0 || height === 0) {
    width = window.innerWidth;
    height = window.innerHeight - 60; // Approximate
    console.warn('Container has 0 size, using window size fallback');
  }

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222); // Dark grey background

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Object: Cube (Simple Basic Material to ensure visibility without light)
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
