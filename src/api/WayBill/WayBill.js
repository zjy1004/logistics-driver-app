import { PostFromData, Get } from '@/api/axios.config'
const WayBillAjax = {
  WaitDeliver (params) {
    // 手机端-待妥投运单
    let result = Get('/waybill/api/waybillApp/queryDriverWaitDeliverWaybill', params)
    return result
  },
  WaitHandInMoney (params) {
    // 手机端-待交款运单
    let result = Get('/waybill/api/waybillApp/queryDriverWaitHandInMoneyWaybill', params)
    return result
  },
  WaitReceivables (params) {
    // 手机端-待收款运单
    let result = Get('/waybill/api/waybillApp/queryDriverWaitReceivableWaybill', params)
    return result
  },
  Transport (params) {
    // 手机端-运输中运单
    let result = Get('/waybill/api/waybillApp/queryTransportWaybill', params)
    return result
  },
  SignFor (params) {
    // 手机端-运单签收
    let result = PostFromData('/waybill/signing', params)
    return result
  },
  Reject (params) {
    // 手机端-运单拒收
    let result = PostFromData('/waybill/reject', params)
    return result
  }
}

export default WayBillAjax
