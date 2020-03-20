<template>
  <div class="withdraw-deposit">
    <x-header @on-click-back="goback" :title=title :left-options="{backText: '', preventGoBack: true}">
      <div @click="choose" class="choose-btn" slot="right"></div>
    </x-header>
    <div class="main-con">
      <!-- 提现 start-->
      <div class="receiveMon">
        <div class="receiveMon" v-show="recSourceList.length === 0 ? false : true">
          <div class="top-tip" v-if="showTip">
            <div class="text">
              根据银行相关规定：对公账户内余额，从资金到账日起开始结算，最快<span class="red">T+1个工作日</span>可提现。
            </div>
            <div class="close-con" @click="closeTip">X</div>
          </div>
          <!-- <div class="search-con">
            <search
              v-model="recSearchValue"
              position="absolute"
              placeholder="请输入修理厂名称"
              :auto-fixed="false"
              @on-submit="recOnSubmit"
              @on-cancel="recOnCancel"
              @on-clear="recOnClear"
              :auto-scroll-to-top=true
              ref="recSearch"
            ></search>
          </div> -->
          <!-- 提现-MainContent Start -->
          <div class="main-list-con" v-if="!recIsSearch">
            <van-pull-refresh v-model="recIsLoading" @refresh="recOnRefresh">
              <div class="list-item-con" :key="index" v-for="(item, index) in receiveListData">
                <div class="receiveItem">
                  <check-icon
                    @click.native="receiveCheckChange(item, item.check)"
                    :value.sync="item.check"
                  ></check-icon>
                  <div class="click-con">
                    <span class="receiveName">{{item.createTime}}</span>
                  </div>
                </div>
                <ul>
                  <li :key="index" v-for="(boxItem, index) in item.clientAccountList">
                    <check-icon
                      @click.native="receiveCheckMoney(boxItem, boxItem.check)"
                      :value.sync="boxItem.check"
                    ></check-icon>
                    <div class="right">
                      <div class="right-receive-name" :class="{'active': Number(boxItem.walletFlag) === 1}">
                        <span>{{boxItem.receiveClientName}}</span>
                      </div>
                      <div class="right-waybill-num" :class="{'active': Number(boxItem.walletFlag) === 1}">
                        <span class="waybillNum">{{boxItem.waybillNumber}}</span>
                      </div>
                      <div class="right-money">
                        <span class="collection">实际到账 ￥{{boxItem.actualPaymentGoods}}</span>
                        <span class="actualAccount">代收货款 ￥{{boxItem.receivableGoods}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </van-pull-refresh>
          </div>

          <!-- 提现-MainContent End -->

          <!-- 提现-搜索结果-start -->
          <div v-if="recIsSearch" class="main-list-con">
            <div class="noBill">
              <div class="imgWrap">
              <img src="../../../image/noInfo.png" alt="">
              </div>
            </div>
          </div>
          <!-- 提现-搜索结果-end -->

          <!-- 提现-Total Start -->
          <!-- <div class="total-con" v-show="!receiveDetail">
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
          </div> -->
          <!-- 提现-Total End -->

          <!-- 提现-Bottom Start -->
          <div class="bottom-container">
            <div class="bottom-total-con">
              <div class="bg-con" @click="clickCart" :class="{'disabled': receiveSelectedList.length === 0}">
                <div class="doc-con">
                  <div class="circle-total" :class="{'disabled': receiveSelectedList.length === 0}">
                    <span>{{receiveSelectedList.length}}</span>
                  </div>
                </div>
              </div>
              <div class="total-mon">总计：￥<span>{{receiveFreightMoney}}</span></div>
            </div>
            <button @click="sureWithdraw" :class="receiveSelectedList.length > 0 ? bottomA : bottomB" type="button" :disabled="receiveSelectedList.length === 0">确认提现</button>
          </div>
          <!-- 提现-Bottom End -->
        </div>
        <!-- 提现-无运单 Start -->
        <van-pull-refresh v-model="noBillRecisLoading" @refresh="noBillRecOnRefresh" class="noBill" v-show="recSourceList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
            <img src="../../../image/noInfo.png" alt="">
            </div>
          </div>
        </van-pull-refresh>
        <!-- 提现-无运单 End -->
      </div>
      <!-- 提现 end -->
    </div>
    <!--右侧弹框-->
    <div v-transfer-dom class="popupRight">
      <popup v-model="showPop" position="right" class="withdraw-deposit-pop">
        <div class="searchBar">
          <h3>开单日期</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <!-- <datetime
                    placeholder='开始时间'
                    v-model="queryParam.createTimeStart"
                    @on-cancel="log('cancel')"
                    @on-hide="log('hide', $event)">
                  </datetime> -->
                  <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="开始时间" v-model="queryParam.createTimeStart"></calendar>
                </div>
              </flexbox-item>

              <flexbox-item>
                <div class="flex-demo flexLeft">
                  <!-- <datetime
                    placeholder='结束时间'
                    v-model="queryParam.createTimeEnd"
                    @on-cancel="log('cancel')"
                    @on-hide="log('hide', $event)">
                  </datetime> -->
                  <calendar title="" @on-hide="calendarHide" show-popup-header :popup-header-title="'请选择'" class="calendar-con" placeholder="结束时间" v-model="queryParam.createTimeEnd"></calendar>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
          <h3>运单号或修理厂名称</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <x-input class="waybillInput" v-model="queryParam.waybillOrReceiveClientName" placeholder="请输入运单号或修理厂名称"></x-input>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
          <!-- <h3>修理厂名称</h3>
          <div class="searchDate">
            <flexbox>
              <flexbox-item>
                <div class="flex-demo flexRight">
                  <x-input v-model="queryParam.receiveName"></x-input>
                </div>
              </flexbox-item>
            </flexbox>
          </div> -->
        </div>
        <!-- btn -->
        <div class="btn_footer">
          <span @click="reset">重置</span>
          <span @click="sure">确定</span>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showSignFor"
        :confirm-text="'立即绑卡'"
        :cancel-text="'暂不绑卡'"
        @on-cancel="showSignFor = false"
        @on-confirm="onConfirmSignFor">
        <p style="text-align:center;">银行卡信息不完整，请完善银行卡信息</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showSureWithdraw"
        class="withdraw-deposit-cofirm"
        :confirm-text="'确认提现'"
        :cancel-text="'暂不提现'"
        @on-cancel="showSureWithdraw = false"
        @on-confirm="onConfirmWithdraw">
        <p style="text-align:center;">将提现 ¥{{receiveFreightMoney}} 到您{{bankName}}（{{fomatBankNum(bankCard)}}）卡中</p>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { XHeader, XButton, Popup, Flexbox, FlexboxItem, Search, CheckIcon, TransferDom, Datetime, XInput, Confirm, Calendar } from 'vux'
// import { getDay } from '@/tools/tools'
import { PullRefresh } from 'vant'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import CommonAxios from '@/api/Common/CommonAxios'
import WithdrawDepositAjax from '@/api/WithdrawDeposit/WithdrawDeposit'
import { setTimeout } from 'timers'
export default {
  name: 'WithdrawDeposit',
  data () {
    return {
      showTip: true,
      totalAmount: '', // 可提现余额
      title: '可提现余额:',
      recSearchValue: '', // 提现-搜索值
      // recSourceList: [],
      recIsSearch: false, // 提现-判断搜索显示
      bottomA: 'bottom-con', // 无运单-底部样式
      bottomB: 'bottom-con2', // // 有运单-底部样式
      recIsLoading: false, // 提现-判断下拉刷新
      noBillRecisLoading: false, // 提现-无运单-判断下拉刷新
      receiveDetail: false, // 判断-待交款-明细
      // receiveListData: [], // 提现-集合
      receiveAll: false, // 提现-判断全选
      showPop: false, // 筛选条件显示隐藏
      queryParam: {
        createTimeStart: '',
        createTimeEnd: '',
        waybillOrReceiveClientName: '' // 运单号或修理厂名称
      }, // 获取-提现-运单需要的参数
      showSignFor: false,
      showSureWithdraw: false,
      bankName: '', // 银行卡名称
      bankCard: '' // 银行卡号
    }
  },
  components: {
    XHeader,
    Popup,
    XButton,
    Search,
    Flexbox,
    FlexboxItem,
    CheckIcon,
    Datetime,
    XInput,
    Confirm,
    [PullRefresh.name]: PullRefresh,
    Calendar
  },
  directives: {
    TransferDom
  },
  computed: {
    ...mapState({
      recSourceList: state => state.withdrawData,
      receiveListData: state => state.withdrawData
    }),
    ...mapGetters([
      'receiveSelectedList'
    ]),
    // 总实际到账
    receiveFreightMoney () {
      return (this.receiveSelectedList.reduce((pre, next, index, array) => {
        return pre + Number(next.actualPaymentGoods)
      }, 0)).toFixed(2)
    },
    // 选中运单id集合
    waybillIds () {
      return this.receiveSelectedList.map(item => {
        return item.waybillId
      })
    }
  },
  created () {
    // this.queryParam.createTimeStart = getDay(0)
    // this.queryParam.createTimeEnd = getDay(0)
    this.queryWithdrawDepositData(this.queryParam)
    this.queryWithdrawInfo()
  },
  methods: {
    ...mapMutations([
      'clickDateGroup', // 点击日期分组更新数据选中状态
      'clickWaybillItem' // 点击行单选
    ]),
    ...mapActions([
      'queryWithdrawDepositData' // 查询提现列表数据
    ]),
    goback () {
      this.$router.push({name: 'Treasure', query: {from: 'treasure'}})
    },
    // 查询虚拟账户信息
    queryWithdrawInfo () {
      CommonAxios.WalletBankAccount().then(response => {
        if (response.code === 200) {
          let {data} = response
          this.totalAmount = data.financeAccountCash || 0
          this.title = `可提现余额:￥${this.totalAmount}`
        }
      })
    },
    // 点击立即绑卡
    onConfirmSignFor () {

    },
    // 点击确认提现
    onConfirmWithdraw () {
      WithdrawDepositAjax.withdrawMoney({amount: this.receiveFreightMoney, waybillIds: this.waybillIds}).then(response => {
        if (response.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '提现成功!'
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.message
          })
        }
        this.showSureWithdraw = false
        this.queryWithdrawDepositData(this.queryParam)
        this.queryWithdrawInfo()
      })
    },
    closeTip () {
      this.showTip = false
    },
    choose () {
      this.showPop = true
      this.$nextTick(() => {
        setTimeout(() => {
          let modal = document.getElementsByClassName('vux-popup-mask')[0]
          modal.style.zIndex = 498
        }, 400)
      })
    },
    calendarHide () {
      this.$nextTick(() => {
        setTimeout(() => {
          let modal = document.getElementsByClassName('vux-popup-mask')[0]
          modal.style.zIndex = 498
        }, 400)
      })
    },
    // 重置筛选
    reset () {
      this.queryParam.createTimeStart = ''
      this.queryParam.createTimeEnd = ''
      this.queryParam.waybillOrReceiveClientName = ''
    },
    // 确定筛选
    sure () {
      if (this.queryParam.createTimeStart !== '' && this.queryParam.createTimeEnd === '') { // 只选择了开始时间
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择结束时间！'
        })
        return false
      } else if (this.queryParam.createTimeStart === '' && this.queryParam.createTimeEnd !== '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择开始时间！'
        })
        return false
      }
      this.showPop = false
      this.queryWithdrawDepositData(this.queryParam)
    },
    log () {},
    // 点击购物车
    clickCart () {
      if (this.receiveSelectedList.length > 0) {
        this.$router.push({name: 'CartTotal'})
      }
    },
    // 确认提现
    sureWithdraw () {
      this.queryBankInfo()
    },
    // 查询银行卡信息
    queryBankInfo () {
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          let {data} = response
          if (!data) { // 无银行卡
            this.showSignFor = true
          } else {
            this.bankName = data.bankName
            this.bankCard = data.bankCard
            this.showSureWithdraw = true
          }
        }
      })
    },
    // 提现-搜索
    // recOnSubmit () {
    //   this.$refs.recSearch.setBlur()
    //   let searchResult = []
    //   this.recSourceList.map(item => {
    //     if (item.receiveClientName.includes(this.recSearchValue)) {
    //       searchResult.push(item)
    //     }
    //   })
    //   this.receiveListData = searchResult
    //   if (searchResult.length === 0) {
    //     this.recIsSearch = true
    //   } else {
    //     this.recIsSearch = false
    //   }
    // },
    // recOnCancel () {
    //   this.recIsSearch = false
    //   this.receiveAll = false
    //   this.receiveListData = this.recSourceList
    // },
    // recOnClear () {
    //   this.recIsSearch = false
    //   this.receiveAll = false
    //   this.receiveListData = this.recSourceList
    // },
    // 提现-下拉刷新
    recOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.recIsLoading = false
        this.receiveAll = false
        this.queryWithdrawDepositData(this.queryParam)
      }, 500)
    },
    // 提现-无运单-下拉刷新
    noBillRecOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noBillRecisLoading = false
        this.queryWithdrawDepositData(this.queryParam)
      }, 500)
    },
    // 选择一个日期
    receiveCheckChange (item, check) {
      this.clickDateGroup({groupItem: item, check})
    },
    // 单选运单-提现
    receiveCheckMoney (boxItem, check) {
      this.clickWaybillItem({boxItem, check})
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../style/base.less";
.withdraw-deposit {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .main-con {
    display: flex;
    flex: 1;
    background: #f3f4f5;
    overflow: auto;
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
      height: 100%;
      flex-direction: column;
      overflow: hidden;
      .top-tip{
        width: 100%;
        height: 100px;
        padding: 4px 76px 4px 46px;
        display: flex;
        align-items: center;
        position: relative;
        background: rgba(247,240,218,1);
        .text{
          line-height: 40px;
          flex: 1;
          .mixin-sc(24px;#F57017);
          .red{
            .mixin-sc(24px;#F57017);
          }
        }
        .close-con{
          position: absolute;
          right: 20px;
          top: 10px;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          margin-left: 10px;
          font-weight: bold;
          .mixin-sc(24px;#EE823A);
        }
      }
      .bottom-container{
        display: flex;
        width: 100%;
        height: 120px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 18px 0px rgba(0, 0, 0, 0.1);
        .bottom-total-con{
          display: flex;
          flex: 1;
          align-items: center;
          .bg-con{
            background: @color-extrude;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            margin-left: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            .doc-con{
              width: 80px;
              height: 80px;
              background: url('../../../image/doc.png') no-repeat center center;
              background-size: 90% 90%;
              position: relative;
              .circle-total{
                position: absolute;
                right: 5px;
                top: -16px;
                width: 36px;
                height: 36px;
                background: #f00;
                border-radius: 50%;
                line-height: 36px;
                text-align: center;
                span{
                  .mixin-sc(26px;#fff);
                }
              }
              .circle-total.disabled{
                background: #a5a5a5;
              }
            }
          }
          .bg-con.disabled{
            background: #a5a5a5;
          }
          .total-mon{
            margin-left: 40px;
            .mixin-sc(30px;#24282E);
            span{
              .mixin-sc(40px;#24282E);
            }
          }
        }
        button{
          margin: 18px 30px 0 0;
        }
      }
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
          -border-bottom: 1px solid #eee;
          .click-con{
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 20px;
            justify-content: space-between;
            box-sizing: border-box;
            background: #f5f5f5;
          }
          .receiveName {
            font-size: 30px;
            color: #8A9099;
          }
        }
        ul {
          height: auto;
          width: 100%;
          li {
            height: 270px;
            width: 100%;
            display: flex;
            align-items: center;
            background: #fff;
            border-bottom: 1px solid #eee;
            .right {
              display: flex;
              flex: 1;
              height: 270px;
              justify-content: space-between;
              flex-direction: column;
              margin-left: 20px;
              font-weight: 400;
              background:rgba(255,255,255,1);
              border-bottom: 1px solid #eee;
              span {
                font-size: 30px;
                color: #24282E;
              }
              .right-receive-name{
                width: 100%;
                height: 90px;
                line-height: 90px;
              }
              .right-waybill-num {
                width: 100%;
                height: 90px;
                line-height: 90px;
                font-size: 26px;
                span{
                  color: #5C6066;
                }
              }
              .active {
                span {
                   color: #f00;
                }
              }
              .right-money {
                width: 100%;
                height: 90px;
                line-height: 90px;
                font-size: 30px;
                display: flex;
                .actualAccount{
                  flex: 1;
                  color: #24282E;
                }
                .collection{
                  flex: 1;
                  color: #3573EE;
                }
              }
            }
          }
          li:last-child{
            border-bottom: none;
            .right{
              border-bottom: none;
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
    .bottom-con {
      width: 200px;
      height: 86px;
      background: @color-extrude;
      .mixin-sc(32px;#fff);
      position: relative;
      border-radius: 10px;
    }
    .bottom-con2 {
      width: 200px;
      height: 86px;
      background: #e6e6e6;
      .mixin-sc(32px;#a5a5a5);
      position: relative;
      border-radius: 10px;
    }
    .noBill {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
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
@import "../../../style/base.less";
.withdraw-deposit-cofirm{
  .vux-x-dialog{
    .weui-dialog{
      .weui-dialog__bd{
        padding: 0px 20px!important;
      }
    }
  }
}
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
.popupRight {
  .withdraw-deposit-pop{
    .weui-cell__bd{
      width: 70%;
      flex: none;
      -margin-left: 15%;
      .weui-input{
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: none;
        font-size: 28px;
        border-bottom: 1px solid #aaa;
      }
    }
    .searchBar {
      height: 300px;
      margin-top: 85px;
      h3 {width: 100%; height: 30px; margin-left: 30px; font-size: 30px; font-weight:bold;}
      .searchDate {
        width: 95%;
        height: 100px;
        line-height: 100px;
        margin: 0px auto 50px;
        span {
          font-size: 28px;
          color: #676767;
          text-decoration: underline;
        }
        .flexRight {
          text-align: left;
          .weui-cell__ft {
            text-align: left;
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
}
.withdraw-deposit {
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
        width: 80px;
        height: 90px;
        line-height: 90px;
        text-align: center;
        background: url('../../../image/guolv.png') no-repeat center center;
        background-size: 45% 45%;
        .mixin-sc(34px;@color-extrude);
      }
    }
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
