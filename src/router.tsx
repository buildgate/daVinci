import Home from "@root/src/components/Home";
import Brief from "@root/src/components/int/Brief";
import Install from "@root/src/components/int/Install";
import Fundamentals from "@root/src/components/doc/Fundamentals";
import Character from "@root/src/components/doc/Character";
import Position from "@root/src/components/doc/Position";
import Transform from "@root/src/components/doc/Transform";
import Texture from "@root/src/components/doc/Texture";
import Advanced from "@root/src/components/doc/Advanced";

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

export const paths = [
  {
    path: "/",
    element: <Home></Home>,
    name: "主页",
    children: [paths_int, paths_doc],
  },
];
