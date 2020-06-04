<template>
    <div id="inventoryStatistics" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="配件名称" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入配件名称"></el-input>
            </el-form-item>
            <el-form-item label="配件规格" prop="specificationType">
                <el-input v-model="form.specificationType" style="width: 160px;" placeholder="输入配件规格"></el-input>
            </el-form-item>
            <el-form-item label="配件类别" prop="partCategoryId">
                <el-select v-model="form.partCategoryId" clearable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="机油" value="1"></el-option>
                    <el-option label="配件" value="2"></el-option>
                    <el-option label="辅助" value="3"></el-option>
                    <el-option label="轮胎" value="4"></el-option>
                    <el-option label="工具" value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="月份" prop="month">
              <el-date-picker v-model="form.month" value-format="yyyy-MM" type="month" placeholder="选择月" style="width: 160px;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="showList('inbound')">入库清单</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="showList('outbound')">出库清单</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="exportExcel">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="code" label="配件编码" align="center"></el-table-column>
                <el-table-column prop="partTypeName" label="配件名称" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格型号" align="center"></el-table-column>
                <el-table-column prop="partCategoryName" label="类别" align="center"></el-table-column>
                <el-table-column prop="lastMonthSurplus" label="上月结存" align="center"></el-table-column>
                <el-table-column prop="thisMonthReceipt" label="本月进库" align="center"></el-table-column>
                <el-table-column prop="thisMonthOutbound" label="本月出库" align="center"></el-table-column>
                <el-table-column prop="thisMonthCheck" label="本月盘点" align="center"></el-table-column>
                <el-table-column prop="thisMonthInventory" label="本月库存" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="库存均价" align="center"></el-table-column>
                <el-table-column prop="totalMoney" label="总金额" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="detail(scope.row)" size="mini">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
        <el-dialog title="详情" :visible.sync="dialogVisible" width="1000px">
            <el-table :data="editTable" ref="table" stripe size="mini" height="400">
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="createTime" label="日期" width="90" align="center"></el-table-column>
                <el-table-column prop="lineName" label="线路" width="80" align="center"></el-table-column>
                <el-table-column prop="ownPlateNo" label="车号" width="80" align="center"></el-table-column>
                <el-table-column prop="partName" label="配件名称" align="center"></el-table-column>
                <el-table-column prop="partCode" label="配件编码" width="80" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" width="60" align="center"></el-table-column>
                <el-table-column prop="amount" label="出库数量" align="center"></el-table-column>
                <el-table-column prop="price" label="出库价格(元)" align="center"></el-table-column>
                <el-table-column prop="money" label="金额(元)" width="80" align="center"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :title="type === 'inbound' ? '入库清单' : '出库清单'" :visible.sync="dialogVisible2" width="1000px">
            <el-form :inline="true" :model="listForm" class="ordinary-form" size="small" ref="form">
                <el-form-item label="日期选择" prop="date">
                    <el-date-picker v-model="listForm.date" type="daterange" align="right" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" style="margin-top: 4px;" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="listTable" ref="table" stripe size="mini" height="400" v-loading="loading2">
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="createTime" label="日期" width="90" align="center"></el-table-column>
                <el-table-column :prop="type === 'inbound' ? 'partTypeName':'name'" label="配件名称" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格" align="center"></el-table-column>
                <el-table-column prop="partCategoryName" label="类型" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" width="60" align="center"></el-table-column>
                <el-table-column prop="amount" label="数量" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="价格(元)" align="center"></el-table-column>
                <el-table-column prop="money" label="金额(元)" width="80" align="center"></el-table-column>
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
      dialogVisible2: false,
      height: 'calc(100% - 45px)',
      url: {
        getData: '/webwms/api/inventory/getList',
        getOneData: '/webwms/api/inventory/getDetailData',
        getInbound: '/webwms/api/detailedList/receipt',
        getOutbound: '/webwms/api/detailedList/outbound'
      },
      type: '',
      form: {
        name: '',
        specificationType: '',
        partCategoryId: '',
        month: this.$public.format(new Date(), 'yyyy-MM'),
        limit: 50,
        page: 1
      },
      listForm: {
        date: [this.$public.format(date, 'yyyy-MM') + '-26', this.$public.format(new Date(), 'yyyy-MM') + '-25']
      },
      month: '',
      tableData: [],
      editTable: [],
      listTable: [],
      total: 0
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
      this.month = this.form.month
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data.list
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
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
      this.$http.post(this.url.getOneData, {partTypeId: row.partTypeId, month: this.month}, { emulateJSON: true }).then(
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
        'A1': {t: 's', v: '配件编码'},
        'B1': {t: 's', v: '配件名称'},
        'C1': {t: 's', v: '规格型号'},
        'D1': {t: 's', v: '类别'},
        'E1': {t: 's', v: '适用车型'},
        'F1': {t: 's', v: '单位'},
        'G1': {t: 's', v: '上月结存'},
        'H1': {t: 's', v: '本月进库'},
        'I1': {t: 's', v: '本月出库'},
        'J1': {t: 's', v: '本月盘点'},
        'K1': {t: 's', v: '本月库存'},
        'L1': {t: 's', v: '库存均价'},
        'M1': {t: 's', v: '总金额'},
        '!cols': [{wpx: 70}, {wpx: 90}, {wpx: 80}, {wpx: 70}, {wpx: 100}, {wpx: 60}, {wpx: 70}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}, {wpx: 60}]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].code || ''}
        obj['B' + count] = {t: 's', v: data[i].partTypeName || ''}
        obj['C' + count] = {t: 's', v: data[i].specificationType || ''}
        obj['D' + count] = {t: 's', v: data[i].partCategoryName || ''}
        obj['E' + count] = {t: 's', v: data[i].vehicleType || ''}
        obj['F' + count] = {t: 's', v: data[i].unit || ''}
        obj['G' + count] = {t: 'S', v: data[i].lastMonthSurplus || '0'}
        obj['H' + count] = {t: 's', v: data[i].thisMonthReceipt || '0'}
        obj['I' + count] = {t: 's', v: data[i].thisMonthOutbound || '0'}
        obj['J' + count] = {t: 's', v: data[i].thisMonthCheck || '0'}
        obj['K' + count] = {t: 's', v: data[i].thisMonthInventory || '0'}
        obj['L' + count] = {t: 's', v: data[i].unitPrice || '0'}
        obj['M' + count] = {t: 'S', v: data[i].totalMoney || '0'}
        count++
      }
      obj['!ref'] = 'A1:M' + count
      return obj
    },
    exportExcel () {
      this.loading = true
      this.$http.post(this.url.getData, {page: 1, limit: 20000}, {emulateJSON: true}).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            Export.downloadMater(this.format(res.data.list), '库存信息')
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading = false
        })
    },
    showList (type) {
      let date = new Date()
      date.setMonth(date.getMonth() - 1)
      this.type = type
      this.listForm.date = [this.$public.format(date, 'yyyy-MM') + '-26', this.$public.format(new Date(), 'yyyy-MM') + '-25']
      this.dialogVisible2 = true
      this.getList()
    },
    getList (type) {
      this.loading2 = true
      this.$http.post(this.type === 'inbound' ? this.url.getInbound : this.url.getOutbound, {startTime: this.listForm.date[0], endTime: this.listForm.date[1]}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading2 = false
          if (res.success) {
            this.listTable = res.data
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading2 = false
        })
    }
  },
  mounted () {
    this.getHeight()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
#inventoryStatistics {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
