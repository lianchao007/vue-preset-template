/*
 * @Description:
 * @Author: lc
 * @Date: 2019-12-24 16:02:18
 * @LastEditTime: 2020-06-03 11:00:55
 * @LastEditors: lc
 */
// vue.config.js 配置说明
module.exports = {
  // baseUrl  type:{string} default:'/'
  // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.
  publicPath: '/vue-template',

  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: 'dist/vue-template',
  // 静态资源打包地址
  assetsDir: './static',

  // pages:{ type:Object,Default:undfind }
  // css相关配置
  css: {
    /* 启用 CSS modules for all css / pre-processor files. */
    modules: false,
    /* 是否使用css分离插件 Default: 生产环境下是 true，开发环境下是 false */
    extract: true,
    /* 开启 CSS source maps? */
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      sass: {
        // 这里的选项会传递给 sass-loader 假设你有 `src/variables.scss` 这个文件
        // data: `@import "~@/variables.scss";`
      }
    }
  },

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8085, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/vue-template/api': {
        target: 'http://192.168.1.69:8080',
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/vue-template/api': '/vue-template' // 这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      }
      //   "/foo": {
      //     target: "<other_url>"
      //   }
    } // 配置多个代理
  }
}
