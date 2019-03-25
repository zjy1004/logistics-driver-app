<template>
  <div class="reject">
    <div v-transfer-dom>
      <x-dialog
        v-model="dialogShow"
        class="dialog-reject">
       <div class="title">
         请修改运费金额
       </div>
       <div class="pay-wrap">
         <div class="pay-title">修理厂付&nbsp;&nbsp;(￥)</div>
         <div class="pay-text" v-if="receiveClientShow">
           运费包月客户
         </div>
         <div class="pay-num" v-else>
           <input
            type="text"
            maxlength=6
            oninput="value=value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d).*$/, '$1$2.$3')"
            v-model="rejectParam.receiveReceivableFreight"
            placeholder="请输入修改金额">
         </div>
       </div>
       <div class="pay-wrap">
         <div class="pay-title">经销商付&nbsp;&nbsp;(￥)</div>
         <div class="pay-text" v-if="sendClientShow">
           运费包月客户
         </div>
          <div class="pay-num" v-else>
          <input
            type="text"
            maxlength=6
            oninput="value=value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d).*$/, '$1$2.$3')"
            v-model="rejectParam.sendReceivableFreight"
            placeholder="请输入修改金额">
         </div>
          <!-- <input
            type="text"
            maxlength=6
            @keyup="inputTest"
            v-model="rejectParam.sendReceivableFreight"
            placeholder="请输入修改金额">
         </div> -->
       </div>
       <div class="tab">
        <button-tab v-model="demo">
          <button-tab-item @on-item-click="consoleIndex('0')">{{'取消'}}</button-tab-item>
          <button-tab-item selected @on-item-click="consoleIndex('1')">{{ '确认'}}</button-tab-item>
        </button-tab>
       </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, ButtonTab, ButtonTabItem, TransferDomDirective as TransferDom } from 'vux'
import WayBillAjax from '@/api/WayBill/WayBill'

export default {
  name: 'RejectDialog',
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
      tabData: [],
      receiveClientShow: false,
      sendClientShow: false,
      dialogShow: false,
      demo: 0,
      rejectParam: {
        receiveReceivableFreight: '',
        sendReceivableFreight: '',
        waybillId: ''
      }
    }
  },
  created () {
    this.dialogShow = this.show
    this.tabData = this.dataList
    this.tabData.forEach(item => {
      this.rejectParam.waybillId = item.wayBillIdList[0]
      if (item.receiveClientFreightSettlementMethod === 3) {
        this.receiveClientShow = true
      }
      if (item.sendClientFreightSettlementMethod === 3) {
        this.sendClientShow = true
      }
    })
  },
  directives: {
    TransferDom
  },
  methods: {
    // inputTest () {
    //   let temp = this.rejectParam.sendReceivableFreight
    //   temp = temp.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    //   temp = temp.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    //   temp = temp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    //   temp = temp.replace(/^(-)*(\d+)\.(\d).*$/, '$1$2.$3')// 只能输入一个小数
    //   if (temp.indexOf('.') < 0 && temp !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    //     temp = parseFloat(temp)
    //   } else if (temp.startsWith('.')) {
    //     temp = ''
    //   }
    //   this.rejectParam.sendReceivableFreight = temp
    // },
    consoleIndex (val) {
      if (val === '1') {
        console.log('1')
        this.confirmReject()
      }
      if (val === '0') {
        console.log('0')
        this.dialogShow = false
        this.$emit('cancel-reject', false)
      }
    },
    confirmReject () {
      let receiveClientShow = this.receiveClientShow
      let sendClientShow = this.sendClientShow
      this.rejectParam.receiveReceivableFreight = this.rejectParam.receiveReceivableFreight
      this.rejectParam.sendReceivableFreight = this.rejectParam.sendReceivableFreight
      if (!receiveClientShow && !sendClientShow) {
        if (this.rejectParam.receiveReceivableFreight === '' || this.rejectParam.sendReceivableFreight === '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '修改金额不能为空'
          })
        } else {
          this.rejectAjax()
        }
      } else if (receiveClientShow && !sendClientShow) {
        if (this.rejectParam.sendReceivableFreight === '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '修改金额不能为空'
          })
        } else {
          this.rejectAjax()
        }
      } else if (!receiveClientShow && sendClientShow) {
        if (this.rejectParam.receiveReceivableFreight === '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '修改金额不能为空'
          })
        } else {
          this.rejectAjax()
        }
      } else {
        this.rejectAjax()
      }
    },
    rejectAjax () {
      WayBillAjax.Reject(this.rejectParam).then(res => {
        if (res.code === 200) {
          this.dialogShow = false
          this.$emit('confirm-reject', true)
        }
      })
    }

  },
  components: {
    XDialog,
    ButtonTab,
    ButtonTabItem
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-reject {
  .title {
    font-size: 34px;
    color: #101010;
    font-weight: bold;
    line-height: 36px;
    text-align: center;
  }
  .pay-wrap {
    margin-top: 45px;
    width: 100%;
    .pay-title {
      color: #343434;
      font-size: 30px;
      font-weight: 500;
    }
    .pay-num {
      width: 100%;
      height: 70px;
      margin-top: 20px;
      color: #101010;
      line-height: 70px;
      font-size: 29px;
      font-weight: bold;
    }
    .pay-text {
      width: 100%;
      height: 70px;
      margin-top: 20px;
      color: #101010;
      line-height: 70px;
      font-size: 29px;
      font-weight: bold;
    }
    input{
      color: #101010;
      width: 100%;
      height: 70px;
      outline: none;
      border: none;
      font-size: 29px;
      margin: 0;
      padding: 0;
      border-bottom: 1px solid rgba(229,229,229,1);
    }
  }
  .tab {
    width: 100%;
    height: 70px;
    margin-top: 40px;
  }
}
</style>
<style lang="less">
.dialog-reject {
 .weui-dialog {
   height: 580px;
   width: 80% !important;
   padding: 65px 60px 50px;
   text-align: left;
 }
 .tab .vux-button-group {
    width: 100%;
    height: 100%;
    font-size: 30px;
  }
}

.tab .vux-button-group a {
  font-size: 28px;
  text-decoration: none;
  color: #202023;
}
.tab .vux-button-tab-item {
  height: 70px;
  line-height: 70px;
  margin-right: 10px;
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
