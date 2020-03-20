import { Post, Get, PostFromData } from '@/api/axios.config'

const RegisterLogisticsPayAndBindingCardAjax = {
  FundAccountRegister (params) {
    // 资金账户注册
    let result = Post('/finance/register/fundAccountRegister', params)
    return result
  },
  SelectLzByAreaParentCode (params) {
    // 获取量子注册地址省市级联列表
    let result = Get('/crm/AreaCode/selectLzByAreaParentCode', params)
    return result
  },
  QueryFundAccountRegisterStatus (params) {
    // 查询资金账户开通状态  0开通 1 未开通
    let result = Get('/finance/register/queryFundAccountRegisterStatus', params)
    return result
  },
  QueryLzBandBankCardProvince (params) {
    // 获取量子绑卡省份列表
    let result = Get('/crm/AreaCode/queryLzBandBankCardProvince', params)
    return result
  },
  QueryLzBandBankCardArea (params) {
    // 获取量子绑卡省份以下列表
    let result = Get('/crm/AreaCode/queryLzBandBankCardArea', params)
    return result
  },
  QueryCardInfo (params) {
    // 获取量子绑卡根据省份或区域编码获取开户行和银联号
    let result = Get('/finance/api/finaBankInfo/selectByCityCode', params)
    return result
  },
  QueryBankInfo (params) {
    // 获取量子绑卡查询银行名称和超级网银号隐藏字段
    let result = Get('/finance/api/finaBankInfo/selectLikeByBankName', params)
    return result
  },
  QueryLzBandBankCardAreaAndUnionPay (params) {
    // 获取量子绑卡省份以下列表和银联号
    let result = PostFromData('/crm/AreaCode/queryLzBandBankCardAreaAndUnionPay', params)
    return result
  },
  QueryFinaFundsAccountVo (params) {
    // 资金账户绑卡查询账户信息
    let result = Get('/finance/register/queryFinaFundsAccountVo', params)
    return result
  },
  FundAccountBindBankCard (params) {
    // 资金账户绑卡
    let result = Post('/finance/api/finaBankInfo/fundAccountBindBankCard', params)
    return result
  },
  FundAccountResendMessageCode (params) {
    // 绑卡四要素鉴权重发接口
    let result = Get('/finance/api/finaBankInfo/fundAccountResendMessageCode', params)
    return result
  },
  FundAccountAccountAuth (params) {
    // 绑卡四要素鉴权重发接口
    let result = Post('/finance/api/finaBankInfo/fundAccountAccountAuth', params)
    return result
  }
}

export default RegisterLogisticsPayAndBindingCardAjax
