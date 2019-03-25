<template>
  <div class="shift">
    <x-header
      title="班次信息"
      :left-options="{backText: ''}"
    />
    <div class="search-date" @click="clickChoose">{{dateValue === '' ? '全部日期' : dateValue === '全部' ? '全部日期' : dateValue}} ></div>
    <div class="main-list-con">
      <van-pull-refresh v-model="isLoading" @refresh="refresh" v-show="showListData">
        <div class="list-item-con" :key="index" v-for="(item, index) in listData">
          <div class="dayItem" v-if="item.data.length > 0">
            {{item.label}}
          </div>
          <ul v-if="item.data.length > 0">
            <li :key="liIndex" v-for="(liItem, liIndex) in item.data">
              <div class="li-con">
                <div class="line-name">{{liIndex  + 1}}&nbsp;&nbsp;{{liItem.lineName}}-{{liItem.serialNumber}}</div>
                <div class="shift-con">{{liItem.departureTime}}{{liItem.temporaryFlag === 1 ? ' (临时)' : ''}}</div>
                <div class="carNum">{{liItem.carNumber}}</div>
              </div>
            </li>
          </ul>
        </div>
      </van-pull-refresh>
      <van-pull-refresh v-model="noBillLoading" @refresh="refresh" class="noBill" v-show="!showListData">
        <div class="noBill">
          <div class="imgWrap">
            <img src="../../image//no-waybill.jpg" alt="">
          </div>
          <div class="msg">当前没有班次，辛苦啦！</div>
        </div>
      </van-pull-refresh>
    </div>
    <div v-transfer-dom class="shift-select-date">
      <popup v-model="showChoose">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
        :left-text="'取消'"
        :right-text="'确定'"
        :title="'选择日期'"
        :show-bottom-border="false"
        @on-click-left="cancelChoose"
        @on-click-right="chooseDate"></popup-header>
        <group gutter="0">
          <radio :options="dateChooseList" v-model="dateValue"></radio>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { XHeader, Popup, Group, Radio, PopupHeader, TransferDomDirective as TransferDom } from 'vux'
import { PullRefresh } from 'vant'
import ShiftAjax from '@/api/Shift/Shift'
export default {
  name: 'Shift',
  data () {
    return {
      isLoading: false,
      noBillLoading: false,
      showChoose: false,
      dateChooseList: [],
      dateValue: '',
      listData: {
        today: {label: '今天', data: []},
        tomorrow: {label: '', data: []},
        after: {label: '', data: []}
      }
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Popup,
    Group,
    PopupHeader,
    Radio,
    [PullRefresh.name]: PullRefresh
  },
  computed: {
    showListData () {
      return this.listData.today.data.length > 0 || this.listData.tomorrow.data.length > 0 || this.listData.after.data.length > 0
    }
  },
  created () {
    this.initDate()
    this.queryList()
    this.dateChooseList = ['全部', this.getDateStr(0), this.getDateStr(1), this.getDateStr(2)]
  },
  methods: {
    refresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.isLoading = false
        this.noBillLoading = false
        this.chooseDate()
      }, 500)
    },
    initDate () {
      let now = new Date()
      let tomorrow = now.getDate()
      this.listData.tomorrow.label = `${new Date(now.setDate(tomorrow + 1)).getMonth() + 1}月${new Date(now.setDate(tomorrow + 1)).getDate()}日`
      this.listData.after.label = `${new Date(now.setDate(tomorrow + 2)).getMonth() + 1}月${new Date(now.setDate(tomorrow + 2)).getDate()}日`
    },
    clickChoose () {
      this.showChoose = true
    },
    chooseDate () {
      this.showChoose = false
      if (this.dateValue !== '') {
        if (this.dateValue === '全部') {
          this.queryList()
        } else {
          this.queryList({shiftTime: this.dateValue})
        }
      }
    },
    cancelChoose () {
      this.dateValue = ''
      this.showChoose = false
    },
    queryList (params) {
      let postParams = {}
      if (params) {
        postParams = params
      } else {
        postParams.startDate = this.getDateStr(0)
        postParams.endDate = this.getDateStr(2)
      }
      ShiftAjax.queryList(postParams).then(response => {
        if (response.code === 200) {
          this.listData.today.data = []
          this.listData.tomorrow.data = []
          this.listData.after.data = []
          this.formatListData(response.data)
        }
      })
    },
    // 格式化今天，明天，后天数据
    formatListData (data) {
      data.forEach(item => {
        if (item.shiftTime === this.getDateStr(0)) {
          this.listData.today.data.push(item)
        } else if (item.shiftTime === this.getDateStr(1)) {
          this.listData.tomorrow.data.push(item)
        } else if (item.shiftTime === this.getDateStr(2)) {
          this.listData.after.data.push(item)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.shift{
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
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
  }
  .van-pull-refresh__text {
    font-size: 28px;
  }
  .van-pull-refresh__loading span{
    font-size: 28px;
  }
}
.shift-select-date{
  .weui-cells_radio{
    .weui-cell__bd{
      p{
        span{
          .mixin-sc(30px;#333);
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.shift{
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex: 1;
  .search-date{
    height: 70px;
    line-height: 70px;
    text-align: center;
    width: 100%;
    background: #eee;
    border-bottom: 1px solid #ddd;
    .mixin-sc(28px;#1A1A1A);
  }
  .main-list-con{
    border-top: 1px solid #ddd;
    margin-top: 0px;
    margin-bottom: 20px;
    padding: 0 20px;
    // display: flex;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    flex-direction: column;
    background: #f3f4f5;
    .list-item-con{
      .dayItem{
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-indent: 20px;
        .mixin-sc(30px;#1A1A1A);
        font-weight: bold;
      }
      ul{
        background: #fff;
        li{
          width: 100%;
          height: 95px;
          .li-con{
            width: 100%;
            height: 95px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .line-name{
              display: flex;
              flex: 1;
              padding-left: 26px;
              .mixin-sc(28px;#676767);
            }
            .shift-con{
              width: 210px;
              height: 95px;
              line-height: 95px;
              .mixin-sc(28px;#FF5400);
            }
            .carNum{
              width: 180px;
              height: 95px;
              line-height: 95px;
              .mixin-sc(28px;#A0A0A0);
            }
          }
        }
      }
    }
    .noBill{
      display: flex;
      flex: 1;
      height: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
}
</style>
