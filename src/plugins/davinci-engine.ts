export class davinci {
  Dcanvas = document.createElement("canvas"); //表画布
  Dcontainer = document.createElement("div");
  Dctx = this.Dcanvas.getContext("2d", {
    alpha: true,
  }) as CanvasRenderingContext2D;
  originElement: Element | null = null;

  Scanvas = document.createElement("canvas"); //里画布,用于计算碰撞体
  Sctx = this.Scanvas.getContext("2d") as CanvasRenderingContext2D;

  DcanvasCharacter: Dcharacter; //必须建立一个基础元素

  allowRender: boolean = false; //防止初始化时多次渲染，默认为false

  //画布设置
  width: number = 500;
  height: number = 500;
  globalAlpha = 0;
  globalCompositeOperation = "source-over";

  //鼠标事件参数
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  mousetype = null;
  currentShape: _type_shape | null | undefined = null;

  //缓存快照
  quickCtx: HTMLImageElement = new Image();
  quickShadowCtx: HTMLImageElement = new Image();

  //按帧节流
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

  constructor(fundElement: string, options?: Doptions) {
    let self = this;

    this.Dcanvas.setAttribute("crossOrigin", "use-credentials");
    this.originElement = document.querySelector(fundElement);

    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";

    this.width = options?.width || 500;
    this.height = options?.height || 500;

    this.Dcanvas.width = this.width;
    this.Dcanvas.height = this.width;

    this.Scanvas.width = this.width;
    this.Scanvas.height = this.height;

    //鼠标监听
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {})
    );
    this.Dcanvas.addEventListener("mousedown", (e: MouseEvent) => {
      let Devent: Devent = {
        x: e.offsetX,
        y: e.offsetY,
        type: "mousedown",
        preTarge: null,
      };
      this.DcanvasCharacter.trigger(Devent, 0, 0, true);
    });
    this.Dcanvas.addEventListener("mouseup", (e) => {
      let Devent: Devent = {
        x: e.offsetX,
        y: e.offsetY,
        type: "mouseup",
        preTarge: null,
      };
      this.DcanvasCharacter.trigger(Devent, 0, 0, true);
    });

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
    this.originElement?.append(this.Dcontainer);

    let canvasShape = new Dshape({
      type: "rect",
      path: { width: this.width, height: this.height },
    });

    this.DcanvasCharacter = new Dcharacter(
      {
        width: this.width,
        height: this.height,
        fillColor: "#00000000",
        shape: canvasShape,
      },
      this
    );
  }

  render() {
    this.Dctx.clearRect(0, 0, this.width, this.height);
    this.DcanvasCharacter.render();
  }
}

export class Dcharacter {
  position: string = "relative";
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
  onmousedown: (event: Devent) => any = () => {};
  onmouseup: (event: Devent) => any = () => {};
  onmousemove: (event: Devent) => any = () => {};
  onmouseenter: (event: Devent) => any = () => {};
  onmouseleave: (event: Devent) => any = () => {};
  onmouseover: (event: Devent) => any = () => {};

  onkeydown: (event: Devent) => any = () => {};
  onkeyup: (event: Devent) => any = () => {};

