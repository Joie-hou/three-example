<template>
  <div class="index-container">
    <!--<el-button type="success">1</el-button>-->
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";

//初始化场景
const scene = new THREE.Scene();

//初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

//设置相机位置
camera.position.set(50, 50, 10);

//初始化渲染器
const renderer = new THREE.WebGL1Renderer({
  //设置抗锯齿
  antialias: true,
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

function render() {
  //渲染场景
  renderer.render(scene, camera);
  //引擎自动更新渲染器
  requestAnimationFrame(render);
}
render();

onMounted(() => {
  const dom = document.getElementsByClassName("index-container");
  dom[0].appendChild(renderer.domElement);
});
</script>

<style lang="scss">
.index-container {
}
</style>
