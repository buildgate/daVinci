import "./style.css";
import "./plugins/davinci.css";
import { davinci_visual_hash } from "./plugins/davinci-visual-hash.ts";
import { davinci_visual_classic } from "./plugins/davinci-visual-classic.ts";
import { daVinci_free } from "./plugins/davinci-free.ts";

const test = new davinci_visual_classic("#app");

setTimeout(() => {
  test.createRect(20, 10, 100, 100, "red", 1);
  test.createRect(80, 10, 100, 100, "green", 2);
  test.createRect(80, 10, 100, 100, "blue", 3);
  test.createRect(80, 10, 100, 100, "yellow", 4);
  test.createRect(80, 10, 100, 100, "gray", 5);
  test.createRect(80, 10, 100, 100, "purple", 9);
  test.createRect(80, 10, 100, 100, "black", 7);
  test.createRect(80, 10, 100, 100, "brown");
}, 1000);
