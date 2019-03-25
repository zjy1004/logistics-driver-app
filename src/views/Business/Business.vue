
<template>
  <div class="business">
    <tab>
      <tab-item selected @on-item-click="onItemClick">待收款</tab-item>
      <tab-item @on-item-click="onItemClick">待交款</tab-item>
    </tab>
    <div class="main-con">
      <!-- 待收款 -->
      <div v-show="isReceiveMon" class="receiveMon">
        <div class="search-con">
          <search
            v-model="searchValue"
            position="absolute"
            :auto-fixed="a"
            top="46px"
            @on-submit="onSubmit"
            ref="search"
          ></search>
          <div class="btn-icon"><i class="iconfont icon-yingyongchengxu-xianxing"></i></div>
        </div>
        <div class="main-list-con">
          <div class="list-item-con" :key="index" v-for="(item, index) in listData">
            <div class="receiveItem">
              <check-icon @change.native="checkChange" :value.sync="item.isCheck"></check-icon>
              <i class="iconfont icon-kucun-xianxing"></i>
              <span class="receiveName">{{item.name}}</span>
              <span class="pay">(付款码)<span class="right-pay">></span></span>
            </div>
            <ul>
              <li :key="index" v-for="(boxItem, index) in item.boxList">
                <check-icon :value.sync="boxItem.isCheck"></check-icon>
                <div class="right">
                  <span>{{boxItem.leftName}}</span>
                  <i class="iconfont icon-caiwu-xianxing"></i>
                  <span class="midName">{{boxItem.midName}}</span>
                  <span>({{boxItem.rightName}})</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="total-con">

        </div>
        <div class="bottom-con">
          确认收款（36000）
        </div>
      </div>
      <!-- 待交款 -->
      <div v-show="!isReceiveMon" class="dealMon">

      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, XButton, Search, CheckIcon } from 'vux'
export default {
  name: 'Business',
  data () {
    return {
      isReceiveMon: true,
      searchValue: '',
      a: false,
      listData: [
        {
          isCheck: false,
          id: 1,
          name: '老王修理厂(五方-顺义)',
          boxList: [
            {
              parentId: 1,
              isCheck: false,
              leftName: '0901-3-2',
              midName: '5010',
              rightName: '10+5000'
            },
            {
              parentId: 1,
              isCheck: false,
              leftName: '昨日-4-5',
              midName: '5010',
              rightName: '10+5000'
            },
            {
              parentId: 1,
              isCheck: false,
              leftName: '昨日-4-6',
              midName: '5010',
              rightName: '10+5000'
            }
          ]
        },
        {
          isCheck: false,
          id: 2,
          name: '老李修理厂(昌平-大兴)',
          boxList: [
            {
              parentId: 2,
              isCheck: false,
              leftName: '今日-3-1',
              midName: '5010',
              rightName: '10+5000'
            },
            {
              parentId: 1,
              isCheck: false,
              leftName: '今日-3-1',
              midName: '5010',
              rightName: '10+5000'
            },
            {
              parentId: 1,
              isCheck: false,
              leftName: '昨日-2-3',
              midName: '5010',
              rightName: '10+5000'
            }
          ]
        }
      ]
    }
  },
  components: {
    Tab,
    TabItem,
    XButton,
    Search,
    CheckIcon
  },
  methods: {
    onItemClick (index) {
      if (index === 0) { // 待收款
        this.isReceiveMon = true
      } else if (index === 1) { // 待交款
        this.isReceiveMon = false
      }
    },
    onSubmit () {

    },
    checkChange (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.business{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .main-con{
    display: flex;
    flex: 1;
    background: #f3f4f5;
    .receiveMon{
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .dealMon{
      display: flex;
      flex: 1;
    }
    .search-con{
      margin-top: 20px;
      width: 100%;
      height: 70px;
      display: flex;
      .vux-search-box{
        display: flex;
        flex: 1;
      }
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
    .main-list-con{
      border-top: 1px solid #eee;
      margin-top: 20px;
      padding: 20px;
      display: flex;
      flex: 1;
      overflow-y: auto;
      flex-direction: column;
      .list-item-con{
        display: flex;
        width: 100%;
        flex-direction: column;
        height: auto;
        .receiveItem{
          height: 90px;
          display: flex;
          align-items: center;
          background: #f6f8ff;
          position: relative;
          .pay{
            position: absolute;
            .mixin-sc(24px;#C0C0C0);
            right: 0px;
            top: 26px;
          }
          .right-pay{
            .mixin-sc(30px;@color-extrude);
            margin-right: 20px;
            margin-left: 20px;
          }
        }
        li{
          height: 90px;
          width: 100%;
          display: flex;
          align-items: center;
          background: #fff;
          border-bottom: 1px solid #eee;
          .right{
            display: flex;
            flex: 1;
            height: 90px;
            align-items: center;
            padding-left: 40px;
            margin-left: 30px;
            span{
              font-size: 30px;
              color: #555;
            }
            .iconfont{
              font-size: 30px;
              margin-left: 60px;
              margin-right: 10px;
            }
            .midName{
              margin-right: 40px;
            }
          }
        }
      }
    }
    .total-con{
      width: 100%;
      height: 80px;
      border-top: 1px solid #eee;
    }
    .bottom-con{
      width: 100%;
      height: 80px;
      background: @color-extrude;
      display: flex;
      align-items: center;
      justify-content: center;
      .mixin-sc(36px;#fff);
    }
  }
}
</style>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.business{
  .vux-tab-wrap{
    height: 80px!important;
    padding-top: 0px!important;
  }
  .vux-tab-container{
    height: 80px!important;
    border-bottom: 1px solid #aaa;
  }
  .vux-tab-container .vux-tab{
    height: 80px;
  }
  .vux-tab-container .vux-tab .vux-tab-item,.vux-tab-container .vux-tab .vux-tab-item.vux-tab-selected{
    line-height: 80px;
    color: #5677fc;
  }
  .vux-tab-container .vux-tab .vux-tab-item{
    color: #9A9A9A;
  }
  .vux-tab-container .vux-tab .vux-tab-ink-bar{
    background-color: #5677fc;
    width: 20%;
    margin: 0 auto;
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
      justify-content: center;
    }
    .weui-search-bar__box{
      display: flex;
      align-items: center;
      .weui-icon-search{
        top: 15px;
      }
      input{
        text-indent: 15px;
      }
    }
    .weui-search-bar__cancel-btn{
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
  }
  .vux-check-icon{
    width: 40px;
    height: 40px;
    margin-left: 20px;
    .weui-icon-circle{
      font-size: 38px;
    }
    .weui-icon-success{
      margin-left: 0px;
      .mixin-sc(38px;@color-extrude);
    }
  }
  .icon-kucun-xianxing{
    margin-left: 20px;
    .mixin-sc(38px;@color-extrude);
  }
  .receiveName{
    text-decoration: none;
    .mixin-sc(28px;@color-extrude);
  }
  .weui-icon-success:before{
    color: @color-extrude!important;
  }
}
</style>
