import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Fund = styled.div``;

export default function Dclass() {
  const code1 = `
    new Davinci(fundElement?: string, options?: Dcharacter_data) 

`;
  const code2 = `
    new Dcharacter(data: Dcharacter_data, DM: Davinci) 

`;
  const code3 = `
    new Dshape(data:Dshape_data);


      type Dpath_rect = {
        width: number;
        height: number;
      };
      type Dpath_arc = {
        radius: number;
      };
      type Dpath_polygon = Array<
        | [number, number]
        | [number, number, number, number]
        | [number, number, number, number, number, number]
      >;
      type Dpath = Dpath_rect | Dpath_arc | Dpath_polygon;
      
      type Dshape_data_rect = {
        type: "rect";
        path: Dpath_rect;
      };
      type Dshape_data_arc = {
        type: "arc";
        path: Dpath_arc;
      };
      type Dshape_data_polygon = {
        type: "polygon";
        path: Dpath_polygon;
      };
      type Dshape_data = Dshape_data_rect | Dshape_data_arc | Dshape_data_polygon;
    `;
  const code4 = `
    class Dcollider extends Dshape {}

    new Dcollider(data:Dshape_data) 

`;

  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  return (
    <Fund>
      <section>
        <b>
          本章将介绍官方提供的类，强烈建议使用typescript进行开发，因为类型提示功能将在插件中发挥重要的作用。
        </b>
      </section>
      <section id="Davinci">
        <h1>Davinci</h1>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code1}
          </SyntaxHighlighter>
        </div>
        <p>
          Davinci类是插件的基础类，所有功能都依赖于此类。构建函数可以输入两个参数，挂载元素和宽高设置。
          可以使用自定义挂载，宽高设置可以通过setdata方法设置。初始化时会自动生成一个Dcharacter作为画布的基础元素，这个Dcharacter会与画布的宽高进行同步。
        </p>
      </section>
      <section id="Dcharacter">
        <h1>Dcharacter</h1>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code2}
          </SyntaxHighlighter>
        </div>
        <p>
          Dcharacter类是初始化时会返回一个proxy对象，Dcharacter的属性值会被监听，当检测到修改时会自动调用render函数。初始化时需要传入一个Davinci实例来绑定视图更新的操作。
        </p>
      </section>
      <section id="Dshape">
        <h1>Dshape</h1>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code3}
          </SyntaxHighlighter>
        </div>
        <p>
          Dshape类用于创建一个视觉体图形，目前官方提供了矩形，圆形，多边形三种图形。多边形提供三种线段类型：直线，二次贝塞尔曲线，三次贝塞尔曲线。
        </p>
      </section>
      <section id="Dcollider">
        <h1>Dcollider</h1>
        <br />
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code4}
          </SyntaxHighlighter>
        </div>
        <p>
          Dcollider类用于创建一个碰撞体图形，实际上和Dshape是通用的，因为Dcollider是继承于Dshape类的。目前只是为了规范化处理所以设置这个类。
        </p>
      </section>
    </Fund>
  );
}
