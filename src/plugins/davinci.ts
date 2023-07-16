//
export class daVinci {
  Dcanvas = document.createElement("canvas");
  DToolbar = document.createElement("div");
  Dcontainer = document.createElement("div");
  DcoordinateTip = document.createElement("div");
  ctx = this.Dcanvas.getContext("2d");
  originElement: Element | null = null;
  painting = false;
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  resizeWatcher: ResizeObserver;

  constructor(fundElement: string) {
    let self = this;

    this.originElement = document.querySelector(fundElement);
    this.DcoordinateTip.className = "davinci_coordinateTip";
    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";
    this.DToolbar.className = "davinci_toolbar";

    //保证画布填满容器
    this.resizeWatcher = new ResizeObserver(() => {
      self.Dcanvas.width = (<HTMLDivElement>self.originElement).offsetWidth;
      self.Dcanvas.height = (<HTMLDivElement>self.originElement).offsetHeight;
    });
    this.resizeWatcher.observe(<HTMLDivElement>self.originElement);

    //鼠标监听
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {
        self.DcoordinateTip.innerText = `${e.offsetX},${e.offsetY}`;
        self.draw(
          { x: self.preX, y: self.preY },
          { x: e.offsetX, y: e.offsetY }
        );
      })
    );

    this.Dcanvas.addEventListener("mousedown", function (e: MouseEvent) {
      self.painting = true;
      self.preX = e.offsetX;
      self.preY = e.offsetY;
    });

    this.Dcanvas.addEventListener("mouseup", function () {
      self.painting = false;
    });

    //基础元素载入
    this.Dcontainer.append(this.DcoordinateTip);
    this.Dcontainer.append(this.Dcanvas);
    this.Dcontainer.append(this.DToolbar);
    this.originElement?.append(this.Dcontainer);
  }

  //节流
  throttle(fn: (...rest: any) => any) {
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

  //绘画开始
  draw(start: _type_coordinate, end: _type_coordinate) {
    if (!this.painting) {
      return;
    }
    (<CanvasRenderingContext2D>this.ctx).beginPath();
    (<CanvasRenderingContext2D>this.ctx).moveTo(start.x, start.y);
    (<CanvasRenderingContext2D>this.ctx).lineTo(end.x, end.y);
    (<CanvasRenderingContext2D>this.ctx).stroke();
    this.preX = end.x;
    this.preY = end.y;
  }
}
