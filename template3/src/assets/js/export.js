var XLSX = require('xlsx-style/xlsx.js')
var FileSaver = require('file-saver')
export default {
  downloadMater (data, name) {
    const wopts = {
      bookType: 'xlsx', bookSST: false, type: 'binary'}
    const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
    console.log(data, XLSX)
    wb.Sheets['Sheet1'] = data
    // 创建二进制对象写入转换好的字节流
    let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
    FileSaver.saveAs(tmpDown, name + '.xls')
  },
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
  transDate (milliseconds) {
    var date = new Date(Number(milliseconds))
    return date.getFullYear() + '-' + this.addZero(date.getMonth() + 1) + '-' + this.addZero(date.getDate()) + ' ' + this.addZero(date.getHours()) + ':' + this.addZero(date.getMinutes()) + ':' + this.addZero(date.getSeconds())
  },
  addZero (num) {
    return num < 10 ? '0' + num : num
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
  }
}
