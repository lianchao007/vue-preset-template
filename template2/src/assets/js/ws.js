let Ws = (function () {
  function Ws (opt, analysis, startSend) {
    this.option = Object.assign({
      url: 'ws://192.168.1.72:8080/webssms/CompensateWebSocket', // 地址
      timeout: 5000, // 60秒
      reconnect: true // 是否断线重连
    }, opt)
    this.startSend = startSend || 'HeartBeat'
    this.lockReconnect = false
    this.analysis = analysis
    this.timeoutObj = null
    this.serverTimeoutObj = null
    this.createWebSocket()
  }

  Ws.prototype.constructor = Ws
  // 创建
  Ws.prototype.createWebSocket = function () {
    let that = this
    try {
      this.websocket = new WebSocket(this.option.url)
      this.websocket.onopen = function () {
        that.start()
      }
      this.websocket.onmessage = function (event) {
        that.analysis(event)
      }
      this.websocket.onclose = function () {
        if (that.option.reconnect) {
          console.log(0)
          that.reconnect()
        }
      }
    } catch (e) {
      that.reconnect()
    }
  }
  // 发送websocket
  Ws.prototype.send = function (val) {
    this.websocket.send(val)
  }
  // 关闭websocket
  Ws.prototype.close = function (val) {
    this.websocket.close()
  }
  // 启动websocket
  Ws.prototype.start = function () {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      this.websocket.send(this.startSend)
      this.serverTimeoutObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
        console.log(this.option.timeout)
        this.websocket.close()// 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect
        // 会触发onclose导致重连两次
      }, this.option.timeout)
    }, this.option.timeout)
  }
  // 重连
  Ws.prototype.reconnect = function () {
    if (this.lockReconnect) {
      return
    }
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket()
      this.lockReconnect = false
    }, 2000)
  }

  return Ws
}())

export default Ws
