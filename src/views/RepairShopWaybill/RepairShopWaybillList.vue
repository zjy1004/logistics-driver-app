<template>
  <div class="repairShopWaybillList">
    <!-- 头部 -->
    <div class="c-header">
      <!-- <div @click="routerGo()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div> -->
      <div class="c-h-title">运单</div>
      <div class="c-h-right" @click="choose()"><i class="iconfont icon-shaixuan1"></i></div>
    </div>

    <div class="content">
      <!-- 有运单 -->
      <div v-if="waybillListData.length > 0"  class="c-waybill">
        <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh">
          <ul class="c-w-wrap">
            <li class="c-w-item" :key="index" v-for="(item, index) in waybillListData" @click="handleDetail(item.waybillId)">
              <div class="item-top">
                <div class="name">
                  {{item.sendClientName}}
                </div>
                <div class="status">
                  {{item.waybillStatus}}
                </div>
              </div>
              <div class="item-mid">
                <div class="item-mid_div">
                  <span class="time">开单日期：</span>
                  <span class="time">{{item.createTime}}</span>
                </div>
                <div class="item-mid_div money">
                  <div class="loanAmount">
                    <span>货款金额：</span>
                    <span>￥{{item.receivableGoods}}</span>
                  </div>
                  <div class="freightAmount">
                    <span class="title">运费金额：</span>
                    <span>￥{{item.freight}}</span>
                  </div>
                </div>
              </div>
              <div class="item-mid">
                <div class="item-mid_div money">
                  <div class="loanAmount">
                    <span class="station">当前服务站：</span>
                    <span>{{item.stationName}}</span>
                  </div>
                </div>
                <div class="item-mid_div money" v-if="item.driver && item.driverPhone">
                  <div class="freightAmount">
                    <span class="title driver">司机：</span>
                    <span class="value">{{item.driver}}</span>
                  </div>
                  <div class="telDiv">
                    <span  v-if="isIos" @click.stop><a class="tel" :href="'tel://'+ item.driverPhone"></a></span>
                    <span class="tel" v-else @click.stop="clickService(item.driverPhone)"></span>
                  </div>
                </div>

                <div class="item-mid_div" v-if="item.waybillStatus!=='已签收'&&item.waybillStatus!=='已拒签'">
                  <span class="wordColor">预计到达：</span>
                  <span class="wordColor">{{item.expectedArrivedTime?item.expectedArrivedTime:'不可预计'}}</span>
                </div>
              </div>
            </li>
          </ul>
        </van-pull-refresh>
      </div>
      <!-- 无运单 -->
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh" v-if="waybillListData.length === 0" class="noBill">
        <div class="imgWrap">
          <img src="../../image/noInfo.png" alt="">
        </div>
      </van-pull-refresh>
    </div>

      <v-footer-bar
        />

    <!-- 点击后的阴影 Start -->
    <div class="c-shadow" @click="handleSelect()" v-if="selectShow">
    </div>
    <!-- 点击后的阴影 End -->
    <!--右侧弹框-->
    <div v-transfer-dom class="popupRight">
      <popup v-model="showPop" position="right" class="withdraw-deposit-pop">
        <div class="searchBar">
          <div class="billStatus">
            <h3>运单状态</h3>
              <checker type="checkbox" v-model="billStatus" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                <div class="checkLine">
                  <checker-item :value="11">{{ '待装车'}}</checker-item>
                  <checker-item :value="1">{{ '已装车'}}</checker-item>
                </div>
                <div class="checkLine">
                  <checker-item :value="2">{{ '运输中'}}</checker-item>
                  <checker-item :value="3">{{ '已签收'}}</checker-item>
                </div>
                <div class="checkLine lastItem">
                  <checker-item :value="4">{{ '已拒签'}}</checker-item>
                </div>
              </checker>
          </div>
          <h3>开单日期</h3>
          <div class="dateWrap">
            <div class="dateLi">
              <!-- <datetime
                v-model="waybillQueryParam.createTimeStart"
                placeholder="开始时间"
                >
              </datetime> -->
              <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="开始时间" v-model="waybillQueryParam.createTimeStart"></calendar>
            </div>
            <div class="dateLi">
              <!-- <datetime
                v-model="waybillQueryParam.createTimeEnd"
                placeholder="结束时间"
                >
              </datetime> -->
              <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="结束时间" v-model="waybillQueryParam.createTimeEnd"></calendar>
            </div>
          </div>
        </div>
        <div class="btn_footer">
          <span @click="reset">重置</span>
          <span @click="sure">确定</span>
        </div>
      </popup>
    </div>

    <!-- 弹窗 -->
    <van-dialog
      v-model="dialogShow"
      title="司机正在努力配送，您确定要骚扰一下？"
      show-cancel-button
      @confirm="callPhoneNum"
      @cancel="cancelPhone"
    >
    </van-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import FooterBar from '@/components/FooterBar/RepairFooterBar.vue'
