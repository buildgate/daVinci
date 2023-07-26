export class davinci_visual_classic {
  Dcanvas = document.createElement("canvas");
  Dcontainer = document.createElement("div");
  ctx = this.Dcanvas.getContext("2d", { alpha: true });
  originElement: Element | null = null;
  resizeWatcher: ResizeObserver;

  shadowCanvas = document.createElement("canvas");
  shadowCtx = this.shadowCanvas.getContext("2d");

  hashCount = 1;

  //画布设置
  globalAlpha = 0;
  globalCompositeOperation = "source-over";

  //鼠标事件参数
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  isMouseDown = false;
  currentShape: _type_shape | null | undefined = null;

  //缓存快照
  quickCtx: HTMLImageElement = new Image();
  quickShadowCtx: HTMLImageElement = new Image();

  //图形数据
  shapeList: Array<_type_shape> = [];
  maxIdx = 0;

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

  constructor(fundElement: string, options?: _type_options) {
    let self = this;

    this.originElement = document.querySelector(fundElement);

    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";
    //保证画布填满容器
    this.resizeWatcher = new ResizeObserver(() => {
      this.Dcanvas.width = (this.originElement as HTMLDivElement).offsetWidth;
      this.Dcanvas.height = (this.originElement as HTMLDivElement).offsetHeight;
      this.shadowCanvas.width = (
        this.originElement as HTMLDivElement
      ).offsetWidth;
      this.shadowCanvas.height = (
        this.originElement as HTMLDivElement
      ).offsetHeight;
    });
    this.resizeWatcher.observe(this.originElement as HTMLDivElement);

    //鼠标监听
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {
        if (!this.ctx || !this.shadowCtx) {
          throw Error("initialization error");
        }

        if (!this.isMouseDown) {
          return;
        }

        if (this.currentShape) {
          this.currentShape.positionX += e.offsetX - this.preX;
          this.currentShape.positionY += e.offsetY - this.preY;
          this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);
          this.quickDraw();
          this.drawRect(this.currentShape);
        }

        this.preX = e.offsetX;
        this.preY = e.offsetY;
      })
    );
    this.Dcanvas.addEventListener("mousedown", (e) => {
      this.isMouseDown = true;
      this.preX = e.offsetX;
      this.preY = e.offsetY;
      this.x = e.offsetX;
      this.y = e.offsetY;

      if (!this.ctx || !this.shadowCtx) {
        throw Error("initialization error");
      }

      this.currentShape = this.shapeList.find((o) =>
        this.checkPointInPath(o, { x: e.offsetX, y: e.offsetY })
      );

      if (!this.currentShape) {
        //未命中目标
        return;
      }

      //清空画布
      this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);

      //重塑画布
      this.drawAll([this.currentShape?.hashID as number]);

      //缓存当前状态
      this.quickSave();

      //绘制当前对象
      this.drawRect(this.currentShape);
    });
    this.Dcanvas.addEventListener("mouseup", (e) => {
      if (!this.isMouseDown) {
        return;
      }
      this.isMouseDown = false;

      if (!this.ctx || !this.shadowCtx) {
        throw Error("initialization error");
      }

      //清空画布
      this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);

      //重塑画布
      this.drawAll();
    });
    this.Dcanvas.addEventListener("mouseleave", (e) => {
      if (!this.isMouseDown) {
        return;
      }
      this.isMouseDown = false;
      if (!this.ctx || !this.shadowCtx) {
        throw Error("initialization error");
      }

      //清空画布
      this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);

      //重塑画布
      this.drawAll();
    });

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
    this.originElement?.append(this.Dcontainer);
  }

  //创建形状绘制并录入信息
  createRect(
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    fillcolor: string,
    zIndex?: number
  ) {
    if (zIndex && zIndex > this.maxIdx) {
      this.maxIdx = zIndex + 1;
    }
    let shapeData = {
      hashID: this.hashCount++,
      type: "rect",
      positionX: positionX,
      positionY: positionY,
      width: width,
      height: height,
      fillColor: fillcolor,
      zIndex: zIndex || this.maxIdx++,
    };
    console.log(shapeData.zIndex, this.maxIdx);
    this.shapeList.push(shapeData);
    this.shapeSort();
    this.drawAll();
  }

  //检测点是否在路径上
  checkPointInPath(shape: _type_shape, point: _type_coordinate) {
    if (!this.shadowCtx) {
      throw Error("initialization error");
    }
    this.shadowCtx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height); //可不清理
    this.shadowCtx.beginPath();
    this.shadowCtx.rect(
      shape.positionX,
      shape.positionY,
      shape.width,
      shape.height
    );
    if (this.shadowCtx.isPointInPath(point.x, point.y)) {
      return true;
    } else {
      return false;
    }
  }

  //形状绘制
  drawRect(shape: _type_shape) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    this.ctx.fillStyle = shape.fillColor as string;
    this.ctx.fillRect(
      shape.positionX,
      shape.positionY,
      shape.width,
      shape.height
    );
  }

  //保存快照
  quickSave() {
    this.quickCtx.width = this.Dcanvas.width;
    this.quickCtx.height = this.Dcanvas.height;
    this.quickCtx.src = this.Dcanvas.toDataURL("image/png", 1);
  }

  //绘制快照
  quickDraw() {
    this.ctx?.drawImage(
      this.quickCtx,
      0,
      0,
      this.Dcanvas.width,
      this.Dcanvas.height
    );
  }

  //图形信息更新
  shapeSort(order: string = "desc") {
    if (order === "desc") {
      this.shapeList.sort((a, b) => b.zIndex - a.zIndex);
    } else {
      this.shapeList.sort((a, b) => a.zIndex - b.zIndex);
    }
  }

  //全绘制
  drawAll(except?: Array<number>) {
    for (let i = this.shapeList.length - 1; i >= 0; i--) {
      if (except?.includes(this.shapeList[i].hashID as number)) {
        continue;
      } else {
        this.drawRect(this.shapeList[i]);
      }
    }
  }
}

function hexFormat(str: string) {
  if (str.length > 6) {
    throw Error("wrong hex");
  } else {
    let add = "";
    for (let i = str.length; i < 6; i++) {
      add += "0";
    }
    return "#" + add + str;
  }
}

function rgb2hex(rgbArr: any) {
  return parseInt(
    rgbArr[0].toString(16) + rgbArr[1].toString(16) + rgbArr[2].toString(16),
    16
  );
}
