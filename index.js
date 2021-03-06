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
const bodyHeight = 10;
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
  const minuteTickSecondary = minuteTick.clone();
  minuteTick.position.z = bodyHeight / 2;
  minuteTickSecondary.position.z = -bodyHeight / 2;
  minuteTickSecondary.rotateY(Math.PI);
  minuteTick.rotateZ(-i * Math.PI / 30);
  minuteTickSecondary.rotateZ(i * Math.PI / 30);
  scene.add(minuteTick);
  scene.add(minuteTickSecondary);
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
const handMountSecondary = handMount.clone();
handMount.position.z = bodyHeight / 2;
handMountSecondary.position.z = -bodyHeight / 2;
scene.add(handMount);
scene.add(handMountSecondary);

// Add outer ring
const ringColor = 'skyblue';
const ringRadius = bodyRadius;
const ringHeight = bodyHeight * 2;
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
const hourHandSecondary = hourHand.clone();
hourHand.position.z = bodyHeight / 2;
hourHandSecondary.position.z = -bodyHeight / 2;
scene.add(hourHand);
scene.add(hourHandSecondary);

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
const minuteHandSecondary = minuteHand.clone();
minuteHand.position.z = bodyHeight / 2;
minuteHandSecondary.position.z = -bodyHeight / 2;
scene.add(minuteHand);
scene.add(minuteHandSecondary);

// Add second-hand
const secondHandColor = 'red';
const secondHandWidth = 1;
const secondHandHeight = bodyRadius * 4 / 5 + minuteTickLength;
const secondHandGeometry = new THREE.PlaneBufferGeometry(
    secondHandWidth, secondHandHeight);
const secondHandMaterial = new THREE.MeshPhongMaterial(
    {color: secondHandColor, side: THREE.DoubleSide});
const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
secondHand.position.y = secondHandHeight / 2;
const secondHandSecondary = secondHand.clone();
secondHandSecondary.rotateY(Math.PI);
const secondHandZOffset = 0.01; // fixes depthTest rendering issues
secondHand.position.z = bodyHeight / 2 + secondHandZOffset;
secondHandSecondary.position.z = -bodyHeight / 2 - secondHandZOffset;
scene.add(secondHand);
scene.add(secondHandSecondary);

const controls = new THREE.TrackballControls(camera, canvas);

/**
 * Renders frame
 */
function render() {
  requestAnimationFrame(render);

  const hours = date.getHours();
  const hoursSecondary = hours - 9; // Time in San Francisco, CA, USA
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const radiansPerHour = Math.PI / 6;
  const radiansPerMinute = Math.PI / 30;
  const radiansPerSecond = radiansPerMinute;

  hourHand.position.set(
      hourHandHeight / 2 * Math.sin(radiansPerHour * hours),
      hourHandHeight / 2 * Math.cos(radiansPerHour * hours),
      hourHand.position.z,
  );
  const hourHandRotationAngle =
      new THREE.Euler(0, 0, -radiansPerHour * hours + Math.PI / 2);
  hourHand.setRotationFromEuler(hourHandRotationAngle);

  hourHandSecondary.position.set(
      hourHandHeight / 2 * -Math.sin(radiansPerHour * hoursSecondary),
      hourHandHeight / 2 * Math.cos(radiansPerHour * hoursSecondary),
      hourHandSecondary.position.z,
  );
  const hourHandSecondaryRotationAngle =
      new THREE.Euler(0, 0, radiansPerHour * hoursSecondary + Math.PI / 2);
  hourHandSecondary.setRotationFromEuler(hourHandSecondaryRotationAngle);

  minuteHand.position.set(
      minuteHandHeight / 2 * Math.sin(radiansPerMinute * minutes),
      minuteHandHeight / 2 * Math.cos(radiansPerMinute * minutes),
      minuteHand.position.z,
  );
  const minuteHandRotationAngle =
      new THREE.Euler(0, 0, -radiansPerMinute * minutes + Math.PI / 2);
  minuteHand.setRotationFromEuler(minuteHandRotationAngle);

  minuteHandSecondary.position.set(
      minuteHandHeight / 2 * -Math.sin(radiansPerMinute * minutes),
      minuteHandHeight / 2 * Math.cos(radiansPerMinute * minutes),
      minuteHandSecondary.position.z,
  );
  const minuteHandSecondaryRotationAngle =
      new THREE.Euler(0, 0, radiansPerSecond * minutes + Math.PI / 2);
  minuteHandSecondary.setRotationFromEuler(minuteHandSecondaryRotationAngle);

  secondHand.position.set(
      secondHandHeight / 2 * Math.sin(radiansPerSecond * seconds),
      secondHandHeight / 2 * Math.cos(radiansPerSecond * seconds),
      secondHand.position.z,
  );
  const secondHandRotationAngle =
      new THREE.Euler(0, 0, -radiansPerSecond * seconds);
  secondHand.setRotationFromEuler(secondHandRotationAngle);

  secondHandSecondary.position.set(
      secondHandHeight / 2 * -Math.sin(radiansPerSecond * seconds),
      secondHandHeight / 2 * Math.cos(radiansPerSecond * seconds),
      secondHandSecondary.position.z,
  );
  const secondHandSecondaryRotationAngle =
    new THREE.Euler(0, 0, radiansPerSecond * seconds);
  secondHandSecondary.setRotationFromEuler(secondHandSecondaryRotationAngle);

  date = new Date();

  controls.update();
  renderer.render(scene, camera);
}

render();
