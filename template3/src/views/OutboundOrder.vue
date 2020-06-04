<template>
    <div id="outboundOrder" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="单据编号" prop="number">
                <el-input v-model="form.number" style="width: 160px;" placeholder="输入单据编号"></el-input>
            </el-form-item>
            <el-form-item label="车号" prop="ownPlateNo">
                <el-input v-model="form.ownPlateNo" style="width: 160px;" placeholder="输入车号"></el-input>
            </el-form-item>
            <el-form-item label="车牌号" prop="plateNo">
                <el-input v-model="form.plateNo" style="width: 160px;" placeholder="输入车牌号"></el-input>
            </el-form-item>
            <el-form-item label="日期选择" prop="day">
              <el-date-picker clearable v-model="form.day" type="date" value-format="yyyy-MM-dd" style="width: 160px;" placeholder="日期选择"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="number" label="单据编号" align="center"></el-table-column>
                <el-table-column prop="ownPlateNo" label="车号" align="center"></el-table-column>
                <el-table-column prop="plateNo" label="车牌号" align="center"></el-table-column>
                <el-table-column prop="total" label="总数" align="center" width="120"></el-table-column>
                <el-table-column prop="totalMoney" label="总价" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="mini">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
        <el-dialog title="材料入库单" :visible.sync="dialogVisible" width="1000px">
          <el-form class="editForm" :show-message="false" :status-icon="true" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="100px" v-loading="loading2">
            <el-form-item label="车号" prop="vehicleId" style="width: 33.3%;">
                <el-select v-model="editForm.vehicleId" filterable style="width: 100%;" @change="selectVehicle">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.ownPlateNo" :value="it.id" v-for="it in vehicleOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车牌号" prop="plateNo" style="width: 33.3%;">
                <el-input v-model="editForm.plateNo" disabled></el-input>
            </el-form-item>
            <el-form-item prop="isMaintain" style="width: 33.3%;" label-width="0">
                <el-radio-group v-model="editForm.isMaintain">
                    <el-radio :label="1">维修</el-radio>
                    <el-radio :label="0">保养</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="修理费" prop="maintainMoney" style="width: 33.3%;">
                <el-input v-model="editForm.maintainMoney" disabled></el-input>
            </el-form-item>
            <el-form-item label="材料费" prop="materialMoney" style="width: 33.3%;">
                <el-input v-model="editForm.materialMoney" disabled></el-input>
            </el-form-item>
            <el-form-item prop="receiveMateriel" style="width: 33.3%;" label-width="0">
                <el-radio-group v-model="editForm.receiveMateriel">
                    <el-radio label="公摊领料"></el-radio>
                    <el-radio label="其他领料"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks" style="width: 100%;">
                <el-input v-model="editForm.remarks"></el-input>
            </el-form-item>
            <el-form-item label="制单人" prop="createPeople">
                <el-input v-model="editForm.createPeople" disabled></el-input>
            </el-form-item>
            <el-form-item label="最后变更人" prop="updatePeople">
                <el-input v-model="editForm.updatePeople" disabled></el-input>
            </el-form-item>
            <el-form-item label="制单时间" prop="createTime" style="width: 33.3%;">
              <el-date-picker style="width: 100%;" v-model="editForm.createTime" type="date" value-format="yyyy-MM-dd" placeholder="制单时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="变更时间" prop="updateTime" style="width: 33.3%;">
                <el-input v-model="editForm.updateTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="分管部门" prop="department" style="width: 33.3%;">
                <el-input v-model="editForm.department"></el-input>
            </el-form-item>
            <el-table :data="editTable" stripe size="small" :height="300" @row-dblclick="selectGoods">
                <el-table-column prop="code" label="物品编码" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="物品名称" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格" width="100" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" width="70" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="单价" align="center" width="80"></el-table-column>
                <el-table-column prop="amount" label="数量" width="100" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.amount" size="mini" @change="changeNum(scope.row)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="金额" width="100" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" width="120" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="delGoods(scope)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item style="text-align: center;width: 100%;" label-width="0px">
                <el-button type="primary" @click="addGoods" size="mini" :loading="loading2">新增物品</el-button>
                <el-button type="primary" @click="exportExcel" size="mini" :loading="loading2">导出excel</el-button>
                <el-button type="primary" @click="save" size="mini" :loading="loading2">保 存</el-button>
            </el-form-item>
            <el-dialog width="800px" title="物品列表" :visible.sync="innerVisible" append-to-body>
                <el-form :inline="true" class="goodsForm" :model="goodsForm" ref="goodsForm" size="mini" label-width="60px" v-loading="loading3">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="goodsForm.code" style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="goodsForm.name" style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" style="margin-top: 4px;" @click="searchGoods">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="goodsTable" stripe size="mini" :height="400" @row-dblclick="sureGoods">
                    <el-table-column prop="code" label="物品编码" width="80" align="center"></el-table-column>
                    <el-table-column prop="name" label="物品名称" align="center"></el-table-column>
                    <el-table-column prop="specificationType" label="规格" width="120" align="center"></el-table-column>
                    <el-table-column prop="unit" label="单位" width="70" align="center"></el-table-column>
                    <el-table-column prop="unitPrice" label="单价" align="center" width="80"></el-table-column>
                    <el-table-column prop="partCategoryName" label="物品类别" width="100" align="center"></el-table-column>
                </el-table>
                <el-pagination class="ordinary-pagination" @size-change="goodsHandleSizeChange" @current-change="goodsHandleCurrentChange" :current-page="goodsForm.page"
                    :page-sizes="[20, 50, 100, 200]" :page-size="goodsForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="goodsTotal" ref="pagination"></el-pagination>
            </el-dialog>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
