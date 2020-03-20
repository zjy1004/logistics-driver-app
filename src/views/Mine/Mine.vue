<template>
   <div class="mine">
     <div class="c-header">
         我的
      </div>
     <div class="content">
       <div class="c-user1">
          <div class="user-con"></div>
          <div class="user-info-con">
            <div class="user-name-label">用户名称</div>
            <div class="user-name">{{userInfo.userName}}</div>
          </div>
          <div class="my-info" @click="routeLink('DealerUserInfo')" v-if="!isRepairShop && businessModel">
            <div class="icon-image"></div>
            <div class="my-label">我的资料</div>
          </div>
          <div class="my-info" @click="routeLink('UserInfo')" v-if="isRepairShop || !businessModel">
            <div class="icon-image"></div>
            <div class="my-label">我的资料</div>
          </div>
        </div>
       <div class="c-menu">
         <div class="li" @click="routeLink('CardBag')" v-if="!isRepairShop">
          <div class="c-m-left">
             <div class="icon"><i class="iconfont icon-yinxingqia002"></i></div>
             <div class="title">我的卡包</div>
           </div>
          <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
        </div>
        <div v-if="false" class="li" @click="routeLink('InviteCode')">
          <div class="c-m-left">
             <div class="icon"><i class="iconfont icon-yaoqingmatianchong"></i></div>
             <div class="title">邀请码</div>
           </div>
          <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
        </div>
         <div class="li">
          <a class="iphoneA" v-if="isIos" :href="'tel://'+telNum">
            <div class="c-m-left">
              <div class="icon"><a :href="'tel://'+telNum"><i class="iconfont icon-unie737"></i></a></div>
              <div class="title">在线客服</div>
           </div>
           <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
          </a>
          <a v-else @click="clickService()">
            <div class="c-m-left">
              <div class="icon"><i class="iconfont icon-unie737"></i></div>
              <div class="title">在线客服</div>
            </div>
            <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
          </a>
         </div>
         <div class="li" @click="routeLink('Setting')">
           <div class="c-m-left">
             <div class="icon"><i class="iconfont icon-shezhi"></i></div>
             <div class="title">设置</div>
           </div>
           <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
         </div>
         <div class="li" @click="routeLink('More')">
           <div class="c-m-left">
             <div class="icon"><i class="iconfont icon-dashujukeshihuaico-"></i></div>
             <div class="title">协议公示</div>
           </div>
           <div class="c-m-right"><i class="iconfont icon-youjiantoushixinxiao"></i></div>
         </div>
         <div class="li" v-if="false">
          <div v-if="startTime && endTime" class="c-m-left last">
             <div class="icon"><i class="iconfont icon-youhuiquan"></i></div>
             <div class="title">优惠日期：{{startTime}}至{{endTime}}</div>
           </div>
        </div>
       </div>
     </div>
     <div v-transfer-dom>
        <confirm v-model="showService"
          :confirm-text="'呼叫'"
          :cancel-text="'取消'"
          @on-cancel="showService = false"
          @on-confirm="onConfirm">
          <p style="text-align:center;">
            {{telNum}}
            <!-- <a :href="tel">4000088122</a> -->
          </p>
        </confirm>
      </div>
      <footer-bar />
      <router-view></router-view>
   </div>
</template>

