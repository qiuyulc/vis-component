
export default {
  presets: [
    ['@babel/preset-env', { 
      loose: true  // 添加 loose 选项
    }],
    '@babel/preset-react',
    // '@babel/preset-typescript'
  ],
  plugins: [['@babel/plugin-transform-runtime', {
    regenerator: true,
    corejs: false, // 或者指定版本如 3
    helpers: true,
    useESModules: true
  }]],
  // 排除 node_modules 中的文件
  exclude: '**/node_modules/**'
};
