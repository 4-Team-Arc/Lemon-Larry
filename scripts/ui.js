import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createUI(world, sun) {
  const gui = new GUI();
  const width = world.size.width;

  gui.add(world.size, 'width', 5, 100, 1).name('Width');
  gui.add(world.size, 'wallHeight', 1, 10, 1).name('Wall Height');
  
  gui.add(world, 'sphereChance', 0, 1, 0.01).name('Sphere Chance');

  // Add controls for the sun's position
  const sunFolder = gui.addFolder('Sun Settings');
    sunFolder.add(sun.position, 'x', -.5*width, 1.5*width, 1).name('Sun X Position');
    sunFolder.add(sun.position, 'y', 0, 100, 1).name('Sun Y Height');
    sunFolder.add(sun.position, 'z', -.5*width, 1.5*width, 1).name('Sun Z Position');

    sunFolder.add(sun, 'intensity', 0, 1000, 1).name('Sun Intensity');

    sunFolder.add(sun, 'distance', 0, 1000, 1).name('Sun Distance');

    sunFolder.add(sun, 'castShadow').name('Cast Shadow');

    sunFolder.open();

  gui.onChange(() => {
    world.setupWorld();
  });
}