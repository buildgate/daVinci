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

export default function Position() {
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
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      shape: shape,
      collider: shape,
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
      fillColor: "red",
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  rect.addChild(rect1);
  DM1.Dboard.addChild(rect);
  
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
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      shape: shape,
      collider: shape,
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
      fillColor: "red",
      rendering: shapeMethodRect,
      colliding: colliderMethodRect,
    },
    DM1
  );

  rect.addChild(rect1);
  DM1.Dboard.addChild(rect);

  useEffect(() => {
    DM1.mount("#demo1");
    DM1.render();
  });

  return (
    <Fund>
      <section>
        <h1>定位</h1>
        <p>
          在角色章节有提到定位属性，定位属性主要包括：坐标（x,y），焦点（focusX,focusY）。
        </p>
        <p>
          在此我们引入<b>容器</b>
          的概念，容器指的是用来放置角色的矩形，角色的渲染和碰撞都是依赖容器实现的。
        </p>
        <br />
        <p>
          所有角色的容器都是一个矩形，即便是拥有不规则视觉体的角色容器也是一个矩形，所以所有角色都有宽高的属性。
          容器的主要作用是为角色提供一个独立<b>坐标系</b>
          。当渲染一个图形时，需要有一个坐标系，这样才能知道每一个点的位置。
          而每个坐标系都有一个原点（0，0），角色坐标系的原点就在<b>焦点</b>
          上，焦点的位置是相对于容器的左上角顶点来定位的。
          焦点的默认位置是容器的中心点，根角色比较特殊，它的焦点是和容器左上角顶点重合的。
        </p>
        <br />
        <p>
          焦点是可以自定义的，官方提供的渲染和碰撞方法都是以焦点为容器中心点来运作的，当使用自定义焦点时需注意对官方方法带来的影响。
        </p>

        <br />
        <p>
          焦点是角色坐标系的原点，它也同样是矩阵变换的中心。例如角色设置了旋转，那么这个旋转指的是以焦点为中心的旋转。
        </p>
        <br />
        <p>
          <b>坐标（x,y）</b>
          指的是容器在父角色提供的坐标系下左上角顶点的位置。用于定位容器在父角色中的相对位置，所有角色的位置指的都是相对位置。
          所以角色的x和y并不能指代这个角色在画布中的绝对位置。可能有些场景需要明确知道角色的绝对定位，那么可以使用角色本身提供的accumulateTransform属性，
          角色在进行完第一次渲染之后就会将当前的变换矩阵保存下来，通过计算矩阵的方式得到绝对坐标，或者使用matrixCalc方法获得绝对坐标。
        </p>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <div className="demo">
          <div id="demo1" className="context"></div>
        </div>
        <br />
        <p>
          上述例子可以看到，红色矩形（rect1）虽然设置的x和y都是0，但是渲染的位置是父角色黑色矩形（rect）的焦点位置；而黑色矩形的渲染位置则是相对于画布左上角的位置，这是因为根角色的焦点是与画布的左上角重合的。
        </p>
      </section>
      <section>
        <h1>子角色定位</h1>
        <p>
          子角色的坐标系是会继承父角色的变换矩阵的。渲染顺序是先变换坐标，再渲染本体，最后进入子角色的渲染。在角色的介绍章节有提到根角色在大部分情况下都不应该是我们的操作对象，
          其中一个原因就是一旦根角色变换了矩阵，就代表整个画布的内容都会产生改变。
        </p>
      </section>
    </Fund>
  );
}
