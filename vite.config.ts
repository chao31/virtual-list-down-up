import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import libCss from "vite-plugin-libcss";
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src/"),
    },
  },
  plugins: [react(), libCss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Index",
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
        },
      },
    },
  },
});
