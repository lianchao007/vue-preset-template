<template>
    <div id="gasManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" height="100%">
                <el-table-column prop="id" label="id" align="center"></el-table-column>
                <el-table-column prop="name" label="加油点名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="mini">编辑</el-button>
                        <el-button type="primary" @click="del(scope.row.id)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="400px">
          <el-form :rules="rules" :model="editForm" ref="editForm" style="text-align: center;margin-top: 20px;" size="mini" label-width="120px" v-loading="loading2">
            <el-form-item label="加油点名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button type="primary" style="margin-left: -120px;" @click="save" size="mini" :loading="loading2">确 定</el-button>
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
        getData: '/webwms/api/fuelPoint/listAllFuelPoint',
        delData: '/webwms/api/fuelPoint/deleteFuelPoint',
        saveData: '/webwms/api/fuelPoint/saveOrUpdateFuelPoint'
      },
      form: {
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
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
    // 查询
    search () {
      this.loading = true
      this.$http.post(this.url.getData, this.form, { emulateJSON: true }).then(
        response => {
          var res = response.body
          this.loading = false
          if (res.success) {
            this.tableData = res.data
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
          this.editForm = Object.assign({}, row)
        } else {
          this.$refs.editForm.resetFields()
          this.editForm.id = 0
        }
      }, 300)
    },
    del (id) {
      this.$confirm('此操作将删除该加油点, 是否继续?', '提示', {
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
<style lang="scss" scoped>
#gasManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
