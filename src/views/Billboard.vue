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

import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import billboardModel from "@/assets/model/taiwan_style_signboard_lowpoly.glb";
import { GUI } from "dat-gui";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;

let ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight, spotLight: THREE.SpotLight;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let composer: EffectComposer, outlinePass: OutlinePass;

let params = {
  color: 0xffffff,
};

const threeInit = () => {
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x00ffff);

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
  //  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  ambientLight = new THREE.AmbientLight();
  ambientLight.intensity = 0.3;
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(0, 2, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const gui = new GUI();

  spotLight = new THREE.SpotLight();
  spotLight.position.set(0, 2, 2);
  spotLight.castShadow = true;
  //scene.add(spotLight);
  gui.addColor(params, "color").onChange((e: THREE.ColorRepresentation | undefined) => {
    directionalLight.color = new THREE.Color(e);
  });
  gui
    .add(spotLight, "angle")
    .min(Math.PI / 12)
    .max(Math.PI / 2)
    .step(Math.PI / 30);

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  outlinePass.visibleEdgeColor = new THREE.Color(0xff0000);
  composer.addPass(outlinePass);
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();
};
threeInit();
animate();

const newGroup: THREE.Object3D<THREE.Event> | THREE.Object3D<THREE.Event>[] = [];
const addModel = () => {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  const gltf = gltfLoader.load(billboardModel, (gltf) => {
    gltf.scene.traverse(function (object) {
      if (object.name.match(/^board([0-9]+)$/)) {
        newGroup.push(object);
      }
    });

    const gui = new GUI();
    //gui.add(person.scale, "x").min(0).max(50).step(0.1);
    //gui.add(person.scale, "y").min(0).max(50).step(0.1);
    //gui.add(person.scale, "z").min(0).max(50).step(0.1);
    //person.scale.set(1, 1, 1);
    //person.rotation.x = Math.PI / 2;
    //scene.add(person);
    newGroup.map((e) => {
      if (e.name !== "board08") {
        //gui.add(e.position, "x").min(-50).max(50).step(0.1);
        //gui.add(e.position, "y").min(-50).max(50).step(0.1);
        //gui.add(e.position, "z").min(-50).max(50).step(0.1);
        //e.position.x = 10;
        //e.position.y = -16;
        //e.position.z = 13;
        //scene.add(e);
      }
    });

    scene.add(gltf.scene.children[0]);
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
  //scene.add(plane);
};
addPlane();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
let selectedObjects: any[] | THREE.Object3D<THREE.Event>[];
function addSelectedObject(object: THREE.Object3D<THREE.Event>) {
  selectedObjects = [];
  selectedObjects.push(object);
}
window.addEventListener("pointermove", (event) => {
  if (event.isPrimary === false) return;

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
    addSelectedObject(intersects[0].object);
    outlinePass.selectedObjects = selectedObjects;
  } else {
    //if (isClick.value === false) {
    //  outlinePass.selectedObjects = [];
    //}
  }
});
onMounted(() => {
  const dom = document.getElementsByClassName("people-container")[0];
  dom.appendChild(renderer.domElement);
});
</script>
