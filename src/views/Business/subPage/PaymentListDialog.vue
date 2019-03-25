<template>
<div class="PaymentList">
  <div v-transfer-dom>
    <x-dialog v-model="dialogShow" class="dialog-demo">
      <div class="img-box">
        <div @click="closeDialog" style="text-align: right;padding-right: 15px;padding-top: 15px;">
          <span style="font-size: 16px; color: #4D4D4D;">关闭</span>
        </div>
        <div class="main_scroll">
          <div class="box_left" :key="index" v-for="(item,index) in dataListArr">
            <h3>{{item.receiveClientName}}</h3>
            <p>
              <span class="left_key">单数:</span>
              <span class="left_val">{{item.bill}}单</span>
              <span>（{{item.piece}}件）</span>
            </p>
            <p style="display: flex;">
              <span style="display: block;height: 19px;" class="left_key">应收:</span>
              <span style="display: block;box-sizing: borde-box;">
                <span class="left_val">￥{{item.totalMon}}</span>
                <span>（运费{{item.freightMon}}&nbsp;代收{{item.collectMon}}）</span>
              </span>
            </p>
          </div>
        </div>
        <div class="box_left" style="padding-top: 20px !important;">
          <p>
            <span class="left_key">合计单数：</span>
            <span class="left_val">{{countTotalList()}}单</span>
          </p>
          <p>
            <span class="left_key">应收总金额：</span>
            <span class="left_val">￥{{countTotalReceivable()}}</span>
          </p>
        </div>
        <p class="pay_btn" @click="underLinePay">司机收款</p>
      </div>
    </x-dialog>
  </div>
</div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import paymentAjax from '@/api/Payment/Payment'

export default {
  name: 'PaymentListDialog',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataListArr: [],
      totalReceivable: '', // 应收总金额
      dialogShow: false,
      underLineParam: {
        waybillIdList: []
      }
    }
  },
  created () {
    this.dialogShow = this.show
    this.editData()
  },
  methods: {
    editData () {
      this.dataListArr = this.dataList.map(item => {
        // if (item.freightMon > 0) {
        //   item.settlementMethodName = '运费'
        // }
        // if (item.settlementMethod === 1) {
        //   item.freightMon = '现结'
        // }
        // if (item.settlementMethod === 2) {
        //   item.freightMon = '月结'
        // }
        // if (item.settlementMethod === 3) {
        //   item.freightMon = '包月'
        // }
        return item
      })
    },
    countTotalList () { // 合计单数
      return this.dataList.reduce((pre, next, index, array) => {
        return pre + Number(next.bill)
      }, 0)
    },
    countTotalReceivable () { // 应收总金额
      return (this.dataList.reduce((pre, next, index, array) => {
        return pre + Number(next.totalMon)
      }, 0)).toFixed(1)
    },
    concatArr () {
      this.underLineParam.waybillIdList = this.dataList.reduce((pre, next, index, array) => {
        return pre.concat(next.wayBillIdList)
      }, [])
    },
    closeDialog () {
      this.dialogShow = false
      this.$emit('cancel-pay', false)
    },
    underLinePay () {
      this.concatArr()
      this.waybillOffLineReceivable(this.underLineParam)
    },
    waybillOffLineReceivable (val) { // 司机收款接口
      paymentAjax.waybillOffLineReceivable(val).then(res => {
        if (res.code === 200) {
          this.dialogShow = false
          this.$emit('pay-success', true)
        }
      })
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';

.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
    .img-box {
    overflow: hidden;
    //height: 800px;
    min-height: 600px;
      .main_scroll {
        //height: 420px;
        max-height: 420px;
        overflow: auto;
        overflow-y: scroll;
      }
      .main_scroll::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      .main_scroll::-webkit-scrollbar:vertical {
        width: 12px;
      }
      .main_scroll::-webkit-scrollbar:horizontal {
        height: 12px;
      }
      .main_scroll::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border: 2px solid #ffffff;
      }
      .main_scroll::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #ffffff;
      }
      .box_left {
        text-align: left;
        padding-top: 40px;
        margin-left: 10%;
        width: 80%;
        font-size: 28px;
        color: #585858;
        span {
          font-size: 28px;
        }
        .left_key {
          font-size: 28px;
          color: #585858;
        }
        .left_val {
          font-size: 30px;
          color: #FF5400;
        }
        h3 {
          height:37px;
          font-size:36px;
          font-weight:bold;
          color:rgba(77,77,77,1);
          line-height:37px;
        }
        p {
          margin-top: 34px;
        }
      }
      .pay_btn {
        display: block;
        width: 80%;
        line-height: 2.5;
        text-align: center;
        color: #ffffff;
        margin: 35px auto;
        font-size: 28px;
        border-radius: 5px;
        background: #4D7BFE
      }
    }
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
</style>

<style lang="less">
.weui-dialog {
  max-width: 86% !important;
  text-align: left !important;
  width: 86% !important;
  padding: inherit;
}
</style>
