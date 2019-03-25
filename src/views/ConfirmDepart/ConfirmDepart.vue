<template>
  <div class="confirm-depart">
    <div class="main-con">
      <div class="receiveMon">
        <x-header
          title="发车"
          @on-click-back="goBack()"
          :left-options="{backText: '', preventGoBack: true}">
          <button slot="right" @click="confirmDepart">确认发车</button>
          <!-- <button slot="right" :disabled="truckSourceList.length === 0" :class="{disabledBtn: truckSourceList.length === 0}" @click="confirmDepart">确认发车</button> -->
        </x-header>
        <tab>
          <tab-item selected @on-item-click="onItemClick">待装车</tab-item>
          <tab-item @on-item-click="onItemClick">已装车</tab-item>
        </tab>
        <div class="main-con">
          <!-- 待装车 -->
          <div class="receiveMon" v-show="recSourceList.length !== 0 && tabIndex === 0">
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
              <div class="sort-con" @click="sortList"><i class="iconfont icon-paixu"></i><div>倒序</div></div>
            </div>
            <div class="main-list-con" v-if="!recIsSearch">
              <van-pull-refresh v-model="recIsLoading" @refresh="recOnRefresh">
                <div class="list-item-con" :key="index" v-for="(item, index) in receiveListData">
                  <div class="receiveItem">
                    <check-icon
                      @click.native="receiveCheckChange(item, item.check)"
                      :value.sync="item.check"
                    ></check-icon>
                    <div class="click-con" @click="handlePayRec(item, item.check)">
                      <span class="receiveName">{{item.receiveClientName}} ({{item.lineName}})</span>
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
                          <span>{{boxItem.articleNumberSub}} (<span class="packageQuantity-span">{{boxItem.packageQuantity}}</span>件)</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </van-pull-refresh>
            </div>
            <div v-if="recIsSearch" class="main-list-con">
              <div class="noBill">
                <div class="imgWrap">
                <img src="../../image//no-waybill.jpg" alt="">
                </div>
                <div class="msg">暂无数据，辛苦啦！</div>
              </div>
            </div>
            <div class="total-con">
              <div class="leftCheck">
                <check-icon class="checkIcon" :value.sync="receiveAll" @click.native="receiveAllCheck"></check-icon>
                <span class="checkName">全选</span>
              </div>
              <div class="freigh">
                <span class="name">共<span class="total-packageQuantity">{{totalPackageQuantity}}</span>件</span>
              </div>
              <button :disabled="totalPackageQuantity > 0 ? false : true" class="collection" :class="{disabledButton: totalPackageQuantity === 0}" @click="sureTruck">确认装车</button>
            </div>
          </div>
          <van-pull-refresh v-model="noBillRecisLoading" @refresh="noBillRecOnRefresh" class="noBill" v-show="(tabIndex === 0 && recSourceList.length === 0) || (tabIndex === 1 && truckSourceList.length === 0)">
            <div class="noBill">
              <div class="imgWrap">
                <img src="../../image//no-waybill.jpg" alt="">
              </div>
              <div v-if="tabIndex === 0" class="msg">当前没有剩余待装车的运单，辛苦啦！</div>
              <div v-if="tabIndex === 1" class="msg">当前没有已装车的运单，辛苦啦！</div>
            </div>
          </van-pull-refresh>
          <!-- 已装车 -->
          <div class="receiveMon" v-show="truckSourceList.length !== 0 && tabIndex === 1">
            <div class="search-con">
              <search
                v-model="truckSearchValue"
                position="absolute"
                placeholder="请输入修理厂名称"
                :auto-fixed="a"
                @on-submit="truckOnSubmit"
                @on-cancel="truckOnCancel"
                @on-clear="truckOnClear"
                :auto-scroll-to-top=true
                ref="truckSearch"
              ></search>
              <div class="sort-con" @click="sortTruckList"><i class="iconfont icon-paixu"></i><div>倒序</div></div>
            </div>
            <div class="main-list-con" v-if="!truckIsSearch">
              <van-pull-refresh v-model="truckIsLoading" @refresh="truckOnRefresh">
                <div class="list-item-con" :key="index" v-for="(item, index) in truckListData">
                  <div class="receiveItem">
                    <check-icon
                      @click.native="truckCheckChange(item, item.check)"
                      :value.sync="item.check"
                    ></check-icon>
                    <div class="click-con" @click="handlePayRec(item, item.check)">
                      <span class="receiveName">{{item.receiveClientName}} ({{item.lineName}})</span>
                    </div>
                  </div>
                  <ul>
                    <li :key="index" v-for="(boxItem, index) in item.childrenWaybill">
                      <check-icon
                        @click.native="truckCheckMoney(boxItem, boxItem.check)"
                        :value.sync="boxItem.check"
                      ></check-icon>
                      <div class="right">
                        <div class="right-time">
                          <span>{{boxItem.articleNumberSub}} (<span class="packageQuantity-span">{{boxItem.packageQuantity}}</span>件)</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </van-pull-refresh>
            </div>
            <div v-if="truckIsSearch" class="main-list-con">
              <div class="noBill">
                <div class="imgWrap">
                <img src="../../image//no-waybill.jpg" alt="">
                </div>
                <div class="msg">暂无数据，辛苦啦！</div>
              </div>
            </div>
            <div class="total-con">
              <div class="leftCheck">
                <check-icon class="checkIcon" :value.sync="truckAll" @click.native="truckAllCheck"></check-icon>
                <span class="checkName">全选</span>
              </div>
              <div class="freigh">
                <span class="name">共<span class="total-packageQuantity">{{truckTotalPackage}}</span>件</span>
              </div>
              <button :disabled="truckTotalPackage > 0 ? false : true" class="collection" :class="{disabledButton: truckTotalPackage === 0}" @click="sureUnTruck">确认卸货</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirmDepart"
        :confirm-text="'立即发车'"
        :cancel-text="'暂不发车'"
        @on-cancel="showConfirmDepart = false"
        @on-confirm="onConfirm">
        <p style="text-align:center;">存在未装车的运单是否确认发车？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showNowDepart"
        :confirm-text="'立即发车'"
        :cancel-text="'暂不发车'"
        @on-cancel="onCancel"
        @on-confirm="onConfirmDepart">
        <p style="text-align:center;">{{confirmText}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem, XButton, Search, CheckIcon, Confirm, TransferDomDirective as TransferDom } from 'vux'
