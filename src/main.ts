import "./style.css";
import "./plugins/davinci.css";
import { davinci_visual_hash } from "./plugins/davinci-visual-hash.ts";
import { davinci_visual_classic } from "./plugins/davinci-visual-classic.ts";
import { daVinci_free } from "./plugins/davinci-free.ts";
import { Dcharacter, davinci, Dshape } from "./plugins/davinci-engine.ts";

const test = new davinci("#app");

setTimeout(() => {
  let shape = new Dshape({
    type: "rect",
    path: { width: 200, height: 300 },
  });

  test.DcanvasCharacter.children.push(
    new Dcharacter(
      {
        x: 10,
        y: 10,
        width: 200,
        height: 300,
        fillColor: "red",
        shape: shape,
      },
      test
    )
  );

  let shape2 = new Dshape({
    type: "arc",
    path: { radius: 50 },
  });
  let testCycle = new Dcharacter(
    {
      x: 100,
      y: 40,
      width: 200,
      height: 300,
      fillColor: "black",
      shape: shape2,
      texture:
        "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
    },
    test
  );

  testCycle.addEventListener("mousedown", () => {
    console.log("ok");
  });
  testCycle.addEventListener("mouseup", () => {
    testCycle.x += 20;
  });

  test.DcanvasCharacter.children.push(testCycle);

  test.render();
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
