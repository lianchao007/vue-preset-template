/*
 * @Description: 导出excel
 * @Author: lc
 * @Date: 2019-07-19 13:53:45
 * @LastEditTime : 2020-01-08 11:12:13
 * @LastEditors  : 方俊杰
 */
let XLSX = require('xlsx-style/xlsx.js')
let FileSaver = require('file-saver')
export default {
  // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
  sheet2blob (sheet, sheetName) {
    sheetName = sheetName || 'sheet1'
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    }
    workbook.Sheets[sheetName] = sheet
    // 生成excel的配置项
    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    }
    var wbout = XLSX.write(workbook, wopts)
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    // 字符串转ArrayBuffer
    function s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
    return blob
  },
  // 读取excel数据
  readXLS (data, callBack) {
    let _self = this
    let files = data.target.files
    let f = files[0]
    if (!files || f.name.indexOf('.xls') === -1) { // 判断文件的格式是否是xls或者xlsx
      _self.$message({
        message: '请检查上传文件格式',
        type: 'warning'
      })
      return
    }
    this.fileName = f.name
    var reader = new FileReader()
    reader.readAsBinaryString(f)
    reader.onload = function (e) {
      let res = e.target.result
      let wb = XLSX.read(res, {
        type: 'binary'
      })
      callBack && callBack(wb)
    }
  },
  // 数据格式化
  formatData (data) {
    var reg = /^([A-Z]+)(\d+)$/
    let result = []
    for (var j in data) { // 遍历各表的数据
      if (reg.test(j)) {
        var o = j.match(reg)
        if (!result[o[2] - 1]) {
          result[o[2] - 1] = []
        }
        result[o[2] - 1][this.alpToNum(o[1])] = data[j].w ? data[j].w.replace(/\s+/g, '').replace(/[\r\n]/g, '') : '' // 这个replace是去空格和回车以及换行的
      }
    }
    return result
  },
  // 导出
  downloadMater (data, name) {
    const wopts = {
      bookType: 'xlsx', bookSST: false, type: 'binary' }
    const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
    // console.log(data, XLSX)
    wb.Sheets['Sheet1'] = data
    // 创建二进制对象写入转换好的字节流
    let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
    FileSaver.saveAs(tmpDown, name + '.xls')
  },
  /*
   导出多个sheet页的Excel
   @params data: 导出excel的数据，包括excel的样式配置信息
   @params sheet: excel中sheet里的名称数组
   @params name: 导出文件的名称
   */
  downloadMaterMultiple (data, sheet, name) {
    const wopts = {
      bookType: 'xlsx', bookSST: false, type: 'binary' }
    const wb = { SheetNames: sheet, Sheets: data, Props: {} }
    // 创建二进制对象写入转换好的字节流
    let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
    FileSaver.saveAs(tmpDown, name + '.xls')
  },
  // 数字顺序转字母
  getCharCol (n) {
    var s = ''
    var m = 0
    while (n > 0) {
      m = n % 26 + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  },
  // 字符串转字符流
  s2ab (s) {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    } else {
      var buf2 = new Array(s.length)
      for (var j = 0; j !== s.length; ++j) buf2[i] = s.charCodeAt(j) & 0xFF
      return buf2
    }
  },
  // 字母顺序转数字
  alpToNum (str) {
    var num = 0
    var alpArr = str.toLowerCase().split('').reverse()
    for (var i = 0, len = alpArr.length; i < len; i++) {
      num += ((alpArr[i].charCodeAt() - 96) * Math.pow(26, i))
    }
    return num - 1
  }
}
