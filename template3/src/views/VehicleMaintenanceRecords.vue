<template>
    <div id="VehicleMaintenanceRecords" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="线路" prop="lineId">
                <el-select v-model="form.lineId" filterable clearable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车号" prop="ownPlateNo">
                <el-select v-model="form.ownPlateNo" filterable clearable style="width: 200px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.plateNo + '(' + it.ownPlateNo + ')'" :value="it.ownPlateNo" v-for="it in vehicleOption" :key="it.ownPlateNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期选择" prop="date">
                <el-date-picker v-model="form.date" type="monthrange" align="right" value-format="yyyy-MM" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <!-- <el-button type="primary" size="mini" style="margin-top: 4px;" @click="exportExcel">导出Excel</el-button> -->
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
          <div :style="{overflow: 'auto', height: $public.tableH}">
            <el-card class="box-card" :key="it.id" v-for="it in tableData">
              <div slot="header" class="clearfix">
                <span style="margin-right: 20px;">制单时间:{{it.createTime}}</span>
                <span style="margin-right: 20px;">车牌号:{{it.plateNo}}</span>
                <span style="margin-right: 20px;">车号:{{it.ownPlateNo}}</span>
                <span style="margin-right: 20px;">最后变更时间:{{it.updateTime}}</span>
                <span style="margin-right: 20px;">最后变更人:{{it.updatePeople}}</span>
                <span style="margin-right: 20px;" v-show="it.remarks">备注:{{it.remarks}}</span>
              </div>
              <el-table :data="it.detailList" ref="table" size="small" :summary-method="getSummaries" show-summary max-height="300px">
                <el-table-column type="index" width="60" align="center"></el-table-column>
                <el-table-column prop="code" label="物品编码" align="center"></el-table-column>
                <el-table-column prop="name" label="物品名称" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="单价" align="center"></el-table-column>
                <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                <el-table-column prop="money" label="金额" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              </el-table>
            </el-card>
          </div>
          <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
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
      height: 'calc(100% - 45px)',
      url: {
        getData: '/webwms/api/vehicleMR/list',
        getLineOption: '/webwms/api/line/getLineOption',
        getVehicleOption: '/webwms/api/vehicle/getAllList'
      },
      lineOption: [],
      vehicleOption: [],
      form: {
        lineId: '',
        plateNo: '',
        ownPlateNo: '',
        date: [this.$public.format(date, 'yyyy-MM'), this.$public.format(new Date(), 'yyyy-MM')],
        startDay: '',
        limit: 20,
        page: 1,
        endDay: ''
      },
      total: 0,
      tableData: []
    }
  },
  methods: {
    getHeight () {
      if (this.$refs.form) {
        this.height = 'calc(100% - ' + (this.$refs.form.$el.offsetHeight + 10) + 'px)'
      }
    },
    getVehicleOption () {
      this.$http.post(this.url.getVehicleOption).then(
        response => {
          var res = response.body
          if (res.success) {
            this.vehicleOption = res.data
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
        })
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
    sortMethod (a, b) {
      return a.money - b.money
    },
    // 查询
    search () {
      this.loading = true
      this.form.startMonth = this.form.date[0]
      this.form.endMonth = this.form.date[1]
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data.list
            this.total = res.data.total
            console.log(this.total)
            console.log(res.data)
            setTimeout(() => {
              // this.$refs.table && this.$refs.table.doLayout()
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
        if (index > 5 && index < 8) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      return sums
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    // 改变当前页码
    handleCurrentChange (val) {
      this.form.pageNum = val
      this.search()
    },
    format (data) {
      var obj = {
        'A1': {t: 's', v: '车号'},
        'B1': {t: 's', v: '车牌号'},
        'C1': {t: 's', v: '号牌种类'},
        'D1': {t: 's', v: '线路'},
        'E1': {t: 's', v: '车辆类型'},
        'F1': {t: 's', v: '发动机号'},
        'G1': {t: 's', v: '使用年数'},
        'H1': {t: 's', v: '事故次数'},
        'I1': {t: 's', v: '检查及一保次数'},
        'J1': {t: 's', v: '维修次数'},
        'K1': {t: 's', v: '外修次数'},
        'L1': {t: 's', v: '二级保养次数'},
        'M1': {t: 's', v: '合计次数'},
        'N1': {t: 's', v: '费用金额'},
        '!cols': [
          {wpx: 60}, {wpx: 80}, {wpx: 60}, {wpx: 60}, {wpx: 100}, {wpx: 110}, {wpx: 60},
    	    {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}
        ]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].ownPlateNo || ''}
        obj['B' + count] = {t: 's', v: data[i].plateNo || ''}
        obj['C' + count] = {t: 's', v: data[i].plateType || ''}
        obj['D' + count] = {t: 's', v: data[i].lineName || ''}
        obj['E' + count] = {t: 's', v: data[i].carTypeName || ''}
        obj['F' + count] = {t: 's', v: data[i].engineNumber || ''}
        obj['G' + count] = {t: 'S', v: data[i].userYaer || '0'}
        obj['H' + count] = {t: 'S', v: data[i].accidentNum || '0'}
        obj['I' + count] = {t: 's', v: data[i].checkNum || '0'}
        obj['J' + count] = {t: 's', v: data[i].repairsNum || '0'}
        obj['K' + count] = {t: 's', v: data[i].extraRepairsNum || '0'}
        obj['L' + count] = {t: 's', v: data[i].secondGuaranteeNum || '0'}
        obj['M' + count] = {t: 'S', v: data[i].allNum || '0'}
        obj['N' + count] = {t: 'S', v: data[i].money || '0'}
        count++
      }
      obj['!ref'] = 'A1:N' + count
      return obj
    },
    exportExcel () {
      Export.downloadMater(this.format(this.tableData), '车辆保养统计')
    }
  },
  mounted () {
    this.getHeight()
    this.getLineOption()
    this.getVehicleOption()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss">
#VehicleMaintenanceRecords {
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 33.3%;
            float: left;
            margin-bottom: 5px;
        }
    }
    .el-table__footer-wrapper tbody td, body .el-table__header-wrapper tbody td {
      border-color: transparent;
    }
    .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
      background: #092743;
    }
}
</style>
<style lang="scss" scoped>
#VehicleMaintenanceRecords {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
    .box-card {
      width: calc(100% - 30px);
      margin: 0 auto 15px;
    }
}
</style>
