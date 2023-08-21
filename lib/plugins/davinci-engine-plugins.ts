import { Dcharacter, Davinci, Dshape } from "../davinci-engine.js";

//普通矩形视觉图形绘制
export function shapeMethodRect(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  let shape = (Dcharacter.shape as Dshape_data_rect).path;
  Dctx.beginPath();
  Dctx.rect(-Dcharacter.focusX, -Dcharacter.focusY, shape.width, shape.height);

  Dctx.save();
  if (Dcharacter.texture) {
    Dcharacter.textureRender(-Dcharacter.focusX, -Dcharacter.focusY, 1, 1, 0);
    Dctx.fillStyle = Dcharacter.texturePattern || Dctx.fillStyle;
  } else {
    Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dctx.shadowColor = Dcharacter.shadowColor;
  Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  if (Dcharacter.strokeStyle) {
    Dctx.strokeStyle = Dcharacter.strokeStyle;
    Dctx.lineCap = Dcharacter.lineCap;
    Dctx.lineDashOffset = Dcharacter.lineDashOffset;
    Dctx.lineJoin = Dcharacter.lineJoin;
    Dctx.lineWidth = Dcharacter.lineWidth;
    Dctx.miterLimit = Dcharacter.miterLimit;
    Dctx.stroke();
  }

  Dctx.fill();
  Dctx.restore();
}
//普通圆形视觉图形绘制
export function shapeMethodArc(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  let shape = (Dcharacter.shape as Dshape_data_arc).path;
  Dctx.beginPath();
  Dctx.arc(0, 0, shape.radius, 0, Math.PI * 2);

  Dctx.save();
  if (Dcharacter.texture) {
    Dcharacter.textureRender(-Dcharacter.focusX, -Dcharacter.focusY, 1, 1, 0);
    Dctx.fillStyle = Dcharacter.texturePattern || Dctx.fillStyle;
  } else {
    Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dctx.shadowColor = Dcharacter.shadowColor;
  Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  if (Dcharacter.strokeStyle) {
    Dctx.strokeStyle = Dcharacter.strokeStyle;
    Dctx.lineCap = Dcharacter.lineCap;
    Dctx.lineDashOffset = Dcharacter.lineDashOffset;
    Dctx.lineJoin = Dcharacter.lineJoin;
    Dctx.lineWidth = Dcharacter.lineWidth;
    Dctx.miterLimit = Dcharacter.miterLimit;
    Dctx.stroke();
  }

  Dctx.fill();
  Dctx.restore();
}
//普通多边形视觉图形绘制
export function shapeMethodPolygon(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  let shape = (Dcharacter.shape as Dshape_data_polygon).path;
  Dctx.beginPath();
  Dctx.moveTo(shape[0][0], shape[0][1]);
  shape.forEach((point) => {
    if (point.length === 2) {
      Dctx.lineTo(point[0], point[1]);
    }
    if (point.length === 4) {
      Dctx.quadraticCurveTo(point[0], point[1], point[2], point[3]);
    }
    if (point.length === 6) {
      Dctx.bezierCurveTo(
        point[0],
        point[1],
        point[2],
        point[3],
        point[4],
        point[5]
      );
    }
  });
  Dctx.closePath();

  Dctx.save();
  if (Dcharacter.texture) {
    Dcharacter.textureRender(-Dcharacter.focusX, -Dcharacter.focusY, 1, 1, 0);
    Dctx.fillStyle = Dcharacter.texturePattern || Dctx.fillStyle;
  } else {
    Dctx.fillStyle = Dcharacter.fillColor;
  }

  Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dctx.shadowColor = Dcharacter.shadowColor;
  Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;

  if (Dcharacter.strokeStyle) {
    Dctx.strokeStyle = Dcharacter.strokeStyle;
    Dctx.lineCap = Dcharacter.lineCap;
    Dctx.lineDashOffset = Dcharacter.lineDashOffset;
    Dctx.lineJoin = Dcharacter.lineJoin;
    Dctx.lineWidth = Dcharacter.lineWidth;
    Dctx.miterLimit = Dcharacter.miterLimit;
    Dctx.stroke();
  }

  Dctx.fill();
  Dctx.restore();
}

//普通矩形碰撞图形绘制
export function colliderMethodRect(
  Dcharacter: Dcharacter,
  Sctx: CanvasRenderingContext2D
) {
  let collider = (Dcharacter.collider as Dshape_data_rect).path;
  Sctx.beginPath();
  Sctx.rect(
    -Dcharacter.focusX,
    -Dcharacter.focusY,
    collider.width,
    collider.height
  );
}
//普通圆形碰撞图形绘制
export function colliderMethodArc(
  Dcharacter: Dcharacter,
  Sctx: CanvasRenderingContext2D
) {
  let collider = (Dcharacter.collider as Dshape_data_arc).path;
  Sctx.beginPath();
  Sctx.arc(0, 0, collider.radius, 0, Math.PI * 2);
}
//普通多边形碰撞图形绘制
export function colliderMethodPolygon(
  Dcharacter: Dcharacter,
  Sctx: CanvasRenderingContext2D
) {
  let collider = (Dcharacter.collider as Dshape_data_polygon).path;
  Sctx.beginPath();
  Sctx.moveTo(collider[0][0], collider[0][1]);
  collider.forEach((point) => {
    if (point.length === 2) {
      Sctx.lineTo(point[0], point[1]);
    }
    if (point.length === 4) {
      Sctx.quadraticCurveTo(point[0], point[1], point[2], point[3]);
    }
    if (point.length === 6) {
      Sctx.bezierCurveTo(
        point[0],
        point[1],
        point[2],
        point[3],
        point[4],
        point[5]
      );
    }
  });
  Sctx.closePath();
}

export function createEditableTool(dc: Dcharacter, dm: Davinci) {
  const toolShape = new Dshape({
    type: "rect",
    path: { width: dc.width, height: dc.height },
  });
  const pointShape = new Dshape({
    type: "rect",
    path: { width: 10, height: 10 },
  });

  const c = dm.matrixCalc(dc.accumulateTransform, -dc.focusX, -dc.focusY);

  const tool = new Dcharacter(
    {
      width: dc.width,
      height: dc.height,
      x: c.x,
      y: c.y,
      zidx: 9999999999,
      fillColor: "red",
      shape: toolShape,
      collider: toolShape,
      targetMatrix: new DOMMatrix(),
      colliding: (target, Dctx) => {
        let matrix = dm.Sctx.getTransform();
        dm.Sctx.setTransform(dc.accumulateTransform);
        colliderMethodRect(target, Dctx);
        dm.Sctx.setTransform(matrix);
      },
      rendering: (target, Sctx) => {
        let matrix = dm.Dctx.getTransform();
        dm.Dctx.setTransform(dc.accumulateTransform);
        shapeMethodRect(target, Sctx);
        dm.Dctx.setTransform(matrix);
      },
      beforeChildrenCollider: () => {
        dm.Sctx.setTransform(dc.accumulateTransform);
      },
    },
    dc.dm
  );
  const lt = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: -tool.focusX - 5,
      y: -tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const lm = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: -tool.focusX - 5,
      y: 0 - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const lb = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: -tool.focusX - 5,
      y: tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const mt = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: 0 - 5,
      y: -tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const mb = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: 0 - 5,
      y: tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const rt = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: tool.focusX - 5,
      y: -tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const rm = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: tool.focusX - 5,
      y: 0 - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );
  const rb = new Dcharacter(
    {
      width: 10,
      height: 10,
      x: tool.focusX - 5,
      y: tool.focusY - 5,
      shape: pointShape,
      collider: pointShape,
      colliding: colliderMethodRect,
      rendering: shapeMethodRect,
    },
    dc.dm
  );

  tool.addChild(lt);
  tool.addChild(lm);
  tool.addChild(lb);
  tool.addChild(mt);
  tool.addChild(mb);
  tool.addChild(rt);
  tool.addChild(rm);
  tool.addChild(rb);

  dm.Dboard.addChild(tool);
}
