#### !!重大更新 1.1.0 快照渲染暂时删除。考虑到 getImageData 和 putImageData 的效率比较消耗性能，而且生成的 imageData 是无压缩数据，占用空间将会很大，当角色数量增加时，占用空间和性能花销会逐渐使得快照渲染无优势，这样反而会本末倒置，所以暂时取消快照渲染，后续考虑使用脏矩形渲染作为性能优化的替代，对于多个重复的元素建议使用自定义渲染来提升性能。

# Davinci 轻量级 canvas 交互引擎

## 主要类型&方法

### Dshape

视觉图形类：用于定义视图部分的形状，所有图形都可以使用透明图片等效替换,但是内置的阴影渲染是基于视觉图形生成的。

```typescript
class Dshape {
  type: Dshape_type; //目前支持rect,arc,polygon，其中多边形也支持直线和贝塞尔曲线混合使用，但是最终也会形成一个闭合图形
  path: Dpath; //路径类型
}
```

### Dcollider

碰撞类：用于定义触发鼠标事件的触发形状，可以与视觉图形不一致

目前碰撞类继承于视觉图形类，所以可以大部分情况可以与视觉类一同使用

```typescript
class Dcollider {
  type: Dshape_type; //目前支持rect,arc,polygon
  path: Dpath; //路径类型
}
```

### Dcharacter

角色类：是视觉类和碰撞类的载体，角色类需要绑定在画布类里才有实际作用

<font color=#F56C6C>！！注意！！</font>因为角色类返回的是 proxy 类型，所以除了少部分属性不会触发视图渲染外，其他属性均会触发视图渲染。

由于现在渲染器已经使用了按帧渲染的方法，所以即使同一时间多次赋值也可以拥有良好的性能；并且不会因为数据被节流而导致渲染落后的问题，因为渲染函数可以确保每次渲染完之后都会去检测是否有等待队列，
如果存在等待队列就会再进行下一次渲染，堆积的数据修改也会全部渲染，算法也经过优化，依然可以使用快照渲染。

值得注意的一点是如果是使用快照渲染，那么在更改 zidx 时候传入的 uid 应该为父级的 uid，因为改变 zidx 实际上改变的是父级的 children 排序，如果不能确定传入的 uid 则可以使用全局渲染，但渲染性能依然没有快照渲染；

开发依然可以通过设置 Davinci 类的 allowrender 控制渲染时机，取决于使用场景是否需要等待外部函数。

