import * as THREE from 'three';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 });
const blackMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Small sphere
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red spheres


export class World extends THREE.Group {
  constructor(size = { width: 30, wallHeight: 3 }, mazeLayout) { 
    super();
    this.size = size;
    this.mazeLayout = mazeLayout;
    this.sphereChance = .25;
  }

  setupWorld = () => {  
    this.clear();  
    
    const maxBlocks = (this.size.width ** 2) * this.size.wallHeight;
    const mesh = new THREE.InstancedMesh(geometry, material, maxBlocks*2);
    const blackMesh = new THREE.InstancedMesh(geometry, blackMaterial, maxBlocks*2)
    const sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, maxBlocks*2)

    mesh.castShadow = true;
    mesh.receiveShadow = true

    blackMesh.castShadow = true;
    blackMesh.receiveShadow = true

    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true

    mesh.count = 0; 
    blackMesh.count = 0;
    sphereMesh.count = 0;

    const matrix = new THREE.Matrix4();  
    
    // Create the floor (y = 0)
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        matrix.setPosition(x, 0, z);  
        blackMesh.setMatrixAt(blackMesh.count++, matrix);  
    
        // Randomly scatter small spheres 
        if (Math.random() < this.sphereChance) { // 20% chance to place a sphere
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

    // // Regenerate and create the maze based on the new size
    // this.mazeLayout = this.generateMazeLayout(this.size.width);

    // Maze creation
    this.createMaze(mesh, matrix);

    this.add(mesh);
    this.add(blackMesh);
    this.add(sphereMesh);
   
  };

  generateMazeLayout = (size) => {
    
      // Initialize the maze with walls (1)
      const maze = Array.from({ length: size }, () => Array(size).fill(1));
    
    
    // Recursive backtracking
    const carvePath = (x, z) => {

      // Possible directions to move
      const directions = [
        [0, 2],  // Down
        [0, -2], // Up
        [2, 0],  // Right
        [-2, 0]  // Left
      ];
  
      // Shuffle directions to ensure random path generation
      directions.sort(() => Math.random() - 0.5);
  
      //  for each possible direction
      for (const [changeInx, changeInz] of directions) {

        // apply that change in direction to current position to get new position
        const newX = x + changeInx;
        const newZ = z + changeInz;

        //     if the new x             and z are within the boundry     and the new position is a wall
        if (newX > 0 && newX < size - 1 && newZ > 0 && newZ < size - 1 && maze[newZ][newX] === 1) {
  
          //  create the path
          maze[newZ][newX] = 0; 

          //  connect old path block to new path block by changing the block between them a 0
          maze[z + changeInz / 2][x + changeInx / 2] = 0; 

          //  Recursively carve out the next path
          carvePath(newX, newZ); 
        }
      }
    };
  
    // Start carving from (1, 1)
    maze[1][1] = 0;
    carvePath(1, 1);
  
    return maze;
  };

  createMaze = (mesh, matrix) => {
    // Loop through the maze layout array
    for (let z = 0; z < this.mazeLayout.length; z++) {
      for (let x = 0; x < this.mazeLayout[z].length; x++) {

        // Assuming 1 represents a wall in the maze
        if (this.mazeLayout[z][x] === 1) { 
          for (let y = 1; y <= this.size.wallHeight; y++) {
            // Place a block at this position
            matrix.setPosition(x, y, z); // Adjusting the y-coordinate for height
            mesh.setMatrixAt(mesh.count++, matrix);
          }
          // // Place a block at this position
          // matrix.setPosition(x, 1, z); // You can adjust the y-coordinate if needed
          // mesh.setMatrixAt(mesh.count++, matrix);
        }
      }
    }
  };

}