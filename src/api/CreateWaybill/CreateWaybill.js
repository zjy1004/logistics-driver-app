import { Get, Post } from '@/api/axios.config'
const CreateWaybillAxios = {
  queryLogisticsAndStation (params) {
    // 开单查询发货站点级落地配
    let result = Get('/crm/agencyCreateWaybillController/query/selectlogisticsAndStation', params)
    return result
  },
  createWaybill (params) {
    // 经销商开单
    let result = Post('/waybill/appWaybilOperate/createTemporaryWaybill', params)
    return result
  },
  queryDetail (params) {
    // 查询运单详情
    let result = Get('/waybill/appWaybilOperate/toUpdateTemporaryWaybill', params)
    return result
  },
  updatedWaybill (params) {
    // 经销商开单修改
    let result = Post('/waybill/appWaybilOperate/updateTemporaryWaybill', params)
    return result
  },
  querySendInfo (params) {
    // 根据落地配物流公司id查询发货物流公司及站点id
    let result = Get('/crm/agencyCreateWaybillController/query/selectSendLogisticsAndStation', params)
    return result
  },
  newClient (params) {
    // 经销商开单
    let result = Post('/crm/agencyCreateWaybillController/insert/insertNewClient', params)
    return result
  }
}

export default CreateWaybillAxios
