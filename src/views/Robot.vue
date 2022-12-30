<template>
  <div class="robot-container"></div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";

import sky12 from "@/assets/robot/sky12.hdr";
import robotModel from "@/assets/robot/robot.glb";
import zp2 from "@/assets/robot/zp2.mp4";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
function init() {
  scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(sky12, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; //球面的映射纹理
    scene.background = texture;
    scene.environment = texture;
  });

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-2, 2, -2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true; //正确的物理光照
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement);
}
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  controls.update();
}
init();
animate();

function addModel() {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(robotModel, (gltf) => {
    scene.add(gltf.scene);
  });
}

function addPlane() {
  const video = document.createElement("video");
  video.src = zp2;
  //  视频静音才能自动播放，属于浏览器的安全策略
  video.muted = true;
  video.loop = true;
  video.play();
  const videoPlaneGeometry = new THREE.PlaneGeometry(8, 4.5);
  const videoPlaneMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.VideoTexture(video),
    transparent: true,
    alphaMap: new THREE.VideoTexture(video),
    side: THREE.DoubleSide,
  });
  const videoPlane = new THREE.Mesh(videoPlaneGeometry, videoPlaneMaterial);
  videoPlane.rotation.x = -Math.PI / 2;
  scene.add(videoPlane);
}

function addLight() {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-3, 3, 0);
  const spotLight2 = spotLight.clone();
  spotLight2.position.set(3, 3, 0);
  scene.add(spotLight);
  scene.add(spotLight2);
}

//添加镜面反射----------------------------------------------------
function mirrorPlane() {
  let reflectorGeometry = new THREE.PlaneGeometry(100, 100);
  let reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0xffffff,
  });
  reflectorPlane.rotation.x = -Math.PI / 2;
  scene.add(reflectorPlane);
}
addLight();
addModel();
addPlane();
mirrorPlane();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

onMounted(() => {
  const dom = document.getElementsByClassName("robot-container")[0];
  dom.appendChild(renderer.domElement);
});
</script>
