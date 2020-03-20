<template>
   <div class="moreRecord">
      <!-- 头部 -->
      <div class="c-header">
        <div @click="routerGo()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title" @click="handleSelect()">{{headerTitle}}
          <div>
            <x-icon v-if="!selectShow" type="ios-arrow-down"></x-icon>
            <x-icon v-if="selectShow" type="ios-arrow-up"></x-icon>
          </div>
        </div>
        <div class="c-h-right"><i class="iconfont icon-shaixuan1" @click="choose()"></i></div>
      </div>
       <!-- 单选框盒子 -->
       <transition
        :duration="{ enter: 900, leave: 300 }"
        name="custom-classes-transition"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp">
        <div v-if="selectShow" class="c-select">
          <checker @on-change="handleToStatus" radio-required v-model="flowDealerWithdrawCashParam.dealStatus" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <div class="checkLine">
              <checker-item :value="''">{{ '全部'}}</checker-item>
            </div>
            <div class="checkLine">
              <checker-item :value="1">{{ '处理中'}}</checker-item>
              <checker-item :value="2">{{ '成功'}}</checker-item>
              <checker-item :value="3">{{ '失败'}}</checker-item>
            </div>
          </checker>
        </div>
      </transition>

     <div class="content" v-if="listData.length === 0 ? false : true">
       <!-- 运单 -->
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh()">
        <div class="c-waybill">
          <ul class="c-w-wrap">
            <li @click="goToDetail(item.transactionId)" class="c-w-item" :key="index" v-for="(item, index) in listData" >
                <div class="left">
                  <div class="state" :class="{'success': item.dealStatus === '成功', 'failed': item.dealStatus === '失败', 'deal': item.dealStatus === '处理中'}">{{item.dealStatus}}</div>
                  <div class="date">{{item.withdrawCashTime}}</div>
                </div>
                <div class="right">
                  <span class="mony">￥{{item.withdrawCashAmount}}</span>
                  <span class="arrow"><i class="iconfont icon-youjiantou1"></i></span>
                </div>
            </li>
          </ul>
        </div>
       </van-pull-refresh>
     </div>

      <!-- 提现-无运单 Start -->
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh()" v-if="listData.length === 0 ? true : false">
        <div class="noBill">
          <div class="imgWrap">
          <img src="../../image//noInfo.png" alt="">
          </div>
          <!-- <div class="msg">暂无数据！</div> -->
        </div>
        </van-pull-refresh>
      <!-- 提现-无运单 End -->

     <!-- 点击后的阴影 Start -->
      <div class="c-shadow" @click="handleSelect()" v-if="selectShow">
      </div>
      <!-- 点击后的阴影 End -->

    <!--右侧弹框-->
    <div v-transfer-dom class="popupRight">
      <popup v-model="show9" position="right">
        <div class="searchBar">
          <h3>提现发起时间</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <datetime
                  v-model="flowDealerWithdrawCashParam.withdrawCashTimeStart"
                  placeholder="开始时间 "
                  @on-cancel="log('cancel')"
                  @on-hide="log('hide', $event)"></datetime>
                </div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-demo flexLeft">
                  <datetime
                  v-model="flowDealerWithdrawCashParam.withdrawCashTimeEnd"
                  placeholder="结束时间"
                  @on-cancel="log('cancel')"
                  @on-hide="log('hide', $event)"></datetime>
                </div>
                </flexbox-item>
            </flexbox>
          </div>

          <h3>提现成功时间</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <!-- <datetime
                  v-model="flowDealerWithdrawCashParam.bankPaymentTimeStart"
                  placeholder="开始时间 "
                  @on-cancel="log('cancel')"
                  @on-hide="log('hide', $event)"></datetime> -->
                  <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="开始时间" v-model="flowDealerWithdrawCashParam.bankPaymentTimeStart"></calendar>
                </div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-demo flexLeft">
                  <!-- <datetime
                  v-model="flowDealerWithdrawCashParam.bankPaymentTimeEnd"
                  placeholder="结束时间"
                  @on-cancel="log('cancel')"
                  @on-hide="log('hide', $event)"></datetime> -->
                  <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="结束时间" v-model="flowDealerWithdrawCashParam.bankPaymentTimeEnd"></calendar>
                </div>
                </flexbox-item>
            </flexbox>
          </div>
        </div>
        <!-- btn -->
        <div class="btn_footer">
          <span @click="reset">重置</span>
          <span @click="sure">确定</span>
        </div>
      </popup>
    </div>
   </div>
