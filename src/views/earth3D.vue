<template>
  <div class="earth-container">
    <div class="earth-3D-container"></div>
    <div v-if="progress != 100" class="loading" :style="{ backgroundImage: loadingBack }"></div>
    <div v-if="progress != 100" class="progress">
      <img :src="loading" alt="" />
      <span>地球加载中：{{ progress }}%</span>
    </div>
    <div class="title">酷炫3D地球</div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import stars from "@/assets/images/stars.png";
import earthOut from "@/assets/images/earth.jpg";
import earth from "@/assets/images/map.jpg";
import glow from "@/assets/images/glow.png";
import innerGlow from "@/assets/images/innerGlow.png";
import lightColumn from "@/assets/images/light_column.png";
import label from "@/assets/images/label.png";
import labelOld from "@/assets/images/label-old.png";
import moon from "@/assets/images/moon.jpg";
import moonRing from "@/assets/images/moon_ring.png";
import fly from "@/assets/images/aircraft.png";
import FlyPlane from "@/assets/images/cartoon_plane.glb";

import loading from "@/assets/images/loading.gif";
import loadingBack from "@/assets/images/loading.jpg";
import gsap from "gsap";

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls;
let eathOut: THREE.Mesh;

let curve: THREE.CubicBezierCurve3;

let mixer: THREE.AnimationMixer;
let animationAction: THREE.AnimationAction;

let progressInit = 0;
let velocity = 0.005;
let planeModel: THREE.Group | THREE.Object3D<THREE.Event>;

const clock = new THREE.Clock();
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 0, 1200);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);
}

init();

//添加灯光
function addLight() {
  const amLight = new THREE.AmbientLight(0xffffff);
  const diLight = new THREE.DirectionalLight(0xffffff);
  diLight.position.set(0, 0, 500);
  scene.add(amLight);
  scene.add(diLight);
}
addLight();

//创建星空背景
function starBack() {
  scene.background = new THREE.Color(0x030311);

  //  星空点
  const vertices = [];
  for (let i = 0; i < 1000; i++) {
    const vertex = new THREE.Vector3();
    vertex.x = 3000 * Math.random() - 1000;
    vertex.y = 3000 * Math.random() - 1000;
    vertex.z = 3000 * Math.random() - 1000;
    vertices.push(vertex.x, vertex.y, vertex.z);
  }

  let starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));

  const starsTexture = new THREE.TextureLoader().load(stars);
  const starsMaterial = new THREE.PointsMaterial({
    color: 0x4d76cf,
    size: 2,
    sizeAttenuation: true, // 尺寸衰减
    map: starsTexture,
    //depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
  });

  const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starsMesh);
}
starBack();

