import Home from "@root/src/components/Home";
import Brief from "@root/src/components/int/Brief";
import Install from "@root/src/components/int/Install";
import Fundamentals from "@root/src/components/doc/Fundamentals";
import Character from "@root/src/components/doc/Character";
import Position from "@root/src/components/doc/Position";
import Transform from "@root/src/components/doc/Transform";
import Texture from "@root/src/components/doc/Texture";
import Advanced from "@root/src/components/doc/Advanced";
import Dclass from "@root/src/components/api/Dclass";
import Dparam from "@root/src/components/api/Dparam";
import Dmethod from "@root/src/components/api/Dmethod";

import { Outlet } from "react-router-dom";

export const paths_int = {
  path: "/learn",
  element: <Outlet />,
  name: "快速入门",
  children: [
    {
      path: "/learn/brief",
      element: <Brief />,
      name: "入门",
      children: [],
    },
    {
      path: "/learn/install",
      element: <Install />,
      name: "安装",
      children: [],
    },
  ],
};

export const paths_doc = {
  path: "/doc",
  element: <Outlet />,
  name: "文档",
  children: [
    {
      path: "/doc/fundamentals",
      element: <Fundamentals />,
      name: "基本原理",
      children: [],
    },
    {
      path: "/doc/character",
      element: <Character />,
      name: "角色",
      children: [],
    },
    {
      path: "/doc/position",
      element: <Position />,
      name: "定位",
      children: [],
    },
    {
      path: "/doc/transform",
      element: <Transform />,
      name: "形变",
      children: [],
    },
    {
      path: "/doc/texture",
      element: <Texture />,
      name: "纹理",
      children: [],
    },
    {
      path: "/doc/advanced",
      element: <Advanced />,
      name: "进阶",
      children: [],
    },
  ],
};

export const paths_api = {
  path: "/api",
  element: <Outlet />,
  name: "API",
  children: [
    {
      path: "/api/class",
      element: <Dclass />,
      name: "类",
      children: [],
    },
    {
      path: "/api/attribute",
      element: <Dparam />,
      name: "属性",
      children: [],
    },
    {
      path: "/api/method",
      element: <Dmethod />,
      name: "方法",
      children: [],
    },
  ],
};

export const paths = [
  {
    path: "/",
    element: <Home></Home>,
    name: "主页",
    children: [paths_int, paths_doc, paths_api],
  },
];

export const api_anchor = {
  class: [
    { name: "Davinci" },
    { name: "Dcharacter" },
    { name: "Dshape" },
    { name: "Dcollider" },
  ],
  param: [
    { name: "Dboard" },
    { name: "allowRender" },
    { name: "collisionDetect" },
    { name: "stopPropagation" },
    { name: "id" },
    { name: "name" },
    { name: "width" },
    { name: "height" },
    { name: "x" },
    { name: "y" },
    { name: "focusX" },
    { name: "focusY" },
    { name: "fillColor" },
    { name: "shadowColor" },
    { name: "shadowBlur" },
    { name: "shadowOffsetX" },
    { name: "shadowOffsetY" },
    { name: "strokeStyle" },
    { name: "lineWidth" },
    { name: "lineCap" },
    { name: "lineDashOffset" },
    { name: "lineJoin" },
    { name: "miterLimit" },
    { name: "scaleX" },
    { name: "scaleY" },
    { name: "rotate" },
    { name: "opacity" },
    { name: "accumulateTransform" },
    { name: "renderable" },
    { name: "collisionable" },
    { name: "dm" },
    { name: "shape" },
    { name: "collider" },
    { name: "texture" },
    { name: "children" },
    { name: "penetrate" },
    { name: "visiable" },
  ],
  method: [
    { name: "setData" },
    { name: "mount" },
    { name: "render" },
    { name: "globalTextureComplete" },
    { name: "onGlobalTextureComplete" },
    { name: "matrixCalc" },
    { name: "Dcharacter.setData" },
    { name: "Dcharacter.matrixCalc" },
    { name: "childrenSort" },
    { name: "initTexture" },
    { name: "addEventListener" },
    { name: "removeEventListener" },
    { name: "addChild" },
    { name: "deleteChild" },
    { name: "shapeMethodRect" },
    { name: "shapeMethodArc" },
    { name: "shapeMethodPolygon" },
    { name: "colliderMethodRect" },
    { name: "colliderMethodArc" },
    { name: "colliderMethodPolygon" },
  ],
};
