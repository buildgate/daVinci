import {
  shapeMethodRect,
  colliderMethodRect,
} from "./plugins/davinci-engine-plugins.js";

export class Davinci {
  Dcanvas = document.createElement("canvas"); //表画布
  Dcontainer = document.createElement("div");
  Dctx = this.Dcanvas.getContext("2d", {
    alpha: false,
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;
  originElement: Element | null = null;

  Scanvas = document.createElement("canvas"); //里画布,用于计算碰撞体
  Sctx = this.Scanvas.getContext("2d") as CanvasRenderingContext2D;

  Dboard: Dcharacter; //必须建立一个基础元素,渲染事件和碰撞事件的入口

  allowRender: boolean = true; //是否允许渲染，可以作为停顿点使用，默认为true
  collisionDetect: boolean = false; //碰撞检测开关，默认为false，防止误触需要手动开启

  //画布设置
  width: number = 500;
  height: number = 500;

  //鼠标事件参数
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  currentTarget: Dcharacter | null | undefined = null;
  preTarget: Dcharacter | null | undefined = null;
  stopPropagation: boolean = true; //是否冒泡，默认不冒泡，冒泡并不会影响碰撞检测的性能，所以按需开启

  //节流相关
  nextRender: boolean = false;
  block: boolean = false;

  //按帧节流
  throttle(fn: (...rest: any) => any) {
    let block = false;
    return function (this: object, ...rest: any) {
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

  constructor(fundElement?: string, options?: Dcharacter_data) {
    let self = this;

    this.Dcanvas.setAttribute("crossOrigin", "use-credentials");

    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";

    let boardShape = new Dshape({
      type: "rect",
      path: { width: this.width, height: this.height },
    });

    this.Dboard = new Dcharacter(
      {
        width: this.width,
        height: this.height,
        focusX: 0,
        focusY: 0,
        fillColor: "#ffffff",
        shape: boardShape,
        collider: boardShape,
        rendering: shapeMethodRect,
        colliding: colliderMethodRect,
      },
      this
    );

    this.setData(options);

    this.initEventTrigger();

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
    if (fundElement) {
      this.mount(fundElement);
    }
  }

  //初始化必须的数据
  setData(options?: Davinci_data) {
    this.width = options?.width ?? this.width;
    this.height = options?.height ?? this.height;

    this.Dcanvas.width = this.width;
    this.Dcanvas.height = this.height;

    this.Scanvas.width = this.width;
    this.Scanvas.height = this.height;

    this.Dboard.width = this.width;
    this.Dboard.height = this.height;

    this.Dboard.shape.path.width = this.width;
    this.Dboard.shape.path.height = this.height;
  }

  //初始化触发事件
  initEventTrigger() {
    this.Dcanvas.addEventListener(
      "mousemove",
      this.throttle((e: MouseEvent) => {
        this.preX = this.x;
        this.preY = this.y;

        this.x = e.offsetX;
        this.y = e.offsetY;

        this.preTarget = this.currentTarget;
        let Devent: Devent = {
          x: e.offsetX,
          y: e.offsetY,
          preX: this.preX,
          preY: this.preY,
          type: "mousemove",
          preTarget: this.preTarget,
        };
        this.currentTarget = this.colliderTrigger(this.Dboard, Devent);
        if (!this.currentTarget && this.preTarget) {
          Devent = {
            x: e.offsetX,
            y: e.offsetY,
            preX: this.preX,
            preY: this.preY,
            type: "mouseleave",
            preTarget: null,
          };
          this.preTarget?.onmouseleave.forEach((o) => {
            o(Devent);
          });
        }
      })
    );
    this.Dcanvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.preX = this.x;
      this.preY = this.y;

      this.x = e.offsetX;
      this.y = e.offsetY;

      let Devent: Devent = {
        x: e.offsetX,
        y: e.offsetY,
        preX: this.preX,
        preY: this.preY,
        type: "mousedown",
        preTarget: this.currentTarget,
      };
      this.currentTarget = this.colliderTrigger(this.Dboard, Devent);
    });
    this.Dcanvas.addEventListener("mouseup", (e) => {
      this.preX = this.x;
      this.preY = this.y;

      this.x = e.offsetX;
      this.y = e.offsetY;

      let Devent: Devent = {
        x: e.offsetX,
        y: e.offsetY,
        preX: this.preX,
        preY: this.preY,
        type: "mouseup",
        preTarget: this.currentTarget,
      };
      this.currentTarget = this.colliderTrigger(this.Dboard, Devent);
    });
    this.Dcanvas.addEventListener("mouseleave", (e) => {
      //当鼠标离开画布的监控区域，那么就会被判断为mouseup和mouseleave先后触发
      this.preX = this.x;
      this.preY = this.y;

      this.x = e.offsetX;
      this.y = e.offsetY;

      let Devent: Devent = {
        x: e.offsetX,
        y: e.offsetY,
        preX: this.preX,
        preY: this.preY,
        type: "mouseup",
        preTarget: this.currentTarget,
      };

      this.currentTarget = this.colliderTrigger(this.Dboard, Devent);

      Devent.type = "mouseleave";

      this.currentTarget?.onmouseleave.forEach((o) => {
        o(Devent);
      });
    });
  }

  //挂载根元素
  mount(fundElement: string) {
    this.originElement = document.querySelector(fundElement);
    this.originElement?.append(this.Dcontainer);
  }

  //执行渲染
  render() {
    if (!this.allowRender) {
      return;
    }

    if (!this.block) {
      this.block = true;
      this.Dctx.clearRect(0, 0, this.width, this.height);
      this.nextRender = false;
      this.renderer(this.Dboard);

      window.requestAnimationFrame(() => {
        this.block = false;

        if (this.nextRender) {
          this.render();
        }
      });
    } else {
      this.nextRender = true;
    }
  }

  //设置形变
  setTF(ctx: CanvasRenderingContext2D, target: Dcharacter) {
    ctx.translate(target.x + target.focusX, target.y + target.focusY);
    ctx.scale(target.scaleX, target.scaleY);
    ctx.rotate(target.rotate);
    ctx.globalAlpha *= target.opacity;
  }

  //渲染器
  renderer(target: Dcharacter) {
    if (!this.allowRender || !target.renderable) {
      //中断渲染
      return;
    }

    let matrix = this.Dctx.getTransform(); //渲染前的准备工作
    let alpha = this.Dctx.globalAlpha;
    this.setTF(this.Dctx, target);
    target.accumulateTransform = this.Dctx.getTransform();

    this.Dctx.beginPath();

    if (target.visiable) {
      target.beforeRender(target, this.Dctx); //渲染周期

      target.rendering(target, this.Dctx);

      target.afterRender(target, this.Dctx);
    }

    target.beforeChildrenRender(target, this.Dctx);

    target.children.forEach((o) => {
      this.renderer(o);
    });

    target.afterChildrenRender(target, this.Dctx);

    this.Dctx.globalAlpha = alpha;
    this.Dctx.setTransform(matrix);
  }

  //判断是否当前目标，并优先返回顶层对象，默认阻止冒泡
  colliderTrigger(target: Dcharacter, event: Devent): Dcharacter | undefined {
    if (!this.collisionDetect || !target.collisionable) {
      return;
    }

    let matrix = this.Sctx.getTransform();

    let currentTarget: Dcharacter | undefined = undefined;
    if (target.children.length) {
      this.setTF(this.Sctx, target);

      target.beforeChildrenCollider(target, this.Sctx);
      for (let i = target.children.length - 1; i >= 0; i--) {
        currentTarget = this.colliderTrigger(target.children[i], event);
        if (currentTarget) {
          break;
        }
      }
      target.afterChildrenCollider(target, this.Sctx);
      this.Sctx.setTransform(matrix);
    }

    if (currentTarget) {
      //子级找到目标对象开始判断是否需要冒泡
      if (!this.stopPropagation) {
        switch (event.type) {
          case "mousemove":
            if (event.preTarget?.uid !== target.uid) {
              //按照浏览器的逻辑，mouseenter和mouseleave是不适宜触发冒泡的
            } else {
              target.onmousemove.forEach((o) => {
                o(event);
              });
            }
            break;
          case "mousedown":
            target.onmousedown.forEach((o) => {
              o(event);
            });
            break;
          case "mouseup":
            target.onmouseup.forEach((o) => {
              o(event);
            });
            break;
          default:
            break;
        }
      }
      return currentTarget;
    }

    this.setTF(this.Sctx, target);

    if (!target.penetrate) {
      target.beforeCollider(target, this.Sctx);

      target.colliding(target, this.Sctx);

      target.afterCollider(target, this.Sctx);
    }

    this.Sctx.setTransform(matrix);

    if (this.Sctx.isPointInPath(event.x, event.y)) {
      let nextEvent = { ...event };

      //
      // 执行本体事件
      //
      switch (event.type) {
        case "mousemove":
          if (event.preTarget?.uid !== target.uid) {
            nextEvent.preTarget = target;
            nextEvent.type = "mouseleave";
            event.preTarget?.onmouseleave.forEach((o: any) => {
              o(event);
            });
            target.onmouseenter.forEach((o) => {
              o(event);
            });
          } else {
            target.onmousemove.forEach((o) => {
              o(event);
            });
          }
          break;
        case "mousedown":
          target.onmousedown.forEach((o) => {
            o(event);
          });
          break;
        case "mouseup":
          target.onmouseup.forEach((o) => {
            o(event);
          });
          break;
        default:
          break;
      }

      return currentTarget || target;
    } else {
      return currentTarget;
    }
  }

  //全局纹理加载检测
  globalTextureComplete(uid: number) {
    function check(Dcharacter: Dcharacter) {
      if (!Dcharacter.textureComplete) {
        return false;
      } else {
        if (Dcharacter.children.length) {
          return Dcharacter.children.every((o): boolean => check(o));
        } else {
          return true;
        }
      }
    }
    if (check(this.Dboard)) {
      this.onGlobalTextureComplete();
    }
  }

  //计算使用变化矩阵后的实际坐标
  matrixCalc(matrix: DOMMatrix, x: number, y: number) {
    let cX = matrix.a * x + -matrix.b * y + matrix.e;
    let cY = -matrix.c * x + matrix.d * y + matrix.f;
    return { x: cX, y: cY };
  }

  //全局纹理加载完成后调用
  onGlobalTextureComplete() {}
}

export class Dcharacter {
  [key: string]: any;
  uid: number;
  id: string | number | symbol = +new Date();
  name: string | number = "";
  width: number = 100;
  height: number = 100;
  x: number = 0;
  y: number = 0;
  focusX: number = 0;
  focusY: number = 0;
  fillColor: CanvasRenderingContext2D["fillStyle"] = "#000000";

  shadowColor: string = "#000000";
  shadowBlur: number = 0;
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;

  strokeStyle: CanvasRenderingContext2D["strokeStyle"] | null = null;
  lineWidth: number = 0;
  lineCap: CanvasRenderingContext2D["lineCap"] = "butt";
  lineDashOffset: CanvasRenderingContext2D["lineDashOffset"] = 0;
  lineJoin: CanvasRenderingContext2D["lineJoin"] = "miter";
  miterLimit: CanvasRenderingContext2D["miterLimit"] = 0;

  scaleX: number = 1;
  scaleY: number = 1;
  rotate: number = 0;
  opacity: number = 1;

  text: string | null = null;
  font: CanvasRenderingContext2D["font"] = "10px sans-serif";
  textAlign: CanvasRenderingContext2D["textAlign"] = "start";
  textBaseline: CanvasRenderingContext2D["textBaseline"] = "alphabetic";
  direction: CanvasRenderingContext2D["direction"] = "inherit";
  textMaxWidth: number | null = null;
  fontColor: CanvasRenderingContext2D["fillStyle"] = "#000000";
  fontStrokeColor: CanvasRenderingContext2D["fillStyle"] = "#000000";
  textOffsetX: number = 0;
  textOffsetY: number = 0;
  fontStrokeLineWidth: number = 0;

  accumulateTransform: DOMMatrix = new DOMMatrix(); //累计形变，用来计算实际坐标

  renderable: boolean = true; //是否可渲染，默认是，为false时将不会渲染
  collisionable: boolean = true; //是否可检测碰撞，默认是，为false时将不会被检测

  dm: Davinci; //画布实例
  shape: Dshape | any = null; //允许是自定义图形数据或者是官方图形数据
  collider: Dcollider | any = null;
  zidx: number = 0;

  //纹理相关
  texture: string | null = null;
  texturePattern: CanvasPattern | null = null;
  textureComplete: boolean = false;
  textureSVG: SVGSVGElement | null = null; //纹理画布
  textureMatrix: DOMMatrix | null = null;
  textureSource: HTMLImageElement | null = null;

  //子角色模块
  children: Array<Dcharacter> = [];

  //父角色模块，若无则是默认画布
  parent: Dcharacter | null | undefined = null;

  //碰撞相关
  penetrate: boolean = false; //是否击穿，不会影响子级碰撞检测

  //渲染相关
  visiable: boolean = true; //是否可是，有别于renderable，visiable不影响子级

  //事件列
  onmousedown = new Map();
  onmouseup = new Map();
  onmousemove = new Map();
  onmouseenter = new Map();
  onmouseleave = new Map();

  ontextureonload: () => any = () => {
    this.dm.render();
  };

  constructor(data: Dcharacter_data, DM: Davinci) {
    //uid是不可更改的
    this.uid = +new Date() + Math.floor(Math.random() * (10000 - 1)) + 1;
    this.dm = DM;

    this.setData(data);

    //返回proxy
    return new Proxy(this, {
      set: function (target, key, value, receiver) {
        switch (key) {
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
          case "accumulateTransform":
            //不触发render
            Reflect.set(target, key, value, receiver);
            break;
          case "texture":
            Reflect.set(target, key, value, receiver);
            target.initTexture(value);
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
          case "zidx":
            //触发render
            Reflect.set(target, key, value, receiver);
            target.parent?.childrenSort();
            target.dm.render(); //注意，如果修改的是zidx，改变的实际是父级的内容，所以这里的uid需要用父级的
            break;
          case "onmouseenter":
            //不触发render
            throw Error('"onmouseenter" is Not modifiable!!!');
            break;
          case "onmouseleave":
            //不触发render
            throw Error('"onmouseleave" is Not modifiable!!!');
            break;
          case "onmousedown":
            //不触发render
            throw Error('"onmousedown" is Not modifiable!!!');
            break;
          case "onmouseup":
            //不触发render
            throw Error('"onmouseup" is Not modifiable!!!');
            break;
          case "onmousemove":
            //不触发render
            throw Error('"onmousemove" is Not modifiable!!!');
            break;
          case "dm":
            //不触发render
            throw Error('"dm" is Not modifiable!!!');
            break;
          default:
            Reflect.set(target, key, value, receiver);
            target.dm.render();
            //其余属性均需要触发render
            break;
        }
        return true;
      },
    });
  }

  //批量赋值，可以支持额外赋值自定义的属性
  setData(data: Dcharacter_data) {
    Object.keys(data).forEach((o) => {
      if (o === "focusX" || o === "focusY") {
        return;
      }
      this[o] = data[o] ?? this[o];
    });

    //对焦点做特殊处理
    if (data.width) {
      this.focusX = data.focusX ?? this.width / 2;
    } else {
      this.focusX = data.focusX ?? this.focusX;
    }

    if (data.height) {
      this.focusY = data.focusY ?? this.height / 2;
    } else {
      this.focusY = data.focusY ?? this.focusY;
    }

    //对纹理做特殊处理
    if (data.texture) {
      this.texture = data.texture;
      this.initTexture(data.texture);
    } else {
      this.textureComplete = true;
    }
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

  //计算使用变化矩阵后的实际坐标
  matrixCalc(x: number, y: number) {
    let matrix = this.accumulateTransform;
    let cX = matrix.a * x + -matrix.b * y + matrix.e;
    let cY = -matrix.c * x + matrix.d * y + matrix.f;
    return { x: cX, y: cY };
  }

  //初始化纹理
  initTexture(originTexture: string) {
    if (!originTexture) {
      return;
    }
    if (!this.textureSVG) {
      this.textureSVG = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      ); //纹理画布
      this.textureMatrix = this.textureSVG.createSVGMatrix();
    }
    if (!this.shape) {
      return;
    }
    if (!this.textureSource) {
      this.textureSource = new Image();
      this.textureSource.crossOrigin = "anonymous";
      this.textureComplete = false;
      this.textureSource.src = originTexture;
    } else {
      this.textureSource.src = originTexture;
    }

    this.textureSource.onload = () => {
      if (!this.shape) {
        return;
      }
      (this.textureSource as HTMLImageElement).width = this.width;
      (this.textureSource as HTMLImageElement).height = this.height;
      this.texturePattern = this.dm.Dctx.createPattern(
        this.textureSource as HTMLImageElement,
        "no-repeat"
      );

      this.textureComplete = true;

      this.ontextureonload();
      this.dm.globalTextureComplete(this.uid);
    };
  }

  //纹理渲染，默认将纹理图加载在元素的左上角
  textureRender(tX: number, tY: number, sX: number, sY: number, r: number) {
    if (!this.textureMatrix) {
      //纹理画布未初始化
      return;
    }
    if (!this.texture || !this.texturePattern) {
      //无纹理
      return;
    }
    this.texturePattern.setTransform(
      this.textureMatrix.translate(tX, tY).scale(sX, sY).rotate(r)
    );
  }

  //监听器
  addEventListener(type: Devent_type, fn: (event: Devent) => any) {
    this[`on${type}`].set(
      fn.name ||
        `fn${+new Date()}${Math.floor(Math.random() * (10000 - 1)) + 1}`,
      fn
    );
  }
  //删除监听器只需要输入函数名，匿名函数无法删除,如果不输入函数名称，则清空整个事件
  removeEventListener(type: Devent_type, fn_name?: string) {
    if (fn_name) {
      this[`on${type}`].delete(fn_name);
    } else {
      this[`on${type}`].clear();
    }
  }

  //添加子级
  addChild(data: Dcharacter | Array<Dcharacter>) {
    if (data instanceof Array) {
      let children = data;
      children.forEach((child) => {
        let res = this.children.every((o, idx) => {
          if (o.zidx > child.zidx) {
            this.children.splice(idx, 0, child);
            return false;
          } else {
            return true;
          }
        });
        if (res) {
          this.children.push(child);
        }
      });
      this.dm.render();
    } else {
      let child = data as Dcharacter;
      child.parent = this;
      let res = this.children.every((o, idx) => {
        if (o.zidx > child.zidx) {
          this.children.splice(idx, 0, child);
          this.dm.render();
          return false;
        } else {
          return true;
        }
      });
      if (res) {
        this.children.push(child);
        this.dm.render();
      }
    }
  }

  //删除子级
  deleteChild(child: Dcharacter) {
    this.children.every((o, idx) => {
      if (o.uid === child.uid) {
        this.children.splice(idx, 0);
        this.dm.render();
        return false;
      } else {
        return true;
      }
    });
  }

  //视觉图形渲染行为,可以由开发者自定义，也可以使用引擎提供的基础渲染函数
  rendering(Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D) {}
  //碰撞图形渲染行为,可以由开发者自定义，也可以使用引擎提供的基础渲染函数
  colliding(Dcharacter: Dcharacter, Sctx: CanvasRenderingContext2D) {}
  //在进入子级渲染之前的行为
  beforeChildrenRender(
    Dcharacter: Dcharacter,
    Dctx: CanvasRenderingContext2D
  ) {}
  //子级渲染循环结束后调用
  afterChildrenRender(Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D) {}
  //在进入子级碰撞之前的行为
  beforeChildrenCollider(
    Dcharacter: Dcharacter,
    Sctx: CanvasRenderingContext2D
  ) {}
  //子级碰撞循环结束后调用
  afterChildrenCollider(
    Dcharacter: Dcharacter,
    Sctx: CanvasRenderingContext2D
  ) {}

  //渲染本体的钩子函数
  beforeRender(Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D) {}
  afterRender(Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D) {}

  //碰撞本体的钩子函数
  beforeCollider(Dcharacter: Dcharacter, Sctx: CanvasRenderingContext2D) {}
  afterCollider(Dcharacter: Dcharacter, Sctx: CanvasRenderingContext2D) {}
}

export class Dshape {
  type: Dshape_type;
  path: Dpath;
  constructor(data: Dshape_data) {
    this.type = data.type;
    this.path = data.path;
  }
}

export class Dcollider extends Dshape {}
