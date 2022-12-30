<template>
  <div ref="crytalBear" class="crystal-bear-container"></div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//draco 压缩模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import skyImg from "@/assets/textures/sky.jpg";
import lion from "@/assets/model/crystalModel/lion.gltf";
import bear from "@/assets/model/crystalModel/bear.gltf";

const crytalBear = ref();

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true }); //抗锯齿状，可以让物体看上去更平滑
  renderer.render(scene, camera);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; //阻尼，移动旋转的时候会有缓冲的效果

  //环境光
  let amLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(amLight);

  //  环境贴图
  let bgTexture = new THREE.TextureLoader().load(skyImg);
  //bgTexture.mapping = THREE.EquirectangularRefractionMapping; //折射映射
  bgTexture.mapping = THREE.EquirectangularReflectionMapping; //反射映射

  scene.background = bgTexture;
  scene.environment = bgTexture;

  const gltfLoader = new GLTFLoader();
  //实例化Draco库
  const dracoLoader = new DRACOLoader();
  //添加Draco载入库
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load(bear, (gltf) => {
    console.log(gltf);
    const model = gltf.scene.children[0] as THREE.Mesh;
    model.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: bgTexture,
      reflectivity: 0.9, //环境贴图对表面的影响程度
      refractionRatio: 0.7, //折射率
    });
    console.log(model);

    scene.add(model);
  });
  gltfLoader.load(lion, (gltf) => {
    console.log(gltf);
    const model = gltf.scene.children[0] as THREE.Mesh;
    model.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: bgTexture,
      reflectivity: 0.9, //环境贴图对表面的影响程度
      refractionRatio: 0.7, //折射率
    });
    model.position.x = 1;
    console.log(model);

    scene.add(model);
  });
}
function animate() {
  controls.update();
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
animate();

onMounted(() => {
  crytalBear.value.appendChild(renderer.domElement);
});
</script>
