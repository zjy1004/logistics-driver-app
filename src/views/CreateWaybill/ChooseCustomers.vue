<template>
  <!-- 开单选择客户 -->
  <div class="chooseCustomers">
  <!-- header -->
    <div class="c-header">
      <div @click="routerGo()" class="c-h-left"><x-icon type="ios-arrow-left"></x-icon></div>
      <div class="c-h-title">请选择客户</div>
      <div v-if="showCreateCustomer" class="c-h-right" @click="choose()">新建客户</div>
    </div>

    <!-- search -->
    <div class="searchTab">
      <form action="/">
        <van-search
          v-model="searchVal"
          placeholder="收货方名称/电话"
          show-action
          @search="onSearch(searchVal)"
          @cancel="onCancel(searchVal)"
          @keyup="onSearch(searchVal)"
          @clear="onSearch(searchVal)"
        />
      </form>
    </div>

    <!-- searchList -->
    <div  class="searchList">
      <div class="c-waybill" v-if="clientSearchListData.length > 0" >
          <ul class="c-w-wrap">
            <li class="c-w-item" :key="index" v-for="(item, index) in clientSearchListData"  @click="handleDetail(item)" :class="{checkColor:item.id === routerInfo.receiveClient}">
              <div class="item-mid">
                <div class="item-mid_div row">
                  <div class="row-item">
                    <span>{{item.clientName}}</span>
                  </div>
                  <div class="row-item">
                    <span>{{item.showPhone}}</span>
                  </div>
                </div>
                <div class="item-mid_div row">
                  <div class="address">
                    <span class="value">{{item.address}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
      </div>

      <!-- 无数据 -->
      <div class="noBill">
        <div class="imgWrap" v-if="clientSearchListData.length === 0">
          <img src="../../image/noInfo.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from 'vant'
import CreatWaybillAjax from '@/api/CreatWaybill/CreatWaybill'
export default {
  components: {[Search.name]: Search},
  data () {
    return {
      searchVal: '',
      clientListData: [],
      clientSearchListData: [],
      showCreateCustomer: false,
      form: {
        id: '', // 新开单为空，修改存在id
        sendLogistics: '', // 发货站点物流公司id
        sendLogisticsName: '', // 发货站点物流公司名称
        sendStation: '', // 发货站点id
        sendStationName: '请选择发货站点', // 发货站点名称
        receiveClient: '', // 收id
        receiveClientName: '', // 收name
        receivePhone: '', // 收电话
        receiveAddress: '', // 收地址
        freightPayer: 2, // 运费付款方
        receivableGoods: '0', // 代收货款
        commodityName: '配件', // 包裹名称
        commodityNumber: 1, // 包裹数量
        receiveLogistics: '', // 落地配物流公司id
        receiveLogisticsName: '', // 落地配物流公司name
        receiveStation: '', // 落地配站点id
        freeLimitedTime: '', // 当前客户是否在优惠期
        receiveStationName: '请选择落地配' // 落地配站点name
      },
      routerInfo: {}
    }
  },
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (userInfo.businessModel === 2) {
      this.showCreateCustomer = true
    }
    this.routerInfo = this.$route.query.waybillInfo || {}
    this.form = Object.assign(this.form, this.routerInfo)
    this.clientSearchListData = this.clientListData
    this.getWaybill()
  },

  methods: {
    choose () {
      this.$router.push({name: 'CreateClient', query: {goBackType: 'first', waybillInfo: this.form}})
    },
    routerGo () {
      let goBack = this.$route.query.goBackType
      if (goBack === 'first') {
        this.$router.push({name: 'Waybill'})
      } else {
        this.$router.push({name: 'CreateWaybill', query: {waybillInfo: this.form}})
      }
    },
    onSearch (val) {
      this.getWaybill(val)
      // this.clientSearchListData = this.clientListData.filter(item => {
      //   return item['clientName'].includes(val) || item['clientPhone'].includes(val)
      // })
    },
    onCancel () {
      this.clientSearchListData = this.clientListData
    },
    getWaybill (val) {
      CreatWaybillAjax.querySelectAgencyClientList({telOrName: val}).then(res => {
        if (res.code === 200) {
          let temp = res.data
          // 一次最多展示20条数据
          // if (res.data.length > 20) {
          //   temp = res.data.slice(0, 20)
          // }
          let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
          if (userInfo.businessModel === 2) {
            this.clientListData = temp.map(item => {
              item.showPhone = item.clientPhone
              return item
            })
          } else {
            this.clientListData = temp.map(item => {
              item.showPhone = this.encryptPhoneNumber(item.clientPhone)
              return item
            })
          }
          this.clientSearchListData = this.clientListData
        }
      })
    },
    handleDetail (val) {
      this.form.receiveClient = val.id
      this.form.receiveAddress = val.address
      this.form.receivePhone = val.clientPhone
      this.form.receiveClientName = val.clientName
      this.form.receiveLogistics = val.pkLogistics
      this.form.receiveStation = val.pkStation
      this.form.freeLimitedTime = val.freeLimitedTime
      this.$router.push({name: 'CreateWaybill', query: {type: this.$route.query.type, waybillInfo: this.form}})
    }
  }
}
</script>

<style lang="less" scoped>
.chooseCustomers {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .c-header {
    height: 90px;
    line-height: 90px;
    width: 100%;
    //display: flex;
    justify-content: center;
    background-color: #fff;
    position: relative;
    .c-h-left {
      width: 100px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      left: 0;
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
      width: 150px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 30px;
      color: #4D7BFE;
    }
  }
  // .searchTab {

  // }
  .searchList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    //overflow: auto;
    .c-waybill {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      // display: flex;
      // flex-direction: column;
      // flex: 1;
      margin-top: 20px;
      .c-w-wrap {
        width: 100%;
        height: 100%;
        .c-w-item {
          min-height: 135px;
          height: auto;
          width: 95%;
          background: #FFF;
          margin: 0 auto;
          margin-bottom: 20px;
          .item-mid {
            width: 90%;
            margin: 0 auto;
            min-height: 130px;
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
            .row {
              display: flex;
              .row-item {
                width: 100%;
                min-height: 60px;
                height: auto;
              }
              .address {
                width: 500px;
                min-height: 60px;
                height: auto;
                line-height: 60px;
                display: flex;
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
        display: flex;
        flex: 1;
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
}
</style>

<style lang="less">
.chooseCustomers {
  .searchTab {
    .van-search {
      padding: 10px 20px;
    }
    .van-cell {
      display: flex;
      align-items: center;
      .van-cell__left-icon {
        font-size: 28px;
      }
      .van-icon-clear {
        font-size: 28px;
      }
      input {
        height: 40px;
        line-height: 40px;
      }
    }
    .van-search .van-cell {
      height: 80px;
      line-height: 80px;
      input {
        font-size: 28px;
      }
    }
    .van-search__action {
      div {
        font-size: 28px;
      }
    }
  }
    .checkColor{
    background: #e1e1e1 !important;
  }
}
</style>
