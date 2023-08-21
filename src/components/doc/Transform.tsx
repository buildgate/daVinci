import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Davinci,
  Dshape,
  Dcharacter,
  shapeMethodRect,
  colliderMethodRect,
} from "@root/lib/main";
import { useEffect, useRef } from "react";

const Fund = styled.div``;

export default function Transform() {
  const code1 = `
  let DM1 = new Davinci();
  DM1.setData({ width: 800, height: 300 });

  let shape = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let shape1 = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let rect = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      shape: shape,
      collider: shape,
      rotate: (45 / 180 * Math.PI),
      scaleX: 0.5,
      scaleY:0.5,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  let rect1 = new Dcharacter(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      shape: shape1,
      collider: shape1,
      rotate: (-45 / 180) * Math.PI,
      fillColor: "red",
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  rect1.addEventListener("mousedown", () => {
    alert("mousedown");
  });

  rect.addChild(rect1);
  DM1.Dboard.addChild(rect);
  
  DM1.collisionDetect = true;
  `;

  let DM1 = new Davinci();
  DM1.setData({ width: 800, height: 300 });

  let shape = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let shape1 = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let rect = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      shape: shape,
      collider: shape,
      rotate: (45 / 180) * Math.PI,
      scaleX: 0.5,
      scaleY: 0.5,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  let rect1 = new Dcharacter(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      shape: shape1,
      collider: shape1,
      rotate: (-45 / 180) * Math.PI,
      fillColor: "red",
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  rect1.addEventListener("mousedown", () => {
    alert("mousedown");
  });

  rect.addChild(rect1);
  DM1.Dboard.addChild(rect);

  useEffect(() => {
    DM1.mount("#demo1");
    DM1.collisionDetect = true;
    DM1.render();
  });
  return (
    <Fund>
      <section>
        <h1>形变</h1>
        <p>
          角色的形变有三种：<b>平移</b>，<b>缩放</b>，<b>旋转</b>。
        </p>
        <p>
          <b>平移</b>：平移实际上就是x和y的值，具体请参考定位章节的介绍。
        </p>
        <p>
          <b>缩放</b>：通过设置scaleX和scaleY可以改变在两个方向上的缩放比例。
        </p>
        <p>
          <b>旋转</b>
          ：通过设置rotate属性可以让角色进行旋转，旋转的中心是角色的焦点。
        </p>
        <br />
        <p>
          形变会影响到本体坐标系的变化，并且遵循平移-缩放-旋转的顺序进行形变，你可以理解为本体是先进行渲染再进行形变的，但是实际上canvas的逻辑是先设置矩阵变换再渲染的，你只需要了解这一点就可以了。
        </p>
      </section>
      <section>
        <h1>形变继承</h1>
        <p>
          角色的形变是会被子角色继承的，无论是视觉体还是碰撞体都是会继承形变。
        </p>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <div className="demo">
          <div id="demo1" className="context"></div>
        </div>
        <br />
        <p>
          上述例子可以看到红色矩形的碰撞体也会跟随形变，这样可以确保碰撞机制的准确性。
        </p>
      </section>
    </Fund>
  );
}
