<template>
   <div class="main-con">
     <div class="receiveMon" v-show="recSourceList.length === 0 ? false : true">
          <div class="search-con">
            <search
              v-model="recSearchValue"
              position="absolute"
              placeholder="请输入修理厂名称"
              :auto-fixed="a"
              @on-submit="recOnSubmit"
              @on-cancel="recOnCancel"
              @on-clear="recOnClear"
              :auto-scroll-to-top=true
              ref="recSearch"
            ></search>
          </div>
          <!-- 待妥投-MainContent Start -->
          <div class="main-list-con" v-if="!recIsSearch">
            <van-pull-refresh v-model="recIsLoading" @refresh="recOnRefresh">
              <div class="list-item-con" :key="index" v-for="(item, index) in receiveListData">
                <div class="receiveItem">
                  <check-icon
                    @click.native="receiveCheckChange(item, item.check)"
                    :value.sync="item.check"
                  ></check-icon>
                  <div class="click-con" @click="handlePayRec(item, item.check)">
                    <span class="receiveName">{{item.receiveClientName}}</span>
                    <span class="pay">
                      (付款码)
                      <span class="right-pay">></span>
                    </span>
                  </div>
                </div>
                <ul>
                  <li :key="index" v-for="(boxItem, index) in item.childrenWaybill">
                    <check-icon
                      @click.native="receiveCheckMoney(boxItem, boxItem.check)"
                      :value.sync="boxItem.check"
                    ></check-icon>
                    <div class="right">
                      <div class="right-time">
                        <span>{{boxItem.articleNumberSub}}</span>
                      </div>
                      <div class="right-money">
                        <span class="rightName">(<span class="midName">{{boxItem.packageQuantity}}</span>件)</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </van-pull-refresh>
          </div>

          <!-- 待妥投-MainContent End -->

          <!-- 待妥投-搜索结果-start -->
          <div v-if="recIsSearch" class="main-list-con">
            <div class="noBill">
              <div class="imgWrap">
              <img src="../../image//no-waybill.jpg" alt="">
              </div>
              <div class="msg">暂无数据，辛苦啦！</div>
            </div>
          </div>
          <!-- 待妥投-搜索结果-end -->

          <!-- 待妥投-Total Start -->
          <div class="total-con">
            <div class="leftCheck">
              <check-icon class="checkIcon" :value.sync="receiveAll" @click.native="receiveAllCheck"></check-icon>
              <span class="checkName">全选</span>
            </div>
            <div class="freigh">
              <span class="name">共</span>
              <span class="price">{{TotalPackages}}</span>
              <span class="name">件</span>
            </div>
            <button class="detail" :disabled="receiveSelectedList.length === 0" @click="handleReceiveDetail()">
              <span class="name">拒收</span>
            </button>
          </div>
          <!-- 待妥投-Total End -->

          <!-- 待妥投-Bottom Start -->
          <button :class="receiveSelectedList.length > 0 ? bottomA : bottomB" type="button" :disabled="receiveSelectedList.length === 0" @click="handleToPay()">确认签收</button>
          <!-- 待妥投-Bottom End -->
        </div>
        <!-- 待妥投-无运单 Start -->
        <van-pull-refresh v-model="noBillRecisLoading" @refresh="noBillRecOnRefresh" class="noBill" v-show="recSourceList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
            <img src="../../image/no-transport.png" alt="">
            </div>
            <div class="msg">当前没有运输中的运单，辛苦啦！</div>
          </div>
        </van-pull-refresh>
        <!-- 待妥投-无运单 End -->
        <div v-transfer-dom>
          <confirm v-model="showSignFor"
            :confirm-text="'确定签收'"
            :cancel-text="'取消'"
            @on-cancel="showSignFor = false"
            @on-confirm="onConfirmSignFor">
            <p style="text-align:center;">确定签收吗？</p>
          </confirm>
        </div>

         <!-- 确认付款二维码页 Start -->
          <payment-dialog
            v-if="affirmPay"
            :show="affirmPay"
            :dataList="receiveDetailList"
            @pay-success="paySuccess"
            @cancel-pay="cancelPay"
          />
        <!-- 确认付款二维码页 End -->

        <!-- 确认付款列表页 Start -->
        <payment-listDialog
          v-if="payListShow"
          :show="payListShow"
          :dataList="receiveDetailList"
          @pay-success="paySuccess"
          @cancel-pay="cancelPay"
        />
        <!-- 确认付款列表页 End -->

        <!-- 拒收页 Start -->
          <reject-dialog
            v-if="rejectShow"
            :show="rejectShow"
            :dataList="receiveDetailList"
            @cancel-reject="cancelReject"
            @confirm-reject="confirmReject"
          />
        <!-- 拒收页 End -->
   </div>
