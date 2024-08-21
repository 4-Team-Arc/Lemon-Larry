import * as THREE from 'three';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 });
const blackMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Small sphere
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red spheres


export class World extends THREE.Group {
  constructor(size = { width: 32, wallHeight: 4 }, mazeLayout) { 
    super();
    this.size = size;
    this.mazeLayout = mazeLayout;
  }

  setupWorld = () => {  
    this.clear();  
    
    const maxBlocks = (this.size.width ** 2) * this.size.wallHeight;
    const mesh = new THREE.InstancedMesh(geometry, material, maxBlocks*2);
    const blueMesh = new THREE.InstancedMesh(geometry, blackMaterial, maxBlocks*2)
    const sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, maxBlocks*2)

    mesh.count = 0; 
    blueMesh.count = 0;
    sphereMesh.count = 0;

    const matrix = new THREE.Matrix4();  
    
    // Create the floor (y = 0)
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        matrix.setPosition(x, 0, z);  
        blueMesh.setMatrixAt(blueMesh.count++, matrix);  
    
        // Randomly scatter small spheres 
        if (Math.random() < 0.2) { // 20% chance to place a sphere
          const sphereMatrix = new THREE.Matrix4();
          
          // Place the sphere at y = 1, above the floor
          sphereMatrix.setPosition(x, 1, z); 
    
          // Add the matrix to the instanced mesh
          sphereMesh.setMatrixAt(sphereMesh.count++, sphereMatrix); 
        }
      }
    }

    // Create the walls (y = 1 to y = wallHeight)
    for (let y = 1; y <= this.size.wallHeight; y++) {
      for (let x = 0; x < this.size.width; x++) {

        
        // Front wall
        matrix.setPosition(x, y, 0);  
        mesh.setMatrixAt(mesh.count++, matrix);

        // Back wall
        matrix.setPosition(x, y, this.size.width - 1);  
        mesh.setMatrixAt(mesh.count++, matrix);
      }

      for (let z = 1; z < this.size.width - 1; z++) {  

        // Left wall
        matrix.setPosition(0, y, z);  
        mesh.setMatrixAt(mesh.count++, matrix);

        // Right wall
        matrix.setPosition(this.size.width - 1, y, z);  
        mesh.setMatrixAt(mesh.count++, matrix);
      }
    }

    // Maze creation
    this.createMaze(mesh, matrix);

    this.add(mesh);
    this.add(blueMesh);
    this.add(sphereMesh);
   
  }

  createMaze = (mesh, matrix) => {
    // Loop through the maze layout array
    for (let z = 0; z < this.mazeLayout.length; z++) {
      for (let x = 0; x < this.mazeLayout[z].length; x++) {
        if (this.mazeLayout[z][x] === 1) { // Assuming 1 represents a wall in the maze
          // Place a block at this position
          matrix.setPosition(x, 1, z); // You can adjust the y-coordinate if needed
          mesh.setMatrixAt(mesh.count++, matrix);
        }
      }
    }
  }
}