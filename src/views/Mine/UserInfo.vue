
<template>
  <div class="user-info">
    <x-header
      title="个人信息"
      :left-options="{backText: ''}"
    />
    <group>
      <cell title="姓名" :value="userInfo.userName"></cell>
      <cell title="联系电话" :value="userInfo.phone"></cell>
      <cell title="登录账号" :value="userInfo.account"></cell>
    </group>
    <group label-width="112px">
      <cell title="所属公司" :value="userInfo.dealerName"></cell>
      <cell title="经营地址" :value="userInfo.address"></cell>
    </group>
    <qrcode class="codeCon" v-if="showCode" :value="platformCode.toString()"></qrcode>
  </div>
</template>

<script>
import { XHeader, Group, Cell, Qrcode } from 'vux'
import MyCenterAjax from '@/api/MyCenter/MyCenter'
export default {
  name: 'UserInfo',
  data () {
    return {
      showCode: false,
      clientId: '',
      platformCode: '',
      userInfo: {
        userName: '', // 姓名
        phone: '', // 联系电话
        account: '', // 登录账号
        dealerName: '', // 经销商公司名称
        address: '' // 经营地址
      }
    }
  },
  components: {
    XHeader,
    Cell,
    Group,
    Qrcode
  },
  created () {
    if (this.$route.query && this.$route.query.type) {
      this.showCode = true
    } else {
      this.showCode = false
    }
    this.queryDetail()
  },
  methods: {
    queryDetail () {
      let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      this.userInfo.userName = userInfoObj.userName
      this.userInfo.phone = userInfoObj.phone
      this.userInfo.account = userInfoObj.account
      MyCenterAjax.queryInfo().then((response) => {
        if (response.code === 200) {
          if (response.data.platformCode !== '' && response.data.platformCode !== null) {
            this.platformCode = response.data.platformCode
          } else {
            this.platformCode = ''
          }
          this.clientId = response.data.clientId
          this.userInfo.dealerName = response.data.clientName || ''
          this.userInfo.address = response.data.address || ''
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.user-info{
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
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.user-info{
  height: 100%;
  width: 100%;
  .codeCon{
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
