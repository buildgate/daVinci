export class Davinci {
  Dcanvas = document.createElement("canvas"); //表画布
  Dcontainer = document.createElement("div");
  Dctx = this.Dcanvas.getContext("2d", {
    alpha: true,
    willReadfrontly: true,
  }) as CanvasRenderingContext2D;
  originElement: Element | null = null;

  Scanvas = document.createElement("canvas"); //里画布,用于计算碰撞体
  Sctx = this.Scanvas.getContext("2d") as CanvasRenderingContext2D;

  DcanvasCharacter: Dcharacter; //必须建立一个基础元素

  allowRender: boolean = true; //防止初始化时多次渲染，默认为false
  collisionDetect: boolean = false; //碰撞检测开关，默认为false，防止误触需要手动开启

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
  currentTarget: Dcharacter | null | undefined = null;
  preTarget: Dcharacter | null | undefined = null;

  //节流相关
  nextRenderUid: number = 0;
  nextRenderAll: boolean = false;
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

  constructor(fundElement: string, options?: Doptions) {
    let self = this;

    this.Dcanvas.setAttribute("crossOrigin", "use-credentials");
    this.originElement = document.querySelector(fundElement);

    this.Dcontainer.className = "davinci_container";
    this.Dcanvas.className = "davinci_body";

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

    this.initData(options);

    this.initEventTrigger();

    //基础元素载入
    this.Dcontainer.append(this.Dcanvas);
    this.originElement?.append(this.Dcontainer);
  }

  //初始化必须的数据
  initData(options?: Doptions) {
    this.width = options?.width || this.width;
    this.height = options?.height || this.height;

    this.Dcanvas.width = this.width;
    this.Dcanvas.height = this.width;

    this.Scanvas.width = this.width;
    this.Scanvas.height = this.height;

    this.DcanvasCharacter.width = this.width;
    this.DcanvasCharacter.height = this.height;
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
          preTarge: this.preTarget,
        };
        this.currentTarget = this.DcanvasCharacter.colliderTrigger(
          Devent,
          0,
          0,
          true
        );
        if (!this.currentTarget && this.preTarget) {
          Devent = {
            x: e.offsetX,
            y: e.offsetY,
            preX: this.preX,
            preY: this.preY,
            type: "mouseleave",
            preTarge: null,
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
        preTarge: this.currentTarget,
      };
      this.currentTarget = this.DcanvasCharacter.colliderTrigger(
        Devent,
        0,
        0,
        true
      );
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
        preTarge: this.currentTarget,
      };
      this.currentTarget = this.DcanvasCharacter.colliderTrigger(
        Devent,
        0,
        0,
        true
      );
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
        preTarge: this.currentTarget,
      };

      this.currentTarget = this.DcanvasCharacter.colliderTrigger(
        Devent,
        0,
        0,
        true
      );

      this.currentTarget?.onmouseleave.forEach((o) => {
        o(event);
      });
    });
  }

  //全局渲染
  render(uid?: number) {
    if (!this.allowRender) {
      return;
    }

    if (!this.block) {
      this.block = true;
      this.Dctx.clearRect(0, 0, this.width, this.height);
      this.nextRenderUid = 0;
      this.nextRenderAll = false;
      this.DcanvasCharacter.render(0, 0, uid);

      window.requestAnimationFrame(() => {
        this.block = false;

        if (this.nextRenderUid === 0) {
          return;
        } else {
          if (this.nextRenderAll) {
            this.render();
          } else {
            this.render(this.nextRenderUid);
          }
        }
      });
    } else {
      if (this.nextRenderAll) {
        return;
      }
      if (!uid) {
        this.nextRenderAll = true;
        return;
      }
      this.nextRenderAll = this.nextRenderUid !== uid || this.nextRenderAll;
      this.nextRenderUid = uid;
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
    if (check(this.DcanvasCharacter)) {
      this.onGlobalTextureComplete();
    }
  }

  //全局纹理加载完成后调用
  onGlobalTextureComplete() {}
}

export class Dcharacter {
  [key: string]: any;
  position: string = "relative";
  uid: number;
  id: string | number | symbol = +new Date();
  name: string | number = "";
  width: number = 100;
  height: number = 100;
  x: number = 0;
  y: number = 0;
  realX: number = 0; //相对于画布的定位，私自修改无意义，只是一个参考值
  realY: number = 0;
  focusX: number = 0;
  focusY: number = 0;
  fillColor: CanvasFillStrokeStyles["fillStyle"] = "#000000";
  shadow = {
    color: "#000000",
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  };

