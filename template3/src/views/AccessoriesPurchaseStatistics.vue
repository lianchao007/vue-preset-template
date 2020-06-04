<template>
    <div id="accessoriesPurchaseStatistics" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="供货商" prop="supplierId">
                <el-select v-model="form.supplierId" filterable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in supplierOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年份选择" prop="year">
                <el-date-picker v-model="form.year" type="year" style="width: 160px;" placeholder="选择年"></el-date-picker>
            </el-form-item>
            <el-form-item label="月份选择" prop="month">
                <el-select v-model="form.month" style="width: 160px;">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="一月" value="1"></el-option>
                    <el-option label="二月" value="2"></el-option>
                    <el-option label="三月" value="3"></el-option>
                    <el-option label="四月" value="4"></el-option>
                    <el-option label="五月" value="5"></el-option>
                    <el-option label="六月" value="6"></el-option>
                    <el-option label="七月" value="7"></el-option>
                    <el-option label="八月" value="8"></el-option>
                    <el-option label="九月" value="9"></el-option>
                    <el-option label="十月" value="10"></el-option>
                    <el-option label="十一月" value="11"></el-option>
                    <el-option label="十二月" value="12"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" ref="table" stripe size="small" :summary-method="getSummaries" show-summary :height="$public.tableH">
                <el-table-column prop="name" label="入库单名称" align="center"></el-table-column>
                <el-table-column prop="number" label="单据编号" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                <el-table-column prop="invoice" label="发票号码" align="center"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                <el-table-column prop="updatePeople" label="最后变更人" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="变更时间" align="center"></el-table-column>
                <el-table-column prop="total" label="总数量" align="center" width="80"></el-table-column>
                <el-table-column prop="totalMoney" label="总金额(元)" width="100" align="center"></el-table-column>
            </el-table>
        <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    let date = new Date()
    return {
      loading: false,
      height: 'calc(100% - 45px)',
      url: {
        getData: '/webwms/api/accessoryPurchase/getAll',
        getSupplier: '/webwms/api/supplier/getSupplierOption'
      },
      supplierOption: [],
      form: {
        supplierId: '',
        year: String(date.getFullYear()),
        month: '0',
        limit: 50,
        page: 1
      },
      tableData: [],
      total: 0
    }
  },
  methods: {
    getHeight () {
      if (this.$refs.form) {
        this.height = 'calc(100% - ' + (this.$refs.form.$el.offsetHeight + 10) + 'px)'
      }
    },
    getSupplier () {
      this.$http.post(this.url.getSupplier).then(
        response => {
          var res = response.body
          if (res.success) {
            this.supplierOption = res.data
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
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data.list
            this.total = res.data.total
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
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 8) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else if (index === 9) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
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
    }
  },
  mounted () {
    this.getHeight()
    this.getSupplier()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
#accessoriesPurchaseStatistics {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
