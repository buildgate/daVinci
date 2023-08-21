import { defineConfig } from "vite";
import { resolve } from "path";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [
  //   electron([
  //     {
  //       // Main-Process entry file of the Electron App.
  //       entry: 'electron/main.ts',
  //     },
  //     {
  //       entry: 'electron/preload.ts',
  //       onstart(options) {
  //         // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
  //         // instead of restarting the entire Electron App.
  //         options.reload()
  //       },
  //     },
  //   ]),
  //   renderer(),
  // ],
  server: {
    host: "0.0.0.0",
    port: 8015,
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/main.ts"),
      name: "davinci",
      // the proper extensions will be added
      fileName: "davinci",
    },
    rollupOptions: {},
  },
  resolve: {
    alias: {
      "@root": resolve(__dirname, "./"),
    },
  },
});
