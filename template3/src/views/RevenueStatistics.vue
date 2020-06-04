<template>
    <div id="vehicleMaintenanceStatistics" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="日期选择" prop="date">
                <el-date-picker v-model="form.date" type="daterange" align="right" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="showDetail">查看并导出每日详细数据</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <div class="table-left">
                <el-table :data="lineData" ref="table" stripe size="mini" height="100%" @row-click="getVehicleList" :summary-method="getSummaries2" show-summary @current-change="handleCurrent" highlight-current-row>
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column prop="lineName" label="线路" width="80" align="center"></el-table-column>
                    <el-table-column prop="lineCash" label="现金(元)" align="center"></el-table-column>
                    <el-table-column prop="lineIcIncome" label="刷卡(元)" align="center"></el-table-column>
                    <el-table-column prop="lineSum" label="合计(元)" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="table-center">
                <el-table :data="vehicleData" ref="vehicleTable" stripe size="mini" :summary-method="getSummaries" highlight-current-row show-summary height="100%" @row-click="getDayData">
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column prop="dayNum" label="天数" align="center"></el-table-column>
                    <el-table-column prop="ownPlateNo" label="车号" width="80" align="center"></el-table-column>
                    <el-table-column prop="vehicleCash" label="现金收入" align="center"></el-table-column>
                    <el-table-column prop="vehicleICIncome" label="IC卡收入" align="center"></el-table-column>
                    <el-table-column prop="otherIncome" label="其他收入" align="center"></el-table-column>
                    <el-table-column prop="vehicleSum" label="营收合计" align="center"></el-table-column>
                </el-table>

            </div>
            <div class="table-right">
                <el-table :data="dayData" ref="dayTable" stripe size="mini" height="100%" :summary-method="getSummaries" show-summary>
                    <el-table-column type="index" width="40" align="center"></el-table-column>
                    <el-table-column prop="day" label="日期" width="90" align="center"></el-table-column>
                    <el-table-column prop="lineName" label="线路" align="center"></el-table-column>
                    <el-table-column prop="cash" label="现金收入" width="90" align="center"></el-table-column>
                    <el-table-column prop="icIncome" label="IC卡收入" width="80" align="center"></el-table-column>
                    <el-table-column prop="total" label="营收合计" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="1000px">
            <el-table :data="detailData" ref="dayTable" stripe size="mini" height="400px">
                <el-table-column prop="date" label="日期" min-width="90" align="center"></el-table-column>
                <el-table-column :prop="vehicle" :label="vehicle" v-for="vehicle in vehicles" :key="vehicle" width="60" align="center"></el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 10px;">
                <el-button type="primary" size="mini" @click="exportExcel">导出</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Export from '../assets/js/export.js'
