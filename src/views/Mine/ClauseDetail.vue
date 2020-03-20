<template>
  <div class="clause-detail">
    <x-header :left-options="{backText: ''}">{{protocolName}}</x-header>
    <div class="line"></div>
    <div class="iframe-con">
      <iframe class="pageStyle" :srcdoc="RegistrationAgreement" frameborder="0" height="100%" width="100%"></iframe>
    </div>
    <div v-if="fromRegister" class="bottom-con">
      <div class="read-con">
        <check-icon @click.native="remeberChange(isRead)" :value.sync="isRead"></check-icon>
        <span @click="clickRead"><span>已阅读并同意<span class="fileName">《{{protocolName}}》</span></span></span>
      </div>
      <div @click="sure" :class="{'btn-con': true, 'disabled-btn': !isRead}">{{firstLogin ? '确定' : '去注册'}}</div>
    </div>
  </div>
</template>

<script>
import { XHeader, CheckIcon } from 'vux'
import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'ClauseDetail',
  data () {
    return {
      protocolName: '',
      RegistrationAgreement: '',
      isRead: false
    }
  },
  computed: {
    fromRegister () {
      return this.$route.query.from === 'register'
    },
    firstLogin () {
      return this.$route.query.firstLogin === '1'
    }
  },
  components: {
    XHeader,
    CheckIcon
  },
  created () {
    this.protocolName = this.$route.query.protocolName
    this.QueryDetail()
  },
  methods: {
    remeberChange (val) {
      this.isRead = val
    },
    QueryDetail () { // 查询登录协议
      let protocolType = this.$route.query.protocolType
      CommonAxios.QueryRegistrationAgreement({protocolType}).then((response) => {
        if (response.code === 200) {
          this.RegistrationAgreement = response.data.protocolContent
        }
      })
    },
    clickRead () {
      this.isRead = !this.isRead
    },
    sure () {
      if (this.isRead) {
        if (this.fromRegister && this.firstLogin) {
          this.$router.push({name: 'Treasure'})
        } else {
          this.$router.push({name: 'TuoPayRegister'})
        }
      }
    }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.clause-detail{
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
  overflow-y: scroll;
  .vux-check-icon {
    width: 38px;
    height: 38px;
    margin-left: 15px;
    margin-right: 15px;
    .weui-icon-circle {
      font-size: 38px;
    }
    .weui-icon-success {
      margin-left: 0px;
      .mixin-sc(38px; @color-extrude);
    }
    .weui-icon-success:before,.weui-icon-success-circle:before{
      color: @color-extrude;
    }
  }
  .vux-header{
    height: 90px;
    width: 100%;
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
      .mixin-sc(28px;#1A1A1A);
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
  .list{
    display: flex;
    flex: 1;
    ul{
      flex: 1;
      padding: 0px 20px;
      li{
        border-bottom: 1px solid #ccc;
        padding: 20px 0px;
        line-height: 40px;
        .mixin-sc(28px;#5677fc);
      }
    }
  }
  .iframe-con {
    display: flex;
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    iframe{
      width: 100%;
    }
  }
  .bottom-con{
    width: 100%;
    height: 200px;
    border-top: 1px solid #ddd;
    background: #fff;
    .read-con{
      height: 80px;
      width: 100%;
      display: flex;
      align-items: center;
      margin: 5px 0px;
      span{
        .mixin-sc(28px;#333);
        line-height: 40px;
      }
      input{
        width: 60px;
        height: 30px;
        margin-left: 20px;
      }
      .fileName{
        color: #5677fc;
      }
    }
    .btn-con{
      width: 50%;
      height: 80px;
      margin: 0 auto;
      border-radius: 15px;
      background: #5677fc;
      line-height: 80px;
      text-align: center;
      .mixin-sc(32px;#fff);
    }
    .btn-con.disabled-btn{
      background: #eee;
      .mixin-sc(30px;#aaa);
    }
  }
}
</style>
