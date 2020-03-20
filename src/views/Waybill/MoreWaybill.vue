<template>
   <div class="moreWaybill">
      <!-- 头部 -->
      <div class="c-header">
        <div @click="routerGo()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
        <div class="c-h-title"  @click="handleSelect()">{{headerTitle}}
          <div>
            <x-icon v-if="!selectShow" type="ios-arrow-down"></x-icon>
            <x-icon v-if="selectShow" type="ios-arrow-up"></x-icon>
          </div>
        </div>
        <div class="c-h-right" @click="choose()"><i class="iconfont icon-shaixuan1"></i></div>
      </div>
       <!-- 单选框盒子 -->
       <transition
        :duration="{ enter: 900, leave: 300 }"
        name="custom-classes-transition"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp">
        <div v-if="selectShow" class="c-select">
          <checker @on-change="handleToStatus" radio-required v-model="billStatus" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <div class="checkLine">
              <checker-item :value="''">{{ '全部运单'}}</checker-item>
            </div>
            <div class="checkLine">
              <checker-item :value="11">{{ '待装车'}}</checker-item>
              <checker-item :value="1">{{ '已装车'}}</checker-item>
              <checker-item :value="2">{{ '运输中'}}</checker-item>
            </div>
            <div class="checkLine">
              <checker-item :value="3">{{ '已签收'}}</checker-item>
              <checker-item :value="4">{{ '已拒签'}}</checker-item>
              <checker-item :value="6">{{ '已取消'}}</checker-item>
            </div>
          </checker>
        </div>
      </transition>
     <div class="content">
       <!-- 有运单 -->
       <div v-if="waybillListData.length > 0"  class="c-waybill">
        <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh">
          <ul class="c-w-wrap">
            <li @click="handleDetail(item.waybillId)" class="c-w-item" :key="index" v-for="(item, index) in waybillListData" >
              <div class="item-top">
                <div class="name">
                  {{item.receiveClientName}}
                </div>
                <div class="status">
                  {{item.waybillStatus}}
                </div>
              </div>
              <div class="item-bottom">
                <div>
                  <span class="time">开单日期:</span>
                  <span class="time">{{item.createTime}}</span>
                </div>
                <div>
                  <span class="time">代收金额:</span>
                  <span class="money">￥{{item.receivableGoods}}</span>
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
     <!-- 点击后的阴影 Start -->
      <div class="c-shadow" @click="handleSelect()" v-if="selectShow">
      </div>
      <!-- 点击后的阴影 End -->
      <!--右侧弹框-->
    <div v-transfer-dom class="popupRight">
      <popup v-model="showPop" position="right" class="withdraw-deposit-pop">
        <div class="searchBar">
          <h3>开单日期</h3>
          <div class="dateWrap">
            <div class="dateLi">
              <!-- <datetime
                v-model="waybillQueryParam.createTimeStart"
                placeholder="开始时间"
                @on-change="changeDate"
                @on-cancel="log('cancel')"
                @on-confirm="onConfirm"
                @on-hide="log('hide', $event)">
              </datetime> -->
              <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="开始时间" v-model="waybillQueryParam.createTimeStart"></calendar>
            </div>
            <div class="dateLi">
              <!-- <datetime
                v-model="waybillQueryParam.createTimeEnd"
                placeholder="结束时间"
                @on-change="changeDate"
                @on-cancel="log('cancel')"
                @on-confirm="onConfirm"
                @on-hide="log('hide', $event)">
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
   </div>
</template>

<script type="text/ecmascript-6">
import WaybillAjax from '@/api/WayBill/WayBill'
import { Checker, CheckerItem, Popup, Flexbox, FlexboxItem, TransferDom, Datetime, XInput, Calendar } from 'vux'
import { PullRefresh } from 'vant'
export default {
  name: 'Treasure',
  components: {
    Checker,
    CheckerItem,
    [PullRefresh.name]: PullRefresh,
    Popup,
    Flexbox,
    FlexboxItem,
    TransferDom,
    Datetime,
    XInput,
    Calendar
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      headerTitle: '全部运单',
      showPop: false,
      isLoading: false,
      selectShow: false,
      billStatus: '',
      waybillQueryParam: {
        createTimeEnd: '',
        createTimeStart: '',
        waybillStatus: ''
      },
      waybillListData: [
      ]
    }
  },
  methods: {
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
    // 修改时间
    changeDate () {
    },
    onConfirm () {},
    log () {},
    // 重置筛选
    reset () {
      this.waybillQueryParam.createTimeEnd = ''
      this.waybillQueryParam.createTimeStart = ''
    },
    // 确定筛选
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
    // 运单详情
    handleDetail (id) {
      this.$router.push({name: 'WaybillDetail', query: {id: id}})
    },
    // 点击显示单选框
    handleSelect () {
      this.selectShow = !this.selectShow
      this.reset()
    },
    // 运单状态下的运单
    handleToStatus () {
      setTimeout(() => {
        this.selectShow = false
        this.getWaybill(this.waybillQueryParam)
      }, 200)
    },
    // 获取所有运单
    getWaybill () {
      WaybillAjax.AllWaybill(this.waybillQueryParam).then(res => {
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
  },
  created () {
    this.getWaybill()
  },
  watch: {
    billStatus (newVal, oldVal) {
      this.waybillQueryParam.waybillStatus = newVal
      switch (newVal) {
        case '':
          this.headerTitle = '全部运单'
          break
        case 1:
          this.headerTitle = '已装车运单'
          break
        case 2:
          this.headerTitle = '运输中运单'
          break
        case 3:
          this.headerTitle = '已签收运单'
          break
        case 4:
          this.headerTitle = '已拒签运单'
          break
        case 6:
          this.headerTitle = '已取消运单'
          break
        case 11:
          this.headerTitle = '待装车运单'
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
.vux-popup-dialog.vux-popup-right { // 右侧折叠查询
  width: 80% !important;
  background: #FFF;
  overflow: inherit;
  z-index: 499;
}
.moreWaybill {
  height: 100%;
  width: 100%;
  display: flex;
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
      .iconfont {
        font-size: 40px;
      }
    }
  }
  .c-select {
    width: 100%;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 140px;
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
    top: 140px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.6;
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
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
     /deep/ .van-pull-refresh__track {
        height: 100%;
        // width: 100%;
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
          height: 200px;
          width: 100%;
          margin-bottom: 20px;
          .item-top {
            height: 80px;
            display: flex;
            align-items: center;
            padding: 0 40px;
            justify-content: space-between;
            background:#F7F9FC;
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
          .item-bottom {
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            justify-content: space-around;
            background:#FFFFFF;
            padding: 0 40px;
            .time {
              color: #565C66;
              font-size: 26px;
              font-weight: 400;
            }
            .money {
              color: #3573EE;
              font-size: 26px;
              font-weight: 500;
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
          height: 220px;
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
}
// 查询条件选择框样式
.demo1-item {
}
.demo1-item-selected {
  border: 2px solid rgba(53,115,238,1);
  color: #3573EE !important;
  border-radius: 32px;
}
//
.vux-checker-item {
  font-size: 24px;
  color: #1E2228;
  width: 210px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background:rgba(242,243,245,1);
}
</style>

<style lang="less">
.vux-calendar{
  .weui-cell__ft{
    text-align: center;
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
</style>
