<!--
 * @Description: index页面
 * @Author: 连超
 * @Date: 2019-07-08 14:07:13
 * @LastEditTime: 2020-03-17 16:50:47
 * @LastEditors: lc
 -->
<template>
  <div id="index" :class="[isCollapse ? 'collapse' : '', skinVal, showIntroduction ? 'shiftLeft' : '']">
    <div id="header">
      <div id="logo" data-step="1">
        <span v-show="!isCollapse">安全服务管理</span>
        <span v-show="!isCollapse" class="version">V2.0</span>
        <i class="icon iconfont" @click="showAside">&#xe65c;</i>
      </div>
      <div class="header-dateTime">
        <div class="header-date"><i class="icon iconfont">&#xe613;</i>{{baseData.week + ' ' + baseData.date}}</div>
        <div class="header-time"><i class="icon iconfont">&#xe62e;</i>{{baseData.time + ' ' + baseData.period}}</div>
        <div class="header-weather"><i class="icon iconfont" v-html="baseData.icon || '&#xe6d7;'"></i>{{baseData.weather}}</div>
        <i :class="[rotate?  'refresh el-icon-refresh-right go' : 'refresh el-icon-refresh-right back' ]" @click="refresh"></i>
      </div>
      <div class="header-settings">
        <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar class="header-avater" size="medium" :src="circleUrl"></el-avatar>
                  雪利曼<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
          <el-dropdown-menu slot="dropdown" class="popper-setting">
            <!-- <el-dropdown-item command="message"><i class="icon iconfont">&#xe72c;</i>消息</el-dropdown-item>
            <el-dropdown-item command="help"><i class="icon iconfont">&#xe689;</i>帮助</el-dropdown-item>
            <el-dropdown-item command="changePassword"><i class="icon iconfont">&#xe628;</i>修改密码</el-dropdown-item> -->
            <el-dropdown-item command="signOut"><i class="icon iconfont">&#xe64e;</i>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover placement="bottom" width="120" trigger="click" popper-class="popper-skin" style="padding: 15px;">
          <div>
            <span class="skin-item" v-for="(s, idx) in skinList" :key="idx" :style="{background: 'url(' + s.src + ')'}" @click="changeSkin(s.className)"></span>
          </div>
          <el-button style="margin-top: -5px" type="text" slot="reference"><i class="icon iconfont">&#xe654;</i>&nbsp;&nbsp;皮肤</el-button>
        </el-popover>
        <i class="icon iconfont header-other" @click="showIntroduct">&#xe999;</i>
      </div>
    </div>
    <div id="main">
      <div id="aside" v-show="!showIntroduction">
        <div class="aside-search" v-show="!isCollapse">
          <el-input class="menu-search" v-model="searchVal" placeholder="菜单搜索">
            <i class="icon iconfont" slot="prefix" style="line-height: 32px;margin-left: 10px;">&#xe684;</i>
          </el-input>
        </div>
        <div id="nav">
          <el-menu :collapse="isCollapse" :default-active="activeRoute" @select="changeMenu" router class="nav-bar" style="background: transparent;" background-color="rgba(0, 0, 0, 0.1)" text-color="#fff" active-text-color="#fff" v-for="routes in menuList" :key="routes.name">
            <div class="nav-title" v-show="!isCollapse">
              <span class="nav-widget">{{routes.name}}</span>
            </div>
            <template v-for="it in routes.outFuncs">
              <el-menu-item :index="it.url" v-show="getShowData(it)" :key="it.name" v-if="!it.outFuncs || !it.outFuncs.length">
                <i class="icon iconfont" v-html="it.icon"></i>
                <span slot="title">{{it.name}}</span>
                <span class="route-badge" v-show="it.badge">{{it.badge}}</span>
              </el-menu-item>
              <el-submenu :index="it.url || it.name" v-show="getShowData(it)" :key="it.name" v-else>
                <template slot="title">
                  <i class="icon iconfont" v-html="it.icon"></i>
                  <span>{{it.name}}</span>
                  <span class="route-badge" v-show="it.badge">{{it.badge}}</span>
                </template>
                <el-menu-item-group>
                  <template v-for="item in it.outFuncs">
                    <el-menu-item :index="item.url" :key="item.name" v-show="getShowData(item)" v-if="!item.outFuncs || !item.outFuncs.length">
                      <i class="icon iconfont" v-html="item.icon"></i>
                      <span slot="title">{{item.name}}</span>
                      <span class="route-badge" v-show="item.badge">{{item.badge}}</span>
                    </el-menu-item>
                    <el-submenu :index="item.url" :key="item.name" v-show="getShowData(item)" v-else>
                      <template slot="title">
                        <i class="icon iconfont" v-html="item.icon"></i>
                        <span>{{item.name}}</span>
                        <span class="route-badge" v-show="item.badge">{{item.badge}}</span>
                      </template>
                      <el-menu-item-group>
                        <el-menu-item :index="it_c.url" :key="it_c.name"  v-for="it_c in item.outFuncs">
                          <i class="icon iconfont" v-html="it_c.icon"></i>
                          <span slot="title">{{it_c.name}}</span>
                          <span class="route-badge" v-show="it_c.badge">{{it_c.badge}}</span>
                        </el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                  </template>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </div>
        <div class="aside-copy" v-show="!isCollapse">
          <p>版权所有：雪利曼电子仪表有限公司</p>
          <p>Copyright(c)   2019-  www.xueliman.com</p>
        </div>
      </div>
      <div id="contain">
        <div class="contain_top">
          <el-tabs v-model="editableTabsValue"
                   type="card"
                   :closable="visitedTags.length > 1"
                   @tab-click="handleTabClick"
                   @tab-remove="handleTabRemove">
            <el-tab-pane
              :key="item.fullPath"
              v-for="item in visitedTags"
              :label="item.name"
              :name="item.fullPath"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="contain_main">
          <keep-alive :include="cachedViews">
            <router-view ref="main" :key="$route.path" v-if="isRouterAlive"/>
          </keep-alive>
        </div>
      </div>
      <div id="introduction" v-show="showIntroduction">
        <div style="width: 230px;margin: 10px auto; height: calc(50% - 15px);background: rgba(0,0,0,0.3);"></div>
        <div style="width: 230px;margin: 0 auto 10px; height: calc(50% - 15px);background: rgba(0,0,0,0.3);"></div>
      </div>
    </div>
    <div id="mask" v-show="!isOnline">
      <div class="mask_text">网络出现波动，请勿操作，等待网络恢复正常！</div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialog.changePassword" width="400px" :append-to-body="false">
      <el-form label-width="80px" :model="changePasswordForm" :rules="psdRules" ref="changePasswordForm">
        <el-form-item label="旧密码" prop="oldPsd">
          <el-input type="password" v-model="changePasswordForm.oldPsd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="psd">
          <el-input type="password" v-model="changePasswordForm.psd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="psd2">
          <el-input type="password" v-model="changePasswordForm.psd2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.changePassword = false">取 消</el-button>
        <el-button type="primary" @click="setNewPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    let validateOldpass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('新密码长度必须是6~20位'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.psd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialog: {
        changePassword: false
      },
      url: {
        getWeather: '/webstl/api/weather/findNowWeather'
      },
      rotate: false,
      editableTabsValue: '',
      isRouterAlive: true,
      visitedTags: [],
      cachedViews: [],
      category: {
        'e60d': ['晴', '少云', '热'], // 晴
        'e60a': ['晴间多云', '多云'], // 多云
        'e615': ['阴', '冷', '未知'], // 阴
        'e60f': ['有风', '平静', '微风', '和风', '清风'], // 风
        'e614': ['强风/劲风', '疾风', '大风', '烈风', '风暴', '狂爆风', '飓风', '热带风暴', '浮尘', '扬沙', '沙尘暴', '强沙尘暴', '龙卷风'], // 强风, 沙尘暴
        'e611': ['雷阵雨', '雷阵雨并伴有冰雹', '阵雨', '强阵雨', '强雷阵雨'], // 雷阵雨
        'e618': ['小雨', '小雨-中雨', '毛毛雨/细雨', '雨'], // 小雨
        'e617': ['中雨', '中雨-大雨'], // 中雨
        'e60e': ['大雨', '暴雨', '大暴雨', '特大暴雨', '强阵雨', '强雷阵雨', '极端降雨', '暴雨-大暴雨', '大暴雨-特大暴雨'], // 大雨
        'e612': ['雨雪天气', '雨夹雪', '阵雨夹雪', '冻雨'], // 雨加雪
        'e610': ['雪', '阵雪', '小雪', '小雪-中雪'], // 小雪
        'e61a': ['中雪', '中雪-大雪'], // 中雪
        'e61b': ['大雪', '大雪-暴雪'], // 大雪
        'e616': ['雾', '浓雾', '强浓雾', '轻雾', '大雾', '特强浓雾'], // 雾
        'e619': ['霾', '中度霾', '重度霾', '严重霾'] // 霾
      },
      changePasswordForm: {
        oldPsd: '',
        psd: '',
        psd2: ''
      },
      psdRules: {
        oldPsd: [
          { validator: validateOldpass, trigger: 'blur' }
        ],
        psd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        psd2: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      baseData: {
        date: '2020-01-01',
        weather: '萧山区 晴',
        time: '08:00:00',
        period: 'am',
        week: '星期三',
        icon: ''
      },
      tip: '',
      circleUrl: require('../assets/img/avater.png'),
      activeRoute: this.$route.path, // 当前地址
      isCollapse: false, // 是否收缩
      showIntroduction: false, // 是否显示简介
      searchVal: '', // 菜单查询值
      skinVal: window.localStorage.skinVal || '', // 当前皮肤值
      skinList: [ // 皮肤列表
        {
          src: require('../assets/img/skin/bg3.png'),
          className: 'bg-style1'
        }, {
          src: require('../assets/img/skin/giftly.png'),
          className: 'bg-style2'
        }, {
          src: require('../assets/img/skin/small-bg.jpg'),
          className: 'bg-style3'
        }, {
          src: require('../assets/img/skin/small-bg2.jpg'),
          className: 'bg-style4'
        }, {
          src: require('../assets/img/skin/small-bg5.jpg'),
          className: 'bg-style5'
        }, {
          src: require('../assets/img/skin/small-bg8.jpg'),
          className: 'bg-style6'
        }, {
          src: require('../assets/img/skin/small-bg9.jpg'),
          className: 'bg-style7'
        }, {
          src: require('../assets/img/skin/small-bg10.jpg'),
          className: 'bg-style8'
        }, {
          src: require('../assets/img/skin/small-bg11.jpg'),
          className: 'bg-style9'
        }, {
          src: require('../assets/img/skin/small-bg12.jpg'),
          className: 'bg-style10'
        }, {
          src: require('../assets/img/skin/small-bg13.jpg'),
          className: 'bg-style11'
        }
      ],
      menuList: this.$route.query.menu ? this.$route.query.menu.outFuncs : [],
      isOnline: true // 是否在线
    }
  },
  watch: {
    $route () {
      this.addTags()
      this.moveToCurrentTag()
    }
  },
  methods: {
    // 新增标签
    addTags () {
      let isPresence = false
      for (let i = 0; i < this.visitedTags.length; i++) {
        if (this.visitedTags[i].fullPath === this.$route.fullPath) {
          isPresence = true
          break
        }
      }
      if (!isPresence) {
        this.visitedTags.push(this.$route)
        this.cachedViews.push(this.$route.meta.componentName)
      }
    },
    // 跳转到路由对应的标签
    moveToCurrentTag () {
      this.$nextTick(() => {
        this.editableTabsValue = this.$route.fullPath
      })
    },
    // 标签点击
    handleTabClick (e) {
      e.name !== this.$route.fullPath && this.$router.push(e.name)
    },
    handleTabRemove (path) {
      for (let i = 0; i < this.visitedTags.length; i++) {
        if (this.visitedTags[i].fullPath === path) {
          let data = this.visitedTags[i]
          this.visitedTags.splice(i, 1) // 清除标签页
          let path = this.visitedTags[i === 0 ? i : i - 1].fullPath
          this.$route.fullPath !== path && this.$router.push(path) // 跳转路由
          this.removeCache(data.meta.componentName) // 清除缓存
          break
        }
      }
    },
    // 清除缓存
    removeCache (name) {
      for (let i = 0; i < this.cachedViews.length; i++) {
        if (this.cachedViews[i] === name) {
          this.cachedViews.splice(i, 1)
          break
        }
      }
    },
    // 刷新页面
    refresh () {
      this.rotate = !this.rotate
      const { meta: { componentName } } = this.$route
      this.isRouterAlive = false
      this.removeCache(componentName)
      this.$nextTick(() => {
        this.cachedViews.push(componentName)
        this.isRouterAlive = true
      })
    },
    getShowData (data) {
      if (!this.searchVal || data.name.indexOf(this.searchVal) !== -1) {
        return true
      } else if (data.outFuncs && data.outFuncs.length) {
        for (let i = 0; i < data.outFuncs.length; i++) {
          if (this.getShowData(data.outFuncs[i])) {
            return true
          }
        }
      }
      console.log(data)
      return false
    },
    // 改变皮肤
    changeSkin (val) {
      this.skinVal = val
      window.localStorage.skinVal = val
    },
    // 获取当前页面对应icon
    getIcon (name) {
      for (let k in this.menuList) {
        let routes = this.menuList[k]
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].name === name) {
            return routes[i].icon
          }
          if (routes[i].children && routes[i].children.length) {
            for (let j = 0; j < routes[i].children.length; j++) {
              if (routes[i].children[j].name === name) {
                return routes[i].children[j].icon
              }
            }
          }
        }
      }
      return ''
    },
    // 获取路径
    getRouteList (name) {
      let list = []
      for (let k in this.menuList) {
        let routes = this.menuList[k]
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].name === name) {
            return [k, routes[i].name]
          }
          if (routes[i].children && routes[i].children.length) {
            for (let j = 0; j < routes[i].children.length; j++) {
              if (routes[i].children[j].name === name) {
                return [k, routes[i].name, routes[i].children[j].name]
              }
            }
          }
        }
      }
      return list
    },
    // 是否显示左侧菜单栏
    showAside () {
      this.showIntroduction = false
      this.isCollapse = !this.isCollapse
    },
    // 是否显示右侧简介
    showIntroduct () {
      this.isCollapse = false
      this.showIntroduction = !this.showIntroduction
    },
    changePassword () {

    },
    // 下拉菜单对应事件
    handleCommand (command) {
      switch (command) {
        case 'message':// 消息
          break
        case 'help':// 帮助
          this.guide()
          break
        case 'changePassword':// 修改密码
          this.dialog.changePassword = true
          break
        case 'signOut':// 登出
          window.location.href = 'http://' + window.location.host + '/webstl'
          break
        default:
      }
    },
    setNewPassword () {
      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          console.log(valid)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 引导
    guide () {
      this.$IntroJs().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        skipLabel: '跳过',
        doneLabel: '结束'
      }).oncomplete(function () {
        // 点击跳过按钮后执行的事件
      }).onexit(function () {
        // 点击结束按钮后， 执行的事件
      }).start()
    },
    changeMenu (index, indexPath) {
      setTimeout(() => {
        this.activeRoute = this.$route.path
      }, 50)
      console.log(this.activeRoute)
    },
    updateBadge () {
      let url = '/webssms/api/securityMonthInfo/getInfoExceedingStandard'
      let form = {
        month: this.$public.format(new Date(), 'yyyy-MM'),
        pageNum: 1,
        pageSize: 99999
      }
      this.$axios.get(url, { params: form })
        .then((res) => {
          let result = res.data
          if (result.success) { // 成功
            let length = result.data.list.length || 0
            for (let i = 0; i < this.menuList[1]['outFuncs'].length; i++) {
              if (this.menuList[1]['outFuncs'][i].name === '满记分队员处理') {
                this.menuList[1]['outFuncs'][i].badge = length
                break
              }
            }
          }
        })
        .catch(() => {})
      console.log(this.menuList[1])
    },
    // 获取天气
    getWeather () {
      this.$axios.post(this.url.getWeather)
        .then((res) => {
          let result = res.data
          if (result.success) { // 成功
            this.baseData.weather = result.data.weather + ' ' + result.data.city
            let date = new Date(result.data.time)
            this.baseData.date = this.$public.format(date, 'yyyy-MM-dd')
            this.baseData.time = this.$public.format(date, 'hh:mm:ss')
            this.baseData.period = date.getHours < 12 ? 'am' : 'pm'
            this.baseData.icon = ''
            for (let i in this.category) {
              if (this.category[i].indexOf(result.data.weather) !== -1) {
                this.baseData.icon = '&#x' + i + ';'
              }
            }
            this.baseData.week = this.$public.getWeek(date.getDay())
          }
        })
        .catch(() => {})
    },
    getDate () {
      let date = new Date(this.baseData.date + ' ' + this.baseData.time)
      date.setSeconds(date.getSeconds() + 1)
      this.baseData.date = this.$public.format(date, 'yyyy-MM-dd')
      this.baseData.time = this.$public.format(date, 'hh:mm:ss')
      this.baseData.period = date.getHours() < 12 ? 'am' : 'pm'
      this.baseData.week = this.$public.getWeek(date.getDay())
    }
  },
  mounted () {
    this.getWeather()
    this.addTags()
    this.moveToCurrentTag()
    setInterval(this.getWeather, 1800000)
    setInterval(this.getDate, 1000)
    this.updateBadge()
    // this.guide()
  }
}
</script>
<style lang="scss">
  body {
    .el-popper.popper-skin {
      margin-top: 17px;
    }
    .el-popper.popper-setting .popper__arrow {
      left: 78px!important;
    }
    #aside .menu-search input {
      background: transparent;
      padding-left: 50px;
      color: #fff;
    }
    .el-breadcrumb__inner {
      color: #9ea7b3;
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
      color: #9ea7b3;
    }
  }
