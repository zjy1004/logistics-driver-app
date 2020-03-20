<template>
  <div class="bindCard">
    <!-- 绑卡页 -->
    <div class="bindCard" v-if="pageShow === 1">
      <x-header
        @on-click-back="goback('bind')"
        title="绑定银行卡"
        :left-options="{backText: '', preventGoBack: true}"
      />
      <div class="line"></div>
      <div class="contentWrap">
        <div class="content">
          <div class="top">
            <div class="t-top">
              <div class="t-left"><span class="warn">*</span>账户类型</div>
              <van-radio-group v-model="bindParam.certificationType">
                <van-radio name="1" :disabled="radioDisabled">对私</van-radio>
                <van-radio name="0" :disabled="!radioDisabled">对公</van-radio>
              </van-radio-group>
            </div>
            <div class="t-line"></div>
            <div class="t-bottom"><i class="iconfont icon-jingshi"></i>&nbsp;选择并绑定账户类型后不可修改，请慎重选择</div>
          </div>
          <div class="middle">
            <!-- 认证方式 -->
            <div class="liWrap" v-if="bindParam.certificationType === '1'">
              <div class="c-label">
                认证方式
             </div>
              <div class="c-idType">
                <select :disabled="cardInfoDisabled" name="" id="selector" v-model="bindParam.authenticationMethod" >
                  <option :key="index" v-for="(item, index) in idTypeList" :value="item.id">{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="liSpanWrap" v-if="bindParam.authenticationMethod === '1' && bindParam.certificationType === '1'">通过短信验证码验证身份</div>
            <div class="liSpanWrap" v-if="bindParam.authenticationMethod === '0' && bindParam.certificationType === '1'">银行会向您的账户支付小于1元的验证金额</div>
            <!-- 姓名 -->
            <div class="liWrap" v-if="bindParam.certificationType === '1'">
              <div class="c-label">
                <span class="warn">*</span>姓名
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :disabled="true" v-model="bindParam.name" placeholder="请输入您的姓名"></x-input>
              </div>
            </div>
            <!-- 身份证号码 -->
            <div class="liWrap" v-if="bindParam.certificationType === '1'">
              <div class="c-label">
                <span class="warn">*</span>身份证号
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :disabled="true" v-model="bindParam.idNumber" placeholder="请输入您的身份证号"></x-input>
              </div>
            </div>
            <!-- 账户名称 -->
            <div class="liWrap" v-if="bindParam.certificationType === '0'">
              <div class="c-label">
                账户名称
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :disabled="true" v-model="bindParam.account" placeholder=""></x-input>
              </div>
            </div>
            <!-- 手机号码 -->
            <div class="liWrap">
              <div class="c-label">
                <span class="warn">*</span>手机号码
              </div>
              <div class="c-inputWarp">
                <van-field :disabled="cardInfoDisabled" @keyup.native="inputName()" v-model="bindParam.phone" placeholder="请输入手机号码" />
                <!-- <x-input type="tel" :disabled="cardInfoDisabled" :max="13" v-model="bindParam.phone" placeholder="请输入您的手机号"></x-input> -->
              </div>
            </div>
            <div class="liSpanWrap">此手机号为银行卡预留手机号</div>
          </div>
          <div class="bottom">
            <!-- 银行卡号 -->
            <div class="liWrap">
              <div class="c-label">
                <span class="warn">*</span>银行卡号
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :disabled="cardInfoDisabled" :min="12" :max="19" v-model="bindParam.bankCardNumbers" placeholder="请输入银行卡号"></x-input>
              </div>
            </div>
            <div class="liSpanWrap">此账户将绑定为提款账户，请填写正确</div>
            <!-- 银行名称 -->
            <div class="liWrap">
              <div class="c-label">
                <span class="warn">*</span>银行名称
              </div>
              <button :disabled="cardInfoDisabled" class="c-inputWarp" @click="searchPageShow(2)">
                <x-input type="text" :disabled="true" v-model="bindParam.bankName" placeholder="请选择银行名称"></x-input>
              </button>
            </div>
            <!-- 开户行区域 -->
            <div class="areaLiWrap">
              <div class="c-label">
                <span class="warn">*</span>开户行区域
              </div>
              <div class="c-bankArea">
                <selector :readonly="cardInfoDisabled" class="self" placeholder="请选择省" :value-map="valueMap" v-model="areaForm.provinceCode" :options="areaOBj.areaPList"></selector>
                <selector :readonly="cardInfoDisabled" v-show="cityShow" class="self" placeholder="请选择市" :value-map="valueMap" v-model="areaForm.cityCode" :options=" areaOBj.areaCList"></selector>
                <selector :readonly="cardInfoDisabled" v-show="areaShow" class="self" placeholder="请选择区" :value-map="valueMap" v-model="areaForm.areaCode" :options="areaOBj.areaAList"></selector>
              </div>
            </div>
            <!-- 开户银行 -->
            <div class="liWrap">
              <div class="c-label">
                <span class="warn">*</span>开户银行
              </div>
              <button :disabled="cardInfoDisabled" class="c-inputWarp" @click="searchPageShow(3)">
                <x-input type="text" :disabled="true" v-model="bindParam.openAccountBank" placeholder="请选择开户行"></x-input>
              </button>
            </div>
             <!-- 银联号 -->
            <div class="liWrap">
              <div class="c-label">
                银联号
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :disabled="true" v-model="bindParam.unionPayNumber" placeholder="银联号"></x-input>
              </div>
            </div>
            <div class="liSpanWrap">重要提醒：提现银行开卡人信息必须和虚拟账户注册信息相同，否则无法提款</div>
            <!-- 验证码 -->
            <div class="liWrap" v-if="bindParam.authenticationMethod === '1' && bindParam.certificationType === '1'">
              <div class="c-label">
                验证码
              </div>
              <div class="c-inputWarp">
                <x-input type="text" :max="6" v-model="bindParam.messageCode" placeholder="请输入验证码"></x-input>
              </div>
              <div class="getMsg" v-show="timeShow">
                <button @click="getMessageCode()" :class="{'disabled-getMsg': !getMsgDisabled}" :disabled="!getMsgDisabled">获取验证码</button>
              </div>
               <div class="getCountDown" v-show="!timeShow">发送成功({{timeNum}}s)</div>
            </div>
             <!-- 小额 -->
            <div class="liWrap" v-if="bindParam.authenticationMethod === '0' || bindParam.certificationType === '0'">
              <div class="c-label">
                到账金额
              </div>
               <div class="c-inputWarp">
                  <van-field @keyup.native="inputCheckAmount()" v-model="bindParam.checkAmount" placeholder="请输入验证金" />
                <!-- <x-input type="text" :max="6" v-model="bindParam.checkAmount" placeholder="请输入验证金"></x-input> -->
              </div>
              <div class="getMsg" v-show="moneyShow">
                <button  @click="AccountBindCard()" :class="{'disabled-getMsg': !getMsgDisabled}" :disabled="!getMsgDisabled">获取验证金</button>
              </div>
              <div class="getCountDown" v-show="!moneyShow">验证金已获取</div>
            </div>
            <div class="liSpanWrap" v-if="bindParam.authenticationMethod === '0' || bindParam.certificationType === '0'">重要提醒：银行会向您的账户支付小于1元的验证金额，请输入银行账户实际到账金额，为了保证账户安全，最多只能尝试3次</div>
          </div>
        </div>
        <div class="footer">
          <button class="f-button" @click="confirmShow()" :class="{'disabled-class': !buttonDisabed}" :disabled="!buttonDisabed">立即绑卡</button>
        </div>
      </div>
    </div>
    <!-- loading -->
    <div class="loading" v-if="loadingShow">
      <spinner type="ios" size="60px"></spinner>
    </div>
     <!-- 银行明名称列表 -->
    <div class="searchPage" v-if="pageShow === 2">
      <div class="c-header">
        <div @click="returnRegister()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title">绑定银行卡</div>
        <div class="c-h-right"></div>
      </div>
      <div class="line"></div>
      <div class="search">
        <div class="searchBox">
          <search
            v-model="bankNameSearchValue"
            position="absolute"
            placeholder="请输入开户行名称"
            :auto-fixed="a"
            @on-submit="bankNameOnSubmit"
            @on-change="bankNameChange"
            @on-cancel="bankNameOnCancel"
            @on-clear="bankNameOnClear"
            :auto-scroll-to-top=true
            ref="bankNameSearch"
          ></search>
        </div>
        <div class="searchContent">
          <div class="c-list"  v-show="bankNameArrData.length > 0" @click="checkBankName(item)" :key="index" v-for="(item, index) in bankNameArrData">{{item.bankName}}</div>
          <div class="no-list" v-show="bankNameArrData.length === 0">该银行暂未支持驮付宝绑定业务，请重新搜索</div>
        </div>
      </div>
    </div>
    <!-- 开户行列表 -->
    <div class="searchPage" v-if="pageShow === 3">
      <div class="c-header">
        <div @click="returnRegister()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title">绑定银行卡</div>
        <div class="c-h-right"></div>
      </div>
      <div class="line"></div>
      <div class="search">
        <div class="searchBox">
          <search
            v-model="accountBankSearchValue"
            position="absolute"
            placeholder="请输入开户行名称"
            :auto-fixed="a"
            @on-submit="accountBankOnSubmit"
            @on-change="accountBankChange"
            @on-cancel="accountBankOnCancel"
            @on-clear="accountBankOnClear"
            :auto-scroll-to-top=true
            ref="accountBankSearch"
          ></search>
        </div>
        <div class="searchContent">
          <div class="c-list" v-show="openAccountBankArrData.length > 0" @click="checkAccountBank(item)" :key="index" v-for="(item, index) in openAccountBankArrData">{{item.openAccountBank}}</div>
          <div class="no-list" v-show="openAccountBankArrData.length === 0">该银行暂未支持驮付宝绑定业务，请重新搜索</div>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
        :confirm-text="'立即绑定'"
        :cancel-text="'暂不绑定'"
        @on-cancel="showConfirm = false"
        @on-confirm="onConfirm">
        <p style="text-align:center;">请确定是否绑定</p>
      </confirm>
    </div>
     <!-- 重新绑卡 -->
    <div v-transfer-dom>
      <confirm v-model="showReBind"
        :confirm-text="'重新绑定'"
        @on-cancel="showReBind = false"
        @on-confirm="onConfirmRebind">
        <p style="text-align:center;">输入错误次数过多，请重新绑卡</p>
      </confirm>
    </div>
    <!-- 是否鉴权 -->
    <!-- <div v-transfer-dom>
      <confirm v-model="showAuthConfirm"
        :confirm-text="'继续认证'"
        :cancel-text="'重新绑卡'"
        @on-cancel="showAuthConfirm = false"
        @on-confirm="onConfirmAuth">
        <p style="text-align:center;">该账户存在银行卡正在进行身份认证是否继续进行认证</p>
      </confirm>
    </div> -->
  </div>
</template>

<script>
import { XHeader, XProgress, XInput, XAddress, Group, XTextarea, Search, Selector, Spinner, Confirm, TransferDom } from 'vux'
import { RadioGroup, Radio, Loading, Field } from 'vant'
import RegisterLogisticsPayAndBindingCard from '@/api/BindCard/BindCard'
import CommonAxios from '@/api/Common/CommonAxios'
import CountDown from '@/components/CountDown/CountDown'
// import { clearInterval } from 'timers'
// import { clearInterval } from 'timers';
export default {
  name: 'CardBag',
  components: {
    XHeader,
    XProgress,
    XInput,
    XAddress,
    Group,
    XTextarea,
    Search,
    Selector,
    Spinner,
    Confirm,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Loading.name]: Loading,
    [Field.name]: Field,
    CountDown
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      // goBack: '',
      routerFrom: '',
      pageShow: 1, // 判断协议页显示
      accountBankSearchValue: '', // 开户行搜索值
      bankNameSearchValue: '', // 银行名称搜索值
      a: false,
      timeShow: true,
      timeNum: '',
      // showAuthConfirm: false,
      showReBind: false,
      radioDisabled: false,
      showConfirm: false,
      cardInfoDisabled: false,
      moneyShow: true,
      cityShow: false,
      areaShow: false,
      loadingShow: false,
      bindParam: {
        certificationType: '1', // 绑定银行卡类型0对公1对私
        authenticationMethod: '1', // 认证方式 1短信 0小额
        name: '', // 姓名
        idNumber: '', // 身份证号
        account: '', // 账户名称
        phone: '', // 手机号
        bankCardNumbers: '', // 银行卡号
        bankName: '', // 银行名称(超级网银银行名)
        openAccountArea: '', // 开户行区域
        openAccountBank: '', // 开户行
        superNetSilverNumber: '', // 超级网银号隐藏字段
        unionPayNumber: '', // 银联号(大小额行号)
        messageCode: '', // 银行名称(超级网银银行名)
        checkAmount: '', // 银行名称(超级网银银行名)
        pbId: '',
        pbCode: '',
        bankRefCode: ''
      },
      pbId: {
        pbId: ''
      }, // 绑卡成功返回的银行卡id
      areaOBj: {
        areaPList: [], // 省
        areaCList: [], // 市
        areaAList: [] // 区
      },
      areaForm: {
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        areaInfo: ''
      },
      idTypeList: [ // 认证类型list
        {
          id: '1',
          name: '短信认证'
        },
        {
          id: '0',
          name: '小额转账认证'
        }
      ],
      openAccountBankArr: [
      ],
      openAccountBankArrData: [],
      bankNameArr: [],
      bankNameArrData: [],
      valueMap: ['areaCode', 'areaName']
    }
  },
  created () {
    this.QueryBankInfo()
    this.QueryLzBandBankCardProvince()
    this.getAccountInfo()
    this.queryBankCardInfo()
    this.routerFrom = this.$route.query.from
  },
  methods: {
    inputCheckAmount () {
      this.bindParam.checkAmount = this.bindParam.checkAmount.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    inputName () {
      this.bindParam.phone = this.replaceNbsp(this.bindParam.phone)
    },
    goback (type) {
      if (type === 'bind') {
        if (this.routerFrom === 'treasure') {
          this.$router.push({name: 'Treasure', query: {from: 'bindCard'}})
        } else {
          this.$router.go(-1)
        }
      }
    },
    // onConfirmAuth () {
    //   this.pageShow = 4
    // },
    onConfirmRebind () {
      this.$router.go(0)
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
    returnRegister () { // 返回绑卡
      this.pageShow = 1
      this.bankNameSearchValue = ''
      this.accountBankSearchValue = ''
    },
    searchPageShow (type) { // 页面显示
      if (type === 2) {
        this.pageShow = 2
        this.bankNameSearchValue = ''
        this.bankNameArrData = this.bankNameArr
        this.bindParam.area = ''
        this.bindParam.openAccountBank = ''
        this.bindParam.unionPayNumber = ''
        this.areaForm.provinceCode = ''
        this.areaForm.cityCode = ''
        this.areaForm.areaCode = ''
      }
      if (type === 3) {
        this.pageShow = 3
        this.accountBankSearchValue = ''
        this.openAccountBankArrData = this.openAccountBankArr
      }
    },
    bankNameChange () { // 银行名称搜索触发
      let searchResult = []
      this.bankNameArr.map(item => {
        if (item.bankName.includes(this.bankNameSearchValue)) {
          searchResult.push(item)
        }
      })
      this.bankNameArrData = searchResult
    },
    bankNameOnSubmit () { // 银行名称搜索提交
      this.$refs.bankNameSearch.setBlur()
      let searchResult = []
      this.bankNameArr.map(item => {
        if (item.bankName.includes(this.bankNameSearchValue)) {
          searchResult.push(item)
        }
      })
      this.bankNameArrData = searchResult
    },
    bankNameOnCancel () { // 银行名称搜索取消
      this.bankNameIsSearch = false
      this.openAccountBankArrData = this.openAccountBankArr
    },
    bankNameOnClear () { // 银行名称搜索清除
      this.bankNameIsSearch = false
      this.bankNameArrData = this.bankNameArr
    },
    checkBankName (item) { // 银行名称搜索选择
      this.pageShow = 1
      this.bindParam.bankName = item.bankName
      this.bindParam.superNetSilverNumber = item.superNetSilverNumber
      this.bindParam.bankRefCode = item.bankRefCode
    },
    accountBankChange () { // 开户行搜索触发
      let searchResult = []
      this.openAccountBankArr.map(item => {
        if (item.openAccountBank.includes(this.accountBankSearchValue)) {
          searchResult.push(item)
        }
      })
      this.openAccountBankArrData = searchResult
    },
    accountBankOnSubmit () { // 开户行搜索提交
      this.$refs.accountBankSearch.setBlur()
      let searchResult = []
      this.openAccountBankArr.map(item => {
        if (item.openAccountBank.includes(this.accountBankSearchValue)) {
          searchResult.push(item)
        }
      })
      this.openAccountBankArrData = searchResult
    },
    accountBankOnCancel () { // 开户行搜索取消
      this.accountBankIsSearch = false
      this.openAccountBankArrData = this.openAccountBankArr
    },
    accountBankOnClear () { // 开户行搜索清除
      this.accountBankIsSearch = false
      this.openAccountBankArrData = this.openAccountBankArr
    },
    checkAccountBank (item) { // 开户行搜索选择
      this.pageShow = 1
      this.bindParam.openAccountBank = item.openAccountBank
      this.bindParam.unionPayNumber = item.unionPayNumber
    },
    QueryBankInfo (val) { // 获取量子绑卡查询银行名称和超级网银号隐藏字段
      RegisterLogisticsPayAndBindingCard.QueryBankInfo(val).then(res => {
        if (res.code === 200) {
          this.bankNameArr = res.data
          this.bankNameArrData = this.bankNameArr
        }
      })
    },
    QueryLzBandBankCardProvince (val) { // 省
      RegisterLogisticsPayAndBindingCard.QueryLzBandBankCardProvince(val).then(res => {
        if (res.code === 200) {
          this.areaOBj.areaPList = res.data
        }
      })
    },
    QueryLzBandBankCardAreaAndUnionPay (val, flag) { // 获取量子绑卡省份以下列表和银联号
      RegisterLogisticsPayAndBindingCard.QueryLzBandBankCardAreaAndUnionPay(val).then(res => {
        if (res.code === 200) {
          if (res.data.dataType === '1') {
            if (flag === 'city') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.cityShow = false
              } else {
                this.cityShow = true
              }
              this.areaOBj.areaCList = res.data.areaCodeVoList
              this.openAccountBankArr = [] // 选择省份清空开户行
            }
            if (flag === 'area') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.areaShow = false
              } else {
                this.areaShow = true
              }
              this.areaOBj.areaAList = res.data.areaCodeVoList
              this.openAccountBankArr = []// 选择市清空开户行
            }
          }
          if (res.data.dataType === '2') {
            if (flag === 'city') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.cityShow = false
              } else {
                this.cityShow = true
              }
              // this.cityShow = false
              // this.areaShow = false
              this.openAccountBankArr = res.data.unionPayVoList
              this.openAccountBankArrData = this.openAccountBankArr
              // this.form1.openAccountBank = '' // 选择省份清空开户行
            }
            if (flag === 'area') {
              if (res.data.areaCodeVoList === null || res.data.areaCodeVoList.length === 0) {
                this.areaShow = false
              } else {
                this.areaShow = true
              }
              this.openAccountBankArr = res.data.unionPayVoList
              this.openAccountBankArrData = this.openAccountBankArr
            }
            if (flag === 'town') {
              this.openAccountBankArr = res.data.unionPayVoList
              this.openAccountBankArrData = this.openAccountBankArr
              // this.form1.openAccountBank = ''// 选择县区清空开户行
            }
          }
          if (res.data.dataType === '') {
            // this.cityShow = false
            // this.areaShow = false
          }
        }
      })
    },
    queryBankCardInfo () { // 查询银行卡信息
      CommonAxios.QueryBankInfo().then(res => {
        if (res.code === 200) {
          if (res.data !== null) {
            if (res.data.status === 1) {
              this.bindParam.pbId = res.data.pbId
              this.bindParam.pbCode = res.data.bankCard
              this.bindParam.bankCardNumbers = res.data.bankCard
              this.bindParam.openAccountBank = res.data.bankName
            }
          }
        }
      })
    },
    getAccountInfo () { // 资金账户绑卡查询账户信息
      RegisterLogisticsPayAndBindingCard.QueryFinaFundsAccountVo().then(res => {
        if (res.code === 200) {
          if (res.data.certificationType === 1) {
            this.radioDisabled = false
          } else {
            this.radioDisabled = true
          }
          this.bindParam.name = res.data.name
          this.bindParam.idNumber = res.data.idNumber
          this.bindParam.phone = res.data.phone
          this.bindParam.account = res.data.companyName
          this.bindParam.certificationType = res.data.certificationType.toString()
        }
      })
    },
    getMessageCode () { // 获取验证码
      if (this.bindParam.pbId === '') {
        this.loadingShow = true
        this.AccountBindCard()
      }
      if (this.bindParam.pbId !== '') {
        this.nextMessageCode()
      }
    },
    AccountBindCard () { // 资金账户绑卡
      RegisterLogisticsPayAndBindingCard.FundAccountBindBankCard(this.bindParam).then(res => {
        if (res.code === 200) {
          this.loadingShow = false
          this.cardInfoDisabled = true
          this.moneyShow = false
          this.getCountDown()
          this.$vux.toast.show({
            type: 'success',
            text: '发送成功'
          })
          this.pbId.pbId = res.data.pb_id
          this.bindParam.pbId = this.pbId.pbId
          this.bindParam.pbCode = this.bindParam.bankCardNumbers
        } else {
          this.loadingShow = false
          this.moneyShow = true
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    nextMessageCode () { // 绑卡四要素鉴权重发
      RegisterLogisticsPayAndBindingCard.FundAccountResendMessageCode(this.pbId).then(res => {
        if (res.code === 200) {
          this.getCountDown()
          this.$vux.toast.show({
            type: 'success',
            text: '发送成功'
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    onConfirm () { // 确定绑卡
      this.submitBindCard()
    },
    confirmShow () { // 弹框显示
      this.showConfirm = true
    },
    submitBindCard () { // 资金账户绑卡账户鉴权请求
      RegisterLogisticsPayAndBindingCard.FundAccountAccountAuth(this.bindParam).then(res => {
        if (res.code === 200) {
          this.$router.push({name: 'Treasure', query: {from: 'bindCardSuccess'}})
        } else {
          if (Number(res.data.counts) > 3) {
            this.showReBind = true
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: res.message
            })
          }
        }
      })
    }
  },
  watch: {
    provinceCode (newVal, oldVal) {
      this.bindParam.openAccountArea = newVal
      this.areaForm.cityCode = ''
      this.areaForm.areaCode = ''
      this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 1, bankRefCode: this.bindParam.bankRefCode}, 'city')
      this.areaShow = false
      this.cityShow = false
    },
    cityCode (newVal, oldVal) {
      this.bindParam.openAccountArea = newVal
      this.areaForm.areaCode = ''
      this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 2, bankRefCode: this.bindParam.bankRefCode}, 'area')
      this.areaShow = false
    },
    areaCode (newVal, oldVal) {
      this.bindParam.openAccountArea = newVal
      this.QueryLzBandBankCardAreaAndUnionPay({areaCode: newVal, areaType: 3, bankRefCode: this.bindParam.bankRefCode}, 'town')
    },
    routerFrom (newVal, oldVal) {
      if (newVal === 'treasure') {
        // this.goBack = 'first'
      }
    }
  },
  computed: {
    provinceCode () {
      return this.areaForm.provinceCode
    },
    cityCode () {
      return this.areaForm.cityCode
    },
    areaCode () {
      return this.areaForm.areaCode
    },
    openAccountArea () {
      return this.bindParam.openAccountArea
    },
    getMsgDisabled () {
      // return this.bindParam.bankCardNumbers.length > 12
      if (this.bindParam.certificationType === '1' && this.bindParam.authenticationMethod === '1') {
        return this.bindParam.name !== '' &&
        this.bindParam.idNumber !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers.length > 12 &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== ''
        // this.bindParam.messageCode !== ''
      }
      if (this.bindParam.certificationType === '1' && this.bindParam.authenticationMethod === '0') {
        return this.bindParam.name !== '' &&
        this.bindParam.idNumber !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers.length > 12 &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== ''
        // this.bindParam.checkAmount !== ''
      }
      if (this.bindParam.certificationType === '0') {
        return this.bindParam.account !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers.length > 12 &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== ''
        // this.bindParam.checkAmount !== ''
      }
    },
    openAccountBank () {
      return this.bindParam.openAccountBank
    },
    reButtonDisabed () {
      return this.bindParam.checkAmount !== ''
    },
    buttonDisabed () {
      if (this.bindParam.certificationType === '1' && this.bindParam.authenticationMethod === '1') {
        return this.bindParam.name !== '' &&
        this.bindParam.idNumber !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers !== '' &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== '' &&
        this.bindParam.messageCode !== ''
      }
      if (this.bindParam.certificationType === '1' && this.bindParam.authenticationMethod === '0') {
        return this.bindParam.name !== '' &&
        this.bindParam.idNumber !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers !== '' &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== '' &&
        this.bindParam.checkAmount !== ''
      }
      if (this.bindParam.certificationType === '0') {
        return this.bindParam.account !== '' &&
        this.bindParam.phone !== '' &&
        this.bindParam.bankCardNumbers !== '' &&
        this.bindParam.bankName !== '' &&
        this.bindParam.openAccountArea !== '' &&
        this.bindParam.openAccountBank !== '' &&
        this.bindParam.unionPayNumber !== '' &&
        this.bindParam.checkAmount !== ''
      }
    }
  }
}
</script>

<style scope lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.bindCard{
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }
  .contentWrap {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color:  rgb(245, 245, 245);
    .content {
      width: 100%;
      height: 100%;
      overflow: auto;
      margin-bottom: 20px;
      .warn {
        color: red;
        font-size: 26px;
      }
      .top {
        height: 200px;
        width: 100%;
        background-color: #fff;
        // padding: 0 40px;
        margin-top: 20px;
        .t-top {
          width: 100%;
          height: 128px;
          padding: 0 40px;
          display: flex;
          .t-left {
            width: 200px;
            height: 128px;
            line-height: 128px;
            color: #24282E;
            font-size: 30px;
          }
        }
        .t-line {
          width: 100%;
          background-color: rgba(229,229,229,1);
          height: 2px;
        }
        .t-bottom {
          width: 100%;
          height: 70px;
          padding: 0 40px;
          line-height: 70px;
          // background-color: #F7F0DA;
          color: #F57017;
          font-size: 24px;
          .iconfont {
            font-size: 26px;
          }
        }
      }
      .middle {
        height: auto;
        width: 100%;
        background-color: #fff;
        padding: 0 40px;
        margin-top: 20px;
      }
      .bottom {
        height: auto;
        width: 100%;
        background-color: #fff;
        padding: 0 40px;
        margin-top: 20px;
      }
      .liWrap {
        display: flex;
        height: 101px;
        width: 100%;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        // flex: 1;
        button {
          outline: none;
          border: none;
          background-color: #fff;
          padding: 0 0;
        }
      }
      .liSpanWrap {
        display: flex;
        height: auto;
        width: 100%;
        color: #F57017;
        font-size: 24px;
        padding: 15px 0;
        line-height: 1.5;
        box-sizing: border-box;
      }
      .areaLiWrap {
        display: flex;
        height: 201px;
        flex-direction: column;
        width: 100%;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
      }
      .c-label {
        width: 170px;
        height: 100px;
        line-height: 100px;
        font-size: 30px;
        color: #24282E;
      }
      .c-inputWarp {
        height: 100px;
        width: 100%;
        display: flex;
        flex: 1
      }
      .getMsg {
        width: 250px;
        height: 100px;
        line-height: 100px;
        font-size: 30px;
        color: #4A7FE8;
        button {
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          background-color: #fff;
        }
      }
      .disabled-getMsg {
        width: 200px;
        height: 100px;
        line-height: 100px;
        font-size: 30px;
        color: #aaa;
      }
      .getCountDown {
        width: 200px;
        height: 100px;
        line-height: 100px;
        font-size: 24px;
        color: #4A7FE8;
      }
      .c-title {
        color: #24282E;
        font-size: 50px;
        font-weight: 500;
        margin-bottom: 80px;
      }
      .c-idType {
        width: 100%;
        height: 100px;
        box-sizing: border-box;
        display: flex;
        flex: 1;
        // margin-bottom: 45px;
        select {
          width: 100%;
          height: 100%;
          border: none;
          // border: solid 1px #DDDDDD;
          outline: none;
          background-color: #fff;
          color: #24282E;
          font-size: 26px;
          padding-left: 20px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          background: url("../../image/full-arrowdown.png") no-repeat scroll center transparent;
          background-position-x: 450px;
          padding-right: 30px;
        }
      }
      .c-bankArea {
        width:100%;
        height: 100px;
        display: flex;
        box-sizing: border-box;
        // margin-bottom: 45px;
        select {
          width: 30%;
          height: 100%;
          border: none;
          // border: solid 1px #DDDDDD;
          outline: none;
          background-color: #fff;
          color: #24282E;
          font-size: 28px;
          text-align: right;
          // padding-left: 10px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          background: url("../../image/full-arrowdown.png") no-repeat scroll center transparent;
          background-position-x: 155px;
          padding-right: 20px;
        }
      }
      .c-address {
        height: 80px;
        width: 100%;
        margin-bottom: 30px;
      }
      .c-detailAddress {
        height: 160px;
        width: 100%;
      }
    }
    .footer {
      height: 170px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      background-color: #fff;
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
  .searchPage {
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
    .search {
      height: 100px;
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      .searchBox {
        margin-top: 20px;
        width: 100%;
        height: 90px;
        display: flex;
      }
      .searchContent {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 20px 40px;
        .c-list {
          width: 100%;
          height: 80px;
          line-height: 80px;
          font-size: 26px;
          border-bottom: 1px solid rgba(229,229,229,1);
          // margin-bottom: 10px;
        }
        .no-list {
          width: 100%;
          height: 300px;
          line-height: 300px;
          text-align: center;
          font-size: 26px;
          // border-bottom: 1px solid rgba(229,229,229,1);
        }
      }
    }
  }
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    top: 140px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.3;
    z-index: 2;
  }
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.bindCard{
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
  .vux-x-input.disabled .weui-input{
      // -webkit-text-fill-color: #24282E !important
      text-fill-color: #24282E!important
    }
  .weui-cell {
    width: 100%;
    height: 100%;
    // border: solid 1px #DDDDDD;
    padding-right: 30px;
    .weui-input {
      color: #24282E;
      font-size: 28px;
    }
    .vux-input-icon {
      font-size: 26px;
    }
    /* WebKit browsers */
    input::-webkit-input-placeholder {
      color: #B1B5BA;
      font-size: 28px;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
      color: #B1B5BA;
      font-size: 28px;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
      color: #B1B5BA;
      font-size: 28px;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
      color: #B1B5BA;
      font-size: 28px;
    }
    .weui-icon-clear {
      font-size: 26px;
    }
  }
  .vux-selector .weui-cell__ft {
    font-size: 28px;
    color: #24282E;
    text-align: left;
  }
  .self.weui-cell.vux-selector.weui-cell_select{
    display: flex;
    width: 30%;
    margin-right: 3%;
    .weui-cell__bd{
      height: 100%;
      .weui-select{
        width: 100%;
      }
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
      // margin-right: 20px;
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
  .vux-search-box {
    height: 80px;
    margin: 0 20px;
  }
  .weui-search-bar {
    width: 100%;
    height: 80px;
    .weui-search-bar__label {
      display: flex;
      align-items: center;
      // justify-content: center;
      span {
          font-size: 26px;
          color: #CFCFCF;
        }
      .weui-icon-search {
        font-size: 26px;
        margin-left: 15px;
      }
    }
    .weui-search-bar__box {
      display: flex;
      align-items: center;
      .weui-icon-clear, .weui-icon-search{
        top: 20px;
        font-size: 26px;
      }
      input{
        text-indent: 26px;
        font-size: 26px;
        color: #323232;
      }
    }
    .weui-search-bar__cancel-btn {
      display: flex;
      display: none;
      align-items: center;
      text-decoration: none;
      color: @color-extrude;
    }
  }
  .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn{
    display: flex;
    align-items: center;
    text-decoration: none;
    color: @color-extrude;
    font-size: 26px;
  }
  .van-radio-group {
    width: 100%;
    height: 128px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .van-radio {
      width: 30%;
      height: 128px;
      display: flex;
      align-items: center;
      .van-radio__input {
        font-size: 40px;
      }
      .van-radio__label {
        font-size: 30px;
        color: #24282E;
      }
    }
  }
  .vux-spinner {
    width: 80px;
    height: 80px;
    // svg {
    //   height: 80px;
    //   width: 80px;
    // }
  }
  .vux-x-dialog{
    .weui-dialog{
      .weui-dialog__bd{
        padding: 0px 20px!important;
      }
    }
  }
  .van-cell {
    height: 100%;
    // border: 1px solid #DDDDDD;
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
