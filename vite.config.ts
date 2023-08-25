import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import legacy from "@vitejs/plugin-legacy";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const common = {
    server: {
      host: "0.0.0.0",
      port: 8015,
    },
    resolve: {
      alias: {
        "@root": resolve(__dirname, "./"),
      },
    },
  };
  if (mode === "lib") {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, "lib/main.ts"),
          name: "davinci",
          fileName: "davinci",
        },
        rollupOptions: {},
      },
      ...common,
    };
  }
  if (mode === "doc") {
    return {
      plugins: [viteSingleFile()],
      base: "./",
      build: {
        outDir: "doc",
        rollupOptions: {
          input: resolve(__dirname, "index.html"),
        },
      },
      ...common,
    };
  }
  if (mode === "electron") {
    return {
      plugins: [
        electron([
          {
            // Main-Process entry file of the Electron App.
            entry: "electron/main.ts",
          },
          {
            entry: "electron/preload.ts",
            onstart(options) {
              // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
              // instead of restarting the entire Electron App.
              options.reload();
            },
          },
        ]),
        renderer(),
      ],
    };
  }

  return {
    ...common,
  };
});
