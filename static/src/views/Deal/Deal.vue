<template>
  <div class="business">
    <tab :scroll-threshold="5">
      <tab-item :selected="isReceiveMon === 3" @on-item-click="onItemClick">待发车</tab-item>
      <tab-item :selected="isReceiveMon === 4" @on-item-click="onItemClick">运输中</tab-item>
      <tab-item :selected="isReceiveMon === 5" @on-item-click="onItemClick">待妥投</tab-item>
      <tab-item :selected="isReceiveMon === 1" @on-item-click="onItemClick">待收款</tab-item>
      <tab-item :selected="isReceiveMon === 2" @on-item-click="onItemClick">待交款</tab-item>
    </tab>
    <div class="main-con">
      <!-- 待收款 start-->
      <div v-show="isReceiveMon === 1" class="receiveMon">
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
          <!-- 待收款-MainContent Start -->
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
                        <span>{{boxItem.billDate}}-{{boxItem.articleNumberSub}}</span>
                      </div>
                      <div class="right-money">
                        ¥
                        <span class="midName">{{boxItem.total}}</span>
                        <span class="rightName">({{boxItem.receivableFreight}}<span class="rightName" v-if="boxItem.settlementMethod === 2">(月结)</span>+{{boxItem.receivableGoods}})</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </van-pull-refresh>
          </div>

          <!-- 待收款-MainContent End -->

          <!-- 待收款-搜索结果-start -->
          <div v-if="recIsSearch" class="main-list-con">
            <div class="noBill">
              <div class="imgWrap">
              <img src="../../image//no-waybill.jpg" alt="">
              </div>
              <div class="msg">暂无数据，辛苦啦！</div>
            </div>
          </div>
          <!-- 待收款-搜索结果-end -->

          <!-- 待收款-Total Start -->
          <div class="total-con" v-show="!receiveDetail">
            <div class="leftCheck">
              <check-icon class="checkIcon" :value.sync="receiveAll" @click.native="receiveAllCheck"></check-icon>
              <span class="checkName">全选</span>
            </div>
            <div class="freigh">
              <span class="name">运费:</span>
              <span class="price">{{receiveFreightMoney}}</span>
            </div>
            <div class="collection">
              <span class="name">代收:</span>
              <span class="price">{{receiveCollectMoney}}</span>
            </div>
            <button class="detail" :disabled="receiveSelectedList.length === 0" @click="handleReceiveDetail()">
              <span class="name">明细</span>
              <i class="iconfont icon-iconfontarrows1"></i>
            </button>
          </div>
          <!-- 待收款-Total End -->

          <!-- 待收款明细 start-->
          <transition
            :duration="{ enter: 900, leave: 300 }"
            name="custom-classes-transition"
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <div v-show="receiveDetail" class="detailShow">
              <div class="ds-top">
                <div class="ds-t-detail" :key="index" v-for="(item, index) in receiveDetailList">
                  <div class="upName">
                    <span class="num">{{index + 1}}</span>
                    <span class="name">{{item.receiveClientName}}</span>
                  </div>
                  <div class="middleDetail">
                    <div class="total">
                      <span class="leftName">应收:</span>
                      <span class="rightNum">{{item.totalMon}}</span>
                    </div>
                    <div class="freigh">
                      <span class="leftName">运费:</span>
                      <span class="rightNum">{{item.freightMon}}</span>
                    </div>
                    <div class="collection">
                      <span class="leftName">代收:</span>
                      <span class="rightNum">{{item.collectMon}}</span>
                    </div>
                  </div>
                  <div class="downDetail">
                    <div class="total">
                      <span class="leftName">月结运费:</span>
                      <span class="rightNum">{{item.monthFreightMon}}</span>
                    </div>
                    <!-- <div class="freigh">
                    </div>
                    <div class="collection">
                    </div> -->
                  </div>
                </div>
              </div>
              <div class="ds-bottom">
                <div class="order">
                  <span class="text">共</span>
                  <span class="num">{{receiveSelectedList.length}}</span>
                  <span class="text">单</span>
                </div>
                <div class="freigh">
                  <span class="text">运费:</span>
                  <span class="num">{{receiveFreightMoney}}</span>
                </div>
                <div class="collection">
                  <span class="text">代收:</span>
                  <span class="num">{{receiveCollectMoney}}</span>
                </div>
                <button class="detail" @click="handleReceiveDetail()">
                  <span class="text">明细</span>
                  <i class="iconfont icon-shangjiantou1"></i>
                </button>
              </div>
            </div>
          </transition>
          <!-- 待收款明细 end -->

          <!-- 待收款-Bottom Start -->
          <button :class="receiveSelectedList.length > 0 ? bottomA : bottomB" type="button" :disabled="receiveSelectedList.length === 0" @click="handleToPay()">确认收款(￥{{receiveTotalMoney}})</button>
          <!-- 待收款-Bottom End -->
        </div>
        <!-- 待收款-无运单 Start -->
        <van-pull-refresh v-model="noBillRecisLoading" @refresh="noBillRecOnRefresh" class="noBill" v-show="recSourceList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
            <img src="../../image//no-waybill.jpg" alt="">
            </div>
            <div class="msg">当前没有剩余待收款的运单，辛苦啦！</div>
          </div>
        </van-pull-refresh>
        <!-- 待收款-无运单 End -->

        <!-- 待收款-点击明细后的阴影 Start -->
        <div class="shadow" @click="handleReceiveDetail()" v-show="recIsShowShadow">
        </div>
        <!-- 待收款-点击明细后的阴影 End -->
      </div>
      <!-- 待收款 end -->

      <!-- 待交款 start-->
      <div v-show="isReceiveMon === 2" class="dealMon">
        <div class="dealMon" v-show="dealSourceList.length === 0 ? false : true">
          <div class="search-con">
            <search
              v-model="dealSearchValue"
              position="absolute"
              placeholder="请输入修理厂名称"
              :auto-fixed="a"
              :auto-scroll-to-top=true
              @on-submit="dealOnSubmit"
              @on-cancel="dealOnCancel"
              @on-clear="dealOnClear"
              ref="dealSearch"
            ></search>
          </div>

          <!-- 待交款-MianContent Start -->
          <div class="main-list-con"  v-if="!dealIsSearch">
            <van-pull-refresh v-model="dealIsLoading" @refresh="dealOnRefresh">
              <div class="list-item-con" :key="index" v-for="(item, index) in dealListData">
                <div class="receiveItem">
                  <check-icon
                    @click.native="dealCheckChange(item, item.check)"
                    :value.sync="item.check"
                  ></check-icon>
                  <span class="receiveName">{{item.receiveClientName}}</span>
                </div>
                <ul>
                  <li :key="index" v-for="(boxItem, index) in item.childrenWaybill">
                    <check-icon
                      @click.native="dealCheckMoney(boxItem, boxItem.check)"
                      :value.sync="boxItem.check"
                    ></check-icon>
                    <div class="right">
                      <div class="right-time">
                        <span>{{boxItem.billDate}}-{{boxItem.articleNumberSub}}</span>
                      </div>
                      <div class="right-money">
                        ¥
                        <span class="midName">{{boxItem.total}}</span>
                        <span class="rightName">({{boxItem.receivableFreight}}<span class="rightName" v-if="boxItem.settlementMethod === 2">(月结)</span>+{{boxItem.receivableGoods}})</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </van-pull-refresh>
          </div>

          <!-- 待交款-MianContent End -->
          <!-- 待交款-search-无结果-Start -->
          <div v-if="dealIsSearch" class="main-list-con">
            <div class="noBill">
              <div class="imgWrap">
              <img src="../../image//no-waybill.jpg" alt="">
              </div>
              <div class="msg">暂无数据，辛苦啦！</div>
            </div>
          </div>
          <!-- 待交款-search-无结果-End -->

          <!-- 待交款-Total Start -->
          <div class="total-deal">
            <check-icon class="checkIcon" :value.sync="dealAll" @click.native="dealAllCheck"></check-icon>
            <span class="checkName">全选</span>
            <div class="countOrder">
              <span>共</span>
              <span class="count">{{dealSelectedList.length}}</span>
              <span>单</span>
            </div>
          </div>
          <!-- 待交款-Total End -->

          <!-- 待交款明细 start-->
          <transition
            :duration="{ enter: 900, leave: 300 }"
            name="custom-classes-transition"
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown">
            <div v-show="dealDetail" class="dealDetailShow">
              <div class="detailItem" :key="index" v-for="(item, index) in dealDetailList">
                <div class="upName">
                  <span class="num">{{index + 1}}</span>
                  <span class="name">{{item.receiveClientName}}</span>
                </div>
                <div class="middleDetail">
                  <div class="total">
                    <span class="leftName">应收:</span>
                    <span class="rightNum">{{item.totalMon}}</span>
                  </div>
                  <div class="freigh">
                    <span class="leftName">运费:</span>
                    <span class="rightNum">{{item.freightMon}}</span>
                  </div>
                  <div class="collection">
                    <span class="leftName">代收:</span>
                    <span class="rightNum">{{item.collectMon}}</span>
                  </div>
                </div>
                <div class="downDetail">
                  <div class="total">
                    <span class="leftName">月结运费:</span>
                    <span class="rightNum">{{item.monthFreightMon}}</span>
                  </div>
                  <!-- <div class="freigh">
                  </div>
                  <div class="collection">
                  </div> -->
                </div>
              </div>
            </div>
          </transition>
          <!-- 待交款明细 End -->

          <!-- 待交款-Bottom Start -->
          <div class="bottom-deal">
            <span class="name">应交:</span>
            <span class="totalPrice">{{dealTotalMoney}}</span>
            <span class="detailPrice">(代收{{dealCollectMoney}}+运费{{dealFreightMoney}})</span>
            <button class="detail" :disabled="dealSelectedList.length === 0" @click="handleDealDetail()">
              <span>明细</span>
              <i v-show="!dealDetail" class="iconfont icon-iconfontarrows1"></i>
              <i v-show="dealDetail" class="iconfont icon-shangjiantou1"></i>
            </button>
          </div>
          <!-- 待交款-Bottom End -->
        </div>
        <!-- 待交款-无运单 Start -->
        <van-pull-refresh v-model="noDealIsLoading" @refresh="dealNoBillOnRefresh" class="noBill" v-show="dealSourceList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
              <img src="../../image//no-waybill.jpg" alt="">
            </div>
            <div class="msg">当前没有剩余待交款的运单，辛苦啦！</div>
          </div>
        </van-pull-refresh>
        <!-- 待交款-无运单 End -->
        <!-- 待收款-点击明细后的阴影 Start -->
        <div class="shadow" @click="handleDealDetail()" v-show="dealIsShowShadow">
        </div>
        <!-- 待收款-点击明细后的阴影 End -->
      </div>
      <!-- 待交款 End -->

      <!-- 待发车列表 Start-->
      <waiting-for-departure
        :tabValue="isReceiveMon"
        v-show="isReceiveMon === 3"
      />
      <!-- 待发车列表 End-->

      <!-- 运输中列表 Start-->
      <in-transit
        :tabValue="isReceiveMon"
        v-show="isReceiveMon === 4"
      />
      <!-- 运输中列表 End-->

      <!-- 待妥投列表 Start-->
      <delievered
        :tabValue="isReceiveMon"
        v-show="isReceiveMon === 5"
      />
      <!-- 待妥投列表 End-->
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

  </div>
