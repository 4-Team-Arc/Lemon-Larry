import * as THREE from 'three';


// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0);

// Scene setup
const scene = new THREE.Scene();;
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x0080ff});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Render Loop
const animate = () => {
  requestAnimationFrame(animate);
  cube.rotation.x += .01;
  cube.rotation.y += .01;
  renderer.render(scene, camera)
}

// Handles camera and scene when window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate();