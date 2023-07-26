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
};

declare type _type_arc = {
  positionX: number;
  positionY: number;
  radius: number;
  zIndex?: number;
  image?: string;
  fillColor?: string;
};

declare type _type_polygon = {
  positionX: number;
  positionY: number;
  pathList: Array<_type_coordinate>;
  zIndex?: number;
  image?: string;
  fillColor?: string;
};

declare type _type_shape = (_type_rect | _type_arc | _type_polygon) & {
  type: string;
  [key: string]: any;
};
