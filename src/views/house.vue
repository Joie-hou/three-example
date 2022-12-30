<template>
  <div class="house-container"></div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

import build from "@/assets/model/building.obj";

import window1 from "@/assets/model/texteur/window1.jpg";
import window2 from "@/assets/model/texteur/window2.png";
import window3 from "@/assets/model/texteur/window3.png";

import brack from "@/assets/model/texteur/brack.jpg";
import brackNM from "@/assets/model/texteur/brackNM.jpg";
import wf from "@/assets/model/texteur/wf.jpg";
import store from "@/assets/model/texteur/store.png";
import storeNM from "@/assets/model/texteur/storeNM.png";
import top from "@/assets/model/texteur/top.jpg";
import topNM from "@/assets/model/texteur/topNM.jpg";
import w2 from "@/assets/model/texteur/w2.png";
import w2NM from "@/assets/model/texteur/w2NM.png";
import door from "@/assets/model/texteur/door.png";
import door2 from "@/assets/model/texteur/door2.png";
import AC from "@/assets/model/texteur/AC.jpg";
import iron from "@/assets/model/texteur/iron.jpg";
import { GUI } from "dat-gui";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, control: OrbitControls;
function init() {
  // 场景，相机
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(20, 10, 20);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 地表格
  const grid = new THREE.GridHelper(500, 100, 0xffffff, 0xffffff);
  let gridMaterial = grid.material as THREE.Material;
  gridMaterial.opacity = 0.5;
  gridMaterial.depthWrite = false;
  gridMaterial.transparent = true;
  scene.add(grid);

  // 材质
  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const diLight = new THREE.DirectionalLight(0xffffff);
  //diLight.position.set(-5, 2, 0);
  diLight.castShadow = true;
  camera.add(diLight);
  scene.add(camera);

  // 控制器
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.maxPolarAngle = Math.PI / 2;
  control.minPolarAngle = 0;

  const axesHelper = new THREE.AxesHelper(15);
  scene.add(axesHelper);

  function animate() {
    camera.updateProjectionMatrix();
    control.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
init();

//导入模型
const textureLoader = new THREE.TextureLoader();
const loader = () => {
  const loader = new OBJLoader();
  loader.load(build, (object) => {
    object.castShadow = true;
    let child: THREE.Mesh[] = object.children as THREE.Mesh[];
    child[0].material = new THREE.MeshStandardMaterial({
      color: 0x333333,
    });
    child[1].material = [
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(window1),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(window2),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(window3),
      }),
    ];
    child[2].material = [
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(brack),
        normalMap: textureLoader.load(brackNM),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(brack),
        normalMap: textureLoader.load(brackNM),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(wf),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(store),
        normalMap: textureLoader.load(storeNM),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(top),
        normalMap: textureLoader.load(topNM),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(w2),
        normalMap: textureLoader.load(w2NM),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(door),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(door2),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(AC),
      }),
      new THREE.MeshPhongMaterial({
        map: textureLoader.load(iron),
      }),
    ];

    object.position.y = 1;
    const gui = new GUI();
    gui.add(object.position, "x").max(20).min(-20).step(1);
    gui.add(object.position, "y").max(20).min(-20).step(1);
    gui.add(object.position, "z").max(20).min(-20).step(1);
    console.log(object);

    scene.add(object);
  });
};
loader();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  control.update();
});

onMounted(() => {
  const dom = document.getElementsByClassName("house-container");
  dom[0].append(renderer.domElement);
});
</script>
