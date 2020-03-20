<template>
  <div class="payment">
    <div v-transfer-dom>
      <x-dialog v-model="dialogShow1" class="dialog-demo">
        <div class="img-box">
          <div @click="closeDialog" style="text-align: right;padding-right: 15px;padding-top: 15px;">
            <span style="font-size: 16px; color: #4D4D4D;">关闭</span>
          </div>
          <div class="box_left">
            <h3>{{dataListArr[0].receiveClientName}}</h3>
            <p>
              <span class="left_key">单数:</span>
              <span class="left_val">{{dataListArr[0].bill}}单</span>
              <span>（{{dataListArr[0].piece}}件）</span>
            </p>
            <p style="display: flex;">
              <span style="display: block;width: 15%;" class="left_key">应收:</span>
              <span style="display: block;width: 85%;box-sizing: borde-box;">
                <span class="left_val">{{dataListArr[0].totalMon}}</span>
                <span>(运费{{dataListArr[0].freightMon}}&nbsp;代收{{dataListArr[0].collectMon}})</span>
              </span>
            </p>
            <div class="tab">
              <button-tab v-model="demo01">
                <button-tab-item selected @on-item-click="consoleIndex('0')">{{'微信'}}</button-tab-item>
                <button-tab-item @on-item-click="consoleIndex('1')">{{ '支付宝'}}</button-tab-item>
              </button-tab>
              <div class="tabContent" v-if="weChart">
                <qrcode :value="weChartUrl"></qrcode>
              </div>
              <div class="tabContent" v-if="aliPay">
                <qrcode :value="alPayUrl"></qrcode>
              </div>
              <span class="">请在</span><span style="color: #FF5400;">
                <count-down
                  :timeProps = 15
                />
              </span><span>内识别图中二维码</span>
            </div>
            <p class="pay_btn" @click="underLinePay">司机收款</p>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, ButtonTab, ButtonTabItem, Qrcode, TransferDomDirective as TransferDom } from 'vux'
import CountDown from '@/components/CountDown/CountDown'
import paymentAjax from '@/api/Payment/Payment'

