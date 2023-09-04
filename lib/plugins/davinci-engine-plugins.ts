import { Dcharacter, Davinci, Dshape } from "../davinci-engine.js";

export function setTexture(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  if (Dcharacter.texture) {
    Dcharacter.textureRender(-Dcharacter.focusX, -Dcharacter.focusY, 1, 1, 0);
    Dctx.fillStyle = Dcharacter.texturePattern || Dctx.fillStyle;
  } else {
    Dctx.fillStyle = Dcharacter.fillColor;
  }
}

export function setShadow(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  Dctx.shadowBlur = Dcharacter.shadowBlur;
  Dctx.shadowColor = Dcharacter.shadowColor;
  Dctx.shadowOffsetX = Dcharacter.shadowOffsetX;
  Dctx.shadowOffsetY = Dcharacter.shadowOffsetY;
}

export function setStorke(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  if (Dcharacter.strokeStyle) {
    Dctx.strokeStyle = Dcharacter.strokeStyle;
    Dctx.lineCap = Dcharacter.lineCap;
    Dctx.lineDashOffset = Dcharacter.lineDashOffset;
    Dctx.lineJoin = Dcharacter.lineJoin;
    Dctx.lineWidth = Dcharacter.lineWidth;
    Dctx.miterLimit = Dcharacter.miterLimit;
    Dctx.stroke();
  }
}

export function setText(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  if (Dcharacter.text !== null) {
    Dctx.font = Dcharacter.font;
    Dctx.fillStyle = Dcharacter.fontColor;
    if (Dcharacter.textMaxWidth) {
      Dctx.fillText(
        Dcharacter.text,
        Dcharacter.textOffsetX,
        Dcharacter.textOffsetY,
        Dcharacter.textMaxWidth
      );
    } else {
      Dctx.fillText(
        Dcharacter.text,
        Dcharacter.textOffsetX,
        Dcharacter.textOffsetY
      );
    }

    Dctx.strokeStyle = Dcharacter.fontStrokeColor;
    Dctx.lineWidth = Dcharacter.fontStrokeLineWidth;

    if (Dcharacter.fontStrokeLineWidth) {
      if (Dcharacter.textMaxWidth) {
        Dctx.strokeText(
          Dcharacter.text,
          Dcharacter.textOffsetX,
          Dcharacter.textOffsetY,
          Dcharacter.textMaxWidth
        );
      } else {
        Dctx.strokeText(
          Dcharacter.text,
          Dcharacter.textOffsetX,
          Dcharacter.textOffsetY
        );
      }
    }
  }
}

//普通矩形视觉图形绘制
export function shapeMethodRect(
  Dcharacter: Dcharacter,
  Dctx: CanvasRenderingContext2D
) {
  let shape = (Dcharacter.shape as Dshape_data_rect).path;
  Dctx.beginPath();
  Dctx.rect(-Dcharacter.focusX, -Dcharacter.focusY, shape.width, shape.height);

  Dctx.save();
  setTexture(Dcharacter, Dctx);

  setShadow(Dcharacter, Dctx);

  Dctx.fill();

  setStorke(Dcharacter, Dctx);

  setText(Dcharacter, Dctx);

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
  setTexture(Dcharacter, Dctx);

  setShadow(Dcharacter, Dctx);

  Dctx.fill();

  setStorke(Dcharacter, Dctx);

  setText(Dcharacter, Dctx);

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
  setTexture(Dcharacter, Dctx);

  setShadow(Dcharacter, Dctx);

  Dctx.fill();

  setStorke(Dcharacter, Dctx);

  setText(Dcharacter, Dctx);

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

export class transformController {
  scaleX: number = 1;
  scaleY: number = 1;
  x: number = 0;
  y: number = 0;
  rotate: number = 0;

  wheelToScale: number = 0.0005;

  isLeftBtn: boolean = false;
  isRightBtn: boolean = false;

  enableMove: boolean = true;
  enableScale: boolean = true;
  enableRotate: boolean = true;

  target: Dcharacter;

  constructor(Dcharacter: Dcharacter) {
    this.target = Dcharacter;
    this.setEvent();
  }

  //反向计算矩阵
  reverseMatrix(x: number, y: number) {
    let matrix = this.target.preAccumulateTransform.inverse();
    let cX = matrix.a * x + -matrix.b * y + matrix.e;
    let cY = -matrix.c * x + matrix.d * y + matrix.f;
    return { x: cX, y: cY };
  }

  get2VectorRadian(v1: Dcoordinate, v2: Dcoordinate) {
    const { x: Ax, y: Ay } = v1;
    const { x: Bx, y: By } = v2;
    // 与v1起始向量方向相反
    // const _v1 = { x: -x1, y: -y1 };

    // 计算向量A和向量B的点积
    var dotProduct = Ax * Bx + Ay * By;

    var direction = Ax * By - Bx * Ay;

    // 计算向量A和向量B的模
    var magnitudeA = Math.sqrt(Ax * Ax + Ay * Ay);
    var magnitudeB = Math.sqrt(Bx * Bx + By * By);

    // 计算夹角的余弦值
    var cosAngle = dotProduct / (magnitudeA * magnitudeB);

    // 使用反余弦函数计算夹角的弧度值
    var angleRad = Math.acos(cosAngle);

    if (direction < 0) {
      return isNaN(angleRad) ? 0 : -angleRad;
    } else {
      return isNaN(angleRad) ? 0 : angleRad;
    }
  }

  setEvent() {
    this.target.addEventListener("mousedown", (e) => {
      if (e.originEvent.button === 0 && this.enableMove) {
        this.isLeftBtn = true;
      }
      if (e.originEvent.button === 2 && this.enableRotate) {
        this.isRightBtn = true;
      }
    });
    this.target.addEventListener("mousemove", (e) => {
      if (this.isLeftBtn && this.enableMove) {
        let now = this.reverseMatrix(e.x, e.y);
        let pre = this.reverseMatrix(e.preX, e.preY);
        this.target.x += now.x - pre.x;
        this.target.y += now.y - pre.y;
      }
      if (this.isRightBtn && this.enableRotate) {
        let O = this.target.matrixCalc(0, 0);
        this.target.rotate += this.get2VectorRadian(
          { x: e.preX - O.x, y: e.preY - O.y },
          { x: e.x - O.x, y: e.y - O.y }
        );
      }
    });
    this.target.addEventListener("mouseup", (e) => {
      if (e.originEvent.button === 0) {
        this.isLeftBtn = false;
      }
      if (e.originEvent.button === 2) {
        this.isRightBtn = false;
      }
    });
    this.target.addEventListener("wheel", (e) => {
      if (!this.enableScale) {
        return;
      }
      this.target.scaleX += e.originEvent.wheelDelta * this.wheelToScale;
      this.target.scaleY += e.originEvent.wheelDelta * this.wheelToScale;
    });
    this.target.addEventListener("mouseleave", () => {
      this.isLeftBtn = false;
      this.isRightBtn = false;
    });
  }
}
