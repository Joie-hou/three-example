<template>
  <div class="ocean-index-container" :style="{ backgroundImage: `url(${oceanImg})` }">
    <div id="main-container" class="main-container">
      <h1>粒子海洋</h1>
    </div>
    <ParticleOceanVue></ParticleOceanVue>
  </div>
</template>
<script lang="ts" setup>
import oceanImg from "@/assets/ocean/ocean.png";
import ParticleOceanVue from "./ParticleOcean.vue";
</script>
<style lang="scss">
.ocean-index-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
  .main-container {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 50px;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
      color: rgb(95, 211, 211);
    }
  }
}
</style>
