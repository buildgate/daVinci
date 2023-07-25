declare interface _type_coordinate {
  x: number;
  y: number;
}

declare interface _type_options {
  coordinateTip?: boolean;
  lineColor?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  mode?: string;
}

declare interface _type_shape {
  hashID: string | number;
  type: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  radius?: number;
  fillColor?: string;
  pathList?: Array<_type_coordinate>;
  originImage?: any;
  zIndex: number;
}
