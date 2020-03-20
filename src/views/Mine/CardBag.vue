
<template>
  <div class="cardBag">
    <x-header
      title="卡包"
      :left-options="{backText: ''}"
    />
    <div class="line"></div>
    <!-- 无卡 -->
    <div v-show="haveCard === 0"  class="noCard" @click="toBindCard()">
      <div class="left">
         添加新卡
      </div>
      <div class="right">
        <i class="iconfont icon-youjiantou1"></i>
      </div>
    </div>
    <!-- 有卡 -->
    <div v-show="haveCard === 1" class="haveCard">
      <div class="title">
        <div class="left">提现银行卡</div>
        <div class="right" @click="changeCard()">更换银行卡</div>
      </div>
      <div class="card">
        <div class="c-name">{{bankName}}</div>
        <div class="c-num">{{bankCard}}</div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showChangeCard"
        :confirm-text="'去换卡'"
        :cancel-text="'再等等'"
        @on-cancel="showChangeCard = false"
        @on-confirm="onConfirmChangeCard">
        <p style="text-align:center;">重新绑卡之前将解绑原有银行卡，是否确定更换银行卡</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showRegister"
        :confirm-text="'去注册'"
        :cancel-text="'再等等'"
        @on-cancel="showRegister = false"
        @on-confirm="onConfirmRegister">
        <p style="text-align:center;">非驮付宝用户无法绑卡，是否去注册</p>
      </confirm>
    </div>
    <!-- 是否鉴权 -->
    <div v-transfer-dom>
      <confirm v-model="showAuthConfirm"
        :confirm-text="'继续认证'"
        :cancel-text="'重新绑卡'"
        @on-cancel="onCancelAuth"
        @on-confirm="onConfirmAuth">
        <p style="text-align:center;">该账户存在银行卡正在进行身份认证是否继续进行认证</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showAccountUpdate"
        :confirm-text="'确定'"
        :cancel-text="''"
        :show-cancel-button = false
        @on-cancel="showAccountUpdate = false"
        @on-confirm="onConfirmUpdate = false">
        <p style="text-align:center;">为保证账户安全系统，账户升级前的运单未提现完成前，无法进行更换银行卡操作</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader, Confirm, TransferDom } from 'vux'
import CommonAxios from '@/api/Common/CommonAxios'
import LoginAjax from '@/api/Login/Login'
export default {
  name: 'CardBag',
  data () {
    return {
      shouldUpdate: false,
      showAuthConfirm: false,
      registerStatus: 3,
      haveCard: '',
      authStatus: '',
      showChangeCard: false,
      showRegister: false,
      showAccountUpdate: false,
      bankCard: '', // 银行卡号
      bankName: '', // 银行开户行
      pbId: {
        pbId: ''
      }
    }
  },
  components: {
    XHeader,
    Confirm,
    TransferDom
  },
  directives: {
    TransferDom
  },
  created () {
    this.queryBankInfo()
    this.getUserInfo()
    this.queryCardStatus()
  },
  methods: {
    getUserInfo () {
      LoginAjax.QueryUserState().then((res) => {
        if (res.code === 200) {
          if (res.data === 1) { // 未注册
            this.registerStatus = 1
          } else {
            this.registerStatus = 0
          }
        }
      })
    },
    onConfirmAuth () { // 继续认证
      this.$router.push({name: 'ReBind'})
    },
    onCancelAuth () { // 重新绑卡
      this.$router.push({name: 'BindCard'})
    },
    onConfirmRegister () { // 未注册
      this.$router.push({name: 'ClauseDetail', query: {protocolName: '物流云 “驮付宝”货款收取见证系统使用规则', protocolType: '2', from: 'register'}})
    },
    toBindCard () { // 绑卡
      if (this.registerStatus === 1) { // 未注册驮付宝
        this.showRegister = true
      } else { // 已注册驮付宝
        if (this.authStatus === 1 && this.haveCard === 0) { // 未鉴权
          this.showAuthConfirm = true
        } else {
          this.$router.push({name: 'BindCard'})
        }
      }
    },
    queryBankInfo () { // 查询银行卡信息
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          if (response.data === null) {
            this.haveCard = 0
          } else {
            if (response.data.status === 0) {
              this.haveCard = 1
              this.authStatus = 0
              let {data} = response
              this.bankCard = this.fomatBankNum(data.bankCard)
              this.bankName = data.bankName || ''
              this.pbId.pbId = data.pbId
            } else {
              this.authStatus = 1
              this.haveCard = 0
            }
          }
        }
      })
    },
    changeCard () { // 解绑弹框
      if (this.shouldUpdate) {
        this.showAccountUpdate = true
      } else {
        this.showChangeCard = true
      }
    },
    onConfirmChangeCard () { // 确认解绑
      this.unBindCard()
    },
    onConfirmUpdate () {
      this.$router.push({name: 'Treasure'})
    },
    queryCardStatus () {
      CommonAxios.QueryCardStatus().then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.shouldUpdate = false
          } else {
            this.shouldUpdate = true
          }
        }
      })
    },
    unBindCard () { // 解绑请求
      CommonAxios.FundAccountUnBindBankCard(this.pbId).then(response => {
        if (response.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '解绑成功'
          })
          this.$router.push({name: 'BindCard'})
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.message
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .cardBag {
    display: flex;
    flex: 1;
    background: #F5F5F5 !important;
    flex-direction: column;
    .noCard {
      width: 90%;
      height: 100px;
      margin: 50px auto;
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #4A7FE8;
      .left {
        width: auto;
        height: 100px;
        line-height: 100px;
        color: #FFFFFF;
        font-size: 32px;
        font-weight: 500;
      }
      .right {
        height: 100px;
        width: 50px;
        line-height: 100px;
        .iconfont {
          font-size: 40px;
          color: #fff;
        }
      }
    }
    .haveCard {
      width: 100%;
      height: 100%;
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: space-between;
      // background-color: #4A7FE8;
      .title {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          color: #5C6066;
          font-size: 32px;
        }
        .right {
          color: #4A7FE8;
          font-size: 28px
        }
      }
      .card {
        width: 100%;
        height: 300px;
        background: #fff;
        padding: 60px 50px;
        display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: space-between;
        .c-name {
          font-size: 30px;
          color: #25272E;
          font-weight: 400;
          line-height: 1.5;
        }
        .c-num {
          font-size: 50px;
          color: #25272E;
          font-weight: bold;
        }
      }
    }
  }
</style>

<style lang="less" scope>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.cardBag{
  // display: flex;
  // flex: 1;
  // background: #fff!important;
  // flex-direction: column;
  .vux-x-dialog{
    .weui-dialog{
      .weui-dialog__bd{
        padding: 0px 20px!important;
      }
    }
  }
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
}
</style>
