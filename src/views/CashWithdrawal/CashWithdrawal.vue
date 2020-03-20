<template>
  <div class="CashWithdrawal">
    <div class="total">
      <div class="title1">账户余额</div>
      <div class="title2"><span class="num">{{totalBalance||'0.00'}}</span> 元</div>
      <div class="title3" @click="goToWithdrawDeposit()">
        立即提现
        <!-- <div class="bag"></div>
        <div class="word">提现</div> -->
      </div>
    </div>
    <van-tabs type="card" @change="changeTabs">
      <van-tab title="提现记录">
        <div class="content" v-if="WithdrawalsRecordList.length === 0 ? false : true">
          <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh('0')">
            <p></p>
            <ul>
              <li :key="index" v-for="(item,index) in WithdrawalsRecordList" @click="goToDetail(item.transactionId)">
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
          </van-pull-refresh>
          <p class="end" @click="goToRecordOfTotal()">查看全部记录></p>
        </div>

        <!-- 提现-无运单 Start -->
        <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh('0')" v-if="WithdrawalsRecordList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
            <img src="../../image//noInfo.png" alt="">
            </div>
            <!-- <div class="msg">暂无数据！</div> -->
          </div>
         </van-pull-refresh>
        <!-- 提现-无运单 End -->
      </van-tab>
      <van-tab title="代收货款">
        <div class="content" v-if="CollectingMoneyList.length === 0 ? false : true">
          <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh('1')">
          <p></p>
          <ul>
            <li :key="index" v-for="(item,index) in CollectingMoneyList" @click="goToWaybillDetail(item.waybillId)">
              <div class="left">
                <div class="state">{{item.repairFactoryName}}</div>
                <div class="date">{{item.createTime}}</div>
              </div>
              <div class="arrow"><i class="iconfont icon-youjiantou1"></i></div>
              <div class="right">
                <div class="mony">￥{{item.actualGoodsAmount}}</div>
                <div class="mony" :class="{'success': item.withdrawStatus === '已提现', 'failed': item.withdrawStatus === '未提现'}">{{item.withdrawStatus}}</div>
              </div>
            </li>
          </ul>
          </van-pull-refresh>
          <p class="end" @click="goToRecordOfTotalCollectingGoods()">查看全部记录></p>
        </div>

        <!-- 提现-无运单 Start -->
        <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh('1')" v-if="CollectingMoneyList.length === 0 ? true : false">
          <div class="noBill">
            <div class="imgWrap">
            <img src="../../image//noInfo.png" alt="">
            </div>
            <!-- <div class="msg">暂无数据！</div> -->
          </div>
        </van-pull-refresh>
        <!-- 提现-无运单 End -->
      </van-tab>
    </van-tabs>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
        :confirm-text="'去绑卡'"
        :cancel-text="'再等等'"
        @on-cancel="showConfirm = false"
        @on-confirm="onConfirmBindCard">
        <p style="text-align:center;">当前未绑卡，无法提现</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showRegister"
        :confirm-text="'去绑卡'"
        :cancel-text="'再等等'"
        @on-cancel="showRegister = false"
        @on-confirm="onConfirmRegister">
        <p style="text-align:center;">注册成功，是否添加提现银行卡</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showWithdrawal"
        :confirm-text="'去提现'"
        :cancel-text="'确定'"
        @on-cancel="showWithdrawal = false"
        @on-confirm="onConfirmWithDrawal">
        <p style="text-align:center;">恭喜绑卡成功</p>
      </confirm>
    </div>
    <!-- 是否鉴权 -->
    <div v-transfer-dom>
      <confirm v-model="showAuthConfirm"
        :confirm-text="'继续认证'"
        :cancel-text="'重新绑卡'"
        @on-cancel="onCancelAuth"
        @on-confirm="onConfirmAuth">
        <p style="text-align:center;">该账户存在银行卡正在进行身份认证是否继续进行认证</p>
      </confirm>
    </div>
     <!-- 资金账户升级提示 -->
    <div v-transfer-dom>
      <confirm v-model="hintUpdateAccount"
        :cancel-text="'取消'"
        :confirm-text="'确定'"
        @on-cancel="onCancelUpdate"
        @on-confirm="onConfirmUpdate">
        <p style="text-align:center;">为提升您账户的资金安全及到账时效，驮付宝即将与平安银行进一步合作，升级资金通道，请您按照系统提示步骤进行资金账户升级，感谢您的谅解与配合。</p>
      </confirm>
    </div>
    <update-account-dialog
      v-if="updateAccountShow"
      :show="updateAccountShow"
      :accountData="accountInfo"
      @confirm-update="confirmUpdate"
    />
    <van-dialog
      v-model="showUpdateSuccess"
      message="账户升级成功!"
      :close-on-click-overlay = true
    >
    </van-dialog>
  </div>
</template>

<script>
import { Tab, Tabs, PullRefresh, Dialog } from 'vant'
import { Confirm, TransferDom } from 'vux'
import TreasureAjax from '@/api/Treasure/Treasure'
import CommonAxios from '@/api/Common/CommonAxios'
import UpdateAccountDialog from './subpage/UpdateAccountDialog'

