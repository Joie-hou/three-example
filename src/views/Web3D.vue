<template>
  <div class="web-3d-container">
    <div class="back-container"></div>
    <div class="header">
      <div class="logo">LOGO</div>
      <div class="menu">
        <div class="title">张三李四</div>
        <div class="title">王五赵六</div>
        <div class="title">张龙赵虎</div>
      </div>
    </div>
    <div ref="pages" class="pages">
      <div class="page">
        <div class="content">
          <h1>PAGE ONE</h1>
          <span>富强、民主、文明、和谐</span>
        </div>
      </div>
      <div class="page">
        <div class="content">
          <h1>PAGE TWO</h1>
          <span>富强、民主、文明、和谐</span>
        </div>
      </div>
      <div class="page">
        <div class="content">
          <h1>PAGE THREE</h1>
          <span>富强、民主、文明、和谐</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";

import craft1 from "@/assets/spacecraft/fragata_pesada_event_star.glb";
import craft2 from "@/assets/spacecraft/frigata_nebulon_b_frigate_nebulon_b.glb";
import craft3 from "@/assets/spacecraft/raven_spaceship_-_star_conflict_v.2.glb";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 10);

  const diLight = new THREE.DirectionalLight(0xffffff);
  camera.add(diLight);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  //  controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();

//添加动态宇宙星空
function addStars() {
  for (let j = 0; j < 10; j++) {
    let instancedMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      }),
      100
    );
    for (let i = 0; i < 100; i++) {
      let x = Math.random() * 1000 - 500;
      let y = Math.random() * 1000 - 500;
      let z = Math.random() * 1000 - 500;

      let matrix = new THREE.Matrix4();
      let size = Math.random() * 50 - 8;
      matrix.makeScale(size, size, size);
      matrix.makeTranslation(x, y, z);
      instancedMesh.setMatrixAt(i, matrix);
    }
    gsap.to(instancedMesh.position, {
      duration: Math.random() * 10 + 2,
      z: -1000,
      ease: "linear",
      repeat: -1,
    });
    scene.add(instancedMesh);
  }
}
addStars();

//添加模型
function addModel() {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(craft1, (gltf) => {
    let mesh = gltf.scene;
    mesh.scale.set(0.02, 0.02, 0.02);
    mesh.position.x = 7;
    scene.add(gltf.scene);

    window.addEventListener("mousemove", (e) => {
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      let timeLine = gsap.timeline();
      timeLine.to(gltf.scene.rotation, {
        duration: 2,
        x: y / 2,
        y: x / 2,
      });
    });
  });
  gltfLoader.load(craft2, (gltf) => {
    let mesh = gltf.scene;
    mesh.scale.set(0.2, 0.2, 0.2);
    mesh.position.x = 7;
    mesh.position.y = -40;
    mesh.rotation.y = Math.PI / 2;
    scene.add(gltf.scene);

    window.addEventListener("mousemove", (e) => {
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      let timeLine = gsap.timeline();
      timeLine.to(gltf.scene.rotation, {
        duration: 2,
        x: y / 2,
        y: Math.PI / 2 + x / 2,
      });
    });
  });
  gltfLoader.load(craft3, (gltf) => {
    let mesh = gltf.scene;
    mesh.scale.set(0.005, 0.005, 0.005);
    mesh.position.x = 7;
    mesh.position.y = -80;
    scene.add(gltf.scene);

    window.addEventListener("mousemove", (e) => {
      let x = (e.clientX / window.innerWidth) * 2 - 1;
      let y = (e.clientY / window.innerHeight) * 2 - 1;

      let timeLine = gsap.timeline();
      timeLine.to(gltf.scene.rotation, {
        duration: 2,
        x: y / 2,
        y: x / 2,
      });
    });
  });
}
addModel();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let page = 0;
let timeLine = gsap.timeline();
let pages = ref();
onMounted(() => {
  const dom = document.getElementsByClassName("back-container")[0];
  dom.appendChild(renderer.domElement);

  window.addEventListener("mousewheel", (e: any) => {
    if (e.wheelDelta < 0) {
      page++;
      if (page > 2) {
        page = 2;
      }
    }
    if (e.wheelDelta > 0) {
      page--;
      if (page < 0) {
        page = 0;
      }
    }
    if (!timeLine.isActive()) {
      timeLine.to(camera.position, {
        duration: 1,
        y: page * -40,
      });
      gsap.to(pages.value, {
        duration: 1,
        y: -page * window.innerHeight,
      });
    }
  });
});
</script>
<style lang="scss">
.web-3d-container {
  .header {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    min-width: 800px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 50px;
    .logo {
      font-size: 30px;
      color: aqua;
    }
    .menu {
      display: flex;
      .title {
        margin-left: 40px;
        font-size: 24px;
        color: white;
      }
    }
  }
  .pages {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    .page {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100vw;
      height: 100vh;
      .content {
        margin-left: 100px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        h1 {
          font-size: 50px;
          color: white;
        }
        span {
          margin-top: 40px;
          font-size: 36px;
          color: #999;
        }
      }
    }
  }
}
</style>
