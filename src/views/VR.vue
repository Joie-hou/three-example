<template>
  <div class="vr-container">
    <div ref="tooltipBox" class="tooltip-box" :style="tooltipPosition">
      <div class="container">
        <div class="title">标题：{{ tooltopContent?.title }}</div>
        <div class="explain">说明：{{ tooltopContent?.text }}</div>
      </div>
    </div>
    <p ref="titleBox" class="title-text" :style="titlePosition">
      {{ tooltopContent?.title }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Material, Object3D } from "three";
import gsap from "gsap";

import tip from "@/assets/imgs/tip.png";

import liveL from "@/assets/imgs/living/4_l.jpg";
import liveR from "@/assets/imgs/living/4_r.jpg";
import liveU from "@/assets/imgs/living/4_u.jpg";
import liveD from "@/assets/imgs/living/4_d.jpg";
import liveF from "@/assets/imgs/living/4_b.jpg";
import liveB from "@/assets/imgs/living/4_f.jpg";

import restL from "@/assets/imgs/restroom/7_l.jpg";
import restR from "@/assets/imgs/restroom/7_r.jpg";
import restU from "@/assets/imgs/restroom/7_u.jpg";
import restD from "@/assets/imgs/restroom/7_d.jpg";
import restF from "@/assets/imgs/restroom/7_f.jpg";
import restB from "@/assets/imgs/restroom/7_b.jpg";

import mainL from "@/assets/imgs/bedroom/20_l.jpg";
import mainR from "@/assets/imgs/bedroom/20_r.jpg";
import mainU from "@/assets/imgs/bedroom/20_u.jpg";
import mainD from "@/assets/imgs/bedroom/20_d.jpg";
import mainF from "@/assets/imgs/bedroom/20_f.jpg";
import mainB from "@/assets/imgs/bedroom/20_b.jpg";

import kit0L from "@/assets/imgs/kitchen/0_l.jpg";
import kit0R from "@/assets/imgs/kitchen/0_r.jpg";
import kit0U from "@/assets/imgs/kitchen/0_u.jpg";
import kit0D from "@/assets/imgs/kitchen/0_d.jpg";
import kit0F from "@/assets/imgs/kitchen/0_f.jpg";
import kit0B from "@/assets/imgs/kitchen/0_b.jpg";

import child19L from "@/assets/imgs/childroom/19_l.jpg";
import child19R from "@/assets/imgs/childroom/19_r.jpg";
import child19U from "@/assets/imgs/childroom/19_u.jpg";
import child19D from "@/assets/imgs/childroom/19_d.jpg";
import child19F from "@/assets/imgs/childroom/19_f.jpg";
import child19B from "@/assets/imgs/childroom/19_b.jpg";

import child11L from "@/assets/imgs/childroom/11_l.jpg";
import child11R from "@/assets/imgs/childroom/11_r.jpg";
import child11U from "@/assets/imgs/childroom/11_u.jpg";
import child11D from "@/assets/imgs/childroom/11_d.jpg";
import child11F from "@/assets/imgs/childroom/11_f.jpg";
import child11B from "@/assets/imgs/childroom/11_b.jpg";

import bedL from "@/assets/imgs/bedroom/23_l.jpg";
import bedR from "@/assets/imgs/bedroom/23_r.jpg";
import bedU from "@/assets/imgs/bedroom/23_u.jpg";
import bedD from "@/assets/imgs/bedroom/23_d.jpg";
import bedF from "@/assets/imgs/bedroom/23_f.jpg";
import bedB from "@/assets/imgs/bedroom/23_b.jpg";

import kitL from "@/assets/imgs/kitchen/2_l.jpg";
import kitR from "@/assets/imgs/kitchen/2_r.jpg";
import kitU from "@/assets/imgs/kitchen/2_u.jpg";
import kitD from "@/assets/imgs/kitchen/2_d.jpg";
import kitF from "@/assets/imgs/kitchen/2_f.jpg";
import kitB from "@/assets/imgs/kitchen/2_b.jpg";

import living from "@/assets/imgs/hdr/Living.hdr";
import { GUI } from "dat-gui";

