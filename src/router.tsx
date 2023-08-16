import Home from "./components/Home";
import Brief from "./components/int/Brief";
import Install from "./components/int/Install";
import Fundamentals from "./components/doc/Fundamentals";
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