</style>
<style lang="scss" scoped>
  #index {
    height: 100%;
    background: url(../assets/img/skin/bg.jpg) no-repeat top center;
    background-size: cover;
    opacity: 0.91;
    &.bg-style1 {
      background: url(../assets/img/skin/bg3.png) repeat;
    }
    &.bg-style2 {
      background: url(../assets/img/skin/giftly.png) repeat;
    }
    &.bg-style4 {
      background: url(../assets/img/skin/bg2.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style5 {
      background: url(../assets/img/skin/bg5.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style6 {
      background: url(../assets/img/skin/bg8.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style7 {
      background: url(../assets/img/skin/bg9.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style8 {
      background: url(../assets/img/skin/bg10.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style9 {
      background: url(../assets/img/skin/bg11.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style10 {
      background: url(../assets/img/skin/bg12.jpg) center center no-repeat;
      background-size: cover;
    }
    &.bg-style11 {
      background: url(../assets/img/skin/bg13.jpg) center center no-repeat;
      background-size: cover;
    }
  }
  .skin-item {
    float: left;
    height: 17px;
    width: 17px;
    cursor: pointer;
    border: 4px solid #fff;
    border-radius: 50%;
  }
  #mask {
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    .mask_text {
      position: absolute;
      height:40px;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      line-height: 40px;
      font-size: 32px;
      color: #fff;
      text-align: center;
    }
    .emergency_export {
      position: absolute;
      height: 40px;
      top: 120px;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      color: #fff;
      text-align: center;
    }
  }
  #header {
    width: 100%;
    height: 75px;
    .header-dateTime {
      background: rgba(0,0,0,.2);
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 30px;
      box-shadow: 0 1px 0 rgba(255,255,255,.1);
      color: #fff;
      margin: 15px;
      padding: 15px 45px 15px 20px;
      font-size: 13px;
      line-height: 13px;
      height: 13px;
      width: 40%;
      float: left;
      margin-left: 30px;
      .header-date {
        float: left;
        padding: 0 15px;
        border-right: 1px solid rgba(0,0,0,.4);
        box-shadow: 1px 0 0 rgba(255,255,255,.1);
      }
      .header-time {
        float: left;
        padding: 0 15px;
        border-right: 1px solid rgba(0,0,0,.4);
        box-shadow: 1px 0 0 rgba(255,255,255,.1);
      }
      .header-weather {
        float: left;
        padding: 0 15px;
      }
      .iconfont {
        margin-right: 5px;
        vertical-align: top;
      }
      .refresh {
        margin-top: -1px;
        font-size: 20px;
        cursor: pointer;
        float: right;
      }
      .back {
        transform: rotate(0deg);
        transition: all .8s;
      }

      .go {
        transform: rotate(360deg);
        transition: all .8s;
      }
    }
    .header-settings {
      float: right;
      line-height: 75px;
      font-size: 13px;
      .header-avater {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #f5f5f5;
        vertical-align: middle;
        margin-right: 15px;
        background: #fff;
      }
      .el-dropdown {
        color: #f5f5f5;
        cursor: pointer;
      }
      .el-button--text {
        color: #f5f5f5;
      }
      .header-other {
        padding: 15px;
        cursor: pointer;
        color: #f5f5f5;
      }
    }
  }
  #logo {
    font-size: 26px;
    font-weight: 200;
    color: #fff;
    height: 100%;
    line-height: 75px;
    margin-left: 15px;
    width: 235px;
    float: left;
    span {
      margin-right: 5px;
    }
    .version {
      font-size: 10px;
      background: rgba(0, 0, 0, 0.4);
      padding: 2px 4px;
      border-radius: 2px;
    }
    .iconfont {
      font-size: 18px;
      padding: 6px;
      cursor: pointer;
      border-radius: 3px;
      vertical-align: top;
      &:hover {
        background: rgba(0, 0, 0, 0.4);
      }
    }
  }
  #main {
    width: 100%;
    height: calc(100% - 75px);
  }
  #aside {
    width: 250px;
    height: 100%;
    float: left;
    transition: all 0.3s;
    .aside-search {
      width: 210px;
      margin: 10px auto 0px;
      line-height: 1.5em;
      font-size: 12px;
      height: 42px;
      text-align: right;
      color: #ccc;
    }
    .aside-copy {
      margin: 10px 0;
      color: #fff;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
    }
  }
  #nav {
    height: calc(100% - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    .iconfont {
      margin-right: 20px;
      transition: all 0.3s;
    }
    .route-badge {
      position:absolute;
      right: 20px;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      background: #e4b62e;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
    }
    .nav-title {
      height: 22px;
      padding: 10px 10px 3px 0;
      background: rgba(0, 0, 0, 0.1);
      .nav-widget {
        display: inline-block;
        background:rgba(0,0,0,.2);
        border-radius: 20px;
        height: 22px;
        line-height: 22px;
        padding: 0 11px;
        margin-left: 10px;
        font-size: 12px;
        color: #fff;
      }
    }
    .nav-bar {
      width: 230px;
      margin: 10px auto;
      background: transparent;
      border-radius: 3px;
      transition: all 0.3s;
    }
  }
  #contain {
    width: calc(100% - 250px);
    height: 100%;
    float: left;
    transition: all 0.3s;
    background: #f5f5f5;
    background: linear-gradient(45deg, #f5f5f5 30px, #f5f5f500 30px), -webkit-linear-gradient(135deg, transparent 30px, #f5f5f500 30px), -webkit-linear-gradient(225deg, #f5f5f500 30px, #f5f5f500 30px), -webkit-linear-gradient(315deg, transparent 25px, #f5f5f5 25px);
    position: relative;
    .contain_top {
      height: 41px;
      /*border-bottom: 1px solid #ddd;*/
      overflow: hidden;
      padding-left: 50px;
      font-size: 14px;
      .contain_title {
        float:left;
        width: 234px;
        border-right: 1px dashed #ccc;
        line-height: 41px;
        text-indent: 48px;
        color: #9ea7b3;
      }
      .contain_tip {
        float:left;
        width: calc(100% - 244px);
        text-align: right;
        color: #5d5d5f;
        line-height: 41px;
      }
    }
    .contain_breadcrumb {
      line-height: 34px;
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
    }
    .contain_main {
      height: calc(100% - 41px);
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border-width:  35px 35px 0 0;
      border-style: solid;
      border-color: rgba(0,0,0,.1) #fff;
      box-shadow: 0 0 0 rgba(0,0,0,.4), 0 0 10px rgba(0,0,0,.3);
    }
  }
  #introduction {
    // background: rgba(0, 0, 0, 0.4);
    width: 250px;
    float: left;
    height: 100%;
  }
  #index.collapse {
    #logo {
      width: 49px;
      .iconfont {
        background: rgba(0, 0, 0, 0.2);
        &:hover {
          background: rgba(0, 0, 0, 0.4);
        }
      }
    }
    #nav {
      .nav-bar {
        width: 64px;
      }
      .iconfont {
        margin-right: 0;
      }
    }
    #aside {
      width: 64px;
    }
    #contain {
      width: calc(100% - 64px);
    }
  }
  @media screen and (max-width: 1180px) {
    .header-dateTime {
      display: none;
    }
  }
</style>