import Export from '../assets/js/export.js'
export default {
  data () {
    return {
      loading: false,
      loading2: false,
      loading3: false,
      height: 'calc(100% - 45px)',
      dialogVisible: false,
      innerVisible: false,
      url: {
        getVehicle: '/webwms/api//vehicle/getAllList',
        getData: '/webwms/api/outbound/getList',
        getOneData: '/webwms/api/outbound/getData',
        saveData: '/webwms/api/outbound/save',
        getGoods: '/webwms/api/partType/getList'
      },
      vehicleOption: [],
      form: {
        number: '',
        supplierId: '',
        day: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        vehicleId: '',
        ownPlateNo: '',
        plateNo: '',
        maintainMoney: '',
        isMaintain: '',
        materialMoney: '',
        receiveMateriel: '',
        remarks: '',
        createPeople: '',
        updatePeople: '',
        createTime: '',
        updateTime: '',
        department: '',
        datas: ''
      },
      goodsForm: {
        code: '',
        name: '',
        limit: 50,
        page: 1
      },
      rules: {
        supplierId: [
          { required: true, message: '请选择供货商', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入制单时间', trigger: 'blur' }
        ]
      },
      editTable: [],
      tableData: [],
      goodsTable: [],
      currentRow: null,
      total: 0,
      goodsTotal: 0
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
    // 改变每页条数
    goodsHandleSizeChange (val) {
      this.goodsForm.limit = val
      this.goodsHandleCurrentChange(1)
    },
    // 改变当前页码
    goodsHandleCurrentChange (val) {
      this.goodsForm.page = val
      this.searchGoods()
    },
    save () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.editTable.length; i++) {
            if (!this.editTable[i].amount || !this.editTable[i].partTypeId) {
              this.$message.error('表格数据不完整')
              return false
            }
            this.editTable[i].id = ''
          }
          this.loading2 = true
          let param = Object.assign({}, this.editForm)
          param.datas = JSON.stringify(this.editTable)
          this.$http.post(this.url.saveData, param, { emulateJSON: true }).then(
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
          this.loading2 = true
          this.$http.post(this.url.getOneData, {id: row.id}, { emulateJSON: true }).then(
            response => {
              var res = response.body
              this.loading2 = false
              if (res.success) {
                let obj = Object.assign({}, res.data.outbound)
                this.editForm = obj
                this.editTable = res.data.outboundDetailsList
              } else {
                this.$message.error(res.message)
              }
            }, response => {
              this.$message.error('请求失败')
              this.loading2 = false
            })
        } else {
          this.editForm.id = 0
          this.editTable = []
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    selectVehicle (val) {
      for (let i = 0; i < this.vehicleOption.length; i++) {
        if (this.vehicleOption[i].id === val) {
          this.editForm.plateNo = this.vehicleOption[i].plateNo
          this.editForm.ownPlateNo = this.vehicleOption[i].ownPlateNo
          return
        }
      }
      this.editForm.plateNo = ''
      this.editForm.ownPlateNo = ''
    },
    changeNum (row) {
      row.money = row.amount * row.unitPrice
    },
    searchGoods (row) {
      this.loading3 = true
      this.$http.post(this.url.getGoods, this.goodsForm, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading3 = false
          if (res.success) {
            this.goodsTable = res.data.list
            this.goodsTotal = res.data.total
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
          this.loading3 = false
        })
    },
    selectGoods (row, column, event) {
      this.innerVisible = true
      this.currentRow = row
      this.searchGoods(row)
    },
    sureGoods (row, column, event) {
      console.log(row)
      this.currentRow.money = this.currentRow.amount ? this.currentRow.amount * row.unitPrice : ''
      this.currentRow.name = row.name
      this.currentRow.code = row.code
      this.currentRow.address = row.address
      this.currentRow.isAssessment = row.isAssessment
      this.currentRow.unitPrice = row.unitPrice
      this.currentRow.specificationType = row.specificationType
      this.currentRow.partCategoryName = row.partCategoryName
      this.currentRow.unit = row.unit
      this.currentRow.partTypeId = row.id
      this.innerVisible = false
    },
    delGoods (scope) {
      this.editTable.splice(scope.$index, 1)
    },
    addGoods () {
      this.editTable.push({
        amount: '',
        code: '',
        createTime: '',
        id: '',
        money: '',
        partCategoryName: '',
        partTypeId: '',
        partTypeName: '',
        receiptId: '',
        remark: '',
        specificationType: '',
        unit: '',
        unitPrice: ''
      })
    },
    format (data) {
      var obj = {
        'A1': {t: 's', v: '物品编码'},
        'B1': {t: 's', v: '物品名称'},
        'C1': {t: 's', v: '规格'},
        'D1': {t: 's', v: '单位'},
        'E1': {t: 's', v: '单价'},
        'F1': {t: 's', v: '数量'},
        'G1': {t: 's', v: '金额'},
        'H1': {t: 's', v: '备注'},
        '!cols': [{wpx: 80}, {wpx: 120}, {wpx: 80}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 90}]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].code || ''}
        obj['B' + count] = {t: 's', v: data[i].name || ''}
        obj['C' + count] = {t: 's', v: data[i].specificationType || ''}
        obj['D' + count] = {t: 's', v: data[i].unit || ''}
        obj['E' + count] = {t: 's', v: data[i].unitPrice || ''}
        obj['F' + count] = {t: 's', v: data[i].amount || ''}
        obj['G' + count] = {t: 'S', v: data[i].money || ''}
        obj['H' + count] = {t: 's', v: data[i].remark || ''}
        count++
      }
      obj['!ref'] = 'A1:H' + count
      return obj
    },
    exportExcel () {
      Export.downloadMater(this.format(this.editTable), '车辆维修清单')
    }
  },
  mounted () {
    this.getHeight()
    this.getVehicle()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss">
#outboundOrder {
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 50%;
            float: left;
            margin-bottom: 5px;
        }
        .el-radio, .el-radio__input {
            line-height: 30px;
        }
    }
}
</style>
<style lang="scss" scoped>
#outboundOrder {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
