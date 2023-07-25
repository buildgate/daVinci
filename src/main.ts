import "./style.css";
import "./plugins/davinci.css";
import { davinci_visual } from "./plugins/davinci-visual.ts";
import { daVinci_free } from "./plugins/davinci-free.ts";

const test = new davinci_visual("#app");

setTimeout(() => {
  test.createRect(20, 10, 100, 100, "red");
  test.createRect(80, 10, 100, 100, "green");
  test.createRect(80, 10, 100, 100, "blue");
  test.createRect(80, 10, 100, 100, "yellow");
  test.createRect(80, 10, 100, 100, "gray");
  test.createRect(80, 10, 100, 100, "purple");
  test.createRect(80, 10, 100, 100, "black");
  test.createRect(80, 10, 100, 100, "brown");
}, 1000);
