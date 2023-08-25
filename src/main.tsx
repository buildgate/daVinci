import "./style.css";

import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { paths } from "./router";
import React from "react";

const router = createHashRouter(paths);

const domNode = document.getElementById("app");
const root = createRoot(domNode as Element);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
