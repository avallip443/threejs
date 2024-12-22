import * as THREE from 'three';

const style = document.createElement('style');
style.textContent = `
    #controls {
        position: absolute;
        top: 0;
        left: 0;
        width: 10%;
        background-color: red;
    }
`

const controls = document.createElement('div');
controls.id = 'controls';
controls.innerHTML = `
    <select id="shapeType">
        <option value="cube">cube</option>
        <option value="cylinder">cylinder</option>
        <option value="cone">cone</option>
        <option value="dodecahedron">dodecahedron</option>
    </select>
    <button id="renderBtn">render</button>
`;
document.body.appendChild(controls);

const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// create light
const colour = 0xFFFFFF;
const intensity = 4;
const light = new THREE.DirectionalLight(colour, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// set object dimensions
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 15);
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 16);
const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.7);


// define object colour and pos
const objColours = [0x44aa88, 0x8844aa, 0xaa8844, 0x226699];
const xCoord = [-8, -6, -4, -2, 0, 2, 4, 6, 8]
const yCoord = [-4, -2, 0, 2, 4]

// list of objects
let activeObjects = [];

// create object instances
function makeCube(cubeGeometry, color, x, y) {
  const material = new THREE.MeshPhongMaterial({color});
  const cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(x, y, 0);
  return cube;
}

function makeCylinder(cylinderGeometry, color, x, y) {
  const material = new THREE.MeshPhongMaterial({color});
  const cylinder = new THREE.Mesh(cylinderGeometry, material);
  cylinder.position.set(x, y, 0);
  return cylinder;
}

function makeCone(coneGeometry, color, x, y) {
  const material = new THREE.MeshPhongMaterial({color});
  const cone = new THREE.Mesh(coneGeometry, material);
  cone.position.set(x, y, 0);
  return cone;
}

function makeDodecahedrone(dodecahedronGeometry, color, x, y) {
  const material = new THREE.MeshPhongMaterial({color});
  const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material);
  dodecahedron.position.set(x, y, 0);
  return dodecahedron;
}

function populateShapes(objType) {
    // remove previous elements
    activeObjects.forEach((obj) => scene.remove(obj));
    activeObjects = [];

    for (let i = 0; i < 45; i++) {
        const objColour = objColours[i % 4];
        const objX = xCoord[i % xCoord.length];
        const objY = yCoord[i % yCoord.length];
        let obj;

        if (objType == 'cube') {
            obj = makeCube(cubeGeometry, objColour, objX, objY);
        } else if (objType == 'cylinder') {
            obj = makeCylinder(cylinderGeometry, objColour, objX, objY);
        } else if (objType == 'cone') {
            obj = makeCone(coneGeometry, objColour, objX, objY);
        } else if (objType == 'dodecahedron') {
            obj = makeDodecahedrone(dodecahedronGeometry, objColour, objX, objY);
        }

        scene.add(obj);
        activeObjects.push(obj);
    }
}

function animateObjects(timeMultiplier) {
    activeObjects.forEach((obj, ndx) => {
        const speed = 1 + ndx * .01;
        const rot = timeMultiplier * speed;
        obj.rotation.x = rot;
        obj.rotation.y = rot;
    });
}

function animate(time) {
    time *= 0.001;
    animateObjects(time);
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

document.getElementById('renderBtn').addEventListener('click', () => {
    const shapeType = document.getElementById('shapeType').value;
    populateShapes(shapeType);
});
