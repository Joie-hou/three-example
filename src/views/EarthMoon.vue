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
//导入2d渲染器
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

import moon from "@/assets/planets/moon_1024.jpg";
import earthAtmos from "@/assets/planets/earth_atmos_2048.jpg";
import earthClouds from "@/assets/planets/earth_clouds_1024.png";
import earthLights from "@/assets/planets/earth_lights_2048.png";
import earthNormal from "@/assets/planets/earth_normal_2048.jpg";
import earthSpecular from "@/assets/planets/earth_specular_2048.jpg";
import gsap from "gsap";

//添加gui控制操作
const gui = new dat.GUI();
//初始化场景
const scene = new THREE.Scene();

//初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

//设置相机位置
camera.position.set(0, 0, 5);

//初始化渲染器
const renderer = new THREE.WebGL1Renderer({
  //设置抗锯齿
  //antialias: true,
  //设置对数深度缓冲区
  //logarithmicDepthBuffer: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
//设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); //像素比
//渲染阴影
renderer.shadowMap.enabled = true;

const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(environment).texture;

//创建辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//初始化加载器
const TextureLoader = new THREE.TextureLoader();

//初始化标签渲染器
const labelLoader = new CSS2DRenderer();
labelLoader.setSize(window.innerWidth, window.innerHeight);
labelLoader.domElement.style.position = "absolute";
labelLoader.domElement.style.top = "0px";

//实例化控制器***********
const controls = new OrbitControls(camera, renderer.domElement);
const controls2 = new OrbitControls(camera, labelLoader.domElement);

//创建环境光
const aLight = new THREE.AmbientLight(0xffffff);
aLight.intensity = 0.3;
scene.add(aLight);

//创建聚光灯光源
const dirLight = new THREE.SpotLight(0xffffff);
dirLight.position.set(5, 0, 10);
dirLight.intensity = 2;
dirLight.castShadow = true;
const spotLightHelper = new THREE.SpotLightHelper(dirLight);
scene.add(dirLight);
scene.add(spotLightHelper);

const MOON_RADIUS = 0.27;
const EARTH_RADUIS = 1;
//创建添加月球
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({
  shininess: 7, //高亮的程度，越高的值越闪亮
  map: TextureLoader.load(moon),
});
const moonExample = new THREE.Mesh(moonGeometry, moonMaterial);
moonExample.position.set(-2, 2, 2);
moonExample.receiveShadow = true;
moonExample.castShadow = true;
scene.add(moonExample);

//let time = {
//  value: 0,
//};
//gsap.to(time, {
//  value: 1,
//  duration: 5,
//  repeat: -1,
//  ease: "linear",
//  onUpdate: () => {
//    moonExample.position.set(Math.sin(time.value * Math.PI * 2) * 5, 0, Math.cos(time.value * Math.PI * 2) * 5);
//  },
//});

//创建添加地球

const earthGeometry = new THREE.SphereGeometry(EARTH_RADUIS, 30, 30);
//一般几何体有两套UV坐标
//包含的纹理坐标用于颜色贴图map、法线贴图normalMap等,
//包含的第二套纹理贴图用于光照阴影贴图
earthGeometry.attributes.uv2 = earthGeometry.attributes.uv;
const earthMaterial = new THREE.MeshPhongMaterial({
  shininess: 10, //高亮的程度，越高的值越闪亮
  map: TextureLoader.load(earthAtmos),
  lightMap: TextureLoader.load(earthLights),
  specularMap: TextureLoader.load(earthSpecular),
  normalMap: TextureLoader.load(earthNormal),
  normalScale: new THREE.Vector2(0.85, 0.85),
});
const earthExample = new THREE.Mesh(earthGeometry, earthMaterial);
earthExample.receiveShadow = true;
earthExample.castShadow = true;
scene.add(earthExample);

//添加云
const cloudMaterial = new THREE.MeshLambertMaterial({
  blending: THREE.NormalBlending,
  map: TextureLoader.load(earthClouds),
  transparent: true,
  depthTest: false,
});
const cloudExample = new THREE.Mesh(earthGeometry, cloudMaterial);
scene.add(cloudExample);

//监听屏幕大小，更新渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  //更新摄像头宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像头投影矩阵
  camera.updateProjectionMatrix();
  //更新渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//创建时间
const clock = new THREE.Clock();

//渲染函数
let oldTime = 0;
function render() {
  const elapsed = clock.getElapsedTime(); //当前时间
  moonExample.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

  //地球自转
  const axis = new THREE.Vector3(0, 1, 0);
  earthExample.rotateOnAxis(axis, (elapsed - oldTime) * (Math.PI / 50));
  cloudExample.rotateOnAxis(axis, (elapsed - oldTime) * (Math.PI / 50));
  //渲染场景
  renderer.render(scene, camera);
  labelLoader.render(scene, camera);
  oldTime = elapsed;
  //引擎自动更新渲染器
  requestAnimationFrame(render);
}
render();

onMounted(() => {
  const dom = document.getElementsByClassName("index-container");
  //将渲染器添加到dom中
  dom[0].appendChild(renderer.domElement);
  dom[0].appendChild(labelLoader.domElement);

  const earthDiv = document.createElement("div");
  earthDiv.className = "label";
  earthDiv.textContent = "Earth";
  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.position.set(0, EARTH_RADUIS + 0.5, 0);
  earthExample.add(earthLabel);
  earthExample.layers.set(0);

  const moonDiv = document.createElement("div");
  moonDiv.className = "label";
  moonDiv.textContent = "Moon";
  const moonLabel = new CSS2DObject(moonDiv);
  moonLabel.position.set(0, MOON_RADIUS + 0.1, 0);
  moonExample.add(moonLabel);
  moonExample.layers.set(0);
});
</script>

<style lang="scss">
.index-container {
  width: 100%;
  height: 100%;
}
.label {
  color: #fff;
}
</style>
