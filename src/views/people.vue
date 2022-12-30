<template>
  <div class="people-container"></div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import peopleModel from "@/assets/model/neon_-_valorant.glb";
import { GUI } from "dat-gui";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;

let ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight, spotLight: THREE.SpotLight;

let params = {
  color: 0xffffff,
};

const threeInit = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00ffff);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(1, 2, 3);

  renderer = new THREE.WebGLRenderer();
  renderer.render(scene, camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //渲染器输出
  renderer.outputEncoding = THREE.sRGBEncoding;
  //渲染阴影
  renderer.shadowMap.enabled = true;
  //开启物理上正确的光照模式。
  renderer.physicallyCorrectLights = true;

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.3;
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(2, 2, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const gui = new GUI();

  spotLight = new THREE.SpotLight();
  spotLight.position.set(0, 2, 2);
  spotLight.castShadow = true;
  scene.add(spotLight);
  gui.addColor(params, "color").onChange((e: THREE.ColorRepresentation | undefined) => {
    directionalLight.color = new THREE.Color(e);
  });
  gui
    .add(spotLight, "angle")
    .min(Math.PI / 12)
    .max(Math.PI / 2)
    .step(Math.PI / 30);

  const animate = () => {
    camera.updateProjectionMatrix();
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
};
threeInit();

const addModel = () => {
  let glbGroup = new THREE.Group();
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  const gltf = gltfLoader.load(peopleModel, (gltf) => {
    console.log(gltf);

    const person = gltf.scene.children[0];
    gltf.scene.traverse((object) => {
      //console.log(object);
      object.castShadow = true;
    });
    //console.log(glbGroup);

    person.position.y = -1;
    scene.add(person);
  });
};
addModel();

const addPlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.y = -1;
  plane.receiveShadow = true;
  scene.add(plane);
};
addPlane();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  controls.update();
});
onMounted(() => {
  const dom = document.getElementsByClassName("people-container")[0];
  dom.appendChild(renderer.domElement);
});
</script>
