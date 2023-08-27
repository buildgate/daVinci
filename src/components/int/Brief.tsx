import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Davinci,
  Dshape,
  Dcharacter,
  shapeMethodRect,
  colliderMethodRect,
} from "@root/lib/main";
import { useEffect, useRef } from "react";

const Fund = styled.div``;

export default function Brief() {
  const code1 = `
  import { Dcharacter, Davinci, Dshape } from "davinci";

  const DM = new Davinci("#app");

`;

  const code2 = `
  import { Dcharacter, Davinci } from "davinci";

  const DM = new Davinci();

  DM.mount("#app")

`;

  const code3 = `
  import { Dshape,Dcharacter,shapeMethodRect,colliderMethodRect } from "davinci";

  let shape = new Dshape({
    type: "rect",
    path: { width: 200, height: 200 },
  });

  let rect = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 200,
      height: 200,
      shape: shape,
      collider: shape,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM
  );

  DM.Dboard.addChild(rect);//向画板添加元素

`;

  const code4 = `
  rect.addEventListener("mousedown", () => {
    alret("mousedown");
  });

  DM.collisionDetect = true;//需要开启碰撞检测

`;

  const code5 = `
  setInterval(() => {
    rect.x >= 500 ? (rect.x = 10) : (rect.x += 0.5);
  }, 20);

`;

  const demo1 = useRef(null);

  //demo1
  let DM1 = new Davinci();
  DM1.setData({ width: 800, height: 300 });

  let shape = new Dshape({
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
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  DM1.Dboard.addChild(rect);

  //demo2
  let DM2 = new Davinci();
  DM2.setData({ width: 800, height: 300 });

  let shape2 = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let rect2 = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      shape: shape2,
      collider: shape2,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM2
  );

  rect2.addEventListener("mousedown", () => {
    alert("mousedown");
  });

  DM2.Dboard.addChild(rect2);

  //demo3
  let DM3 = new Davinci();
  DM3.setData({ width: 800, height: 300 });

  let shape3 = new Dshape({
    type: "rect",
    path: { width: 100, height: 100 },
  });

  let rect3 = new Dcharacter(
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      shape: shape3,
      collider: shape3,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM3
  );
  DM3.Dboard.addChild(rect3);
  setInterval(() => {
    rect3.x >= 500 ? (rect3.x = 10) : (rect3.x += 0.5);
  }, 20);

  useEffect(() => {
    DM1.mount("#demo1");
    DM1.render();
    DM2.collisionDetect = true;
    DM2.mount("#demo2");
    DM2.render();
    DM3.mount("#demo3");
    DM3.render();
  }, []);

  return (
    <Fund>
      <section>
        <h1>快速入门</h1>
        <p>davinci是一款可以对画布内元素进行编程式控制的插件。</p>
        <p>
          如果你有过使用类似于unity这种游戏开发引擎的经验，那么这款插件将会相当容易上手。
        </p>
        <p>以下内容将基于你从未接触过类似插件来进行入门教学。</p>
      </section>
      <section>
        <h1>创建画布</h1>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <p>或者自定义挂载时机</p>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code2}
          </SyntaxHighlighter>
        </div>
      </section>
      <section>
        <h1>创建图形</h1>
        <p>
          每一个图形都称为一个<b>角色</b>，都由三大部分组成：
          <b>本体属性，shape（视觉体），collider（碰撞体）</b>。
        </p>
        <p>
          <b>本体属性</b>
          ：例如位置，焦点，宽高，形变属性，阴影等属性都属于本体属性。除此之外，根据实际情况还可以设置额外的自定义属性。部分本体属性会影响到渲染流程和碰撞检测流程。
        </p>
        <p>
          <b>shape（视觉体）</b>
          ：shape视觉体是控制在画布上实际渲染出的图形，其中rendering属性是定义引擎将以怎样的方式渲染shape。
        </p>
        <p>
          <b>collider（碰撞体）</b>
          ：collider碰撞体是控制真正可以触发鼠标事件的图形，其中colliding属性是定义引擎将以怎样的方式渲染collider。
        </p>
        <p>
          shape和collider没有必然联系，例如一个矩形视觉体可以拥有一个圆形碰撞体。
        </p>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code3}
          </SyntaxHighlighter>
        </div>
        <div className="demo" ref={demo1}>
          <div id="demo1" className="context"></div>
        </div>
      </section>
      <section>
        <h1>添加事件</h1>
        <p>
          将图形添加到画板上之后，其实已经完成了对碰撞体的初始化，如果想触发相应的事件，那么就需要为图形添加事件监听。
        </p>
        <p>
          collisionDetect这个属性是默认为false的，因为考虑到初始化时可能会有一些特殊情况，避免在渲染前误触。
        </p>
        <p>当确保画布已经初始化之后可以把该属性设置为true，启动碰撞检测。</p>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code4}
          </SyntaxHighlighter>
        </div>
        <div className="demo">
          <div id="demo2" className="context"></div>
        </div>
      </section>
      <section>
        <h1>动态修改元素</h1>
        <p>
          添加的图形不仅仅可以触发鼠标事件，动态改变属性可以使得元素重新渲染，从而实现动态元素。
        </p>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code5}
          </SyntaxHighlighter>
        </div>
        <div className="demo">
          <div id="demo3" className="context"></div>
        </div>
      </section>
    </Fund>
  );
}
