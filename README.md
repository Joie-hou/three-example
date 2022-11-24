# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).


# THREE.js
### 初始化
1. 首先先创建 相机camera，渲染器render
2. 创建控制器controls *控制器是需要单独导入的* 用来控制 camera，render， **所有的渲染器和相机都应该添加**
3. 创建场景 scene
4. 创建物体、灯光、模型等等
   1. 创建几何体
   2. 创建纹理
   3. 将几何体和纹理添加到网格中 mesh
   4. 场景中添加物体 scene.add(xxx)
5. 渲染函数 用来更新 场景和相机  `renderer.render(scene, camera);`
6. 将渲染器`render`添加到dom元素中, **所有的渲染器都应该添加**
   1. eg：`document.body.appendChild(render.domElement)`