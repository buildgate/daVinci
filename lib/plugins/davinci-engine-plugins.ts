import { Dcharacter } from "../davinci-engine.js";

//普通矩形视觉图形绘制
export function shapeMethodRect(Dcharacter: Dcharacter) {
  let shape = (Dcharacter.shape as Dshape_data_rect).path;
  Dcharacter.dm.Dctx.beginPath();
  Dcharacter.dm.Dctx.rect(
    -Dcharacter.focusX,
    -Dcharacter.focusY,
    shape.width,
    shape.height
  );

  if (Dcharacter.texture) {
    Dcharacter.textureRender();
    Dcharacter.dm.Dctx.fillStyle =
      Dcharacter.texturePattern || Dcharacter.dm.Dctx.fillStyle;
  } else {
    Dcharacter.dm.Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dcharacter.dm.Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dcharacter.dm.Dctx.shadowColor = Dcharacter.shadowColor;
  Dcharacter.dm.Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dcharacter.dm.Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  Dcharacter.dm.Dctx.fill();
}
//普通圆形视觉图形绘制
export function shapeMethodArc(Dcharacter: Dcharacter) {
  let shape = (Dcharacter.shape as Dshape_data_arc).path;
  Dcharacter.dm.Dctx.beginPath();
  Dcharacter.dm.Dctx.arc(0, 0, shape.radius, 0, Math.PI * 2);

  if (Dcharacter.texture) {
    Dcharacter.textureRender();
    Dcharacter.dm.Dctx.fillStyle =
      Dcharacter.texturePattern || Dcharacter.dm.Dctx.fillStyle;
  } else {
    Dcharacter.dm.Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dcharacter.dm.Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dcharacter.dm.Dctx.shadowColor = Dcharacter.shadowColor;
  Dcharacter.dm.Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dcharacter.dm.Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  Dcharacter.dm.Dctx.fill();
}
//普通多边形视觉图形绘制
export function shapeMethodPolygon(Dcharacter: Dcharacter) {
  let shape = (Dcharacter.shape as Dshape_data_polygon).path;
  Dcharacter.dm.Dctx.beginPath();
  Dcharacter.dm.Dctx.moveTo(shape[0][0], shape[0][1]);
  shape.forEach((point) => {
    if (point.length === 2) {
      Dcharacter.dm.Dctx.lineTo(point[0], point[1]);
    }
    if (point.length === 4) {
      Dcharacter.dm.Dctx.quadraticCurveTo(
        point[0],
        point[1],
        point[2],
        point[3]
      );
    }
    if (point.length === 6) {
      Dcharacter.dm.Dctx.bezierCurveTo(
        point[0],
        point[1],
        point[2],
        point[3],
        point[4],
        point[5]
      );
    }
  });
  Dcharacter.dm.Dctx.closePath();

  if (Dcharacter.texture) {
    Dcharacter.textureRender();
    Dcharacter.dm.Dctx.fillStyle =
      Dcharacter.texturePattern || Dcharacter.dm.Dctx.fillStyle;
  } else {
    Dcharacter.dm.Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dcharacter.dm.Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dcharacter.dm.Dctx.shadowColor = Dcharacter.shadowColor;
  Dcharacter.dm.Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dcharacter.dm.Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  Dcharacter.dm.Dctx.fill();
}

//普通矩形碰撞图形绘制
export function colliderMethodRect(Dcharacter: Dcharacter) {
  let collider = (Dcharacter.collider as Dshape_data_rect).path;
  Dcharacter.dm.Sctx.beginPath();
  Dcharacter.dm.Sctx.rect(
    -Dcharacter.focusX,
    -Dcharacter.focusY,
    collider.width,
    collider.height
  );
}
//普通圆形碰撞图形绘制
export function colliderMethodArc(Dcharacter: Dcharacter) {
  let collider = (Dcharacter.collider as Dshape_data_arc).path;
  Dcharacter.dm.Sctx.beginPath();
  Dcharacter.dm.Sctx.arc(0, 0, collider.radius, 0, Math.PI * 2);
}
//普通多边形碰撞图形绘制
export function colliderMethodPolygon(Dcharacter: Dcharacter) {
  let collider = (Dcharacter.collider as Dshape_data_polygon).path;
  Dcharacter.dm.Sctx.beginPath();
  Dcharacter.dm.Sctx.moveTo(collider[0][0], collider[0][1]);
  collider.forEach((point) => {
    if (point.length === 2) {
      Dcharacter.dm.Sctx.lineTo(point[0], point[1]);
    }
    if (point.length === 4) {
      Dcharacter.dm.Sctx.quadraticCurveTo(
        point[0],
        point[1],
        point[2],
        point[3]
      );
    }
    if (point.length === 6) {
      Dcharacter.dm.Sctx.bezierCurveTo(
        point[0],
        point[1],
        point[2],
        point[3],
        point[4],
        point[5]
      );
    }
  });
  Dcharacter.dm.Sctx.closePath();
}
