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

  // Check if OrbitControls is loaded
  if (typeof THREE.OrbitControls === 'undefined') {
    console.warn('Warning: OrbitControls is not loaded. Zooming might not work.');
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
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = 2;




  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);

  // Controls
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;

    // Lock vertical rotation (fixed height)
    // We set min and max to the same value to prevent vertical movement
    const verticalAngle = Math.PI / 3; // Ca. 60 Grad (Blick stärker von oben)
    controls.minPolarAngle = verticalAngle;
    controls.maxPolarAngle = verticalAngle;

    // Limit horizontal rotation to +/- 30 degrees
    const angleLimit = 30 * (Math.PI / 180); // Convert 30 degrees to radians
    controls.minAzimuthAngle = -angleLimit;
    controls.maxAzimuthAngle = angleLimit;
  }

  // Ambient
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

// Directional (Hauptlicht)
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 8, 5);
  dir.castShadow = true;
  scene.add(dir);

  // Load GLB Model
  let model;
  let mixer;
  const loader = new THREE.GLTFLoader();
  loader.load(
    'asset/blender/object/building1.glb',
    function (gltf) {
      model = gltf.scene;

      scene.add(model);
      console.log('Model loaded successfully');

      // Set up the mixer
      mixer = new THREE.AnimationMixer(model);
      model.rotation.x += 0;
      model.rotation.y += 2.6;
      // Play the first animation clip found in the file
      if (gltf.animations && gltf.animations.length > 0) {
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
      }

    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error happened loading the model', error);
    }
  );

  const clock = new THREE.Clock();
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta); // Update the animation state

    if (controls) controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

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
