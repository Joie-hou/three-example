<template>
  <div class="car-3d-container">
    <div id="car3D" ref="carModel" class="car-3D"></div>
    <el-drawer
      v-model="drawer"
      :close-on-press-escape="false"
      :modal="false"
      :show-close="false"
      title="汽车模型控制台"
      :size="300"
      :z-index="5"
    >
      <div>
        <el-form label-position="top" label-width="auto" style="max-width: 460px">
          <el-form-item v-for="(item, index) in carModelList" :key="index" :label="item.name">
            <el-switch
              v-model="item.visible"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
          <el-form-item label="汽车行走">
            <el-switch
              v-model="playOrPause"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @change="carStatusChange"
            />
          </el-form-item>
          <el-form-item label="车身质感">
            <el-slider v-model="formCar.texture" :min="0" :max="1" :step="0.1" @change="bodyTextureChange" />
          </el-form-item>
          <el-form-item label="车身颜色">
            <el-color-picker v-model="formCar.body" show-alpha @change="bodyColorChange" />
          </el-form-item>
          <el-form-item label="车玻璃颜色">
            <el-color-picker v-model="formCar.glass" show-alpha @change="glassColorChange" />
          </el-form-item>
          <el-form-item label="轮毂颜色">
            <el-color-picker v-model="formCar.details" show-alpha @change="detailsColorChange" />
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import hdr1 from "@/assets/car/venice_sunset_1k.hdr";
import car from "@/assets/car/ferrari.glb";
import { Arrayable } from "element-plus/es/utils";
import { Ref } from "vue";

const drawer = ref(true);
const formCar = ref({
  body: "",
  glass: "",
  details: "",
  texture: 0,
});
const carModel = ref();
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  grid: THREE.GridHelper;
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);
  scene.environment = new RGBELoader().load(hdr1);
  scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.fog = new THREE.Fog(0x333333, 10, 15);
  grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
  const material = grid.material as THREE.Material;
  material.opacity = 0.2;
  material.depthWrite = false;
  material.transparent = true;
  grid.receiveShadow = true;
  scene.add(grid);
  const help = new THREE.AxesHelper();
  scene.add(help);

  camera = new THREE.PerspectiveCamera(40, carModel.value.clientWidth / carModel.value.clientHeight, 0.1, 100);
  camera.position.set(4.25, 1.4, -4.5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(carModel.value.clientWidth, carModel.value.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;

  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.needsUpdate = true;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxDistance = 9;
  controls.target.set(0, 0.5, 0);
}
let wheels: any[] = [];
const carModelList: Ref<THREE.Object3D<THREE.Event>[]> = ref([]);
function addMesh() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load(car, (gltf) => {
    const carModel = gltf.scene.children[0] as any;
    gltf.scene.traverse((object) => {
      object.castShadow = true;
      carModelList.value.push(object);
    });

    carModel.getObjectByName("body").material = bodyMaterial;

    carModel.getObjectByName("rim_fl").material = detailsMaterial;
    carModel.getObjectByName("rim_fr").material = detailsMaterial;
    carModel.getObjectByName("rim_rr").material = detailsMaterial;
    carModel.getObjectByName("rim_rl").material = detailsMaterial;
    carModel.getObjectByName("trim").material = detailsMaterial;

    carModel.getObjectByName("glass").material = glassMaterial;

    wheels.push(
      carModel.getObjectByName("wheel_fl"),
      carModel.getObjectByName("wheel_fr"),
      carModel.getObjectByName("wheel_rl"),
      carModel.getObjectByName("wheel_rr")
    );

    const car2 = gltf.scene.children[0].clone();

    car2.position.x = 5;
    //scene.add(car2);

    scene.add(carModel);
  });
}

function animate() {
  render();
  camera.aspect = carModel.value.clientWidth / carModel.value.clientHeight;
  camera.updateProjectionMatrix();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const clock = new THREE.Clock();
function render() {
  let time = clock.getElapsedTime();
  if (!playOrPause.value) {
    time = 0;
  }
  for (let i = 0; i < wheels.length; i++) {
    wheels[i].rotation.x = -(time * Math.PI * 2);
  }

  grid.position.z = time % 1;
}

//materials
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  sheen: 0.5,
});

const detailsMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.5,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0,
});

const spLight = new THREE.SpotLight(0xffffff);

function bodyTextureChange(value: Arrayable<number>) {
  bodyMaterial.roughness = value as number;
}
function bodyColorChange(value: string | null) {
  let v = value;
  if (!value) {
    v = "#ff0000";
  }

  bodyMaterial.color.set(v as string);
}
function glassColorChange(value: string | null) {
  let v = value;
  if (!value) {
    v = "#ffffff";
  }
  glassMaterial.color.set(v as string);
}
function detailsColorChange(value: string | null) {
  let v = value;
  if (!value) {
    v = "#ffffff";
  }
  detailsMaterial.color.set(v as string);
}
const playOrPause = ref(false);
function carStatusChange(value: string | number | boolean) {
  playOrPause.value = value as boolean;
}

onMounted(() => {
  init();
  animate();
  addMesh();
  carModel.value?.appendChild(renderer.domElement);
  window.addEventListener("resize", () => {
    camera.aspect = carModel.value.clientWidth / carModel.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(carModel.value.clientWidth, carModel.value.clientHeight);
  });
});
</script>

<style lang="scss">
.car-3d-container {
  width: 100%;
  height: 100%;
  .car-3D {
    position: absolute;
    z-index: 10;
    width: calc(100% - 300px);
    height: 100%;
  }
}
</style>