  constructor(data: Dcharacter_data, DM: davinci) {
    const self = this;
    this.uid = +new Date() + Math.floor(Math.random() * (10000 - 1)) + 1;
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
    this.position = data.position || this.position;
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
            self.throttle(() => {
              target.dm.render();
            });
            //触发render
            break;
          case "height":
            Reflect.set(target, "focusY", value / 2, receiver);
            self.throttle(() => {
              target.dm.render();
            });
            //触发render
            break;
          case "name":
            Reflect.set(target, key, value, receiver);
            //不触发render
            break;
          case "id":
            Reflect.set(target, key, value, receiver);
            //不触发render
            break;
          case "uid":
            throw Error('"uid" is Not modifiable!!!');
            //不触发render
            break;
          case "textureSVG":
            //不触发render
            Reflect.set(target, key, value, receiver);
            break;
          case "textureMatrix":
            //不触发render
            Reflect.set(target, key, value, receiver);
            break;
          default:
            Reflect.set(target, key, value, receiver);
            self.throttle(() => {
              target.dm.render();
            });
            //其余属性均需要触发render
            break;
        }
        return true;
      },
    });
  }

  //按帧节流
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
    };
    this.texture = this.dm.Dctx.createPattern(
      this.textureSource as HTMLImageElement,
      "no-repeat"
    );
  }

  //渲染器
  render(relativeX: number = 0, relativeY: number = 0) {
    if (!this.dm.allowRender) {
      //中断渲染
      return;
    }
    let rx = this.position === "relative" ? relativeX : 0;
    let rY = this.position === "relative" ? relativeY : 0;
    if (!this.shape) {
      //没有图形不作渲染
      this.children.forEach((o) => {
        o.render(this.x + rx, this.y + rY);
      });
      return;
    }
    let shape;
    this.dm.Dctx.beginPath();
    switch (this.shape.type) {
      case "rect":
        shape = (this.shape as Dshape_data_rect).path;
        this.dm.Dctx.rect(
          this.x + rx + this.focusX - shape.width / 2,
          this.y + rY + this.focusY - shape.height / 2,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        shape = (this.shape as Dshape_data_arc).path;
        this.dm.Dctx.arc(
          this.x + rx + this.focusX,
          this.y + rY + this.focusY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        shape = (this.shape as Dshape_data_polygon).path;
        this.dm.Dctx.moveTo(
          shape.pointList[0].x + this.x + rx,
          shape.pointList[0].y + this.y + rY
        );
        shape.pointList.forEach((point) => {
          this.dm.Dctx.lineTo(point.x + this.x + rx, point.y + this.y + rY);
        });
        this.dm.Dctx.closePath();
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
      this.textureRender(rx, rY);
      this.dm.Dctx.fillStyle = this.texture || this.dm.Dctx.fillStyle;
    } else {
      this.dm.Dctx.fillStyle = this.fillColor;
    }
    this.dm.Dctx.fill();
    this.childrenSort();

    this.children.forEach((o) => {
      o.render(this.x + rx, this.y + rY);
    });
  }

  //纹理渲染
  textureRender(relativeX: number, relativeY: number) {
    let rx = this.position === "relative" ? relativeX : 0;
    let rY = this.position === "relative" ? relativeY : 0;
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
      this.textureMatrix.translate(this.x + rx, this.y + rY)
    );
  }

  //判断是否当前目标，并优先返回顶层对象，默认阻止冒泡
  trigger(
    event: Devent,
    relativeX: number = 0,
    relativeY: number = 0,
    stop: boolean = true
  ): Dcharacter | undefined {
    let rx = this.position === "relative" ? relativeX : 0;
    let rY = this.position === "relative" ? relativeY : 0;

    let currentTarget: Dcharacter | undefined = undefined;
    if (this.children.length) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        currentTarget = this.children[i].trigger(
          event,
          this.x + rx,
          this.y + rY
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

    this.dm.Sctx.beginPath();
    let shape;
    switch (this.shape.type) {
      case "rect":
        shape = (this.shape as Dshape_data_rect).path;
        this.dm.Sctx.rect(
          this.x + rx + this.focusX - shape.width / 2,
          this.y + rY + this.focusY - shape.height / 2,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        shape = (this.shape as Dshape_data_arc).path;
        this.dm.Sctx.arc(
          this.x + rx + this.focusX,
          this.y + rY + this.focusY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        shape = (this.shape as Dshape_data_polygon).path;
        this.dm.Sctx.moveTo(
          shape.pointList[0].x + this.x + rx,
          shape.pointList[0].y + this.y + rY
        );
        shape.pointList.forEach((point) => {
          this.dm.Sctx.lineTo(point.x + this.x + rx, point.y + this.y + rY);
        });
        this.dm.Sctx.closePath();
        break;
      default:
        break;
    }
    if (this.dm.Sctx.isPointInPath(event.x, event.y)) {
      let nextEvent = { ...event };

      //
      // 执行本体事件
      //
      switch (event.type) {
        case "mousemove":
          if (event.preTarge.uid !== this.uid) {
            nextEvent.preTarge = this;
            nextEvent.type = "mouseleave";
            event.preTarge.onmouseleave(event);
            this.onmouseenter(event);
          } else {
            this.onmousemove(event);
          }
          break;
        case "mousedown":
          this.onmousedown(event);
          break;
        case "mouseup":
          this.onmouseup(event);
          break;
        default:
          break;
      }

      return currentTarget || this;
    } else {
      return currentTarget;
    }
  }

  //监听器
  addEventListener(type: Devent_type, fn: (event: Devent) => any) {
    this[`on${type}`] = fn;
  }
}

export class Dshape {
  type: Dshape_type;
  path: Dpath;
  constructor(data: Dshape_data) {
    this.type = data.type;
    this.path = data.path;
  }
}
