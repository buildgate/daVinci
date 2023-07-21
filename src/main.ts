import "./style.css";
import "./plugins/davinci.css";
import { daVinci } from "./plugins/davinci.ts";

const test = new daVinci("#app", { lineColor: "red", lineWidth: 10 });
