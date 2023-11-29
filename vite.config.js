import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `@import "@/assets/css/var.sass"`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
