export class davinci_visual_classic {
  Dcanvas = document.createElement("canvas");
  Dcontainer = document.createElement("div");
  ctx = this.Dcanvas.getContext("2d", { alpha: true });
  originElement: Element | null = null;
  resizeWatcher: ResizeObserver;

  shadowCanvas = document.createElement("canvas");
  shadowCtx = this.shadowCanvas.getContext("2d");

  patternSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  patternMatrix = this.patternSVG.createSVGMatrix();

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

    this.Dcanvas.setAttribute("crossOrigin", "use-credentials");
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
      // this.patternCanvas.width = (
      //   this.originElement as HTMLDivElement
      // ).offsetWidth;
      // this.patternCanvas.height = (
      //   this.originElement as HTMLDivElement
      // ).offsetHeight;
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
          this.render(this.currentShape);
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
      this.drawAll([this.currentShape.hashID]);

      //缓存当前状态
      this.quickSave();

      //绘制当前对象
      this.render(this.currentShape);
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

  //创建矩形绘制并录入信息
  createRect(shape: _type_rect) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    if (shape.zIndex && shape.zIndex > this.maxIdx) {
      this.maxIdx = shape.zIndex + 1;
    }
    let shapeData: _type_shape = {
      hashID: this.hashCount++,
      type: "rect",
      positionX: shape.positionX,
      positionY: shape.positionY,
      width: shape.width,
      height: shape.height,
      pathList: [],
      fillColor: shape.fillColor,
      zIndex: shape.zIndex || this.maxIdx++,
      image: shape.image,
    };
    if (shape.image) {
      shapeData.patternOrigin = new Image(shape.width, shape.height);
      shapeData.patternOrigin.crossOrigin = "anonymous";
      shapeData.patternOrigin.src = shape.image;
      shapeData.pattern = this.ctx.createPattern(
        shapeData.patternOrigin,
        "no-repeat"
      ) as CanvasPattern;
    }

