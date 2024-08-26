import * as THREE from 'three';
import { blocks } from './blocks';

const collisionMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2
});
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001)

const contactGeometry = new THREE.SphereGeometry(0.03, 6, 6);

const contactMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
})

export class Physics {
  simulationRate = 200;
  timeStep = 1 / this.simulationRate;
  accumulator = 0;
  gravity = 25;

  constructor(scene) {
    this.helpers = new THREE.Group();
    scene.add(this.helpers)
  }

  update(changeInTime, player, world) {
    this.accumulator += changeInTime;

    while (this.accumulator >= this.timeStep) {
      this.helpers.clear()
      player.velocity.y -= this.gravity * this.timeStep
      player.applyInputs(this.timeStep)
      player.updateBoundsHelper();
      this.detectCollisions(player, world);
      this.accumulator -= this.timeStep;
  }
  }

  detectCollisions(player, world) {
    player.onGround = false;
    const candidates = this.broadPhase(player, world);
    const collisions = this.narrowPhase(candidates, player, world);

    if (collisions.length > 0) {
      this.resolveCollisions(collisions, player);
    }
  }

  broadPhase(player, world) {

    this.helpers.clear()

    const candidates = [];

    const extents = {
      x: {
        min: Math.floor(player.position.x - player.radius),
        max: Math.ceil(player.position.x + player.radius)
      },
      y: {
        min: Math.floor(player.position.y - player.height),
        max: Math.ceil(player.position.y)
      },
      z: {
        min: Math.floor(player.position.z - player.radius),
        max: Math.ceil(player.position.z + player.radius)
      },
    }

    for (let x = extents.x.min; x <= extents.x.max; x++) {
      for (let y = extents.y.min; y <= extents.y.max; y++) {
        for (let z = extents.z.min; z <= extents.z.max; z++) {
          const block = world.getBlock(x, y, z);
          if (block && block.id !== blocks.empty.id) {
            const blockPos = { x, y, z }
            candidates.push({ position: blockPos, id: block.id })

          //   if (block.id === blocks.lemon.id) {
              
          //     // Trigger the visual update to remove the lemon
          //     // Floor block that has a lemon above it
          //     world.onLemonCollected(x, y, z);
          // }

            this.addCollisionHelper(blockPos)
          }
        };
      };
    };
    
      // console.log(`Total Collision Candidates: ${candidates.length}`)
    
    return candidates;
  }

  narrowPhase(candidates, player, world){
    const collisions = [];

    for (const block of candidates) {

      // Get the point on the block that is closest to the center of the players bounding cylinder

      const playerPoint = player.position;
      const closestPoint = {
        x: Math.max(block.position.x - 0.5, Math.min(playerPoint.x, block.position.x + 0.5)),
        y: Math.max(block.position.y - 0.5, Math.min(playerPoint.y - (player.height / 2), block.position.y + 0.5)),
        z: Math.max(block.position.z - 0.5, Math.min(playerPoint.z, block.position.z + 0.5)),
      };

      const deltaX = closestPoint.x - player.position.x;
      const deltaY = closestPoint.y - (player.position.y - (player.height / 2));
      const deltaZ = closestPoint.z - player.position.z;

      if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {

        const overlapY = (player.height / 2) - Math.abs(deltaY);
        const overlapXZ = player.radius - Math.sqrt(deltaX**2 + deltaZ**2)

        let normal, overlap;
        if (overlapY < overlapXZ) {
          normal = new THREE.Vector3(0, -Math.sign(deltaY), 0);
          overlap = overlapY;
          player.onGround = true;
        } else {
          normal = new THREE.Vector3(-deltaX, 0, -deltaZ)
          overlap = overlapXZ;
        }

        collisions.push({
          block: block,
          contactPoint: closestPoint,
          normal,
          overlap
        });

        if (block.id === blocks.lemon.id) {
              
          // Trigger the visual update to remove the lemon
          // Floor block that has a lemon above it
          world.onLemonCollected(block.position.x, block.position.y, block.position.z);
      }

        this.addContactPointHelper(closestPoint)
        // Debugging log
       
          // console.log(`Narrowphase Collisions: ${collisions.length} block-id ${block.id}`);
          // console.log(`Collision Block pos ${ block.position.x }, ${ block.position.y }, ${ block.position.z }`)
      }

      

    }

    return collisions;
  }

  resolveCollisions(collisions, player) {

    // Resolve collisions from smallest to largest
    collisions.sort((a, b) => {
      return a.overlap < b.overlap;
    });

    for (const collision of collisions) {

      if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player))
      continue;
      // Change player position so there is no more overlap

      // Vector pointing from palyer to contact poiint
      let deltaPosition = collision.normal.clone();

      // Scaling vector to be same size as the overlap
      deltaPosition.multiplyScalar(collision.overlap);

      // Push player away from the block the way of the collision just enough to remove overlap
      player.position.add(deltaPosition);
      
      let magnitude = player.worldVelocity.dot(collision.normal);
      
      let velocityAdjustment = collision.normal.clone().multiplyScalar(magnitude)
      
      player.applyWorldDeltaVelocity(velocityAdjustment.negate())
    }
  }

  addCollisionHelper(block) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    blockMesh.position.copy(block);
    this.helpers.add(blockMesh)
  }

  addContactPointHelper(point) {
    const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
    contactMesh.position.copy(point);
    this.helpers.add(contactMesh);
  }

  pointInPlayerBoundingCylinder(playerPoint, player) {
    const deltaX = playerPoint.x - player.position.x;
    const deltaY = playerPoint.y - (player.position.y - (player.height / 2));
    const deltaZ = playerPoint.z - player.position.z;

    const radiusSqd = deltaX**2 + deltaZ**2;

    // Check if contant point is inside the player cylinder
    return (Math.abs(deltaY) < player.height / 2) && (radiusSqd < player.radius**2)

  }
  
}