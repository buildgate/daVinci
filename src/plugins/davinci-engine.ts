import { promises } from "original-fs";

export class davinci {
  Dcanvas = document.createElement("canvas"); //表画布
  Dcontainer = document.createElement("div");
  ctx = this.Dcanvas.getContext("2d", {
    alpha: true,
  }) as CanvasRenderingContext2D;
  originElement: Element | null = null;
  resizeWatcher: ResizeObserver;

  shadowCanvas = document.createElement("canvas"); //里画布
  shadowCtx = this.shadowCanvas.getContext("2d") as CanvasRenderingContext2D;

  patternSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //纹理画布
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
    });
    this.resizeWatcher.observe(this.originElement as HTMLDivElement);

    //鼠标监听
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {
        if (!this.ctx || !this.shadowCtx) {
          throw Error("initialization error");
        }

        let exTarget = this.currentShape;

        if (this.isMouseDown) {
          if (this.currentShape) {
            this.currentShape.positionX += e.offsetX - this.preX;
            this.currentShape.positionY += e.offsetY - this.preY;
            this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);
            this.quickDraw();
            this.render(this.currentShape, true);
          }
        } else {
          this.currentShape = this.shapeList.find((o) =>
            this.checkPointInPath(o, { x: e.offsetX, y: e.offsetY })
          );
          if (this.currentShape) {
            //命中目标
            if (this.currentShape.hashID !== exTarget?.hashID) {
              //目标不与前目标一致则重新渲染
              //清空画布
              this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);

              //重塑画布
              this.drawAll([this.currentShape.hashID]);

              //绘制当前对象
              this.render(this.currentShape, true);
            }
          } else {
            //没有命中目标
            if (exTarget) {
              //前目标不为空时重新渲染
              this.ctx.clearRect(0, 0, this.Dcanvas.width, this.Dcanvas.height);
              this.drawAll();
            }
          }
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
      this.render(this.currentShape, true);
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

  globalRender() {
    console.log(1);
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
  render(shape: _type_shape, actived: boolean = false) {
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
    this.ctx.save();
    if (actived) {
      this.ctx.strokeStyle = "#F56C6C";
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = "black";
      this.ctx.shadowBlur = 15;
      this.ctx.stroke();
    }
    this.ctx.restore();
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

class Dcharacter {
  uid: number | string;
  id: string | number | symbol = "";
  name: string | number = "";
  width: number = 100;
  height: number = 100;
  x: number = 0;
  y: number = 0;
  focusX: number = 0;
  focusY: number = 0;
  fillColor: CanvasFillStrokeStyles["fillStyle"] = "#000000";
  texture: CanvasPattern | null = null;
  focusPoint: Dcoordinate = { x: this.width / 2, y: this.height / 2 };
  dm: davinci; //画布实例
  shape: Dshape | null = null;
  zidx: number = 0;

  //纹理相关
  textureSVG: SVGSVGElement | null = null; //纹理画布
  textureMatrix: DOMMatrix | null = null;
  textureSource: HTMLImageElement | null = null;

  //子角色模块
  children: Array<Dcharacter> = [];

  //父角色模块，若无则是默认画布
  parent: Dcharacter | null | undefined = null;

  //事件列
  onMouseDown = () => {};
  onMouseUp = () => {};
  onMouseMove = () => {};

  constructor(data: Dcharacter_data, DM: davinci) {
    const self = this;
    this.uid = +new Date() + Math.floor(Math.random() * 10000) + 1;
    this.id = data.id || +new Date();
    this.name = data.name || "";
    this.fillColor = data.fillColor || "#000000";
    this.shape = data.shape || null;
    this.width = data.width || 0;
    this.height = data.height || 0;
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.focusX = data.focusX || this.width / 2;
    this.focusY = data.focusY || this.height / 2;
    this.zidx = data.zidx || 0;
    this.dm = DM;

    this.children = data.children || [];
    if (this.children.length) {
      this.childrenSort();
    }

    if (data.texture) {
      this.initTexture(data.texture);
    }

    return new Proxy(this, {
      set: function (target, key, value, receiver) {
        switch (key) {
          case "width":
            Reflect.set(target, "focusX", value / 2, receiver);
            new Promise(function (resolve, reject) {
              resolve("start render");
            }).then(() => {
              target.dm.globalRender();
            });
            //触发render
            break;
          case "height":
            Reflect.set(target, "focusY", value / 2, receiver);
            new Promise(function (resolve, reject) {
              resolve("start render");
            }).then(() => {
              target.dm.globalRender();
            });
            //触发render
            break;
          case "name":
            //不触发render
            break;
          case "id":
            //不触发render
            break;
          default:
            new Promise(function (resolve, reject) {
              resolve("start render");
            }).then(() => {
              target.dm.globalRender();
            });
            //其余属性均需要触发render
            break;
        }
        return Reflect.set(target, key, value, receiver);
      },
    });
  }

  //子角色对象排序，按照zidx由小到大排序
  childrenSort(order: string = "asc") {
    if (order === "asc") {
      this.children.sort((a, b) => a.zidx - b.zidx);
    } else {
      this.children.sort((a, b) => b.zidx - a.zidx);
    }
  }

  //初始化纹理
  initTexture(originTexture: string) {
    if (!originTexture) {
      return;
    }
    if (!this.shape) {
      return;
    }
    if (!this.textureSource) {
      this.textureSource = new Image();
      this.textureSource.crossOrigin = "anonymous";
      this.textureSource.src = originTexture;
    }
    this.textureSource.onload = (e) => {
      if (!this.shape) {
        return;
      }
      (this.textureSource as HTMLImageElement).width = this.width;
      (this.textureSource as HTMLImageElement).height = this.height;

      this.texture = this.dm.ctx.createPattern(
        this.textureSource as HTMLImageElement,
        "no-repeat"
      );
    };
  }

  //渲染器
  render(relativeX: number = 0, relativeY: number = 0) {
    if (!this.shape) {
      //没有图形不作渲染
      this.children.forEach((o) => {
        o.render(this.x + relativeX, this.y + relativeY);
      });
      return;
    }
    let shape;
    switch (this.shape.type) {
      case "rect":
        shape = (this.shape as Dshape_data_rect).path;
        this.dm.ctx.rect(
          this.x + relativeX + this.focusX - shape.width / 2,
          this.y + relativeY + this.focusY - shape.height / 2,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        shape = (this.shape as Dshape_data_arc).path;
        this.dm.ctx.arc(
          this.x + relativeX + this.focusX,
          this.y + relativeY + this.focusY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        shape = (this.shape as Dshape_data_polygon).path;
        this.dm.ctx.beginPath();
        this.dm.ctx.moveTo(
          shape.pointList[0].x + this.x + relativeX,
          shape.pointList[0].y + this.y + relativeY
        );
        shape.pointList.forEach((point) => {
          this.dm.ctx.lineTo(
            point.x + this.x + relativeX,
            point.y + this.y + relativeY
          );
        });
        this.dm.ctx.closePath();
        break;
      default:
        break;
    }
    if (this.texture) {
      if (!this.textureSVG) {
        this.textureSVG = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        ); //纹理画布
        this.textureMatrix = this.textureSVG.createSVGMatrix();
      }
      this.textureRender(relativeX, relativeY);
      this.dm.ctx.fillStyle = this.texture || this.dm.ctx.fillStyle;
    }
    this.dm.ctx.fill();
    this.childrenSort();
    this.children.forEach((o) => {
      o.render(this.x + relativeX, this.y + relativeY);
    });
  }

  //纹理渲染
  textureRender(relativeX: number, relativeY: number) {
    if (!this.shape) {
      //无形状不渲染
      return;
    }
    if (!this.textureMatrix) {
      //纹理画布未初始化
      return;
    }
    if (!this.texture) {
      //无纹理
      return;
    }
    this.texture.setTransform(
      this.textureMatrix.translate(this.x + relativeX, this.y + relativeY)
    );
  }

  //判断是否当前目标，并优先返回子级对象，默认阻止冒泡
  isHit(
    eventX: number,
    eventY: number,
    relativeX: number = 0,
    relativeY: number = 0,
    stop: boolean = true
  ): Dcharacter | undefined {
    let currentTarget: Dcharacter | undefined = undefined;
    if (this.children.length) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        currentTarget = this.children[i].isHit(
          eventX,
          eventY,
          this.x + relativeX,
          this.y + relativeY
        );
        if (currentTarget) {
          break;
        }
      }
    }

    if (currentTarget && stop) {
      return currentTarget;
    }

    if (!this.shape) {
      //没有图形不作渲染
      return currentTarget;
    }

    let shape;
    switch (this.shape.type) {
      case "rect":
        shape = (this.shape as Dshape_data_rect).path;
        this.dm.ctx.rect(
          this.x + relativeX + this.focusX - shape.width / 2,
          this.y + relativeY + this.focusY - shape.height / 2,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        shape = (this.shape as Dshape_data_arc).path;
        this.dm.ctx.arc(
          this.x + relativeX + this.focusX,
          this.y + relativeY + this.focusY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        shape = (this.shape as Dshape_data_polygon).path;
        this.dm.ctx.beginPath();
        this.dm.ctx.moveTo(
          shape.pointList[0].x + this.x + relativeX,
          shape.pointList[0].y + this.y + relativeY
        );
        shape.pointList.forEach((point) => {
          this.dm.ctx.lineTo(
            point.x + this.x + relativeX,
            point.y + this.y + relativeY
          );
        });
        this.dm.ctx.closePath();
        break;
      default:
        break;
    }
    if (this.dm.shadowCtx.isPointInPath(eventX, eventY)) {
      //
      // 执行本体事件
      //
      return currentTarget || this;
    } else {
      return currentTarget;
    }
  }
}

class Dshape {
  type: Dshape_type;
  path: Dpath;
  constructor(data: Dshape_data) {
    this.type = data.type;
    this.path = data.path;
  }
}
