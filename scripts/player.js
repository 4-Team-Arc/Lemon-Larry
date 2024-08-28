import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


export class Player {
  radius = .25;
  height = 1.5
  maxSpeed = 3.5
  jumpSpeed = 7;
  score = 0
  onGround = false;
  paused = false; // Flag to indicate if the game is paused
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5);
  controls = new PointerLockControls(this.camera, document.body)
  controlsEnabled = false; // Flag to check if controls are enabled
  
  cameraHelper = new THREE.CameraHelper(this.camera)

  constructor(scene, containerRef) {   
    // Adding a flashlight (SpotLight)
    this.flashlight = new THREE.SpotLight(0xffffff, 10, 10, .75, 0.5, 2);
    this.flashlight.position.set(0, 0, 0); // Flashlight will follow the camera
    this.flashlight.target.position.set(0, 0, -1); // Light direction
    this.camera.add(this.flashlight);
    this.camera.add(this.flashlight.target);

    scene.add(this.camera); 
    this.position.set(13, 2.2, 11);
    this.camera.lookAt(13, 2.01, 25)
    scene.add(this.camera);
    // scene.add(this.cameraHelper);

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    // Wireframe cyclinder to visualize players bounding cylinder
    this.boundsHelper = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
      new THREE.MeshBasicMaterial({wireframe: true})
    );
    // scene.add(this.boundsHelper);

    this.controls.addEventListener('unlock', () => {
      this.pauseGame(); // Pause the game when the controls are unlocked
    });

    this.controls.addEventListener('lock', () => {
      this.resumeGame(); // Resume the game when the controls are locked again
    });

    // Create the paused text element
    this.pausedText = document.createElement('div');
    this.pausedText.textContent = 'Paused';
    this.pausedText.style.position = 'absolute';
    this.pausedText.style.top = '50%';
    this.pausedText.style.left = '50%';
    this.pausedText.style.transform = 'translate(-50%, -50%)';
    this.pausedText.style.color = '#ffffff';
    this.pausedText.style.fontSize = '48px';
    this.pausedText.style.background = 'linear-gradient(to bottom, #ff0000, black)';
    this.pausedText.style.padding = '20px';
    this.pausedText.style.borderRadius = '10px';
    this.pausedText.style.display = 'none'; // Initially hidden

    containerRef.current.appendChild(this.pausedText);
  }

  get worldVelocity() {
    this.#worldVelocity.copy(this.velocity);
    this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
    return this.#worldVelocity;
  }

  pauseGame() {
    this.paused = true; 
    this.velocity.set(0, 0, 0); 
    console.log("Game Paused");
    this.pausedText.style.display = 'block'; // Show the paused text
  }
  
  resumeGame() {
    this.paused = false; 
    console.log("Game Resumed");

    this.pausedText.style.display = 'none'; // Hide the paused text
  }

  enableControls() {
    this.controlsEnabled = true; // Allow controls to be enabled
    this.controls.lock(); // Lock the pointer
  }

  applyWorldDeltaVelocity(deltaVelocity) {
    deltaVelocity.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
    this.velocity.add(deltaVelocity)
  }

  applyInputs(changeInTime) {
    if (this.controls.isLocked && !this.paused) {
      this.velocity.x = this.input.x;
      this.velocity.z = this.input.z;
      this.controls.moveRight(this.velocity.x * changeInTime)
      this.controls.moveForward(this.velocity.z * changeInTime)

      this.position.y += this.velocity.y * changeInTime;
      
    }
  }

  updateBoundsHelper() {
    this.boundsHelper.position.copy(this.position);
    this.boundsHelper.position.y -= this.height / 2;
  }

  get position() {
    return this.camera.position;
  }

  onKeyDown(event) {
    if (!this.controls.isLocked && this.controlsEnabled) { // Lock only if controls are enabled
      this.controls.lock();
    }

    if (this.paused) return; // Ignore inputs while paused

    switch(event.code) {
      case 'KeyW':
        this.input.z = this.maxSpeed;
        break;
      case 'KeyA':
        this.input.x = -this.maxSpeed;
        break;
      case 'KeyS':
        this.input.z = -this.maxSpeed;
        break;
      case 'KeyD':
        this.input.x = this.maxSpeed;
        break;
      case 'KeyR':
        this.position.set(13, 2.01, 11);
        this.velocity.set(0, 0, 0)
        break;
      case 'Space':
        if (this.onGround) {
          this.velocity.y += this.jumpSpeed
        }
    }
  }
  
  onKeyUp(event) {
    switch(event.code) {
      case 'KeyW':
      case 'KeyS':
        this.input.z = 0;
        break;
      case 'KeyA':
      case 'KeyD':
        this.input.x = 0;
        break;
    }
  }
};