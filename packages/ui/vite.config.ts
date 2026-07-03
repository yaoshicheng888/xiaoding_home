import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { resolve } from "path"

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    }),
  ],
  root: process.env.NODE_ENV === "development" ? __dirname : undefined,
  publicDir: false,
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: false,
        exports: "named",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "styles/globals.css"
          return assetInfo.name || "assets/[name][extname]"
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
