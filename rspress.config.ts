import { defineConfig } from 'rspress/config';
import path from 'path';
export default defineConfig({
  // 文档根目录
  root: 'docs',
  base:'/vis-component/',
  route:{
    exclude:['docs/components/*.tsx'],
  },
  globalStyles: path.join(__dirname, 'docs/index.css'),
  logo: '/user.jpg',
  logoText:'vis-component',
  builderConfig: {
    resolve: {
      alias: {
        '@': './src',
        '@components':'./docs/components'
      },
    },
  },
  themeConfig: {
    socialLinks: [
        {
          icon: 'github',
          mode: 'link',
          content:'https://github.com/qiuyulc/vis-component'
        },
      ],
    darkMode: false,
    outlineTitle: '目录',
    prevPageText: '上一页',
    nextPageText: '下一页',
    nav: [
        {
            text:'首页',
            link:'/index',
        },
        {
            text:'指南',
            link:'/zh/start/introduction'
        }
    ],
    sidebar:{
        "/zh/start/":[
            {
                text:'开始',
                items:[
                    {
                        text:'介绍',
                        link:'/zh/start/introduction'
                    }
                ]
            },
            {
                text:'组件',
                items:[
                    {
                        text:'Echarts',
                        link:'/zh/start/components/echarts',
                    },
                    {
                        text:'Search',
                        link:'/zh/start/components/search',
                    }
                ]
            }
        ]
    }
  },
});