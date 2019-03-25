import { Post } from '@/api/axios.config'

const ShiftAjax = {
  queryList (params) {
    // 完整版司机APP班次列表
    let result = Post('/crm/shift/run/query/shiftRunList', params)
    return result
  }
}

export default ShiftAjax
