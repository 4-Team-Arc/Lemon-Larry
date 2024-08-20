import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);

// Scene setup
const scene = new THREE.Scene();;
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const setupLights = () => {

  const sunLight = new THREE.DirectionalLight();
  sunLight.position.set(1, 1, 1);
  scene.add(sunLight);
  
  const moreSunLight = new THREE.DirectionalLight();
  moreSunLight.position.set(-1, -1, -0.5);
  scene.add(moreSunLight);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.2;
  scene.add(ambient);

}

// Render Loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera)
}

// Handles camera and scene when window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})

setupLights();
animate();