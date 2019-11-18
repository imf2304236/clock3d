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
const bodyHeight = 1;
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

// Add hand mount
const handMountColor = 'black';
const handMountRadius = 2;
const handMountWidthSegments = 32;
const handMountRadialSegments = 32;
const handMountGeometry = new THREE.SphereBufferGeometry(
    handMountRadius, handMountWidthSegments, handMountRadialSegments);
const handMountMaterial = new THREE.MeshPhongMaterial({color: handMountColor});
const handMount = new THREE.Mesh(handMountGeometry, handMountMaterial);
handMount.position.z = bodyHeight / 2;
scene.add(handMount);

// Add outer ring
const ringColor = 'skyblue';
const ringRadius = bodyRadius;
const ringHeight = bodyHeight * 4;
const ringThickness = 5;
const points = new Array(5);
points[0] = new THREE.Vector2(ringRadius, 0);
points[1] = new THREE.Vector2(ringRadius, ringHeight);
points[2] = new THREE.Vector2(ringRadius + ringThickness, ringHeight);
points[3] = new THREE.Vector2(ringRadius + ringThickness, 0);
points[4] = new THREE.Vector2(ringRadius, 0);
const ringGeometry = new THREE.LatheGeometry( points, 200);
ringGeometry.computeFlatVertexNormals();
const ringMaterial = new THREE.MeshPhongMaterial(
    {color: new THREE.Color(ringColor), side: THREE.DoubleSide});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotateX(Math.PI / 2);
ring.position.z = -ringHeight / 2;
scene.add(ring);

let date = new Date();

// Add hour-hand
const hourHandColor = 'black';
const hourHandWidth = 2;
const hourHandHeight = bodyRadius / 2 + minuteTickLength;
const hourHandWidthSegments = 32;
const hourHandRadialSegments = 32;
const hourHandGeometry = new THREE.SphereBufferGeometry(
    hourHandWidth / 2, hourHandWidthSegments, hourHandRadialSegments);
const hourHandMaterial = new THREE.MeshPhongMaterial(
    {color: hourHandColor},
);
const hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
hourHand.scale.x = hourHandHeight / hourHandWidth;
hourHand.rotateZ(Math.PI / 2);
hourHand.position.y = hourHandHeight / 2;
hourHand.position.z = bodyHeight / 2;
scene.add(hourHand);

// Add minute-hand
const minuteHandColor = 'black';
const minuteHandWidth = 2;
const minuteHandHeight = bodyRadius * 4 / 5 + minuteTickLength;
const minuteHandWidthSegments = 32;
const minuteHandRadialSegments = 32;
const minuteHandGeometry = new THREE.SphereBufferGeometry(
    minuteHandWidth / 2, minuteHandWidthSegments, minuteHandRadialSegments);
const minuteHandMaterial = new THREE.MeshPhongMaterial(
    {color: minuteHandColor},
);
const minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
minuteHand.scale.x = minuteHandHeight / minuteHandWidth;
minuteHand.rotateZ(Math.PI / 2);
minuteHand.position.y = minuteHandHeight / 2;
minuteHand.position.z = bodyHeight / 2;
scene.add(minuteHand);

// Add second-hand
const secondHandColor = 'red';
const secondHandWidth = 1;
const secondHandHeight = bodyRadius * 4 / 5 + minuteTickLength;
const secondHandGeometry = new THREE.PlaneBufferGeometry(
    secondHandWidth, secondHandHeight);
const secondHandMaterial = new THREE.MeshPhongMaterial(
    {color: secondHandColor},
);
secondHandMaterial.depthTest = false;
const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
secondHand.position.y = secondHandHeight / 2;
secondHand.position.z = bodyHeight / 2;
scene.add(secondHand);

// TODO: Duplicate clock on backside
// TODO: Show San Francisco time on second clock

const controls = new THREE.TrackballControls(camera, canvas);

/**
 * Renders frame
 */
function render() {
  requestAnimationFrame(render);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  console.log(hours);

  hourHand.position.set(
      hourHandHeight / 2 * Math.sin(Math.PI / 6 * hours),
      hourHandHeight / 2 * Math.cos(Math.PI / 6 * hours),
      hourHand.position.z,
  );
  const hourHandRotationAngle =
      new THREE.Euler(0, 0, -Math.PI / 6 * hours + Math.PI / 2);
  hourHand.setRotationFromEuler(hourHandRotationAngle);

  minuteHand.position.set(
      minuteHandHeight / 2 * Math.sin(Math.PI / 30 * minutes),
      minuteHandHeight / 2 * Math.cos(Math.PI / 30 * minutes),
      minuteHand.position.z,
  );
  const minuteHandRotationAngle =
      new THREE.Euler(0, 0, -Math.PI / 30 * minutes + Math.PI / 2);
  minuteHand.setRotationFromEuler(minuteHandRotationAngle);

  secondHand.position.set(
      secondHandHeight / 2 * Math.sin(Math.PI / 30 * seconds),
      secondHandHeight / 2 * Math.cos(Math.PI / 30 * seconds),
      secondHand.position.z,
  );
  const secondHandRotationAngle =
      new THREE.Euler(0, 0, -Math.PI * seconds / 30);
  secondHand.setRotationFromEuler(secondHandRotationAngle);

  date = new Date();

  controls.update();
  renderer.render(scene, camera);
}

render();
