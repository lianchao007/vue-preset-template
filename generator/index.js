/*
 * @Description: 
 * @Author: lc
 * @Date: 2020-06-03 09:57:26
 * @LastEditTime: 2020-06-03 15:09:53
 * @LastEditors: lc
 */ 
module.exports = (api, options, rootOptions) => {
  // 修改 `package.json` 里的字段
  api.extendPackage({
    dependencies: {
      "axios": "^0.18.0",
      "lodash": "^4.17.10"
    },
    devDependencies: {
      "mockjs": "^1.0.1-beta3"
    },
    scripts: {
      test: 'vue-cli-service  command'
    }
  })

  if (options.module === 'template2') {
    api.extendPackage({
      dependencies: {
        "core-js": "^3.4.3",
        "echarts": "^4.2.1",
        "element-ui": "^2.10.0",
        "file-saver": "^2.0.2",
        "intro.js": "^2.9.3",
        "vue": "^2.6.10",
        "vue-router": "^3.1.3",
        "xlsx": "^0.14.3",
        "xlsx-style": "^0.8.13"
      }
    })
  }

  console.log(options)
  api.render(`../${options.module}`)
}