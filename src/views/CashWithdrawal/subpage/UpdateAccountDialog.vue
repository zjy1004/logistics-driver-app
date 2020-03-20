<template>
  <div class="updateAccount">
    <div v-transfer-dom>
      <x-dialog
        v-model="dialogShow"
        class="dialog-updateAccount">
        <div class="title">
          为保障账号安全，需验证身份
        </div>
        <div class="li-box">
          <div class="box-left">银行卡卡号:</div>
          <div class="box-right">
            {{accountInfo.bankCard}}
          </div>
        </div>
        <div class="li-box">
          <div class="box-left">开户行:</div>
          <div class="box-right">
            {{accountInfo.bankName}}
          </div>
        </div>
        <div class="li-box">
          <div class="box-left">开户人:</div>
          <div class="box-right">
            {{accountInfo.name}}
          </div>
        </div>
        <div class="li-box">
          <div class="box-left">手机号:</div>
          <div class="box-right">
            {{accountInfo.phone}}
          </div>
        </div>
        <div class="li-box">
          <div class="box-left">验证方式:</div>
          <div class="box-right">
            <van-radio-group @change="radioChange(form.authenticationMethod)" v-model="form.authenticationMethod">
              <van-radio name="1">短信验证</van-radio>
              <van-radio name="0">小额转账验证</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="li-box" style="margin-top: 3px;" v-show="form.authenticationMethod === '1'">
          <div class="box-left">验证码:</div>
          <div class="inputWarp">
            <van-field maxlength=6 @keyup.native="inputMessageCode(form.messageCode)" v-model="form.messageCode" placeholder="请输入验证码" />
          </div>
          <div class="getMsg" v-show="timeShow">
            <!-- <button  @click="getcheckAmount()" :class="{'disabled-getMsg': getMsgDisabled}" :disabled="getMsgDisabled">获取验证金</button> -->
            <button  @click="getMessageCode()">获取验证码</button>
          </div>
          <div class="getCountDown" v-show="!timeShow">已发送({{timeNum}}s)</div>
        </div>
        <div class="li-box" style="margin-top: 3px;" v-show="form.authenticationMethod === '0'">
          <div class="box-left">到账金额:</div>
          <div class="inputWarp">
            <van-field @keyup.native="inputCheckAmount()" v-model="form.checkAmount" placeholder="请输入验证金" />
          </div>
          <div class="getMsg" v-show="moneyShow">
            <!-- <button  @click="getcheckAmount()" :class="{'disabled-getMsg': getMsgDisabled}" :disabled="getMsgDisabled">获取验证金</button> -->
            <button  @click="getcheckAmount()">获取验证金</button>
          </div>
          <div class="getCountDown" v-show="!moneyShow">已发送</div>
        </div>
        <div class="hint" v-show="form.authenticationMethod === '0'">
          注：银行会向您的账户支付小于1元的验证金额,验证银行卡信息
        </div>
       <div class="tab">
         <button :class="{'disabled': sureDisabled}" :disabled="sureDisabled" @click="sure()">确定</button>
       </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, ButtonTab, ButtonTabItem, TransferDomDirective as TransferDom } from 'vux'
import { Field, RadioGroup, Radio } from 'vant'
import RegisterLogisticsPayAndBindingCard from '@/api/BindCard/BindCard'

