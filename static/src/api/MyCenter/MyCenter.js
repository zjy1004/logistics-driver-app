import { Get } from '@/api/axios.config'

const MyCenterAjax = {
  queryUserInfo (params) {
    // 查询物流公司员工管理查看
    let result = Get('/crm/logisticsPersonnel/query/seeLogisticsPersonnel', params)
    return result
  }
}

export default MyCenterAjax
