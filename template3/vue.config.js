/*
 * @Description:
 * @Author: lc
 * @Date: 2019-12-24 16:02:18
 * @LastEditTime: 2020-06-03 14:46:19
 * @LastEditors: lc
 */
// vue.config.js 配置说明
module.exports = {
    publicPath: '<%= '/' + options.moduleName %>',
    outputDir: '<%= 'dist/' + options.moduleName %>',
    assetsDir: './static',
    css: {
        modules: false,
        extract: true,
        sourceMap: false,
        loaderOptions: {
            css: {},
            sass: {}
        }
    },
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        port: 8085, // 端口号
        host: '0.0.0.0',
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器
        proxy: {
            '<%= '/' + options.moduleName + '/api' %>': {
                target: 'http://192.168.1.69:8080',
                changeOrigin: true,
                pathRewrite: {
                    '<%= '^/' + options.moduleName + '/api' %>': '<%= '/' + options.moduleName %>'
                }
            }
        } // 配置多个代理
    }
}