import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Fund = styled.div``;

export default function Transform() {
  const code1 = `
  function shapeMethodRect(
    Dcharacter: Dcharacter,
    Dctx: CanvasRenderingContext2D
  ) {
    //第一步
    let shape = (Dcharacter.shape as Dshape_data_rect).path;
    Dctx.beginPath();
    Dctx.rect(-Dcharacter.focusX, -Dcharacter.focusY, shape.width, shape.height);

    Dctx.save();
    //第二部
    setTexture(Dcharacter, Dctx);
    //第三步
    setShadow(Dcharacter, Dctx);
    //第四步
    Dctx.fill();
    //第五步
    setStorke(Dcharacter, Dctx);
    //第六步
    setText(Dcharacter, Dctx);

    Dctx.restore();
  }
  `;

  const code2 = `
  function colliderMethodRect(
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
  `;

  const code3 = `
  //视觉体
  beforeRender();
  rendering();
  afterRender();
  beforeChildrenRender();
  子角色渲染；
  afterChildrenRender();


  //碰撞体
  beforeChildrenCollider();
  子角色碰撞检测；
  afterChildrenCollider();
  beforeCollider();
  colliding();
  afterCollider();

  `;
  return (
    <Fund>
      <section>
        <h1>进阶</h1>
        <p>本章节将介绍一些更深入的自定义内容。</p>
        <br />
        <p>
          官方提供了一些基本图形的<b>Dshape</b>
          类型，同时也提供了与之相匹配的视觉体和碰撞体渲染函数。实际上角色的shape属性和collider属性接受的类型是Dshape|any，这代表开发者可以自定义一个结构体，甚至设置为空也可以。
          因为这个两个属性的服务对象其实是rendering和colliding这两个函数，rendering函数是在视觉体渲染的时候定义本体的渲染行为，colliding函数是在碰撞体检测的时候定义本体的渲染行为。
          当rendering函数没有被赋值时，在本体渲染这一步将会什么都不做，但是不会影响子角色的影响，即使本体不做渲染，本体设置的形变也会被子角色继承，colliding函数同理。
          rendering被调用时会传入本体作为参数，如果开发者像自定义渲染的函数，这个函数应该包含beginPath这个canvas方法，如果需要闭合图形则需要使用closePath的方法，最后需要fill方法进行渲染处理。
        </p>
      </section>
      <section>
        <h1>rendering</h1>
        <br />
        <p>以下是官方提供的用于渲染矩形的rendering函数</p>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <p>
          上述例子可以看到，rendering函数会传入当前角色作为参数，第一步是绘制路径，第二步是设置纹理填充设置，第三步分是设置阴影，第四步开始本体绘制，第五步描边绘制，第六步绘制文字内容。
          <b>
            有一点十分值得注意，在第二步的开头可以看到save函数，在第六步结尾会有restore函数，这是因为填充色、描边、阴影这些属性都属于画布里面的属性，
            如果不将这些属性局限在当前角色，那么子角色将会继承。官方提供的默认方法都做了这个限制，如有需要可以自行设置。
          </b>
        </p>
        <p>这里从代码中也可以看出矩形是如何使用焦点的坐标进行渲染的。</p>
      </section>
      <section>
        <h1>colliding</h1>
        <br />
        <p>以下是官方提供的用于渲染矩形的colliding函数</p>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code2}
          </SyntaxHighlighter>
        </div>
        <p>
          上述例子可以看到，colliding函数与rendering的传参是相同的，区别在于第二个参数传入的是碰撞画布。colliding函数相对来说更加的简洁，操作的步骤也十分的少，
          因为检测碰撞时候就并不需要考虑样式上的属性。
          <b>
            注意！！！虽然碰撞体和视觉体是可以使用同一个图形，视觉体设置的描边是不会计算在碰撞体里面的，如果需要同步，那么需要开发者自己去计算加上描边后的图形路径。
          </b>
        </p>
      </section>
      <section>
        <h1>钩子函数</h1>
        <p>
          除了rendering和colliding这个两个函数之外，在执行过程中还提供了其他钩子函数。
          <b>
            视觉体渲染的钩子函数顺序和碰撞体检测的钩子函数顺序是不一样的，基础原理里面有阐述它们之间的区别。
          </b>
        </p>

        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code3}
          </SyntaxHighlighter>
        </div>
        <p>钩子函数传入的参数和rendering，colliding的参数是一致的。</p>
      </section>
    </Fund>
  );
}
