import { PostFromData, Post, Get } from '@/api/axios.config'
const CommonAxios = {
  WalletBankAccount (params) {
    // 查询虚拟账户信息
    let result = Post('/finance/funds/walletBankAccount/info', params)
    return result
  },
  QueryBankInfo (params) {
    // 根据当前登录用户的默认银行卡数据
    let result = Get('/finance/api/finaBankInfo/selectBankInfoByFundAccountId', params)
    return result
  },
  FundAccountUnBindBankCard (params) {
    // 解绑银行卡接口
    let result = PostFromData('/finance/api/finaBankInfo/fundAccountUnBindBankCard', params)
    return result
  },
  QueryProtocolVoList (params) {
    // 查询所有协议
    let result = Get('/crm/api/crmProtocol/queryProtocolVoList', params)
    return result
  },
  QueryRegistrationAgreement (params) {
    // 根据协议类型查询协议信息1中驰车福物流云平台网站注册服务协议，2物流云“驮付宝”货款收取见证系统使用规则
    let result = PostFromData('/crm/api/crmProtocol/queryProtocolVoByProtocolType', params)
    return result
  },
  QueryCardStatus (params) {
    // 根据当前登录用户的默认银行卡数据
    let result = Get('/finance/funds/queryCardStatus', params)
    return result
  },
  QueryLimitedPromotionTime (params) {
    // 查询客户优惠时间区间
    let result = PostFromData('/crm/crmLimitedPromotionController/clientLimitedPromotionTime', params)
    return result
  }
}

export default CommonAxios
