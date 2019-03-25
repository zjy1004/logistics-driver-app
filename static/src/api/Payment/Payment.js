import { PostFromData } from '@/api/axios.config'

const PaymentAjax = {
  payment (params) {
    // 手机端运单管理数据全部运单查询
    let result = PostFromData('/finance/pay/paychannel/payment', params)
    return result
  },
  waybillOffLineReceivable (params) {
    // 线下收款接口
    let result = PostFromData('/waybill/waybillOffLineReceivable', params)
    return result
  },
  resultPayInfo (params) {
    // 支付结果通知接口
    let result = PostFromData('/finance/pay/orderQuery', params)
    return result
  }
}

export default PaymentAjax
