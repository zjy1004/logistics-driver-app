<template>
  <div class="register">
    <!-- 注册页 -->
    <div class="register" v-if="pageShow === 1 || pageShow === 2">
      <!-- 企业信息头部 -->
      <x-header @on-click-back="goback(pageShow)"
        title="驮付宝注册"
        :left-options="{backText: '', preventGoBack: true}"
      />
      <!-- 进度条 -->
      <div class="progress">
        <x-progress :percent="progressWidth" :show-cancel="false"></x-progress>
      </div>
      <!-- 个人信息提示 -->
      <div  v-if="pageShow === 2" class="hint">
        <i class="iconfont icon-gantanhao"></i>
        该页填写信息必须和提款银行卡开卡人信息一致
      </div>
      <!-- 企业信息 -->
      <div v-if="pageShow === 1" class="companyInfo">
        <div class="content">
          <div class="c-title">
            填写企业信息
          </div>
          <!-- 证件类型 -->
          <div class="c-label">
            <span class="warn">*</span>证件类型
          </div>
          <div class="c-idType">
            <select name="" id="selector" v-model="registerParam.registerType">
              <option :key="index" v-for="(item, index) in idTypeList" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <!-- 企业名称 -->
          <div class="c-label">
           <span class="warn">*</span>企业名称
          </div>
          <div class="c-inputWarp">
            <van-field  v-model.trim="registerParam.companyName" placeholder="请输入企业名称" />
            <!-- <x-input type="text" v-model="registerParam.companyName" placeholder="请输入企业名称"></x-input> -->
          </div>
          <!-- 营业执照注册号 -->
          <div v-if="this.registerParam.registerType === 3">
            <div class="c-label">
              <span class="warn">*</span>营业执照注册号
            </div>
            <div class="c-inputWarp">
              <x-input type="text" :max="15" v-model="registerParam.businessLicenseNumber" placeholder="请输入营业执照注册号"></x-input>
            </div>
          </div>
          <!-- 统一社会信用代码证 -->
          <div v-if="this.registerParam.registerType === 1">
            <div class="c-label">
              <span class="warn">*</span>统一社会信用代码证
            </div>
            <div class="c-inputWarp">
              <x-input type="text" :max="18" v-model="registerParam.socialCreditCode" placeholder="请输入统一社会信用代码证"></x-input>
            </div>
          </div>
          <!-- 经营地址 -->
          <div class="c-label">
            <span class="warn">*</span>经营地址
          </div>
           <!-- 经营区域 -->
          <div class="c-address">
            <group>
              <x-address title="所在区域" v-model="registerParam.businessAreaCodeData" :list="addressData"></x-address>
            </group>
          </div>
          <div class="c-detailAddress">
            <group>
              <x-textarea placeholder="请输入详细的经营地址" v-model="registerParam.businessAddress"></x-textarea>
            </group>
          </div>
          <div class="c-label">
            <span class="warn">注:&nbsp;请根据实际情况选择证照类型</span>
          </div>
        </div>
        <div class="footer">
          <button class="f-button" :class="{'disabled-class': !componyButtonDisabed}" :disabled="!componyButtonDisabed" @click="nextPersonInfo()">下一步</button>
        </div>
      </div>
      <!-- 个人信息 -->
      <div v-if="pageShow === 2" class="companyInfo">
        <div class="content">
          <div class="c-title">
            填写个人信息
          </div>
          <!-- 身份证号码 -->
          <div class="c-label">
            <span class="warn">*</span>身份证号码
          </div>
          <div class="c-inputWarp" v-if="this.registerParam.registerType === 4">
            <van-field @keyup.native="inputIdNumber()" v-model="registerParam.idNumber" placeholder="请输入身份证号码" />
            <!-- <x-input type="text" v-model="registerParam.idNumber" placeholder="请输入身份证号码"></x-input> -->
          </div>
          <div class="c-inputWarp" v-else>
            <van-field @keyup.native="inputIdNumber()" v-model="registerParam.idNumber" placeholder="请输入法人身份证号码" />
            <!-- <x-input type="text" v-model="registerParam.idNumber" placeholder="请输入法人身份证号码"></x-input> -->
          </div>
          <!-- 姓名 -->
          <div class="c-label">
            <span class="warn">*</span>姓名
          </div>
          <div class="c-inputWarp" v-if="this.registerParam.registerType === 4">
            <van-field @keyup.native="inputName()" v-model="registerParam.name" placeholder="请输入姓名" />
            <!-- <x-input type="text" v-model="registerParam.name" placeholder="请输入姓名"></x-input> -->
          </div>
          <div class="c-inputWarp" v-else>
            <van-field @keyup.native="inputName()" v-model="registerParam.name" placeholder="请输入法人姓名" />
            <!-- <x-input type="text" v-model="registerParam.name" placeholder="请输入法人姓名"></x-input> -->
          </div>
          <!-- 手机号码 -->
          <div class="c-label">
            <span class="warn">*</span>手机号码
          </div>
          <div class="c-inputWarp" v-if="this.registerParam.registerType === 4">
            <!-- <van-field @keyup.native="inputPhone()" v-model="registerParam.phone" placeholder="请输入手机号码" /> -->
            <x-input type="tel" mask="999 9999 9999" is-type="china-mobile" :max="13" v-model="registerParam.phone" placeholder="请输入手机号码"></x-input>
          </div>
          <div class="c-inputWarp" v-else>
            <!-- <van-field @keyup.native="inputPhone()" v-model="registerParam.phone" placeholder="请输入法人手机号码" /> -->
            <x-input type="tel" mask="999 9999 9999" is-type="china-mobile" :max="13" v-model="registerParam.phone" placeholder="请输入法人手机号码"></x-input>
          </div>
          <div class="c-label">
            <span class="warn">重要提醒:&nbsp;该页填写信息必须和提款银行卡开卡人信息一致</span>
          </div>
          <!-- 协议 -->
          <div class="c-agreement">
            <!-- <input type="checkbox" v-model="isCheck"> -->
            <van-checkbox shape="square" v-model="isCheck"></van-checkbox>
            <span class="title">已阅读并同意</span>
            <span class="check-common" @click="handleToClause()">《量子金福平台服务协议》</span>
          </div>
        </div>
        <div class="footer">
          <button class="f-button" :class="{'disabled-class': !personButtonDisabed}" :disabled="!personButtonDisabed" @click="nextRegister()">立即注册</button>
        </div>
      </div>
    </div>
    <!-- 协议展示页 -->
    <div class="agreement" v-if="pageShow === 3">
      <div class="c-header">
        <div @click="returnRegister()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title">量子金福平台服务协议</div>
        <div class="c-h-right"></div>
      </div>
      <div class="line"></div>
      <iframe class="pageStyle" :srcdoc="RegistrationAgreement"></iframe>
      <div class="footer"></div>
    </div>
    <!-- <div v-transfer-dom>
      <confirm v-model="showRegister"
        :confirm-text="'立即注册'"
        :cancel-text="'暂不注册'"
        @on-cancel="showRegister = false"
        @on-confirm="onConfirm">
        <p style="text-align:center;"></p>
      </confirm>
    </div> -->
  </div>