export default {
  name: 'PaymentDialog',
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
      // settlementMethodName: '',
      timeOut1: 0,
      timeOut2: 0,
      dataListArr: [],
      weChartUrl: '',
      alPayUrl: '',
      dialogShow1: false,
      demo01: 0,
      weChart: true,
      aliPay: false,
      queryQccodeObj: {
        payChannel: '100703',
        orderIds: []
      },
      underLineParam: {
        waybillIdList: []
      },
      timer1: null,
      timer2: null
    }
  },
  created () {
    this.editData()
    this.dialogShow1 = this.show
    this.queryQccodeObj.orderIds = this.dataList[0].wayBillIdList
    this.queryQccode(this.queryQccodeObj)
    // this.initWebSocket()
  },
  directives: {
    TransferDom
  },
  methods: {
    editData () {
      this.dataListArr = this.dataList.map(item => {
        // if (item.freightMon > 0) {
        //   this.settlementMethodName = '运费'
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
    closeDialog () {
      window.clearInterval(this.timer1)
      window.clearInterval(this.timer2)
      this.dialogShow1 = false
      this.$emit('cancel-pay', false)
    },
    consoleIndex (val) {
      if (val === '1') {
        this.weChart = false
        this.aliPay = true
        this.queryQccodeObj.payChannel = '100705'
        this.queryQccode(this.queryQccodeObj)
        // this.initWebSocket()
        window.clearInterval(this.timer1)
      }
      if (val === '0') {
        this.aliPay = false
        this.weChart = true
        this.queryQccodeObj.payChannel = '100703'
        this.queryQccode(this.queryQccodeObj)
        // this.initWebSocket()
        window.clearInterval(this.timer2)
      }
    },
    underLinePay () {
      this.underLineParam.waybillIdList = this.dataList[0].wayBillIdList
      this.waybillOffLineReceivable(this.underLineParam)
      window.clearInterval(this.timer1)
      window.clearInterval(this.timer2)
    },
    queryQccode (val) { // 二维码查询
      paymentAjax.payment(val).then(res => {
        if (res.code === 200) {
          if (res.data.paymentType === 3) {
            if (res.data.pcUrl === null) {
              this.weChartUrl = ''
            } else {
              this.weChartUrl = res.data.pcUrl
            }
            this.timer1 = window.setInterval(() => {
              this.timeOut1++
              if (this.timeOut1 >= 15 * 30) {
                window.clearInterval(this.timer1)
                this.timeOut1 = 0
              }
              this.paymentNotice({merchantNo: res.data.merchantNo})
            }, 3000)
          }
          if (res.data.paymentType === 2) {
            this.alPayUrl = res.data.pcUrl
            this.timer2 = window.setInterval(() => {
              this.timeOut2++
              if (this.timeOut2 >= 15 * 30) {
                window.clearInterval(this.timer2)
                this.timeOut2 = 0
              }
              this.paymentNotice({merchantNo: res.data.merchantNo})
            }, 3000)
          }
        }
      })
    },
    waybillOffLineReceivable (val) { // 司机收款接口
      paymentAjax.waybillOffLineReceivable(val).then(res => {
        if (res.code === 200) {
          this.dialogShow1 = false
          this.$emit('pay-success', true)
        }
      })
    },
    paymentNotice (val) { // 支付通知
      paymentAjax.resultPayInfo(val).then(res => {
        if (res.code === 200) {
          if (res.data === 2) {
            window.clearInterval(this.timer1)
            window.clearInterval(this.timer2)
            this.dialogShow1 = false
            this.$emit('pay-success', true)
          }
        }
      })
    },
    initWebSocket () { // 初始化weosocket
      let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      // debugger
      console.log(process.env.API_BASE_URL)
      let arr = process.env.API_BASE_URL.split(':')
      const wsuri = `ws:${arr[1]}/finance/websocket/${userInfoObj.userId}`
      // const wsuri = `ws://172.16.3.53:8083/websocket/${userInfoObj.userId}`
      this.websocket = new WebSocket(wsuri)
      this.websocket.onopen = this.websocketonopen
      this.websocket.onerror = this.websocketonerror
      this.websocket.onmessage = this.websocketonmessage
      this.websocket.onclose = this.websocketclose
    },
    websocketonmessage (e) {
      console.log(e)
      if (e.data) {
        console.log(e.data)
        let data = JSON.parse(e.data)
        console.log(data)
        if (data.code === 200) {
          this.dialogShow1 = false
          this.$emit('pay-success', true)
        }
      }
    },
    websocketclose (e) {
      this.websocket = null
    }
  },
  components: {
    XDialog,
    ButtonTab,
    ButtonTabItem,
    Qrcode,
    CountDown
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';

.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    overflow: hidden;
    height: 930px;
    .box_left {
      text-align: left;
      padding-top: 48px;
      margin-left: 10%;
      width: 80%;
      height: 100%;
      font-size: 28px;
      span {
        font-size: 28px;
      }
      color: #585858;
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
      .tab {
        text-align: center;
        margin-top:  70px;
        .tabContent {
          width: 346px;
          height: 306px;
          //border: 1px solid #666;
          margin: 30px auto;
        }
      }
      .pay_btn {
        display: block;
        width: 100%;
        line-height: 2.5;
        text-align: center;
        color: #ffffff;
        font-size: 28px;
        border-radius: 5px;
        background: #4D7BFE
      }
    }
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
<style lang="less">
.weui-dialog {
  max-width: 80% !important;
  text-align: left !important;
  width: 80% !important;
  padding: inherit;
}
.vux-button-group {

}
.vux-button-group > a {
  font-size: 28px !important;
  //color: #4D7CFD !important;
  text-decoration: none !important;
}
.vux-button-tab-item {
  height: 60px !important;
  line-height: 60px !important;
}
.vux-button-group > a.vux-button-group-current {
  background: #4D7DFD !important;
}
.vux-button-group > a.vux-button-tab-item-first {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.vux-button-group > a.vux-button-tab-item-last {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.vux-button-group > a.vux-button-tab-item-first:after {
  border:1px solid rgba(77,125,253,1) !important;
  border-radius:6px !important;
}
.vux-button-group > a.vux-button-tab-item-last:after {
  border:1px solid rgba(77,125,253,1) !important;
  border-radius:6px !important;
}
</style>
