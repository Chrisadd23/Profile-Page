// Helper function to start the app
function initApp() {
  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    alert('Error: Three.js library is not loaded. Please check your internet connection.');
    return;
  }

  // Check if GLTFLoader is loaded
  if (typeof THREE.GLTFLoader === 'undefined') {
    alert('Error: GLTFLoader is not loaded. Please check your internet connection.');
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
  scene.background = null; // Transparent to let CSS background show

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 20;


  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Load GLB Model
  let model;
  const loader = new THREE.GLTFLoader();
  loader.load(
    'asset/blender/object/building.glb',
    function (gltf) {
      model = gltf.scene;
      scene.add(model);
      console.log('Model loaded successfully');

      // Optional: Adjust model scale or position if needed
      // model.scale.set(1, 1, 1);
      // model.position.set(0, 0, 0);
      model.rotation.x += 0.2;
      model.rotation.y += 2.2;
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error happened loading the model', error);
    }
  );

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // if (model) {
    //   model.rotation.y += 0.005; // Rotate the model
    // }

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