import { Popup, TransferDom, Datetime, Checker, CheckerItem, Calendar } from 'vux'
import { PullRefresh, Dialog } from 'vant'
import WaybillAjax from '@/api/WayBill/WayBill'

export default {
  components: { 'v-footer-bar': FooterBar, Popup, TransferDom, Datetime, Checker, CheckerItem, [PullRefresh.name]: PullRefresh, [Dialog.name]: Dialog, Calendar },
  directives: {TransferDom},
  name: 'RepairShopWaybillList',
  data () {
    return {
      telNum: '',
      isIos: true,
      dialogShow: false,
      waybillListData: [],
      billStatus: [],
      isLoading: false,
      selectShow: false,
      showPop: false,
      waybillQueryParam: {
        createTimeEnd: '',
        createTimeStart: '',
        waybillStatusList: []
      }
    }
  },
  watch: {
    billStatus (newVal, oldVal) {
      this.waybillQueryParam.waybillStatusList = newVal
    }
  },
  created () {
    let phoneType = this.getPhoneInfo()
    if (phoneType !== 'iPhone') {
      this.isIos = false
    }
    this.getWaybill(this.waybillQueryParam)
  },
  methods: {
    // 运单详情
    handleDetail (id) {
      this.$router.push({name: 'RepairShopWaybillDetail', query: {id: id}})
    },
    routerGo () {
      this.$router.back(-1)
    },
    // 下拉刷新
    waybillRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.getWaybill()
        this.isLoading = false
      }, 500)
    },
    // 右侧筛选框显示
    choose () {
      this.showPop = true
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
    reset () {
      this.billStatus = []
      this.waybillQueryParam.createTimeEnd = ''
      this.waybillQueryParam.createTimeStart = ''
    },
    sure () {
      if (this.waybillQueryParam.createTimeStart !== '' && this.waybillQueryParam.createTimeEnd === '') { // 只选择了开始时间
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择结束时间！'
        })
        return false
      } else if (this.waybillQueryParam.createTimeStart === '' && this.waybillQueryParam.createTimeEnd !== '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择开始时间！'
        })
        return false
      }
      setTimeout(() => {
        this.showPop = false
        this.getWaybill(this.waybillQueryParam)
      }, 200)
    },
    // 点击显示单选框
    handleSelect () {
      this.selectShow = !this.selectShow
      this.reset()
    },
    toAndroid (val) {
      try {
        window.android.callPhone(this.telNum)
      } catch (error) {
        console.log(error)
      }
    },
    // 电话
    clickService (val) {
      this.dialogShow = true
      this.telNum = val
    },
    callPhoneNum (val) {
      this.toAndroid(val)
    },
    cancelPhone () {},
    // 获取所有运单
    getWaybill () {
      WaybillAjax.QueryClientAllWaybill(this.waybillQueryParam).then(res => {
        if (res.code === 200) {
          this.waybillListData = res.data
          this.waybillListData.map(item => {
            // 运单状态
            switch (item.waybillStatus) {
              case 1:
                item.waybillStatus = '已装车'
                break
              case 2:
                item.waybillStatus = '运输中'
                break
              case 3:
                item.waybillStatus = '已签收'
                break
              case 4:
                item.waybillStatus = '已拒签'
                break
              case 5:
                item.waybillStatus = '已完成'
                break
              case 6:
                item.waybillStatus = '已取消'
                break
              case 9:
                item.waybillStatus = '待入库'
                break
              case 10:
                item.waybillStatus = '待退货'
                break
              case 11:
                item.waybillStatus = '待装车'
                break
              default:
                break
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.repairShopWaybillList {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .c-header {
    height: 90px;
    width: 100%;
    display: flex;
    justify-content: center;
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
      position: absolute;
      right: 10px;
      .iconfont {
        font-size: 40px;
      }
    }
  }
  .c-shadow {
    position: fixed;
    top: 140px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.6;
    height: 100%;
    z-index: 998;
  }
  .content {
    height:100%;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
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
    .c-waybill {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      flex: 1;
      // z-index: 998;
      margin-top: 20px;
      .c-w-wrap {
        width: 100%;
        height: 100%;
        .c-w-item {
          min-height: 321px;
          height: auto;
          width: 95%;
          background: #FFF;
          margin: 0 auto;
          margin-bottom: 20px;
          .item-top {
            width: 90%;
            margin: 0 auto;
            border-bottom: 1px solid #eee;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
              font-size: 30px;
              color: #24282E;
              font-weight: 500;
            }
            .status {
              font-size: 30px;
              color: #F57017;
              font-weight: 400;
            }
          }
          .item-mid {
            width: 90%;
            margin: 0 auto;
            min-height: 120px;
            height: auto;
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #eee;
            .item-mid_div {
              width: 100%;
              min-height: 60px;
              line-height: 60px;
              height: auto;
              span {
                font-size: 28px;
              }
              .wordColor {
                color: #F57017;
              }
            }
            .money {
              display: flex;
              .loanAmount {
                width: 100%;
                min-height: 60px;
                height: auto;
              }
              .freightAmount {
                width: 260px;
                min-height: 60px;
                height: auto;
                line-height: 60px;
                display: flex;
                .title {
                  width: 150px;
                  min-height: 60px;
                  height: auto;
                  line-height: 60px;
                }
                .title.driver{
                  width: 100px;
                }
                .value {
                  min-width: 50px;
                }
              }
              .telDiv {
                display: flex;
                align-items: center;
                span {
                  display: flex;
                }
                .tel {
                  width: 50px;
                  height: 50px;
                  background: url('../../image/tel.png') no-repeat center center;
                  background-size: 100% 100%;
                  display: inline-block;
                  // margin-left: 30px;
                }
              }
            }
          }
        }
      }
    }
    .noBill {
        width: 100%;
        height: 100%;
        background: #FFF;
        overflow: hidden;
      .imgWrap {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        img {
          width: 290px;
          height: 210px;
        }
        .msg {
          margin-top: 35px;
          font-size: 24px;
          width: auto;
          text-align: center;
          color: #D4D6DE;
        }
      }
    }
  }
  .footer {
    height: 120px;
    width: 100%
  }
}
</style>

<style lang="less">
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
  // 查询条件选择框样式
.demo1-item {
  background: #FAFAFA;
  padding: 5px 15px;
}
.demo1-item-selected {
  border: 1px solid #4D7BFE;
  color: #4D7BFE !important;
}
.vux-checker-item {
  font-size: 28px;
  color: #676767;
  width: 220px;
  height: 60px;
  line-height: 45px;
  text-align: center;
}
.dp-container {
  .dp-header {
    border-bottom: 1px solid #F3F3F3;
  }
  .dp-content {
    padding: 60px 0;
  }
    .dp-header .dp-item {
      font-size: 32px;
      height: 70px;
      line-height: 70px;
    }
    .vux-datetime-cancel {
      padding-left: 60px;
    }
    .vux-datetime-confirm {
      padding-right: 60px;
    }
  .scroller-component {
    .scroller-indicator {
      height: 50px !important;
      border-top: 1px solid #E8E8E8;
      border-bottom: 1px solid #E8E8E8;
    }
    .scroller-item {
      font-size: 28px !important;
      height: 50px !important;
      line-height: 50px !important;
    }
  }
}
  .popupRight {
    .searchBar {
      height: 300px;
      margin-top: 85px;
      h3 {
        width: 100%;
        height: 30px;
        margin-left: 30px;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
        margin-top: 30px;
      }
      .waybillInput {
        height: 60px;
        width: 100%;
        margin-left: 30px;
        input{
          width: 80%;
          height: 60px;
          outline: none;
          border: none;
          font-size: 28px;
          margin: 0;
          padding: 0;
          font-size: 28px;
          border-bottom: 1px solid rgba(229,229,229,1);
        }
      }
      .dateWrap {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        margin-top: 40px;
        .dateLi {
          width: 40%;
          height: 100px;
          span {
            font-size: 28px;
            color: #676767;
            text-decoration: underline;
          }
          .weui-cell_access .weui-cell__ft:after { // 隐藏时间选择的箭头
            display: none;
          }
          .vux-datetime {
            height: 80px;
            width: 100%;
            .vux-cell-placeholder {
              font-size: 26px;
            }
          }
        }
      }
      .billStatus {
        height: 350px;
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
