/*
 * @Description:
 * @Author: lc
 * @Date: 2019-11-21 10:59:32
 * @LastEditTime: 2020-06-04 09:40:49
 * @LastEditors: lc
 */
export default {
  menu: {
    '诸暨仓储管理系统': {
      urls: [
        {
          name: '基础信息管理',
          url: '/baseData',
          icon: '&#xe68d;',
          outFuncs: [
            {
              name: '线路管理',
              url: '/lineManage',
              icon: '&#xe603;'
            }, {
              name: '车辆管理',
              url: '/vehicleManage',
              icon: '&#xe605;'
            }, {
              name: '车型管理',
              url: '/cartypeManage',
              icon: '&#xe699;'
            }, {
              name: '配件管理',
              url: '/accessoriesManage',
              icon: '&#xe614;'
            }, {
              name: '维修工管理',
              url: '/maintenanceWorkerManage',
              icon: '&#xe80d;'
            }, {
              name: '加油点管理',
              url: '/gasManage',
              icon: '&#xe604;'
            }, {
              name: '供应商管理',
              url: '/supplierManage',
              icon: '&#xe632;'
            }
          ]
        }, {
          name: '材料入库管理',
          url: '/inboundOrder',
          icon: '&#xe612;'
        }, {
          name: '车辆维修管理',
          url: '/outboundOrder',
          icon: '&#xe613;'
        }, {
          name: '信息统计',
          icon: '&#xe660;',
          url: '/information',
          outFuncs: [
            {
              name: '库存统计',
              url: '/inventoryStatistics',
              icon: '&#xe620;'
            }, {
              name: '配件购买统计',
              url: '/accessoriesPurchaseStatistics',
              icon: '&#xe63b;'
            }, {
              name: '车辆保养统计',
              url: '/vehicleMaintenanceStatistics',
              icon: '&#xe60a;'
            }, {
              name: '车辆维修统计',
              url: '/vehicleRepairStatistics',
              icon: '&#xe624;'
            }, {
              name: '年、月营收统计',
              url: '/revenueStatistics',
              icon: '&#xe6b2;'
            }, {
              name: '车辆维修记录',
              url: '/vehicleMaintenanceRecords',
              icon: '&#xe6b2;'
            }
          ]
        }, {
          name: '车辆现金收入录入',
          url: '/entryVehicleCashIncome',
          icon: '&#xe629;'
        }, {
          name: '车辆燃油消耗登记',
          url: '/vehicleFuelConsumptionRegistration',
          icon: '&#xe618;'
        }
      ]
    }
  }
}
