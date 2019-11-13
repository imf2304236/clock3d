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
const bodyColor = 'white';
const bodyGeometry = new THREE.CylinderBufferGeometry(
    bodyRadius, bodyRadius, bodyHeight, bodyRadialSegments, bodyHeightSegments);
const bodyMaterial = new THREE.MeshPhongMaterial({color: bodyColor});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotateX(Math.PI / 2);
scene.add(body);

// Add minute ticks
const minuteTickWidth = 1;
const minuteTickLength = 5;
for (let i = 0; i != 60; ++i) {
  const minuteTickColor = (i == 0) ? 'skyblue' : 'black';
  const isFiveMinuteMark = (i % 5 == 0);
  const minuteTickGeometry = isFiveMinuteMark ?
      new THREE.PlaneBufferGeometry(minuteTickWidth * 2, minuteTickLength * 2) :
      new THREE.PlaneBufferGeometry(minuteTickWidth, minuteTickLength);
  const minuteTickMaterial =
      new THREE.MeshPhongMaterial({color: minuteTickColor});
  minuteTickMaterial.depthTest = false;
  const minuteTick = new THREE.Mesh(minuteTickGeometry, minuteTickMaterial);

  if (isFiveMinuteMark) {
    minuteTick.position.x =
        bodyRadius * Math.sin(Math.PI * i / 30) -
            Math.sin(Math.PI * i / 30) * minuteTickLength;
    minuteTick.position.y =
        bodyRadius * Math.cos(Math.PI * i / 30) -
            Math.cos(Math.PI * i / 30) * minuteTickLength;
  } else {
    minuteTick.position.x =
        bodyRadius * Math.sin(Math.PI * i / 30) -
            Math.sin(Math.PI * i / 30) * minuteTickLength / 2;
    minuteTick.position.y =
        bodyRadius * Math.cos(Math.PI * i / 30) -
            Math.cos(Math.PI * i / 30) * minuteTickLength / 2;
  }
  minuteTick.position.z = bodyHeight / 2;

  minuteTick.rotateZ(-i * Math.PI / 30);
  scene.add(minuteTick);
}

// Add hour-hand
const hourHandColor = 'black';
const hourHandRadius = 1;
const hourHandWidthSegments = 32;
const hourHandRadialSegments = 32;
const hourHandGeometry = new THREE.SphereBufferGeometry(
    hourHandRadius, hourHandWidthSegments, hourHandRadialSegments);
const hourHandMaterial = new THREE.MeshPhongMaterial(
    {color: hourHandColor},
);
const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
hourHand.scale.y = bodyRadius / 4 / hourHandRadius;
hourHand.rotateZ(Math.PI / 2);
hourHand.position.x = bodyRadius / 4;
hourHand.position.z = bodyHeight / 2;
scene.add(hourHand);

// Add minute-hand
const minuteHandColor = 'black';
const minuteHandRadius = 1;
const minuteHandWidthSegments = 32;
const minuteHandRadialSegments = 32;
const minuteHandGeometry = new THREE.SphereBufferGeometry(
    minuteHandRadius, minuteHandWidthSegments, minuteHandRadialSegments);
const minuteHandMaterial = new THREE.MeshPhongMaterial(
    {color: minuteHandColor},
);
const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
minuteHand.scale.y = bodyRadius / 2 / minuteHandRadius;
minuteHand.position.y = bodyRadius / 2;
minuteHand.position.z = bodyHeight / 2;
scene.add(minuteHand);

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
