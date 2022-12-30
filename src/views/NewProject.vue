<template>
  <div class="new-project-container"></div>
</template>

<script lang="ts" setup>
import manager from "@/utils/LoadingManager";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
//导入纹理图片
import ballColor from "@/assets/ball/MetalGoldPaint002_COL_1K_METALNESS.png";
import ballColor2 from "@/assets/ball/MetalGoldPaint002_Sphere.png";
import ballBump from "@/assets/ball/MetalGoldPaint002_BUMP_1K_METALNESS.png";
import ballDisplacement from "@/assets/ball/MetalGoldPaint002_DISP_1K_METALNESS.png";
import ballMetalness from "@/assets/ball/MetalGoldPaint002_NRM_1K_METALNESS.png";
import ballNormal from "@/assets/ball/MetalGoldPaint002_NRM_1K_METALNESS.png";
import ballRoughness from "@/assets/ball/MetalGoldPaint002_ROUGHNESS_1K_METALNESS.png";
import hdr050 from "@/assets/050.hdr";

//土地纹理图片
import groudColor from "@/assets/ground/GroundDirtRocky013_COL_1K.jpg";
import groudAo from "@/assets/ground/GroundDirtRocky013_AO_1K.jpg";
import groudBump from "@/assets/ground/GroundDirtRocky013_BUMP_1K.jpg";
import groudDisplacement from "@/assets/ground/GroundDirtRocky013_DISP_1K.jpg";
import groudMetalness from "@/assets/ground/GroundDirtRocky013_GLOSS_1K.jpg";
import groudRoughness from "@/assets/ground/GroundDirtRocky013_REFL_1K.jpg";
import groudNormal from "@/assets/ground/GroundDirtRocky013_NRM_1K.jpg";

//创建添加场景
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();

scene.background = new THREE.Color(0x87ceeb);
const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(environment).texture;
//载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync(hdr050).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; //球面的映射纹理
  scene.background = texture;
  scene.environment = texture;
});

//创建添加相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000); //模拟人眼看到的场景
camera.position.set(0, 0, 20);

//创建添加辅助对象
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

//创建添加灯光
//环境光
const light = new THREE.AmbientLight(0xffffff, 0.3); // soft white light
scene.add(light);
//平行光 模拟太阳光
const spotLight = new THREE.DirectionalLight(0xffffff);
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
scene.add(spotLight);

//创建纹理
const texture = new THREE.TextureLoader(manager);

//创建添加物体
const sphereGeometry = new THREE.SphereGeometry(5);
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: texture.load(ballColor), //颜色贴图
  //  alphaMap: "", // 一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
  transparent: true,
  //  aoMap: "", //该纹理的红色通道用作环境遮挡贴图。aoMap需要第二组UV。
  //  aoMapIntensity: 0.5, //环境遮挡效果的强度 0-1
  //  bumpMap: texture.load(ballBump), //用于创建凹凸贴图的纹理。如果定义了法线贴图，则将忽略该贴图。
  //  bumpScale: 0.5, //凹凸贴图会对材质产生多大影响。典型范围是0-1。
  displacementMap: texture.load(ballDisplacement), //位移贴图会影响网格顶点的位置,移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。
  displacementScale: 1, //影响程度 0-1
  roughnessMap: texture.load(ballRoughness), //该纹理的绿色通道用于改变材质的粗糙度。
  roughness: 1, //粗糙度 0-1
  metalnessMap: texture.load(ballMetalness), //该纹理的蓝色通道用于改变材质的金属度。
  metalness: 1, //金属度 0-1
  normalMap: texture.load(ballNormal), //用于创建法线贴图的纹理。法线贴图不会改变曲面的实际形状，只会改变光照。
  //  envMap: texture.load(skyStatic), //环境贴图
});
//设置第二组AO
sphereGeometry.setAttribute("uv2", new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2));
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//sphere.receiveShadow = true;
sphere.castShadow = true;
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(100, 100);
planeGeometry.rotateX(-Math.PI / 2);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: texture.load(groudColor, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, 4);
    map.encoding = THREE.sRGBEncoding;
  }),
  transparent: true,
  aoMap: texture.load(groudAo, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, 4);
    map.encoding = THREE.sRGBEncoding;
  }),
  //bumpMap: texture.load(groudBump),
  bumpScale: 1,
  displacementMap: texture.load(groudDisplacement, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, 4);
    map.encoding = THREE.sRGBEncoding;
  }),
  metalnessMap: texture.load(groudMetalness, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, 4);
    map.encoding = THREE.sRGBEncoding;
  }),
  metalness: 1,
  //roughnessMap: texture.load(groudRoughness, (map) => {
  //  map.wrapS = THREE.RepeatWrapping;
  //  map.wrapT = THREE.RepeatWrapping;
  //  map.anisotropy = 4;
  //  map.repeat.set(4, 4);
  //  map.encoding = THREE.sRGBEncoding;
  //}),
  //roughness: 1,
  normalMap: texture.load(groudNormal, (map) => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, 4);
    map.encoding = THREE.sRGBEncoding;
  }),
});
//设置第二组UV
planeGeometry.setAttribute("uv2", new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//plane.castShadow = true;
plane.receiveShadow = true;
plane.position.y = -5;
//plane.material.side = THREE.DoubleSide;
console.log(plane);

scene.add(plane);

//创建添加渲染器
renderer.outputEncoding = THREE.sRGBEncoding;
//渲染阴影
renderer.shadowMap.enabled = true;
//开启物理上正确的光照模式。
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);

//添加控制器
const controls = new OrbitControls(camera, renderer.domElement);
//设置控制器阻尼，让控制器有更真实效果, 渲染函数中调用update()
//可以实现物体慢慢停下来
controls.enableDamping = true;

//渲染函数
function animation() {
  controls.update();
  //更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
  camera.updateProjectionMatrix();
  //  用相机(camera)渲染一个场景(scene)或是其它类型的object
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation();

window.addEventListener("resize", () => {
  //  //更新摄像头宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  //  //更新摄像头投影矩阵
  camera.updateProjectionMatrix();
  //更新渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
});

onMounted(() => {
  const dom = document.getElementsByClassName("new-project-container")[0];
  dom.appendChild(renderer.domElement);
});
</script>
