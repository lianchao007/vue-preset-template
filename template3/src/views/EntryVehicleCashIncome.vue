<template>
    <div id="entryVehicleCashIncome" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="线路" prop="lineId">
                <el-select v-model="form.lineId" filterable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期选择" prop="day">
              <el-date-picker clearable v-model="form.day" type="date" style="width: 160px;" value-format="yyyy-MM-dd" placeholder="定检日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
            <el-form-item label="车号定位">
              <el-input v-model="ownPlateNo" style="width: 160px;"></el-input>
              <el-button type="primary" size="mini" style="margin-top: 4px;" @click="local">定位</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" ref="table" stripe size="small" highlight-current-row :summary-method="getSummaries" show-summary height="100%">
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="day" label="日期" min-width="90" align="center"></el-table-column>
                <el-table-column prop="lineName" label="线路" min-width="80" align="center"></el-table-column>
                <el-table-column prop="ownPlateNo" label="车号" min-width="80" align="center"></el-table-column>
                <el-table-column prop="icIncome" label="IC卡金额" align="center"></el-table-column>
                <el-table-column prop="cash" label="现金金额" align="center"></el-table-column>
                <el-table-column prop="total" label="小计" align="center"></el-table-column>
                <el-table-column label="操作" align="center" min-width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="mini">编辑</el-button>
                        <el-button type="primary" @click="del(scope.row.id)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="500px">
          <el-form :rules="rules" :model="editForm" ref="editForm" style="width: 90%;margin: 0 auto;" size="mini" label-width="120px" v-loading="loading2">
            <el-form-item label="线路名称" prop="lineId">
                <el-select v-model="editForm.lineId" filterable style="width: 100%;">
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车号" prop="vehicleId">
                <el-select v-model="editForm.vehicleId" filterable style="width: 100%;">
                    <el-option :label="it.ownPlateNo" :value="it.id" v-for="it in vehicleOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="IC卡金额" prop="icIncome">
                <el-input v-model="editForm.icIncome"></el-input>
            </el-form-item>
            <el-form-item label="现金金额" prop="cash">
                <el-input v-model="editForm.cash"></el-input>
            </el-form-item>
            <el-form-item label="日期" prop="day">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.day" type="date" value-format="yyyy-MM-dd" placeholder="日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button style="margin-left: -120px;" type="primary" @click="save" size="mini" :loading="loading2">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    let date = new Date()
    return {
      loading: false,
      loading2: false,
      dialogVisible: false,
      height: 'calc(100% - 45px)',
      url: {
        getVehicle: '/webwms/api/vehicle/getAllList',
        getData: '/webwms/api/dailyIncome/listDailyFromLine',
        getLineOption: '/webwms/api/line/getLineOption',
        saveData: '/webwms/api/dailyIncome/saveOrUpdateDailyIncome',
        delData: '/webwms/api/dailyIncome/deleteDailyIncome'
      },
      vehicleOption: [],
      lineOption: [],
      form: {
        lineId: '',
        day: this.$public.format(date, 'yyyy-MM-dd')
      },
      ownPlateNo: '',
      editForm: {
        id: 0,
        lineId: '',
        day: '',
        vehicleId: '',
        icIncome: '',
        cash: ''
      },
      tableData: [],
      rules: {
        lineId: [
          { required: true, message: '请选择线路名称', trigger: 'blur' }
        ],
        vehicleId: [
          { required: true, message: '请输入车号', trigger: 'blur' }
        ],
        icIncome: [
          { required: true, message: '请输入IC卡金额', trigger: 'blur' }
        ],
        cash: [
          { required: true, message: '请输入现金金额', trigger: 'blur' }
        ],
        day: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getHeight () {
      if (this.$refs.form) {
        this.height = 'calc(100% - ' + (this.$refs.form.$el.offsetHeight + 10) + 'px)'
      }
    },
    getVehicle () {
      this.$http.post(this.url.getVehicle).then(
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
    // 查询
    search () {
      this.loading = true
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data
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
        if (index > 3 && index < 7) {
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
    save () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading2 = true
          this.$http.post(this.url.saveData, this.editForm, { emulateJSON: true }).then(
            response => {
              var res = response.body
              this.loading2 = false
              if (res.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.search()
              } else {
                this.$message.error(res.message)
              }
            }, response => {
              this.$message.error('请求失败')
              this.loading2 = false
            })
        } else {
          return false
        }
      })
    },
    edit (row) {
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs.editForm.clearValidate()
        if (row) {
          this.editForm = Object.assign({}, row)
        } else {
          this.editForm.id = 0
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    del (id) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.url.delData, {id: id}, { emulateJSON: true }).then(
          response => {
            var res = response.body
            this.search()
            if (res.success) {
              this.$message({
                message: res.message || '删除成功',
                type: 'success'
              })
              this.search()
            } else {
              this.$message.error(res.message)
            }
          }, response => {
            this.$message.error('请求失败')
          })
      }).catch(() => {})
    },
    local () {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].ownPlateNo && this.tableData[i].ownPlateNo.indexOf(this.ownPlateNo) !== -1) {
          this.$refs.table.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = i * 38
          this.$refs.table.setCurrentRow(this.tableData[i])
          break
        }
      }
    }
  },
  mounted () {
    this.getHeight()
    this.getVehicle()
    this.getLineOption()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
#entryVehicleCashIncome {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
