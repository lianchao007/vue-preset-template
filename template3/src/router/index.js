import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

import AccessoriesManage from '../views/AccessoriesManage.vue'
import AccessoriesPurchaseStatistics from '../views/AccessoriesPurchaseStatistics.vue'
import CartypeManage from '../views/CartypeManage.vue'
import InboundOrder from '../views/InboundOrder.vue'
import InventoryStatistics from '../views/InventoryStatistics.vue'
import LineManage from '../views/LineManage.vue'
import MaintenanceWorkerManage from '../views/MaintenanceWorkerManage.vue'
import OutboundOrder from '../views/OutboundOrder.vue'
import SupplierManage from '../views/SupplierManage.vue'
import VehicleMaintenanceStatistics from '../views/VehicleMaintenanceStatistics.vue'
import VehicleManage from '../views/VehicleManage.vue'
import VehicleRepairStatistics from '../views/VehicleRepairStatistics.vue'
import GasManage from '../views/GasManage.vue'
import RevenueStatistics from '../views/RevenueStatistics.vue'
import EntryVehicleCashIncome from '../views/EntryVehicleCashIncome.vue'
import VehicleFuelConsumptionRegistration from '../views/VehicleFuelConsumptionRegistration.vue'
import VehicleMaintenanceRecords from '../views/VehicleMaintenanceRecords.vue'

Vue.use(Router)

let vm = new Vue()
function GetQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let s = window.location.hash.replace(/(.*)\?/, '')
  let r = s.match(reg)
  if (r != null) return unescape(r[2]); return null
}
export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '诸暨仓储管理系统',
      component: Home,
      beforeEnter  (to, from, next) {
        next()
        // let fsId = GetQueryString('fsId') || window.localStorage.fsId
        // let ticket = GetQueryString('ticket') || window.localStorage.ticket
        // window.localStorage.ticket = ticket
        // window.localStorage.fsId = fsId
        // vm.$http.post('/webwms/api/welcome/loginNew', {fsId: fsId, ticket: ticket}, { emulateJSON: true }).then(response => {
        //   // 登录成功后获取该用户的线路
        //   let res = response.body
        //   Vue.prototype.$loading = false
        //   if (res.success) {
        //     console.log(res.data)
        //     Vue.prototype.$user = res.data
        //     next()
        //   } else {
        //     vm.$message.error(res.msg || '请求失败')
        //     next()
        //   }
        // },
        // response => {
        //   vm.$message.error('请求失败')
        // })
      },
      children: [
        {
          path: '/',
          alias: 'lineManage',
          name: '线路管理',
          component: LineManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'vehicleManage',
          name: '车辆管理',
          component: VehicleManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'cartypeManage',
          name: '车型管理',
          component: CartypeManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'maintenanceWorkerManage',
          name: '维修工管理',
          component: MaintenanceWorkerManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'supplierManage',
          name: '供应商管理',
          component: SupplierManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'gasManage',
          name: '加油点管理',
          component: GasManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'accessoriesManage',
          name: '配件管理',
          component: AccessoriesManage,
          props: { pName: '基础数据管理' }
        }, {
          path: 'inboundOrder',
          name: '材料入库管理',
          component: InboundOrder
        }, {
          path: 'outboundOrder',
          name: '车辆维修管理',
          component: OutboundOrder
        }, {
          path: 'accessoriesPurchaseStatistics',
          name: '配件购买统计',
          component: AccessoriesPurchaseStatistics,
          props: { pName: '信息统计' }
        }, {
          path: 'inventoryStatistics',
          name: '库存统计',
          component: InventoryStatistics,
          props: { pName: '信息统计' }
        }, {
          path: 'vehicleMaintenanceStatistics',
          name: '车辆保养统计',
          component: VehicleMaintenanceStatistics,
          props: { pName: '信息统计' }
        }, {
          path: 'vehicleRepairStatistics',
          name: '车辆维修统计',
          component: VehicleRepairStatistics,
          props: { pName: '信息统计' }
        }, {
          path: 'revenueStatistics',
          name: '年、月营收统计',
          component: RevenueStatistics,
          props: { pName: '信息统计' }
        }, {
          path: 'entryVehicleCashIncome',
          name: '车辆现金收入录入',
          component: EntryVehicleCashIncome
        }, {
          path: 'vehicleFuelConsumptionRegistration',
          name: '车辆燃油消耗登记',
          component: VehicleFuelConsumptionRegistration
        }, {
          path: 'vehicleMaintenanceRecords',
          name: '车辆维修记录',
          component: VehicleMaintenanceRecords
        }
      ]
    }
  ]
})
