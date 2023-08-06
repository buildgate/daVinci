import "./style.css";
import "./davinci.css";
import { Dcharacter, Davinci, Dshape } from "../lib/davinci-engine.ts";
import {
  shapeMethodArc,
  shapeMethodRect,
  shapeMethodPolygon,
  colliderMethodArc,
  colliderMethodPolygon,
  colliderMethodRect,
} from "../lib/plugins/davinci-engine-plugins.ts";

const DM = new Davinci("#app");

let shape1 = new Dshape({
  type: "rect",
  path: { width: 200, height: 200 },
});

let rect = new Dcharacter(
  {
    x: 10,
    y: 10,
    width: 200,
    height: 200,
    fillColor: "red",
    shape: shape1,
    collider: shape1,
    texture:
      "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
    rotate: (45 * Math.PI) / 180,
    opacity: 1,
    shapePaintingMethod: shapeMethodRect,
    colliderPaintingMethod: colliderMethodRect,
    scaleX: 0.5,
    scaleY: 0.5,
  },
  DM
);

let mousedown = false;

rect.addEventListener("mousedown", () => {
  mousedown = true;
  console.log(12);
  arc.texture =
    "https://img1.baidu.com/it/u=2328766673,3584364392&fm=253&fmt=auto?w=130&h=170";
});

rect.addEventListener("mouseup", () => {
  console.log("mouseup");
  mousedown = false;
});

rect.addEventListener("mousemove", (e) => {
  if (mousedown) {
    rect.x += e.x - e.preX;
    rect.y += e.y - e.preY;
  }
});

DM.Dboard.addChild(rect);

let shape2 = new Dshape({
  type: "arc",
  path: { radius: 50 },
});
let arc = new Dcharacter(
  {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fillColor: "black",
    shape: shape2,
    collider: shape2,
    opacity: 0.5,
    shadow: {
      color: "black",
      blur: 10,
      offsetX: 10,
      offsetY: 20,
    },
    shapePaintingMethod: shapeMethodArc,
    colliderPaintingMethod: colliderMethodArc,
    // texture:
    //   "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
  },
  DM
);
arc.addEventListener("mouseup", () => {
  console.log("mouseup2");
});

arc.addEventListener("mousedown", () => {
  console.log("mousedown2");
});
arc.addEventListener("mousedown", function a() {
  console.log("mousedown22");
});
arc.removeEventListener("mousedown", "a");

arc.addEventListener("mousedown", () => {
  arc.x += 20;
});
arc.addEventListener("mouseenter", () => {
  console.log("mouseenter2");
});
arc.addEventListener("mouseleave", () => {
  console.log("mouseleave2");
});

const shape3 = new Dshape({
  type: "polygon",
  path: [
    [10, 10],
    [110, 110, 110, 10, 110, 110],
    [10, 110],
  ],
});

const tri = new Dcharacter(
  {
    x: 10,
    y: 10,
    width: 200,
    height: 300,
    fillColor: "green",
    shape: shape3,
    collider: shape3,
    shapePaintingMethod: shapeMethodPolygon,
    colliderPaintingMethod: colliderMethodPolygon,
    // rotate: (45 * Math.PI) / 180,
  },
  DM
);

tri.addEventListener("mousedown", () => {
  console.log("mousedown3");
});

rect.addChild(arc);

DM.Dboard.addChild(tri);

DM.collisionDetect = true;
DM.render();

setInterval(() => {
  tri.x += 0.5;
  arc.x += 0.5;
}, 50);

// setTimeout(() => {
//   //非引擎版本
//   // test.createRect({
//   //   positionX: 10,
//   //   positionY: 10,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "red",
//   //   zIndex: 1,
//   // });
//   // test.createRect({
//   //   positionX: 20,
//   //   positionY: 20,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "green",
//   //   zIndex: 2,
//   // });
//   // test.createRect({
//   //   positionX: 30,
//   //   positionY: 30,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "yellow",
//   //   zIndex: 3,
//   // });
//   // test.createRect({
//   //   positionX: 40,
//   //   positionY: 40,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "gray",
//   //   zIndex: 4,
//   // });
//   // test.createRect({
//   //   positionX: 50,
//   //   positionY: 50,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "blue",
//   //   zIndex: 5,
//   // });
//   // test.createRect({
//   //   positionX: 60,
//   //   positionY: 60,
//   //   width: 100,
//   //   height: 100,
//   //   fillColor: "purple",
//   //   zIndex: 6,
//   // });
//   // test.createRect({
//   //   positionX: 70,
//   //   positionY: 70,
//   //   width: 100,
//   //   height: 100,
//   //   image:
//   //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
//   //   zIndex: 7,
//   // });
//   // test.createArc({
//   //   positionX: 80,
//   //   positionY: 80,
//   //   radius: 50,
//   //   image:
//   //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
//   //   zIndex: 8,
//   // });
//   // test.createPolygon({
//   //   positionX: 80,
//   //   positionY: 80,
//   //   pathList: [
//   //     { x: 10, y: 10 },
//   //     { x: 110, y: 110 },
//   //     { x: 10, y: 110 },
//   //   ],
//   //   image:
//   //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
//   //   maxWidth: 100,
//   //   maxHeight: 100,
//   //   patternOffsetX: 0,
//   //   patternOffsetY: 0,
//   //   zIndex: 9,
//   // });
// }, 1000);
