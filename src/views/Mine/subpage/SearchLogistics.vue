<template>
  <div class="searchLogistics">
     <!-- 物流公司名称列表 -->
    <div class="searchPage">
      <div class="c-header">
        <div @click="returnUserInfo()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title">选择物流公司</div>
        <div class="c-h-right"></div>
      </div>
      <div class="line"></div>
      <div class="search">
        <div class="searchBox">
          <search
            v-model="logisticsNameSearchValue"
            position="absolute"
            placeholder="请输入物流公司名称"
            :auto-fixed="a"
            @on-submit="logisticsNameOnSubmit"
            @on-change="logisticsNameChange"
            @on-cancel="logisticsNameOnCancel"
            @on-clear="logisticsNameOnClear"
            :auto-scroll-to-top=true
            ref="logisticsNameSearch"
          ></search>
        </div>
        <div class="searchContent">
          <div class="c-list"  v-show="showData" @click="checkLogisticsName(item)" :key="index" v-for="(item, index) in logisticsData">{{item.logisticsName}}</div>
          <!-- <div class="no-list" v-show="!showData">暂无该物流公司，请重新搜索</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, XProgress, XInput, XAddress, Group, XTextarea, Search, Selector, Spinner, Confirm, TransferDom } from 'vux'
import { RadioGroup, Radio, Loading, Field } from 'vant'
import CountDown from '@/components/CountDown/CountDown'
import MyCenterAjax from '@/api/MyCenter/MyCenter'
export default {
  name: 'SearchLogistics',
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
  computed: {
    showData () {
      return this.logisticsData.length > 0
    }
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      logisticsObj: {
        logisticsName: '',
        logisticsId: '',
        account: '',
        password: ''
      },
      logisticsNameSearchValue: '', // 物理公司名称搜索值
      a: false,
      logisticsSourceData: [
      ],
      logisticsData: [
      ]
    }
  },
  created () {
    let logisticsObj = this.$route.query.logisticsObj
    this.logisticsObj.logisticsName = logisticsObj.logisticsName
    this.logisticsObj.logisticsId = logisticsObj.logisticsId
    this.logisticsObj.account = logisticsObj.account
    this.logisticsObj.password = logisticsObj.password
    this.QueryLogisticsList()
  },
  methods: {
    returnUserInfo () { // 返回
      this.$router.push({name: 'DealerUserInfo', query: {logisticsObj: this.logisticsObj, from: 'searchLogistics'}})
    },
    QueryLogisticsList (val) { // 物流公司列表
      MyCenterAjax.getLogisticsList(val).then(res => {
        if (res.code === 200) {
          this.logisticsSourceData = res.data.list
          // 默认进来不展示数据，查询时匹配
          // this.logisticsData = res.data.list
        }
      })
    },
    logisticsNameChange () { // 物流公司名称搜索触发
      let searchResult = []
      this.logisticsSourceData.map(item => {
        if (item.logisticsName.includes(this.logisticsNameSearchValue)) {
          searchResult.push(item)
        }
      })
      if (this.logisticsNameSearchValue === '') {
        this.$nextTick(() => {
          this.logisticsData = []
        })
      } else {
        this.logisticsData = searchResult
      }
    },
    logisticsNameOnSubmit () { // 物流公司名称搜索提交
      this.$refs.logisticsNameSearch.setBlur()
      let searchResult = []
      this.logisticsSourceData.map(item => {
        if (item.logisticsName.includes(this.logisticsNameSearchValue)) {
          searchResult.push(item)
        }
      })
      if (this.logisticsNameSearchValue === '') {
        this.$nextTick(() => {
          this.logisticsData = []
        })
      } else {
        this.logisticsData = searchResult
      }
    },
    logisticsNameOnCancel () { // 物流公司名称搜索取消
      // this.logisticsNameIsSearch = false
      this.$nextTick(() => {
        this.logisticsData = []
      })
    },
    logisticsNameOnClear () { // 物流公司名称搜索清除
      // this.logisticsNameIsSearch = false
      this.$nextTick(() => {
        this.logisticsData = []
      })
    },
    checkLogisticsName (item) { // 物流公司名称搜索选择
      this.logisticsObj.logisticsName = item.logisticsName
      this.logisticsObj.logisticsId = item.id
      this.$router.push({name: 'DealerUserInfo', query: {logisticsObj: this.logisticsObj, from: 'searchLogistics'}})
    }
  },
  watch: {
  }
}
</script>

<style scope lang="less">
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.searchLogistics{
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
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
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.searchLogistics{
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
