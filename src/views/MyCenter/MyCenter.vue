
<template>
  <div class="my-center" :class="{'my-centerX': isX}">
    <drawer
      width="200px;"
      :show.sync="selfShowSetting">
      <div slot="drawer">
        <div class="drawer-con">
          <div class="user-con">
            <div class="user-icon"></div>
            <div class="user-name">{{userName}}</div>
            <div class="compony-name">{{logisticsName}}</div>
          </div>
          <ul class="menu-setting-list">
            <li @click="routeLink('WaybillList')"><i class="waybill"></i><span>运单</span></li>
            <li @click="routeLink('UserInfo')"><i class="person"></i><span>个人</span></li>
            <li @click="routeLink('Shift')"><i class="shift1"></i><span>班次</span></li>
            <li v-if="isIos"><a :href="'tel://'+telNum"><i class="phone"></i><span>客服</span></a></li>
            <li v-else @click="clickService()"><i class="phone"></i><span>客服</span></li>
            <li @click="routeLink('Setting')"><i class="setting-icon"></i><span>设置</span></li>
          </ul>
        </div>
      </div>
      <div>
        <v-header
          v-if="showHeader"
          @click-user-icon="clickUserIcon"
        />
        <router-view></router-view>
      </div>
    </drawer>
    <div v-transfer-dom>
      <confirm v-model="showService"
        :confirm-text="'呼叫'"
        :cancel-text="'取消'"
        @on-cancel="showService = false"
        @on-confirm="onConfirm">
        <p style="text-align:center;">
          {{telNum}}
          <!-- <a :href="tel">13691411270</a> -->
        </p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Drawer, Confirm, XDialog, TransferDomDirective as TransferDom } from 'vux'
import VHeader from '@/components/Header/Header'
import MyCenterAjax from '@/api/MyCenter/MyCenter'
export default {
  name: 'MyCenter',
  props: {
    showSetting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isIos: true,
      isX: false,
      showService: false,
      selfShowSetting: false,
      showHeader: true,
      userName: '',
      logisticsName: '',
      telNum: '4000088122'
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Drawer,
    VHeader,
    Confirm,
    XDialog,
    TransferDom
  },
  created () {
    // this.toAndroid()
    this.isX = this.isIphoneX()
    let driverInfoObj = JSON.parse(sessionStorage.getItem('driverInfo'))
    if (driverInfoObj) {
      this.userName = driverInfoObj.userName
      this.logisticsName = driverInfoObj.logisticsName
    } else {
      let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      MyCenterAjax.queryUserInfo({userId: userInfoObj.userId}).then((response) => {
        if (response.code === 200) {
          if (response.data) {
            this.userName = response.data.userName
            this.logisticsName = response.data.logisticsName
          }
        }
      })
    }
    if (this.$route.name === 'UserInfo' || this.$route.name === 'WaybillList' || this.$route.name === 'Setting' || this.$route.name === 'ConfirmDepart' || this.$route.name === 'Shift' || this.$route.name === 'EditPsd') {
      this.showHeader = false
    }
    let phoneType = this.getPhoneInfo()
    if (phoneType !== 'iPhone') {
      this.isIos = false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'UserInfo' || to.name === 'WaybillList' || to.name === 'Setting' || this.$route.name === 'ConfirmDepart' || this.$route.name === 'Shift' || this.$route.name === 'EditPsd') {
        this.showHeader = false
      } else {
        this.showHeader = true
      }
    },
    showSetting: function (newVal, oldVal) {
      this.selfShowSetting = newVal
    },
    deep: true
  },
  mounted () {
    let drawerBodyFirst = document.getElementsByClassName('vux-drawer-body')[0]
    if (drawerBodyFirst) {
      let drawerBodyFirstChild = drawerBodyFirst.getElementsByTagName('div')[0]
      if (drawerBodyFirstChild) {
        drawerBodyFirstChild.style.display = 'flex'
        drawerBodyFirstChild.style.flex = 1
        drawerBodyFirstChild.style.height = '100%'
        drawerBodyFirstChild.style.flexDirection = 'column'
      }
    }
  },
  methods: {
    routeLink (name) {
      this.selfShowSetting = false
      this.$router.push({name})
    },
    clickUserIcon (isShow) {
      this.selfShowSetting = isShow
    },
    onConfirm () {
      this.showService = false
    },
    toAndroid () {
      try {
        window.android.callPhone(this.telNum)
      } catch (error) {
        console.log(error)
      }
    },
    // 安卓点击客服
    clickService () {
      this.toAndroid()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.my-center{
  height: 100%;
  width: 100%;
  padding-top: 50px;
  // background: #F3F4F5;
  background: #fff;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  .vux-drawer-body{
    background: #fff;
  }
  .showDrawer{
    display: block;
  }
  .hideDrawer{
    display: none;
  }
  .drawer-con{
    width: 480px;
    height: 100%;
    .user-con{
      height: 380px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .user-icon{
        // .mixin-bis(120px;120px;-420px;-30px);
        width: 120px;
        height: 120px;
        background: url('../../image/user-icon.png') no-repeat;
        background-size: 100% 100%;
      }
      .user-name{
        .mixin-sc(32px;#000);
        font-weight: bold;
        margin-top: 34px;
        margin-bottom: 18px;
      }
      .compony-name{
        .mixin-sc(22px;#9B9B9B);
      }
    }
    .menu-setting-list{
      padding-left: 50px;
      li{
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        a{
          display: flex;
          width: 100%;
          align-items: center;
          height: 100%;
        }
        i{
          width: 30px;
          height: 32px;
        }
        i.waybill{
          background: url('../../image/waybillmenu.png') no-repeat;
          background-size: 100% 100%;
        }
        i.person{
          background: url('../../image/person.png') no-repeat;
          background-size: 100% 100%;
        }
        i.shift1{
          background: url('../../image/shift.png') no-repeat;
          background-size: 100% 100%;
        }
        i.phone{
          background: url('../../image/phone.png') no-repeat;
          background-size: 100% 100%;
        }
        i.setting-icon{
          background: url('../../image/setting.png') no-repeat;
          background-size: 100% 100%;
        }
        span{
          .mixin-sc(32px;#111111);
          margin-left: 30px;
        }
      }
    }
  }
}
.my-centerX{
  padding-top: 64px;
  padding-bottom: 50px;
}
</style>
