<template>
    <div id="carTypeManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="车型名称" prop="name">
                <el-input v-model="form.name" style="width: 160px;" placeholder="输入车型名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="search">查询</el-button>
                <el-button type="primary" size="mini" style="margin-top: 4px;" @click="edit()">新增</el-button>
            </el-form-item>
        </el-form>
        <div :style="{height: height}" class="ordinary-tableBox">
            <el-table :data="tableData" stripe size="small" :height="$public.tableH">
                <el-table-column prop="name" label="车型名称" align="center"></el-table-column>
                <el-table-column prop="fullName" label="全称" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="mini">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination class="ordinary-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
            :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" ref="pagination"></el-pagination>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="400px">
          <el-form :rules="rules" :model="editForm" ref="editForm" style="width: 90%;margin: 0 auto;" size="mini" label-width="80px" v-loading="loading2">
            <el-form-item label="机构类型" prop="organizSelect">
                <el-select v-model="editForm.organizSelect" style="width: 100%;">
                    <el-option label="品牌" value="0"></el-option>
                    <el-option label="车型" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="品牌名称" prop="parentId" v-show="editForm.organizSelect === '1'">
                <el-select v-model="editForm.parentId" style="width: 100%;" clearable>
                    <el-option :label="it.name" :value="it.id" v-for="it in carTypeOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button style="margin-left: -40px;" type="primary" @click="save" size="mini" :loading="loading2">确 定</el-button>
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
        getCarType: '/webwms/api/carType/getCarTypeOption',
        getData: '/webwms/api/carType/getCarTypeList',
        getOneData: '/webwms/api/carType/getCarType',
        saveData: '/webwms/api/carType/saveCarType'
      },
      carTypeOption: [],
      form: {
        name: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: '',
        organizSelect: '1',
        name: '',
        parentId: ''
      },
      rules: {
        organizSelect: [
          { required: true, message: '请选择机构类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
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
    getCarType () {
      this.$http.post(this.url.getCarType, {parentId: 0}, { emulateJSON: true }).then(
        response => {
          var res = response.body
          if (res.success) {
            this.carTypeOption = res.data
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
    save () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading2 = true
          let param = {
            id: this.editForm.id,
            name: this.editForm.name
          }
          if (this.editForm.organizSelect === '1') {
            param.parentId = this.editForm.parentId
          } else {
            param.parentId = 0
          }
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
                this.getCarType()
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
          this.$http.post(this.url.getOneData, {carTypeId: row.id}, { emulateJSON: true }).then(
            response => {
              var res = response.body
              this.loading2 = false
              if (res.success) {
                this.editForm.id = res.data.id
                if (res.data.parentId === 0) {
                  this.editForm.organizSelect = '0'
                  this.editForm.parentId = ''
                } else {
                  this.editForm.organizSelect = '1'
                  this.editForm.parentId = res.data.parentId
                }
                this.editForm.name = res.data.name
              } else {
                this.$message.error(res.message)
              }
            }, response => {
              this.$message.error('请求失败')
              this.loading2 = false
            })
        } else {
          this.$refs.editForm.resetFields()
        }
      }, 300)
    }
  },
  mounted () {
    this.getHeight()
    this.getCarType()
    this.search()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
#carTypeManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
