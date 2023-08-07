//引擎类

//坐标类型
type Dcoordinate = {
  x: number;
  y: number;
};

//碰撞图形类型
type Dshape_type = "rect" | "arc" | "polygon" | "composite";

//碰撞图形路径类型
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

//碰撞图形数据类型
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
  autoRender?: boolean;
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
  penetrate?: boolean;
  shapePaintingMethod?: (...rest: any) => void;
  colliderPaintingMethod?: (...rest: any) => void;
};

//事件类型
type Devent = {
  x: number;
  y: number;
  preX: number;
  preY: number;
  type: Devent_type;
  preTarget: Dcharacter | null | undefined;
  //后续有更多内容
};
type Devent_type =
  | "mouseenter"
  | "mouseleave"
  | "mousedown"
  | "mouseup"
  | "mousemove";

//
type Davinci_data = {
  width?: number;
  height?: number;
};
