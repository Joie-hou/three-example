<template>
  <div class="index-container">
    <!--<el-button type="success">1</el-button>-->
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import * as dat from "dat-gui";
//导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入水面
import { Water } from "three/examples/jsm/objects/Water2";
//导入GLTFL库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import skyStatic from "@/assets/textures/sky.jpg";
import skyActive from "@/assets/textures/sky.mp4";
import island2 from "@/assets/model/island2.glb";
import waterNormal1 from "@/assets/textures/water/Water_1_M_Normal.jpg";
import waterNormal2 from "@/assets/textures/water/Water_2_M_Normal.jpg?url";
import hdr050 from "@/assets/050.hdr";
import draco from "@/assets/draco/?url";

//添加gui控制操作
const gui = new dat.GUI();
//初始化场景
const scene = new THREE.Scene();

//初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

//设置相机位置
camera.position.set(-100, 0, 500);

//初始化渲染器
const renderer = new THREE.WebGL1Renderer({
  //设置抗锯齿
  antialias: true,
  //设置对数深度缓冲区
  logarithmicDepthBuffer: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;

//设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);

//监听屏幕大小，更新渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  //更新摄像头宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像头投影矩阵
  camera.updateProjectionMatrix();
  //更新渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//实例化控制器***********
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.autoRotate = true;

function render() {
  //渲染场景
  renderer.render(scene, camera);
  //引擎自动更新渲染器
  requestAnimationFrame(render);
  controls.update();
}
render();

//添加平面
//const planeGeometry = new THREE.PlaneGeometry(100, 100);
//const planeMaterial = new THREE.MeshBasicMaterial({
//  color: "#ffffff",
//});
//const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//scene.add(plane);

//创建一个巨大球体，用来创建天空
let texture = new THREE.TextureLoader().load(skyStatic);
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: texture,
});
//几何体翻转
skyGeometry.scale(1, 1, -1);
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

//创建视频纹理
const video = document.createElement("video");
video.src = skyActive;
video.loop = true;

window.addEventListener("click", () => {
  //当鼠标点击的时候播放视频
  //判断视频播放状态
  if (video.paused) {
    video.play();
    let texture = new THREE.VideoTexture(video);
    skyMaterial.map = texture;
    skyMaterial.map.needsUpdate = true;
  }
});
const clock = new THREE.Clock();
console.log(clock);

//载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync(hdr050).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; //球面的映射纹理
  scene.background = texture;
  //scene.environment = texture;
  scene.environment = texture;
});

//添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
//scene.add(light);

//创建水面
const waterGeometry = new THREE.CircleGeometry(300, 64);
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1,
  normalMap0: new THREE.TextureLoader().load(waterNormal1),
  normalMap1: new THREE.TextureLoader().load(waterNormal2),
});
water.position.y = -3;
//水面放平
water.rotation.x = -Math.PI / 2;
scene.add(water);
gui.add(water.position, "y").min(-50).max(50).step(1);
//water.material.side = THREE.DoubleSide;
//water.material.transparent = true;

//添加小岛模型
//实例化载入库
const gltfLoader = new GLTFLoader();
//实例化Draco库
const dracoLoader = new DRACOLoader();
//添加Draco载入库
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
const gltf = gltfLoader.load(island2, (gltf) => {
  const island = gltf.scene;
  island.position.y = -9;
  scene.add(island);
  gui.add(island.position, "y").min(-50).max(50).step(1);
});
console.log(gltf);

onMounted(() => {
  const dom = document.getElementsByClassName("index-container");
  dom[0].appendChild(renderer.domElement);
});
</script>

<style lang="scss">
.index-container {
  width: 100%;
  height: 100%;
}
</style>
