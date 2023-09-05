//引擎类

//坐标类型
type Dcoordinate = {
  x: number;
  y: number;
};

//图形类型
type Dshape_type = "rect" | "arc" | "polygon";

//图形路径类型
type Dpath_rect = {
  width: number;
  height: number;
};
type Dpath_arc = {
  radius: number;
};
type Dpath_polygon = Array<
  | [number, number]
  | [number, number, number, number]
  | [number, number, number, number, number, number]
>;
type Dpath = Dpath_rect | Dpath_arc | Dpath_polygon;

//图形数据类型
type Dshape_data_rect = {
  type: "rect";
  path: Dpath_rect;
};
type Dshape_data_arc = {
  type: "arc";
  path: Dpath_arc;
};
type Dshape_data_polygon = {
  type: "polygon";
  path: Dpath_polygon;
};
type Dshape_data = Dshape_data_rect | Dshape_data_arc | Dshape_data_polygon;

//角色对象类型固有属性
type Dcharacter_data = {
  [key: string]: any;
  id?: string | number | symbol;
  name?: string | number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  focusX?: number;
  focusY?: number;
  shape?: Dshape;
  collider?: Dcollider;
  fillColor?: CanvasFillStrokeStyles["fillStyle"];
  texture?: string;
  parent?: Dcharacter;
  zidx?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  opacity?: number;
  renderable?: boolean;
  penetrate?: boolean;
  strokeStyle?: CanvasRenderingContext2D["strokeStyle"];
  lineWidth?: number;
  lineCap?: CanvasRenderingContext2D["lineCap"];
  lineDashOffset?: CanvasRenderingContext2D["lineDashOffset"];
  lineJoin?: CanvasRenderingContext2D["lineJoin"];
  miterLimit?: CanvasRenderingContext2D["miterLimit"];

  text?: string | null;
  textStroke?: boolean;
  font?: CanvasRenderingContext2D["font"];
  textAlign?: CanvasRenderingContext2D["textAlign"];
  textBaseline?: CanvasRenderingContext2D["textBaseline"];
  direction?: CanvasRenderingContext2D["direction"];
  textMaxWidth?: number | null = null;
  fontColor?: CanvasRenderingContext2D["fillStyle"];
  fontStrokeColor?: CanvasRenderingContext2D["fillStyle"];
  textOffsetX?: number;
  textOffsetY?: number;
  fontStrokeLineWidth?: number;

  filter?: CanvasRenderingContext2D["filter"];

  rendering?: (...rest: any) => void;
  colliding?: (...rest: any) => void;
  beforeChildrenRender?: (...rest: any) => void;
  afterChildrenRender?: (...rest: any) => void;
  beforeChildrenCollider?: (...rest: any) => void;
  afterChildrenCollider?: (...rest: any) => void;

  beforeRender?: (...rest: any) => void;
  afterRender?: (...rest: any) => void;

  beforeCollider?: (...rest: any) => void;
  afterCollider?: (...rest: any) => void;
};

//事件类型
type Devent = {
  x: number;
  y: number;
  preX: number;
  preY: number;
  type: Devent_type;
  preTarget: Dcharacter | null | undefined;
  originEvent: any; //原生事件源
  //后续有更多内容
};
type Devent_type =
  | "mouseenter"
  | "mouseleave"
  | "mousedown"
  | "mouseup"
  | "mousemove"
  | "wheel";

//
type Davinci_data = {
  width?: number;
  height?: number;
};

type request_render_data = {
  uid: number;
  attribute: string;
  value: any;
};
