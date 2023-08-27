import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { ApiParamItem } from "@root/src/components/common/ApiParamItem";

const Fund = styled.div``;

export default function Dparam() {
  const Davinci_data = [
    {
      id: "Dboard",
      name: "Dboard: Dcharacter",
      type: "Dcharacter",
      defVal: "Dcharacter",
      des: (
        <p>
          画布角色，在Davinci初始化时自动生成，默认是一个和画布等高等宽的图形。
          <b>如非必要请不要自行修改。</b>
        </p>
      ),
    },
    {
      id: "allowRender",
      name: "allowRender",
      type: "boolean",
      defVal: "true",
      des: "是否允许渲染，设置为false则不进入render函数。",
    },
    {
      id: "collisionDetect",
      name: "collisionDetect",
      type: "boolean",
      defVal: "false",
      des: "是否开启碰撞检测，防止误触时使用。因为是默认关闭的，所以每次初始化画布之后需要手动开启。",
    },
    {
      id: "stopPropagation",
      name: "stopPropagation",
      type: "boolean",
      defVal: "true",
      des: "是否进行事件冒泡，出于便捷性的考虑，默认为true。",
    },
  ];

  const Dcharacter_data = [
    {
      id: "id",
      name: "id",
      type: "string | number | symbol",
      defVal: "+new Date()",
      des: "角色id，与uid不一样，可以自定义值。",
    },
    {
      id: "name",
      name: "name",
      type: "string | number",
      defVal: "''",
      des: "角色名称。",
    },
    {
      id: "width",
      name: "width",
      type: "number",
      defVal: "100",
      des: "容器高度。如果单独设置，不会改变焦点。",
    },
    {
      id: "height",
      name: "height",
      type: "number",
      defVal: "100",
      des: "容器高度。如果单独设置，不会改变焦点。",
    },
    {
      id: "x",
      name: "x",
      type: "number",
      defVal: "0",
      des: "容器左上角顶点的X轴距离原点的距离，这是一个相对值，与父角色定位相关。",
    },
    {
      id: "y",
      name: "y",
      type: "number",
      defVal: "0",
      des: "容器左上角顶点的y轴距离原点的距离，这是一个相对值，与父角色定位相关。",
    },
    {
      id: "focusX",
      name: "focusX",
      type: "number",
      defVal: "width/2",
      des: "焦点的x坐标，当使用setData方法设置宽高时，会自动把焦点设置为容器的中心。",
    },
    {
      id: "focusY",
      name: "focusY",
      type: "number",
      defVal: "height/2",
      des: "焦点的y坐标，当使用setData方法设置宽高时，会自动把焦点设置为容器的中心。",
    },
    {
      id: "fillColor",
      name: "fillColor",
      type: `CanvasRenderingContext2D["fillStyle"]`,
      defVal: `"#000000"`,
      des: "图形填充色。如果需要设置图片填充，推荐使用texture。",
    },
    {
      id: "shadowColor",
      name: "shadowColor",
      type: "string",
      defVal: `"#000000"`,
      des: "阴影颜色。",
    },
    {
      id: "shadowBlur",
      name: "shadowBlur",
      type: "number",
      defVal: "0",
      des: "阴影模糊值。",
    },
    {
      id: "shadowOffsetX",
      name: "shadowOffsetX",
      type: "number",
      defVal: "0",
      des: "阴影X轴偏移值。",
    },
    {
      id: "shadowOffsetY",
      name: "shadowOffsetY",
      type: "number",
      defVal: "0",
      des: "阴影Y轴偏移值。",
    },
    {
      id: "strokeStyle",
      name: "strokeStyle",
      type: `CanvasRenderingContext2D["strokeStyle"] | null`,
      defVal: "null",
      des: "图形描边样式。",
    },
    {
      id: "lineWidth",
      name: "lineWidth",
      type: `number`,
      defVal: "0",
      des: "图形描边线宽。",
    },
    {
      id: "lineCap",
      name: "lineCap",
      type: `CanvasRenderingContext2D["lineCap"]`,
      defVal: `"butt"`,
      des: "图形描边末端形状。",
    },
    {
      id: "lineDashOffset",
      name: "lineCap",
      type: `CanvasRenderingContext2D["lineDashOffset"]`,
      defVal: `0`,
      des: "图形描边虚线设置，请参考mdn。",
    },
    {
      id: "lineJoin",
      name: "lineJoin",
      type: `CanvasRenderingContext2D["lineJoin"]`,
      defVal: `"miter"`,
      des: "图形描边连接处形状。",
    },
    {
      id: "miterLimit",
      name: "miterLimit",
      type: `CanvasRenderingContext2D["miterLimit"]`,
      defVal: `0`,
      des: "图形描边最大斜接长度。详情参考mdn。",
    },
    {
      id: "scaleX",
      name: "scaleX",
      type: `number`,
      defVal: `1`,
      des: "X轴方向上的缩放值",
    },
    {
      id: "scaleY",
      name: "scaleY",
      type: `number`,
      defVal: `1`,
      des: "Y轴方向上的缩放值",
    },
    {
      id: "rotate",
      name: "rotate",
      type: `number`,
      defVal: `0`,
      des: "旋转角度，旋转中心是焦点的位置。",
    },
    {
      id: "opacity",
      name: "opacity",
      type: `number`,
      defVal: `1`,
      des: "透明度。与碰撞体无关，只与视觉体有关。",
    },
    {
      id: "accumulateTransform",
      name: "accumulateTransform",
      type: `DOMMatrix`,
      defVal: `new DOMMatrix()`,
      des: "当前角色在渲染树中的累计形变矩阵，用于计算实际坐标，会被自动更新。",
    },
    {
      id: "renderable",
      name: "renderable",
      type: `boolean`,
      defVal: `true`,
      des: "当前角色是否需要渲染。设置为false时，子角色也不会被渲染。",
    },
    {
      id: "collisionable",
      name: "collisionable",
      type: `boolean`,
      defVal: `true`,
      des: "当前角色是否可被检测碰撞。设置为false时，子角色也不会被检测。",
    },
    {
      id: "penetrate",
      name: "penetrate",
      type: `boolean`,
      defVal: `false`,
      des: "是否击穿。有别于collisionable，penetrate不会影响子级碰撞检测。",
    },
    {
      id: "visiable",
      name: "visiable",
      type: `boolean`,
      defVal: `true`,
      des: "是否可视。有别于renderable，visiable不会影响子级渲染。",
    },
    {
      id: "dm",
      name: "dm",
      type: `Davinci`,
      defVal: `auto`,
      des: "画布实例，初始化时必须传入，当需要修改时，硬考虑层级依赖问题，不建议修改。",
    },
    {
      id: "shape",
      name: "shape",
      type: `Dshape | any`,
      defVal: `null`,
      des: "视觉体，可以使用官方提供的图形，或者自定。",
    },
    {
      id: "collider",
      name: "collider",
      type: `Dcollider | any`,
      defVal: `null`,
      des: "碰撞体，可以使用官方提供的图形，或者自定。",
    },
    {
      id: "texture",
      name: "texture",
      type: `string | null`,
      defVal: `null`,
      des: "图形纹理，接受一个图片地址。",
    },
    {
      id: "children",
      name: "children",
      type: `Array<Dcharacter>`,
      defVal: `[]`,
      des: "子角色，建议使用addchild和deletechild方法进行改动。",
    },
  ];

  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  return (
    <Fund>
      <section>
        <b>本章将介绍关于类的属性。</b>
      </section>
      <br />
      <h3>以下是Davinci类下的属性</h3>
      <br />
      {Davinci_data.map((o) => {
        return (
          <ApiParamItem
            id={o.id}
            name={o.name}
            type={o.type}
            defVal={o.defVal}
            des={o.des}
          ></ApiParamItem>
        );
      })}
      <br />
      <h3>以下是Dcharacter类下的属性</h3>
      <br />
      {Dcharacter_data.map((o) => {
        return (
          <ApiParamItem
            id={o.id}
            name={o.name}
            type={o.type}
            defVal={o.defVal}
            des={o.des}
          ></ApiParamItem>
        );
      })}
    </Fund>
  );
}
