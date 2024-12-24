import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create controls for camera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(3, 3, 3);
controls.update();

// create light
const ambientLight = new THREE.AmbientLight(0x404040, 20);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0xffffff, 30);
light1.position.set(0, 0, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 20);
light2.position.set(0, 5, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 20);
light3.position.set(0, 0, -10);
scene.add(light3);

// default properties
const initialWidth = 1;
const initialHeight = 1;
const initialDepth = 1;
const material = new THREE.MeshStandardMaterial({ color: 0x44aa88, transparent: true, opacity: 1.0, wireframe: false });
let activeObject = null;
let rotSpeedX = 0.005;
let rotSpeedY = 0.005;

// create gui
const gui = new GUI();
const guiControls = {
  color: "#44aa88",
  width: initialWidth,
  height: initialHeight,
  depth: initialDepth,
  rotationSpeedX: 0,
  rotationSpeedY: 0,
  opacity: 1,
  wireframe: false,
  metalness: 0.0,
  roughness: 1.0,
};

// add gui controls
gui.addColor(guiControls, "color").onChange((value) => {
  material.color.set(value);
});

gui.add(guiControls, "width", 0.1, 10, 0.1).onChange((value) => {
  makeObject(geometries.cube());
});

gui.add(guiControls, "height", 0.1, 10, 0.1).onChange((value) => {
  makeObject(geometries.cube());
});

gui.add(guiControls, "depth", 0.1, 10, 0.1).onChange((value) => {
  makeObject(geometries.cube());
});

gui.add(guiControls, "rotationSpeedX", 0, 0.2, 0.005).onChange((value) => {
  rotSpeedX = value;
});

gui.add(guiControls, "rotationSpeedY", 0, 0.2, 0.005).onChange((value) => {
  rotSpeedY = value;
});

gui.add(guiControls, "opacity", 0.0, 1.0).onChange((value) => {
  material.opacity = value;
});

gui.add(guiControls, "metalness", 0, 1, 0.005).onChange((value) => {
  material.metalness = value;
});

gui.add(guiControls, "roughness", 0, 1, 0.005).onChange((value) => {
  material.roughness = value;
});

gui.add(guiControls, "wireframe").onChange((value) => {
  material.wireframe = value;
});

// define shapes
const geometries = {
  cube: () =>
    new THREE.BoxGeometry(
      guiControls.width,
      guiControls.height,
      guiControls.depth
    ),
};

// create object instances
function makeObject(geometry) {
  if (activeObject) {
    scene.remove(activeObject);
  }

  activeObject = new THREE.Mesh(geometry, material);
  activeObject.position.set(0, 0, 0);
  scene.add(activeObject);
}

// add inital shape
makeObject(geometries.cube());

function animate(time) {
  controls.update();
  if (activeObject) {
    activeObject.rotation.x += rotSpeedX;
    activeObject.rotation.y += rotSpeedY;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
