<template>
  <div class="relevance">
    <div v-transfer-dom>
      <x-dialog
        v-model="dialogShow"
        class="dialog-relevance">
        <div class="inputBox">
          <div class="box-left">物流公司:</div>
          <div class="box-right" @click="selectLogistics()">
            <van-field
            disabled
            v-model="form.logisticsName"
            placeholder="请选择客户所属物流公司" />
          </div>
        </div>
        <div class="inputBox">
          <div class="box-left">登录账号:</div>
          <div class="box-right">
            <van-field
            v-model="form.account"
            placeholder="请输入客户登录账号" />
          </div>
        </div>
        <div class="inputBox">
          <div class="box-left">登录密码:</div>
          <div class="box-right">
            <van-field
            v-model="form.password"
            placeholder="请输入客户登录密码" />
          </div>
        </div>
       <div class="tab">
        <button-tab v-model="demo">
          <button-tab-item @on-item-click="consoleIndex('0')">{{'取消'}}</button-tab-item>
          <button-tab-item disabled="true" selected @on-item-click="consoleIndex('1')">{{ '确认绑定'}}</button-tab-item>
        </button-tab>
       </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog, ButtonTab, ButtonTabItem, TransferDomDirective as TransferDom } from 'vux'
import { Field } from 'vant'

export default {
  name: 'RelevanceDialog',
  components: {
    XDialog,
    ButtonTab,
    ButtonTabItem,
    [Field.name]: Field
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    logisticsData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    logisticsData (newv, old) {
    },
    deep: true
  },
  data () {
    return {
      form: {
        logisticsName: '',
        logisticsId: '',
        account: '',
        password: ''
      },
      dialogShow: false,
      demo: 0
    }
  },
  created () {
    this.dialogShow = this.show
    this.form.logisticsName = this.logisticsData.logisticsName
    this.form.logisticsId = this.logisticsData.logisticsId
    this.form.account = this.logisticsData.account
    this.form.password = this.logisticsData.password
  },
  directives: {
    TransferDom
  },
  computed: {
    sureDisabled () {
      return this.form.account === '' || this.form.password === '' || this.form.logisticsName
    }
  },
  methods: {
    consoleIndex (val) {
      if (val === '1') {
        let resultMessage = this.validateForm()
        if (resultMessage === 'success') {
          this.$emit('confirm-relevance', this.form)
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: `${resultMessage}`
          })
        }
      }
      if (val === '0') {
        this.$emit('cancel-relevance', false)
      }
    },
    selectLogistics () {
      this.$router.push({name: 'SearchLogistics', query: {logisticsObj: this.form}})
    },
    // 校验提交数据
    validateForm () {
      let form = this.form
      if (form.logisticsName === '' || form.logisticsName === null) {
        return '请选择物流公司'
      }
      if (form.account === '' || form.account === null) {
        return '请输入账号'
      }
      if (form.password === '' || form.password === null) {
        return '请输入密码'
      }
      return 'success'
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.dialog-relevance {
  .inputBox {
      width: 100%;
      height: 100px;
      padding: 0 20px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      background-color: #fff;
      .box-left {
        width: 160px;
        height: 100px;
        line-height: 100px;
        .mixin-sc(30px;#2b2b2b);
      }
      .box-right {
        height: 100px;
        width: 360px;
        display: flex;
        align-items: center;
      }
    }
  .tab {
    width: 100%;
    padding: 0 20px;
    height: 80px;
    margin-top: 60px;
  }
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../../style/base.less';
.dialog-relevance {
 .weui-dialog {
   height: 580px;
   width: 80% !important;
   padding: 50px 20px;
   text-align: left;
 }
 .tab .vux-button-group {
    width: 100%;
    height: 100%;
    font-size: 30px;
  }
}
.van-cell {
  .van-field__body {
    height: 100%;
    .mixin-sc(28px;#24282E);
    .van-field__control:disabled {
      color: #24282E;
    }
    input {
      height: 50px;
      width: 100%;
      line-height: 50px;
      display: inline-block;
    }
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
.tab .vux-button-group a {
  font-size: 28px;
  text-decoration: none;
  color: #202023;
}
.tab .vux-button-tab-item {
  height: 80px;
  line-height: 80px;
  // margin-right: 10px;
}
.vux-button-group > a.vux-button-group-current {
  background: #4D7DFD !important;
}
.vux-button-group > a.vux-button-tab-item-first {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.vux-button-group > a.vux-button-tab-item-last {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.vux-button-group > a.vux-button-tab-item-first:after {
  border:1px solid rgba(77,125,253,1) !important;
  border-radius:6px !important;
}
.vux-button-group > a.vux-button-tab-item-last:after {
  border:1px solid rgba(77,125,253,1) !important;
  border-radius:6px !important;
}
.dialog-relevance {
 .van-cell{
    height: 80px;
    padding: 15px;
    border: 1px solid #ccc;
 }
 .van-field__control:disabled {
    color: #24282E;
  }
}
</style>