</template>

<script>
import { Tab, TabItem, XButton, Search, CheckIcon, Confirm, TransferDomDirective as TransferDom } from 'vux'
import PaymentDialog from '../Business/subPage/paymentDialog'
import PaymentListDialog from '../Business/subPage/PaymentListDialog'
import RejectDialog from '../Delievered/RejectDialog'
import WayBillAjax from '@/api/WayBill/WayBill'
import { PullRefresh } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'Deal',
  props: {
    tabValue: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      recSearchValue: '', // 待妥投-搜索值
      a: false,
      recSourceList: [],
      showSignFor: false,
      recIsSearch: false, // 待妥投-判断搜索显示
      bottomA: 'bottom-con', // 无运单-底部样式
      bottomB: 'bottom-con2', // // 有运单-底部样式
      recIsLoading: false, // 待妥投-判断下拉刷新
      noBillRecisLoading: false, // 待妥投-无运单-判断下拉刷新
      recIsShowShadow: false, // 待妥投-判断明细阴影
      affirmPay: false, // 判断确认收款二维码页
      payListShow: false, // 判断确认收款列表页
      rejectShow: false, // 判断拒收页显示
      receiveDetail: false, // 判断-待妥投-明细
      receiveListData: [], // 待妥投-集合
      receiveDetailList: [], // 待妥投-明细集合list
      receiveAll: false, // 待妥投-判断全选
      // receiveQueryParam: {
      //   waybillStatus: '2',
      //   runShiftId: ''
      // }, // 获取-待妥投-运单需要的参数
      signForParam: {
        waybillIdList: [] // 签收需要的参数
      }
    }
  },
  components: {
    Tab,
    TabItem,
    XButton,
    Search,
    CheckIcon,
    PaymentDialog,
    PaymentListDialog,
    RejectDialog,
    [PullRefresh.name]: PullRefresh,
    Confirm,
    TransferDom
  },
  directives: {
    TransferDom
  },
  methods: {
    // 待妥投-搜索
    recOnSubmit () {
      this.$refs.recSearch.setBlur()
      let searchResult = []
      this.recSourceList.map(item => {
        // console.log(item.receiveClientName)
        // console.log(this.recSearchValue)
        if (item.receiveClientName.includes(this.recSearchValue)) {
          searchResult.push(item)
        }
      })
      this.receiveListData = searchResult
      if (searchResult.length === 0) {
        this.recIsSearch = true
      } else {
        this.recIsSearch = false
      }
      // console.log(this.receiveListData)
    },
    recOnCancel () {
      this.recIsSearch = false
      this.receiveAll = false
      this.receiveListData = this.recSourceList
    },
    recOnClear () {
      this.recIsSearch = false
      this.receiveAll = false
      this.receiveListData = this.recSourceList
    },
    // 待妥投-下拉刷新
    recOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.recIsLoading = false
        this.receiveAll = false
        this.getRecWayBill()
      }, 500)
    },
    // 待妥投-无运单-下拉刷新
    noBillRecOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noBillRecisLoading = false
        this.getRecWayBill()
      }, 500)
    },
    // 判断运单全选-待妥投
    receiveComputedAll () {
      this.receiveAll = this.receiveListData.every(item => {
        return item.check
      })
    },
    // 选择一家修理厂运单-待妥投
    receiveCheckChange (item, check) {
      this.receiveListData.forEach(outerItem => {
        if (item.id === outerItem.id) {
          outerItem.check = check
        }
      })
      item.childrenWaybill.forEach(item1 => {
        if (item.id === item1.pid) {
          item1.check = check
        }
      })
      this.receiveComputedAll()
    },
    // 单选运单-待妥投
    receiveCheckMoney (boxItem, check) {
      this.receiveListData = this.receiveListData.map(item => {
        item.childrenWaybill.forEach(item1 => {
          if (item1.id === boxItem.id) {
            item1.check = check
          }
        })
        return item
      })
      this.receiveListData.map(item => {
        if (item.id === boxItem.pid) {
          item.check = item.childrenWaybill.every(item1 => {
            return item1.check
          })
        }
        return item
      })
      this.receiveComputedAll()
    },
    // 全选运单-待妥投
    receiveAllCheck () {
      if (this.receiveAll) {
        this.receiveListData.forEach(item => {
          item.check = true
          item.childrenWaybill.forEach(item1 => {
            item1.check = true
          })
        })
      } else {
        this.receiveListData.forEach(item => {
          item.check = false
          item.childrenWaybill.forEach(item1 => {
            item1.check = false
          })
        })
      }
    },
    // 待妥投-选中运单拒收
    handleReceiveDetail () {
      if (this.receiveSelectedList.length > 1) {
        this.$vux.toast.show({
          type: 'warn',
          text: '拒收不支持多单操作'
        })
      } else {
        this.receiveDetailList = []
        this.getCheckList()
        this.rejectShow = true
      }
    },
    // 选中运单集合方法
    getCheckList () {
      this.receiveListData.map(item => {
        let obj = {}
        let hasChildChecked = item.childrenWaybill.some(childItem => {
          return childItem.check
        })
        if (hasChildChecked) {
          obj.receiveClientName = item.receiveClientName
          let checkedItems = item.childrenWaybill.filter(filItem => {
            return filItem.check
          })
          if (checkedItems) {
            obj.wayBillIdList = checkedItems.map(childrenItem => {
              return childrenItem.waybillId
            })
            obj.childrenWayBillList = checkedItems.map(childrenItem => {
              return childrenItem
            })
            obj.open = checkedItems.every(childrenItem => {
              return childrenItem.waybillClassify === 2
            })
          }
          checkedItems.forEach(childrenItem => {
            obj.receiveClientFreightSettlementMethod = childrenItem.receiveClientFreightSettlementMethod
          })
          checkedItems.forEach(childrenItem => {
            obj.sendClientFreightSettlementMethod = childrenItem.sendClientFreightSettlementMethod
          })
          checkedItems.forEach(childrenItem => {
            obj.settlementMethod = childrenItem.settlementMethod
          })
          obj.bill = checkedItems.length
          obj.piece = checkedItems.reduce((pre, next, index, array) => {
            return pre + Number(next.packageQuantity)
          }, 0)
          obj.totalMon = (checkedItems.reduce((pre, next, index, array) => {
            return pre + Number(next.total)
          }, 0)).toFixed(1)
          obj.collectMon = (checkedItems.reduce((pre, next, index, array) => {
            return pre + Number(next.receivableGoods)
          }, 0)).toFixed(1)
          obj.freightMon = (checkedItems.reduce((pre, next, index, array) => {
            return pre + (next.settlementMethod === 1 ? Number(next.receivableFreight) : 0)
          }, 0)).toFixed(1)
          this.receiveDetailList.push(obj)
        }
      })
    },
    // 获取-待妥投-运单
    getRecWayBill () {
      WayBillAjax.Transport().then(res => {
        if (res.code === 200) {
          // console.log(res.data)
          this.receiveListData = res.data
          this.recSourceList = res.data
          // console.log(this.receiveListData)
          this.receiveListData.forEach(item => {
            item.childrenWaybill.forEach(childrenItem => {
              if (childrenItem.settlementMethod === 1) {
                childrenItem.total = (Number(childrenItem.receivableGoods) + Number(childrenItem.receivableFreight)).toFixed(1)
              } else {
                childrenItem.total = (Number(childrenItem.receivableGoods)).toFixed(1)
              }
              childrenItem.billDate = (childrenItem.createTime).slice(5, 7) + (childrenItem.createTime).slice(8, 10)
              // console.log(childrenItem.billDate)
            })
          })
        }
        if (this.recSearchValue) {
          this.recOnSubmit()
        }
      })
    },
    // 签收运单集合
    concatArr () {
      this.receiveDetailList = []
      this.getCheckList()
      this.signForParam.waybillIdList = this.receiveDetailList.reduce((pre, next, index, array) => {
        return pre.concat(next.wayBillIdList)
      }, [])
    },
    // 签收Ajax
    signFor () {
      WayBillAjax.SignFor(this.signForParam).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '签收成功'
          })
          setTimeout(() => {
            this.getRecWayBill()
          }, 1000)
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
          })
        }
      })
    },
    // 点击确认签收
    handleToPay () {
      this.showSignFor = true
    },
    // 签收成功
    onConfirmSignFor () {
      this.concatArr()
      this.signFor()
    },
    // 成功收款
    paySuccess () {
      this.receiveDetailList = []
      this.affirmPay = false
      this.payListShow = false
      // this.handleReceiveDetail()
      setTimeout(() => {
        this.getRecWayBill()
        this.$router.push('/deal')
        this.$vux.toast.show({
          type: 'success',
          text: '支付成功'
        })
      }, 500)
    },
    // 取消支付
    cancelPay () {
      this.receiveDetailList = []
      this.payListShow = false
      this.affirmPay = false
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '支付已取消'
        })
      }, 500)
    },
    // 点击修理厂清除其他修理厂及下选中状态
    clearOtherCheck (otherId) {
      this.receiveListData.map(item => {
        if (otherId !== item.id) {
          item.check = false
          item.childrenWaybill.forEach(childItem => {
            childItem.check = false
          })
        }
        return item
      })
    },
    // 点击修理厂名称支付
    handlePayRec (receiveItem) {
      this.clearOtherCheck(receiveItem.id)
      this.receiveDetailList = []
      let hasCheckChild = receiveItem.childrenWaybill.some(item => {
        return item.check
      })
      let allChildHasOpen = receiveItem.childrenWaybill.every(item => {
        return item.waybillClassify === 2
      })
      if (hasCheckChild) {
        this.getCheckList()
        // console.log(this.receiveDetailList)
        let checlChildHasOpen = this.receiveDetailList.every(item => {
          return item.open
        })
        // console.log(checlChildHasOpen)
        if (checlChildHasOpen) {
          // 在线支付
          this.affirmPay = true
        } else {
          // 线下支付
          this.payListShow = true
          // console.log('线下')
        }
      } else {
        this.receiveCheckChange(receiveItem, true)
        this.getCheckList()
        if (allChildHasOpen) {
          // 在线支付
          this.affirmPay = true
        } else {
          // 线下支付
          // console.log('线下')
          this.payListShow = true
        }
      }
      // console.log(this.receiveDetailList)
    },
    // 取消修改
    cancelReject () {
      this.rejectShow = false
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '已取消'
        })
      }, 500)
    },
    // 修改成功
    confirmReject (val, message) {
      if (val) {
        this.rejectShow = false
        setTimeout(() => {
          this.$vux.toast.show({
            type: 'success',
            text: '拒收成功'
          })
          this.receiveAll = false
          this.getRecWayBill()
        }, 500)
      } else {
        this.rejectShow = false
        this.$vux.toast.show({
          type: 'warn',
          text: message
        })
      }
    }
  },
  computed: {
    ...mapGetters(['formatDate']),
    // 待妥投-选中的运单集合
    receiveSelectedList () {
      let childItemList = []
      this.receiveListData.forEach(item => {
        item.childrenWaybill.forEach(childItem => {
          if (childItem.check) {
            childItemList.push(childItem)
          }
        })
      })
      return childItemList
    },
    // 总应收-待妥投
    receiveTotalMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + Number(next.total)
      }, 0)).toFixed(1)
    },
    // 总代收-待妥投
    receiveCollectMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + (next.waybillStatus === 4 ? 0 : Number(next.receivableGoods))
      }, 0)).toFixed(1)
    },
    // 总件数-代妥投
    TotalPackages () {
      return this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + Number(next.packageQuantity)
      }, 0)
    },
    // 选中子是否全部开通驮付宝
    checkAllIsOpen () {
      return this.receiveSelectedList.every(item => {
        return item.waybillClassify === 2
      })
    }
  },
  created () {
    this.getRecWayBill()
    this.receiveAll = false
    this.recIsSearch = false
  },
  watch: {
    tabValue (newVal, oldVal) {
      if (newVal === 4) {
        this.getRecWayBill()
        this.receiveAll = false
        this.recIsSearch = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
@import "../../style/base.less";
.business {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .main-con {
    display: flex;
    flex: 1;
    background: #f3f4f5;
    .weui-dialog__btn {
      text-align: center;
    }
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
     /deep/ .van-pull-refresh__track {
      height: 100%;
      width: 100%;
    }
    }
    /deep/ .van-pull-refresh__text {
        font-size: 28px;
      }
    /deep/ .van-pull-refresh__loading span{
        font-size: 28px;
      }
    button {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      border: 1px solid transparent;
      outline: none;
    }
    .receiveMon {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .search-con {
      margin-top: 21px;
      width: 100%;
      height: 80px;
      display: flex;
    }
    .btn-icon {
      width: 132px;
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      i {
        display: block;
        .mixin-sc(40px;#333);
      }
      span {
        display: block;
        font-size: 22px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(154, 154, 154, 1);
        line-height: 37px;
      }
    }
    .main-list-con {
      border-top: 1px solid #eee;
      margin-top: 20px;
      padding: 0 20px;
      flex: 1;
      height: 100%;
      overflow-y: auto;
      flex-direction: column;
      .list-item-con {
        display: flex;
        width: 100%;
        flex-direction: column;
        height: auto;
        margin-bottom: 20px;
        .receiveItem {
          height: 90px;
          width: 100%;
          display: flex;
          align-items: center;
          background: #f6f8ff;
          border-bottom: 1px solid #eee;
          .click-con{
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 20px;
            justify-content: space-between;
            box-sizing: border-box;
          }
          .receiveName {
            font-size: 28px;
            font-weight: bold;
            color: rgba(77, 123, 254, 1);
          }
          .pay {
            font-size: 24px;
            .mixin-sc(24px;#C0C0C0);
          }
          .right-pay {
            .mixin-sc(32px; @color-extrude);
            margin-right: 20px;
          }
        }
        ul {
          height: auto;
          width: 100%;
        }
        li {
          height: 90px;
          width: 100%;
          display: flex;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #eee;
          .right {
            display: flex;
            flex: 1;
            height: 90px;
            align-items: center;
            margin-left: 20px;
            font-weight: 400;
            span {
              font-size: 30px;
              color: #3e3e3e;
            }
            .right-money {
              width: 45%;
              margin-left: 20px;
            }
            .midName {
              font-size: 26px;
              color: #FF5400;
            }
            .rightName {
              font-size: 24px;
              color: #A0A0A0;
            }
          }
        }
      }
    }
    .total-con {
      width: 100%;
      height: 102px;
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border-top: 1px solid #eee;
      padding: 0 20px;
      .leftCheck {
        display: flex;
        align-items: center;
      }
      .checkName {
        font-size: 26px;
        margin-left: 20px;
        color: #3e3e3e;
      }
      .price {
        font-size: 30px;
        color: #ff5400;
      }
      .freigh {
        margin-left: 45px;
        width: 150px;
        .name {
          font-size: 26px;
          color: #585858;
        }
      }
      .detail {
        display: block;
        margin-left: 300px;
        .name {
          font-size: 26px;
          color: #6B6B6B;
        }
      }
    }
    .bottom-con {
      width: 100%;
      height: 100px;
      background: @color-extrude;
      .mixin-sc(36px;#fff);
      position: relative;
    }
    .bottom-con2 {
      width: 100%;
      height: 100px;
      background: #e6e6e6;
      .mixin-sc(36px;#a5a5a5);
      position: relative;
    }
    .noBill {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #f3f4f5;
        text-align: center;
         .imgWrap {
          width: 290px;
          height: 220px;
          margin-top: 285px;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .msg {
          margin-top: 35px;
          font-size: 24px;
          width: auto;
          color: #D4D6DE;
        }
    }
  }
}
</style>
<style lang="less">
@import "~vux/src/styles/1px.less";
@import "../../style/base.less";
.business {
  .vux-tab-wrap {
    height: 80px !important;
    padding-top: 0px !important;
  }
  .vux-tab-container {
    height: 80px !important;
    border-bottom: 1px solid #aaa;
  }
  .vux-tab-container .vux-tab {
    height: 80px;
  }
  .vux-tab-container .vux-tab .vux-tab-item,
  .vux-tab-container .vux-tab .vux-tab-item.vux-tab-selected {
    line-height: 80px;
    color: #5677fc;
    font-size: 29px;
    font-weight: bold;
  }
  .vux-tab-container .vux-tab .vux-tab-item {
    color: #9a9a9a;
  }
  .vux-tab-container .vux-tab .vux-tab-ink-bar {
    background-color: #5677fc;
    width: 20%;
    margin: 0 auto;
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
  .vux-check-icon {
    width: 38px;
    height: 38px;
    margin-left: 20px;
    .weui-icon-circle {
      font-size: 38px;
    }
    .weui-icon-success {
      margin-left: 0px;
      .mixin-sc(38px; @color-extrude);
    }
  }
  .icon-kucun-xianxing {
    margin-left: 20px;
    .mixin-sc(38px; @color-extrude);
  }
  .receiveName {
    text-decoration: none;
    .mixin-sc(28px; @color-extrude);
  }
  .weui-icon-success:before {
    color: @color-extrude!important;
  }
}
</style>
