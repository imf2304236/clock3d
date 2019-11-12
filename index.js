'use strict';

// Initialize webGL Renderer
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setClearColor('rgb(255, 255, 255)');

// Create scene & camera
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;
camera.lookAt(scene.position);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

// Add main body
const bodyRadius = 50;
const bodyHeight = 5;
const bodyRadialSegments = 64;
const bodyHeightSegments = 64;
const bodyColor = 'gray';
const bodyGeometry = new THREE.CylinderBufferGeometry(
    bodyRadius, bodyRadius, bodyHeight, bodyRadialSegments, bodyHeightSegments);
const bodyMaterial = new THREE.MeshPhongMaterial({color: bodyColor});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotateX(Math.PI / 2);
scene.add(body);

// TODO: Add minute ticks
// TOOD: Add 5-minute ticks
// TODO: Mark 12 o'clock position
// TODO: Add hour-hand
// TODO: Add minute-hand
// TODO: Add second-hand
// TODO: Show current time
// TODO: Add hand mount
// TODO: Duplicate clock on backside
// TODO: Show San Francisco time on second clock
// TODO: Add outer ring

const controls = new THREE.TrackballControls(camera, canvas);

/**
 * Renders frame
 */
function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}

render();
