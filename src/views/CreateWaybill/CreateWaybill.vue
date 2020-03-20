<template>
  <div class="create-waybill">
     <x-header
      @on-click-back="goback()"
      title="下单"
      :left-options="{backText: '', preventGoBack: true}"
    />
    <div class="content">
      <div class="send-station">
        <div class="station-label">发货站点</div>
        <div class="send-staion-con" @click="clickSelectSend">
          <div class="station-name" :class="{'no-send-station': true}">{{form.sendLogisticsName}} {{form.sendStationName}}</div>
          <div class="drop-iocn"></div>
        </div>
      </div>
      <div class="receive">
        <div class="receive-icon">收</div>
        <div class="receive-con" @click="selectReceive">
          <div v-if="!form.receiveClient" class="no-receive">请选择收货方</div>
          <div v-if="form.receiveClient" class="name-phone">{{form.receiveClientName}} {{showFullPhoneNum ? form.receivePhone : this.encryptPhoneNumber(form.receivePhone)}}</div>
          <div v-if="form.receiveClient" class="address">{{form.receiveAddress}}</div>
        </div>
        <div class="right-iocn"></div>
      </div>
      <div class="pay-con">
        <div class="pay-method">
          <div class="method-item" :class="{'active': Number(form.freightPayer) === 1}" @click="changeMethod(1)"><span>现付运费</span><span v-if="false">{{payName}}</span></div>
          <div class="method-item" :class="{'active': Number(form.freightPayer) === 2}" @click="changeMethod(2)"><span>到付运费</span><span v-if="false">运费现结</span></div>
        </div>
        <div class="goods-con">
          <van-field
            v-model="form.receivableGoods"
            clearable
            type="number"
            @input="inputGooods(form.receivableGoods)"
            label="代收货款￥"
            placeholder="请输入代收货款"
          />
        </div>
        <div class="border-con"></div>
      </div>
      <div class="package-con">
        <van-cell-group>
          <div class="package">
            <van-field
              v-model="form.commodityNumber"
              clearable
              @input="inputPackageNum(form.commodityNumber)"
              type="number"
              label="包裹数量"
              placeholder="请输入包裹数量"
            />
          </div>
          <div class="send-station">
            <div class="station-label receive">落地配</div>
            <div class="send-staion-con" @click="showBoreWithPicker = true">
              <div class="station-name" :class="{'no-send-station': !form.receiveStation}">{{form.receiveLogisticsName}} {{form.receiveStationName}}</div>
              <div class="drop-iocn"></div>
            </div>
          </div>
        </van-cell-group>
        <div class="border-con"></div>
      </div>
      <div v-if="showDiscounts" class="send-station discounts">
        <div class="station-label discounts-label">运费优惠</div>
        <div class="send-staion-con" @click="clickDiscounts">
          <div class="station-name discounts-name">限时免费</div>
          <!-- <div class="drop-iocn"></div> -->
        </div>
      </div>
    </div>
    <div class="submit-con" @click="createWaybill">立即下单</div>
    <!-- 发货站点pop -->
    <popup v-model="showSendPicker">
      <popup-header
        left-text="取消"
        right-text="确定"
        title="物流公司及站点"
        :show-bottom-border="false"
        @on-click-left="showSendPicker = false"
        @on-click-right="selectSendSure"
      >
      </popup-header>
      <van-picker ref="send-picker" :columns="sendStationColumns" @change="onSendChange" value-key="name"/>
    </popup>
    <!-- 落地配pop -->
    <popup v-model="showBoreWithPicker">
      <popup-header
        left-text="取消"
        right-text="确定"
        title="落地配"
        :show-bottom-border="false"
        @on-click-left="showBoreWithPicker = false"
        @on-click-right="selectBoreWithSure"
      >
      </popup-header>
      <van-picker ref="bore-with-picker" :columns="boreStationColumns" @change="onBoreChange" value-key="name"/>
    </popup>
  </div>
</template>

