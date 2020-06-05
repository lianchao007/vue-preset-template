/*
 * @Description:
 * @Author: lc
 * @Date: 2019-11-21 10:59:32
 * @LastEditTime: 2020-06-04 11:21:23
 * @LastEditors: lc
 */
export default {
  tableH: 'calc(100% - 40px)',
  tableH2: '100%',
  addZero (num) {
    return num < 10 ? '0' + num : num
  },
  getWeek (num) {
    switch (num) {
      case 0 :
        return '星期天'
      case 1 :
        return '星期一'
      case 2 :
        return '星期二'
      case 3 :
        return '星期三'
      case 4 :
        return '星期四'
      case 5 :
        return '星期五'
      case 6 :
        return '星期六'
      default:
        return ''
    }
  },
  format (date, type) {
    let dateTime = new Date(date)
    let yyyy = dateTime.getFullYear()
    let MM = this.addZero(dateTime.getMonth() + 1)
    let M = dateTime.getMonth() + 1
    let dd = this.addZero(dateTime.getDate())
    let d = dateTime.getDate()
    let hh = this.addZero(dateTime.getHours())
    let h = dateTime.getHours()
    let mm = this.addZero(dateTime.getMinutes())
    let m = dateTime.getMinutes()
    let ss = this.addZero(dateTime.getSeconds())
    let s = dateTime.getSeconds()
    return type.replace('yyyy', yyyy).replace('MM', MM).replace('M', M).replace('dd', dd).replace('d', d)
      .replace('HH', hh).replace('hh', hh).replace('mm', mm).replace('m', m).replace('ss', ss).replace('s', s)
  }
}
