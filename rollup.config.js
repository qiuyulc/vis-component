import fs from "fs";
import path from "path";
import url from "url";
import html from "@rollup/plugin-html";
import serve from "rollup-plugin-serve"; //本地服务器
import livereload from "rollup-plugin-livereload"; //自动刷新
import del from "rollup-plugin-delete"; //清理上次生成内容
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";

import { visualizer } from "rollup-plugin-visualizer";
import esbuild from "rollup-plugin-esbuild";

import postcss from "rollup-plugin-postcss";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 读取本地模板文件
const template = fs.readFileSync(
  path.resolve(__dirname, "./public/index.html"),
  "utf-8"
);

const packageJsonPath = fs.readFileSync(
  path.resolve(__dirname, "./package.json"),
  "utf-8"
);

const componentsDir = "./src/components";

const componentNames = fs.readdirSync(path.resolve(componentsDir));

const inputs = componentNames.map((name) => {
  return `${componentsDir}/${name}/index.tsx`;
});

// const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");
// const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

const packageJson = JSON.parse(packageJsonPath);

const { data } = packageJson;
const widgetPathName = data.widgetName;

const isProduction = process.env.NODE_ENV === "production";

const plugin = [
  del({
    targets: ["dist/*"], // 清理 dist 目录下的所有文件
  }),
  replace({
    preventAssignment: true,
    "use client": "",
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }),
  resolve({
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    preferBuiltins: true,
  }),
  commonjs({
    transformMixedEsModules: true,
    requireReturnsDefault: "auto",
  }),
  // typescript({
  //   tsconfig: isProduction ? "./tsconfig.build.json" : "./tsconfig.json",
  // }),
  postcss({
    extensions: [".less"], // 指定处理的文件扩展名
    // inject: false, // 不将样式注入到 JavaScript 中，而是在单独的 CSS 文件中输出
    minimize: true, // 压缩 CSS
    extract: true,
  }),

  // babel({
  //   babelHelpers: "runtime",
  //   // 如果您在 babel.config.js 中已经设置了 exclude，这里可以不再设置
  //   // 或者保持一致的配置
  //   exclude: "**/node_modules/**",
  //   extensions: [".js", ".jsx", ".ts", ".tsx"],
  // }),
];

if (isProduction) {
  plugin.push(
    typescript({
      // tsconfig: isProduction ? "./tsconfig.build.json" : "./tsconfig.json",
      tsconfig: "./tsconfig.build.json",
    }),
    babel({
      babelHelpers: "runtime",
      // 如果您在 babel.config.js 中已经设置了 exclude，这里可以不再设置
      // 或者保持一致的配置
      exclude: "**/node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    })
  );
}

if (!isProduction) {
  plugin.push(
    ...[
      // visualizer({
      //   open: true, // 在浏览器中自动打开报告
      //   gzipSize: true, // 显示gzip压缩后的尺寸
      //   brotliSize: true, // 显示brotli压缩后的尺寸
      // }),
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: true,
        minify: process.env.NODE_ENV === "production",
        target: "es2017",
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        // 添加这些选项
        treeShaking: true,
        legalComments: "none",
        logLevel: "error", // 减少日志输出
        loaders: {
          // 明确指定各种文件的加载器
          ".js": "jsx",
          ".jsx": "jsx",
          ".ts": "tsx",
          ".tsx": "tsx",
        },
      }),
      html({
        title: "vis-component",
        fileName: "index.html",
        publicPath: "./",
        template: ({ attributes, files, meta, publicPath, title }) => {
          return template;
        },
      }),
      serve({
        open: true, // 自动打开浏览器
        contentBase: "dist", //
        port: 3001, // 端口号
      }),
      livereload({
        watch: "dist", // 监听 public 目录
      }),
    ]
  );
}

const output = {
  dir: "./dist/es/",
  format: "es",
  preserveModules: true,
  preserveModulesRoot: "src",
};

const CDN = {};
export default [
  {
    context: "window",
    // perf: true,
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    watch: {
      clearScreen: false,
      exclude: ["node_modules/**"],
      chokidar: {
        usePolling: false,
        ignoreInitial: true,
      },
    },
    input: isProduction ? ["./src/index.ts", ...inputs] : "./src/App.tsx",
    output: isProduction
      ? output
      : {
          file: "./dist/bundle.js",
          format: "esm",
          extend: true,
          sourcemap: true,
          name: `${widgetPathName}`,
        },
    external: isProduction ? ["react", "react-dom", "antd", "echarts"] : [],
    plugins: plugin,
  },
];
