import styled from "styled-components";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ApiMethodItem } from "@root/src/components/common/ApiMethodItem";

const Fund = styled.div``;

export default function Dhook() {
  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  const Davinci_data = [
    {
      id: "onGlobalTextureComplete",
      name: "onGlobalTextureComplete",
      type: "any",
      param: "",
      des: "自定义方法，所有角色纹理加载完成后被调用。",
    },
    {
      id: "onGlobalRenderComplete",
      name: "onGlobalRenderComplete",
      type: "any",
      param: "",
      des: "自定义方法，所有角色渲染完成后被调用。所有子角色的渲染钩子都被执行完后才会调用此钩子函数，这是所有钩子中最后调用的。",
    },
  ];

  const Dcharacter_data = [
    {
      id: "beforeRender",
      name: "beforeRender",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "角色本体渲染前调用。",
    },
    {
      id: "afterRender",
      name: "afterRender",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "角色本体渲染后调用。",
    },
    {
      id: "beforeChildrenRender",
      name: "beforeChildrenRender",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "进入子角色渲染前被调用，执行位置为当前角色。",
    },
    {
      id: "afterChildrenRender",
      name: "afterChildrenRender",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "子角色渲染结束后被调用，执行位置为当前角色。",
    },
    {
      id: "afterGlobalRender",
      name: "afterGlobalRender",
      type: "void",
      param: "",
      des: "该钩子函数在全局渲染结束之后执行，上下文指向的是角色本体。当存在多个角色定义了此函数，那么执行的顺序将是渲染树遍历的顺序，从底层向顶层遍历。",
    },
    {
      id: "beforeCollider",
      name: "beforeCollider",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "角色本体碰撞检测前调用。",
    },
    {
      id: "afterCollider",
      name: "afterCollider",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "角色本体碰撞检测后调用。",
    },
    {
      id: "beforeChildrenCollider",
      name: "beforeChildrenCollider",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "进入子角色碰撞检测前调用。",
    },
    {
      id: "afterChildrenCollider",
      name: "afterChildrenCollider",
      type: "void",
      param: "Dcharacter: Dcharacter, Dctx: CanvasRenderingContext2D",
      des: "子角色碰撞检测后调用。",
    },
  ];

  return (
    <Fund>
      <section>
        <b>本章将介绍钩子方法。</b>
      </section>
      <br />
      <h3>以下是Davinci类下的钩子方法</h3>
      <br />

      {Davinci_data.map((o) => {
        return (
          <ApiMethodItem
            key={o.id}
            id={o.id}
            name={o.name}
            type={o.type}
            param={o.param}
            des={o.des}
          ></ApiMethodItem>
        );
      })}
      <br />
      <h3>以下是Dcharacter类下的钩子方法</h3>
      <br />
      {Dcharacter_data.map((o) => {
        return (
          <ApiMethodItem
            key={o.id}
            id={o.id}
            name={o.name}
            type={o.type}
            param={o.param}
            des={o.des}
          ></ApiMethodItem>
        );
      })}
    </Fund>
  );
}
