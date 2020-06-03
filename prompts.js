/*
 * @Description: 
 * @Author: lc
 * @Date: 2020-06-03 09:57:26
 * @LastEditTime: 2020-06-03 11:05:59
 * @LastEditors: lc
 */ 
module.exports = [
  {
    type: 'list', // 即类型为 选择项
    name: 'module', // 名称，作为下面 generator 函数 options 的键
    message: '请选择你要生成的模块', // 提示语
    choices: [
      { name: 'Default', value: 'template' },
      { name: 'Module1', value: 'template1' },
      { name: 'Module2', value: 'template2' }
    ],
    default: 'template',
  },
  {
    type: 'input', // 类型为 输入项
    name: 'moduleName',
    message: '请输入模块名称',
    default: 'myProject'
  }
]