<script type="text/ecmascript-6">
import { PopupHeader, Popup, XHeader, Confirm } from 'vux'
import { CellGroup, Picker, Field } from 'vant'
import CreateWaybillAxios from '@/api/CreateWaybill/CreateWaybill'
export default {
  name: 'CreateWaybill',
  components: { PopupHeader, XHeader, Confirm, Popup, [CellGroup.name]: CellGroup, [Picker.name]: Picker, [Field.name]: Field },
  data () {
    return {
      showFullPhoneNum: false,
      type: '',
      payName: '',
      payNameList: [{id: 1, name: '运费现结'}, {id: 2, name: '运费月结'}, {id: 3, name: '运费包月'}],
      showSendPicker: false,
      showBoreWithPicker: false,
      sendOption: [], // 物流公司及站点选择数据
      receiveOption: [], // 落地配物流公司及站点数据
      frontSendLogisticsId: '', // 发货方站点pop左侧临时选中id
      frontBoreLogisticsId: '', // 前端临时落地配物流公司id
      // 开单页面传参也使用form数据
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
      },
      showDiscounts: true
    }
  },
  watch: {
    showSendPicker (newValue, oldValue) {
      if (newValue) {
        if (this.form.sendStation === '') {
          this.$refs['send-picker'].setColumnIndex(0, 0)
          this.$refs['send-picker'].setColumnIndex(1, 0)
        } else {
          this.$refs['send-picker'].setColumnIndex(0, this.selectSendFirstIndex)
          this.$refs['send-picker'].setColumnIndex(1, this.sendSecondIndex)
        }
      } else {
        if (this.form.sendStation === '') {
          this.$refs['send-picker'].setColumnIndex(0, 0)
          this.$refs['send-picker'].setColumnIndex(1, 0)
        }
        this.frontBoreLogisticsId = this.form.sendLogistics
      }
    },
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
        }
        this.frontBoreLogisticsId = this.form.receiveLogistics
      }
    }
  },
  computed: {
    // 已选择的发货站点物流公司index
    selectSendFirstIndex () {
      let firstIndex = 0
      this.sendOption.map((item, index) => {
        if (item.logisticsId === this.form.sendLogistics) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 发货站点物流公司选中index
    sendFirstIndex () {
      let firstIndex = 0
      this.sendOption.map((item, index) => {
        if (item.logisticsId === this.frontSendLogisticsId) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 发货站点物流公司站点列选中index
    sendSecondIndex () {
      let secondIndex = 0
      if (this.sendOption.length > 0) {
        this.sendOption[this.sendFirstIndex].children.map((item, index) => {
          if (item.stationId === this.form.sendStation) {
            secondIndex = index
          }
        })
      }
      return secondIndex
    },
    // 发货站点列数据
    sendStationSecondColumns () {
      let result = []
      if (this.sendOption.length > 0) {
        result = this.sendOption[this.sendFirstIndex].children
      }
      return result
    },
    // 发货站点两列
    sendStationColumns () {
      let result = [
        {
          values: this.sendOption,
          className: 'column1',
          defaultIndex: this.sendFirstIndex
        },
        {
          values: this.sendStationSecondColumns,
          className: 'column2',
          defaultIndex: this.sendSecondIndex
        }
      ]
      return result
    },
    // 已选择的落地配物流公司index
    selectBoreFirstIndex () {
      let firstIndex = 0
      this.receiveOption.map((item, index) => {
        if (item.logisticsId === this.form.receiveLogistics) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 落地配物流公司选中index
    boreFirstIndex () {
      let firstIndex = 0
      this.receiveOption.map((item, index) => {
        if (item.logisticsId === this.frontBoreLogisticsId) {
          firstIndex = index
        }
      })
      return firstIndex
    },
    // 落地配物流公司站点列选中index
    boreSecondIndex () {
      let secondIndex = 0
      if (this.receiveOption.length > 0) {
        this.receiveOption[this.boreFirstIndex].children.map((item, index) => {
          if (item.stationId === this.form.receiveStation) {
            secondIndex = index
          }
        })
      }
      return secondIndex
    },
    // 落地配站点列数据
    boreStationSecondColumns () {
      let result = []
      if (this.receiveOption.length > 0) {
        result = this.receiveOption[this.boreFirstIndex].children
      }
      return result
    },
    // 落地配站点两列
    boreStationColumns () {
      let result = [
        {
          values: this.receiveOption,
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
  },
  created () {
    // console.log(this.$route.query)
    let query = this.$route.query
    if (query.type) this.type = query.type
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo.businessModel === 2) {
      this.showFullPhoneNum = true
    } else {
      this.showFullPhoneNum = false
    }
    if (userInfo.freightSettlementMethod) {
      this.payNameList.forEach(item => {
        if (item.id === userInfo.freightSettlementMethod) {
          this.payName = item.name
        }
      })
    }
    this.querySendStationInfo()
  },
  methods: {
    inputGooods (val) {
      let value = val.match(/^\d*(\.?\d{0,2})/g)[0] || null
      if (value !== null) {
        if (value.indexOf('.') === -1) {
          this.form.receivableGoods = value.substring(0, 6)
        } else {
          this.form.receivableGoods = value.substring(0, 9)
        }
      }
    },
    inputPackageNum (val) {
      this.form.commodityNumber = this.validateOnlyNum(val)
    },
    clickSelectSend () {
      return false
      // if (this.form.sendLogistics) {
      // } else {
      //   this.showSendPicker = true
      // }
    },
    // 发货站点选择变化
    onSendChange (picker, values) {
      this.frontSendLogisticsId = picker.getColumnValue(0).logisticsId
    },
    // 落地配站点选择变化
    onBoreChange (picker, values) {
      this.frontBoreLogisticsId = picker.getColumnValue(0).logisticsId
    },
    selectSendSure () {
      let selectValues = this.$refs['send-picker'].getValues()
      this.frontSendLogisticsId = selectValues[0].logisticsId
      this.form.sendLogistics = selectValues[0].logisticsId
      this.form.sendLogisticsName = selectValues[0].name
      this.form.sendStation = selectValues[1].stationId
      this.form.sendStationName = selectValues[1].stationName
      this.showSendPicker = false
    },
    selectBoreWithSure () {
      let selectValues = this.$refs['bore-with-picker'].getValues()
      this.frontBoreLogisticsId = selectValues[0].logisticsId
      this.form.receiveLogistics = selectValues[0].logisticsId
      this.form.receiveLogisticsName = selectValues[0].name
      this.form.receiveStation = selectValues[1].stationId
      this.form.receiveStationName = selectValues[1].stationName
      this.queryReceiveLogisricsAndStation()
      this.showBoreWithPicker = false
    },
    changeMethod (value) {
      this.form.freightPayer = value
    },
    // 点击选择优惠项
    clickDiscounts () {

    },
    // 查询运单详情回显
    queryWaybillDetail (waybillId) {
      CreateWaybillAxios.queryDetail({id: waybillId}).then(res => {
        if (res.code === 200) {
          this.form = {...res.data}
          this.form.id = waybillId
          this.frontBoreLogisticsId = this.form.receiveLogistics
          this.queryReceiveLogisricsAndStation()
        }
      })
    },
    // 回显发货站点信息
    echoSendWayBillInfo () {
      this.sendOption.forEach(firstItem => {
        if (firstItem.logisticsId === this.form.sendLogistics) {
          this.form.sendLogisticsName = firstItem.name
        }
        firstItem.children.forEach(secondItem => {
          if (secondItem.stationId === this.form.sendStation) {
            this.form.sendStationName = secondItem.name
          }
        })
      })
    },
    // 回显落地配站点信息
    echoReceiveWayBillInfo () {
      this.receiveOption.forEach(firstItem => {
        if (firstItem.logisticsId === this.form.receiveLogistics) {
          this.form.receiveLogisticsName = firstItem.name
        }
        firstItem.children.forEach(secondItem => {
          if (secondItem.stationId === this.form.receiveStation) {
            this.form.receiveStationName = secondItem.name
          }
        })
      })
    },
    // 查询落地配物流公司及站点id
    queryReceiveLogisricsAndStation () {
      CreateWaybillAxios.queryLogisticsAndStation({receiveClientId: this.form.receiveClient}).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.receiveOption = res.data.map(firstItem => {
              firstItem.name = firstItem.stationName
              firstItem.children.forEach(secondItem => {
                secondItem.name = secondItem.stationName
              })
              return firstItem
            })
            this.echoReceiveWayBillInfo()
            this.querySendInfo()
          }
        }
      })
    },
    // 根据落地配物流公司id查询发货站点信息
    querySendInfo () {
      CreateWaybillAxios.querySendInfo({logisticsId: this.form.receiveLogistics}).then(res => {
        if (res.code === 200) {
          if (res.data) {
            let {logisticsId, stationId} = res.data
            this.form.sendLogistics = logisticsId
            this.form.sendStation = stationId
            this.echoSendWayBillInfo()
          }
        }
      })
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
            // console.log(this.$route.query, 'query')
            if (this.$route.query.type === 'edit' && this.$route.query.waybillId) {
              this.queryWaybillDetail(this.$route.query.waybillId)
              return false
            }
            this.form = {...this.$route.query.waybillInfo}
            let freeLimitedTime = this.$route.query.waybillInfo.freeLimitedTime
            if (freeLimitedTime === true || freeLimitedTime === 'true') {
              this.showDiscounts = true
            } else {
              this.showDiscounts = false
            }
            this.frontBoreLogisticsId = this.form.receiveLogistics
            this.queryReceiveLogisricsAndStation()
          }
        }
      })
    },
    // 校验提交数据
    validatePostData () {
      let data = this.form
      if (!data.sendLogistics || !data.sendStation) {
        return '请选择发货站点'
      }
      if (!data.receiveClient) {
        return '请选择收货方'
      }
      if (!data.receivableGoods && data.receivableGoods !== 0) {
        return '请输入代收货款'
      }
      if (!data.commodityNumber || data.commodityNumber === '0') {
        return '请输入包裹数量'
      }
      if (!data.receiveLogistics || !data.receiveStation) {
        return '请选择落地配'
      }
      return 'success'
    },
    // 开单
    createWaybill () {
      let resultMessage = this.validatePostData()
      if (resultMessage !== 'success') {
        this.$vux.toast.show({
          type: 'warn',
          text: `${resultMessage}`
        })
      } else {
        if (this.form.id) {
          CreateWaybillAxios.updatedWaybill(this.form).then(res => {
            if (res.code === 200) {
              this.$vux.toast.show({
                type: 'success',
                text: '下单成功！'
              })
              this.type = 'insert'
              this.resetForm()
              this.frontSendLogisticsId = ''
              this.frontBoreLogisticsId = ''
            }
          })
        } else {
          CreateWaybillAxios.createWaybill(this.form).then(res => {
            if (res.code === 200) {
              this.$vux.toast.show({
                type: 'success',
                text: '下单成功！'
              })
              this.type = 'insert'
              this.resetForm()
              this.frontSendLogisticsId = ''
              this.frontBoreLogisticsId = ''
            }
          })
        }
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
    },
    selectReceive () {
      // console.log(this.$route.query)
      this.$router.push({name: 'ChooseCustomers', query: {type: this.type, waybillInfo: this.form}})
    },
    goback () {
      this.$router.push({name: 'Waybill'})
    }
  }
}
</script>

<style scoped lang="less">
@import "../../style/base.less";
.create-waybill {
  background: rgb(243,244,246);
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
    .send-station{
      height: 100px;
      margin: 12px;
      display: flex;
      background: #fff;
      box-shadow: 0px 3px 5px #eee;
      .station-label{
        width: 140px;
        height: 100px;
        margin-left: 24px;
        display: flex;
        align-items: center;
        margin-left: 40px;
        .mixin-sc(28px;#1A1A1A);
      }
      .station-label.receive{
        margin-left: 43px;
        box-shadow: none;
      }
      .station-label.discounts-label{
        .mixin-sc(28px;#F57017);
      }
      .send-staion-con{
        display: flex;
        flex: 1;
        align-items: center;
        .station-name{
          display: flex;
          flex: 1;
          justify-content: flex-end;
          margin-right: 14px;
          .mixin-sc(28px;#1A1A1A);
        }
        .station-name.no-send-station{
          .mixin-sc(28px;#757575);
        }
        .station-name.discounts-name{
          height: 100px;
          line-height: 100px;
          padding-right: 24px;
          color: #f00;
        }
        .drop-iocn{
          height: 32px;
          width: 32px;
          margin-right: 36px;
          background: url('../../image/bottom-sj.png') no-repeat;
          background-size:  100% 100%;
        }
      }
    }
    .send-station.discounts{
      margin-top: 0px;
    }
    .receive{
      height: 120px;
      margin: 12px;
      margin-top: 0px;
      display: flex;
      align-items: center;
      background: #fff;
      box-shadow: 0px 3px 5px #eee;
      .receive-icon{
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: #4D7BFE;
        border-radius: 5px;
        .mixin-sc(28px;#fff);
        margin-left: 40px;
      }
      .right-iocn{
        width: 64px;
        height: 64px;
        margin-right: 20px;
        background: url('../../image/right-sj.png') no-repeat;
        background-size:  100% 100%;
      }
      .receive-con{
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        height: 120px;
        margin-left: 26px;
        .no-receive{
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-end;
          .mixin-sc(28px;#757575);
        }
        .name-phone{
          height: 46px;
          line-height: 46px;
          .mixin-sc(25px;#1A1A1A);
        }
        .address{
          height: 46px;
          line-height: 46px;
          .mixin-sc(25px;#1A1A1A);
        }
      }
    }
    .pay-con{
      height: 272px;
      margin: 12px;
      margin-top: 0px;
      display: flex;
      flex-direction: column;
      background: #fff;
      box-shadow: 0px 3px 5px #eee;
      .pay-method{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        height: 140px;
        .method-item{
          display: flex;
          flex-direction: column;
          width: 38%;
          margin: 28px 0px;
          border-radius: 5px;
          box-shadow: 0px 0px 9px 1px #aaa;
          justify-content: center;
          align-items: center;
          span{
            .mixin-sc(26px;#1A1A1A);
            margin: 6px;
          }
          span:first-child{
            font-size: 30px;
          }
        }
        .method-item.active{
          box-shadow: 0px 0px 9px 2px #4D7BFE;
          span{
            .mixin-sc(26px;#4D7BFE);
          }
          span:first-child{
            font-size: 30px;
          }
        }
      }
      .goods-con{
        margin-left: 30px;
        margin-right: 30px;
        margin-top: 20px;
        height:80px;
      }
    }
    .package-con{
      height: 206px;
      margin: 12px;
      margin-top: 0px;
      display: flex;
      flex-direction: column;
      background: #fff;
      box-shadow: 0px 3px 5px #eee;
      .package{
        margin: 20px 24px 0px 24px;
      }
      .send-station{
        margin: 0px;
        box-shadow: none;
      }
    }
  }
  .submit-con{
    height: 90px;
    line-height: 90px;
    text-align: center;
    background: #4D7BFE;
    .mixin-sc(30px;#fff);
  }
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
  .border-con{
    height: 2px;
    background: #eee;
    margin: 0px 40px 30px 40px;
  }
}
</style>
<style lang="less">
@import "../../style/base.less";
.create-waybill {
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
  .van-field{
    .van-cell__title{
      width: 140px;
      max-width: 140px;
      display: flex;
      align-items: center;
      span{
        .mixin-sc(26px;#1A1A1A);
      }
    }
    .van-cell__value{
      .van-field__body{
        .van-field__control{
          font-size: 26px;
          padding-right: 24px;
          // .mixin-sc(26px;#1A1A1A);
          text-align: right;
        }
      }
    }
  }
  .package{
    .van-cell__value{
      .van-field__body{
        .van-field__control{
          padding-right: 29px;
        }
      }
    }
  }
  .column1{
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .column2{
    border-top: 1px solid #eee;
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
