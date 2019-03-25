<template>
  <div class="waybillList">
    <x-header
      title="我的运单"
      :left-options="{backText: ''}"
      :right-options="{showMore: true}"
      @on-click-more="refreshList"
    />
      <div class="search-con">
        <search
          v-model="searchValue"
          placeholder="请输入修理厂名称"
          :auto-fixed=false
          :auto-scroll-to-top=true
          @on-submit="searchBtn"
          @on-cancel="onCancel"
          @on-clear="onClear"
          ref="search"
        />
        <div class="btn-icon"><i class="icon-image" @click="show9 = true"></i></div>
      </div>

      <div class="count" v-if="!isAllEmpty">
        <div class="layout">
          <div>运单数量</div>
          <div class="num">{{waybillNum||0}}</div>
        </div>
        <div class="layout">
          <div>运费统计（元）</div>
          <div class="num">￥{{freightNUm||0}}</div>
        </div>
        <div class="layout">
          <div>代收货款（元）</div>
          <div class="num">￥{{GoodsNum||0}}</div>
        </div>
      </div>
      <div class="index-list-container" v-if="true">
        <div class="lists" v-if="!isSearch" style="height: 100%;overflow-y: auto;">
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRecRefresh"> -->
            <mt-index-list :show-indicator="true">
              <mt-index-section :index="item.letter" :key="index1" v-for="(item,index1) in listData" v-show="item.childrenWaybill.length>0">
                <div :key="index2" v-for="(miditem,index2) in item.childrenWaybill" style="padding-top: 20px;">
                  <cell
                    :title="`${miditem.receiveClientName}  （共${miditem.childrenWaybill.length}单）`"
                    is-link
                    :border-intent="true"
                    :arrow-direction="miditem.isUp ? 'up' : 'down'"
                    @click.native="showContent(index1,index2)"
                  />
                  <div class="foldingList" v-if="miditem.isUp">
                    <div class="cellList" :key="index" v-for="(innerItem,index) in miditem.childrenWaybill">
                      <flexbox>
                        <flexbox-item :span="1/4"><div class="flex-demo">{{innerItem.billDate}}-{{innerItem.articleNumberSub}}</div></flexbox-item>
                        <flexbox-item :span="1/2"><div class="flex-demo"><span class="money">￥{{innerItem.total}}</span> ({{innerItem.receivableFreight}}<span class="status" v-if="innerItem.settlementMethod === 2">(月结)</span>+{{innerItem.receivableGoods}})</div></flexbox-item>
                        <flexbox-item :span="1/4"><div class="flex-demo"><span class="status" :class="{'money': innerItem.waybillStatus === '1'}">{{innerItem.waybillStatus}}</span></div></flexbox-item>
                      </flexbox>
                    </div>
                  </div>
                </div>
              </mt-index-section>
            </mt-index-list>
          <!-- </van-pull-refresh> -->
        </div>
        <div v-if="isSearch" class="lists" style="height: 100%;overflow-y: auto;">
          <div :key="index1" v-for="(item,index1) in listData">
            <div :key="index2" v-for="(miditem,index2) in item.childrenWaybill" style="padding-top: 20px;">
              <cell
                :title="`${miditem.receiveClientName}  （共${miditem.childrenWaybill.length}单）`"
                is-link
                :border-intent="true"
                :arrow-direction="miditem.isUp ? 'up' : 'down'"
                @click.native="showContent(index1,index2)"
              />
              <div class="foldingList" v-if="miditem.isUp">
                <div class="cellList" :key="index" v-for="(innerItem,index) in miditem.childrenWaybill">
                  <flexbox>
                    <flexbox-item :span="1/4"><div class="flex-demo">{{innerItem.billDate}}-{{innerItem.articleNumberSub}}</div></flexbox-item>
                    <flexbox-item :span="1/2"><div class="flex-demo"><span class="money">￥{{innerItem.total}}</span> ({{innerItem.receivableFreight}}+{{innerItem.receivableGoods}})</div></flexbox-item>
                    <flexbox-item :span="1/4"><div class="flex-demo"><span class="status" :class="{'money': innerItem.waybillStatus === '1'}">{{innerItem.waybillStatus}}</span></div></flexbox-item>
                  </flexbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <!-- 无运单 Start -->
      <van-pull-refresh v-model="noBillIsLoading" @refresh="noBillOnRefresh" class="noBill" v-if="isAllEmpty">
        <div class="noBill">
          <div class="imgWrap">
          <img src="../../image//no-waybill.jpg" alt="">
          </div>
          <div class="msg">当前没有运单，辛苦啦！</div>
        </div>
      </van-pull-refresh>
    <!-- 无运单 End -->
    <!--右侧弹框-->
    <div v-transfer-dom class="popupRight">
      <popup v-model="show9" position="right">
        <div class="searchBar">
          <h3>开单日期</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <datetime
                  v-model="waybillAppQueryParam.createTimeStart"
                  @on-change="changeDate"
                  @on-cancel="log('cancel')"
                  @on-confirm="onConfirm"
                  @on-hide="log('hide', $event)"></datetime>
                </div>
              </flexbox-item>

              <flexbox-item>
                <div class="flex-demo flexLeft">
                  <datetime
                  v-model="waybillAppQueryParam.createTimeEnd"
                  @on-change="changeDate"
                  @on-cancel="log('cancel')"
                  @on-confirm="onConfirm"
                  @on-hide="log('hide', $event)"></datetime>
                </div>
                </flexbox-item>
            </flexbox>

            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                <checker v-model="period" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                  <checker-item value="1">{{ '三日内'}}</checker-item>
                </checker>
                </div>
              </flexbox-item>
                &nbsp;&nbsp;
              <flexbox-item>
                <div class="flex-demo flexLeft">
                <checker v-model="period" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                  <checker-item value="2">{{ '本周内' }}</checker-item>
                </checker>
                </div>
                </flexbox-item>
            </flexbox>

          </div>
        </div>
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
              <div class="checkLine">
                <checker-item :value="4">{{ '已拒签'}}</checker-item>
                <!-- <div style="height: 30px;width: 110px;"></div> -->
                <checker-item :value="6">{{ '已取消'}}</checker-item>
              </div>
            </checker>
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

