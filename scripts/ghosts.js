import * as THREE from 'three';
import { AStarFinder } from 'pathfinding';
import PF from 'pathfinding';

export class Ghost {
    constructor(scene, maze, player, x, z) {
        this.scene = scene;
        this.maze = maze;
        this.player = player;
        this.position = { x: x, y: 2, z: z };
        this.targetPosition = null;

        // Setup ghost mesh
        const geometry = new THREE.SphereGeometry(0.3, 32, 32); 
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 2, z);
        scene.add(this.mesh);

        // A* finder setup
        this.finder = new AStarFinder({
            allowDiagonal: false,
            dontCrossCorners: true
        });
    }

    update() {
        const playerPos = this.getPlayerGridPosition();
        const ghostPos = this.getGhostGridPosition();

        // If the target position is reached or not set, calculate a new path
        if (!this.targetPosition || (ghostPos.x === this.targetPosition.x && ghostPos.y === this.targetPosition.y)) {
            this.calculateNewPath();
        }

        // Move towards the next position in the path
        if (this.targetPosition) {
            this.moveTowardsTarget();
        }
    }

    getPlayerGridPosition() {
        return {
            x: Math.floor(this.player.camera.position.x),
            y: Math.floor(this.player.camera.position.z)
        };
    }

    getGhostGridPosition() {
        return {
            x: Math.floor(this.mesh.position.x),
            y: Math.floor(this.mesh.position.z)
        };
    }

    calculateNewPath() {
      const grid = new PF.Grid(this.maze);
      const start = [this.getGhostGridPosition().x, this.getGhostGridPosition().y];
  
      const shouldWander = Math.random() < 0.01; // 5% chance to wander
      let end;
  
      if (shouldWander) {
          let randomX, randomY;
          do {
              randomX = Math.floor(Math.random() * this.maze[0].length);
              randomY = Math.floor(Math.random() * this.maze.length);
          } while (this.maze[randomY][randomX] === 1); // Ensure it's a walkable position
  
          end = [randomX, randomY];
      } else {
          end = [this.getPlayerGridPosition().x, this.getPlayerGridPosition().y];
      }
  
      const path = this.finder.findPath(start[0], start[1], end[0], end[1], grid);
  
      // If a path is found, set the next target position
      if (path.length > 1) {
          this.targetPosition = { 
              x: path[1][0], 
              y: path[1][1] 
          };
      } else {
          this.targetPosition = null; // No valid path found
      }
  }

  moveTowardsTarget() {
    if (!this.targetPosition) return;

    const targetWorldPos = new THREE.Vector3(this.targetPosition.x, this.mesh.position.y, this.targetPosition.y);
    const direction = targetWorldPos.clone().sub(this.mesh.position).normalize();
    const moveSpeed = this.player.maxSpeed / 300; // Adjust speed as needed
    const distance = this.mesh.position.distanceTo(targetWorldPos);

    // Adjust moveSpeed if necessary to ensure precise movement
    const stepDistance = Math.min(moveSpeed, distance);

    if (distance > 0.01) { // A small buffer to prevent clipping
        this.mesh.position.add(direction.multiplyScalar(stepDistance));
    } else {
        // Snap to the target position when close enough
        this.mesh.position.copy(targetWorldPos);
        this.position = { x: this.targetPosition.x, y: this.targetPosition.y };
        this.targetPosition = null; // Target reached, clear it
        this.calculateNewPath(); // Calculate a new path immediately after reaching the current target
    }
  }
}