</template>

<script type="text/ecmascript-6">
import { PullRefresh } from 'vant'
import FooterBar from '@/components/FooterBar/FooterBar'
import TreasureAjax from '@/api/Treasure/Treasure'
import { Checker, CheckerItem, Popup, TransferDom, Flexbox, FlexboxItem, Datetime, Calendar } from 'vux'
export default {
  name: 'RecordOfTotalWithdrawalAmount',
  components: { FooterBar, Checker, CheckerItem, Popup, Flexbox, FlexboxItem, Datetime, [PullRefresh.name]: PullRefresh, Calendar
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      isLoading: false,
      show9: false,
      headerTitle: '提现记录',
      selectShow: false,
      billStatus: '',
      flowDealerWithdrawCashParam: {
        pageSize: '',
        pageNum: '',
        dealStatus: '',
        withdrawCashTimeStart: '',
        withdrawCashTimeEnd: '',
        bankPaymentTimeStart: '',
        bankPaymentTimeEnd: ''
      },
      listData: []
    }
  },
  methods: {
    // 右侧筛选框显示
    choose () {
      this.show9 = true
      this.$nextTick(() => {
        setTimeout(() => {
          let modal = document.getElementsByClassName('vux-popup-mask')[0]
          modal.style.zIndex = 498
        }, 400)
      })
      this.selectShow = false
    },
    calendarHide () {
      this.$nextTick(() => {
        setTimeout(() => {
          let modal = document.getElementsByClassName('vux-popup-mask')[0]
          modal.style.zIndex = 498
        }, 400)
      })
    },
    // 下拉刷新
    waybillRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.queryList(this.flowDealerWithdrawCashParam)
        this.isLoading = false
      }, 500)
    },
    reset () {
      this.flowDealerWithdrawCashParam.withdrawCashTimeStart = ''
      this.flowDealerWithdrawCashParam.withdrawCashTimeEnd = ''
      this.flowDealerWithdrawCashParam.bankPaymentTimeStart = ''
      this.flowDealerWithdrawCashParam.bankPaymentTimeEnd = ''
    },
    sure () {
      if (this.flowDealerWithdrawCashParam.withdrawCashTimeStart !== '' && this.flowDealerWithdrawCashParam.withdrawCashTimeEnd === '') { // 只选择了开始时间
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择提现发起结束时间！'
        })
        return false
      } else if (this.flowDealerWithdrawCashParam.withdrawCashTimeStart === '' && this.flowDealerWithdrawCashParam.withdrawCashTimeEnd !== '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择提现发起开始时间！'
        })
        return false
      }
      if (this.flowDealerWithdrawCashParam.bankPaymentTimeStart !== '' && this.flowDealerWithdrawCashParam.bankPaymentTimeEnd === '') { // 只选择了开始时间
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择提现成功结束时间！'
        })
        return false
      } else if (this.flowDealerWithdrawCashParam.bankPaymentTimeStart === '' && this.flowDealerWithdrawCashParam.bankPaymentTimeEnd !== '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择提现成功开始时间！'
        })
        return false
      }

      this.queryList(this.flowDealerWithdrawCashParam)
      this.show9 = false
    },
    routerGo () {
      this.$router.back(-1)
    },
    log () {},
    // 点击显示单选框
    handleSelect () {
      this.selectShow = !this.selectShow
    },
    handleToStatus () {
      setTimeout(() => {
        this.selectShow = false
        this.queryList(this.flowDealerWithdrawCashParam)
      }, 200)
    },
    goToDetail (val) {
      this.$router.push({name: 'CashWithdrawalDetail', query: {transactionId: val}})
    },
    queryList (val) {
      TreasureAjax.QueryDealerAppWithdrawCashList(val).then((response) => {
        if (response.code === 200) {
          this.listData = response.data.list && response.data.list.map((item, index) => {
            if (item.dealStatus === 2) {
              item.dealStatus = '成功'
            }
            if (item.dealStatus === 3) {
              item.dealStatus = '失败'
            }
            if (item.dealStatus === 1) {
              item.dealStatus = '处理中'
            }
            return item
          })
        }
      })
    }
  },
  created () {
    this.queryList(this.flowDealerWithdrawCashParam)
  },
  computed: {
    dealStatus () {
      return this.flowDealerWithdrawCashParam.dealStatus
    }
  },
  watch: {
    dealStatus (newVal, oldVal) {
      switch (newVal) {
        case '':
          this.headerTitle = '提现记录'
          break
        case 1:
          this.headerTitle = '处理中记录'
          break
        case 2:
          this.headerTitle = '成功记录'
          break
        case 3:
          this.headerTitle = '失败记录'
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../../style/base.less';

.moreRecord {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .c-header {
    height: 100px;
    width: 100%;
    display: flex;
    background-color: #fff;
    position: relative;
    .c-h-left {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .c-h-title {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #24282E;
      font-size: 40px;
      .iconfont {
        font-size: 40px;
      }
    }
    .c-h-right {
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      .iconfont {
        font-size: 40px;
      }
    }
  }
  .c-select {
    width: 100%;
    height: 250px;
    background-color: #fff;
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    z-index: 999;
    .checkLine {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  .c-shadow {
    position: fixed;
    top: 150px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;
    height: 100%;
    z-index: 998;
  }
  .vux-x-icon {
    fill: #24282E;
    font-weight: 600;
  }
  .content {
    height:100%;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #FFF;
    margin-top: 20px;
    .c-waybill {
      width: 100%;
      padding: 0 40px;
      height: 100%;
      overflow-y: scroll;
      .c-w-wrap {
        width: 100%;
        height: 100%;
        .c-w-item {
          width: 100%;
          height: 120px;
          line-height: 120px;
          border-bottom: 1px solid #ECECEC;
          padding: 0 30px;
          .left {
            float: left;
            .state {
              font-size: 30px;
              font-weight: 500;
              color: #24282E;
            }
            .date {
              color: #8A9099;
              font-size: 24px;
            }
            div {
              height: 60px;
              line-height: 60px;
            }
            .success{
              color: #24282E;
            }
            .failed{
              color: #F71A1A;
            }
            .deal{
              color: #F57017;
            }
          }
          .right {
            float: right;
            height: 120px;
            span {
              color: #24282E;
              font-size: 32px;
            }
          }
          .arrow {
            float: right;
            .iconfont {
              font-size: 30px;
            }
          }
      }
      }
    }
  }
  .noBill {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
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
// 查询条件选择框样式
.demo1-item {
  background: #FAFAFA;
  // padding: 5px 15px;
  border: 2px solid #eee;
  border-radius: 5px;
}
.demo1-item-selected {
  border: 2px solid #4D7BFE;
  color: #4D7BFE !important;
  border-radius: 10px;
}
//
.vux-checker-item {
  font-size: 32px;
  color: #676767;
  width: 200px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.vux-flexbox-item {
  margin-left: 0 !important;
  padding-left: 8px !important;
}
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
</style>

<style lang="less">
// 右侧弹窗
.vux-popup-dialog.vux-popup-right { // 右侧折叠查询
  width: 80% !important;
  background: #FFF;
  overflow: inherit;
  z-index: 499;
}
.vux-calendar{
  .weui-cell__ft{
    text-align: center;
  }
}
.flex-demo {
  text-align: center;
  font-size: 28px;
}
.vux-datetime-cancel {
  padding-left: 60px;
}
.vux-datetime-confirm {
  padding-right: 60px;
}
  .popupRight {
    .searchBar {
      height: 300px;
      margin-top: 85px;
      h3 {width: 100%; height: 30px; margin-left: 30px; font-size: 30px; font-weight:bold;}
      .searchDate {
        width: 100%;
        height: 100px;
        line-height: 100px;
          span {
            font-size: 28px;
            color: #676767;
            text-decoration: underline;
          }
          .flexRight {
            text-align: right;
            .weui-cell__ft {
              text-align: right;
            }
          }
          .flexLeft {
            text-align: left;
            .weui-cell__ft {
              text-align: left;
            }
          }
          .weui-cell_access .weui-cell__ft:after { // 隐藏时间选择的箭头
            display: none;
          }
        }

    }
      .billStatus {
        height: 300px;
        margin-top: 85px;
        h3 {width: 100%; height: 30px; margin-left: 30px; font-size: 30px; font-weight:bold;}
        .checkLine {
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 60px;
        }
        .vux-checker-box {
          margin-top: 40px;
        }
      }
    .btn_footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 85px;
      span {
        font-size: 30px;
        color: #202023;
        width: 50%;
        float: left;
        height: 85px;
        line-height: 85px;
        text-align: center;
        border: 1px solid #EDEEF1;
      }
      span:last-child {
        color: #FFFFFF;
        background:linear-gradient(90deg,rgba(77,100,252,1),rgba(63,144,255,1));
      }
    }
  }
</style>