//创建地球
function addEarth() {
  let earthGeometry = new THREE.SphereGeometry(300, 32, 32);
  let earthTexture = new THREE.TextureLoader().load(earth);
  let earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    //alphaMap: earthTexture,
    transparent: true,
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  //  发光球体
  let earthOutGeometry = new THREE.SphereGeometry(301, 32, 32);
  let earthOutTexture = new THREE.TextureLoader().load(earthOut);
  let earthOutMaterial = new THREE.MeshBasicMaterial({
    map: earthOutTexture,
    alphaMap: earthOutTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  eathOut = new THREE.Mesh(earthOutGeometry, earthOutMaterial);
  scene.add(eathOut);
  let time = {
    value: 0,
  };
  gsap.to(time, {
    value: 1,
    duration: 20,
    repeat: -1,
    ease: "linear",
    onUpdate: () => {
      //earthMesh.rotation.y = time.value * Math.PI * 2;
      //eathOut.rotation.y = time.value * Math.PI * 2;
    },
  });

  // 添加地球内外发光精灵
  let spriteTexture = new THREE.TextureLoader().load(glow);
  let spriteMaterial = new THREE.SpriteMaterial({
    map: spriteTexture,
    color: 0x4d76cf,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  let sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(930, 930, 0);
  scene.add(sprite);

  //  内发光
  let spriteTexture2 = new THREE.TextureLoader().load(innerGlow);
  let spriteMaterial2 = new THREE.SpriteMaterial({
    map: spriteTexture2,
    alphaMap: spriteTexture2,
    color: 0x4d76cf,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  let sprite2 = new THREE.Sprite(spriteMaterial2);
  sprite2.scale.set(768, 768, 0);
  scene.add(sprite2);
}
addEarth();

//地球表面光效
function photoefficiency() {
  let lineList = [];
  for (let i = 0; i < 50; i++) {
    let lightColumnGeometry = new THREE.PlaneGeometry(30, 70);
    let lightColumnTexture = new THREE.TextureLoader().load(lightColumn);
    let lightColumnMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: lightColumnTexture,
      alphaMap: lightColumnTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    let lightColumnMesh = new THREE.Mesh(lightColumnGeometry, lightColumnMaterial);
    let lightColumnMesh2 = lightColumnMesh.clone();
    lightColumnMesh2.rotation.y = Math.PI / 2;
    lightColumnMesh.add(lightColumnMesh2);

    let lat = Math.random() * 180 - 90;
    let lon = Math.random() * 360 - 180;
    let position = loaTo3D(301, lon, lat);
    if (lineList.length < 2) {
      lineList.push(new THREE.Vector3(position.x, position.y, position.z));
    }
    lightColumnMesh.position.set(position.x, position.y, position.z);
    //将物体的朝向改为朝向世界原点
    lightColumnMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize());

    //添加水波纹扩散
    let circlePlane = new THREE.PlaneGeometry(25, 25);
    let circleTexture = new THREE.TextureLoader().load(labelOld);
    let circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    let circleMesh = new THREE.Mesh(circlePlane, circleMaterial);
    circleMesh.rotation.x = -Math.PI / 2;
    //circleMesh.position.set(0, -9, 0);

    gsap.to(circleMesh.scale, {
      duration: 1 + Math.random() * 0.5,
      x: 2,
      y: 2,
      z: 2,
      repeat: -1,
      delay: Math.random() * 0.5,
      yoyo: true,
      ease: "power2.inOut",
    });

    lightColumnMesh.add(circleMesh);

    eathOut.add(lightColumnMesh);
  }
  drawLine(lineList);
}
photoefficiency();

//经纬度转3d坐标
function loaTo3D(R: number, longitude: number, latitude: number) {
  //360°=2π弧度
  //1°=π/180弧度
  let lon = longitude * (Math.PI / 180); // 转弧度值
  let lat = latitude * (Math.PI / 180); // 转弧度值
  lon = -lon; // js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  //固定公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  // 返回球面坐标
  return new THREE.Vector3(x, y, z);
}

//获取两点的中点
function getVCenter(v1: THREE.Vector3, v2: THREE.Vector3) {
  let v = v1.add(v2);
  return v.divideScalar(2);
}
//获取两点间指定比例位置坐标
//.distanceTo ( v : Vector3 ) 计算该向量到所传入的v间的距离。
function getLenVcetor(v1: THREE.Vector3, v2: THREE.Vector3, len: number) {
  let v1v2Len = v1.distanceTo(v2);
  return v1.lerp(v2, len / v1v2Len);
}
//获取贝塞尔控制点，（控制点位置大小需与夹角线性相关）
//.at ( t : Float, target : Vector3 ) : Vector3
//t - 使用这一传入的距离，在Ray上确定一个位置。
//target — 结果将复制到这一Vector3中。
function getBezierPoint(v0: THREE.Vector3, v3: THREE.Vector3) {
  //  .angleTo ( v : Vector3 ) : Float
  //以弧度返回该向量与向量v之间的角度。
  let angle = (v0.angleTo(v3) * 180) / Math.PI; // 0 ~ Math.PI       // 计算向量夹角弧度
  let aLen = angle * 2.5,
    hLen = angle * angle * 50;
  let p0 = new THREE.Vector3(0, 0, 0); // 法线向量
  let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone())); // 顶点坐标
  let vtop = rayLine.at(hLen / rayLine.at(1, new THREE.Vector3()).distanceTo(p0), new THREE.Vector3()); // 几倍位置

  // 控制点坐标
  let v1 = getLenVcetor(v0.clone(), vtop, aLen);
  let v2 = getLenVcetor(v3.clone(), vtop, aLen);
  return {
    v1: v1,
    v2: v2,
  };
}
//绘制三次贝塞尔曲线
function drawLine(lineList: THREE.Vector3[]) {
  let geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
  let v0 = lineList[0];
  let v3 = lineList[1];
  let { v1, v2 } = getBezierPoint(v0, v3); // 三维二次贝赛尔曲线
  curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
  let curvePoints = curve.getPoints(100);
  geometry.setFromPoints(curvePoints);
  let material = new THREE.LineBasicMaterial({ color: 0xff7e41 });
  let line = new THREE.Line(geometry, material);
  eathOut.add(line);
  sport(curvePoints, 0);
}

//创建飞机
function addFly(position: THREE.Vector3, name: string) {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(FlyPlane, (gltf) => {
    console.log(gltf);

    planeModel = gltf.scene;
    planeModel.position.set(position.x, position.y, position.z);
    planeModel.scale.set(20, 20, 20);
    scene.add(planeModel);

    mixer = new THREE.AnimationMixer(planeModel);
    animationAction = mixer.clipAction(gltf.animations[0]);
    animationAction.play();
  });
}

// 绘制运动点的路径
function sport(curvePoints: THREE.Vector3[], index: number) {
  const Fall = addFly(curvePoints[0], `Fall${index}`);
}

// 插入帧动画
function inputAnimate() {
  if (curve == null || planeModel == null) {
    console.log("Loading");
  } else {
    if (progressInit <= 1 - velocity) {
      const point = curve.getPointAt(progressInit); //获取样条曲线指定点坐标
      const pointBox = curve.getPointAt(progressInit + velocity); //获取样条曲线指定点坐标

      if (point && pointBox) {
        planeModel.position.set(point.x, point.y, point.z);
        // model.lookAt(pointBox.x, pointBox.y, pointBox.z); //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。

        let targetPos = pointBox; //目标位置点
        let offsetAngle = 0; //目标移动时的朝向偏移

        // //以下代码在多段路径时可重复执行
        let mtx = new THREE.Matrix4(); //创建一个4维矩阵
        // .lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) : this,构造一个旋转矩阵，从eye 指向 target，由向量 up 定向。
        mtx.lookAt(targetPos, planeModel.position, planeModel.up); //设置朝向
        mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)));
        let toRot = new THREE.Quaternion().setFromRotationMatrix(mtx); //计算出需要进行旋转的四元数值
        planeModel.quaternion.slerp(toRot, 1);
      }

      progressInit += velocity;
    } else {
      progressInit = 0;
    }
  }
}

