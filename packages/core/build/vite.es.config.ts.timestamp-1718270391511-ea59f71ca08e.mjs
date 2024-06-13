// build/vite.es.config.ts
import { defineConfig } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/vite@5.2.11_@types+node@20.12.10_terser@5.31.1/node_modules/vite/dist/node/index.js";
import { readdirSync, readdir } from "fs";
import { resolve } from "path";
import { defer, delay, filter, map } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import { visualizer } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0_rollup@4.17.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import shell2 from "file:///E:/Repositories/melon-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
import vue from "file:///E:/Repositories/melon-element/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.11_@types+node@20.12.10_terser@5.31.1__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///E:/Repositories/melon-element/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.12.10_rollup@4.17.2_typescript@5.4.5_vite@5.2.11_@types+_32vtewvqur5mtr4mno54inde4u/node_modules/vite-plugin-dts/dist/index.mjs";
import terser from "file:///E:/Repositories/melon-element/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.17.2/node_modules/@rollup/plugin-terser/dist/es/index.js";

// build/hooksPlugin.ts
import { each, isFunction } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import shell from "file:///E:/Repositories/melon-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
function hooksPlugin({
  rmFiles = [],
  afterBuild,
  beforeBuild
}) {
  return {
    name: "custom-hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err) {
      !err && isFunction(afterBuild) && afterBuild();
    }
  };
}

// build/vite.es.config.ts
var __vite_injected_original_dirname = "E:\\Repositories\\melon-element\\packages\\core\\build";
var TRY_MOVE_STYLES_DELAY = 750;
var isProd = process.env.NODE_ENV === "production";
var isDev = process.env.NODE_ENV === "development";
var isTest = process.env.NODE_ENV === "test";
function getDirectoriesSync(basePath) {
  const entries = readdirSync(basePath, { withFileTypes: true });
  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}
