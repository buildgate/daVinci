declare type _type_coordinate = {
  x: number;
  y: number;
};

declare type _type_options = {
  coordinateTip?: boolean;
  lineColor?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  mode?: string;
};

declare type _type_rect = {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  zIndex?: number;
  image?: string;
  fillColor?: string;
  patternOrigin?: HTMLImageElement;
  pattern?: CanvasPattern;
};

declare type _type_arc = {
  positionX: number;
  positionY: number;
  radius: number;
  zIndex?: number;
  image?: string;
  fillColor?: string;
  patternOrigin?: HTMLImageElement;
  pattern?: CanvasPattern;
};

declare type _type_polygon = {
  positionX: number;
  positionY: number;
  pathList: Array<_type_coordinate>;
  zIndex?: number;
  image?: string;
  maxWidth?: number;
  maxHeight?: number;
  fillColor?: string;
  patternOrigin?: HTMLImageElement;
  pattern?: CanvasPattern;
  patternOffsetX?: number; //底图对于第一个点的偏移量
  patternOffsetY?: number;
};

declare type _type_shape = (_type_rect | _type_arc | _type_polygon) & {
  type: string;
  [key: string]: any;
};

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

//角色对象类型
type Dcharacter_data = {
  autoRender?: boolean;
  id?: string | number | symbol;
  name?: string | number;
  position?: string;
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
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  opacity?: number;
};

//事件类型
type Devent = {
  x: number;
  y: number;
  preX: number;
  preY: number;
  type: Devent_type;
  preTarge: Dcharacter;
  //后续有更多内容
};
type Devent_type =
  | "mouseenter"
  | "mouseleave"
  | "mousedown"
  | "mouseup"
  | "mousemove";

//
type Doptions = {
  width?: number;
  height?: number;
};