export default {
  data () {
    return {
      routerFrom: '',
      authStatus: '',
      haveBindCard: false,
      showConfirm: false,
      showRegister: false,
      showWithdrawal: false,
      showAuthConfirm: false,
      isLoading: false,
      hintUpdateAccount: false, // 账户升级提示
      updateAccountShow: false, // 升级弹框
      showUpdateSuccess: false, // 升级成功
      accountInfo: {},
      totalBalance: '', // 账户余额
      WithdrawalsRecordList: [], // 提现记录
      CollectingMoneyList: [], // 代收货款
      flowDealerWithdrawCashParam: {
        pageSize: 10,
        currentPage: 1
      },
      flowCollectionGoodsIncomeParam: {
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created () {
    this.QueryDealerAppWithdrawCashList(this.flowDealerWithdrawCashParam)
    this.QueryAccountBalance()
    this.queryBankInfo()
    this.queryNewWalletStatus()
    this.routerFrom = this.$route.query.from
  },
  watch: {
    routerFrom (newVal, oldVal) {
      if (newVal === 'register') {
        this.showRegister = true
      }
      if (newVal === 'bindCardSuccess') {
        this.showWithdrawal = true
      }
    }
  },
  methods: {
    queryBankInfo () { // 查询银行卡信息
      CommonAxios.QueryBankInfo().then(response => {
        if (response.code === 200) {
          if (response.data === null) {
            this.haveBindCard = false
          } else {
            if (response.data.status === 0) {
              this.haveBindCard = true
              this.authStatus = 0
            } else {
              this.authStatus = 1
              this.haveBindCard = true
            }
          }
        }
      })
    },
    // 下拉刷新
    waybillRefresh (val) {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        if (val === '0') {
          this.QueryDealerAppWithdrawCashList(this.flowDealerWithdrawCashParam)
          this.QueryAccountBalance()
        }
        if (val === '1') {
          this.QueryAppFlowCollectionGoodsIncomeList(this.flowCollectionGoodsIncomeParam)
          this.QueryAccountBalance()
        }
        this.isLoading = false
      }, 500)
    },
    QueryAccountBalance (val) {
      CommonAxios.WalletBankAccount(val).then((res) => {
        if (res.code === 200) {
          this.QueryAccount()
          this.totalBalance = res.data.accountBalanceSum
        }
      })
    },
    QueryAccount () {
      TreasureAjax.DealCanWithdraw().then((response) => {
        if (response.code === 200) {}
      })
    },
    goToRecordOfTotal () {
      this.$router.push({name: 'RecordOfTotalWithdrawalAmount'})
    },
    goToRecordOfTotalCollectingGoods () {
      this.$router.push({name: 'RecordOfTotalCollectingGoods'})
    },
    goToWaybillDetail (val) {
      this.$router.push({name: 'WaybillDetail', query: {id: val}})
    },
    goToWithdrawDeposit () {
      if (this.haveBindCard) {
        if (this.authStatus === 0) {
          this.$router.push({name: 'WithdrawDeposit'})
        } else {
          this.showAuthConfirm = true
        }
      } else {
        this.showConfirm = true
      }
    },
    onConfirmAuth () { // 继续认证
      this.$router.push({name: 'ReBind'})
    },
    onCancelAuth () { // 重新绑卡
      this.$router.push({name: 'BindCard'})
    },
    onConfirmWithDrawal () {
      this.$router.push({name: 'WithdrawDeposit'})
    },
    onConfirmBindCard () {
      this.$router.push({name: 'BindCard'})
    },
    onConfirmRegister () {
      this.$router.push({name: 'BindCard', query: {from: 'treasure'}})
    },
    onCancelUpdate () { // 账户升级-取消弹框
      this.$router.push({name: 'Waybill'})
    },
    onConfirmUpdate () { // 账户升级-确定弹框
      this.updateAccountShow = true
    },
    confirmUpdate () { // 账户升级提交
      this.updateAccountShow = false
      this.showUpdateSuccess = true
    },
    queryNewWalletStatus () {
      TreasureAjax.QueryNewWalletStatus().then(res => {
        if (res.code === 200) {
          if (res.data.status === 1) {
            this.hintUpdateAccount = true
            this.accountInfo = res.data
            this.accountInfo.openAccountBank = res.data.bankName || ''
            this.accountInfo.bankName = res.data.bankName || ''
          }
        }
      })
    },
    goToDetail (val) {
      this.$router.push({name: 'CashWithdrawalDetail', query: {transactionId: val}})
    },
    changeTabs (index, title) {
      if (index === 0) {
        this.QueryDealerAppWithdrawCashList(this.flowDealerWithdrawCashParam)
        this.QueryAccountBalance()
      }
      if (index === 1) {
        this.QueryAppFlowCollectionGoodsIncomeList(this.flowCollectionGoodsIncomeParam)
        this.QueryAccountBalance()
      }
    },
    QueryDealerAppWithdrawCashList (val) {
      TreasureAjax.QueryDealerAppWithdrawCashList(val).then((response) => {
        if (response.code === 200) {
          this.WithdrawalsRecordList = response.data.list && response.data.list.map((item, index) => {
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
    },
    QueryAppFlowCollectionGoodsIncomeList (val) {
      TreasureAjax.QueryAppFlowCollectionGoodsIncomeList(val).then((response) => {
        if (response.code === 200) {
          this.CollectingMoneyList = response.data.list && response.data.list.map((item, index) => {
            if (item.withdrawStatus === 1) {
              item.withdrawStatus = '不可提现'
            }
            if (item.withdrawStatus === 2) {
              item.withdrawStatus = '可提现'
            }
            if (item.withdrawStatus === 3) {
              item.withdrawStatus = '提现中'
            }
            if (item.withdrawStatus === 4) {
              item.withdrawStatus = '已提现'
            }
            if (item.withdrawStatus === 5) {
              item.withdrawStatus = '未提现'
            }
            return item
          })
        }
      })
    }
  },
  components: {
    Confirm,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Dialog.name]: Dialog,
    UpdateAccountDialog

  },
  directives: {
    TransferDom
  }
}
</script>

<style lang="less" scoped>
.CashWithdrawal {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .total {
    width: 100%;
    height: 300px;
    //background:linear-gradient(-45deg,rgba(65,146,247,1),rgba(58,90,230,1));
    background: url('../../image/bg-cf.png') no-repeat center center;
    //align-items: center;
    color: #E0E5FB;
    display: flex;
    flex-direction: column;
    .title1 {
      font-size: 28px;
      margin-top: 50px;
      margin-left: 50px;
      height: 100px;
      line-height: 100px;
    }
    .title2 {
      font-size: 28px;
      margin-left: 50px;
      .num {
        font-size: 60px;
        font-weight: 500;
      }
    }
    .title3 {
      position: absolute;
      right: 50px;
      top: 110px;
      width:240px;
      height:97px;
      line-height: 97px;
      text-align: center;
      color: #3A67E7;
      font-size: 34px;
      //background:linear-gradient(0deg,rgba(203,226,255,1),rgba(255,255,255,1));
      background: url('../../image/btn-cf.png') no-repeat center center;
      border-radius:49px;
      font-weight: 500;
      .bag {
        width: 60px;
        height: 60px;
        display: inline-block;
        background: url('../../image/bag.png') no-repeat center center;
        background-size: 100% 100%;
      }
      .word {
        padding: 10px 5px;
      }
    }
  }

  .content {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    p {
      height: 40px;
      line-height: 40px;
      background: #fff;
      padding-left: 30px;
    }
    .end {
      text-align: center;
      height: 80px;
      line-height: 80px;
      font-size: 28px;
    }
    ul {
      overflow: auto;
      height: 100%;

      li {
        width: 90%;
        height: 120px;
        //line-height: 120px;
        border-bottom: 1px solid #ECECEC;
        padding: 0 30px;
        margin: 0 auto;
        .left {
          float: left;
          .state {
            font-size: 30px;
            font-weight: 500;
            color: #24282E;
          }
          .date {
            font-size: 24px;
            color: #8A9099;
            font-weight: 400;
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
          line-height: 120px;
          .mony {
            color: #24282E;
            font-weight: 500;
            font-size: 30px;
            text-align: right;
          }
          div {
            height: 60px;
            line-height: 60px;
          }
          .success{
            color: #24282E;
          }
          .failed{
            color: #F57017;
          }
        }
        .arrow {
          height: 120px;
          line-height: 120px;
          float: right;
          margin-left: 10px;
          .iconfont {
            font-size: 30px;
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
</style>

<style lang="less">
.CashWithdrawal {
  background: #fff;
  .van-tabs--card{
    display: flex;
    flex: 1;
    padding-top: 100px;
    margin-top: 40px;
    overflow-y: auto;
    .van-tabs__wrap {
      height: 100px;
      width: 90%;
      margin: 0 auto;
      border-radius:6px;
    }
  }
  .van-tab {
    height: 100px !important;
    line-height: 100px !important;
    color: #24282E;
    border-right: none;
    span {
    font-size: 28px;

    }
  }
  .van-tabs__track ,.van-tab__pane {
    height: 100%;
  }
  .van-tabs__nav--card {
    margin: 0 0;
    height: 100px !important;
    border: none;
  }
  .van-tabs__nav--card .van-tab {
    background: #F0F1F2 !important;
    border: none !important;
    color: #24282E;
  }
  .van-tab--active {
    .van-ellipsis {
      width: 80%;
      margin: 0 auto;
      height: 70px;
      line-height: 70px;
      margin-top: 15px;
      background: #fff !important;
      border-radius:6px;
      color: #24282E;
      font-weight: 400;
      font-size: 28px;
    }
  }
}
.van-dialog {
  .van-dialog__content {
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .van-dialog__message {
    font-size: 34px;
    color: #000;
  }
  .van-dialog__confirm {
    color: #4A7FE8;
  }
}
.vux-x-dialog{
    .weui-dialog{
      .weui-dialog__bd{
        padding: 0px 20px!important;
      }
    }
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
