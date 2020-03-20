import { Get, Post } from '@/api/axios.config'
const PayRegisterAjax = {
  queryArea (params) {
    // 获取区域
    let result = Get('/crm/AreaCode/queryGbAreaAll', params)
    return result
  },
  register (params) {
    // 获取区域
    let result = Post('/finance/register/fundAccountRegister', params)
    return result
  }
}

export default PayRegisterAjax