export default {
  data () {
    let date = new Date()
    date.setMonth(date.getMonth() - 1)
    return {
      loading: false,
      loading2: false,
      dialogVisible: false,
      height: 'calc(100% - 45px)',
      url: {
        getLineData: '/webwms/api/revenueStatistics/listLineDate',
        getVehicleList: '/webwms/api/revenueStatistics/listVehicleData',
        getDayData: '/webwms/api/revenueStatistics/listDayData',
        exportData: '/webwms/api/revenueStatistics/listDateTableTwo'
      },
      vehicles: [],
      lineData: [],
      vehicleData: [],
      dayData: [],
      detailData: [],
      form: {
        lineId: '',
        date: [this.$public.format(date, 'yyyy-MM') + '-26', this.$public.format(new Date(), 'yyyy-MM') + '-25'],
        startDay: '',
        endDay: ''
      },
      startDay: '',
      endDay: '',
      currentRow: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    getHeight () {
      if (this.$refs.form) {
        this.height = 'calc(100% - ' + (this.$refs.form.$el.offsetHeight + 10) + 'px)'
      }
    },
    // 查询
    search () {
      this.loading = true
      this.form.startDay = this.form.date[0]
      this.form.endDay = this.form.date[1]
      this.$http.post(this.url.getLineData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.lineData = res.data
            setTimeout(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
    },
    getVehicleList (row, column, event) {
      this.loading = true
      this.$http.post(this.url.getVehicleList, {lineId: row.lineId, startDay: this.form.startDay, endDay: this.form.endDay}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.vehicleData = res.data
            this.dayData = []
            setTimeout(() => {
              this.$refs.vehicleTable.doLayout()
            })
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
    },
    getDayData (row, column, event) {
      this.loading = true
      this.$http.post(this.url.getDayData, {vehicleId: row.vehicleId, startDay: this.form.startDay, endDay: this.form.endDay}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.dayData = res.data
            setTimeout(() => {
              this.$refs.dayTable.doLayout()
            })
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index > 2) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        }
      })
      return sums
    },
    getSummaries2 (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index > 1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        }
      })
      return sums
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.form.limit = val
      this.handleCurrentChange(1)
    },
    // 改变当前页码
    handleCurrentChange (val) {
      this.form.page = val
      this.search()
    },
    handleCurrent (val) {
      this.currentRow = val
    },
    detail (row) {
      this.dialogVisible = true
      this.loading2 = true
      this.$http.post(this.url.getOneData, {vehicleId: row.id, startDay: this.startDay, endDay: this.endDay}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading2 = false
          if (res.success) {
            this.editForm = res.data.vehicleInfo
            this.editTable = res.data.outboundDetails
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading2 = false
        })
    },
    showDetail () {
      this.loading = true
      this.$http.post(this.url.exportData, {lineId: this.currentRow ? this.currentRow.lineId : '', startDay: this.form.startDay, endDay: this.form.endDay}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            if (res.data.length) {
              this.dialogVisible = true
              let data = res.data
              let vehicles = []
              let detailData = []
              for (let i = 0; i < data.length; i++) {
                vehicles.push(data[i].ownPlateNo)
              }
              for (let i = 0; i < data[0].data.length; i++) {
                let obj = {}
                obj.date = data[0].data[i].day
                for (let j = 0; j < data.length; j++) {
                  obj[data[j].ownPlateNo] = data[j].data[i].sum
                }
                detailData.push(obj)
              }
              this.vehicles = vehicles
              this.detailData = detailData
            } else {
              this.$message('暂无数据')
            }
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
    },
    exportExcel () {
      Export.downloadMater(this.format(this.detailData), '营收统计')
    },
    format (data) {
      if (data.length) {
        var obj = {
          'A1': {t: 's', v: '日期'},
          '!cols': [{wpx: 80}]
        }
        let vehicles = this.vehicles
        for (let i = 0; i < vehicles.length; i++) {
          obj[Export.getCharCol(i + 1) + '1'] = {t: 's', v: vehicles[i]}
          obj['!cols'].push({wpx: 40})
        }
        var count = 2
        for (var i = 0; i < data.length; i++) {
          obj['A' + count] = {t: 's', v: data[i].date || ''}
          for (let j = 0; j < vehicles.length; j++) {
            obj[Export.getCharCol(j + 1) + count] = {t: 's', v: data[i][vehicles[j]] || '0'}
          }
          count++
        }
        obj['!ref'] = 'A1:' + Export.getCharCol(vehicles.length) + count
        return obj
      }
    }
  },
  mounted () {
    this.getHeight()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
    let self = this
    this.$nextTick(() => {
      this.$refs.table.$children[7].$el.onclick = function () {
        self.currentRow = ''
        self.$refs.table.setCurrentRow('')
        self.getVehicleList({lineId: ''})
      }
    })
  }
}
</script>
<style lang="scss">
#vehicleMaintenanceStatistics {
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 33.3%;
            float: left;
            margin-bottom: 5px;
        }
    }
}
</style>
<style lang="scss" scoped>
#vehicleMaintenanceStatistics {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
    .table-left {
        float: left;
        width: 380px;
        height: 100%;
        margin-right: 10px;
    }
    .table-center {
        float: left;
        width: calc(50% - 200px);
        height: 100%;
        margin-right: 10px;
    }
    .table-right {
        float: left;
        width: calc(50% - 200px);
        height: 100%;
    }
}
</style>