</template>

<script>
import { Tab, TabItem, XButton, Search, CheckIcon } from 'vux'
import PaymentDialog from '../Business/subPage/paymentDialog'
import PaymentListDialog from '../Business/subPage/PaymentListDialog'
import WaitingForDeparture from '../WaitingForDeparture/WaitingForDeparture'
import InTransit from '../InTransit/InTransit'
import Delievered from '../Delievered/Delievered'
import WayBillAjax from '@/api/WayBill/WayBill'
import { PullRefresh } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'Deal',
  data () {
    return {
      runShiftId: 0,
      isReceiveMon: 3,
      recSearchValue: '', // 待收款-搜索值
      dealSearchValue: '', // 待交款-搜索值
      a: false,
      recSourceList: [],
      dealSourceList: [],
      recIsSearch: false, // 待收款-判断搜索显示
      dealIsSearch: false, // 待交款-判断搜索显示
      bottomA: 'bottom-con', // 无运单-底部样式
      bottomB: 'bottom-con2', // // 有运单-底部样式
      recIsLoading: false, // 待收款-判断下拉刷新
      noBillRecisLoading: false, // 待收款-无运单-判断下拉刷新
      dealIsLoading: false, // 待交款-判断下拉刷新
      noDealIsLoading: false, // 待交款-无运单-判断下拉刷新
      recIsShowShadow: false, // 待收款-判断明细阴影
      dealIsShowShadow: false, // 待交款-判断明细阴影
      affirmPay: false, // 判断确认收款二维码页
      payListShow: false, // 判断确认收款列表页
      receiveDetail: false, // 判断-待交款-明细
      dealDetail: false, // 判断-待交款-明细
      receiveListData: [], // 待收款-集合
      dealListData: [], // 待交款-集合
      receiveDetailList: [], // 待收款-明细集合list
      dealDetailList: [], // 待交款-明细集合list
      receiveAll: false, // 待收款-判断全选
      dealAll: false, // 待交款-判断全选
      receiveQueryParam: {
      }, // 获取-待收款-运单需要的参数
      dealQueryParam: {
      } // 获取-待交款-运单需要的参数
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
    [PullRefresh.name]: PullRefresh,
    WaitingForDeparture,
    InTransit,
    Delievered
  },
  methods: {
    receiveVal (value1, value2) {
      this.runShiftId = value1
    },
    // 待收款-搜索
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
    // 待交款-搜索
    dealOnSubmit () {
      this.$refs.dealSearch.setBlur()
      let searchResult = []
      this.dealSourceList.map(item => {
        // console.log(item.receiveClientName)
        // console.log(this.dealSearchValue)
        if (item.receiveClientName.includes(this.dealSearchValue)) {
          searchResult.push(item)
        }
      })
      this.dealListData = searchResult
      if (searchResult.length === 0) {
        this.dealIsSearch = true
      } else {
        this.dealIsSearch = false
      }
      // console.log(this.dealListData)
    },
    dealOnCancel () {
      this.dealListData = this.dealSourceList
      this.dealIsSearch = false
      this.dealAll = false
    },
    dealOnClear () {
      this.dealIsSearch = false
      this.dealAll = false
      this.dealListData = this.dealSourceList
    },
    onItemClick (index) {
      if (index === 0) {
        // 待发车
        this.isReceiveMon = 3
      } else if (index === 1) {
        // 运输中
        this.isReceiveMon = 4
      } else if (index === 2) {
        // 待妥投
        this.isReceiveMon = 5
      } else if (index === 3) {
        // 待收款
        this.isReceiveMon = 1
        this.getRecWayBill()
        this.receiveAll = false
        this.recIsSearch = false
      } else if (index === 4) {
        // 待交款
        this.isReceiveMon = 2
        this.getDealWayBill()
        this.dealAll = false
        this.dealIsSearch = false
      }
    },
    // 待收款-下拉刷新
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
    // 待收款-无运单-下拉刷新
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
    // 待交款-下拉刷新
    dealOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.dealAll = false
        this.dealIsLoading = false
        this.getDealWayBill()
      }, 500)
    },
    // 待交款-无运单-下拉刷新
    dealNoBillOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noDealIsLoading = false
        this.getDealWayBill()
      }, 500)
    },
    // 判断运单全选-待收款
    receiveComputedAll () {
      this.receiveAll = this.receiveListData.every(item => {
        return item.check
      })
    },
    // 判断运单全选-待交款
    dealComputedAll () {
      this.dealAll = this.dealListData.every(item => {
        return item.check
      })
    },
    // 选择一家修理厂运单-待收款
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
    // 选择一家修理厂运单-待交款
    dealCheckChange (item, check) {
      item.childrenWaybill.forEach(item1 => {
        if (item.id === item1.pid) {
          item1.check = check
        }
      })
      this.dealComputedAll()
    },
    // 单选运单-待收款
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
    // 单选运单-待交款
    dealCheckMoney (boxItem, check) {
      this.dealListData = this.dealListData.map(item => {
        item.childrenWaybill.forEach(item1 => {
          if (item1.id === boxItem.id) {
            item1.check = check
          }
        })
        return item
      })
      this.dealListData.map(item => {
        if (item.id === boxItem.pid) {
          item.check = item.childrenWaybill.every(item1 => {
            return item1.check
          })
        }
        return item
      })
      this.dealComputedAll()
    },
    // 全选运单-待收款
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
    // 全选运单-待交款
    dealAllCheck () {
      if (this.dealAll) {
        this.dealListData.forEach(item => {
          item.check = true
          item.childrenWaybill.forEach(item1 => {
            item1.check = true
          })
        })
      } else {
        this.dealListData.forEach(item => {
          item.check = false
          item.childrenWaybill.forEach(item1 => {
            item1.check = false
          })
        })
      }
    },
    // 待收款-选中运单明细
    handleReceiveDetail () {
      if (!this.receiveDetail) {
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
            checkedItems.forEach(childrenItem => {
              obj.settlementMethod = childrenItem.settlementMethod
            })
            obj.totalMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + Number(next.total)
            }, 0)).toFixed(1)
            obj.collectMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + Number(next.receivableGoods)
            }, 0)).toFixed(1)
            obj.freightMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + (next.settlementMethod !== 2 ? Number(next.receivableFreight) : 0)
            }, 0)).toFixed(1)
            obj.monthFreightMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + (next.settlementMethod === 2 ? Number(next.receivableFreight) : 0)
            }, 0)).toFixed(1)
            this.receiveDetailList.push(obj)
          }
        })
        // console.log(this.receiveDetailList)
        // debugger
      } else {
        this.receiveDetailList = []
      }
      this.receiveDetail = !this.receiveDetail
      this.recIsShowShadow = !this.recIsShowShadow
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
            return pre + (next.settlementMethod !== 2 ? Number(next.receivableFreight) : 0)
          }, 0)).toFixed(1)
          this.receiveDetailList.push(obj)
        }
      })
    },
    // 待交款-选中运单明细
    handleDealDetail () {
      if (!this.dealDetail) {
        this.dealListData.map(item => {
          let obj1 = {}
          let hasChildChecked = item.childrenWaybill.some(childItem => {
            return childItem.check
          })
          if (hasChildChecked) {
            obj1.receiveClientName = item.receiveClientName
            let checkedItems = item.childrenWaybill.filter(filItem => {
              return filItem.check
            })
            checkedItems.forEach(childrenItem => {
              obj1.settlementMethod = childrenItem.settlementMethod
            })
            obj1.totalMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + Number(next.total)
            }, 0)).toFixed(1)
            obj1.collectMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + Number(next.receivableGoods)
            }, 0)).toFixed(1)
            obj1.freightMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + (next.settlementMethod !== 2 ? Number(next.receivableFreight) : 0)
            }, 0)).toFixed(1)
            obj1.monthFreightMon = (checkedItems.reduce((pre, next, index, array) => {
              return pre + (next.settlementMethod === 2 ? Number(next.receivableFreight) : 0)
            }, 0)).toFixed(1)
            this.dealDetailList.push(obj1)
          }
        })
        // console.log(this.dealDetailList)
        // debugger
      } else {
        this.dealDetailList = []
      }
      this.dealDetail = !this.dealDetail
      this.dealIsShowShadow = !this.dealIsShowShadow
    },
    // 获取-待收款-运单
    getRecWayBill () {
      WayBillAjax.WaitReceivables(this.receiveQueryParam).then(res => {
        if (res.code === 200) {
          this.recSourceList = []
          this.receiveListData = []
          res.data.map(item => {
            if (item.childrenWaybill.length > 0) {
              this.recSourceList = this.recSourceList.concat(item.childrenWaybill)
              this.receiveListData = this.receiveListData.concat(item.childrenWaybill)
            }
          })
          this.receiveListData.forEach(item => {
            item.childrenWaybill.forEach(childrenItem => {
              if (childrenItem.settlementMethod === 2) {
                childrenItem.total = (Number(childrenItem.receivableGoods)).toFixed(1)
              } else {
                childrenItem.total = (Number(childrenItem.receivableGoods) + Number(childrenItem.receivableFreight)).toFixed(1)
              }
              childrenItem.billDate = (childrenItem.createTime).slice(5, 7) + (childrenItem.createTime).slice(8, 10)
            })
          })
        }
        if (this.recSearchValue) {
          this.recOnSubmit()
        }
      })
    },
    // 获取-待交款-运单
    getDealWayBill () {
      WayBillAjax.WaitHandInMoney(this.dealQueryParam).then(res => {
        if (res.code === 200) {
          this.dealSourceList = []
          this.dealListData = []
          res.data.map(item => {
            if (item.childrenWaybill.length > 0) {
              this.dealSourceList = this.dealSourceList.concat(item.childrenWaybill)
              this.dealListData = this.dealListData.concat(item.childrenWaybill)
            }
          })
          this.dealListData.forEach(item => {
            item.childrenWaybill.forEach(childrenItem => {
              if (childrenItem.settlementMethod === 2) {
                childrenItem.total = (Number(childrenItem.receivableGoods)).toFixed(1)
              } else {
                childrenItem.total = (Number(childrenItem.receivableGoods) + Number(childrenItem.receivableFreight)).toFixed(1)
              }
              childrenItem.billDate = (childrenItem.createTime).slice(5, 7) + (childrenItem.createTime).slice(8, 10)
            })
          })
        }
        if (this.dealSearchValue) {
          this.dealOnSubmit()
        }
      })
    },
    // 点击确认收款
    handleToPay () {
      this.receiveDetailList = []
      this.getCheckList()
      console.log(this.receiveDetailList)
      if (this.receiveDetailList.length === 1 && this.checkAllIsOpen) {
        this.affirmPay = true
      } else {
        this.payListShow = true
        // console.log('线下')
      }
    },
    // 成功收款
    paySuccess () {
      this.receiveDetailList = []
      this.affirmPay = false
      this.payListShow = false
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
    }
  },
  computed: {
    ...mapGetters(['formatDate']),
    // 待收款-选中的运单集合
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
    // 待交款-选中的运单集合
    dealSelectedList () {
      let childItemList = []
      this.dealListData.forEach(item => {
        item.childrenWaybill.forEach(childItem => {
          if (childItem.check) {
            childItemList.push(childItem)
          }
        })
      })
      return childItemList
    },
    // 总应收-待收款
    receiveTotalMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + Number(next.total)
      }, 0)).toFixed(1)
    },
    // 总应收-待交款
    dealTotalMoney () {
      return (this.dealSelectedList.reduce((pre, next, index, array) => {
        return pre + Number(next.total)
      }, 0)).toFixed(1)
    },
    // 总代收-待收款
    receiveCollectMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + (next.waybillStatus === 4 ? 0 : Number(next.receivableGoods))
      }, 0)).toFixed(1)
    },
    // 总代收-待交款
    dealCollectMoney () {
      return (this.dealSelectedList.reduce((pre, next, index, array) => {
        return pre + (next.waybillStatus === 4 ? 0 : Number(next.receivableGoods))
      }, 0)).toFixed(1)
    },
    // 总运费-代收款
    receiveFreightMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + (next.settlementMethod === 2 ? 0 : Number(next.receivableFreight))
      }, 0)).toFixed(1)
    },
    // 总运费-代交款
    dealFreightMoney () {
      return (this.dealSelectedList.reduce((pre, next, index, array) => {
        return pre + (next.settlementMethod === 2 ? 0 : Number(next.receivableFreight))
      }, 0)).toFixed(1)
    },
    // 选中子是否全部开通驮付宝
    checkAllIsOpen () {
      return this.receiveSelectedList.every(item => {
        return item.waybillClassify === 2
      })
    }
  },
  created () {
    if (Number(this.$route.query.fromType) === 4) {
      this.isReceiveMon = 4
    }
    if (Number(this.$route.query.fromType) === 3) {
      this.isReceiveMon = 3
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
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
     /deep/ .van-pull-refresh__track {
      height: 100%;
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
      overflow: hidden;
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
      box-sizing: border-box;
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
            justify-content: space-between;
            margin-left: 20px;
            font-weight: 400;
            span {
              font-size: 30px;
              color: #3e3e3e;
            }
            .right-money {
              width: 55%;
              font-size: 26px;
              color: #ff5400;
            }
            .midName {
              font-size: 30px;
              color: #ff5400;
            }
            .rightName {
              font-size: 24px;
              color: #a0a0a0;
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
      justify-content: space-between;
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
        font-size: 26px;
        color: #ff5400;
        margin-left: 10px;
      }
      .freigh {
        .name {
          font-size: 26px;
          color: #585858;
        }
      }
      .collection {
        .name {
          font-size: 26px;
          color: #585858;
        }
      }
      .detail {
        margin: 0;
        padding: 0;
        background: #FFFFFF;
        border: 1px solid transparent;
        outline: none;
        .name {
          font-size: 26px;
          color: #3E3E3E;
        }
        /deep/ i {
          color: #4d7bfe;
          width: 20px;
          height: 12px;
          margin-left: 0;
        }
      }
    }
    .detailShow {
      z-index: 9999;
      height: 457px;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100px;
      .ds-top {
        width: 100%;
        height: 355px;
        overflow-y: scroll;
        margin-bottom: 10px;
      }
      .ds-top::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      .ds-top::-webkit-scrollbar:vertical {
        width: 12px;
      }
      .ds-top::-webkit-scrollbar:horizontal {
        height: 12px;
      }
      .ds-top::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        border: 2px solid #ffffff;
      }
      .ds-top::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #ffffff;
      }
      .ds-t-detail {
        height: 50%;
        width: 97%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .upName {
        width: 100%;
        margin-left: 35px;
        margin-top: 30px;
        margin-bottom: 25px;
        .num {
          font-size: 29px;
          color: #4d68fd;
        }
        .name {
          color: #3e3e3e;
          font-weight: bold;
          font-size: 28px;
        }
      }
      .middleDetail {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 92%;
        .leftName {
          color: #a7a7a7;
          font-size: 26px;
          font-weight: 500;
        }
        .rightNum {
          color: #ff5400;
          font-size: 30px;
          font-weight: 400;
        }
      }
      .downDetail {
        width: 92%;
        display: flex;
        align-items: center;
        margin-top: 20px;
        .leftName {
          color: #a7a7a7;
          font-size: 26px;
          font-weight: 500;
        }
        .rightNum {
          color: #ff5400;
          font-size: 30px;
          font-weight: 400;
        }
      }
      .ds-bottom {
        width: 100%;
        height: 92px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        .text {
          color: #585858;
          font-size: 26px;
        }
        .num {
          color: #ff5400;
          font-size: 30px;
        }
        .detail {
          background: #FFFFFF;
          /deep/ i {
            color: #4d7bfe;
            width: 20px;
            height: 12px;
            margin-left: 0;
          }
        }
      }
    }
    .bottom-con {
      width: 100%;
      height: 100px;
      background: @color-extrude;
      // display: flex;
      // align-items: center;
      // justify-content: space-around;
      .mixin-sc(36px;#fff);
      position: relative;
    }
    .bottom-con2 {
      width: 100%;
      height: 100px;
      background: #e6e6e6;
      // display: flex;
      // align-items: center;
      // justify-content: space-around;
      .mixin-sc(36px;#a5a5a5);
      position: relative;
    }
    .shadow {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      opacity: 0.5;
      height: 90.5%;
      z-index: 999;
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
    .dealMon {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      .receiveName {
        font-size: 28px;
        font-weight: bold;
        color: rgba(77, 123, 254, 1);
        margin-left: 20px;
      }
    }
    .total-deal {
      width: 100%;
      height: 74px;
      margin: 0 20px;
      display: flex;
      align-items: center;
      border-top: 1px solid #eee;
      background: #F6F8FF;
      .checkName {
          font-size: 26px;
          color: #3E3E3E;
          margin-left: 20px;
        .name {
          color: #3e3e3e;
          font-size: 26px;
        }
      }
      .countOrder {
        margin-left: 44px;
        span {
          font-size: 26px;
          color: #585858;
        }
        .count {
          color: #ff5400;
          font-size: 30px;
        }
      }
      .conutOrder span {
        font-size: 26px;
        font-weight: 500;
        color: #585858;
      }
    }
    .dealDetailShow {
      z-index: 9999;
      height: 355px;
      width: 100%;
      // overflow: auto;
      overflow-y: scroll;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 102px;
      background: rgba(255, 255, 255, 1);
    }
    .dealDetailShow::-webkit-scrollbar {
      -webkit-appearance: none;
    }
    .dealDetailShow::-webkit-scrollbar:vertical {
      width: 12px;
    }
    .dealDetailShow::-webkit-scrollbar:horizontal {
      height: 12px;
    }
    .dealDetailShow::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      border: 2px solid #ffffff;
    }
    .dealDetailShow::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #ffffff;
    }
    .detailItem {
      height: 50%;
      width: 97%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .upName {
        width: 100%;
        margin-left: 36px;
        margin-top: 31px;
        margin-bottom: 33px;
        .num {
          font-size: 29px;
          color: #4d68fd;
        }
        .name {
          color: #3e3e3e;
          font-weight: bold;
          font-size: 28px;
        }
      }
      .middleDetail {
        width: 92%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .leftName {
          color: #a7a7a7;
          font-size: 26px;
          font-weight: 500;
        }
        .rightNum {
          color: #ff5400;
          font-size: 30px;
          font-weight: 400;
        }
      }
      .downDetail {
        width: 92%;
        display: flex;
        align-items: center;
        margin-top: 20px;
        .leftName {
          color: #a7a7a7;
          font-size: 26px;
          font-weight: 500;
        }
        .rightNum {
          color: #ff5400;
          font-size: 30px;
          font-weight: 400;
        }
      }
    }
    .bottom-deal {
      position: relative;
      display: flex;
      width: 100%;
      height: 100px;
      align-items: center;
      background: #FFFFFF;
      .name {
        font-size: 30px;
        color: #585858;
        margin-left: 29px;
        font-weight: bold;
      }
      .totalPrice {
        font-size: 30px;
        color: #ff5400;
        margin-left: 15px;
      }
      .detailPrice {
        font-size: 26px;
        color: #a0a0a0;
        margin-left: 15px;
      }
      .detail {
        position: absolute;
        right: 30px;
        span {
          font-size: 26px;
          color: #3e3e3e;
        }
        /deep/ i {
          color: #4d7bfe;
          width: 20px;
          height: 12px;
          margin-left: 0;
        }
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
