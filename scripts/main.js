import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x6cc0b8);
document.body.appendChild(renderer.domElement);

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(-10, 5, -10);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(10, 5, 10);
controls.update();

// Scene setup
const scene = new THREE.Scene();;

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

const setupFloor = (size) => {
  
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color: 0x00d000});

  for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(x, -1, z); // Place the cube at y = -1 to act as the floor
          scene.add(cube);
      }
  }
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
setupFloor(25)
animate();