import * as THREE from 'three';
import { blocks } from './blocks';

const geometry = new THREE.BoxGeometry();
const wallMaterial = new THREE.MeshLambertMaterial({color: 0x3b3d3b}); // , wireframe: true
const floorMaterial = new THREE.MeshLambertMaterial({color: 0x000000});

const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Small sphere
const lemonMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFF00, 
  bumpScale: 0.7,
  roughness: 0.99, // Lemons are not very shiny, so we use a high roughness value
  metalness: 0.0  // Lemons are not metallic
}); // yellow spheres


export class World extends THREE.Group {

  /**
   * @type {{
   * id: number,
   * instanceId: number
   * }[][][]}
   */  
  data = [];

  constructor(size = { width: 30, wallHeight: 3 }, mazeLayout) { 
    super();
    this.size = size;
    this.mazeLayout = mazeLayout;
    this.sphereChance = .25;
  }

  generateBlocks() {
    this.data = [];
    let count = 1;
    for (let x = 0; x < this.size.width; x++) {
        const slice = [];

        for (let y = 0; y <= this.size.wallHeight; y++) {
            const row = [];

            for (let z = 0; z < this.size.width; z++) {
                if (y === 0) {
                    // Floor layer
                    row.push({
                        id: 1,
                        instanceId: null
                    });

                    // debug info
                    // console.log(`Placing block at x: ${x}, y: ${y}, z: ${z}, id: ${row[row.length - 1].id}, total blocks: ${count}`);
                    // count++;

                } else if (
                    y > 0 && y <= this.size.wallHeight && 
                    (x === 0 || x === this.size.width - 1 || z === 0 || z === this.size.width - 1)
                ) {
                    // Wall layers at the edges
                    row.push({
                        id: 2,
                        instanceId: null
                    });

                    // debug info
                    // console.log(`Placing block at x: ${x}, y: ${y}, z: ${z}, id: ${row[row.length - 1].id}, total blocks: ${count}`);
                    // count++;

                } else {
                    // Empty space
                    row.push({
                        id: 0,
                        instanceId: null
                    });
                }
            }
            slice.push(row);
        }
        this.data.push(slice);
    }
}


  generateMeshes = () => {  
    this.clear();  
    
    const maxBlocks = (this.size.width ** 2) * this.size.wallHeight;
    const wallMesh = new THREE.InstancedMesh(geometry, wallMaterial, maxBlocks);
    const floorMesh = new THREE.InstancedMesh(geometry, floorMaterial, maxBlocks)
    const sphereMesh = new THREE.InstancedMesh(sphereGeometry, lemonMaterial, maxBlocks)

    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true

    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true

    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true

    wallMesh.count = 0; 
    floorMesh.count = 0;
    sphereMesh.count = 0;

    const matrix = new THREE.Matrix4();  
    const sphereMatrix = new THREE.Matrix4();
    
    // Create the floor (y = 0)
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {

        let blockId = this.getBlock(x, 0, z).id
        let instanceId = floorMesh.count;

        if (blockId !== blocks.empty.id) {
          matrix.setPosition(x, 0, z);  
          floorMesh.setMatrixAt(instanceId, matrix);  
          this.setBlockInstanceId(x, 0, z, instanceId);
          floorMesh.count++;
        }


    
        // default to 25% chance to place a sphere
        // Randomly scatter small spheres above the floor (y = 1)
        if (Math.random() < this.sphereChance && 
          x > 0 && x < this.size.width &&
          z > 0 && z < this.size.width
      ) { 
          
          blockId = this.getBlock(x, 0, z).id
          instanceId = sphereMesh.count;

          if (blockId !== blocks.empty.id) {
            sphereMatrix.setPosition(x, 1, z);  
            sphereMesh.setMatrixAt(instanceId, sphereMatrix);  
            this.setBlockInstanceId(x, 1, z, instanceId);
            sphereMesh.count++;
          } 
        }
      }
    }

    // Create the walls (y = 1 to y = wallHeight)
    for (let y = 1; y <= this.size.wallHeight; y++) {
      for (let x = 0; x < this.size.width; x++) {

        let blockId = this.getBlock(x, y, 0).id
        let instanceId = wallMesh.count;

        // Front wall (z = 0)
        if (blockId !== blocks.empty.id) {

          matrix.setPosition(x, y, 0);  
          wallMesh.setMatrixAt(instanceId, matrix);
          this.setBlockInstanceId(x, y, 0, instanceId)
          wallMesh.count++;
        }

        blockId = this.getBlock(x, y, this.size.width - 1).id
        instanceId = wallMesh.count;

        // Back wall (z = width - 1)
        if (blockId !== blocks.empty.id) {
          
          matrix.setPosition(x, y, this.size.width - 1);  
          wallMesh.setMatrixAt(instanceId, matrix);
          this.setBlockInstanceId(x, y, this.size.width - 1, instanceId)
          wallMesh.count++
        }
        

      }

      for (let z = 1; z < this.size.width - 1; z++) {  

        let blockId = this.getBlock(0, y, z)
        let instanceId = wallMesh.count;
        
        // Left wall (x = 0)
        if (blockId !== blocks.empty.id) {
          matrix.setPosition(0, y, z);  
          wallMesh.setMatrixAt(instanceId, matrix);
          this.setBlockInstanceId(0, y, z, instanceId)
          wallMesh.count++
        }

        blockId = this.getBlock(this.size.width - 1, y, z).id
        instanceId = wallMesh.count;

        // Right wall (x = width - 1)
        if (blockId !== blocks.empty.id) {
          matrix.setPosition(this.size.width - 1, y, z);  
          wallMesh.setMatrixAt(instanceId, matrix);
          this.setBlockInstanceId(0, y, z, instanceId)
          wallMesh.count++
        }
      }
    }

    // // Regenerate and create the maze based on the new size
    // this.mazeLayout = this.generateMazeLayout(this.size.width);

    // Maze creation
    this.createMaze(wallMesh, matrix);

    this.add(floorMesh);
    this.add(wallMesh);
    this.add(sphereMesh);
   
  };

  
  // Recursive backtracking to generate a maze based on new world size
  generateMazeLayout = (size) => {
    
      // Initialize the maze with walls (1)
      const maze = Array.from({ length: size }, () => Array(size).fill(1));
    
    
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

  createMaze = (wallMesh, matrix) => {
    // Loop through the maze layout array
    for (let z = 0; z < this.mazeLayout.length; z++) {
        for (let x = 0; x < this.mazeLayout[z].length; x++) {

            // Assuming 1 represents a wall in the maze
            if (this.mazeLayout[z][x] === 1) { 
                for (let y = 1; y <= this.size.wallHeight; y++) {
                    // Get the block at this position
                    let block = this.getBlock(x, y, z);

                    // Update the block's id to 3 to represent a maze wall
                    if (block) {
                        block.id = 3;
                    }

                    // Place the maze wall block visually
                    matrix.setPosition(x, y, z); // Adjusting the y-coordinate for height
                    wallMesh.setMatrixAt(wallMesh.count++, matrix);
                }
            }
        }
    }
};

  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  };

  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id
    }
  }

  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceId = instanceId;
    }
  }

  inBounds(x, y, z) {
    if (x >= 0 && x < this.size.width &&
      y >= 0 && y <= this.size.wallHeight &&
      z >= 0 && z < this.size.width) {
        return true;
      } else {
        return false;
      }
  };

}