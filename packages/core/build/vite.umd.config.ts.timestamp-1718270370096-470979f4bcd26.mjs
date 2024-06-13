// build/vite.umd.config.ts
import { defineConfig } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/vite@5.2.11_@types+node@20.12.10_terser@5.31.1/node_modules/vite/dist/node/index.js";
import { readFile } from "fs";
import { resolve } from "path";
import { defer, delay } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import { visualizer } from "file:///E:/Repositories/melon-element/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0_rollup@4.17.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";

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

// build/vite.umd.config.ts
import shell2 from "file:///E:/Repositories/melon-element/node_modules/.pnpm/shelljs@0.8.5/node_modules/shelljs/shell.js";
import vue from "file:///E:/Repositories/melon-element/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.11_@types+node@20.12.10_terser@5.31.1__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import compression from "file:///E:/Repositories/melon-element/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.2.11_@types+node@20.12.10_terser@5.31.1_/node_modules/vite-plugin-compression/dist/index.mjs";
import terser from "file:///E:/Repositories/melon-element/node_modules/.pnpm/@rollup+plugin-terser@0.4.4_rollup@4.17.2/node_modules/@rollup/plugin-terser/dist/es/index.js";
var __vite_injected_original_dirname = "E:\\Repositories\\melon-element\\packages\\core\\build";
var TRY_MOVE_STYLES_DELAY = 750;
var isProd = process.env.NODE_ENV === "production";
var isDev = process.env.NODE_ENV === "development";
var isTest = process.env.NODE_ENV === "test";
function moveStyles() {
  readFile("./dist/umd/index.css.gz", (err) => {
    if (err)
      return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
    defer(() => shell2.cp("./dist/umd/index.css", "./dist/index.css"));
  });
}
var vite_umd_config_default = defineConfig({
  plugins: [
    vue(),
    compression({
      filter: /.(cjs|css)$/i
    }),
    visualizer({
      filename: "dist/stats.umd.html"
    }),
    terser({
      compress: {
        drop_console: ["log"],
        drop_debugger: true,
        passes: 3,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest)
        }
      }
    }),
    hooksPlugin({
      rmFiles: ["./dist/umd", "./dist/index.css", "./dist/stats.umd.html"],
      afterBuild: moveStyles
    })
  ],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__vite_injected_original_dirname, "../index.ts"),
      name: "MelonUI",
      fileName: "index",
      formats: ["umd"]
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue"
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "index.css";
          }
          return chunkInfo.name;
        }
      }
    }
  }
});
export {
  vite_umd_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS51bWQuY29uZmlnLnRzIiwgImJ1aWxkL2hvb2tzUGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcUmVwb3NpdG9yaWVzXFxcXG1lbG9uLWVsZW1lbnRcXFxccGFja2FnZXNcXFxcY29yZVxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUmVwb3NpdG9yaWVzXFxcXG1lbG9uLWVsZW1lbnRcXFxccGFja2FnZXNcXFxcY29yZVxcXFxidWlsZFxcXFx2aXRlLnVtZC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1JlcG9zaXRvcmllcy9tZWxvbi1lbGVtZW50L3BhY2thZ2VzL2NvcmUvYnVpbGQvdml0ZS51bWQuY29uZmlnLnRzXCI7aW1wb3J0IHtidWlsZCwgZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgeyByZWFkRmlsZX0gZnJvbSAnZnMnXHJcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAncGF0aCdcclxuaW1wb3J0IHtkZWZlcixkZWxheX0gZnJvbSAnbG9kYXNoLWVzJ1xyXG5pbXBvcnQge3Zpc3VhbGl6ZXJ9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuLy8gaW1wb3J0IHtob29rc1BsdWdpbiBhcyBob29rc30gZnJvbSAnQG1lbG9uJ1xyXG5pbXBvcnQgaG9va3MgZnJvbSBcIi4vaG9va3NQbHVnaW5cIjtcclxuaW1wb3J0IHNoZWxsIGZyb20gJ3NoZWxsanMnXHJcblxyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5pbXBvcnQgdGVyc2VyIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXRlcnNlcidcclxuXHJcbmNvbnN0IFRSWV9NT1ZFX1NUWUxFU19ERUxBWSA9IDc1MCBhcyBjb25zdFxyXG5cclxuY29uc3QgaXNQcm9kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09J3Byb2R1Y3Rpb24nXHJcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcclxuY29uc3QgaXNUZXN0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICd0ZXN0J1xyXG5cclxuZnVuY3Rpb24gbW92ZVN0eWxlcygpe1xyXG4gICAgcmVhZEZpbGUoXCIuL2Rpc3QvdW1kL2luZGV4LmNzcy5nelwiLChlcnIpPT57XHJcbiAgICAgICAgaWYoZXJyKSByZXR1cm4gZGVsYXkobW92ZVN0eWxlcyxUUllfTU9WRV9TVFlMRVNfREVMQVkpXHJcbiAgICAgICAgICAgIGRlZmVyKCgpPT5zaGVsbC5jcCgnLi9kaXN0L3VtZC9pbmRleC5jc3MnLCcuL2Rpc3QvaW5kZXguY3NzJykpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczpbXHJcbiAgICAgICAgdnVlKCksXHJcbiAgICAgICAgY29tcHJlc3Npb24oe1xyXG4gICAgICAgICAgICBmaWx0ZXI6Ly4oY2pzfGNzcykkL2lcclxuICAgICAgICB9KSxcclxuICAgICAgICB2aXN1YWxpemVyKHtcclxuICAgICAgICAgICAgZmlsZW5hbWU6J2Rpc3Qvc3RhdHMudW1kLmh0bWwnXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdGVyc2VyKHtcclxuICAgICAgICAgICAgY29tcHJlc3M6e1xyXG4gICAgICAgICAgICAgICAgZHJvcF9jb25zb2xlOltcImxvZ1wiXSxcclxuICAgICAgICAgICAgICAgIGRyb3BfZGVidWdnZXI6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhc3NlczozLFxyXG4gICAgICAgICAgICAgICAgZ2xvYmFsX2RlZnM6e1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQERFVlwiOkpTT04uc3RyaW5naWZ5KGlzRGV2KSxcclxuICAgICAgICAgICAgICAgICAgICBcIkBQUk9EXCI6SlNPTi5zdHJpbmdpZnkoaXNQcm9kKSxcclxuICAgICAgICAgICAgICAgICAgICBcIkBURVNUXCI6SlNPTi5zdHJpbmdpZnkoaXNUZXN0KSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGhvb2tzKHtcclxuICAgICAgICAgICAgcm1GaWxlczpbXCIuL2Rpc3QvdW1kXCIsXCIuL2Rpc3QvaW5kZXguY3NzXCIsXCIuL2Rpc3Qvc3RhdHMudW1kLmh0bWxcIl0sXHJcbiAgICAgICAgICAgIGFmdGVyQnVpbGQ6bW92ZVN0eWxlc1xyXG4gICAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIGJ1aWxkOntcclxuICAgICBvdXREaXI6J2Rpc3QvdW1kJyxcclxuICAgICBsaWI6e1xyXG4gICAgICAgIGVudHJ5OnJlc29sdmUoX19kaXJuYW1lLCcuLi9pbmRleC50cycpLFxyXG4gICAgICAgIG5hbWU6J01lbG9uVUknLFxyXG4gICAgICAgIGZpbGVOYW1lOidpbmRleCcsXHJcbiAgICAgICAgZm9ybWF0czpbJ3VtZCddXHJcbiAgICAgfSxcclxuICAgICByb2xsdXBPcHRpb25zOntcclxuICAgICAgICBleHRlcm5hbDpbJ3Z1ZSddLFxyXG4gICAgICAgIG91dHB1dDp7XHJcbiAgICAgICAgICAgIGV4cG9ydHM6J25hbWVkJyxcclxuICAgICAgICAgICAgZ2xvYmFsczp7XHJcbiAgICAgICAgICAgICAgICB2dWU6J1Z1ZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6KGNodW5rSW5mbyk9PntcclxuICAgICAgICAgICAgICAgIGlmKGNodW5rSW5mby5uYW1lPT09J3N0eWxlLmNzcycpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnaW5kZXguY3NzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNodW5rSW5mby5uYW1lIGFzIHN0cmluZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgIH0gICAgICAgXHJcbiAgICB9XHJcbn0pIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxSZXBvc2l0b3JpZXNcXFxcbWVsb24tZWxlbWVudFxcXFxwYWNrYWdlc1xcXFxjb3JlXFxcXGJ1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxSZXBvc2l0b3JpZXNcXFxcbWVsb24tZWxlbWVudFxcXFxwYWNrYWdlc1xcXFxjb3JlXFxcXGJ1aWxkXFxcXGhvb2tzUGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9SZXBvc2l0b3JpZXMvbWVsb24tZWxlbWVudC9wYWNrYWdlcy9jb3JlL2J1aWxkL2hvb2tzUGx1Z2luLnRzXCI7aW1wb3J0IHtlYWNoLGlzRnVuY3Rpb259IGZyb20gJ2xvZGFzaC1lcydcclxuaW1wb3J0IHNoZWxsIGZyb20gJ3NoZWxsanMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBob29rc1BsdWdpbih7XHJcbiAgICBybUZpbGVzPVtdLFxyXG4gICAgYWZ0ZXJCdWlsZCxcclxuICAgIGJlZm9yZUJ1aWxkXHJcbn06e1xyXG4gICAgYmVmb3JlQnVpbGQ/OkZ1bmN0aW9uLFxyXG4gICAgYWZ0ZXJCdWlsZD86RnVuY3Rpb24sXHJcbiAgICBybUZpbGVzPzpzdHJpbmdbXVxyXG59KXtcclxucmV0dXJuIHtcclxuICAgIG5hbWU6J2N1c3RvbS1ob29rcy1wbHVnaW4nLFxyXG4gICAgYnVpbGRTdGFydCgpe1xyXG4gICAgICAgIGVhY2gocm1GaWxlcywoZk5hbWUpPT5zaGVsbC5ybShcIi1yZlwiLGZOYW1lKSlcclxuICAgICAgICBpc0Z1bmN0aW9uKGJlZm9yZUJ1aWxkKSYmYmVmb3JlQnVpbGQoKVxyXG4gICAgfSxcclxuICAgIGJ1aWxkRW5kKGVycj86RXJyb3Ipe1xyXG4gICAgICAgICFlcnImJmlzRnVuY3Rpb24oYWZ0ZXJCdWlsZCkmJmFmdGVyQnVpbGQoKVxyXG4gICAgfVxyXG59XHJcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlWLFNBQWUsb0JBQW1CO0FBQzNYLFNBQVMsZ0JBQWU7QUFDeEIsU0FBUSxlQUFjO0FBQ3RCLFNBQVEsT0FBTSxhQUFZO0FBQzFCLFNBQVEsa0JBQWlCOzs7QUNKd1QsU0FBUSxNQUFLLGtCQUFpQjtBQUMvVyxPQUFPLFdBQVc7QUFFSCxTQUFSLFlBQTZCO0FBQUEsRUFDaEMsVUFBUSxDQUFDO0FBQUEsRUFDVDtBQUFBLEVBQ0E7QUFDSixHQUlFO0FBQ0YsU0FBTztBQUFBLElBQ0gsTUFBSztBQUFBLElBQ0wsYUFBWTtBQUNSLFdBQUssU0FBUSxDQUFDLFVBQVEsTUFBTSxHQUFHLE9BQU0sS0FBSyxDQUFDO0FBQzNDLGlCQUFXLFdBQVcsS0FBRyxZQUFZO0FBQUEsSUFDekM7QUFBQSxJQUNBLFNBQVMsS0FBVztBQUNoQixPQUFDLE9BQUssV0FBVyxVQUFVLEtBQUcsV0FBVztBQUFBLElBQzdDO0FBQUEsRUFDSjtBQUNBOzs7QURmQSxPQUFPQSxZQUFXO0FBRWxCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFYbkIsSUFBTSxtQ0FBbUM7QUFhekMsSUFBTSx3QkFBd0I7QUFFOUIsSUFBTSxTQUFTLFFBQVEsSUFBSSxhQUFZO0FBQ3ZDLElBQU0sUUFBUSxRQUFRLElBQUksYUFBYTtBQUN2QyxJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFFeEMsU0FBUyxhQUFZO0FBQ2pCLFdBQVMsMkJBQTBCLENBQUMsUUFBTTtBQUN0QyxRQUFHO0FBQUssYUFBTyxNQUFNLFlBQVcscUJBQXFCO0FBQ2pELFVBQU0sTUFBSUMsT0FBTSxHQUFHLHdCQUF1QixrQkFBa0IsQ0FBQztBQUFBLEVBQ3JFLENBQUM7QUFDTDtBQUVBLElBQU8sMEJBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVE7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLFlBQVk7QUFBQSxNQUNSLFFBQU87QUFBQSxJQUNYLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNQLFVBQVM7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxNQUNILFVBQVM7QUFBQSxRQUNMLGNBQWEsQ0FBQyxLQUFLO0FBQUEsUUFDbkIsZUFBYztBQUFBLFFBQ2QsUUFBTztBQUFBLFFBQ1AsYUFBWTtBQUFBLFVBQ1IsUUFBTyxLQUFLLFVBQVUsS0FBSztBQUFBLFVBQzNCLFNBQVEsS0FBSyxVQUFVLE1BQU07QUFBQSxVQUM3QixTQUFRLEtBQUssVUFBVSxNQUFNO0FBQUEsUUFDakM7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxZQUFNO0FBQUEsTUFDRixTQUFRLENBQUMsY0FBYSxvQkFBbUIsdUJBQXVCO0FBQUEsTUFDaEUsWUFBVztBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE9BQU07QUFBQSxJQUNMLFFBQU87QUFBQSxJQUNQLEtBQUk7QUFBQSxNQUNELE9BQU0sUUFBUSxrQ0FBVSxhQUFhO0FBQUEsTUFDckMsTUFBSztBQUFBLE1BQ0wsVUFBUztBQUFBLE1BQ1QsU0FBUSxDQUFDLEtBQUs7QUFBQSxJQUNqQjtBQUFBLElBQ0EsZUFBYztBQUFBLE1BQ1gsVUFBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFFBQU87QUFBQSxRQUNILFNBQVE7QUFBQSxRQUNSLFNBQVE7QUFBQSxVQUNKLEtBQUk7QUFBQSxRQUNSO0FBQUEsUUFDQSxnQkFBZSxDQUFDLGNBQVk7QUFDeEIsY0FBRyxVQUFVLFNBQU8sYUFBWTtBQUM1QixtQkFBTztBQUFBLFVBQ1g7QUFDQSxpQkFBTyxVQUFVO0FBQUEsUUFDckI7QUFBQSxNQUNKO0FBQUEsSUFDSDtBQUFBLEVBQ0Q7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJzaGVsbCIsICJzaGVsbCJdCn0K
