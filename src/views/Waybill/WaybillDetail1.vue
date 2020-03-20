
<template>
  <div class="waybillDetail">
    <x-header
      title="运单详情"
      :left-options="{backText: ''}"
    />
    <!-- <div class="line"></div> -->
    <div class="cells-wrap">
      <!-- cell 一 -->
      <div class="cells">
        <div class="cell">
          <div class="left">收货方</div>
          <div class="right">{{waybillDetailObj.receiveClientName}}</div>
        </div>
        <div class="cell">
          <div class="left">运输状态</div>
          <div class="right">{{waybillDetailObj.waybillStatus}}</div>
        </div>
        <div class="cell">
          <div class="left">提现状态</div>
          <div class="right">{{waybillDetailObj.withdrawStatus}}&emsp;
            <span v-if="waybillDetailObj.withdrawStatus === '已提现'" @click="handleToDetail()" class="r-detail">详情</span>
            <span v-if="waybillDetailObj.withdrawStatus != '已提现'"  class="r-detailNO">详情</span>
          </div>
        </div>
      </div>
      <!-- cell 二 -->
      <div class="cells">
        <div class="cell">
          <div class="left">代收货款</div>
          <div class="right">￥{{waybillDetailObj.receivableGoods}}</div>
        </div>
        <div class="cell">
          <div class="left">手续费</div>
          <div class="right">￥{{waybillDetailObj.serviceCharges}}</div>
        </div>
        <div class="cell">
          <div class="left">实收货款</div>
          <div class="right">￥{{waybillDetailObj.actualPaymentGoods}}</div>
        </div>
        <div class="cell">
          <div class="left">运费金额</div>
          <div class="right">￥{{waybillDetailObj.freight}}</div>
        </div>
        <div class="cell">
          <div class="left">运费付款方</div>
          <div class="right">{{waybillDetailObj.freightName}}</div>
        </div>
      </div>
      <!-- cell 三 -->
      <div class="cells">
        <div class="cell" :key="index" v-for="(item, index) in waybillDetailObj.waybillOperateVoList">
          <div class="left">{{item.operateTypeName}}</div>
          <div class="right">{{item.operateTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import WaybillAjax from '@/api/WayBill/WayBill'
export default {
  name: 'More',
  data () {
    return {
      waybillDetailObj: {
      },
      waybillParam: {
        waybillId: ''
      }
    }
  },
  components: {
    XHeader
  },
  created () {
    this.waybillParam.waybillId = this.$route.query.id
    console.log(this.waybillId)
    this.getWaybillDetail()
  },
  methods: {
    // 提现详情
    handleToDetail () {
      let id = this.waybillParam.waybillId
      this.$router.push({name: 'CashWithdrawalDetail', query: {waybillId: id}})
    },
    // 获取所有运单
    getWaybillDetail () {
      WaybillAjax.WaybillDetail(this.waybillParam).then(res => {
        if (res.code === 200) {
          this.waybillDetailObj = res.data
          // 代收
          this.waybillDetailObj.receivableGoods = Number(res.data.receivableGoods).toFixed(2)
          // 实收
          this.waybillDetailObj.actualPaymentGoods = Number(res.data.actualPaymentGoods).toFixed(2)
          // 运费
          this.waybillDetailObj.freight = Number(res.data.freight).toFixed(2)
          // 手续费
          this.waybillDetailObj.serviceCharges = (Number(res.data.receivableGoods) - Number(res.data.actualPaymentGoods)).toFixed(2)
          // 提现状态
          if (res.data.withdrawStatus === 4) {
            this.waybillDetailObj.withdrawStatus = '已提现'
          } else {
            this.waybillDetailObj.withdrawStatus = ''
          }
          // 付款方
          if (res.data.freightPayer === 1) {
            this.waybillDetailObj.freightPayer = '经销商'
          }
          if (res.data.freightPayer === 2) {
            this.waybillDetailObj.freightPayer = '修理厂'
          }
          // 运单状态
          switch (res.data.waybillStatus) {
            case 1:
              this.waybillDetailObj.waybillStatus = '已装车'
              break
            case 2:
              this.waybillDetailObj.waybillStatus = '运输中'
              break
            case 3:
              this.waybillDetailObj.waybillStatus = '已签收'
              break
            case 4:
              this.waybillDetailObj.waybillStatus = '已拒签'
              break
            case 5:
              this.waybillDetailObj.waybillStatus = '已完成'
              break
            case 6:
              this.waybillDetailObj.waybillStatus = '已取消'
              break
            case 9:
              this.waybillDetailObj.waybillStatus = '待入库'
              break
            case 10:
              this.waybillDetailObj.waybillStatus = '待退货'
              break
            case 11:
              this.waybillDetailObj.waybillStatus = '待装车'
              break
            default:
              break
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.waybillDetail{
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background: #fff!important;
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
  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }
  .cells-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    .cells {
      width: 90%;
      height: auto;
      margin: 10px auto;
      border-top: 2px solid #ccc;
      .cell {
        height: 70px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          color: #2C2E33;
          font-size: 30px;
        }
        .right {
          color: #000;
          font-size: 30px;
        }
        .r-detail {
          color: #3573EE;
          font-size: 30px;
        }
        .r-detailNO {
          color: #999;
          font-size: 30px;
        }
      }
    }
  }
}
</style>