<script type="text/ecmascript-6">
import { TransferDom, Confirm } from 'vux'
import FooterBar from '@/components/FooterBar/FooterBar'
// import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'Mine',
  components: { FooterBar, Confirm },
  data () {
    return {
      isRepairShop: false,
      businessModel: false,
      isIos: true,
      showService: false,
      telNum: '4000088122',
      userInfo: {
        userName: '', // 姓名
        phone: '', // 联系电话
        account: '', // 登录账号
        logisticsName: '', // 物流公司名称
        stationName: '' // 所属站点
      }
      // startTime: '',
      // endTime: ''
    }
  },
  directives: {
    TransferDom
  },
  created () {
    let phoneType = this.getPhoneInfo()
    if (phoneType !== 'iPhone') {
      this.isIos = false
    }
    let companyType = JSON.parse(sessionStorage.getItem('userInfo')).companyType
    if (companyType === 6) { // 修理厂6  经销商2
      this.isRepairShop = true
    } else {
      this.isRepairShop = false
    }
    let businessModel = JSON.parse(sessionStorage.getItem('userInfo')).businessModel
    if (businessModel === 2) {
      this.businessModel = true
    } else {
      this.businessModel = false
    }
    this.queryDetail()
    // this.queryDiscountsTime()
  },
  methods: {
    routeLink (name) {
      if (name === 'UserInfo') {
        let companyType = JSON.parse(sessionStorage.getItem('userInfo')).companyType
        if (companyType === 2) { // 修理厂6  经销商2
          this.$router.push({name, query: {type: 2}})
        } else {
          this.$router.push({name})
        }
      } else {
        this.$router.push({name})
      }
    },
    queryDetail () {
      let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      this.userInfo = {...userInfoObj}
    },
    // queryDiscountsTime () {
    //   let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    //   CommonAxios.QueryLimitedPromotionTime({clientId: userInfo.clientId}).then(res => {
    //     if (res.code === 200) {
    //       let {startTime, endTime} = res.data
    //       this.startTime = startTime
    //       this.endTime = endTime
    //     }
    //   })
    // },
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

<style scoped lang="less">
@import "../../style/base.less";
.mine {
  background: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .c-header {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 36px;
    color: #24282E;
    font-weight: 500;
    background-color: #FFFFFF
  }
  .content {
    height:100%;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    .c-user1{
      width: 670px;
      height: 240px;
      background: url('../../image/user-bg.png') no-repeat center center;
      background-size: 108% 117%;
      margin: 20px auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      .user-con{
        width: 130px;
        height: 130px;
        background: #fff;
        border-radius: 50%;
        margin-left: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../image/logo.png') no-repeat center center;
        background-size: 100% 100%;
      }
      .user-info-con{
        width: 250px;
        height: 240px;
        margin-left: 20px;
        .user-name-label{
          .mixin-sc(34px;#FEFEFF);
          margin-top: 80px;
        }
        .user-name{
          .mixin-sc(28px;#FEFEFF);
          margin-top: 23px;
        }
      }
      .my-info{
        width: 190px;
        height: 66px;
        background: #fff;
        border-radius: 33px;
        display: flex;
        align-items: center;
        .icon-image{
          width: 34px;
          height: 27px;
          background: url('../../image/my-icon.png') no-repeat center center;
          background-size: 100% 100%;
          margin-left: 16px;
          margin-top: 4px;
        }
        .my-label{
          width: 115px;
          height: 26px;
          .mixin-sc(28px;#4A7FE8);
          margin-left: 6px;
        }
      }
    }
    // .c-user {
    //   width: 100%;
    //   height: 340px;
    //   padding: 40px 40px;
    //   .c-u-wrap {
    //     width: 100%;
    //     height: 240px;
    //     background-color: #4A7FE8;
    //     border-radius:12px;
    //     display: flex;
    //     padding: 55px 30px;
    //     // align-items: center;
    //     justify-content: space-between
    //   }
    //   .user-icon{
    //     width: 115px;
    //     height: 115px;
    //     background: url('../../image/logo.png') no-repeat;
    //     background-size: 100% 100%;
    //     border-radius: 100px;
    //   }
    //   .user-name {
    //     height: 115px;
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: space-around;
    //     margin-left: -200px;
    //     color: #FEFEFF;
    //     .title {
    //       font-size: 34px;
    //     }
    //     .name {
    //       font-size: 28px;
    //     }
    //   }
    //   .user-arrow {
    //     width: 115px;
    //     height: 115px;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-around;
    //     .iconfont {
    //       font-size: 50px;
    //       color: #fff
    //     }
    //   }
    // }
     .c-menu {
      width: 100%;
      height: 480px;
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .li{
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // border-bottom: 1px solid #ccc;
        .iconfont {
          font-size: 40px;
          color: #4A7FE8
        }
        a {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // border-bottom: 1px solid #ccc;
          .iconfont {
            font-size: 40px;
            color: #4A7FE8
          }
          .c-m-right .iconfont {
            font-size: 40px;
            color: #CCCCCC
          }
        }
        a.iphoneA{
          text-decoration: none;
          color: #333;
          a{
            .title{
              color: #333!important;
            }
          }
        }
      }
      .c-m-left {
        width: 300px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          width: 80px;
          height: 80px;
          font-size: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          a{
            border-bottom: none;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }
        .title {
          width: 200px;
          height: 80px;
          font-size: 30px;
          line-height: 80px;
          color: #24282E;
        }
      }
      .c-m-left.last{
        width: 100%;
        .title{
          padding-left: 20px;
          flex: 1;
        }
      }
      .c-m-right {
        width: 40px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .iconfont {
          font-size: 40px;
          color: #CCCCCC
        }
      }
    }
  }
  .footer {
    height: 120px;
    width: 100%
  }
}
</style>
