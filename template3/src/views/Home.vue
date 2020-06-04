<template>
  <div id="home" v-loading="loading">
    <div class="home-aside">
      <div class="home-menu">
        <el-menu :default-active="activeRoute" router class="nav-bar">
            <template v-for="it in routes">
              <el-menu-item :index="it.url || it.name" :key="it.name" v-if="!it.outFuncs || !it.outFuncs.length">
                  <i class="icon iconfont" v-html="it.icon"></i>
                  <span slot="title">{{it.name}}</span>
              </el-menu-item>
              <el-submenu :index="it.url || it.name" :key="it.name" v-else>
                  <template slot="title">
                      <i class="icon iconfont" v-html="it.icon"></i>
                      <span>{{it.name}}</span>
                  </template>
                  <el-menu-item-group>
                      <template v-for="item in it.outFuncs">
                        <el-menu-item :index="item.url || item.name" :key="item.name" v-if="!item.outFuncs || !item.outFuncs.length">
                            <i class="icon iconfont" v-html="item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                        <el-submenu :index="item.url || item.name" :key="item.name" v-else>
                          <template slot="title">
                              <i class="icon iconfont" v-html="item.icon"></i>
                              <span>{{item.name}}</span>
                          </template>
                          <el-menu-item-group>
                                <el-menu-item :index="it_c.url || it_c.name" :key="it_c.name"  v-for="it_c in item.outFuncs">
                                    <i class="icon iconfont" v-html="it_c.icon"></i>
                                    <span slot="title">{{it_c.name}}</span>
                                </el-menu-item>
                          </el-menu-item-group>
                        </el-submenu>
                      </template>
                  </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
      </div>
    </div>
    <div class="home-main">
      <div class="home-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="pName">{{pName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="home-weather">{{baseData.time}} {{baseData.week}} {{baseData.weather}} {{baseData.temperature + '°C'}}</div> -->
      </div>
      <div class="home-contain">
        <router-view ref="rV"/>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../assets/js/menu'
export default {
  name: 'home',
  data () {
    let name = this.$route.matched[0].name
    let menu = this.$user && this.$user.role.systems[0].outFuncs
    console.log(menu)
    return {
      loading: false,
      url: {
        getWeather: '/webdc-hr/api/weather/findNowWeather'
      },
      baseData: {},
      activeRoute: this.$route.path,
      name: name,
      timer: null,
      pName: this.$route.matched[1].props.default && this.$route.matched[1].props.default.pName,
      routes: menu || Menu.menu[name].routes
    }
  },
  methods: {
    setTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let date = new Date(this.baseData.time)
        date.setSeconds(date.getSeconds() + 1)
        this.baseData.time = this.$public.format(date, 'yyyy-MM-dd HH:mm:ss')
      }, 1000)
    },
    getWeather () {
      this.$http.get(this.url.getWeather).then(
        response => {
          var res = response.body
          if (res.success) {
            this.baseData = res.data
            this.baseData.week = this.$public.getWeek(new Date().getDay())
            this.setTime()
          }
        }, response => {
          this.$message.error('请求失败')
        })
    }
  },
  watch: {
    '$route' (val) {
      this.pName = val.matched[1].props.default && val.matched[1].props.default.pName
    }
  },
  mounted () {
    // this.getWeather()
    // setInterval(this.getWeather, 3600000)
  }
}
</script>
<style lang="scss">
  #home {
    .el-menu-item {
      padding: 0;
      height: 50px;
      line-height: 50px;
    }
  }
</style>
<style lang="scss" scoped>
#home {
  height: 100%;
  box-sizing: border-box;
  padding: 25px;
  background: #0d122d;
  .home-aside {
    width: 250px;
    float: left;
    height: 100%;
    background: url(../assets/img/style/left_bg.png) no-repeat center center;
    background-size: 100% 100%;
    padding: 30px 10px 30px 0;
    box-sizing: border-box;
    .home-menu {
      height: 100%;
      overflow: auto;
      .iconfont {
        font-size: 20px;
        margin-right: 20px;
        margin-left: 10px;
      }
    }
  }
  .home-main {
    width: calc(100% - 250px);
    float: left;
    height: 100%;
    .home-breadcrumb {
      margin-left: 20px;
      width: calc(100% - 20px);
      box-sizing: border-box;
      padding: 13px 15px;
      margin-top: 15px;
      border-radius: 5px 0 0 5px;
      background: -webkit-linear-gradient(left, rgba(78, 160, 228, 0.5) 0%, rgba(78, 160, 228, 0) 25%);
      position: relative;
      .home-weather {
        position: absolute;
        right: 30px;
        top: 0;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        color: #a6c4e4;
        font-family: SFUDINENGSCHRIFT;
      }
    }
    .home-contain {
      height: calc(100% - 55px);
    }
  }
}
</style>
