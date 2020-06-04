<template>
    <div id="vehicleManage" v-loading="loading">
        <el-form :inline="true" :model="form" class="ordinary-form" size="small" ref="form">
            <el-form-item label="车号" prop="ownPlateNo">
                <el-input v-model="form.ownPlateNo" style="width: 160px;" placeholder="输入线路名称"></el-input>
            </el-form-item>
            <el-form-item label="车牌号" prop="plateNo">
                <el-input v-model="form.plateNo" style="width: 160px;" placeholder="输入线路名称"></el-input>
            </el-form-item>
            <el-form-item label="线路" prop="lineId">
                <el-select v-model="form.lineId" filterable style="width: 120px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车型" prop="carTypeId">
                <el-select v-model="form.carTypeId" filterable style="width: 120px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="it.name" :value="it.id" v-for="it in carTypeOption" :key="it.id"></el-option>
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
                <el-table-column prop="ownPlateNo" label="车号" align="center"></el-table-column>
                <el-table-column prop="plateNo" label="车牌号" align="center"></el-table-column>
                <el-table-column prop="lineName" label="线路" align="center"></el-table-column>
                <el-table-column prop="engineType" label="发动机类型" align="center"></el-table-column>
                <el-table-column prop="engineNumber" label="发动机号" align="center"></el-table-column>
                <el-table-column prop="chassisNumber" label="车架号" align="center"></el-table-column>
                <el-table-column prop="carTypeName" label="车型" align="center"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="1100px">
          <el-form class="editForm" :show-message="false" :status-icon="true" :rules="rules" :model="editForm" ref="editForm" style="text-align: center;" size="mini" label-width="80px" v-loading="loading2">
            <el-form-item label="自编号" prop="ownPlateNo" required>
                <el-input v-model="editForm.ownPlateNo"></el-input>
            </el-form-item>
            <el-form-item label="号牌号码" prop="plateNo" required>
                <el-input v-model="editForm.plateNo"></el-input>
            </el-form-item>
            <el-form-item label="单位名称" prop="dwmc" style="width: 50%;">
                <el-input v-model="editForm.dwmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="发证机关" prop="fzjg" style="width: 50%;">
                <el-input v-model="editForm.fzjg" disabled></el-input>
            </el-form-item>
            <el-form-item label="重点类型" prop="zdlx">
                <el-input v-model="editForm.zdlx" disabled></el-input>
            </el-form-item>
            <el-form-item label="号牌种类" prop="hpzl">
                <el-input v-model="editForm.hpzl" disabled></el-input>
            </el-form-item>
            <el-form-item label="隶属关系" prop="lsgx">
                <el-input v-model="editForm.lsgx" disabled></el-input>
            </el-form-item>
            <el-form-item label="安装记录仪" prop="haveRecorder">
                <el-select v-model="editForm.haveRecorder" clearable>
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="使用性质" prop="syxz">
                <el-input v-model="editForm.syxz" disabled></el-input>
            </el-form-item>
            <el-form-item label="实际载客" prop="sjzk">
                <el-input v-model.number="editForm.sjzk"></el-input>
            </el-form-item>
            <el-form-item label="安装GPS" prop="haveGps">
                <el-select v-model="editForm.haveGps" clearable>
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投保单位" prop="tbdw">
                <el-input v-model="editForm.tbdw"></el-input>
            </el-form-item>
            <el-form-item label="保险凭证号" prop="bxpzh">
                <el-input v-model="editForm.bxpzh"></el-input>
            </el-form-item>
            <el-form-item label="投保金额" prop="tbje">
                <el-input v-model="editForm.tbje"></el-input>
            </el-form-item>
            <el-form-item label="保险起始日期" prop="bxqsrq">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.bxqsrq" type="date" value-format="yyyy-MM-dd" placeholder="保险起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="保险终止日期" prop="bxzzrq">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.bxzzrq" type="date" value-format="yyyy-MM-dd" placeholder="保险终止日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="所有人" prop="syr">
                <el-input v-model="editForm.syr" disabled></el-input>
            </el-form-item>
            <el-form-item label="车主手机" prop="czsj">
                <el-input v-model="editForm.czsj"></el-input>
            </el-form-item>
            <el-form-item label="身份证明名称" prop="sfzmmc">
                <el-input v-model="editForm.sfzmmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号码" prop="sfzmhm">
                <el-input v-model="editForm.sfzmhm"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="初次登记日期" prop="ccdjrq">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.ccdjrq" type="date" value-format="yyyy-MM-dd" placeholder="初次登记日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="住所详细地址" prop="drAddress" style="width: 50%;">
                <el-input v-model="editForm.drAddress"></el-input>
            </el-form-item>
            <el-form-item label="暂住详细地址" prop="trAddress" style="width: 50%;">
                <el-input v-model="editForm.trAddress"></el-input>
            </el-form-item>
            <el-form-item label="定检日期" prop="djrq">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.djrq" type="date" value-format="yyyy-MM-dd" placeholder="定检日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="强制报废日期" prop="qzbfrq">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.qzbfrq" type="date" value-format="yyyy-MM-dd" placeholder="强制报废日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="厂牌型号" prop="carTypeId" required>
                <el-select v-model="editForm.carTypeId" filterable @change="carTypeChange">
                    <el-option :label="it.name" :value="it.id" v-for="it in carTypeOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆品牌" prop="clpp">
                <el-input v-model="editForm.clpp" disabled></el-input>
            </el-form-item>
            <el-form-item label="车身颜色" prop="color">
                <el-input v-model="editForm.color" disabled></el-input>
            </el-form-item>
            <el-form-item label="线路" prop="lineId" required>
                <el-select v-model="editForm.lineId" filterable @change="lineChange">
                    <el-option :label="it.name" :value="it.id" v-for="it in lineOption" :key="it.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所有权" prop="ownership">
                <el-input v-model="editForm.ownership"></el-input>
            </el-form-item>
            <el-form-item label="发动机型号" prop="engineType">
                <el-input v-model="editForm.engineType"></el-input>
            </el-form-item>
            <el-form-item label="车架号" prop="chassisNumber">
                <el-input v-model="editForm.chassisNumber"></el-input>
            </el-form-item>
            <el-form-item label="发动机号" prop="engineNumber">
                <el-input v-model="editForm.engineNumber"></el-input>
            </el-form-item>
            <el-form-item label="核定载客" prop="hdzk">
                <el-input v-model.number="editForm.hdzk"></el-input>
            </el-form-item>
            <el-form-item label="核定载客量" prop="hdzkl">
                <el-input v-model.number="editForm.hdzkl"></el-input>
            </el-form-item>
            <el-form-item label="整备质量" prop="zbzl">
                <el-input v-model="editForm.zbzl"></el-input>
            </el-form-item>
            <el-form-item label="总质量" prop="totalWeight">
                <el-input v-model="editForm.totalWeight"></el-input>
            </el-form-item>
            <el-form-item label="装载危化物品" prop="zhuangzwhwp">
                <el-select v-model="editForm.zhuangzwhwp" clearable>
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主载危化物品" prop="zhuzwhwp">
                <el-select v-model="editForm.zhuzwhwp" clearable>
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="罐体监测合格期" prop="gtjchgq">
                <el-input v-model="editForm.gtjchgq"></el-input>
            </el-form-item>
            <el-form-item label="是否挂靠企业" prop="isAnchored">
                <el-select v-model="editForm.isAnchored" clearable>
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属企业法定代表姓名" prop="legalPersonName">
                <el-input v-model="editForm.legalPersonName" disabled></el-input>
            </el-form-item>
            <el-form-item label="企业管理人联系电话" prop="adminPhone">
                <el-input v-model="editForm.adminPhone"></el-input>
            </el-form-item>
            <el-form-item label="所属企业法人代表联系电话" prop="legalPersonPhone">
                <el-input v-model="editForm.legalPersonPhone"></el-input>
            </el-form-item>
            <el-form-item label="企业管理人姓名" prop="adminName">
                <el-input v-model="editForm.adminName" disabled></el-input>
            </el-form-item>
            <el-form-item label="企业安全管理员名称" prop="securityName">
                <el-input v-model="editForm.securityName" disabled></el-input>
            </el-form-item>
            <el-form-item label="企业安全管理员电话号码" prop="securityPhone">
                <el-input v-model="editForm.securityPhone"></el-input>
            </el-form-item>
            <el-form-item label="企业被罚信息" prop="punish" style="width: 100%;">
                <el-input v-model="editForm.punish"></el-input>
            </el-form-item>
            <el-form-item label="施救方法" prop="rescue" style="width: 100%;">
                <el-input v-model="editForm.rescue"></el-input>
            </el-form-item>
            <el-form-item label="交通违规及事故未处理" prop="illegal">
                <el-input v-model="editForm.illegal"></el-input>
            </el-form-item>
            <el-form-item label="营运线路起始" prop="startStation">
                <el-input v-model="editForm.startStation" disabled></el-input>
            </el-form-item>
            <el-form-item label="营运线路终止" prop="endStation">
                <el-input v-model="editForm.endStation" disabled></el-input>
            </el-form-item>
            <el-form-item label="上牌时间" prop="licenseTime">
              <el-date-picker style="width: 100%;" clearable v-model="editForm.licenseTime" type="date" value-format="yyyy-MM-dd" placeholder="上牌时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="车辆金额" prop="money">
                <el-input v-model="editForm.money"></el-input>
            </el-form-item>
            <el-form-item label="年折旧金额" prop="depreciationMoney">
                <el-input v-model="editForm.depreciationMoney"></el-input>
            </el-form-item>
            <el-form-item label="车辆批次" prop="batch">
                <el-input v-model="editForm.batch"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;">
                <el-button type="primary" @click="save" size="mini" :loading="loading2" style="margin-left: -40px;">确 定</el-button>
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
        getCarTypeOption: '/webwms/api/carType/getCarTypeOption',
        getLineOption: '/webwms/api/line/getLineOption',
        getData: '/webwms/api/vehicle/getList',
        getOneData: '/webwms/api/vehicle/getData',
        delData: '/webwms/api/vehicle/delete',
        saveData: '/webwms/api/vehicle/save'
      },
      carTypeOption: [],
      lineOption: [],
      form: {
        carTypeId: '',
        lineId: '',
        plateNo: '',
        ownPlateNo: '',
        limit: 50,
        page: 1
      },
      editForm: {
        id: 0,
        ownPlateNo: '',
        plateNo: '',
        dwmc: '诸暨是公共交通有限',
        fzjg: '绍兴市公安局交通警察支队',
        zdlx: '公交客运',
        hpzl: '大客',
        lsgx: '诸暨交通局',
        haveRecorder: '',
        syxz: '公交客运',
        sjzk: '',
        haveGps: '',
        tbdw: '',
        bxpzh: '',
        tbje: '',
        bxqsrq: '',
        bxzzrq: '',
        syr: '诸暨市公共交通有限公司',
        czsj: '',
        sfzmmc: '组织机构 代码证',
        sfzmhm: '',
        phone: '',
        ccdjrq: '',
        drAddress: '',
        trAddress: '',
        djrq: '',
        qzbfrq: '',
        carTypeId: '',
        clpp: '',
        color: '蓝/白',
        lineId: '',
        ownership: '诸暨市公共交通有限公司',
        engineType: '',
        chassisNumber: '',
        engineNumber: '',
        hdzk: '',
        hdzkl: '',
        zbzl: '',
        totalWeight: '',
        zhuangzwhwp: '',
        zhuzwhwp: '',
        gtjchgq: '',
        isAnchored: '',
        legalPersonName: '吴斌',
        adminPhone: '',
        legalPersonPhone: '',
        adminName: '吴斌',
        securityName: '骆坚',
        securityPhone: '',
        punish: '',
        rescue: '',
        illegal: '',
        startStation: '',
        endStation: '',
        licenseTime: '',
        money: '',
        depreciationMoney: '',
        batch: ''
      },
      rules: {
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
    getCarTypeOption () {
      this.$http.post(this.url.getCarTypeOption).then(
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
    carTypeChange (val) {
      for (let i = 0; i < this.carTypeOption.length; i++) {
        if (this.carTypeOption[i].id === val) {
          this.editForm.clpp = this.carTypeOption[i].parentName
          break
        }
      }
    },
    lineChange (val) {
      for (let i = 0; i < this.lineOption.length; i++) {
        if (this.lineOption[i].id === val) {
          this.editForm.startStation = this.lineOption[i].startStation
          this.editForm.endStation = this.lineOption[i].endStation
          break
        }
      }
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
                for (let i = 0; i < this.lineOption.length; i++) {
                  if (this.lineOption[i].id === res.data.lineId) {
                    obj.startStation = this.lineOption[i].startStation
                    obj.endStation = this.lineOption[i].endStation
                    break
                  }
                }
                for (let i = 0; i < this.carTypeOption.length; i++) {
                  if (this.carTypeOption[i].id === res.data.carTypeId) {
                    obj.clpp = this.carTypeOption[i].parentName
                    break
                  }
                }
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
      this.$confirm('此操作将删除该车, 是否继续?', '提示', {
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
        'A1': {t: 's', v: '车号'},
        'B1': {t: 's', v: '车牌号'},
        'C1': {t: 's', v: '线路'},
        'D1': {t: 's', v: '发动机类型'},
        'E1': {t: 's', v: '发动机号'},
        'F1': {t: 's', v: '车架号'},
        'G1': {t: 's', v: '车型'},
        '!cols': [{wpx: 70}, {wpx: 80}, {wpx: 80}, {wpx: 100}, {wpx: 100}, {wpx: 160}, {wpx: 120}]
      }
      var count = 2
      for (var i = 0; i < data.length; i++) {
        obj['A' + count] = {t: 's', v: data[i].ownPlateNo || ''}
        obj['B' + count] = {t: 's', v: data[i].plateNo || ''}
        obj['C' + count] = {t: 's', v: data[i].lineName || ''}
        obj['D' + count] = {t: 's', v: data[i].engineType || ''}
        obj['E' + count] = {t: 's', v: data[i].engineNumber || ''}
        obj['F' + count] = {t: 's', v: data[i].chassisNumber || ''}
        obj['G' + count] = {t: 'S', v: data[i].carTypeName || ''}
        count++
      }
      obj['!ref'] = 'A1:G' + count
      return obj
    },
    exportExcel () {
      this.$http.post(this.url.getData, {page: 1, limit: 20000}, {emulateJSON: true}).then(
        response => {
          var res = response.body
          if (res.success) {
            Export.downloadMater(this.format(res.data.list), '车辆基础信息')
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
    this.getLineOption()
    this.getCarTypeOption()
    window.addEventListener('resize', () => {
      this.getHeight()
    })
  }
}
</script>
<style lang="scss">
#vehicleManage {
    .el-dialog {
        margin-top: 8vh!important;
    }
    .editForm {
        overflow: hidden;
        .el-form-item {
            width: 25%;
            float: left;
            margin-bottom: 5px;
        }
        .el-form-item__label {
            height: 30px;
            font-size: 12px;
            line-height: inherit;
            padding: 9px 0;
            padding-right: 5px;
            box-sizing: border-box;
        }
    }
}
</style>
<style lang="scss" scoped>
#vehicleManage {
    height: 100%;
    box-sizing: border-box;
    padding:15px;
    padding-bottom: 0;
}
</style>