</template>

<script>
import { XHeader, XProgress, XInput, XAddress, Group, XTextarea, Confirm } from 'vux'
import { Checkbox, CheckboxGroup, Field } from 'vant'
import PayRegisterAjax from '@/api/PayRegister/PayRegister'
import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'CardBag',
  components: {
    XHeader,
    XProgress,
    XInput,
    XAddress,
    Group,
    XTextarea,
    Confirm,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Field.name]: Field
  },
  data () {
    return {
      registerDisabled: true,
      progressWidth: 33, // 进度条值
      isCheck: false, // 协议复选框判断
      pageShow: 1, // 判断页显示
      componyInfoShow: true, // 判断企业信息显示
      RegistrationAgreement: '', // 协议内容
      registerParam: { // 注册表单
        registerType: 4, // 证照类型
        companyName: '', // 企业名称
        businessAreaCodeData: [],
        businessAreaCode: '', // 经营区域
        businessAddress: '', // 经营详细地址
        businessLicenseNumber: '', // 个体工商营业执照
        socialCreditCode: '', // 统一社会信用代码证
        name: '', // 姓名
        idNumber: '', // 身份证号
        phone: '' // 手机号码
      },
      addressData: [], // 获取区域list
      idTypeList: [ // 企业类型list
        {
          id: 4,
          name: '个人'
        },
        {
          id: 3,
          name: '个体工商营业执照'
        },
        {
          id: 1,
          name: '统一社会信用代码证'
        }
      ]
    }
  },
  created () {
    this.queryArea()
  },
  methods: {
    inputIdNumber () {
      this.registerParam.idNumber = this.replaceIdNum(this.registerParam.idNumber)
    },
    inputName () {
      this.registerParam.name = this.replaceNbsp(this.registerParam.name)
      this.registerParam.companyName = this.replaceNbsp(this.registerParam.companyName)
    },
    inputPhone () {
      this.registerParam.phone = this.validateNum(this.registerParam.phone)
    },
    // validate (val) {
    //   let res = this.validateIdentityCardNum(val)
    //   if (res.result) {
    //     return {valid: true}
    //   } else {
    //     return {valid: false, msg: res.message}
    //   }
    // },
    queryArea () { // 获取区域
      PayRegisterAjax.queryArea().then(res => {
        if (res.code === 200) {
          this.addressData = res.data
        }
      })
    },
    nextPersonInfo () { // 下一步个人信息
      if (this.registerParam.registerType === 4) {
        this.progressWidth = 66
        this.pageShow = 2
        this.QueryDetail()
      }
      if (this.registerParam.registerType === 3) {
        if (this.registerParam.businessLicenseNumber.length !== 15) {
          this.$vux.toast.show({
            type: 'warn',
            text: '营业执照号不合法'
          })
        } else {
          this.progressWidth = 66
          this.pageShow = 2
          this.QueryDetail()
        }
      }
      if (this.registerParam.registerType === 1) {
        if (this.registerParam.socialCreditCode.length !== 18) {
          this.$vux.toast.show({
            type: 'warn',
            text: '统一社会信用代码证不合法'
          })
        } else {
          this.progressWidth = 66
          this.pageShow = 2
          this.QueryDetail()
        }
      }
    },
    handleToClause () { // 协议展示
      this.pageShow = 3
    },
    goback (type) {
      if (type === 2) {
        this.pageShow = 1
        this.progressWidth = 33
      }
      if (type === 1) {
        this.$router.go(-1)
      }
    },
    returnRegister () { // 协议返回注册
      this.pageShow = 2
    },
    nextRegister () { // 下一步注册
      this.registerDisabled = false
      this.registerParam.phone = this.registerParam.phone.split(' ').join('')
      if (this.registerParam.businessAreaCodeData[2].length !== 6) {
        if (this.registerParam.businessAreaCodeData[1].length !== 6) {
          this.registerParam.businessAreaCode = this.registerParam.businessAreaCodeData[0]
        }
      } else {
        this.registerParam.businessAreaCode = this.registerParam.businessAreaCodeData[2]
      }
      if (!this.isIdNumberAvailable(this.registerParam.idNumber) && this.isPoneAvailable(this.registerParam.phone)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '身份证号码错误'
        })
        this.registerDisabled = true
      }
      if (this.isIdNumberAvailable(this.registerParam.idNumber) && !this.isPoneAvailable(this.registerParam.phone)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码错误'
        })
        this.registerDisabled = true
      }
      if (!this.isIdNumberAvailable(this.registerParam.idNumber) && !this.isPoneAvailable(this.registerParam.phone)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '身份证和手机号码错误'
        })
        this.registerDisabled = true
      }
      if (this.isIdNumberAvailable(this.registerParam.idNumber) && this.isPoneAvailable(this.registerParam.phone)) {
        this.register()
      }
    },
    register () { // 注册请求
      PayRegisterAjax.register(this.registerParam).then(res => {
        if (res.code === 200) {
          this.progressWidth = 100
          this.$router.push({name: 'Treasure', query: {from: 'register'}})
        } else {
          this.registerDisabled = true
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    QueryDetail () { // 查询登录协议
      CommonAxios.QueryRegistrationAgreement({protocolType: 3}).then((response) => {
        if (response.code === 200) {
          this.RegistrationAgreement = response.data.protocolContent
        }
      })
    },
    isPoneAvailable (tel) { // 手机号校验
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(tel)) {
        return false
      } else {
        return true
      }
    },
    isIdNumberAvailable (idNo) { // 身份证号码校验
      let res = this.validateIdentityCardNum(idNo)
      if (!res.result) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    isCheck (newVal, oldVal) {
    }
  },
  computed: {
    componyButtonDisabed () { // 企业信息button禁用
      if (this.registerParam.registerType === 4) {
        return this.registerParam.companyName !== '' &&
        this.registerParam.businessAreaCodeData.length > 0 &&
        this.registerParam.businessAddress !== ''
      }
      if (this.registerParam.registerType === 3) {
        return this.registerParam.companyName !== '' &&
        this.registerParam.businessAreaCodeData.length > 0 &&
        this.registerParam.businessAddress !== '' &&
        this.registerParam.businessLicenseNumber !== ''
      }
      if (this.registerParam.registerType === 1) {
        return this.registerParam.companyName !== '' &&
        this.registerParam.businessAreaCodeData.length > 0 &&
        this.registerParam.businessAddress !== '' &&
        this.registerParam.socialCreditCode !== ''
      }
    },
    personButtonDisabed () { // 个人信息button禁用
      return this.registerParam.name !== '' &&
      this.registerParam.idNumber !== '' &&
      this.registerParam.phone !== '' &&
      this.isCheck &&
      this.registerDisabled
    }
  }
}
</script>

<style scope lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.register{
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
  .c-header {
      height: 90px;
      width: 100%;
      display: flex;
      background-color: #fff;
      position: relative;
      .c-h-left {
        width: 100px;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .c-h-title {
        width: 100%;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #24282E;
        font-weight: 500;
      }
      .c-h-right {
        width: 100px;
        height: 90px;
        line-height: 88px;
        text-align: center;
      }
    }
  .progress {
    height: 8px;
    width: 100%;
  }
  .hint {
    width: 100%;
    height: 70px;
    text-align: center;
    line-height: 70px;
    background-color: #F7F0DA;
    color: #F57017;
    font-size: 24px;
    .iconfont {
      font-size: 26px;
    }
  }
  .companyInfo {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
    .content {
      width: 100%;
      height: 100%;
      padding: 55px 40px;
      // margin-top: 55px;
      overflow: auto;
      .warn {
        color: red;
        font-size: 26px;
      }
      .c-title {
        color: #24282E;
        font-size: 50px;
        font-weight: 500;
        margin-bottom: 80px;
      }
      .c-label {
        width: 100%;
        height: auto;
        font-size: 28px;
        color: #24282E;
        margin-bottom: 25px;
      }
      .c-idType {
        width: 100%;
        height: 80px;
        margin-bottom: 45px;
        select {
          width: 100%;
          height: 100%;
          border: none;
          border: solid 1px #DDDDDD;
          outline: none;
          background-color: #fff;
          color: #24282E;
          font-size: 26px;
          padding-left: 20px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          background: url("../../image/full-arrowdown.png") no-repeat scroll center transparent;
          background-position-x: 600px;
          padding-right: 30px;
        }
      }
      .c-inputWarp {
        height: 80px;
        width: 100%;
        margin-bottom: 20px;
      }
      .c-address {
        height: 80px;
        width: 100%;
        margin-bottom: 30px;
      }
      .c-detailAddress {
        height: 160px;
        width: 100%;
        margin-bottom: 30px;
      }
      .c-agreement {
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        // input[type='checkbox']{
        //   width: 30px;
        //   height: 30px;
        //   display: block;
        //   background-color: #fff;
        //   // -webkit-appearance:none;
        //   border: 2px solid #aaa;
        //   border-radius: 2px;
        //   outline: none;
        //   margin: 0
        // }
        span {
          display: block;
          margin-left: 10px;
        }
        .title {
          font-size: 26px;
          color: #24282E
        }
        .common {
          color: #B1B5BA;
          font-size: 26px;
        }
        .check-common {
          color: #F71A1A;
          font-size: 26px;
        }
      }
    }
    .footer {
      height: 170px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      button {
        height: 100px;
        width: 670px;
        outline: none;
        border: none;
        line-height: 100px;
        text-align: center;
        background-color: #4A7FE8;
        color: #FFFFFF;
        font-size: 30px;
        border-radius:10px;
      }
      .disabled-class{
        background: #ccc;
      }
    }
  }
  // 协议展示css
  .agreement {
    display: flex;
    flex: 1;
    background: #fff!important;
    flex-direction: column;
    .c-header {
      height: 90px;
      width: 100%;
      display: flex;
      background-color: #fff;
      position: relative;
      .c-h-left {
        width: 100px;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .c-h-title {
        width: 100%;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #24282E;
        font-weight: 500;
      }
      .c-h-right {
        width: 100px;
        height: 90px;
        line-height: 88px;
        text-align: center;
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
    .pageStyle{
      display: flex;
      flex: 1;
    }
    iframe{
      overflow-y: scroll;
    }
  }
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.register{
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
  .progress {
    .weui-progress {
      height: 100%;
      .weui-progress__bar {
        height: 100%;
        .weui-progress__inner-bar {
          background-color: #4A7FE8;
        }
      }
    }
  }
  .weui-cell {
    width: 100%;
    height: 100%;
    border: solid 1px #DDDDDD;
    padding-right: 30px;
    .weui-input {
      color: #24282E;
      font-size: 26px;
    }
    /* WebKit browsers */
    input::-webkit-input-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    .weui-icon-clear {
      font-size: 26px;
    }
  }
  .weui-cells {
    margin-top: 0;
  }
  .vux-cell-box {
    height: 80px;
    width: 100%;
    .weui-label {
      color: #AFB4BB;
      font-size: 26px;
    }
    .vux-popup-picker-select-box {
      margin-right: 20px;
      span {
        color: #AFB4BB;
        font-size: 26px;
      }
    }
    .weui-cell__ft:after{
      border-color: #AFB4BB !important;
      margin-top: -8px !important;
   }
  }
  .c-detailAddress .weui-cells {
    margin-top: 0;
    height: 160px;
    width: 100%;
    .weui-textarea {
      color: #AFB4BB;
      font-size: 26px;
      height: 100%;
      width: 100%;
    }
  }
  .van-checkbox {
    // width: 50px;
    // height: 50px;
    .van-checkbox__icon {
      width: 30px;
      height: 30px;
      .van-icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .van-cell {
    height: 100%;
    border: 1px solid #DDDDDD;
    .van-field__body {
      height: 100%;
      color: #24282E;
      font-size: 26px;
      /* WebKit browsers */
    input::-webkit-input-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
    color: #AFB4BB;
    font-size: 26px;
    }
    }
  }
}
</style>
