// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  // 组件由jsx书写，需要vuejsx插件读取
  plugins: [vue(), vueJsx()],
  test: {
    globals: true, // 可以在测试环境中使用全局变量、函数、对象。无需在每个文件中再次导入
    environment: "jsdom", // 使用jsdom作为测试环境
  },
});

// "test": "vitest --coverage"
