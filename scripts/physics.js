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

const contactGeometry = new THREE.SphereGeometry(0.03, 6, 6);

const contactMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
})

export class Physics {
  gravity = .1;

  constructor(scene) {
    this.helpers = new THREE.Group();
    scene.add(this.helpers)
  }

  update(changeInTime, player, world) {
    this.helpers.clear()
    player.velocity.y -= this.gravity * changeInTime
    player.applyInputs(changeInTime)
    player.updateBoundsHelper();
    this.detectCollisions(player, world);
  }

  detectCollisions(player, world) {
    const candidates = this.broadPhase(player, world);
    const collisions = this.narrowPhase(candidates, player);

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

            this.addCollisionHelper(blockPos)
          }
        };
      };
    };
    
      // console.log(`Total Collision Candidates: ${candidates.length}`)
    
    return candidates;
  }

  narrowPhase(candidates, player){
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
          block: block,
          contactPoint: closestPoint,
          normal,
          overlap
        });

        this.addContactPointHelper(closestPoint)
        // Debugging log
       
          // console.log(`Narrowphase Collisions: ${collisions.length} block-id ${block.id}`);
          // console.log(`Collision Block pos ${ block.position.x }, ${ block.position.y }, ${ block.position.z }`)
      }

      

    }

    return collisions;
  }

  resolveCollisions(collisions, player) {
    collisions.sort((a, b) => {
      return a.overlap < b.overlap;
    });

    for (const collision of collisions) {

      // Change player position so there is no more overlap
      let deltaPosition = collision.normal.clone();
      deltaPosition.multiplyScalar(collision.overlap);
      player.position.add(deltaPosition);
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