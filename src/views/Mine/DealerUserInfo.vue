
<template>
  <div class="user-info">
    <x-header
      @on-click-back="goback()"
      title="个人信息"
      :left-options="{backText: '', preventGoBack: true}"
      >
      <div v-if="showRelevance" @click="relevance()" class="choose-btn" slot="right">
        <div class="r-icon"></div>
        <div class="r-text">关联</div>
      </div>
    </x-header>
    <div class="info">
      <div class="userIcon">
        <div class="icon-left">头像</div>
        <div class="icon-right"></div>
        <div class="code" @click="clickCode">
          <qrcode fg-color="#5677fc" :value="this.clientId.toString()"></qrcode>
        </div>
      </div>
      <div class="codeBox" v-if="editCode">
        <div class="code-left">客户编码</div>
        <div class="code-right">
          <van-field
           @keyup.native="inputIdNumber(userInfo.clientCode)"
           @focus="codeInputFocus()"
           @blur="codeInputBlur()"
           maxlength=19
           v-model="userInfo.clientCode"
           placeholder="请输入客户编码" />
           <van-icon @click="validateClient(userInfo.clientCode)" name="passed" size="22px" color="#5677fc" />
        </div>
      </div>
      <div v-if="hintShow" class="hintBox">客户编码输入确认后，无法进行二次更改</div>
      <group label-width="112px">
        <cell v-if="!editCode" title="客户编码" :value="userInfo.clientCode"></cell>
        <cell title="姓名" :value="userInfo.userName"></cell>
        <cell title="联系电话" :value="userInfo.phone"></cell>
        <cell title="登录账号" :value="userInfo.account"></cell>
        <cell title="所属公司" :value="userInfo.clientName"></cell>
        <cell title="经营地址" :value="userInfo.address"></cell>
        <cell title="物流公司" :value="userInfo.logisticsName"></cell>
        <cell title="运费结算" :value="userInfo.freightSettlementMethod"></cell>
        <cell title="驮付宝业务" :value="userInfo.onLineType"></cell>
      </group>
      <div class="relevanceBox" v-for="(item, index) in accountList" :key="index">
        <div class="box-wrap">
          <div class="b-header">
            <div class="h-left">关联账号{{index + 1}}</div>
            <!-- <div class="h-right" @click="cancelRelevance(item.subClientId)">取消关联</div> -->
          </div>
          <div class="b-content">
            <cell title="物流公司" :value="item.logisticsName"></cell>
            <cell title="运费结算" :value="item.freightSettlementMethod"></cell>
            <cell title="驮付宝业务" :value="item.onLineType"></cell>
          </div>
        </div>
      </div>
    </div>
    <relevance-dialog
      v-if="relevanceShow"
      :show="relevanceShow"
      :logisticsData="logisticsObj"
      @cancel-relevance="cancelRelevanceDialog"
      @confirm-relevance="confirmRelevanceDialog"
    />
    <!-- 二维码弹框 -->
    <div class="QRcodeStyle">
      <van-dialog
        v-model="QRcodeShow"
        :show-confirm-button = false
        :close-on-click-overlay = true
      >
      <span class="close" @click="closeCode">x</span>
      <p class="dealerName">{{userInfo.clientName}}</p>
      <qrcode :value="clientId.toString()"></qrcode>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { XHeader, Group, Cell, Qrcode } from 'vux'
