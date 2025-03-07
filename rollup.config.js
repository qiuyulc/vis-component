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
  resolve(),
  commonjs(),
  postcss({
    extensions: [".less"], // 指定处理的文件扩展名
    // inject: false, // 不将样式注入到 JavaScript 中，而是在单独的 CSS 文件中输出
    minimize: true, // 压缩 CSS
    extract: true,
  }),
  typescript({ tsconfig: "./tsconfig.build.json" }),
  babel({
    presets: ["@babel/preset-env"],
    exclude: "**/node_modules/**", // 排除 node_modules 中的文件
    babelHelpers: "bundled",
  }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }),
];

if (!isProduction) {
  plugin.push(
    ...[
      html({
        title: "本地运行",
        fileName: "index.html", // 生成的 HTML 文件名
        template: ({ attributes, files, meta, publicPath, title }) => {
          return template;
        },
        publicPath: "./", // 设置公共路径
      }),
      serve({
        open: true, // 自动打开浏览器
        contentBase: "dist", //
        port: 3000, // 端口号
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

export default [
  {
    input: isProduction ? ["./src/index.ts", ...inputs] : "./src/App.tsx",
    output: isProduction
      ? output
      : {
          file: "./dist/bundle.js",
          format: "esm",
          sourcemap: !isProduction,
          name: `${widgetPathName}`,
          // globals: {
          //   react: "React",
          //   "react-dom": "ReactDOM",
          // },
        },
    external: isProduction ? ["react", "react-dom", "antd", "echarts"] : [],
    plugins: plugin,
  },
];
