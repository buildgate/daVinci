//视觉层

let davinci = document.createElement("canvas");
let DToolbar = document.createElement("div");
let container = document.createElement("div");
let coordinateTip = document.createElement("div");
let ctx = davinci.getContext("2d");
let originElement = document.querySelector("#app");
let isMousedown = false;
let x = 0,
  y = 0;
let preX = 0,
  preY = 0;

//requestAnimationFrame节流
function throttle(fn: (...rest: any) => any) {
  let block = false;
  return function (this: object) {
    let self = this;
    let args = arguments;
    if (!block) {
      block = true;
      window.requestAnimationFrame(() => {
        block = false;
        fn.apply(self, args as any);
      });
    }
  };
}

coordinateTip.className = "davinci_coordinateTip";
container.className = "davinci_container";
davinci.className = "davinci_body";
DToolbar.className = "davinci_toolbar";

let resizeWatcher = new ResizeObserver(() => {
  davinci.width = (<HTMLDivElement>originElement).offsetWidth;
  davinci.height = (<HTMLDivElement>originElement).offsetHeight;
});
resizeWatcher.observe(<HTMLDivElement>originElement);

container.append(coordinateTip);
container.append(davinci);
container.append(DToolbar);
originElement?.append(container);

function draw(start: _type_coordinate, end: _type_coordinate) {
  if (!isMousedown) {
    return;
  }
  (<CanvasRenderingContext2D>ctx).beginPath();
  (<CanvasRenderingContext2D>ctx).moveTo(start.x, start.y);
  (<CanvasRenderingContext2D>ctx).lineTo(end.x, end.y);
  (<CanvasRenderingContext2D>ctx).stroke();
  preX = end.x;
  preY = end.y;
}

davinci.addEventListener(
  "mousemove",
  throttle((e: MouseEvent) => {
    coordinateTip.innerText = `${e.offsetX},${e.offsetY}`;
    draw({ x: preX, y: preY }, { x: e.offsetX, y: e.offsetY });
  })
);

davinci.addEventListener("mousedown", function (e: MouseEvent) {
  isMousedown = true;
  preX = e.offsetX;
  preY = e.offsetY;
});

davinci.addEventListener("mouseup", function () {
  isMousedown = false;
});

class daVinci {
  Dcanvas = document.createElement("canvas");
  DToolbar = document.createElement("div");
  Dcontainer = document.createElement("div");
  DcoordinateTip = document.createElement("div");
  ctx = davinci.getContext("2d");
  originElement = document.querySelector("#app");
  isMousedown = false;
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  constructor(fundElement: string) {}
}
