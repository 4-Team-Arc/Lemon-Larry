import * as THREE from 'three';
import { blocks } from './blocks';
import { Player } from './player';
import { World } from './world';

const collisionMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2
});
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001)


export class Physics {
  constructor(scene) {
    this.helpers = new THREE.Group();
    scene.add(this.helpers)
  }

  update(changeInTime, player, world) {
    const candidates = this.broadPhase(player, world);
    const collisions = this.narrowPhase(candidates, player);
  }

  // detectCollisions(player, world) {
  //   const candidates = this.broadPhase(player, world);
  //   const collisions = this.narrowPhase(candidates, player);

  //   if (collisions.length > 0) {
  //     this.resolveCollisions(collisions);
  //   }
  // }

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
            candidates.push(blockPos)
            this.addCollisionHelper(blockPos)
          }
        };
      };
    };
    console.log(`Broad phase candidates: ${candidates.length}`)
    return candidates;
  }

  narrowPhase(candidates, player){
    const collisions = [];

    for (const block of candidates) {

      // Get the point on the block that is closest to the center of the players bounding cylinder

      const playerPoint = player.position;
      const closestPoint = {
        x: Math.max(block.x - 0.5, Math.min(playerPoint.x, block.x + 0.5)),
        y: Math.max(block.y - 0.5, Math.min(playerPoint.y - (player.height / 2), block.y + 0.5)),
        z: Math.max(block.z - 0.5, Math.min(playerPoint.z, block.z + 0.5)),
      };

      const deltaX = closestPoint.x - player.position.x;
      const deltaY = closestPoint.y - (player.position.y - (player.height / 2));
      const deltaZ = closestPoint.z - player.position.z;

      if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {

        const overlapY = (player.height / 2) - Math.abs(deltaY);
        const overlapXZ = player.radius - Math.abs(deltaX**2 + deltaZ**2)

        let normal, overlap;
        if (overlapY < overlapXZ) {
          normal = new THREE.Vector3(0, -Math.sign(deltaY), 0);
          overlap = overlapY;
        } else {
          normal = new THREE.Vector3(-deltaX, 0, -deltaZ)
          overlap = overlapXZ;
        }

        collisions.push({
          block,
          contactPoint: closestPoint,
          normal,
          overlap
        });
      }

    }

    console.log(`Narrow phase collisions: ${collisions.length}`)
    return collisions;
  }

  addCollisionHelper(block) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    blockMesh.position.copy(block);
    this.helpers.add(blockMesh)
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