export default {
  name: 'UpdateAccountDialog',
  components: {
    XDialog,
    ButtonTab,
    ButtonTabItem,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    accountData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
  },
  data () {
    return {
      dialogShow: false,
      timeShow: true,
      moneyShow: true,
      accountInfo: {},
      timeNum: '',
      haveGetCode: 0,
      pbId: '',
      bankName: '',
      form: {
        messageCode: '',
        authenticationMethod: '1',
        checkAmount: '',
        certificationType: '',
        oldBank: '1',
        bankCard: '',
        pbCode: '',
        openAccountBank: '',
        pbId: ''
      }
    }
  },
  created () {
    this.dialogShow = this.show
    this.accountInfo = this.accountData
    if (this.accountData.bankName.length > 10) {
      this.accountInfo.bankName = this.accountData.bankName.substr(0, 10)
    } else {
      this.accountInfo.bankName = this.accountData.bankName
    }
    this.form.certificationType = this.accountData.certificationType
    this.form.bankCard = this.accountData.bankCard
    this.form.pbCode = this.accountData.bankCard
    this.form.openAccountBank = this.accountData.openAccountBank
  },
  directives: {
    TransferDom
  },
  computed: {
    sureDisabled () {
      if (this.form.authenticationMethod === '1') {
        return this.form.messageCode === ''
      }
      if (this.form.authenticationMethod === '0') {
        return this.form.checkAmount === ''
      }
    }
  },
  methods: {
    inputMessageCode (val) { // 校验验证金
      // this.form.checkAmount = this.form.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || ''
      let newVal = val.replace(/[^\d]/g, '')
      this.form.messageCode = newVal
    },
    inputCheckAmount () { // 校验验证码
      this.form.checkAmount = this.form.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || ''
    },
    getCountDown () { // 倒计时
      const TIME_COUNT = 120
      if (!window.timer) {
        this.timeNum = TIME_COUNT
        this.timeShow = false
        window.timer = setInterval(() => {
          if (this.timeNum > 0 && this.timeNum <= TIME_COUNT) {
            this.timeNum--
          } else {
            this.timeShow = true
            clearInterval(window.timer)
            window.timer = null
          }
        }, 1000)
      }
    },
    radioChange (val) {
      if (val === '0') {
        this.form.messageCode = ''
      } else {
        this.form.checkAmount = ''
      }
    },
    getMessageCode () { // 获取验证码
      if (this.haveGetCode === 0) {
        this.accountBindCard('code')
      }
      if (this.haveGetCode === 1) {
        this.nextMessageCode()
      }
      // if (this.form.pbId !== '') {
      // }
    },
    getcheckAmount () { // 获取验证金
      this.accountBindCard('money')
    },
    accountBindCard (flag) { // 资金账户绑卡
      RegisterLogisticsPayAndBindingCard.FundAccountBindBankCard(this.form).then(res => {
        if (res.code === 200) {
          if (flag === 'code') {
            this.timeShow = false
            this.getCountDown()
            this.haveGetCode = 1
            this.$vux.toast.show({
              type: 'success',
              text: '验证码已发送'
            })
          }
          if (flag === 'money') {
            this.moneyShow = false
            this.$vux.toast.show({
              type: 'success',
              text: '验证金已发送'
            })
          }
          this.form.pbId = res.data.pb_id
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    nextMessageCode () { // 绑卡四要素鉴权重发
      RegisterLogisticsPayAndBindingCard.FundAccountResendMessageCode({bankCard: this.form.bankCard, pbId: this.form.pbId}).then(res => {
        if (res.code === 200) {
          this.getCountDown()
          this.timeShow = false
          this.$vux.toast.show({
            type: 'success',
            text: '验证码已发送'
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    sure () { // 资金账户绑卡账户鉴权请求
      RegisterLogisticsPayAndBindingCard.FundAccountAccountAuth(this.form).then(res => {
        if (res.code === 200) {
          this.$emit('confirm-update')
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.dialog-updateAccount {
  .title {
    width: 100%;
    height: 70px;
    text-align: center;
    line-height: 70px;
    font-weight: 600;
    position: relative;
    .mixin-sc(30px;#2b2b2b);
  }
  .li-box {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    background-color: #fff;
    .box-left {
      width: 160px;
      height: 70px;
      line-height: 70px;
      text-align: right;
      .mixin-sc(28px;#2b2b2b);
    }
    .box-right {
      height: 70px;
      line-height: 70px;
      width: 380px;
      margin-left: 20px;
      display: flex;
      align-items: center;
      .mixin-sc(28px;#2b2b2b);
    }
    .inputWarp {
      height: 70px;
      width: 200px;
      margin-left: 20px;
      display: flex;
      align-items: center;
      // flex: 1
    }
    .getMsg {
      width: 190px;
      height: 70px;
      line-height: 70px;
      font-size: 26px;
      color: #4A7FE8;
      button {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        padding: 0;
        background-color: #fff;
      }
    }
    .disabled-getMsg {
      width: 190px;
      height: 70px;
      line-height: 70px;
      font-size: 26px;
      color: #aaa;
    }
    .getCountDown {
      width: 190px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      font-size: 26px;
      color: #4A7FE8;
    }
  }
  .hint {
    width: 100%;
    text-align: center;
    height: 70px;
    margin-top: 10px;
    .mixin-sc(28px; #ff0000);
  }
  .tab {
    width: 100%;
    height: 80px;
    text-align: center;
    margin-top: 20px;
    position: absolute;
    top: 580px;
    left: 0;
    right: 0;
    button {
      width: 220px;
      height: 100%;
      border: 0;
      padding: 0;
      border-radius: 8px;
      font-size: 28px!important;
      background-color: #4D7DFD;
      color: #fff;
    }
    .disabled {
      background-color: #aaa;
      font-size: 28px!important;
    }
  }
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.dialog-updateAccount {
  .weui-dialog {
   height: 720px;
   width: 90%!important;
   padding: 20px;
   text-align: left;
 }
 .van-cell{
  height: 70px;
  padding: 15px;
  border: 1px solid #ccc;
 }
 .van-field__control:disabled {
    color: #24282E;
  }
  .van-radio-group {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-radio {
      width: auto;
      height: 70px;
      display: flex;
      align-items: center;
      .van-radio__input {
        font-size: 29px;
      }
      .van-radio__label {
        font-size: 26px;
        color: #24282E;
      }
      i {
        display: block;
      }
    }
  }
}
</style>
