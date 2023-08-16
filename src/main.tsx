import "./style.css";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { paths } from "./router";
import Home from "./components/Home";
import React from "react";

const router = createBrowserRouter(paths);

const domNode = document.getElementById("app");
const root = createRoot(domNode as Element);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