import { Field, Icon, Dialog } from 'vant'
import MyCenterAjax from '@/api/MyCenter/MyCenter'
import RelevanceDialog from './subpage/RelevanceDialog'
export default {
  name: 'UserInfo',
  components: {
    XHeader,
    Cell,
    Group,
    RelevanceDialog,
    [Field.name]: Field,
    [Icon.name]: Icon,
    Qrcode,
    Dialog
  },
  data () {
    return {
      QRcodeShow: false,
      showRelevance: false,
      hintShow: false,
      relevanceShow: false,
      editCode: true,
      clientId: '',
      logisticsObj: {
        logisticsName: '',
        logisticsId: '',
        account: '',
        password: ''
      },
      userInfo: {
        userName: '', // 姓名
        phone: '', // 联系电话
        account: '', // 登录账号
        clientName: '', // 经销商公司名称
        address: '', // 经营地址
        logisticsName: '', // 物流公司
        freightSettlementMethod: '', // 运费结算
        onLineType: '', // 驮付宝
        clientCode: ''
      },
      accountList: [
        // {a: '物流一', b: '月结', c: '已开通'},
        // {a: '物流二', b: '现结', c: '未开通'},
        // {a: '物流三', b: '包月', c: '已开通'}
      ]
    }
  },
  created () {
    let routeFrom = this.$route.query.from
    if (routeFrom === 'searchLogistics') {
      let logisticsObj = this.$route.query.logisticsObj
      this.logisticsObj.logisticsName = logisticsObj.logisticsName
      this.logisticsObj.logisticsId = logisticsObj.logisticsId
      this.logisticsObj.account = logisticsObj.account
      this.logisticsObj.password = logisticsObj.password
      this.relevance()
    }
    let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfoObj.businessModel === 2) {
      this.showRelevance = true
    }
    this.clientId = userInfoObj.clientId
    this.queryDetailInfo()
  },
  methods: {
    clickCode () {
      this.QRcodeShow = true
    },
    closeCode () {
      this.QRcodeShow = false
    },
    queryDetailInfo () {
      // let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      // let clientId = userInfoObj.clientId
      MyCenterAjax.getDearlerInfo({clientId: this.clientId}).then((response) => {
        if (response.code === 200) {
          let data = response.data
          if (data.clientCode === null || data.clientCode === '') {
            this.editCode = true
          } else {
            this.editCode = false
          }
          if (data.freightSettlementMethod === '1') {
            this.userInfo.freightSettlementMethod = '现结'
          } else if (data.freightSettlementMethod === '2') {
            this.userInfo.freightSettlementMethod = '月结'
          } else if (data.freightSettlementMethod === '3') {
            this.userInfo.freightSettlementMethod = '包月'
          } else {
            this.userInfo.freightSettlementMethod = ''
          }
          if (data.onlinePaySwitch === 0 && data.accountApplicationStatus >= 3) { // 已开通已注册
            this.userInfo.onLineType = '已开通已注册'
          } else if (data.onlinePaySwitch === 0 && (data.accountApplicationStatus < 3 || data.accountApplicationStatus === null)) {
            this.userInfo.onLineType = '已开通未注册'
          } else if (data.onlinePaySwitch === 1 && (data.accountApplicationStatus < 3 || data.accountApplicationStatus === null)) {
            this.userInfo.onLineType = '未开通未注册'
          } else if (data.onlinePaySwitch === 1 && data.accountApplicationStatus >= 3) {
            this.userInfo.onLineType = '未开通已注册'
          } else {
            this.userInfo.onLineType = ''
          }
          this.userInfo.userName = data.userName
          this.userInfo.phone = data.phone
          this.userInfo.clientCode = data.clientCode
          this.userInfo.account = data.account
          this.userInfo.clientName = data.clientName
          this.userInfo.address = data.address
          this.userInfo.logisticsName = data.logisticsName
          if (data.clientDealerInfoParamList !== null && data.clientDealerInfoParamList.length > 0) {
            this.accountList = data.clientDealerInfoParamList.map(item => {
              if (item.freightSettlementMethod === '1') {
                item.freightSettlementMethod = '现结'
              } else if (item.freightSettlementMethod === '2') {
                item.freightSettlementMethod = '月结'
              } else if (item.freightSettlementMethod === '3') {
                item.freightSettlementMethod = '包月'
              } else {
                item.freightSettlementMethod = ''
              }
              if (item.onlinePaySwitch === 0 && item.accountApplicationStatus >= 3) { // 已开通已注册
                item.onLineType = '已开通已注册'
              } else if (item.onlinePaySwitch === 0 && (item.accountApplicationStatus < 3 || item.accountApplicationStatus === null)) {
                item.onLineType = '已开通未注册'
              } else if (item.onlinePaySwitch === 1 && (item.accountApplicationStatus < 3 || item.accountApplicationStatus === null)) {
                item.onLineType = '未开通未注册'
              } else if (item.onlinePaySwitch === 1 && item.accountApplicationStatus >= 3) {
                item.onLineType = '未开通已注册'
              } else {
                item.onLineType = ''
              }
              return item
            })
          } else {
            this.accountList = []
          }
        }
      })
    },
    goback () {
      this.$router.push({name: 'Mine'})
    },
    relevance () { // 关联
      this.relevanceShow = true
    },
    cancelRelevanceDialog () { // 关联弹框取消
      this.relevanceShow = false
      this.logisticsObj.logisticsName = ''
      this.logisticsObj.logisticsId = ''
      this.logisticsObj.account = ''
      this.logisticsObj.password = ''
    },
    confirmRelevanceDialog (val) { // // 关联弹框确定
      let postData = {
        clientId: this.clientId,
        logisticsId: val.logisticsId,
        password: val.password,
        account: val.account
      }
      MyCenterAjax.bindingAssociation(postData).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '关联成功'
          })
          this.relevanceShow = false
          this.logisticsObj.logisticsName = ''
          this.logisticsObj.logisticsId = ''
          this.logisticsObj.account = ''
          this.logisticsObj.password = ''
          this.queryDetailInfo()
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    subimitClientCode (val) { // 提交客户编码
      MyCenterAjax.updateClientCode({clientCode: val}).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '保存成功'
          })
          this.queryDetailInfo()
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    validateClient (val) { // 校验客户编码
      if (val === null || val === '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '编码不能为空'
        })
      } else {
        if (val.length > 19) {
          this.$vux.toast.show({
            type: 'warn',
            text: '编码不符合规范'
          })
        } else {
          MyCenterAjax.checkClientCodeRepeat({clientCode: val}).then(res => {
            if (res.code === 200) {
              if (res.data) {
                this.$vux.toast.show({
                  type: 'warn',
                  text: '编码重复，请您重新填写'
                })
              } else {
                this.subimitClientCode(val)
              }
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: res.message
              })
            }
          })
        }
      }
    },
    cancelRelevance (val) { // 取消关联
      MyCenterAjax.unlinkAssociation({littleClientId: val}).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '取消成功'
          })
          this.queryDetailInfo()
        }
      })
    },
    codeInputFocus () { // 客户编码聚焦
      this.hintShow = true
    },
    codeInputBlur () { // 客户编码失焦
      this.hintShow = false
    },
    inputIdNumber (val) {
      let newVal = val.replace(/[^\d]/g, '')
      this.userInfo.clientCode = newVal
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.user-info{
  height: 100%;
  width: 100%;
  .info {
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #fff;
    .userIcon {
      width: 100%;
      height: 180px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-top: 1px solid #eee;
      .icon-left {
        width: 180px;
        height: 100px;
        line-height: 100px;
        .mixin-sc(30px;#2b2b2b);
      }
      .icon-right{
        width: 130px;
        height: 130px;
        background: #fff;
        border-radius: 50%;
        border: 2px solid #eee;
        margin-left: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../image/logo.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .codeBox {
      width: 100%;
      height: 90px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-top: 1px solid #eee;
      .code-left {
        width: 180px;
        height: 90px;
        line-height: 90px;
        .mixin-sc(30px;#2b2b2b);
      }
      .code-right {
        display: flex;
        margin-left: 50px;
        align-items: center;
        .van-icon {
          margin-left: 10px;
          height: 90px;
          line-height: 90px;
        }
      }
    }
    .hintBox {
      width: 100%;
      height: 70px;
      line-height: 70px;
      text-align: center;
      background-color: #fff;
      border-top: 1px solid #eee;
      .mixin-sc(28px;#ff0000);
    }
    .relevanceBox {
      width: 100%;
      height: auto;
      background-color: #fff;
      .box-wrap {
        width: 100%;
        height: auto;
        margin-top: 2px;
        border-top: 1px solid #eee;
        .b-header {
          width: 100%;
          height: 90px;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #F3F4F5;
        }
        .h-left {
          width: 180px;
          height: 90px;
          line-height: 90px;
          .mixin-sc(30px;#000);
        }
        .h-right {
          width: 160px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          border-radius: 30px;
          border: 2px solid #ff0033;
          .mixin-sc(28px;#ff0000);
        }
        .b-content {
          min-height: 270px;
        }
      }
    }
  }
}
</style>

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
    .vux-header-right{
      top: 0px!important;
      .choose-btn{
        width: 110px;
        height: 85px;
        display: flex;
        align-items: center;
        .r-icon {
          width: 40px;
          height: 40px;
          background: url('../../image/relevance.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .r-text {
          width: 70px;
          height: 80px;
          // text-align: right;
          line-height: 80px;
          .mixin-sc(30px;@color-extrude);
        }
      }
    }
  }
  .weui-cells {
    margin-top: 0;
  }
  .weui-cell{
    min-height: 90px;
    padding: 0 30px;
    .vux-cell-bd {
      width: 180px;
      flex: none;
    }
    p {
      // width: 180px;
    }
    label{
      .mixin-sc(30px;#2b2b2b);
    }
    .weui-cell__ft{
      margin-left: 50px;
      text-align: left;
      .mixin-sc(28px;#676767);
    }
  }
  .van-cell {
    height: 70px;
    width: 330px;
    padding: 15px;
    border: 2px solid #ddd;
    .van-cell__value--alone {
      height: 100%;
    }
    input {
      height: 40px;
      width: 100%;
      line-height: 40px;
      display: inline-block;
    }
    .van-field__body {
      height: 100%;
      .mixin-sc(28px;#676767);
      /* WebKit browsers */
      input::-webkit-input-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Mozilla Firefox 19+ */
      input::-moz-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Internet Explorer 10+ */
      input:-ms-input-placeholder {
        .mixin-sc(28px;#676767);
      }
    }
  }
  .code{
    width: 60px;
    height: 60px;
    margin-left: 80px;
    div{
      width: 100%;
      height: 100%;
      canvas{
        width: 100%;
        height: 100%;
      }
      img{
        display: block;
        width: 100%!important;
        height: 100%!important;
      }
    }
  }
  .QRcodeStyle {
    position: relative;
    p{
      .mixin-sc(34px;#333);
      text-align: center;
      margin-bottom: 80px;
    }
    .van-dialog {
      width: 100%;
      height: 100%;
      .van-dialog__content{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        div{
          width: 500px;
          height: 500px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .close{
      display: block;
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      position: absolute;
      top: 30px;
      right: 30px;
      .mixin-sc(40px;#000);
    }
  }
}
</style>
