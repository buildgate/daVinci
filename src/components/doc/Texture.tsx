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

export default function Transform() {
  const code1 = `
  let shape = new Dshape({
    type: "rect",
    path: { width: 400, height: 400 },
  });

  let rect = new Dcharacter(
    {
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      shape: shape,
      collider: shape,
      rotate: (45 / 180) * Math.PI,
      scaleX: 0.5,
      scaleY: 0.5,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
      texture: new URL("@root/public/texture.jpg", import.meta.url).href,
    },
    DM1
  );
  DM1.Dboard.addChild(rect);
  `;

  let DM1 = new Davinci();
  DM1.setData({ width: 800, height: 400 });

  let shape = new Dshape({
    type: "rect",
    path: { width: 400, height: 400 },
  });

  let rect = new Dcharacter(
    {
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      shape: shape,
      collider: shape,
      rotate: (45 / 180) * Math.PI,
      scaleX: 0.5,
      scaleY: 0.5,
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
      texture: new URL("@root/src/assets/texture.jpg", import.meta.url).href,
    },
    DM1
  );
  DM1.Dboard.addChild(rect);

  useEffect(() => {
    DM1.mount("#demo1");
    DM1.collisionDetect = true;
    DM1.render();
  }, []);
  return (
    <Fund>
      <section>
        <h1>纹理</h1>
        <p>
          角色的视觉体本身是没有颜色的，在渲染完闭合图形之后会对图形进行填充，在默认情况下，视觉体将会被黑色填充。
          开发者可以通过设置fillColor的属性设置具体填充的颜色。如果图形只能单纯填充颜色，那么对于引擎的可操作性就太低了。
          这里引入<b>纹理</b>的概念。
        </p>
        <br />
        <p>
          <b>纹理</b>
          指的是闭合图形填充的内容，开发者可以通过设置texture属性设置纹理。纹理的可以是本地图片也可以是网络图片。texture属性的优先度要高于fillColor，同时设置的情况下优先使用纹理。
          纹理渲染也是受到<b>坐标系</b>
          影响的，并且跟随角色的形变。纹理图片的左上角顶点总是在
          <b>容器</b>
          的左上角顶点位置。可以理解为纹理是容器的背景图，视觉体相当于一个蒙层，纹理只有在和视觉体重叠的部分才会显示出来。
        </p>
        <br />
        <p>
          由于图片是异步加载的，所以纹理渲染会涉及一个等待加载的问题。当画布进行渲染的时候纹理未必已经加载完成，这种情况下纹理是无法被渲染出来的。
          每次纹理属性被更改时都会触发一次纹理初始化函数，当确认这个纹理已经被加载完成之后就会回调ontextureonload的内置函数，默认情况下会产生一次快照渲染。
          由于每个角色的纹理加载都是异步进行的，所以我们也提供了一个钩子函数onGlobalTextureComplete，当davinci实例检测到所有纹理都已经加载完成之后就会调用这个钩子函数。
        </p>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <br />
        <div className="demo">
          <div id="demo1" className="context" style={{ height: "400px" }}></div>
        </div>
        <br />
      </section>
    </Fund>
  );
}
