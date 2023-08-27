import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { ApiMethodItem } from "@root/src/components/common/ApiMethodItem";

const Fund = styled.div``;

export default function Dmethod() {
  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  const Davinci_data = [
    {
      id: "setData",
      name: "setData",
      type: "void",
      param: "options?: Davinci_data",
      des: "用于设置画布的宽高，若干不传入参数，则功能为将canvas的宽高同步至Dboard。",
    },
    {
      id: "mount",
      name: "mount",
      type: "void",
      param: "fundElement: string",
      des: "挂载根元素，将Davinci生成的画布挂载到目标元素内。",
    },
    {
      id: "render",
      name: "render",
      type: "void",
      param: "",
      des: "全局渲染。调用时将会刷新当前的所有角色渲染。",
    },
    {
      id: "globalTextureComplete",
      name: "globalTextureComplete",
      type: "void",
      param: "",
      des: "检测所有角色的纹理是否已经加载完成，如果完成将会调用onGlobalTextureComplete()方法。",
    },
    {
      id: "onGlobalTextureComplete",
      name: "onGlobalTextureComplete",
      type: "any",
      param: "",
      des: "自定义方法，所有角色纹理加载完成后被调用。",
    },
    {
      id: "matrixCalc",
      name: "matrixCalc",
      type: "{ x: number, y: number }",
      param: "matrix: DOMMatrix, x: number, y: number",
      des: "用于计算指定变换体系下坐标相对于画布的绝对坐标。",
    },
  ];

  const Dcharacter_data = [
    {
      id: "Dcharacter.setData",
      name: "setData",
      type: "void",
      param: "data: Dcharacter_data",
      des: "用于批量设置Dcharacter的属性。注意一点，如果在不设置焦点的情况下设置宽高，那么焦点将会自动调整至新的中心点，如果想自定义焦点，请连同焦点值一同设置。Dcharacter_data类型请参考类属性的内容，所有被提及的属性或者自定义属性都可以被设置。",
    },
    {
      id: "Dcharacter.matrixCalc",
      name: "matrixCalc",
      type: "{ x: number, y: number }",
      param: "x: number, y: number",
      des: "用于计算角色内坐标相对画布的绝对坐标。",
    },
    {
      id: "childrenSort",
      name: "childrenSort",
      type: "void",
      param: `order: string = "asc"`,
      des: "用于子角色排序，但是排序结束后需要手动调用一次画布更新。",
    },
    {
      id: "initTexture",
      name: "initTexture",
      type: "void",
      param: `originTexture: string`,
      des: "初始化纹理，调用结束时会触发全局纹理检测globalTextureComplete()。",
    },
    {
      id: "addEventListener",
      name: "addEventListener",
      type: "void",
      param: `type: Devent_type, fn: (event: Devent) => any`,
      des: "为角色添加事件监听。fn如果使用匿名函数，那么将无法删除，如需频繁修改，那么请传入具名函数。",
    },
    {
      id: "removeEventListener",
      name: "removeEventListener",
      type: "void",
      param: `type: Devent_type, fn_name?: string`,
      des: "用于移除监听事件，fn_name未函数名，如果在添加监听时候使用的是匿名函数，那么将无法删除；如果fn_name不传入，则会将所有已配置的事件清空。",
    },
    {
      id: "addChild",
      name: "addChild",
      type: "void",
      param: `data: Dcharacter | Array<Dcharacter>`,
      des: "用于添加子角色，接受一个角色或者一个角色数组批量添加。",
    },
    {
      id: "deleteChild",
      name: "deleteChild",
      type: "void",
      param: `child: Dcharacter`,
      des: "用于删除子角色，接受一个角色作为参数。",
    },
  ];

  const plugin_data = [
    {
      id: "shapeMethodRect",
      name: "shapeMethodRect",
      type: "void",
      param: `Dcharacter: Dcharacter,Dctx: CanvasRenderingContext2D`,
      des: "官方提供的矩形视觉体绘制函数。",
    },
    {
      id: "shapeMethodArc",
      name: "shapeMethodArc",
      type: "void",
      param: `Dcharacter: Dcharacter,Dctx: CanvasRenderingContext2D`,
      des: "官方提供的圆形视觉体绘制函数。",
    },
    {
      id: "shapeMethodPolygon",
      name: "shapeMethodPolygon",
      type: "void",
      param: `Dcharacter: Dcharacter,Dctx: CanvasRenderingContext2D`,
      des: "官方提供的多边形视觉体绘制函数。",
    },
    {
      id: "colliderMethodRect",
      name: "colliderMethodRect",
      type: "void",
      param: `Dcharacter: Dcharacter,Sctx: CanvasRenderingContext2D`,
      des: "官方提供的矩形碰撞体绘制函数。",
    },
    {
      id: "colliderMethodArc",
      name: "colliderMethodArc",
      type: "void",
      param: `Dcharacter: Dcharacter,Sctx: CanvasRenderingContext2D`,
      des: "官方提供的圆形碰撞体绘制函数。",
    },
    {
      id: "colliderMethodPolygon",
      name: "colliderMethodPolygon",
      type: "void",
      param: `Dcharacter: Dcharacter,Sctx: CanvasRenderingContext2D`,
      des: "官方提供的多边形碰撞体绘制函数。",
    },
  ];

  return (
    <Fund>
      <section>
        <b>本章将介绍关于类的方法。</b>
      </section>
      <br />
      <h3>以下是Davinci类下的方法</h3>
      <br />

      {Davinci_data.map((o) => {
        return (
          <ApiMethodItem
            id={o.id}
            name={o.name}
            type={o.type}
            param={o.param}
            des={o.des}
          ></ApiMethodItem>
        );
      })}
      <br />
      <h3>以下是Dcharacter类下的方法</h3>
      <br />
      {Dcharacter_data.map((o) => {
        return (
          <ApiMethodItem
            id={o.id}
            name={o.name}
            type={o.type}
            param={o.param}
            des={o.des}
          ></ApiMethodItem>
        );
      })}
      <h3>以下是官方提供的视觉体和碰撞体的默认函数，按需引入即可。</h3>
      <br />
      {plugin_data.map((o) => {
        return (
          <ApiMethodItem
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