  dm: Davinci; //画布实例
  shape: Dshape | null = null;
  collider: Dcollider | null = null;
  zidx: number = 0;
  snapshot: ImageData | null = null;

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

  //事件列
  onmousedown = new Map();
  onmouseup = new Map();
  onmousemove = new Map();
  onmouseenter = new Map();
  onmouseleave = new Map();
  // onmouseover: (event: Devent) => any = () => {}; 未支持

  ontextureonload: () => any = () => {
    this.dm.render(this.uid);
  };

  onkeydown: (event: Devent) => any = () => {};
  onkeyup: (event: Devent) => any = () => {};

  constructor(data: Dcharacter_data, DM: Davinci) {
    //uid是不可更改的
    this.uid = +new Date() + Math.floor(Math.random() * (10000 - 1)) + 1;
    this.dm = DM;

    this.initData(data);

    //返回proxy
    return new Proxy(this, {
      set: function (target, key, value, receiver) {
        switch (key) {
          case "width":
            Reflect.set(target, "focusX", value / 2, receiver);
            target.dm.render(target.uid);
            //触发render
            break;
          case "height":
            Reflect.set(target, "focusY", value / 2, receiver);
            target.dm.render(target.uid);
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
            target.dm.render(target.parent?.uid); //注意，如果修改的是zidx，改变的实际是父级的内容，所以这里的uid需要用父级的
            break;
          case "snapshot":
            //不触发render
            Reflect.set(target, key, value, receiver);
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
          case "realX":
            //不触发render
            Reflect.set(target, key, value, receiver);
            break;
          case "realY":
            //不触发render
            Reflect.set(target, key, value, receiver);
            break;
          default:
            Reflect.set(target, key, value, receiver);
            target.dm.render(target.uid);
            //其余属性均需要触发render
            break;
        }
        return true;
      },
    });
  }

