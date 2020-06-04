<template>
    <div id="lineManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="线路名称" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入线路名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="startStation" label="起点站" align="center"></el-table-column>
                <el-table-column prop="endStation" label="终点站" align="center"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="400px">
          <el-form :inline="true" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="80px" v-loading="loading2">
            <el-form-item label="名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="起点站" prop="startStation">
                <el-input v-model="editForm.startStation"></el-input>
            </el-form-item>
            <el-form-item label="终点站" prop="endStation">
                <el-input v-model="editForm.endStation"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;">
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
        getData: '/webwms/api/line/getLineList',
        delData: '/webwms/api/line/deleteLine',
        saveData: '/webwms/api/line/saveLine'
      },
      form: {
        name: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        name: '',
        startStation: '',
        endStation: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        startStation: [
          { required: true, message: '请输入起点站', trigger: 'blur' }
        ],
        endStation: [
          { required: true, message: '请输入终点站', trigger: 'blur' }
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
          this.editForm = Object.assign({}, row)
        } else {
          this.editForm.id = 0
          this.$refs.editForm.resetFields()
        }
      }, 300)
    },
    del (id) {
      this.$confirm('此操作将删除该线路, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.url.delData, {lineId: id}, { emulateJSON: true }).then(
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
#lineManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
