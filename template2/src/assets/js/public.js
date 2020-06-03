/*
 * @Description: 公共方法
 * @Author: 连超
 * @Date: 2019-08-12 14:13:14
 * @LastEditTime: 2019-08-13 14:56:45
 * @LastEditors: 方俊杰
 */
export default {
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
      .replace('hh', hh).replace('h', h).replace('mm', mm).replace('m', m).replace('ss', ss).replace('s', s)
  },
  notNull (content) {
    if (content != null && content !== '' && content !== undefined) {
      return content
    } else {
      return ''
    }
  }
}
