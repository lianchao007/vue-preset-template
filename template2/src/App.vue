<!--
 * @Description:
 * @Author: lc
 * @Date: 2019-12-24 16:02:18
 * @LastEditTime: 2020-06-03 15:46:06
 * @LastEditors: lc
 -->
<template>
  <div id="app" :class="{app_bg: showbg}">
    <router-view></router-view>
  </div>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      showbg: false
    }
  },
  mounted () {
    if (parent === window) {
      setTimeout(() => {
        this.showbg = true
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
#app {
  color: #9ea7b3;
  font-family: "open sans",Arial,sans-serif;
  font-size: 13px;
  height: 100%;
  margin: 0;
}
#app.app_bg {
  background: url(assets/img/bg2.jpeg) no-repeat top center fixed;
  background-size: cover;
}
</style>
