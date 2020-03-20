
<template>
  <div class="CashWithdrawalDetail">
    <x-header
      title="提现详情"
      :left-options="{backText: ''}"
    />
    <div class="main-info">
      <group>
        <cell title="处理状态" :value="CashWithdrawalDetail.dealStatus"></cell>
      </group>
      <group>
        <cell title="提现金额">{{CashWithdrawalDetail.withdrawCashAmount !== null ? `￥${CashWithdrawalDetail.withdrawCashAmount}` : ''}}</cell>
        <cell title="手续费">{{CashWithdrawalDetail.formalityFee !== null ? `￥${CashWithdrawalDetail.formalityFee}` : ''}}</cell>
        <cell title="实际到账金额">{{CashWithdrawalDetail.actualArrivalAmount !== null ? `￥${CashWithdrawalDetail.actualArrivalAmount}` : ''}}</cell>
      </group>
      <group>
        <cell title="申请提现时间" :value="CashWithdrawalDetail.withdrawCashTime"></cell>
        <cell title="银行处理时间" :value="CashWithdrawalDetail.bankPaymentTime"></cell>
      </group>
      <group style="overflow: auto;">
        <cell :title="index === 0 ?'提现运单号': ''" v-for="(item,index) in CashWithdrawalDetail.withdrawDetailInventoryList" :key="index"><a class="hrefClass" @click="goToWaybillDetail(item.waybillId)">{{item.waybillNumber}}</a></cell>
      </group>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell } from 'vux'
import TreasureAjax from '@/api/Treasure/Treasure'
export default {
  name: 'CashWithdrawalDetail',
  data () {
    return {
      CashWithdrawalDetail: {
        dealStatus: '',
        withdrawCashAmount: '',
        formalityFee: '',
        actualArrivalAmount: '',
        withdrawCashTime: '',
        bankPaymentTime: ''
      }
    }
  },
  components: {
    XHeader,
    Cell,
    Group
  },
  created () {
    this.queryDetail()
  },
  methods: {
    goToWaybillDetail (val) {
      this.$router.push({name: 'WaybillDetail', query: {id: val}})
    },
    queryDetail () {
      let val = {}
      if (this.$route.query.hasOwnProperty('transactionId')) {
        val.transactionId = this.$route.query.transactionId
      } else {
        val.waybillId = this.$route.query.waybillId
      }
      TreasureAjax.QueryAppWithdrawDetail(val).then((response) => {
        if (response.code === 200) {
          if (response.data.dealStatus === 2) {
            response.data.dealStatus = '成功'
          }
          if (response.data.dealStatus === 3) {
            response.data.dealStatus = '失败'
          }
          if (response.data.dealStatus === 1) {
            response.data.dealStatus = '处理中'
          }
          this.CashWithdrawalDetail = response.data
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.CashWithdrawalDetail{
  .main-info {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  display: flex;
  flex: 1;
  background: #F3F4F5;
  flex-direction: column;
  .vux-header{
    height: 90px;
    display: flex;
    align-items: center;
    .vux-header-left{
      top: 20px;
      .left-arrow{
        margin-left: 20px;
      }
      .left-arrow:before{
        top: 18px;
        width: 20px;
        height: 20px;
        border-color: #1C1C1C;
      }
    }
    .vux-header-title{
      margin: 0 auto;
      span{
        .mixin-sc(36px;#1A1A1A);
      }
    }
  }
  .weui-cell{
    height: 108px;
    padding: 0 40px;
    label{
      .mixin-sc(32px;#676767);
    }
    .weui-cell__ft{
      .mixin-sc(30px;#000);
    }
    .hrefClass {
      .mixin-sc(30px;blue);
      text-decoration: underline;

    }
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.CashWithdrawalDetail{
  height: 100%;
  width: 100%;
}
</style>
