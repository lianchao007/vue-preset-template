<template>
    <div id="accessoriesManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="配件编码" prop="code">
                <el-input v-model="form.code" style="width: 160px;" placeholder="输入配件编码"></el-input>
            </el-form-item>
            <el-form-item label="配件名称" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入配件名称"></el-input>
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
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="code" label="配件编码" align="center"></el-table-column>
                <el-table-column prop="name" label="配件名称" align="center"></el-table-column>
                <el-table-column prop="specificationType" label="规格型号" align="center"></el-table-column>
                <el-table-column prop="unitPrice" label="单价" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                <el-table-column prop="partCategoryName" label="物品类别" align="center"></el-table-column>
                <el-table-column prop="vehicleType" label="适用车型" align="center"></el-table-column>
                <el-table-column prop="address" label="存放位置" align="center"></el-table-column>
                <el-table-column prop="isAssessment" label="是否纳入考核" align="center">
                    <template slot-scope="scope">
                        {{scope.row.isAssessment && scope.row.isAssessment !== '0' ? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="700px">
          <el-form class="editForm" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="80px" v-loading="loading2">
            <el-form-item label="配件编码" prop="code">
                <el-input v-model="editForm.code"></el-input>
            </el-form-item>
            <el-form-item label="配件名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="规格型号" prop="specificationType">
                <el-input v-model="editForm.specificationType"></el-input>
            </el-form-item>
            <el-form-item label="物品类别" prop="partCategoryId">
                <el-select v-model="editForm.partCategoryId" style="width: 100%;">
                    <el-option label="机油" value="1"></el-option>
                    <el-option label="配件" value="2"></el-option>
                    <el-option label="辅助" value="3"></el-option>
                    <el-option label="轮胎" value="4"></el-option>
                    <el-option label="工具" value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价" prop="unitPrice">
                <el-input v-model="editForm.unitPrice"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
                <el-input v-model="editForm.unit"></el-input>
            </el-form-item>
            <el-form-item label="适用车型" prop="vehicleType">
                <el-input v-model="editForm.vehicleType"></el-input>
            </el-form-item>
            <el-form-item label="存放位置" prop="address">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="纳入考核" prop="isAssessment">
                <el-select v-model="editForm.isAssessment" style="width: 100%;">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" style="width: 100%;">
                <el-input type="textarea" v-model="editForm.remarks" rows="5"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;" label-width="0">
                <el-button type="primary" @click="save" size="mini" :loading="loading2">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      loading2: false,
      height: 'calc(100% - 45px)',
      dialogVisible: false,
      url: {
        getData: '/webwms/api/partType/getList',
        getOneData: '/webwms/api/partType/getData',
        delData: '/webwms/api/partType/delete',
        saveData: '/webwms/api/partType/save'
      },
      form: {
        name: '',
        code: '',
        partCategoryId: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        name: '',
        code: '',
        specificationType: '',
        partCategoryId: '',
        unitPrice: '',
        unit: '',
        vehicleType: '',
        address: '',
        isAssessment: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入配件名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入配件编码', trigger: 'blur' }
        ],
        specificationType: [
          { required: true, message: '请输入规格型号', trigger: 'blur' }
        ],
        partCategoryId: [
          { required: true, message: '请输入物品类别', trigger: 'blur' }
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
#accessoriesManage {
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
#accessoriesManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
}
</style>
