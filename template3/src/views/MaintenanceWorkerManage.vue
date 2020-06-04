<template>
    <div id="maintenanceWorkerManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="维修工姓名" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入维修工姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" style="width: 160px;" placeholder="输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="维修工状态" prop="status">
                <el-select v-model="form.status" clearable style="width: 160px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="在职" value="1"></el-option>
                    <el-option label="休假" value="2"></el-option>
                    <el-option label="离退" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="exportExcel">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="employeeNo" label="工号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center">
                    <template slot-scope="scope">
                        {{scope.row.sex ? '女' : '男'}}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="address" label="家庭住址及情况" align="center"></el-table-column>
                <el-table-column prop="status" label="人员状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status == 1 ? '在职' : (scope.row.status == 2 ? '休假' : '离退')}}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="员工类型" align="center"></el-table-column>
                <el-table-column prop="nature" label="员工性质" align="center"></el-table-column>
                <el-table-column prop="contractStartTime" label="合同起始时间" align="center"></el-table-column>
                <el-table-column prop="contractEndTime" label="合同终止时间" align="center"></el-table-column>
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
          <el-form class="editForm" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="120px" v-loading="loading2">
            <el-form-item label="工号" prop="employeeNo">
                <el-input v-model="editForm.employeeNo"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="editForm.sex" style="width: 100%;">
                    <el-option label="男" :value="0"></el-option>
                    <el-option label="女" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="editForm.age"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份证号码" prop="idCard">
                <el-input v-model="editForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="人员状态" prop="status">
                <el-select v-model="editForm.status" style="width: 100%;">
                    <el-option label="在职" :value="1"></el-option>
                    <el-option label="休假" :value="2"></el-option>
                    <el-option label="离退" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文化程度" prop="education">
                <el-input v-model="editForm.education"></el-input>
            </el-form-item>
            <el-form-item label="进司时间" prop="accessTime">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.accessTime" type="date" value-format="yyyy-MM-dd" placeholder="进司时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="工龄" prop="workYear">
                <el-input v-model="editForm.workYear"></el-input>
            </el-form-item>
            <el-form-item label="员工类型" prop="type">
                <el-input v-model="editForm.type"></el-input>
            </el-form-item>
            <el-form-item label="员工性质" prop="nature">
                <el-input v-model="editForm.nature"></el-input>
            </el-form-item>
            <el-form-item label="合同起始时间" prop="contractStartTime">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.contractStartTime" type="date" value-format="yyyy-MM-dd" placeholder="合同起始时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="合同终止时间" prop="contractEndTime">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.contractEndTime" type="date" value-format="yyyy-MM-dd" placeholder="合同终止时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="合同签订日" prop="contractTime">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.contractTime" type="date" value-format="yyyy-MM-dd" placeholder="合同签订日"></el-date-picker>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;">
                <el-button type="primary" @click="save" style="margin-left: -120px;" size="mini" :loading="loading2">确 定</el-button>
            </el-form-item>
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
      height: 'calc(100% - 45px)',
      dialogVisible: false,
      url: {
        getData: '/webwms/api/employeeWorker/findAll',
        getOneData: '/webwms/api/employeeWorker/findOne',
        delData: '/webwms/api/employeeWorker/delete',
        saveData: '/webwms/api/employeeWorker/update'
      },
      form: {
        name: '',
        phone: '',
        status: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        name: '',
        employeeNo: '',
        sex: '',
        age: '',
        phone: '',
        idCard: '',
        address: '',
        status: '',
        education: '',
        accessTime: '',
        workYear: '',
        type: '',
        nature: '',
        contractStartTime: '',
        contractEndTime: '',
        contractTime: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        employeeNo: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入家庭住址', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入人员状态', trigger: 'blur' }
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
          this.$http.post(this.url.getOneData, {id: row.id}, { emulateJSON: true }).then(
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
          this.editForm.id = 0
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    del (id) {
      this.$confirm('此操作将删除该配件, 是否继续?', '提示', {
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
    format (data) {
      var obj = {
        'A1': {t: 's', v: '工号'},
        'B1': {t: 's', v: '姓名'},
        'C1': {t: 's', v: '性别'},
        'D1': {t: 's', v: '年龄'},
        'E1': {t: 's', v: '联系电话'},
        'F1': {t: 's', v: '家庭住址及情况'},
        'G1': {t: 's', v: '身份证号码'},
        'H1': {t: 's', v: '文化程度'},
        'I1': {t: 's', v: '工龄'},
        'J1': {t: 's', v: '人员状态'},
        'K1': {t: 's', v: '员工类型'},
        'L1': {t: 's', v: '员工性质'},
        'M1': {t: 's', v: '进司时间'},
        'N1': {t: 's', v: '合同起始时间'},
        'O1': {t: 's', v: '合同终止时间'},
        'P1': {t: 's', v: '合同签订日'},
        '!cols': [
          {wpx: 50}, {wpx: 50}, {wpx: 50}, {wpx: 50}, {wpx: 80}, {wpx: 120}, {wpx: 120}, {wpx: 60},
          {wpx: 50}, {wpx: 60}, {wpx: 70}, {wpx: 60}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}
        ]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].employeeNo || ''}
        obj['B' + count] = {t: 's', v: data[i].name || ''}
        obj['C' + count] = {t: 's', v: data[i].sex == 0 ? '男' : '女'}
        obj['D' + count] = {t: 's', v: data[i].age || ''}
        obj['E' + count] = {t: 's', v: data[i].phone || ''}
        obj['F' + count] = {t: 's', v: data[i].address || ''}
        obj['G' + count] = {t: 'S', v: data[i].idCard || ''}
        obj['H' + count] = {t: 'S', v: data[i].education || ''}
        obj['I' + count] = {t: 's', v: data[i].workYear || ''}
        obj['J' + count] = {t: 's', v: data[i].status == 1 ? '在职' : (data[i].status == 2 ? '休假' : '离退')}
        obj['K' + count] = {t: 's', v: data[i].type || ''}
        obj['L' + count] = {t: 's', v: data[i].nature || ''}
        obj['M' + count] = {t: 'S', v: data[i].accessTime || ''}
        obj['N' + count] = {t: 'S', v: data[i].contractStartTime || ''}
        obj['O' + count] = {t: 'S', v: data[i].contractEndTime || ''}
        obj['P' + count] = {t: 'S', v: data[i].contractTime || ''}
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
            Export.downloadMater(this.format(res.data.list), '维修工信息')
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
#maintenanceWorkerManage {
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
#maintenanceWorkerManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
