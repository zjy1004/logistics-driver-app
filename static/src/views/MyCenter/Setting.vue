
<template>
  <div class="setting">
    <x-header
      title="设置"
      :left-options="{backText: ''}"
    />
    <group>
      <cell title="修改密码" @click.native="changePass">></cell>
      <cell title="清除缓存" @click.native="clear">{{strorageVal}}</cell>
      <cell title="版本信息" value="v1.0"></cell>
    </group>
    <div class="code-con">
      <div class="ios-con download-con">
        <img src="../../image/ios.png" alt="ios">
        <div class="text">ios下载</div>
      </div>
      <div class="android-con download-con">
        <img src="../../image/android.png" alt="android">
        <div class="text">android下载</div>
      </div>
    </div>
    <div class="login-out-con" @click=confirmLoginOut>退出登录</div>
    <div v-transfer-dom>
      <confirm v-model="showClear"
        :confirm-text="'确认清除'"
        :cancel-text="'取消'"
        @on-cancel="showClear = false"
        @on-confirm="clearStorage">
        <p style="text-align:center;">确定清除缓存？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showLoginOut"
        :confirm-text="'退出登录'"
        :cancel-text="'取消'"
        @on-cancel="showLoginOut = false"
        @on-confirm="logOut">
        <p style="text-align:center;">确定要退出登录？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell, Confirm, TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'Setting',
  data () {
    return {
      userInfo: {
        phone: '', // 联系电话
        account: '', // 登录账号
        logisticsName: '', // 物流公司名称
        stationName: '', // 所属站点
        cars: '' // 驾驶车辆
      },
      strorageVal: '0MB',
      showLoginOut: false,
      showClear: false
    }
  },
  components: {
    XHeader,
    Cell,
    Group,
    Confirm,
    TransferDom
  },
  directives: {
    TransferDom
  },
  created () {
    this.strorageVal = `${(Math.random() * 50).toFixed(1)}MB`
  },
  methods: {
    changePass () {
      this.$router.push({name: 'EditPsd'})
    },
    clear () {
      this.showClear = true
    },
    clearStorage () {
      this.strorageVal = '0MB'
      this.$vux.toast.show({
        type: 'success',
        text: '清除成功！'
      })
    },
    confirmLoginOut () {
      this.showLoginOut = true
    },
    logOut () {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('driverInfo')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.setting{
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
  .weui-cell{
    height: 108px;
    padding: 0 40px;
    label{
      .mixin-sc(30px;#404040);
    }
    .weui-cell__ft{
      .mixin-sc(28px;#585858);
    }
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.setting{
  height: 100%;
  width: 100%;
  background: #fff;
  .code-con{
    width: 100%;
    height: 230px;
    margin: 170px auto 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .download-con{
      width: 230px;
      height: 230px;
      img{
        display: block;
        width: 230px;
        height: 230px;
      }
      .text{
        font-size: 28px;
        height: 28px;
        line-height: 28px;
        width: 100%;
        text-align: center;
      }
    }
  }
  .login-out-con{
    margin: 230px auto 0;
    border: 2px solid #4D7BFE;
    border-radius: 5px;
    width: 333px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    .mixin-sc(30px;#4D7BFE);
  }
}
</style>
