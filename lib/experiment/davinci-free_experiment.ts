//
export class daVinci_free {
  //基础变量
  Dcanvas = document.createElement("canvas");
  Dcontainer = document.createElement("div");
  ctx = this.Dcanvas.getContext("2d");
  originElement: Element | null = null;
  painting = false;
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  resizeWatcher: ResizeObserver;

  //附加项
  coordinateTip: DcoordinateTip | null = null;

  //画像相关变量
  lineWidth = 1;
  lineColor = "#000000";
  lineCap: CanvasLineCap = "round";
  mode = "custom";

  constructor(fundElement: string, options?: _type_options) {
    let self = this;

    this.originElement = document.querySelector(fundElement);

    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";

    //保证画布填满容器
    this.resizeWatcher = new ResizeObserver(() => {
      this.Dcanvas.width = (this.originElement as HTMLDivElement).offsetWidth;
      this.Dcanvas.height = (this.originElement as HTMLDivElement).offsetHeight;
    });
    this.resizeWatcher.observe(this.originElement as HTMLDivElement);

    //选项初始化
    this.setOptions(options);

    //鼠标监听
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {
        if (this.coordinateTip) {
          this.coordinateTip.coordinate = {
            //若不整个对象赋值将不会出发setText函数
            x: e.offsetX,
            y: e.offsetY,
          };
        }
        if (this.painting) {
          this.drawContinuous(
            { x: this.preX, y: this.preY },
            { x: e.offsetX, y: e.offsetY }
          );
        }

        this.preX = e.offsetX;
        this.preY = e.offsetY;
      })
    );
    this.Dcanvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.painting = true;
      this.drawSpot({ x: e.offsetX, y: e.offsetY });
      this.preX = e.offsetX;
      this.preY = e.offsetY;
      this.x = e.offsetX;
      this.y = e.offsetY;
    });
    this.Dcanvas.addEventListener("mouseup", (e: MouseEvent) => {
      this.painting = false;
      if (this.mode === "straight" && this.ctx) {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineCap = this.lineCap;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
      }
    });
    this.Dcanvas.addEventListener("mouseleave", (e: MouseEvent) => {
      if (this.painting && this.mode === "straight" && this.ctx) {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineCap = this.lineCap;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
      }
      this.painting = false;
    });

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
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

  //连续线绘画,解决断点问题
  drawContinuous(start: _type_coordinate, end: _type_coordinate) {
    if (!this.ctx) {
      return;
    }
    if (this.mode === "straight") {
      return;
    }
    this.ctx.lineWidth = this.lineWidth;

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.lineCap = this.lineCap;
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);

    this.ctx.stroke();
  }

  //单点绘画
  drawSpot(position: _type_coordinate) {
    if (!this.ctx) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, this.lineWidth / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.lineColor;
    this.ctx.fill();
  }

  //设置参数
  setOptions(options?: _type_options) {
    if (options?.coordinateTip) {
      if (!this.coordinateTip) {
        this.coordinateTip = new DcoordinateTip(this);
        this.Dcontainer.append(this.coordinateTip.element);
      }
    } else {
      if (options?.coordinateTip === false && this.coordinateTip) {
        this.Dcontainer.removeChild(this.coordinateTip.element);
      }
    }
    this.lineColor = options?.lineColor || this.lineColor;
    this.lineWidth = options?.lineWidth || this.lineWidth;
    this.lineCap = options?.lineCap || this.lineCap;
    this.mode = options?.mode || this.mode;
  }
}

//坐标提示类
class DcoordinateTip {
  Dentity: daVinci_free | null = null;
  element = document.createElement("div");

  coordinate: _type_coordinate = {
    x: 0,
    y: 0,
  };

  constructor(daVinci_entity: daVinci_free) {
    let self = this;
    if (!daVinci_entity) {
      throw Error("未指定有效实体");
    }
    this.Dentity = daVinci_entity;
    this.element.className = "davinci_coordinateTip";
    return new Proxy(this, {
      set: function (target, key, value, receiver) {
        if (key === "coordinate") {
          self.setText();
        }
        return Reflect.set(target, key, value, receiver);
      },
    });
  }

  setText() {
    this.element.innerText = `${this.coordinate.x},${this.coordinate.y}`;
  }
}
