import "./style.css";
import "./plugins/davinci.css";
import { davinci_visual_hash } from "./plugins/davinci-visual-hash.ts";
import { davinci_visual_classic } from "./plugins/davinci-visual-classic.ts";
import { daVinci_free } from "./plugins/davinci-free.ts";
import { Dcharacter, Davinci, Dshape } from "./plugins/davinci-engine.ts";

const test = new Davinci("#app");

setTimeout(() => {
  let shape = new Dshape({
    type: "rect",
    path: { width: 200, height: 300 },
  });

  let testRect = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 200,
      height: 300,
      fillColor: "red",
      shape: shape,
      collider: shape,
    },
    test
  );

  test.DcanvasCharacter.addChild(testRect);

  let shape2 = new Dshape({
    type: "arc",
    path: { radius: 50 },
  });
  let testCycle = new Dcharacter(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fillColor: "black",
      shape: shape2,
      collider: shape2,
      shadow: {
        color: "black",
        blur: 10,
        offsetX: 10,
        offsetY: 20,
      },
      texture:
        "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
    },
    test
  );

  let mousedown = false;

  testRect.addEventListener("mousedown", () => {
    mousedown = true;
    testCycle.texture =
      "https://img1.baidu.com/it/u=2328766673,3584364392&fm=253&fmt=auto?w=130&h=170";
  });

  testRect.addEventListener("mouseup", () => {
    console.log("mouseup");
    mousedown = false;
  });

  testRect.addEventListener("mousemove", (e) => {
    if (mousedown) {
      testRect.x += e.x - e.preX;
      testRect.y += e.y - e.preY;
    }
  });

  testCycle.addEventListener("mouseup", () => {
    console.log("mouseup2");
  });

  testCycle.addEventListener("mousedown", (e) => {
    console.log("mousedown");
  });
  testCycle.addEventListener("mousedown", function a(e) {
    console.log("mousedown1");
  });
  testCycle.removeEventListener("mousedown", "a");

  testCycle.addEventListener("mousedown", () => {
    testCycle.x += 20;
  });
  testCycle.addEventListener("mouseenter", () => {
    console.log("mouseenter2");
  });
  testCycle.addEventListener("mouseleave", () => {
    console.log("mouseleave2");
  });

  const shape3 = new Dshape({
    type: "polygon",
    path: {
      pointList: [
        { x: 10, y: 10 },
        { x: 110, y: 110 },
        { x: 10, y: 110 },
      ],
    },
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
    },
    test
  );

  testRect.addChild(testCycle);

  test.DcanvasCharacter.addChild(tri);

  test.collisionDetect = true;
  test.render();

  setInterval(() => {
    tri.x += 0.5;
  }, 20);

  //非引擎版本
  // test.createRect({
  //   positionX: 10,
  //   positionY: 10,
  //   width: 100,
  //   height: 100,
  //   fillColor: "red",
  //   zIndex: 1,
  // });
  // test.createRect({
  //   positionX: 20,
  //   positionY: 20,
  //   width: 100,
  //   height: 100,
  //   fillColor: "green",
  //   zIndex: 2,
  // });
  // test.createRect({
  //   positionX: 30,
  //   positionY: 30,
  //   width: 100,
  //   height: 100,
  //   fillColor: "yellow",
  //   zIndex: 3,
  // });
  // test.createRect({
  //   positionX: 40,
  //   positionY: 40,
  //   width: 100,
  //   height: 100,
  //   fillColor: "gray",
  //   zIndex: 4,
  // });
  // test.createRect({
  //   positionX: 50,
  //   positionY: 50,
  //   width: 100,
  //   height: 100,
  //   fillColor: "blue",
  //   zIndex: 5,
  // });
  // test.createRect({
  //   positionX: 60,
  //   positionY: 60,
  //   width: 100,
  //   height: 100,
  //   fillColor: "purple",
  //   zIndex: 6,
  // });
  // test.createRect({
  //   positionX: 70,
  //   positionY: 70,
  //   width: 100,
  //   height: 100,
  //   image:
  //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
  //   zIndex: 7,
  // });
  // test.createArc({
  //   positionX: 80,
  //   positionY: 80,
  //   radius: 50,
  //   image:
  //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
  //   zIndex: 8,
  // });
  // test.createPolygon({
  //   positionX: 80,
  //   positionY: 80,
  //   pathList: [
  //     { x: 10, y: 10 },
  //     { x: 110, y: 110 },
  //     { x: 10, y: 110 },
  //   ],
  //   image:
  //     "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
  //   maxWidth: 100,
  //   maxHeight: 100,
  //   patternOffsetX: 0,
  //   patternOffsetY: 0,
  //   zIndex: 9,
  // });
}, 1000);