// import WayBillAjax from '@/api/WayBill/WayBill'
import ConfirmDepartAjax from '@/api/ConfirmDepart/ConfirmDepart'
import { PullRefresh } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'ConfirmDepart',
  data () {
    return {
      tabIndex: 0,
      lineId: '', // 线路id
      runShiftId: '', // 班次id
      lineTime: '', // 班次时间
      confirmText: '装货成功！已无待装货物，是否立即发车？',
      recSearchValue: '', // 待装车-搜索值
      truckSearchValue: '', // 已装车-搜索值
      a: false,
      recSourceList: [], // 待装车源数据
      truckSourceList: [], // 已装车源数据
      recIsSearch: false, // 待装车-判断搜索显示
      truckIsSearch: false, // 已装车-判断搜索显示
      bottomA: 'bottom-con', // 无运单-底部样式
      recIsLoading: false, // 待装车-判断下拉刷新
      truckIsLoading: false, // 已装车-判断下拉刷新
      noBillRecisLoading: false, // 待装车-无运单-判断下拉刷
      receiveListData: [], // 待装车-集合
      truckListData: [], // 已装车-集合
      receiveAll: false, // 待装车-判断全选
      truckAll: false, // 已装车-判断全选
      receiveQueryParam: {
        waybillStatus: 0,
        runShiftId: ''
      }, // 获取-待装车-运单需要的参数
      showConfirmDepart: false, // 未全选确认发车弹框
      showNowDepart: false // 确认发车弹框
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Tab,
    TabItem,
    XButton,
    Search,
    CheckIcon,
    Confirm,
    [PullRefresh.name]: PullRefresh
  },
  computed: {
    ...mapGetters(['formatDate']),
    // 待装车-选中的运单集合
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
    // 已装车-选中的运单集合
    truckSelectedList () {
      let childItemList = []
      this.truckListData.forEach(item => {
        item.childrenWaybill.forEach(childItem => {
          if (childItem.check) {
            childItemList.push(childItem)
          }
        })
      })
      return childItemList
    },
    // 待装车-选中总件数
    totalPackageQuantity () {
      return this.receiveSelectedList.reduce((pre, next) => {
        return pre + next.packageQuantity
      }, 0)
    },
    // 已装车-选中总件数
    truckTotalPackage () {
      return this.truckSelectedList.reduce((pre, next) => {
        return pre + next.packageQuantity
      }, 0)
    }
  },
  created () {
    this.runShiftId = this.$route.query.runShiftId
    this.lineId = this.$route.query.lineId
    this.lineTime = this.$route.query.lineTime
    this.getWayBill()
  },
  methods: {
    goBack () {
      this.$router.push({name: 'Deal', query: {fromType: 3}})
    },
    onItemClick (index) {
      this.tabIndex = index
      if (index === 0) {
        this.getWayBill()
        this.receiveAll = false
      } else if (index === 1) {
        this.getTruckBill()
        this.truckAll = false
      }
    },
    // 确认发车
    confirmDepart () {
      if (this.recSourceList.length > 0) {
        this.showConfirmDepart = true
      } else {
        let now = new Date()
        let nowTime = `${now.getHours()}${now.getMinutes()}`
        if (Number(this.lineTime.split(':').join('')) > Number(nowTime)) {
          this.confirmText = '发车时间未到，确定发车吗？'
          this.showNowDepart = true
        } else {
          this.onConfirm()
        }
      }
    },
    // 倒序排序
    sortList () {
      this.receiveListData.reverse()
    },
    // 倒序排序
    sortTruckList () {
      this.truckListData.reverse()
    },
    // 点击确认发车弹框确认发车
    onConfirm () {
      if (this.recSourceList.length === 0) { // 无待装车
        this.departFn()
      } else {
        ConfirmDepartAjax.queryOtherShift({lineId: this.lineId}).then(res => {
          if (res.code === 200) {
            if (!res.data) {
              this.confirmText = '今天该线路下已无班次，确认发车后未装车运单将流入到次日！'
              this.showNowDepart = true
            } else {
              this.departFn()
            }
          }
        })
      }
    },
    // 确认发车接口调用
    departFn () {
      ConfirmDepartAjax.departure({shiftRunId: this.runShiftId}).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '发车成功！'
          })
          // this.getTruckBill()
          this.$router.push({name: 'Deal', query: {fromType: 4}})
        }
      })
    },
    // 确认装车
    sureTruck () {
      let waybillIdList = this.receiveSelectedList.map(item => {
        return item.waybillId
      })
      ConfirmDepartAjax.confirmTruck({waybillStatus: 1, waybillIdList}).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '装车成功！'
          })
          this.getWayBill(true)
          this.getTruckBill()
        }
      })
    },
    // 确认卸货
    sureUnTruck () {
      let waybillIdList = this.truckSelectedList.map(item => {
        return item.waybillId
      })
      // 卸货 11， 1 装车
      ConfirmDepartAjax.confirmTruck({waybillStatus: 11, waybillIdList}).then(res => {
        if (res.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '卸货成功！'
          })
          this.getTruckBill()
        }
      })
    },
    onCancel () {
      this.confirmText = '装货成功！已无待装货物，是否立即发车？'
      this.showNowDepart = false
    },
    // 确认发车
    onConfirmDepart () {
      this.onConfirm()
    },
    // 待装车-搜索
    recOnSubmit () {
      this.$refs.recSearch.setBlur()
      let searchResult = []
      this.recSourceList.map(item => {
        if (item.receiveClientName.includes(this.recSearchValue)) {
          searchResult.push(item)
        }
      })
      this.receiveListData = [...searchResult]
      if (searchResult.length === 0) {
        this.recIsSearch = true
      } else {
        this.recIsSearch = false
      }
    },
    // 已装车-搜索
    truckOnSubmit () {
      this.$refs.truckSearch.setBlur()
      let searchResult = []
      this.truckSourceList.map(item => {
        if (item.receiveClientName.includes(this.truckSearchValue)) {
          searchResult.push(item)
        }
      })
      this.truckListData = [...searchResult]
      if (searchResult.length === 0) {
        this.truckIsSearch = true
      } else {
        this.truckIsSearch = false
      }
    },
    // 待装车-搜索取消
    recOnCancel () {
      this.recIsSearch = false
      this.receiveListData = this.recSourceList
    },
    // 已装车-搜索取消
    truckOnCancel () {
      this.truckIsSearch = false
      this.truckListData = this.truckSourceList
    },
    // 待装车-搜索清空输入内容
    recOnClear () {
      this.recIsSearch = false
      this.receiveListData = this.recSourceList
    },
    // 已装车-搜索清空输入内容
    truckOnClear () {
      this.truckIsSearch = false
      this.truckListData = this.truckSourceList
    },
    // 待装车-下拉刷新
    recOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.recIsLoading = false
        this.receiveAll = false
        this.getWayBill()
      }, 500)
    },
    // 已装车-下拉刷新
    truckOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.truckIsLoading = false
        this.truckAll = false
        this.getTruckBill()
      }, 500)
    },
    // 待装车-无运单-下拉刷新
    noBillRecOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noBillRecisLoading = false
        if (this.tabIndex === 0) {
          this.getWayBill()
        } else if (this.tabIndex === 1) {
          this.getTruckBill()
        }
      }, 500)
    },
    // 判断运单全选-待装车
    receiveComputedAll () {
      this.receiveAll = this.receiveListData.every(item => {
        return item.check
      })
    },
    // 判断运单全选-已装车
    truckComputedAll () {
      this.truckAll = this.truckListData.every(item => {
        return item.check
      })
    },
    // 选择一家修理厂运单-待装车
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
    // 选择一家修理厂运单-已装车
    truckCheckChange (item, check) {
      this.truckListData.forEach(outerItem => {
        if (item.id === outerItem.id) {
          outerItem.check = check
        }
      })
      item.childrenWaybill.forEach(item1 => {
        if (item.id === item1.pid) {
          item1.check = check
        }
      })
      this.truckComputedAll()
    },
    // 单选运单-待装车
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
    // 单选运单-已装车
    truckCheckMoney (boxItem, check) {
      this.truckListData = this.truckListData.map(item => {
        item.childrenWaybill.forEach(item1 => {
          if (item1.id === boxItem.id) {
            item1.check = check
          }
        })
        return item
      })
      this.truckListData.map(item => {
        if (item.id === boxItem.pid) {
          item.check = item.childrenWaybill.every(item1 => {
            return item1.check
          })
        }
        return item
      })
      this.truckComputedAll()
    },
    // 全选运单-待装车
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
    // 全选运单-已装车
    truckAllCheck () {
      if (this.truckAll) {
        this.truckListData.forEach(item => {
          item.check = true
          item.childrenWaybill.forEach(item1 => {
            item1.check = true
          })
        })
      } else {
        this.truckListData.forEach(item => {
          item.check = false
          item.childrenWaybill.forEach(item1 => {
            item1.check = false
          })
        })
      }
    },
    // 获取-待装车-运单
    getWayBill (type) {
      ConfirmDepartAjax.queryWaybillList({waybillStatus: '11', runShiftId: this.runShiftId}).then(res => {
        if (res.code === 200) {
          this.receiveListData = res.data
          this.recSourceList = res.data
          if (res.data.length === 0) {
            if (type) {
              this.showNowDepart = true
            }
          }
        }
        if (this.recSearchValue) {
          this.recOnSubmit()
        }
      })
    },
    // 获取-已装车-运单
    getTruckBill () {
      ConfirmDepartAjax.queryWaybillList({waybillStatus: '1', runShiftId: this.runShiftId}).then(res => {
        if (res.code === 200) {
          this.truckSourceList = res.data
          this.truckListData = res.data
        }
        if (this.truckSearchValue) {
          this.recOnSubmit()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
@import "../../style/base.less";
.confirm-depart {
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
      // overflow: hidden;
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
      margin-bottom: 20px;
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
            .packageQuantity-span{
              color: #FF5400;
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
      justify-content: flex-start;
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
        margin-left: 44px;
        margin-right: 136px;
        width: 200px;
        .name {
          font-size: 26px;
          color: #585858;
        }
        .total-packageQuantity{
          .mixin-sc(26px;#ff5400);
        }
      }
      .collection {
        width: 198px;
        height: 68px;
        background: #4D80FD;
        border-radius: 34px;
        line-height: 68px;
        text-align: center;
        .mixin-sc(29px;#FFFFFF);
        .name {
          font-size: 26px;
          color: #585858;
        }
      }
      .disabledButton{
        background: #e6e6e6;
        color: #a5a5a5;
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
        overflow: auto;
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
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .upName {
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
      .downDetail {
        display: flex;
        align-items: center;
        justify-content: space-around;
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
      overflow: auto;
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
      width: 100%;
      display: flex;
      flex-direction: column;
      .upName {
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
      .downDetail {
        display: flex;
        align-items: center;
        justify-content: space-around;
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
.confirm-depart {
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
  .vux-header{
    height: 90px;
    display: flex;
    align-items: center;
    position: relative;
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
      width: 180px;
      height: 40px;
      button{
        height: 40px;
        position: absolute;
        top: 18px;
        right:20px;
        .mixin-sc(36px;#4D80FD);
      }
      .disabledBtn{
        color: #aaa;
      }
    }
  }
  .vux-search-box {
    height: 80px;
    margin: 0 0px 0px 20px;
  }
  .sort-con{
    height: 80px;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    i{
      .mixin-sc(32px; #7D7575);
    }
    div{
      .mixin-sc(22px; #9A9A9A);
    }
  }
  .sort-con:hover{
    i{
      .mixin-sc(32px; #4D80FD);
    }
    div{
      .mixin-sc(22px; #4D80FD);
    }
  }
  .weui-search-bar {
    width: 100%;
    height: 80px;
    .weui-search-bar__label {
      display: flex;
      align-items: center;
      // justify-content: center;
      span {
          .mixin-sc(26px; #CFCFCF);
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
        .mixin-sc(26px; #323232);
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
  .van-pull-refresh__text {
    font-size: 28px;
  }
  .van-pull-refresh__loading span{
    font-size: 28px;
  }
}
</style>
