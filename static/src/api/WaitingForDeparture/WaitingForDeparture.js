import { Post } from '@/api/axios.config'

const WaitingForDepartureAjax = {
  queryLineRunShiftList (params) {
    // 查询司机当天未发车班次
    let result = Post('/crm/shift/run/queryLineRunShiftList', params)
    return result
  }
}

export default WaitingForDepartureAjax
