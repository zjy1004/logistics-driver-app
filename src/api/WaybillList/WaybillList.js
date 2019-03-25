import { Post } from '@/api/axios.config'

const WaybillListAjax = {
  QueryAppAllWaybillList (params) {
    // 手机端运单管理数据全部运单查询
    let result = Post('/waybill/api/waybillApp/queryAppAllWaybillPackage', params)
    return result
  },
  QueryDriverAllWaybill (params) {
    // 手机端运单管理运单数据查询
    let result = Post('/waybill/api/waybillApp/queryDriverAllWaybill', params)
    return result
  }
}

export default WaybillListAjax
