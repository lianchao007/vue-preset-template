<template>
    <div id="inboundOrder" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="单据编号" prop="number">
                <el-input v-model="form.number" style="width: 160px;" placeholder="输入单据编号"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierId">
                <el-select v-model="form.supplierId" filterable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in supplierOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期选择" prop="day">
              <el-date-picker clearable v-model="form.day" type="date" style="width: 160px;" value-format="yyyy-MM-dd" placeholder="日期选择"></el-date-picker>
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
                <el-table-column prop="supplierName" label="供货商" align="center"></el-table-column>
                <el-table-column prop="invoice" label="发票号码" align="center"></el-table-column>
                <el-table-column prop="total" label="总数" align="center" width="120"></el-table-column>
                <el-table-column prop="totalMoney" label="总价" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="变更日期" align="center"></el-table-column>
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
            <el-form-item label="供货商" prop="supplierId" style="width: 33%;">
                <el-select v-model="editForm.supplierId" filterable style="width: calc(100% - 30px);">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in supplierOption" :key="it.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" circle @click="addSupplier"></el-button>
            </el-form-item>
            <el-form-item label="发票号码" prop="invoice" style="width: 27%;">
                <el-input v-model="editForm.invoice"></el-input>
            </el-form-item>
            <el-form-item label="是否代销" prop="isConsignment" style="width: 25%;">
                <el-switch v-model="editForm.isConsignment" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            <el-form-item prop="invoice" style="width: 15%;color: #fff;" label-width="0px">
                {{editForm.number ? '单据编号:' + editForm.number : ''}}
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
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
                <el-table-column prop="partTypeName" label="物品名称" align="center"></el-table-column>
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
            <el-dialog title="新增供货商" :visible.sync="innerVisible2" width="800px" append-to-body>
              <el-form class="supplierForm" :rules="supplierRules" :model="supplierForm" ref="supplierForm" style="text-align: center;" size="mini" label-width="100px" v-loading="loading2">
                <el-form-item label="供货商代码" prop="code">
                    <el-input v-model="supplierForm.code"></el-input>
                </el-form-item>
                <el-form-item label="供货商名称" prop="name">
                    <el-input v-model="supplierForm.name"></el-input>
                </el-form-item>
                <el-form-item label="供货商简称" prop="abbreviation">
                    <el-input v-model="supplierForm.abbreviation"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="supplierForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobilePhone">
                    <el-input v-model="supplierForm.mobilePhone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="supplierForm.address"></el-input>
                </el-form-item>
                <el-form-item label="公司电话" prop="phone">
                    <el-input v-model="supplierForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="fax">
                    <el-input v-model="supplierForm.fax"></el-input>
                </el-form-item>
                <el-form-item label="主营业务" prop="business">
                    <el-input v-model="supplierForm.business"></el-input>
                </el-form-item>
                <el-form-item label="公司主页" prop="homepage">
                    <el-input v-model="supplierForm.homepage"></el-input>
                </el-form-item>
                <el-form-item label="邮编" prop="postcodes">
                    <el-input v-model="supplierForm.postcodes"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="bank">
                    <el-input v-model="supplierForm.bank"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" prop="bankNumber">
                    <el-input v-model="editForm.bankNumber"></el-input>
                </el-form-item>
                <el-form-item label="税号" prop="taxNumber">
                    <el-input v-model="supplierForm.taxNumber"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" style="width: 100%;">
                    <el-input type="textarea" v-model="supplierForm.remarks" rows="5"></el-input>
                </el-form-item>
                <el-form-item label="登记时间" prop="registerDay">
                  <el-date-picker style="width: 100%;" clearable v-model="supplierForm.registerDay" type="date" value-format="yyyy-MM-dd" placeholder="登记时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="登记人" prop="registerName">
                    <el-input v-model="supplierForm.registerName" disabled></el-input>
                </el-form-item>
                <el-form-item style="text-align: center;width: 100%;" label-width="0">
                    <el-button type="primary" @click="saveSupplier" size="mini" :loading="loading2">确 定</el-button>
                </el-form-item>
              </el-form>
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
      innerVisible2: false,
      url: {
        getSupplier: '/webwms/api/supplier/getSupplierOption',
        getData: '/webwms/api/receipt/getReceiptList',
        getOneData: '/webwms/api/receipt/getReceipt',
        saveData: '/webwms/api/receipt/generateReceipt',
        getGoods: '/webwms/api/partType/getList',
        saveSupplier: '/webwms/api/supplier/saveSupplier'
      },
      supplierOption: [],
      form: {
        number: '',
        supplierId: '',
        day: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: '',
        number: '',
        supplierId: '',
        invoice: '',
        isConsignment: false,
        address: '',
        phone: '',
        remarks: '',
        createPeople: '',
        updatePeople: '',
        createTime: '',
        updateTime: '',
        department: '',
        datas: ''
      },
      supplierForm: {
        id: '',
        name: '',
        code: '',
        abbreviation: '',
        contact: '',
        mobilePhone: '',
        address: '',
        phone: '',
        fax: '',
        business: '',
        homepage: '',
        postcodes: '',
        bank: '',
        bankNumber: '',
        taxNumber: '',
        remarks: '',
        registerDay: '',
        registerName: this.$user ? this.$user.username : ''
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
      supplierRules: {
        name: [
          { required: true, message: '请输入供货商名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入供货商代码', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '请输入供货商简称', trigger: 'blur' }
        ],
        registerDay: [
          { required: true, message: '请输入登记时间', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入手机', trigger: 'blur' }
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
    // 获取供货商
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
    // 保存入库清单
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
          param.isConsignment = param.isConsignment ? 1 : 0
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
    // 新增编辑入库清单
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
                let obj = Object.assign({}, res.data.receipt)
                this.editForm = obj
                this.editTable = res.data.receiptDetailsList
              } else {
                this.$message.error(res.message)
              }
            }, response => {
              this.$message.error('请求失败')
              this.loading2 = false
            })
        } else {
          this.editForm.id = ''
          this.editTable = []
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    // 选择货物数量计算总价
    changeNum (row) {
      row.money = row.amount * row.unitPrice
    },
    // 查询货物
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
    // 选择货物
    selectGoods (row, column, event) {
      this.innerVisible = true
      this.currentRow = row
      this.searchGoods(row)
    },
    sureGoods (row, column, event) {
      this.currentRow.money = this.currentRow.amount ? this.currentRow.amount * row.unitPrice : ''
      this.currentRow.partTypeName = row.name
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
    // 删除货物
    delGoods (scope) {
      this.editTable.splice(scope.$index, 1)
    },
    // 新增货物
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
    // 新增供应商
    addSupplier () {
      this.innerVisible2 = true
      setTimeout(() => {
        this.supplierForm.id = ''
        this.$refs.supplierForm.resetFields()
      }, 300)
    },
    saveSupplier () {
      this.$refs.supplierForm.validate((valid) => {
        if (valid) {
          this.loading2 = true
          this.$http.post(this.url.saveSupplier, this.supplierForm, { emulateJSON: true }).then(
            response => {
              var res = response.body
              this.loading2 = false
              if (res.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.innerVisible2 = false
                this.getSupplier()
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
    // 导出
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
        obj['B' + count] = {t: 's', v: data[i].partTypeName || ''}
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
    this.getSupplier()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss">
#inboundOrder {
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 50%;
            float: left;
            margin-bottom: 5px;
        }
    }
}
.supplierForm {
    overflow: hidden;
    .el-form-item {
        width: 50%;
        float: left;
    }
}
</style>
<style lang="scss" scoped>
#inboundOrder {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
