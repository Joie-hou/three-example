<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import zhCn from "element-plus/lib/locale/lang/zh-cn";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<style lang="scss">
html,
body {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: white;
}

#app {
  width: 100%;
  height: 100%;
}

div {
  box-sizing: border-box;
}
</style>