```typescript
class Dcharacter {
  position: string = "relative"; //定位类型
  uid: number; //唯一ID，不可修改
  id: string | number | symbol = "";
  name: string | number = "";
  width: number = 100; //宽度和高度都会影响焦点的生成，只在渲染阶段起效，影响焦点位置
  height: number = 100;
  x: number = 0; //相对父级的位置
  y: number = 0;
  focusX: number = 0; //焦点位置，初始化的时候会与宽度同步修改，尽量避免修改
  focusY: number = 0;
  fillColor: CanvasFillStrokeStyles["fillStyle"] = "#000000"; //填充颜色

  shadowColor: string = "#000000"; //阴影选项
  shadowBlur: number = 0;
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;

  dm: davinci; //画布实例，实例化时传入
  shape: Dshape | any = null; //允许是自定义图形数据或者是官方图形数据，实际上可以是任何需要保存在角色类中的数据，例如需要粒子渲染时候可以定义一些额外的参数
  collider: Dcollider | any = null; //允许是自定义图形数据或者是官方图形数据，类比shape
  zidx: number = 0; //视觉层级，只在同层有效
  snapshot: ImageData | null = null; //快照缓存，请勿主动修改，涉及性能问题！！

  //纹理相关
  texture: string | null = null; //纹理地址，可以是本地也可以是网络图片

  texturePattern: CanvasPattern | null = null; //以下纹理相关的内容请勿主动修改！！
  textureComplete: boolean = false;
  textureSVG: SVGSVGElement | null = null; //纹理画布
  textureMatrix: DOMMatrix | null = null;
  textureSource: HTMLImageElement | null = null;

  //子角色模块
  children: Array<Dcharacter> = []; //子级，请使用addChild方法添加，否则会有乱序可能

  //父角色模块，若无则是默认画布
  parent: Dcharacter | null | undefined = null; //自动赋值

  scaleX: number = 1; //现在缩放和旋转已经支持应用到子角色上了，！！注意！！变换顺序是位移，缩放，旋转，所以最终本体的坐标系是参照父级元素的。如果需要设置位移可以设置x和y
  scaleY: number = 1; //这四项变化都会影响到子级
  rotate: number = 0;
  opacity: number = 1;

  accumulateTransform: DOMMatrix = new DOMMatrix(); //累计形变，用来计算实际坐标

  renderable: boolean = true; //是否可渲染，默认是，为false时将不会渲染

  //以下两项函数也会在初始化时赋值，所以放在此处解析；如果需要渲染，请务必为这两个函数赋值
  //视觉图形渲染行为,可以由开发者自定义，也可以使用引擎提供的基础渲染函数,此函数将会在渲染本层视觉图形时调用，渲染过程可以自行控制，如果不设置则会直接进行子级的渲染，但是形变依然会继承到下一层
  rendering(Dcharacter: Dcharacter) {}
  //碰撞图形渲染行为,可以由开发者自定义，也可以使用引擎提供的基础渲染函数,此函数将会在渲染本层碰撞图形时调用，渲染过程可以自行控制，如果不设置则会直接进行子级的渲染，但是形变依然会继承到下一层
  colliding(Dcharacter: Dcharacter) {}

  //在进入子级渲染之前的行为
  beforeChildrenRender(Dcharacter: Dcharacter) {}
  //子级渲染循环结束后调用
  afterChildrenRender(Dcharacter: Dcharacter) {}
  //在进入子级碰撞之前的行为
  beforeChildrenCollider(Dcharacter: Dcharacter) {}
  //子级碰撞循环结束后调用
  afterChildrenCollider(Dcharacter: Dcharacter) {}

  //渲染本体的钩子函数,注意渲染是先渲染本体再渲染子级的
  beforeRender(Dcharacter: Dcharacter) {}
  afterRender(Dcharacter: Dcharacter) {}

  //碰撞本体的钩子函数，检测碰撞是先检测子级再检测本体的
  beforeCollider(Dcharacter: Dcharacter) {}
  afterCollider(Dcharacter: Dcharacter) {}
}
```

#### 方法(对外暴露的方法，其他内置方法请勿随意调用)

```typescript

  //初始化数据使用，也可以用作批量设置时使用，因为函数会先停止自动渲染，赋值完后再把自动渲染的开关设置为原来的值;
  //DM值是当前画布对象，如非必要尽量不要更改，否则可能会出现一些未知的问题,建议只修改data
  setData(data: Dcharacter_data, DM?: Davinci){...}

 //监听器 目前支持mouseenter,mouseleave,mousemove,mousedown,mouseup,交互内容在此设置
  addEventListener(type: Devent_type, fn: (event: Devent) => any){...}

  //删除监听器只需要输入函数名，匿名函数无法删除,如果不输入函数名称，则清空整个事件
  removeEventListener(type: Devent_type, fn?: string){...}

  //添加子级
  addChild(child: Dcharacter){...}

  //删除子级
  deleteChild(child: Dcharacter){...}

  //子角色对象排序，按照zidx由小到大排序
  childrenSort(order: string = "asc"){...}

  //
```

### Davinci

主类：引擎的主类，所有事件均依赖这个类型触发

```typescript
class Davinci {
  Dcanvas = document.createElement("canvas"); //表画布
  Dcontainer = document.createElement("div");
  Dctx = this.Dcanvas.getContext("2d", {
    alpha: true,
    willReadfrontly: true,
  }) as CanvasRenderingContext2D;
  originElement: Element | null = null; //用于存放基础元素

  Scanvas = document.createElement("canvas"); //里画布,用于计算碰撞体
  Sctx = this.Scanvas.getContext("2d") as CanvasRenderingContext2D;

  Dboard: Dcharacter; //实例化时会自动构建画布的角色类

  allowRender: boolean = true; //是否允许渲染
  collisionDetect: boolean = false; //碰撞检测开关，默认为false，防止误触需要手动开启

  //画布设置
  width: number = 500;
  height: number = 500;
  globalCompositeOperation = "source-over";

  //鼠标事件参数
  x = 0;
  y = 0;
  preX = 0;
  preY = 0;
  mousetype = null;
  currentTarget: Dcharacter | null | undefined = null; //存放当前事件对象
  preTarget: Dcharacter | null | undefined = null; //存放上一次事件对象
}
```

