<template>
    <div id="supplierManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="供应商名称" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入供应商名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="exportExcel">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="code" label="供货商代号" align="center" width="100"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="abbreviation" label="简称" align="center" width="80"></el-table-column>
                <el-table-column prop="contact" label="联系人" align="center" width="80"></el-table-column>
                <el-table-column prop="business" label="主营业务" align="center"></el-table-column>
                <el-table-column prop="mobilePhone" label="手机号码" align="center" width="120"></el-table-column>
                <el-table-column prop="address" label="地址" align="center"></el-table-column>
                <el-table-column prop="bankNumber" label="银行账号" align="center"></el-table-column>
                <el-table-column prop="taxNumber" label="税号" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                <el-table-column prop="registerDay" label="登记日期" align="center" width="120"></el-table-column>
                <el-table-column prop="registerName" label="登记人" align="center" width="80"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="mini">编辑</el-button>
                        <el-button type="primary" @click="del(scope.row.id)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="800px">
          <el-form class="editForm" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="100px" v-loading="loading2">
            <el-form-item label="供货商代码" prop="code">
                <el-input v-model="editForm.code"></el-input>
            </el-form-item>
            <el-form-item label="供货商名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="供货商简称" prop="abbreviation">
                <el-input v-model="editForm.abbreviation"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input v-model="editForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobilePhone">
                <el-input v-model="editForm.mobilePhone"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="公司电话" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
                <el-input v-model="editForm.fax"></el-input>
            </el-form-item>
            <el-form-item label="主营业务" prop="business">
                <el-input v-model="editForm.business"></el-input>
            </el-form-item>
            <el-form-item label="公司主页" prop="homepage">
                <el-input v-model="editForm.homepage"></el-input>
            </el-form-item>
            <el-form-item label="邮编" prop="postcodes">
                <el-input v-model="editForm.postcodes"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bank">
                <el-input v-model="editForm.bank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankNumber">
                <el-input v-model="editForm.bankNumber"></el-input>
            </el-form-item>
            <el-form-item label="税号" prop="taxNumber">
                <el-input v-model="editForm.taxNumber"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" style="width: 100%;">
                <el-input type="textarea" v-model="editForm.remarks" rows="5"></el-input>
            </el-form-item>
            <el-form-item label="登记时间" prop="registerDay">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.registerDay" type="date" value-format="yyyy-MM-dd" placeholder="登记时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="登记人" prop="registerName">
                <el-input v-model="editForm.registerName" disabled></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;">
                <el-button type="primary" @click="save" style="margin-left: -40px;" size="mini" :loading="loading2">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
import Export from '../assets/js/export.js'
export default {
  data () {
    console.log(this.$user)
    return {
      loading: false,
      loading2: false,
      height: 'calc(100% - 45px)',
      dialogVisible: false,
      url: {
        getData: '/webwms/api/supplier/getSupplierList',
        getOneData: '/webwms/api/supplier/getSupplier',
        delData: '/webwms/api/supplier/deleteSupplier',
        saveData: '/webwms/api/supplier/saveSupplier'
      },
      form: {
        name: '',
        limit: 50,
        page: 1
      },
      editForm: {
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
      rules: {
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
          this.loading2 = true
          this.$http.post(this.url.getOneData, {supplierId: row.id}, { emulateJSON: true }).then(
            response => {
              var res = response.body
              this.loading2 = false
              if (res.success) {
                let obj = Object.assign({}, res.data)
                this.editForm = obj
              } else {
                this.$message.error(res.message)
              }
            }, response => {
              this.$message.error('请求失败')
              this.loading2 = false
            })
        } else {
          this.editForm.id = ''
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    del (id) {
      this.$confirm('此操作将删除该供应商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.url.delData, {supplierId: id}, { emulateJSON: true }).then(
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
    format (data) {
      var obj = {
        'A1': {t: 's', v: '供货商代号'},
        'B1': {t: 's', v: '名称'},
        'C1': {t: 's', v: '简称'},
        'D1': {t: 's', v: '联系人'},
        'E1': {t: 's', v: '电话'},
        'F1': {t: 's', v: '传真'},
        'G1': {t: 's', v: '主营业务'},
        'H1': {t: 's', v: '手机号码'},
        'I1': {t: 's', v: '地址'},
        'J1': {t: 's', v: '公司主页'},
        'K1': {t: 's', v: '邮编'},
        'L1': {t: 's', v: '开户银行'},
        'M1': {t: 's', v: '税号'},
        'N1': {t: 's', v: '备注'},
        'O1': {t: 's', v: '登记日期'},
        'P1': {t: 's', v: '登记人'},
        '!cols': [{wpx: 70}, {wpx: 150}, {wpx: 80}, {wpx: 60}, {wpx: 80}, {wpx: 80}, {wpx: 80}, {wpx: 80}, {wpx: 120},
          {wpx: 110}, {wpx: 80}, {wpx: 100}, {wpx: 120}, {wpx: 120}, {wpx: 120}, {wpx: 80}, {wpx: 70}]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].code || ''}
        obj['B' + count] = {t: 's', v: data[i].name || ''}
        obj['C' + count] = {t: 's', v: data[i].abbreviation || ''}
        obj['D' + count] = {t: 's', v: data[i].contact || ''}
        obj['E' + count] = {t: 's', v: data[i].phone || ''}
        obj['F' + count] = {t: 's', v: data[i].fax || ''}
        obj['G' + count] = {t: 'S', v: data[i].business || ''}
        obj['H' + count] = {t: 's', v: data[i].phone || ''}
        obj['I' + count] = {t: 's', v: data[i].address || ''}
        obj['J' + count] = {t: 's', v: data[i].homepage || ''}
        obj['K' + count] = {t: 's', v: data[i].bank || ''}
        obj['L' + count] = {t: 's', v: data[i].bankNumber || ''}
        obj['M' + count] = {t: 's', v: data[i].taxNumber || ''}
        obj['N' + count] = {t: 'S', v: data[i].remarks || ''}
        obj['O' + count] = {t: 's', v: data[i].registerDay || ''}
        obj['P' + count] = {t: 'S', v: data[i].registerName || ''}
        count++
      }
      obj['!ref'] = 'A1:P' + count
      return obj
    },
    exportExcel () {
      this.$http.post(this.url.getData, {page: 1, limit: 20000}, {emulateJSON: true}).then(
        response => {
          var res = response.body
          if (res.success) {
            Export.downloadMater(this.format(res.data.list), '供应商基础信息')
          } else {
            this.$message.error(res.message)
          }
        }, response => {
          this.$message.error('请求失败')
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
<style lang="scss">
#supplierManage {
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 50%;
            float: left;
        }
    }
}
</style>
<style lang="scss" scoped>
#supplierManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
