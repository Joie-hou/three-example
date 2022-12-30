<template>
  <div class="people-container">
    <el-button class="shoot-btn" @click="shoot()">shoot</el-button>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import peopleModel from "@/assets/model/beretta_pistol_fps_animation.glb";
import horse from "@/assets/model/Horse.glb";
import { GUI } from "dat-gui";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;

let ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight, spotLight: THREE.SpotLight;

let mixer: THREE.AnimationMixer;
let animationAction: THREE.AnimationAction;
let prevTime = Date.now();

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

  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 2, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  //const gui = new GUI();

  spotLight = new THREE.SpotLight();
  spotLight.position.set(0, 2, 2);
  spotLight.castShadow = true;
  //  scene.add(spotLight);
  //gui.addColor(params, "color").onChange((e: THREE.ColorRepresentation | undefined) => {
  //  directionalLight.color = new THREE.Color(e);
  //});
  //gui
  //  .add(spotLight, "angle")
  //  .min(Math.PI / 12)
  //  .max(Math.PI / 2)
  //  .step(Math.PI / 30);
};
threeInit();

const addModel = () => {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(peopleModel, (gltf) => {
    console.log(gltf);

    const mesh = gltf.scene.children[0];
    //mesh.scale.set(0.01, 0.01, 0.01);
    scene.add(mesh);

    gltf.scene.traverse((object) => {
      console.log(object);

      object.castShadow = true;
    });

    //骨骼辅助器
    //const skeleton = new THREE.SkeletonHelper(mesh);
    //skeleton.visible = false;
    //scene.add(skeleton);

    //先用AnimationMixer.clipAction实例化一个AnimationAction
    mixer = new THREE.AnimationMixer(mesh);
    animationAction = mixer.clipAction(gltf.animations[0]);
    animationAction.play();
  });
};
addModel();

let singleStepMode = false;
let sizeOfNextStep = 0;
const shoot = () => {
  //debugger;
  //animationAction.timeScale = 1;
  singleStepMode = !singleStepMode;
  sizeOfNextStep = 0.05;
  //animationAction.play();
};

const addPlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  //plane.position.y = -1;
  plane.receiveShadow = true;
  //scene.add(plane);
};
addPlane();
const clock = new THREE.Clock();

const render = () => {
  if (mixer) {
    let mixerUpdateDelta = clock.getDelta();
    if (singleStepMode) {
      mixerUpdateDelta = sizeOfNextStep;
      sizeOfNextStep = 0;
    }

    mixer.update(mixerUpdateDelta);

    //prevTime = time;
  }
};
const animate = () => {
  camera.updateProjectionMatrix();
  controls.update();
  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
};
animate();

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
<style lang="scss">
.shoot-btn {
  position: absolute;
  z-index: 1;
  top: 20px;
  left: 20px;
}
</style>