function moveStyles() {
  readdir("./dist/es/theme", (err) => {
    if (err)
      return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
    defer(() => shell2.mv("./dist/es/theme", "./dist"));
  });
}
var vite_es_config_default = defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: "dist/stats.es.html"
    }),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types"
    }),
    terser({
      compress: {
        sequences: isProd,
        arguments: isProd,
        drop_console: isProd && ["log"],
        drop_debugger: isProd,
        passes: isProd ? 4 : 1,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@TEST": JSON.stringify(isTest),
          "@PROD": JSON.stringify(isProd)
        }
      },
      format: {
        semicolons: false,
        shorthand: isProd,
        braces: !isProd,
        beautify: !isProd,
        comments: !isProd
      },
      mangle: {
        toplevel: isProd,
        eval: isProd,
        keep_classnames: isDev,
        keep_fnames: isDev
      }
    }),
    hooksPlugin({
      rmFiles: [
        "./dist/es",
        "./dist/theme",
        "./dist/types",
        "./dist/statses.html"
      ],
      afterBuild: moveStyles
    })
  ],
  build: {
    outDir: "dist/es",
    minify: false,
    cssCodeSplit: true,
    sourcemap: !isProd,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "../index.ts"),
      name: "MelonUI",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@popperjs/core",
        "async-validator"
      ],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "index.css";
          }
          if (chunkInfo.type === "asset" && /\.(css)$/i.test(chunkInfo.name)) {
            return "theme/[name].[ext]";
          }
          return chunkInfo.name;
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/packages/hooks")) {
            return "hooks";
          }
          if (id.includes("/packages/utils") || id.includes("plugin-vue:export-helper")) {
            return "utils";
          }
          for (const item of getDirectoriesSync("../components")) {
            if (id.includes(`/packages/components/${item}`)) {
              return item;
            }
          }
        }
      }
    }
  }
});
export {
  vite_es_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS5lcy5jb25maWcudHMiLCAiYnVpbGQvaG9va3NQbHVnaW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxSZXBvc2l0b3JpZXNcXFxcbWVsb24tZWxlbWVudFxcXFxwYWNrYWdlc1xcXFxjb3JlXFxcXGJ1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxSZXBvc2l0b3JpZXNcXFxcbWVsb24tZWxlbWVudFxcXFxwYWNrYWdlc1xcXFxjb3JlXFxcXGJ1aWxkXFxcXHZpdGUuZXMuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9SZXBvc2l0b3JpZXMvbWVsb24tZWxlbWVudC9wYWNrYWdlcy9jb3JlL2J1aWxkL3ZpdGUuZXMuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgcmVhZGRpclN5bmMsIHJlYWRkaXIgfSBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmVyLCBkZWxheSwgZmlsdGVyLCBtYXAgfSBmcm9tIFwibG9kYXNoLWVzXCI7XHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XHJcbmltcG9ydCBzaGVsbCBmcm9tIFwic2hlbGxqc1wiO1xyXG5cclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5pbXBvcnQgdGVyc2VyIGZyb20gXCJAcm9sbHVwL3BsdWdpbi10ZXJzZXJcIjtcclxuaW1wb3J0IGhvb2tzIGZyb20gXCIuL2hvb2tzUGx1Z2luXCI7XHJcblxyXG5jb25zdCBUUllfTU9WRV9TVFlMRVNfREVMQVkgPSA3NTAgYXMgY29uc3Q7XHJcblxyXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCI7XHJcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxuY29uc3QgaXNUZXN0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiO1xyXG5cclxuZnVuY3Rpb24gZ2V0RGlyZWN0b3JpZXNTeW5jKGJhc2VQYXRoOiBzdHJpbmcpIHtcclxuICBjb25zdCBlbnRyaWVzID0gcmVhZGRpclN5bmMoYmFzZVBhdGgsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcclxuXHJcbiAgcmV0dXJuIG1hcChcclxuICAgIGZpbHRlcihlbnRyaWVzLCAoZW50cnkpID0+IGVudHJ5LmlzRGlyZWN0b3J5KCkpLFxyXG4gICAgKGVudHJ5KSA9PiBlbnRyeS5uYW1lXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbW92ZVN0eWxlcygpIHtcclxuICByZWFkZGlyKFwiLi9kaXN0L2VzL3RoZW1lXCIsIChlcnIpID0+IHtcclxuICAgIGlmIChlcnIpIHJldHVybiBkZWxheShtb3ZlU3R5bGVzLCBUUllfTU9WRV9TVFlMRVNfREVMQVkpO1xyXG4gICAgZGVmZXIoKCkgPT4gc2hlbGwubXYoXCIuL2Rpc3QvZXMvdGhlbWVcIiwgXCIuL2Rpc3RcIikpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdmlzdWFsaXplcih7XHJcbiAgICAgIGZpbGVuYW1lOiBcImRpc3Qvc3RhdHMuZXMuaHRtbFwiLFxyXG4gICAgfSksXHJcbiAgICBkdHMoe1xyXG4gICAgICB0c2NvbmZpZ1BhdGg6IFwiLi4vLi4vdHNjb25maWcuYnVpbGQuanNvblwiLFxyXG4gICAgICBvdXREaXI6IFwiZGlzdC90eXBlc1wiLFxyXG4gICAgfSksXHJcbiAgICB0ZXJzZXIoe1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIHNlcXVlbmNlczogaXNQcm9kLFxyXG4gICAgICAgIGFyZ3VtZW50czogaXNQcm9kLFxyXG4gICAgICAgIGRyb3BfY29uc29sZTogaXNQcm9kICYmIFtcImxvZ1wiXSxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBpc1Byb2QsXHJcbiAgICAgICAgcGFzc2VzOiBpc1Byb2QgPyA0IDogMSxcclxuICAgICAgICBnbG9iYWxfZGVmczoge1xyXG4gICAgICAgICAgXCJAREVWXCI6IEpTT04uc3RyaW5naWZ5KGlzRGV2KSxcclxuICAgICAgICAgIFwiQFRFU1RcIjogSlNPTi5zdHJpbmdpZnkoaXNUZXN0KSxcclxuICAgICAgICAgIFwiQFBST0RcIjogSlNPTi5zdHJpbmdpZnkoaXNQcm9kKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBmb3JtYXQ6IHtcclxuICAgICAgICBzZW1pY29sb25zOiBmYWxzZSxcclxuICAgICAgICBzaG9ydGhhbmQ6IGlzUHJvZCxcclxuICAgICAgICBicmFjZXM6ICFpc1Byb2QsXHJcbiAgICAgICAgYmVhdXRpZnk6ICFpc1Byb2QsXHJcbiAgICAgICAgY29tbWVudHM6ICFpc1Byb2QsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmdsZToge1xyXG4gICAgICAgIHRvcGxldmVsOiBpc1Byb2QsXHJcbiAgICAgICAgZXZhbDogaXNQcm9kLFxyXG4gICAgICAgIGtlZXBfY2xhc3NuYW1lczogaXNEZXYsXHJcbiAgICAgICAga2VlcF9mbmFtZXM6IGlzRGV2LFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICBob29rcyh7XHJcbiAgICAgIHJtRmlsZXM6IFtcclxuICAgICAgICBcIi4vZGlzdC9lc1wiLFxyXG4gICAgICAgIFwiLi9kaXN0L3RoZW1lXCIsXHJcbiAgICAgICAgXCIuL2Rpc3QvdHlwZXNcIixcclxuICAgICAgICBcIi4vZGlzdC9zdGF0c2VzLmh0bWxcIixcclxuICAgICAgXSxcclxuICAgICAgYWZ0ZXJCdWlsZDogbW92ZVN0eWxlcyxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogXCJkaXN0L2VzXCIsXHJcbiAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgc291cmNlbWFwOiAhaXNQcm9kLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9pbmRleC50c1wiKSxcclxuICAgICAgbmFtZTogXCJNZWxvblVJXCIsXHJcbiAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFtcclxuICAgICAgICBcInZ1ZVwiLFxyXG4gICAgICAgIFwiQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlXCIsXHJcbiAgICAgICAgXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIixcclxuICAgICAgICBcIkBmb3J0YXdlc29tZS92dWUtZm9udGF3ZXNvbWVcIixcclxuICAgICAgICBcIkBwb3BwZXJqcy9jb3JlXCIsXHJcbiAgICAgICAgXCJhc3luYy12YWxpZGF0b3JcIixcclxuICAgICAgXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChjaHVua0luZm8pID0+IHtcclxuICAgICAgICAgIGlmIChjaHVua0luZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJpbmRleC5jc3NcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgY2h1bmtJbmZvLnR5cGUgPT09IFwiYXNzZXRcIiAmJlxyXG4gICAgICAgICAgICAvXFwuKGNzcykkL2kudGVzdChjaHVua0luZm8ubmFtZSBhcyBzdHJpbmcpXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGhlbWUvW25hbWVdLltleHRdXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gY2h1bmtJbmZvLm5hbWUgYXMgc3RyaW5nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCIvcGFja2FnZXMvaG9va3NcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiaG9va3NcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgaWQuaW5jbHVkZXMoXCIvcGFja2FnZXMvdXRpbHNcIikgfHxcclxuICAgICAgICAgICAgaWQuaW5jbHVkZXMoXCJwbHVnaW4tdnVlOmV4cG9ydC1oZWxwZXJcIilcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ1dGlsc1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGdldERpcmVjdG9yaWVzU3luYyhcIi4uL2NvbXBvbmVudHNcIikpIHtcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKGAvcGFja2FnZXMvY29tcG9uZW50cy8ke2l0ZW19YCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFJlcG9zaXRvcmllc1xcXFxtZWxvbi1lbGVtZW50XFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFJlcG9zaXRvcmllc1xcXFxtZWxvbi1lbGVtZW50XFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcYnVpbGRcXFxcaG9va3NQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1JlcG9zaXRvcmllcy9tZWxvbi1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGQvaG9va3NQbHVnaW4udHNcIjtpbXBvcnQge2VhY2gsaXNGdW5jdGlvbn0gZnJvbSAnbG9kYXNoLWVzJ1xyXG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGxqcydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhvb2tzUGx1Z2luKHtcclxuICAgIHJtRmlsZXM9W10sXHJcbiAgICBhZnRlckJ1aWxkLFxyXG4gICAgYmVmb3JlQnVpbGRcclxufTp7XHJcbiAgICBiZWZvcmVCdWlsZD86RnVuY3Rpb24sXHJcbiAgICBhZnRlckJ1aWxkPzpGdW5jdGlvbixcclxuICAgIHJtRmlsZXM/OnN0cmluZ1tdXHJcbn0pe1xyXG5yZXR1cm4ge1xyXG4gICAgbmFtZTonY3VzdG9tLWhvb2tzLXBsdWdpbicsXHJcbiAgICBidWlsZFN0YXJ0KCl7XHJcbiAgICAgICAgZWFjaChybUZpbGVzLChmTmFtZSk9PnNoZWxsLnJtKFwiLXJmXCIsZk5hbWUpKVxyXG4gICAgICAgIGlzRnVuY3Rpb24oYmVmb3JlQnVpbGQpJiZiZWZvcmVCdWlsZCgpXHJcbiAgICB9LFxyXG4gICAgYnVpbGRFbmQoZXJyPzpFcnJvcil7XHJcbiAgICAgICAgIWVyciYmaXNGdW5jdGlvbihhZnRlckJ1aWxkKSYmYWZ0ZXJCdWlsZCgpXHJcbiAgICB9XHJcbn1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxvQkFBb0I7QUFDcFgsU0FBUyxhQUFhLGVBQWU7QUFDckMsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsT0FBTyxPQUFPLFFBQVEsV0FBVztBQUMxQyxTQUFTLGtCQUFrQjtBQUMzQixPQUFPQSxZQUFXO0FBRWxCLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZOzs7QUNUOFQsU0FBUSxNQUFLLGtCQUFpQjtBQUMvVyxPQUFPLFdBQVc7QUFFSCxTQUFSLFlBQTZCO0FBQUEsRUFDaEMsVUFBUSxDQUFDO0FBQUEsRUFDVDtBQUFBLEVBQ0E7QUFDSixHQUlFO0FBQ0YsU0FBTztBQUFBLElBQ0gsTUFBSztBQUFBLElBQ0wsYUFBWTtBQUNSLFdBQUssU0FBUSxDQUFDLFVBQVEsTUFBTSxHQUFHLE9BQU0sS0FBSyxDQUFDO0FBQzNDLGlCQUFXLFdBQVcsS0FBRyxZQUFZO0FBQUEsSUFDekM7QUFBQSxJQUNBLFNBQVMsS0FBVztBQUNoQixPQUFDLE9BQUssV0FBVyxVQUFVLEtBQUcsV0FBVztBQUFBLElBQzdDO0FBQUEsRUFDSjtBQUNBOzs7QUR0QkEsSUFBTSxtQ0FBbUM7QUFZekMsSUFBTSx3QkFBd0I7QUFFOUIsSUFBTSxTQUFTLFFBQVEsSUFBSSxhQUFhO0FBQ3hDLElBQU0sUUFBUSxRQUFRLElBQUksYUFBYTtBQUN2QyxJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFFeEMsU0FBUyxtQkFBbUIsVUFBa0I7QUFDNUMsUUFBTSxVQUFVLFlBQVksVUFBVSxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBRTdELFNBQU87QUFBQSxJQUNMLE9BQU8sU0FBUyxDQUFDLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFBQSxJQUM5QyxDQUFDLFVBQVUsTUFBTTtBQUFBLEVBQ25CO0FBQ0Y7QUFFQSxTQUFTLGFBQWE7QUFDcEIsVUFBUSxtQkFBbUIsQ0FBQyxRQUFRO0FBQ2xDLFFBQUk7QUFBSyxhQUFPLE1BQU0sWUFBWSxxQkFBcUI7QUFDdkQsVUFBTSxNQUFNQyxPQUFNLEdBQUcsbUJBQW1CLFFBQVEsQ0FBQztBQUFBLEVBQ25ELENBQUM7QUFDSDtBQUVBLElBQU8seUJBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLGNBQWM7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFdBQVc7QUFBQSxRQUNYLFdBQVc7QUFBQSxRQUNYLGNBQWMsVUFBVSxDQUFDLEtBQUs7QUFBQSxRQUM5QixlQUFlO0FBQUEsUUFDZixRQUFRLFNBQVMsSUFBSTtBQUFBLFFBQ3JCLGFBQWE7QUFBQSxVQUNYLFFBQVEsS0FBSyxVQUFVLEtBQUs7QUFBQSxVQUM1QixTQUFTLEtBQUssVUFBVSxNQUFNO0FBQUEsVUFDOUIsU0FBUyxLQUFLLFVBQVUsTUFBTTtBQUFBLFFBQ2hDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osV0FBVztBQUFBLFFBQ1gsUUFBUSxDQUFDO0FBQUEsUUFDVCxVQUFVLENBQUM7QUFBQSxRQUNYLFVBQVUsQ0FBQztBQUFBLE1BQ2I7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLGlCQUFpQjtBQUFBLFFBQ2pCLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFNO0FBQUEsTUFDSixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsSUFDZCxXQUFXLENBQUM7QUFBQSxJQUNaLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQixDQUFDLGNBQWM7QUFDN0IsY0FBSSxVQUFVLFNBQVMsYUFBYTtBQUNsQyxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUNFLFVBQVUsU0FBUyxXQUNuQixZQUFZLEtBQUssVUFBVSxJQUFjLEdBQ3pDO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU8sVUFBVTtBQUFBLFFBQ25CO0FBQUEsUUFDQSxhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxHQUFHLFNBQVMsaUJBQWlCLEdBQUc7QUFDbEMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FDRSxHQUFHLFNBQVMsaUJBQWlCLEtBQzdCLEdBQUcsU0FBUywwQkFBMEIsR0FDdEM7QUFDQSxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxxQkFBVyxRQUFRLG1CQUFtQixlQUFlLEdBQUc7QUFDdEQsZ0JBQUksR0FBRyxTQUFTLHdCQUF3QixJQUFJLEVBQUUsR0FBRztBQUMvQyxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInNoZWxsIiwgInNoZWxsIl0KfQo=
