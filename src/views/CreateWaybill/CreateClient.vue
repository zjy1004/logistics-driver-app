
<template>
  <div class="create-client">
    <x-header
      @on-click-back="goback()"
      title="新建客户"
      :left-options="{backText: '', preventGoBack: true}"
      >
    </x-header>
    <div class="createWrap">
      <div style="width: 100%; height: 30px;"></div>
      <div class="inputBox">
        <div class="box-left"><span class="require">*</span>客户名称:</div>
        <div class="box-right">
          <x-input type="text" :max="10" v-model="form.receiveClientName" :show-clear="false" placeholder="请输入客户名称"></x-input>
          <!-- <van-field
           maxlength=11
           v-model="form.receiveClientName"
           placeholder="请输入客户名称" /> -->
        </div>
      </div>
      <div class="inputBox">
        <div class="box-left"><span class="require">*</span>联系电话:</div>
        <div class="box-right">
          <van-field
           maxlength=11
           type="number"
           v-model="form.receivePhone"
           placeholder="请输入联系电话" />
        </div>
      </div>
      <div class="inputBox">
        <div class="box-left"><span class="require">*</span>详细地址:</div>
        <div class="box-right">
          <van-field
           @keyup.native="inputIdNumber()"
           v-model="form.receiveAddress"
           placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="inputBox">
        <div class="box-left"><span class="require">*</span>物流公司及站点:</div>
        <div class="box-right" @click="showBoreWithPicker = true">
          <van-field
          disabled
           @keyup.native="inputIdNumber()"
           v-model="logisticsAndStation"
           placeholder="请选择物流公司及站点" />
        </div>
      </div>
      <div class="button">
        <div class="b-left" @click="showConfirm = true">不保存退出</div>
        <button :disabled="saveButtonDisabed" :class="{'disabled-class': saveButtonDisabed}" @click="save()">保存并使用</button>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        :confirm-text="'不保存退出'"
        :cancel-text="'继续编辑'"
        @on-cancel="showConfirm = false"
        @on-confirm="confirmCancel">
        <p style="text-align:center;">退出后已填写数据不会保存，是否仍要退出？</p>
      </confirm>
    </div>
    <popup v-model="showBoreWithPicker">
      <popup-header
        left-text="取消"
        right-text="确定"
        title="物流公司及站点"
        :show-bottom-border="false"
        @on-click-left="showBoreWithPicker = false"
        @on-click-right="selectBoreWithSure"
      >
      </popup-header>
      <van-picker ref="bore-with-picker" :columns="boreStationColumns" @change="onBoreChange" value-key="name"/>
    </popup>
  </div>
</template>

