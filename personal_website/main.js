import './style.css'
import * as THREE from 'three'; // import threejs library
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// Initialize scene (container) that holds objects, cameras, lights
const scene = new THREE.Scene(); 
// Initialize camera to provide point of view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Initializes renderer to render the graphics of the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Initialize lights and associated helpers to view object
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,0);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

// Ambient light will brighten entire background
// const ambientLight = new THREE.AmbientLight(0xfffff);
// scene.add(ambientLight);

// Instantiate orbit controls object
const controls = new OrbitControls(camera, renderer.domElement);


// Create 3-D objects to display
// Torus Knot
const geometry = new THREE.TorusKnotGeometry( 15, 3, 64, 8, 2, 3 );
const material = new THREE.MeshStandardMaterial( { color: 0xC7E3FF, wireframe: true } );
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Randomly Generated Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial( { color: 0xFDFFCF, wireframe: false } );
  const star= new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Initialize background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Central Avatar Cube
const keeganTexture = new THREE.TextureLoader().load('keegan.jpg');
const keegan = new THREE.Mesh(
  new THREE.BoxGeometry(10,10,10),
  new THREE.MeshBasicMaterial( {map: keeganTexture} )
);
scene.add(keegan);


// Infinite loop to continue rerendering scene
function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.z += -0.001;

  controls.update();

  renderer.render(scene, camera);
}

animate();