const dataList = [
  //客厅 0
  {
    //顺序：左右上下前后
    imgList: [liveL, liveR, liveU, liveD, liveF, liveB],
    tipsList: [
      {
        position: { x: -4.9, y: 0, z: -4 },
        content: {
          title: "卫生间过道",
          text: "",
          image: 1,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -4.9, y: 0, z: -2 },
        content: {
          title: "主卧门口",
          text: "",
          image: 2,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 4.9, y: 0, z: -3 },
        content: {
          title: "厨房过道",
          text: "",
          image: 3,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -4.9, y: 0, z: -1.6 },
        content: {
          title: "次卧19",
          text: "",
          image: 4,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -4.9, y: 0, z: -1.3 },
        content: {
          title: "次卧11",
          text: "",
          image: 5,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //厕所过道 1
  {
    imgList: [restR, restL, restU, restD, restF, restB],
    tipsList: [
      {
        position: { x: 0.6, y: 0, z: 4.7 },
        content: {
          title: "客厅",
          text: "",
          image: 0,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 0, y: 0, z: -4.8 },
        content: {
          title: "主卧门口",
          text: "",
          image: 2,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -1.8, y: 0, z: -4.8 },
        content: {
          title: "次卧19",
          text: "",
          image: 4,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -3.7, y: 0, z: -4.8 },
        content: {
          title: "次卧11",
          text: "",
          image: 5,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //主卧门口 2
  {
    imgList: [mainR, mainL, mainU, mainD, mainF, mainB],
    tipsList: [
      {
        position: { x: 2.4, y: 0, z: 4.7 },
        content: {
          title: "客厅",
          text: "",
          image: 0,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 3, y: 0, z: 4.7 },
        content: {
          title: "厕所过道",
          text: "",
          image: 1,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 0.4, y: 0, z: 4.7 },
        content: {
          title: "次卧19",
          text: "",
          image: 4,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 1.1, y: 0, z: 4.5 },
        content: {
          title: "次卧11",
          text: "",
          image: 5,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: -2, y: 0, z: -3.9 },
        content: {
          title: "主卧",
          text: "",
          image: 6,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //厨房过道 3
  {
    imgList: [kit0R, kit0L, kit0U, kit0D, kit0F, kit0B],
    tipsList: [
      {
        position: { x: 1, y: 0, z: -4.6 },
        content: {
          title: "客厅",
          text: "",
          image: 0,
          showTip: false,
          showTitle: true,
        },
      },
      {
        position: { x: 4.5, y: 0, z: 1 },
        content: {
          title: "厨房",
          text: "",
          image: 7,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //次卧19 4
  {
    imgList: [child19R, child19L, child19U, child19D, child19F, child19B],
    tipsList: [
      {
        position: { x: 4.3, y: 0, z: 4.7 },
        content: {
          title: "厕所过道",
          text: "",
          image: 1,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //次卧11 5
  {
    imgList: [child11R, child11L, child11U, child11D, child11F, child11B],
    tipsList: [
      {
        position: { x: 2.1, y: 0, z: 4.7 },
        content: {
          title: "厕所过道",
          text: "",
          image: 1,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
  //主卧 6
  {
    imgList: [bedR, bedL, bedU, bedD, bedF, bedB],
    tipsList: [
      {
        position: { x: 4.7, y: 0, z: 0 },
        content: {
          title: "主卧门口",
          image: 2,
          //text: "",
          //showTip: false,
          //showTitle: true,
        },
      },
    ],
  },
  //厨房 7
  {
    imgList: [kitR, kitL, kitU, kitD, kitF, kitB],
    tipsList: [
      {
        position: { x: -4.5, y: 0, z: -1 },
        content: {
          title: "厨房过道",
          text: "",
          image: 3,
          showTip: false,
          showTitle: true,
        },
      },
    ],
  },
];

class TipType extends THREE.Sprite {
  content?: {
    title: string;
    text: string;
    image: number;
    showTip: boolean;
    showTitle: boolean;
  };
}
let tipsSpriteList: TipType[] = [];

//场景
const scene = new THREE.Scene();

//scene.add(new THREE.AxesHelper());

//相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 2);
//camera.lookAt(0, 0, 0);

//渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

//渲染函数
const animation = () => {
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animation);
};
animation();

//监听页面宽高变化
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//立方体
const geometry = new THREE.BoxGeometry(10, 10, 10);
let boxMaterials: Material[] = [];
let cube: THREE.Mesh;

//添加标签
const addTipsSprite = (index = 0) => {
  let tipTexture = new THREE.TextureLoader().load(tip);
  let material = new THREE.SpriteMaterial({ map: tipTexture, transparent: true, depthTest: true });
  tipsSpriteList = [];
  dataList[index].tipsList.forEach((item) => {
    let sprite: TipType = new THREE.Sprite(material);
    sprite.scale.set(0.3, 0.3, 0.3);
    sprite.position.set(item.position.x, item.position.y, item.position.z);
    sprite.content = item.content;
    tipsSpriteList.push(sprite);
    scene.add(sprite);
  });
};

const gui = new GUI();
//let tipTexture = new THREE.TextureLoader().load(tip);
//let material = new THREE.SpriteMaterial({ map: tipTexture });
//let sprite: TipType = new THREE.Sprite(material);
//sprite.scale.set(0.3, 0.3, 0.3);
//sprite.position.set(1, 1, 1);
//tipsSpriteList.push(sprite);
//scene.add(sprite);
//gui.add(sprite.position, "x").min(-10).max(10).step(0.1);
//gui.add(sprite.position, "y").min(-10).max(10).step(0.1);
//gui.add(sprite.position, "z").min(-10).max(10).step(0.1);

//初始化场景
const initContent = (index = 0) => {
  dataList[index].imgList.forEach((item, index) => {
    let texture = new THREE.TextureLoader().load(item);
    if (index === 2 || index === 3) {
      texture.rotation = Math.PI;
      texture.center = new THREE.Vector2(0.5, 0.5);
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    } else {
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    }
  });

  cube = new THREE.Mesh(geometry, boxMaterials);
  //翻转
  cube.geometry.scale(1, 1, -1);
  console.log(cube);

  scene.add(cube);
  addTipsSprite();
};
initContent();

const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
const rgbLoader = new RGBELoader();
rgbLoader.load(living, (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(ballGeometry, material);
  sphere.geometry.scale(1, 1, -1);
  //scene.add(sphere);
});

//controls.maxAzimuthAngle = Math.PI;
//controls.minAzimuthAngle = 0;
//controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 5;
controls.minDistance = 1;
controls.enablePan = false;

const tooltopContent = ref<
  | {
      title: string;
      text: string;
      image: number;
      showTip: boolean;
      showTitle: boolean;
    }
  | undefined
>({
  title: "",
  text: "",
  image: 0,
  showTip: false,
  showTitle: false,
});
const titleBox = ref();
const titlePosition = ref();
const tooltipBox = ref();
const tooltipPosition = ref();

//切换场景
const changeContentAndtips = (index: number) => {
  scene.children = scene.children.filter((item) => String(item.type) !== "Sprite");
  tipsSpriteList = [];
  boxMaterials = [];
  dataList[index].imgList.forEach((item, index) => {
    let texture = new THREE.TextureLoader().load(item);
    if (item === liveU || item === liveD) {
      texture.rotation = Math.PI;
      texture.center = new THREE.Vector2(0.5, 0.5);
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 }));
    } else {
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 }));
    }
  });
  cube.material = boxMaterials;
  //scene.add(cube);
  console.log(cube);

  gsap.to(cube.material, {
    transparent: false,
    opacity: 1,
    duration: 2,
    onUpdate: () => {
      camera.updateProjectionMatrix();
    },
  });
  addTipsSprite(index);
};

//鼠标点击
const onMouseClick = (e: { preventDefault: () => void; clientX: number; clientY: number }) => {
  e.preventDefault();
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(tipsSpriteList, true);
  console.log(intersects);

  let obj = intersects[0].object as TipType;
  if (intersects.length > 0 && obj.content?.showTitle) {
    changeContentAndtips(obj.content?.image);
    handleTooltipHide();
  }
};
window.addEventListener("click", onMouseClick);

//鼠标移动
const onMousemove = (e: { preventDefault: () => void; clientX: number; clientY: number }) => {
  e.preventDefault();
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(tipsSpriteList, true);

  if (intersects.length > 0) {
    let elementWidth = window.innerWidth / 2;
    let elementHeight = window.innerHeight / 2;
    let worldVector = new THREE.Vector3(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z
    );
    let position = worldVector.project(camera);
    let obj = intersects[0].object as TipType;
    tooltopContent.value = obj.content;

    if (obj.content?.showTip) {
      let left = Math.round(elementWidth * position.x + elementWidth - tooltipBox.value.clientWidth / 2);
      let top = Math.round(-elementHeight * position.y + elementHeight - tooltipBox.value.clientHeight / 2);
      tooltipPosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
    } else if (obj.content?.showTitle) {
      let left = Math.round(elementWidth * position.x + elementWidth - titleBox.value.clientWidth / 2);
      let top = Math.round(-elementHeight * position.y + elementHeight);
      titlePosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      };
    }
  } else {
    handleTooltipHide();
  }
};
//清除样式
const handleTooltipHide = () => {
  tooltipPosition.value = {
    top: "-100%",
    left: "-100%",
  };
  titlePosition.value = {
    top: "-100%",
    left: "-100%",
  };
  tooltopContent.value = undefined;
};

window.addEventListener("mousemove", onMousemove);

onMounted(() => {
  const dom = document.getElementsByClassName("vr-container")[0];
  dom.appendChild(renderer.domElement);
  tooltipBox.value.addEventListener("mouseleave", handleTooltipHide());
});
</script>
<style lang="scss">
.vr-container {
  width: 100%;
  height: 100%;
  background-color: antiquewhite;
  .title-text {
    position: absolute;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .tooltip-box {
    position: absolute;
    padding: 0px 0px 40px 0px;
    line-height: 30px;
    border-radius: 4px;
    color: #ffffff;
    z-index: 100;
    cursor: pointer;
    .container {
      position: relative;
      width: 240px;
      max-height: 200px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.6);
      // &::before {
      //   content: "";
      //   position: absolute;
      //   bottom: -16px;
      //   left: 20%;
      //   border-top: 16px solid rgba(0, 0, 0, 0.8);
      //   border-left: 10px solid transparent;
      //   border-right: 10px solid transparent;
      // }
      .title {
        width: 100%;
        padding: 6px 0;
      }
      .explain {
        width: 100%;
        max-height: 100px;
        font-size: 14px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-track {
          background: #353535;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          background: #cdcdcd;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background: #9c9c9c;
        }
        &::-webkit-scrollbar-corner {
          background: #f6f6f6;
        }
      }
    }
  }
}
</style>
