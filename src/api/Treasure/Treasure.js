import { Post, Get } from '@/api/axios.config'

const TreasureAjax = {
  QueryDealerAppWithdrawCashList (params) {
    // 经销商app提现记录列表查询
    let result = Post('/finance/api/dealerAppFinanceManage/queryDealerAppWithdrawCashList', params)
    return result
  },
  QueryAppFlowCollectionGoodsIncomeList (params) {
    // 经销商App虚拟账户代收货款列表查询
    let result = Post('/waybill/client/queryFlowCollectionGoodsIncomeList', params)
    return result
  },
  QueryAppWithdrawDetail (params) {
    // 查询app提现明细接口
    let result = Get('/finance/api/dealerAppFinanceManage/queryAppWithdrawDetail', params)
    return result
  },
  DealCanWithdraw (params) {
    // 处理可提现接口
    let result = Get('/finance/api/withdrawRestController/dealCanWithdraw', params)
    return result
  },
  QueryNewWalletStatus (params) {
    // 查询用户绑卡状态接口
    let result = Get('/finance/funds/queryNewWalletStatus', params)
    return result
  }
}

export default TreasureAjax
