export class davinci_visual_hash {
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
        if (!this.ctx || !this.shadowCtx || !this.isMouseDown) {
          return;
        }

        if (this.currentShape) {
          this.currentShape.positionX += e.offsetX - this.preX;
          this.currentShape.positionY += e.offsetY - this.preY;
          this.cleanAllCanvas();
          this.quickDraw();
          this.createRectCache(this.currentShape);
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
        return;
      }

      let shadowPoint = this.shadowCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
      this.currentShape = this.shapeList.find(
        (o) => o.hashID === rgb2hex(shadowPoint.data)
      );

      if (!this.currentShape) {
        return;
      }

      //清空画布
      this.cleanAllCanvas();

      //重塑画布
      this.shapeList.forEach((o) => {
        if (o.hashID === this.currentShape?.hashID) {
          return;
        }
        this.createRectCache(o);
      });

      //缓存当前状态
      this.quickSave();

      //绘制当前对象
      this.createRectCache(this.currentShape);
    });
    this.Dcanvas.addEventListener("mouseup", (e) => {
      if (!this.isMouseDown) {
        return;
      }
      this.isMouseDown = false;
      if (!this.ctx || !this.shadowCtx) {
        return;
      }

      //清空画布
      this.cleanAllCanvas();

      //重塑画布
      this.shapeList.forEach((o) => {
        this.createRectCache(o);
      });
    });
    this.Dcanvas.addEventListener("mouseleave", (e) => {
      if (!this.isMouseDown) {
        return;
      }
      this.isMouseDown = false;
      if (!this.ctx || !this.shadowCtx) {
        return;
      }

      //清空画布
      this.cleanAllCanvas();

      //重塑画布
      this.shapeList.forEach((o) => {
        this.createRectCache(o);
      });
    });

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
    this.originElement?.append(this.Dcontainer);
  }

  createRect(
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    fillcolor: string
  ) {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = fillcolor;
    this.ctx.fillRect(positionX, positionY, width, height);

    let shapeData = {
      hashID: this.hashCount++,
      type: "rect",
      positionX: positionX,
      positionY: positionY,
      width: width,
      height: height,
      fillColor: fillcolor,
      zIndex: 1,
    };

    this.shapeList.push(shapeData);

    //虚拟画布操作
    if (!this.shadowCtx) {
      return;
    }
    this.shadowCtx.fillStyle = hexFormat(shapeData.hashID.toString(16));
    this.shadowCtx.fillRect(positionX, positionY, width, height);
  }

  createRectCache(shape: _type_shape) {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = shape.fillColor as string;
    this.ctx.fillRect(
      shape.positionX,
      shape.positionY,
      shape.width,
      shape.height
    );
    //虚拟画布操作
    if (!this.shadowCtx) {
      return;
    }
    this.shadowCtx.fillStyle = hexFormat(shape.hashID.toString(16));
    this.shadowCtx.fillRect(
      shape.positionX,
      shape.positionY,
      shape.width,
      shape.height
    );
  }

  cleanAllCanvas() {
    this.ctx?.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);
    this.shadowCtx?.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);
  }

  //保存快照
  quickSave() {
    this.quickCtx.width = this.Dcanvas.width;
    this.quickCtx.height = this.Dcanvas.height;
    this.quickCtx.src = this.Dcanvas.toDataURL("image/png", 1);

    this.quickShadowCtx.width = this.Dcanvas.width;
    this.quickShadowCtx.height = this.Dcanvas.height;
    this.quickShadowCtx.src = this.shadowCanvas.toDataURL("image/png", 1);
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
    this.shadowCtx?.drawImage(
      this.quickShadowCtx,
      0,
      0,
      this.Dcanvas.width,
      this.Dcanvas.height
    );
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
