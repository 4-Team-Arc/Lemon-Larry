import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


export class Player {
  radius = .25;
  height = 1.5
  maxSpeed = 3.5
  jumpSpeed = 7;
  score = 0
  onGround = false;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5,);
  controls = new PointerLockControls(this.camera, document.body)
  
  cameraHelper = new THREE.CameraHelper(this.camera)

  constructor(scene) {   
    // Adding a flashlight (SpotLight)
    this.flashlight = new THREE.SpotLight(0xffffff, 20, 10, .75, 0.5, 2);
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
  }

  get worldVelocity() {
    this.#worldVelocity.copy(this.velocity);
    this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
    return this.#worldVelocity;
  }

  applyWorldDeltaVelocity(deltaVelocity) {
    deltaVelocity.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
    this.velocity.add(deltaVelocity)
  }

  applyInputs(changeInTime) {
    if (this.controls.isLocked) {
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
    if (!this.controls.isLocked) {
      this.controls.lock();
      
    }

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
      case 'KeyC':
        this.input.y = this.maxSpeed;
        break;
      case 'KeyZ':
        this.input.y = -this.maxSpeed;
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
        this.input.z = 0;
        break;
      case 'KeyA':
        this.input.x = 0;
        break;
      case 'KeyS':
        this.input.z = 0;
        break;
      case 'KeyD':
        this.input.x = 0;
        break;
    }
  }
};