<script>
import { Cell, XHeader, Search, Flexbox, FlexboxItem, Popup, TransferDom, Datetime, Checker, CheckerItem } from 'vux'
import WaybillListAjax from '@/api/WaybillList/WaybillList'
import { mapGetters } from 'vuex'
import { getDay } from '@/tools/tools'
import { PullRefresh } from 'vant'
import { IndexList, IndexSection } from 'mint-ui'

export default {
  name: 'WaybillList',
  data () {
    return {
      isLoading: false,
      noBillIsLoading: false,
      period: '',
      billStatus: [],
      showBack: false,
      show9: false,
      searchValue: '',
      isSearch: false,
      listData: [],
      sourceListData: [],
      waybillAppQueryParam: {
        createTimeStart: '',
        createTimeEnd: '',
        waybillStatusList: []
      },
      waybillNum: '',
      freightNUm: '',
      GoodsNum: ''
    }
  },
  computed: {
    ...mapGetters(['formatDate']),
    isAllEmpty () {
      return this.listData.every(item => {
        return item.childrenWaybill.length === 0
      })
    }
  },
  watch: {
    period (newVal, oldVal) {
      if (newVal === '1') { // 最近三天
        console.log(getDay(0))
        console.log(getDay(-3))
        this.waybillAppQueryParam.createTimeStart = getDay(-3)
        this.waybillAppQueryParam.createTimeEnd = getDay(0)
      } else if (newVal === '2') { // 最近七天
        console.log(getDay(0))
        console.log(getDay(-7))
        this.waybillAppQueryParam.createTimeStart = getDay(-7)
        this.waybillAppQueryParam.createTimeEnd = getDay(0)
      } else {
        this.waybillAppQueryParam.createTimeStart = getDay(0)
        this.waybillAppQueryParam.createTimeEnd = getDay(0)
      }
    },
    billStatus (newVal, oldVal) {
      this.waybillAppQueryParam.waybillStatusList = newVal
    }

  },
  created () {
    this.QueryAppAllWaybillList(this.waybillAppQueryParam)
    this.waybillAppQueryParam.createTimeStart = this.formatDate(new Date())
    this.waybillAppQueryParam.createTimeEnd = this.formatDate(new Date())
  },
  methods: {
    refreshList () {
      this.$vux.toast.show({
        type: 'success',
        text: '刷新成功！'
      })
      this.isLoading = false
      this.QueryAppAllWaybillList(this.waybillAppQueryParam)
    },
    onConfirm () {},
    searchBtn () {
      this.$refs.search.setBlur()
      this.listData = this.sourceListData.map(item => {
        item.childrenWaybill = item.childrenWaybill.filter(innerItem => {
          console.log(innerItem.receiveClientName)
          return innerItem.receiveClientName.includes(this.searchValue)
        })
        return item
      })
    },
    onCancel () {
      this.isSearch = false
      this.listData = []
      this.QueryAppAllWaybillList(this.waybillAppQueryParam)
    },
    onClear () {
      this.isSearch = false
      this.listData = []
      this.QueryAppAllWaybillList(this.waybillAppQueryParam)
    },
    changeDate (val) {},
    log () {},
    reset () {
      this.billStatus = []
      this.period = ''
      this.waybillAppQueryParam.createTimeStart = getDay(0)
      this.waybillAppQueryParam.createTimeEnd = getDay(0)
    },
    sure () {
      console.log(this.waybillAppQueryParam)
      this.QueryAppAllWaybillList(this.waybillAppQueryParam)
    },
    QueryAppAllWaybillList (val) { // 手机端运单管理数据全部运单查询
      WaybillListAjax.QueryDriverAllWaybill(val).then(res => {
        if (res.code === 200) {
          this.show9 = false
          this.sourceListData = res.data
          this.listData = res.data.map(item => {
            item.childrenWaybill && item.childrenWaybill.map(midItem => {
              midItem.isUp = false
              midItem.childrenWaybill && midItem.childrenWaybill.map(innerItem => {
                innerItem.billDate = (innerItem.createTime).slice(5, 7) + (innerItem.createTime).slice(8, 10)
                innerItem.total = (innerItem.receivableFreight + innerItem.receivableGoods).toFixed(1)
                if (innerItem.waybillStatus === 1) {
                  innerItem.waybillStatus = '已装车'
                }
                if (innerItem.waybillStatus === 2) {
                  innerItem.waybillStatus = '运输中'
                }
                if (innerItem.waybillStatus === 3) {
                  innerItem.waybillStatus = '已签收'
                }
                if (innerItem.waybillStatus === 4) {
                  innerItem.waybillStatus = '已拒签'
                }
                if (innerItem.waybillStatus === 5) {
                  innerItem.waybillStatus = '已完成'
                }
                if (innerItem.waybillStatus === 6) {
                  innerItem.waybillStatus = '已取消'
                }
                if (innerItem.waybillStatus === 9) {
                  innerItem.waybillStatus = '待入库'
                }
                if (innerItem.waybillStatus === 10) {
                  innerItem.waybillStatus = '待退货'
                }
                if (innerItem.waybillStatus === 11) {
                  innerItem.waybillStatus = '待装车'
                }
                return innerItem
              })
              return midItem
            })
            return item
          })
          let sum1 = 0
          let sum2 = 0
          let sum = 0
          res.data.forEach(element => {
            element.childrenWaybill.forEach(innerEle => {
              innerEle.childrenWaybill.forEach(lastEle => {
                sum1 += lastEle.receivableFreight
                sum2 += lastEle.receivableGoods
                return sum1 && sum2
              })
              sum += innerEle.childrenWaybill.length
              return sum
            })
            this.waybillNum = sum
            this.freightNUm = sum1.toFixed(2)
            this.GoodsNum = sum2.toFixed(2)
          })
        }
      })
    },
    showContent (clickIndex1, clickIndex2) {
      this.listData = this.listData.map((item, index1) => {
        item.childrenWaybill.map((innerItem, index2) => {
          if (clickIndex1 === index1) {
            if (clickIndex2 === index2) {
              innerItem.isUp = !innerItem.isUp
            } else {
              innerItem.isUp = false
            }
          } else {
            innerItem.isUp = false
          }
          return innerItem
        })
        return item
      })
    },
    onRecRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.isLoading = false
        this.QueryAppAllWaybillList(this.waybillAppQueryParam)
      }, 500)
    },
    noBillOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noBillIsLoading = false
        this.QueryAppAllWaybillList(this.waybillAppQueryParam)
      }, 500)
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Search,
    Flexbox,
    FlexboxItem,
    Popup,
    Datetime,
    Checker,
    CheckerItem,
    [PullRefresh.name]: PullRefresh,
    [IndexList.name]: IndexList,
    [IndexSection.name]: IndexSection,
    [Cell.name]: Cell
  }
}
</script>

