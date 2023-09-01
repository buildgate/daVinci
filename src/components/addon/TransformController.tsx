import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Davinci,
  Dshape,
  Dcharacter,
  shapeMethodRect,
  colliderMethodRect,
  transformController,
} from "@root/lib/main";
import { useEffect, useRef } from "react";

const Fund = styled.div``;

export default function TransformController() {
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

  let controller = new transformController(rect);

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

  let controller = new transformController(rect);

  DM1.Dboard.addChild(rect);

  useEffect(() => {
    DM1.mount("#demo1");
    DM1.collisionDetect = true;
    DM1.render();
  }, []);
  return (
    <Fund>
      <section>
        <h1>TransformController</h1>
        <p>TransformController是一个内置的控制器。</p>
        <p>为角色添加控制器之后，可以通过鼠标活动控制角色的形变。</p>
        <p>
          <b>移动</b>：按下鼠标左键并移动鼠标。
        </p>
        <p>
          <b>缩放</b>：鼠标中间滚轮为缩放角色。
        </p>
        <p>
          <b>旋转</b>：按下鼠标右键键并移动鼠标。
        </p>
        <p>
          控制器只会对绑定的角色进行操作，所以鼠标只有放置在被绑定的目标身上才会使控制器生效。
          <b>
            注意！！如果在加入控制器后调用removeEventListener方法，并且是进行全事件清除，那么将会使控制器失效。
          </b>
        </p>
        <br />

        <p>
          此外，该控制器提供enableMove，enableScale，enableRotate三个开关，分别控制是否允许移动，缩放，旋转。开发者可根据实际情况进行设置。
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