  //初始化数据
  initData(data: Dcharacter_data, DM?: Davinci) {
    const self = this;
    //先停止自动渲染，批量赋值完成后就设置回来

    this.dm = DM || this.dm;

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.fillColor = data.fillColor || this.fillColor;
    this.shape = data.shape || this.shape;
    this.collider = data.collider || this.collider;
    this.width = data.width || this.width;
    this.height = data.height || this.height;
    this.x = data.x || this.x;
    this.y = data.y || this.y;
    this.focusX = data.focusX || this.width / 2;
    this.focusY = data.focusY || this.height / 2;
    this.zidx = data.zidx || this.zidx;
    this.position = data.position || this.position;

    this.shadow = data.shadow ? { ...data.shadow } : this.shadow;

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

    this.textureSource.onload = (e) => {
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

  //渲染器，区分快照渲染和常规渲染
  render(relativeX: number = 0, relativeY: number = 0, snapshotID?: number) {
    let found = false; //判断是否已经找到快照渲染的对象
    if (!this.dm.allowRender) {
      //中断渲染
      return found;
    }

    let rX = this.position === "relative" ? relativeX : 0;
    let rY = this.position === "relative" ? relativeY : 0;

    this.realX = rX + this.x; //赋值实际的x
    this.realY = rY + this.y; //赋值实际Y

    if (!this.snapshot) {
      //若无快照，证明是第一次渲染，那么先保存快照，然后子级全部不使用快照渲染
      this.snapshot = this.dm.Dctx.getImageData(
        0,
        0,
        this.dm.width,
        this.dm.height
      );
    } else {
      //若有快照，则先检测是否快照渲染的对象
      if (snapshotID) {
        if (snapshotID === this.uid) {
          //uid匹配则后面全部使用常规渲染
          this.dm.Dctx.putImageData(this.snapshot, 0, 0);
          found = true;
        } else {
          this.children.forEach((o) => {
            //循环没个子级，如果在子级中找到目标，则返回true
            if (found) {
              o.render(this.x + rX, this.y + rY);
            } else {
              found = o.render(this.x + rX, this.y + rY, snapshotID) || found;
            }
          });
          return found;
        }
      } else {
        //无目标id则常规渲染，先保存当前快照
        this.snapshot = this.dm.Dctx.getImageData(
          0,
          0,
          this.dm.width,
          this.dm.height
        );
      }
    }

    if (!this.shape) {
      //没有图形不作渲染
      this.children.forEach((o) => {
        o.render(this.x + rX, this.y + rY);
      });
      return found;
    }

    let shape;
    this.dm.Dctx.beginPath();

    switch (this.shape.type) {
      case "rect":
        shape = (this.shape as Dshape_data_rect).path;
        this.dm.Dctx.rect(
          this.x + rX + this.focusX - shape.width / 2,
          this.y + rY + this.focusY - shape.height / 2,
          shape.width,
          shape.height
        );
        break;
      case "arc":
        shape = (this.shape as Dshape_data_arc).path;
        this.dm.Dctx.arc(
          this.x + rX + this.focusX,
          this.y + rY + this.focusY,
          shape.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        shape = (this.shape as Dshape_data_polygon).path;
        this.dm.Dctx.moveTo(
          shape.pointList[0].x + this.x + rX,
          shape.pointList[0].y + this.y + rY
        );
        shape.pointList.forEach((point) => {
          this.dm.Dctx.lineTo(point.x + this.x + rX, point.y + this.y + rY);
        });
        this.dm.Dctx.closePath();
        break;
      default:
        break;
    }
    if (this.texture) {
      this.textureRender(rX, rY);
      this.dm.Dctx.fillStyle = this.texturePattern || this.dm.Dctx.fillStyle;
    } else {
      this.dm.Dctx.fillStyle = this.fillColor;
    }

    this.dm.Dctx.shadowBlur = this.shadow.blur;
    this.dm.Dctx.shadowColor = this.shadow.color;
    this.dm.Dctx.shadowOffsetX = this.shadow.offsetX;
    this.dm.Dctx.shadowOffsetY = this.shadow.offsetY;

    this.dm.Dctx.fill();

    this.children.forEach((o) => {
      o.render(this.x + rX, this.y + rY);
    });

    return found;
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
    if (!this.texture || !this.texturePattern) {
      //无纹理
      return;
    }
    this.texturePattern.setTransform(
      this.textureMatrix.translate(this.x + rx, this.y + rY)
    );
  }

  //判断是否当前目标，并优先返回顶层对象，默认阻止冒泡
  colliderTrigger(
    event: Devent,
    relativeX: number = 0,
    relativeY: number = 0,
    stop: boolean = true
  ): Dcharacter | undefined {
    if (!this.dm.collisionDetect) {
      return;
    }

    let rx = this.position === "relative" ? relativeX : 0;
    let rY = this.position === "relative" ? relativeY : 0;

    let currentTarget: Dcharacter | undefined = undefined;
    if (this.children.length) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        currentTarget = this.children[i].colliderTrigger(
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

    if (!this.collider) {
      //没有图形不作渲染
      return currentTarget;
    }

    this.dm.Sctx.beginPath();
    let collider;
    switch (this.collider.type) {
      case "rect":
        collider = (this.collider as Dshape_data_rect).path;
        this.dm.Sctx.rect(
          this.x + rx + this.focusX - collider.width / 2,
          this.y + rY + this.focusY - collider.height / 2,
          collider.width,
          collider.height
        );
        break;
      case "arc":
        collider = (this.shape as Dshape_data_arc).path;
        this.dm.Sctx.arc(
          this.x + rx + this.focusX,
          this.y + rY + this.focusY,
          collider.radius,
          0,
          Math.PI * 2
        );
        break;
      case "polygon":
        collider = (this.shape as Dshape_data_polygon).path;
        this.dm.Sctx.moveTo(
          collider.pointList[0].x + this.x + rx,
          collider.pointList[0].y + this.y + rY
        );
        collider.pointList.forEach((point) => {
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
          if (event.preTarge?.uid !== this.uid) {
            nextEvent.preTarge = this;
            nextEvent.type = "mouseleave";
            event.preTarge?.onmouseleave.forEach((o: any) => {
              o(event);
            });
            this.onmouseenter.forEach((o) => {
              o(event);
            });
          } else {
            this.onmousemove.forEach((o) => {
              o(event);
            });
          }
          break;
        case "mousedown":
          this.onmousedown.forEach((o) => {
            o(event);
          });
          break;
        case "mouseup":
          this.onmouseup.forEach((o) => {
            o(event);
          });
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
  addChild(child: Dcharacter) {
    child.parent = this;
    let res = this.children.every((o, idx) => {
      if (o.zidx > child.zidx) {
        this.children.splice(idx, 0, child);
        this.dm.render(this.uid);
        return false;
      } else {
        return true;
      }
    });
    if (res) {
      this.children.push(child);
      this.dm.render(this.uid);
    }
  }

  //删除子级
  deleteChild(child: Dcharacter) {
    this.children.every((o, idx) => {
      if (o.uid === child.uid) {
        this.children.splice(idx, 0);
        this.dm.render(this.uid);
        return false;
      } else {
        return true;
      }
    });
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

export class Dcollider extends Dshape {}