<style lang="less">
@import '../../style/base.less';
.waybillList {
  .vux-header {
    .vux-header-left {
      top: 28px;
    }
    .vux-header-title{
      height: 64px;
      line-height: 64px;
      span {
        font-size: 36px;
        color: #1A1A1A;
        font-weight:500;
    }
  }
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
  .vux-search-box{
    height: 70px;
  }
  .weui-search-bar{
    width: 100%;
    height: 70px;
    .weui-search-bar__label{
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
    .weui-search-bar__box{
      display: flex;
      align-items: center;
      .weui-icon-clear, .weui-icon-search{
        top: 15px;
        font-size: 26px;
      }
      input{
        text-indent: 26px;
        font-size: 26px;
        color: #323232;
      }
    }
  }
  .weui-search-bar.weui-search-bar_focusing .weui-search-bar__cancel-btn{
    display: flex;
    align-items: center;
    text-decoration: none;
    color: @color-extrude;
    font-size: 26px;
  }
  .lists {
    width: 100%;
    .weui-cell{
      background: #F6F8FF;
      font-size: 28px !important;
      color: #4D7BFE;
      height: 88px;
      line-height: 88px;
      .vux-label {
        font-size: 28px !important;
        margin-left: 25px;
      }
    }
    .weui-form-preview__item {
      height: 88px;
      line-height: 88px;
    }
    .flex-demo {
      text-align: center;
      font-size: 28px;
    }
    .money {
      color: #FF5400;
      font-size: 28px;

    }
    .status {
      font-size: 28px;
    }
  }
}
.vux-popup-dialog.vux-popup-right { // 右侧折叠查询
  width: 80% !important;
  background: #FFF;
  overflow: inherit;
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
//
.vux-checker-item {
  font-size: 28px;
  color: #676767;
  width: 220px;
  height: 60px;
  line-height: 50px;
  text-align: center;
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
.vux-header .vux-header-left .left-arrow:before {
  width: 20px !important;
  height: 20px !important;
  border: 1px solid #1C1C1C !important;
  border-width: 1px 0 0 1px !important;
}
.van-pull-refresh {
  height: 100%;
  overflow-y: auto;
}
.van-pull-refresh__track {
  height: 100%;
}
.van-pull-refresh__text {
  font-size: 28px
}
.van-pull-refresh__loading {
  span {
    font-size: 28px
  }
}

</style>

<style lang="less" scoped>
@import '../../style/base.less';
.waybillList {
  width: 100%;
  height: 100%;
  background: #f3f4f5;
  display: flex;
  flex-direction: column;
  flex: 1;
  .search-con{
    padding-top: 21px;
    width: 100%;
    height: 90px;
    display: flex;
    .vux-search-box {
      display: flex;
      flex: 1;
      margin-left: 20px;
      margin-right: 20px;
    }
    .btn-icon{
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        .mixin-sc(50px;#333);
      }
    }
    .icon-image {
      width: 40px;
      height: 37px;
      background: url(../../image/shaixuan.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .lists {
    //margin: 10px;
    .foldingList {
      width: 100%;
      .cellList {
        width: 100%;
        height: 88px;
        line-height: 88px;
        background: #fff;
        padding-left: 18px;
        border-bottom: 1px solid #EFEFEF;
      }
    }
  }

  .count {
    margin-top: 20px;
    display: flex;
    width: 100%;
    height: 150px;
    background: #F6F8FF;
    .layout {
      display: flex;
      flex-direction: column;
      flex: 1;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
      }
      .num {
        color: #FF5400;
        font-size: 28px;
      }
    }
  }

}
</style>
