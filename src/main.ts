import "./style.css";
import "./plugins/davinci.css";
import { davinci_visual_hash } from "./plugins/davinci-visual-hash.ts";
import { davinci_visual_classic } from "./plugins/davinci-visual-classic.ts";
import { daVinci_free } from "./plugins/davinci-free.ts";

const test = new davinci_visual_classic("#app");

setTimeout(() => {
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "red",
    zIndex: 1,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "green",
    zIndex: 2,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "yellow",
    zIndex: 3,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "gray",
    zIndex: 4,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "blue",
    zIndex: 5,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "purple",
    zIndex: 6,
  });
  test.createRect({
    positionX: 20,
    positionY: 10,
    width: 100,
    height: 100,
    fillColor: "black",
    zIndex: 7,
  });
  test.createArc({
    positionX: 20,
    positionY: 10,
    radius: 20,
    fillColor: "brown",
    zIndex: 8,
  });
}, 1000);
