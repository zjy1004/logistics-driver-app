import { PostFromData, Post } from '@/api/axios.config'
const WithdrawDepositAjax = {
  GetWithdrawData (params) {
    // 手机端-经销商app资金账户提现列表
    let result = Post('/waybill/dealerAppAccountWithdraw/queryDealerAccountWithdrawList', params)
    return result
  },
  withdrawMoney (params) {
    // 按运单批量提现
    let result = PostFromData('/finance/funds/withdraw/waybill', params)
    return result
  }
}

export default WithdrawDepositAjax
