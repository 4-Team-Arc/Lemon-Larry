import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createUI(world) {
  const gui = new GUI();

  gui.add(world.size, 'width', 5, 100, 1).name('Width');
  gui.add(world.size, 'wallHeight', 1, 10, 1).name('Wall Height');

  gui.onChange(() => {
    world.setupWorld();
  })
}