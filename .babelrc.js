
export default {
  presets: [
    ["@babel/preset-env"],
    ["@babel/preset-react"],
    // ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
