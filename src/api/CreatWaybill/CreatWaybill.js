import {Get} from '@/api/axios.config'

const CreatWaybillAjax = {
  querySelectAgencyClientList (params) {
    // 经销商开单App-查询经销商下属客户基本信息
    let result = Get('/crm/agencyCreateWaybillController/query/selectAgencyClientList', params)
    return result
  }
}

export default CreatWaybillAjax