//创建月球
function addMoon() {
  let moonGeometry = new THREE.SphereGeometry(50, 32, 32);
  let moonTexture = new THREE.TextureLoader().load(moon);
  let moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
    //alphaMap: moonTexture,
    transparent: true,
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(-900, 0, 0);
  scene.add(moonMesh);

  //  月球环
  let moonRingGeometry = new THREE.RingGeometry(880, 900, 64);
  let moonRingTexture = new THREE.TextureLoader().load(moonRing);
  let moonRingMaterial = new THREE.MeshBasicMaterial({
    map: moonRingTexture,
    alphaMap: moonRingTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  let moonRingMesh = new THREE.Mesh(moonRingGeometry, moonRingMaterial);
  moonRingMesh.rotation.x = Math.PI / 2;
  scene.add(moonRingMesh);

  let time = {
    value: 0,
  };
  gsap.to(time, {
    value: 1,
    duration: 10,
    repeat: -1,
    ease: "linear",
    onUpdate: () => {
      moonMesh.position.x = 900 * Math.cos(time.value * Math.PI * 2);
      moonMesh.position.z = 900 * Math.sin(time.value * Math.PI * 2);
      moonMesh.rotation.y = time.value * Math.PI * 8;
    },
  });
}
addMoon();

//默认加载器
const progress = ref(0);
THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  //console.log(item, loaded, total);
  progress.value = Number(((loaded / total) * 100).toFixed(2));
};

function animate() {
  if (mixer) {
    let mixerUpdateDelta = clock.getDelta();
    mixer.update(mixerUpdateDelta);
  }
  inputAnimate();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

onMounted(() => {
  const dom = document.getElementsByClassName("earth-3D-container")[0];
  dom.appendChild(renderer.domElement);
});
</script>

<style lang="scss">
.earth-container {
  width: 100%;
  height: 100%;
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    filter: blur(50px);
    z-index: 100;
  }
  .progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 1920px;
    height: 1080px;
    z-index: 101;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #fff;
  }
  .progress {
    img {
      padding: 0 15px;
    }
  }

  .title {
    width: 380px;
    height: 40px;
    position: fixed;
    right: 100px;
    top: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    line-height: 40px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    z-index: 110;
  }
}
</style>
