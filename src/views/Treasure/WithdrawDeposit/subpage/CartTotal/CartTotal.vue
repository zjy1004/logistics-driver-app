<template>
  <div class="cart-total">
    <x-header @on-click-back="goback" :title=title :left-options="{backText: '', preventGoBack: true}"></x-header>
    <div class="main-con">
      <!-- 提现 start-->
      <div class="receiveMon">
        <div class="receiveMon">
          <!-- 提现-MainContent Start -->
          <div class="main-list-con">
            <div class="list-item-con" :key="index" v-for="(item, index) in fullSelectedGroupList">
              <div class="receiveItem">
                <div class="click-con">
                  <span class="receiveName">{{item.createTime}}</span>
                </div>
              </div>
              <ul>
                <li :key="index" v-for="(boxItem, index) in item.clientAccountList">
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
                  <div class="reduce-btn" @click="reduce(boxItem)"></div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 提现-MainContent End -->

          <!-- 提现-Bottom Start -->
          <div class="bottom-container">
            <button @click="sureWithdraw" :class="fullSelectedGroupList.length > 0 ? bottomA : bottomB" type="button" :disabled="fullSelectedGroupList.length === 0">确认提现</button>
          </div>
          <!-- 提现-Bottom End -->
        </div>
      </div>
      <!-- 提现 end -->
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
import { XHeader, XButton, CheckIcon, Confirm, TransferDom } from 'vux'
import { mapMutations, mapGetters } from 'vuex'
import CommonAxios from '@/api/Common/CommonAxios'
import WithdrawDepositAjax from '@/api/WithdrawDeposit/WithdrawDeposit'
export default {
  name: 'CartTotal',
  data () {
    return {
      totalAmount: '', // 可提现余额
      bottomA: 'bottom-con', // 无运单-底部样式
      bottomB: 'bottom-con2', // // 有运单-底部样式
      showSignFor: false,
      showSureWithdraw: false,
      bankName: '', // 银行卡名称
      bankCard: '' // 银行卡号
    }
  },
  components: {
    XHeader,
    XButton,
    CheckIcon,
    Confirm
  },
  directives: {
    TransferDom
  },
  computed: {
    ...mapGetters([
      'receiveSelectedList',
      'selectedGroupList'
    ]),
    fullSelectedGroupList () {
      let arr = []
      arr = this.selectedGroupList.map(item => {
        item.clientAccountList = item.clientAccountList.filter(childItem => {
          return childItem.check === true
        })
        return item
      })
      return arr
    },
    title () {
      return `共计：￥${this.receiveFreightMoney} (${this.receiveSelectedList.length}单)`
    },
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
  },
  methods: {
    ...mapMutations([
      'reduceWaybill', // 点击行减少
      'clickWaybillItem' // 点击行单选
    ]),
    goback () {
      this.$router.push({name: 'WithdrawDeposit', query: {index: 1}})
    },
    // 删除某行数据
    reduce (boxItem) {
      this.reduceWaybill({boxItem})
    },
    // 点击立即绑卡
    onConfirmSignFor () {

    },
    // 确认提现
    sureWithdraw () {
      this.queryBankInfo()
    },
    // 点击确认提现
    onConfirmWithdraw () {
      WithdrawDepositAjax.withdrawMoney({amount: this.receiveFreightMoney, waybillIds: this.waybillIds}).then(response => {
        if (response.code === 200) {
          this.$vux.toast.show({
            type: 'success',
            text: '提现成功!'
          })
          this.showSureWithdraw = false
          this.$router.push({name: 'WithdrawDeposit'})
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.message
          })
        }
      })
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
    }
  }
}
</script>
<style scoped lang="less">
@import "../../../../../style/base.less";
.cart-total {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .main-con {
    display: flex;
    flex: 1;
    background: #f3f4f5;
    overflow: auto;
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
          font-size: 30px;
          color: #8A9099;
        }
      }
      ul {
        height: auto;
        width: 100%;
      }
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
        .reduce-btn{
          width: 50px;
          height: 50px;
          background: url('../../../../../image/reduce.png') no-repeat center center;
          background-size: 100% 100%;
          margin-right: 40px;
        }
      }
    }
  }
  .bottom-con {
    width: 200px;
    height: 100px;
    background: @color-extrude;
    .mixin-sc(36px;#fff);
    position: relative;
  }
  .bottom-con2 {
    width: 200px;
    height: 100px;
    background: #e6e6e6;
    .mixin-sc(36px;#a5a5a5);
    position: relative;
  }
  .bottom-container{
    button{
      width: 100%;
    }
  }
}
</style>
<style lang="less">
@import "~vux/src/styles/1px.less";
@import "../../../../../style/base.less";
.cart-total {
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
        .mixin-sc(34px;@color-extrude);
      }
    }
  }
}
</style>