<script>
import { XHeader, Group, XInput, Cell, ButtonTab, ButtonTabItem, Confirm, PopupHeader, Popup, TransferDom } from 'vux'
import { Field, Icon, Picker } from 'vant'
import CreateWaybillAxios from '@/api/CreateWaybill/CreateWaybill'
export default {
  name: 'CreateClient',
  components: {
    XHeader,
    Cell,
    Group,
    Confirm,
    XInput,
    ButtonTab,
    ButtonTabItem,
    PopupHeader,
    Popup,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Picker.name]: Picker
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      clientId: '',
      logisticsAndStation: '',
      saveWaybillInfo: '',
      showConfirm: false,
      type: '',
      showSendPicker: false,
      showBoreWithPicker: false,
      sendOption: [],
      frontSendLogisticsId: '', // 发货方站点pop左侧临时选中id
      frontBoreLogisticsId: '', // 前端临时落地配物流公司id
      form: {
        id: '', // 新开单为空，修改存在id
        sendLogistics: '', // 发货站点物流公司id
        sendLogisticsName: '', // 发货站点物流公司名称
        sendStation: '', // 发货站点id
        sendStationName: '请选择发货站点', // 发货站点名称
        receiveClient: '', // 收id
        receiveClientName: '', // 收name
        receivePhone: '', // 收电话
        receiveAddress: '', // 收地址
        freightPayer: 2, // 运费付款方
        receivableGoods: '0', // 代收货款
        commodityName: '配件', // 包裹名称
        commodityNumber: 1, // 包裹数量
        receiveLogistics: '', // 落地配物流公司id
        receiveLogisticsName: '', // 落地配物流公司name
        receiveStation: '', // 落地配站点id
        receiveStationName: '请选择落地配' // 落地配站点name
      }
    }
  },
  created () {
    let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
    this.clientId = userInfoObj.clientId
    let routeFrom = this.$route.query.goBackType
    this.type = routeFrom
    this.saveWaybillInfo = this.$route.query.waybillInfo
    this.querySendStationInfo()
  },
  methods: {
    goback () {
      // this.resetForm()
      this.from = this.saveWaybillInfo
      this.$router.push({name: 'ChooseCustomers', query: {goBackType: this.type, waybillInfo: this.form}})
    },
    inputIdNumber (val) {
    },
    selectLogistics () {
    },
    // 落地配站点选择变化
    onBoreChange (picker, values) {
      this.frontBoreLogisticsId = picker.getColumnValue(0).logisticsId
    },
    selectBoreWithSure () {
      let selectValues = this.$refs['bore-with-picker'].getValues()
      this.frontBoreLogisticsId = selectValues[0].logisticsId
      this.form.receiveLogistics = selectValues[0].logisticsId
      this.form.receiveLogisticsName = selectValues[0].name
      this.form.receiveStation = selectValues[1].stationId
      this.form.receiveStationName = selectValues[1].stationName
      this.logisticsAndStation = this.form.receiveLogisticsName + ' ' + this.form.receiveStationName
      this.showBoreWithPicker = false
    },
    // 查询发货站点信息
    querySendStationInfo () {
      CreateWaybillAxios.queryLogisticsAndStation().then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.sendOption = res.data.map(firstItem => {
              firstItem.name = firstItem.stationName
              firstItem.children.forEach(secondItem => {
                secondItem.name = secondItem.stationName
              })
              return firstItem
            })
          }
        }
      })
    },
    // cancelSave () {
    //   this.showConfirm = true
    // },
    confirmCancel () {
      this.goback()
    },
    save () {
      let phoneValidate = this.validatePhoneNum(this.form.receivePhone)
      if (phoneValidate) {
        let postdata = {
          pkClient: this.clientId,
          clientName: this.form.receiveClientName,
          clientPhone: this.form.receivePhone,
          address: this.form.receiveAddress,
          pkLogistics: this.form.receiveLogistics,
          pkStation: this.form.receiveStation
        }
        CreateWaybillAxios.newClient(postdata).then(res => {
          if (res.code === 200) {
            this.form.receiveClient = res.data
            this.$vux.toast.show({
              type: 'success',
              text: '新建成功'
            })
            setTimeout(() => {
              this.$router.push({name: 'CreateWaybill', query: {type: this.type, waybillInfo: this.form}})
            }, 500)
          }
        })
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码不正确'
        })
      }
    },
    resetForm () {
      this.form.id = ''
      this.form.sendLogistics = '' // 发货站点物流公司id
      this.form.sendLogisticsName = '' // 发货站点物流公司名称
      this.form.sendStation = '' // 发货站点id
      this.form.sendStationName = '请选择发货站点' // 发货站点名称
      this.form.receiveClient = '' // 收id
      this.form.receiveClientName = '' // 收name
      this.form.receivePhone = '' // 收电话
      this.form.receiveAddress = '' // 收地址
      this.form.freightPayer = 2 // 运费付款方
      this.form.receivableGoods = '0' // 代收货款
      this.form.commodityName = '配件' // 包裹名称
      this.form.commodityNumber = 1 // 包裹数量
      this.form.receiveLogistics = '' // 落地配物流公司id
      this.form.receiveLogisticsName = '' // 落地配物流公司name
      this.form.receiveStation = '' // 落地配站点id
      this.form.receiveStationName = '请选择落地配' // 落地配站点name
    }
  },
  watch: {
    showBoreWithPicker (newValue, oldValue) {
      if (newValue) {
        if (this.form.receiveStation === '') {
          this.$refs['bore-with-picker'].setColumnIndex(0, 0)
          this.$refs['bore-with-picker'].setColumnIndex(1, 0)
        } else {
          this.$refs['bore-with-picker'].setColumnIndex(0, this.selectBoreFirstIndex)
          this.$refs['bore-with-picker'].setColumnIndex(1, this.boreSecondIndex)
        }
      } else {
        if (this.form.receiveStation === '') {
          this.$refs['bore-with-picker'].setColumnIndex(0, 0)
          this.$refs['bore-with-picker'].setColumnIndex(1, 0)
        } else {
          this.frontBoreLogisticsId = this.form.receiveLogistics
        }
      }
    }
  },
  computed: {
    saveButtonDisabed () {
      return this.form.receiveClientName === '' || this.form.receivePhone === '' || this.form.receiveAddress === '' || this.logisticsAndStation === ''
    },
    // 已选择的落地配物流公司index
    selectBoreFirstIndex () {
      let firstIndex = 0
      this.sendOption.map((item, index) => {
        if (item.logisticsId === this.form.receiveLogistics) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 落地配物流公司选中index
    boreFirstIndex () {
      let firstIndex = 0
      this.sendOption.map((item, index) => {
        if (item.logisticsId === this.frontBoreLogisticsId) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 落地配物流公司站点列选中index
    boreSecondIndex () {
      let secondIndex = 0
      if (this.sendOption.length > 0) {
        this.sendOption[this.boreFirstIndex].children.map((item, index) => {
          if (item.stationId === this.form.receiveStation) {
            secondIndex = index
          }
        })
      }
      return secondIndex
    },
    // 发货站点列数据
    boreStationSecondColumns () {
      let result = []
      if (this.sendOption.length > 0) {
        result = this.sendOption[this.boreFirstIndex].children
      }
      return result
    },
    // 发货站点两列
    boreStationColumns () {
      let result = [
        {
          values: this.sendOption,
          className: 'column1',
          defaultIndex: this.boreFirstIndex
        },
        {
          values: this.boreStationSecondColumns,
          className: 'column2',
          defaultIndex: this.boreSecondIndex
        }
      ]
      return result
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.create-client{
  height: 100%;
  width: 100%;
  .createWrap {
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #f1f2f3;
    border-top: 1px solid #eee;
    position: relative;
    .inputBox {
      width: 100%;
      height: 100px;
      margin-top: 30px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      background-color: #f1f2f3;
      .box-left {
        width: 380px;
        height: 100px;
        line-height: 100px;
        text-align: right;
        .mixin-sc(30px;#2b2b2b);
        .require {
          color: #ff0000;
          font-size: 26px;
        }
      }
      .box-right {
        display: flex;
        height: 100px;
        padding: 0 20px;
        align-items: center;
        width: 100%;
        .van-icon {
          margin-left: 10px;
          height: 100px;
          line-height: 100px;
        }
      }
    }
    .button {
      width: 100%;
      height: 90px;
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .b-left {
        width: 50%;
        height: 90px;
        line-height: 90px;
        text-align: center;
        border: 1px solid #4A7fe8;
        .mixin-sc(30px;#4A7fe8);
      }
      button {
        outline: none;
        border: 0;
        padding: 0;
        margin: 0;
        width: 50%;
        height: 90px;
        background-color: #4A7fe8;
        border: 1px solid #4A7fe8;
        .mixin-sc(30px;#fff);
      }
      .disabled-class {
        background-color: #ccc;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.create-client{
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
  // .weui-cell{
  //   min-height: 80px;
  //   // padding: 0 30px;
  //   .vux-cell-bd {
  //     width: 180px;
  //     flex: none;
  //   }
  //   p {
  //     width: 180px;
  //   }
  //   label{
  //     .mixin-sc(30px;#2b2b2b);
  //   }
  //   .weui-cell__ft{
  //     margin-left: 30px;
  //     text-align: left;
  //     .mixin-sc(28px;#676767);
  //   }
  // }
  .van-cell {
    height: 80px;
    border: 1px solid #ccc;
    padding: 15px;
    .van-cell__value--alone {
      height: 100%;
    }
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
  .weui-cell {
    width: 100%;
    height: 80px;
    padding: 15px;
    background-color: #fff;
    border: solid 1px #ccc;
    input {
      height: 50px;
      width: 100%;
      line-height: 50px;
      display: inline-block;
      padding: 0;
    }
    .weui-input {
      .mixin-sc(28px;#24282E);
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
  .column1{
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    li {
      font-size: 28px;
    }
  }
  .column2{
    border-top: 1px solid #eee;
    li {
      font-size: 28px;
    }
  }
  .vux-popup-header{
    height: 90px!important;
    align-items: center;
    .vux-popup-header-left,.vux-popup-header-right{
      font-size: 28px;
    }
    .vux-popup-header-left{
      padding-left: 20px;
    }
    .vux-popup-header-right{
      padding-right: 20px;
    }
  }
  .van-picker-column__item{
    .mixin-sc(28px;#1A1A1A);
  }
  .van-picker-column__item--selected{
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .van-cell--required::before{
    top: 18px;
    left: 0px;
  }
}
</style>
