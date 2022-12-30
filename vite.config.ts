import { defineConfig, searchForWorkspaceRoot } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { VantResolver } from "unplugin-vue-components/resolvers";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.obj", "**/*.hdr"],
  server: {
    //port: 3000,
    fs: {
      allow: [
        // 搜索工作区的根目录
        searchForWorkspaceRoot(process.cwd()),
        // 自定义规则
        "src/assets/draco/",
      ],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          "vant/es/utils": ["isIOS"],
        },
      ],
      dirs: ["src/composables"],
      eslintrc: {
        enabled: true,
      },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: false,
      resolvers: [VantResolver(), ElementPlusResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
