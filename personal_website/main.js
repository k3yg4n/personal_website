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
const spaceTexture = new THREE.TextureLoader().load('space.png');
scene.background = spaceTexture;

// Central Avatar Cube
const keeganTexture = new THREE.TextureLoader().load('keegan.jpg');
const keegan = new THREE.Mesh(
  new THREE.BoxGeometry(10,10,10),
  new THREE.MeshBasicMaterial( {map: keeganTexture} )
);
scene.add(keegan);

// Projector and Mouse objects for hyperlinks
projector = new THREE.Projector();
mouseVector = new THREE.Vector3();
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;

document.addEventListener('mousedown', onDocumentMouseDown, false);
function onDocumentMouseDown(e) {
  mouseVector.x = 2 * (e.clientX / windowWidth) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / windowHeight );
}

// Hyperlink Cubes
const githubTexture = new THREE.TextureLoader().load('github.png');
const githubCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: githubTexture} )
);
scene.add(githubCube);
githubCube.position.set(-10,-10,3);
githubCube.userData = { URL: "http://stackoverflow.com"};

const linkedinTexture = new THREE.TextureLoader().load('linkedin.png');
const linkedinCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: linkedinTexture} )
);
scene.add(linkedinCube);
linkedinCube.position.set(-5,-10,3);

const devpostTexture = new THREE.TextureLoader().load('devpost.jpg');
const devpostCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: devpostTexture} )
);
scene.add(devpostCube);
devpostCube.position.set(5,-10,3);

const emailTexture = new THREE.TextureLoader().load('email.webp');
const emailCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: emailTexture} )
);
scene.add(emailCube);
emailCube.position.set(10,-10,3);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshBasicMaterial( {
    map: moonTexture,
    normalMap: normalTexture,
  } )
);
moon.position.x = 30;
scene.add(moon);

// Move the camera as the user scrolls down the page
function scrollAnimation() {
  moon.rotation.x += 0.02;
  moon.rotation.y += 0.02;
  moon.rotation.z += 0.02;
    const position = (document.body.getBoundingClientRect().top)/8; // divide by 8 to have top position be 1

    console.log(position);

    // print "false" if direction is down and "true" if up
    let isScrollDown = (this.oldScroll < this.scrollY); 
    if(isScrollDown) {
      console.log('scrolling down');
      torusKnot.position.y += 1;
      keegan.position.y += 1;
    } else {
      console.log('scrolling up');
      torusKnot.position.y -= 1;
      keegan.position.y -= 1;
    }
    if(position == 1) {
      torusKnot.position.set(0,0,0);
      keegan.position.set(0,0,0);
    }

    this.oldScroll = this.scrollY; 
}

document.body.onscroll = scrollAnimation;

// Infinite loop to continue rerendering scene
function animate() {

  let raycaster = projector.pickingRay( mouseVector.clone(), camera );
  let intersects = raycaster.intersectObjects( cubes.children );

  requestAnimationFrame(animate);

  torusKnot.rotation.z += -0.001;

  controls.update();

  renderer.render(scene, camera);
}

animate();