import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "rollup-plugin-json";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      extensions: [".css"]
    }),
    url(),
    svgr(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Adiciona suporte a JSX/TSX
      presets: [
        "@babel/preset-env", // Suporte ao ES6+
        "@babel/preset-react", // Suporte ao JSX
        "@babel/preset-typescript" // Suporte ao TypeScript
      ]
    }),
    json(),
    resolve(),
    commonjs(),
    typescript()
  ]
};
