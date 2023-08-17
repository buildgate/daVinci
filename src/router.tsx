import Home from "./components/Home";
import Brief from "./components/int/Brief";
import Install from "./components/int/Install";
import Fundamentals from "./components/doc/Fundamentals";
import Character from "./components/doc/Character";
import Position from "./components/doc/Position";
import { Outlet } from "react-router-dom";
import Transform from "./components/doc/Transform";

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