#### 方法(对外暴露的方法，其他内置方法请勿随意调用)

```typescript
//用与设置画布的宽高,同时会改变底层画布交互对象的宽高,需要主动调用render才会重新渲染
  setData(options?: Doptions)

 //全局渲染,如果输入uid则只会渲染目标的上层，下层对象将会使用快照渲染，速度会快很多，请尽量使用uid进行渲染；
  render(uid?: number){...}

//全局纹理加载检测,uid可以随意输入，只是作为一个调用反馈的存在，加载完成后将会调用onGlobalTextureComplete
  globalTextureComplete(uid: number){...}

  //全局纹理加载完成后调用
  onGlobalTextureComplete() {}
```

## 使用方法 Demo

```typescript
import { Dcharacter, Davinci, Dshape } from "./plugins/davinci-engine.ts";

const demo = new Davinci("#app");

let shape = new Dshape({
  type: "rect",
  path: { width: 200, height: 300 },
});

let rect = new Dcharacter(
  {
    x: 10,
    y: 10,
    width: 200,
    height: 300,
    fillColor: "red",
    shape: shape,
    collider: shape, //因为碰撞类是继承于视觉图形的，可以直接使用同一个路径对象
  },
  demo
);

demo.Dboard.addChild(rect);

let shape2 = new Dshape({
  type: "arc",
  path: { radius: 50 },
});
let arc = new Dcharacter(
  {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fillColor: "black",
    shape: shape2,
    collider: shape2,
    //纹理的优先级会高于纯颜色填充，所以会覆盖black
    texture:
      "https://img1.baidu.com/it/u=1458656822,2078909008&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750",
  },
  demo
);

rect.addEventListener("mousedown", () => {
  arc.texture =
    "https://img1.baidu.com/it/u=2328766673,3584364392&fm=253&fmt=auto?w=130&h=170";
});

arc.addEventListener("mousedown", () => {
  console.log("mousedown");
});
arc.addEventListener("mouseup", () => {
  arc.x += 20;
});
arc.addEventListener("mouseenter", () => {
  console.log("mouseenter");
});
arc.addEventListener("mouseleave", () => {
  console.log("mouseleave");
});

rect.addChild(arc);

//因为这里有图片做纹理，所以需要调用纹理加载作为初始化调用
demo.onGlobalTextureComplete = () => {
  demo.collisionDetect = true; //必须手动开启，因为是放误触的设计
  demo.allowRender = true; //允许渲染
  demo.render(); //开始渲染
};
```

## 设计思路

这个轻量级引擎得益于本人此前接触过其他入 unity 开发引擎，设计思路也从中获得灵感。

首先将画布里的元素抽象出来，因为画布并不像 DOM 一样，画布在渲染后就完全不会再托管里面的内容，只会保留路径，路径其实也没有托管起来，只是暂存起来而已。将元素抽象出来后，就需要区分视觉层和交互层。视觉层只在渲染的时候处理，交互层是触发鼠标事件的时候处理。二者相互独立，由抽象元素沟通。实际上这个设计方案有点像 vue 使用了 vnode 的方案，频繁渲染视觉层必然会消耗巨大的性能，相对来说交互层的耗能是非常小的，因为每次只需要关注一个元素即可。

完成元素的抽象化处理之后就要面对更多细节的问题。纹理渲染是一个很重要的部分，如果实现纹理渲染之后，完全可以将所有视觉层等效替换，不过这样对美工的要求比较高，所以我保留了视觉层的图形选项，这样也有利于使用精灵图渲染。因为画布的 pattern 的位置是永远在（0，0）的位置开始渲染的，所以当元素位移变换时就会出现渲染问题，最终在查阅了很多资料后，发现可以使用 svg 对 pattern 进行变换，所以最后就使用了局部 svg 的方案。

最后就是任何程序都面临的一个问题：性能。如果每次渲染从底层开始绘制，那么当图形路径很复杂或者图形变换速度很快时，必然导致巨大的计算量。最后我发现是可以将每一层的画布缓存起来，每次渲染都缓存一次，每次画布元素变化时传入 uid，如果是 uid 的下层则不重新渲染，本层这使用缓存，上层则重新渲染，这样就可以加速渲染了。虽然这种做法会牺牲更多的存储空间，但是对于需要频繁操作的画布，用空间换速度是值得的。

后续会加入更多便利性的内容，并且会封装层 npm 插件
