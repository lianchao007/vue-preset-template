<template>
    <div id="vehicleRepairStatistics" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="线路" prop="lineId">
                <el-select v-model="form.lineId" filterable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期选择" prop="date">
                <el-date-picker v-model="form.date" type="daterange" align="right" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="exportExcel">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" ref="table" stripe size="small" :summary-method="getSummaries" show-summary height="100%">
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="ownPlateNo" label="车号" width="80" align="center"></el-table-column>
                <el-table-column prop="plateNo" label="车牌号" width="90" align="center"></el-table-column>
                <el-table-column prop="type1" label="油料(元)" align="center"></el-table-column>
                <el-table-column prop="type2" label="配件(元)" align="center"></el-table-column>
                <el-table-column prop="type3" label="辅助(元)" align="center"></el-table-column>
                <el-table-column prop="type4" label="轮胎(元)" align="center"></el-table-column>
                <el-table-column prop="type5" label="工具(元)" align="center"></el-table-column>
                <el-table-column prop="totalMoney" label="合计(元)" sortable :sort-method="sortMethod" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="detail(scope.row)" size="mini">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="800px">
            <el-table :data="editTable" ref="table" stripe size="mini" height="400">
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="createTime" label="日期" width="90" align="center"></el-table-column>
                <el-table-column prop="name" label="配件名称" width="90" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格型号" width="80" align="center"></el-table-column>
                <el-table-column prop="partCategoryName" label="类别" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="单价(元)" align="center"></el-table-column>
                <el-table-column prop="money" label="金额(元)" align="center"></el-table-column>
            </el-table>
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
        getData: '/webwms/api/vehcileMS/getAll',
        getLineOption: '/webwms/api/line/getLineOption',
        getOneData: '/webwms/api/vehcileMS/getData'
      },
      lineOption: [],
      form: {
        lineId: '',
        date: [this.$public.format(date, 'yyyy-MM') + '-26', this.$public.format(new Date(), 'yyyy-MM') + '-25'],
        startDay: '',
        endDay: ''
      },
      startDay: '',
      endDay: '',
      editForm: {},
      editTable: [],
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
      },
      tableData: []
    }
  },
  methods: {
    getHeight () {
      if (this.$refs.form) {
        this.height = 'calc(100% - ' + (this.$refs.form.$el.offsetHeight + 10) + 'px)'
      }
    },
    sortMethod (a, b) {
      return a.totalMoney - b.totalMoney
    },
    getLineOption () {
      this.$http.post(this.url.getLineOption).then(
        response => {
          var res = response.body
          if (res.success) {
            this.lineOption = res.data
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
        })
    },
    // 查询
    search () {
      this.loading = true
      this.form.startDay = this.form.date[0]
      this.form.endDay = this.form.date[1]
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data
            this.startDay = this.form.date[0]
            this.endDay = this.form.date[1]
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index > 2 && index < 9) {
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
    detail (row) {
      this.dialogVisible = true
      this.loading2 = true
      this.$http.post(this.url.getOneData, {vehicleId: row.vehicleId, startDay: this.startDay, endDay: this.endDay}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading2 = false
          if (res.success) {
            this.editTable = res.data
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading2 = false
        })
    },
    format (data) {
      var obj = {
        'A1': {t: 's', v: '车号'},
        'B1': {t: 's', v: '车牌号'},
        'C1': {t: 's', v: '油料(元)'},
        'D1': {t: 's', v: '配件(元)'},
        'E1': {t: 's', v: '辅助(元)'},
        'F1': {t: 's', v: '轮胎(元)'},
        'G1': {t: 's', v: '工具(元)'},
        'H1': {t: 's', v: '合计(元)'},
        '!cols': [{wpx: 60}, {wpx: 80}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].ownPlateNo || ''}
        obj['B' + count] = {t: 's', v: data[i].plateNo || ''}
        obj['C' + count] = {t: 's', v: data[i].type1 || '0'}
        obj['D' + count] = {t: 's', v: data[i].type2 || '0'}
        obj['E' + count] = {t: 's', v: data[i].type3 || '0'}
        obj['F' + count] = {t: 's', v: data[i].type4 || '0'}
        obj['G' + count] = {t: 'S', v: data[i].type5 || '0'}
        obj['H' + count] = {t: 'S', v: data[i].totalMoney || '0'}
        count++
      }
      obj['!ref'] = 'A1:H' + count
      return obj
    },
    exportExcel () {
      Export.downloadMater(this.format(this.tableData), '车辆维修统计')
    }
  },
  mounted () {
    this.getHeight()
    this.getLineOption()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss">
#vehicleRepairStatistics {
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
#vehicleRepairStatistics {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