    this.shapeList.push(shapeData);
    this.shapeSort();
  }
  //创建圆形绘制并录入信息
  createArc(shape: _type_arc) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    if (shape.zIndex && shape.zIndex > this.maxIdx) {
      this.maxIdx = shape.zIndex + 1;
    }
    let shapeData: _type_shape = {
      hashID: this.hashCount++,
      type: "arc",
      positionX: shape.positionX,
      positionY: shape.positionY,
      radius: shape.radius,
      pathList: [],
      fillColor: shape.fillColor,
      image: shape.image,
      zIndex: shape.zIndex || this.maxIdx++,
    };
    if (shape.image) {
      shapeData.patternOrigin = new Image(shape.radius, shape.radius);
      shapeData.patternOrigin.crossOrigin = "anonymous";
      shapeData.patternOrigin.src = shape.image;
      shapeData.pattern = this.ctx.createPattern(
        shapeData.patternOrigin,
        "no-repeat"
      ) as CanvasPattern;
    }
    this.shapeList.push(shapeData);
    this.shapeSort();
  }
  //创建圆形绘制并录入信息
  createPolygon(shape: _type_polygon) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    if (shape.zIndex && shape.zIndex > this.maxIdx) {
      this.maxIdx = shape.zIndex + 1;
    }
    let shapeData: _type_shape = {
      hashID: this.hashCount++,
      type: "polygon",
      positionX: shape.positionX,
      positionY: shape.positionY,
      pathList: [...shape.pathList],
      fillColor: shape.fillColor,
      image: shape.image,
      zIndex: shape.zIndex || this.maxIdx++,
      patternOffsetX: shape.patternOffsetX || 0,
      patternOffsetY: shape.patternOffsetY || 0,
      maxHeight: shape.maxHeight,
      maxWidth: shape.maxWidth,
    };
    if (shape.image) {
      shapeData.patternOrigin = new Image();
      shapeData.patternOrigin.crossOrigin = "anonymous";
      shapeData.patternOrigin.src = shape.image;
      shapeData.patternOrigin.width =
        shape.maxWidth || shapeData.patternOrigin.naturalWidth; //多边形没有赋予最大宽度和高度将取原始高度和宽度
      shapeData.patternOrigin.height =
        shape.maxHeight || shapeData.patternOrigin.naturalHeight;
      shapeData.pattern = this.ctx.createPattern(
        shapeData.patternOrigin,
        "no-repeat"
      ) as CanvasPattern;
    }
    this.shapeList.push(shapeData);
    this.shapeSort();
  }

  //检测点是否在路径上
  checkPointInPath(shape: _type_shape, point: _type_coordinate) {
    if (!this.shadowCtx) {
      throw Error("initialization error");
    }
    this.shadowCtx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height); //可不清理
    this.shadowCtx.beginPath();
    //以下操作均在影子画布下绘制
    switch (shape.type) {
      case "rect":
        this.shadowCtx.rect(
          shape.positionX,
          shape.positionY,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        this.shadowCtx.arc(
          shape.positionX,
          shape.positionY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        this.shadowCtx.moveTo(
          shape.pathList[0].x + shape.positionX,
          shape.pathList[0].y + shape.positionY
        );
        shape.pathList.forEach((o: _type_coordinate) => {
          this.shadowCtx?.lineTo(o.x + shape.positionX, o.y + shape.positionY);
        });
        this.shadowCtx.closePath();
        break;
      default:
        break;
    }
    if (this.shadowCtx.isPointInPath(point.x, point.y)) {
      return true;
    } else {
      return false;
    }
  }

  //处理形状pattern
  drawPattern(shape: _type_shape) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    switch (shape.type) {
      case "rect":
        (shape.pattern as CanvasPattern).setTransform(
          this.patternMatrix
            .translate(shape.positionX, shape.positionY)
            .scale(
              shape.width / (shape.patternOrigin as any).naturalWidth,
              shape.height / (shape.patternOrigin as any).naturalHeight
            )
        );
        break;
      case "arc":
        (shape.pattern as CanvasPattern).setTransform(
          this.patternMatrix
            .translate(
              shape.positionX - shape.radius,
              shape.positionY - shape.radius
            )
            .scale(
              (shape.radius * 2) / (shape.patternOrigin as any).naturalWidth,
              (shape.radius * 2) / (shape.patternOrigin as any).naturalHeight
            )
        );
        break;
      case "polygon":
        (shape.pattern as CanvasPattern).setTransform(
          this.patternMatrix
            .translate(
              shape.positionX + shape.pathList[0].x + shape.patternOffsetX,
              shape.positionY + shape.pathList[0].y + shape.patternOffsetY
            )
            .scale(
              shape.maxWidth / (shape.patternOrigin as any).naturalWidth,
              shape.maxHeight / (shape.patternOrigin as any).naturalHeight
            )
        );
        break;
      default:
        break;
    }
  }

  //形状绘制
  render(shape: _type_shape) {
    if (!this.ctx) {
      throw Error("initialization error");
    }
    this.ctx.fillStyle = shape.fillColor || "#000000"; //暂时未支持图片输入

    this.ctx.beginPath();

    switch (shape.type) {
      case "rect":
        this.ctx.rect(
          shape.positionX,
          shape.positionY,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        this.ctx.arc(
          shape.positionX,
          shape.positionY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        this.ctx.moveTo(
          shape.pathList[0].x + shape.positionX,
          shape.pathList[0].y + shape.positionY
        );
        shape.pathList.forEach((o: _type_coordinate) => {
          this.ctx?.lineTo(o.x + shape.positionX, o.y + shape.positionY);
        });
        this.ctx.closePath();
        break;
      default:
        break;
    }

    if (shape.image) {
      this.drawPattern(shape);
      this.ctx.fillStyle = shape.pattern || this.ctx.fillStyle;
    }
    this.ctx.fill();
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
      this.shapeList.sort(
        (a, b) => (b.zIndex as number) - (a.zIndex as number)
      );
    } else {
      this.shapeList.sort(
        (a, b) => (a.zIndex as number) - (b.zIndex as number)
      );
    }
  }

  //全绘制
  drawAll(except?: Array<number>) {
    //由于排序原因需要逆向遍历
    for (let i = this.shapeList.length - 1; i >= 0; i--) {
      if (except?.includes(this.shapeList[i].hashID as number)) {
        continue;
      } else {
        this.render(this.shapeList[i]);
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
