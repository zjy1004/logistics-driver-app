import { Get, PostFromData } from '@/api/axios.config'

const ConfirmDepartAjax = {
  queryWaybillList (params) {
    // 查询司机0待装车或者1待发货(默认查待装车传0，已装车传1)
    let result = PostFromData('/waybill/api/waybillApp/queryDriverLoadOrDeliveryWaybill', params)
    return result
  },
  confirmTruck (params) {
    // 确认装车,装车1待发货
    let result = PostFromData('/waybill/waybillOperateController/waybillLoadOrUnLoadBatch', params)
    return result
  },
  departure (params) {
    // 发车
    let result = Get('/crm/shift/run/departure', params)
    return result
  },
  queryOtherShift (params) {
    // 查询线路当天是true否false有其它未运行班次
    let result = PostFromData('/crm/shift/run/queryLineNotRunShift', params)
    return result
  }
}

export default ConfirmDepartAjax
