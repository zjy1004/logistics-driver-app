
<template>
  <div class="invite-code">
    <x-header
      title="邀请码"
      :left-options="{backText: ''}"
    />
    <div class="main-con">
      <div class="top">
        <div class="title first">邀请好友</div>
        <div class="title">立享优惠活动</div>
        <div class="code-con">
          <div class="code-text">{{inviteCode}}</div>
          <div class="tip">（长按邀请码复制）</div>
        </div>
        <div class="time">免费期限：{{startTime}} - {{endTime}}</div>
      </div>
      <div class="middle">
        <i class="iconfont icon-yonghuqueren"></i>已邀请好友<span class="person">（{{inviteList.length}}人）</span>
      </div>
      <div class="invite-list">
        <div class="con">
          <div class="invite-item" :class="{'last': index === inviteList.length - 1}" :key="index" v-for="(inviteItem, index) in inviteList">
            <span class="phone">{{encryptPhoneNumber(inviteItem.phone)}}</span>
            <span class="time">{{inviteItem.time}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  name: 'InviteCode',
  data () {
    return {
      inviteCode: '3F8GY4',
      startTime: '2019.8.22',
      endTime: '2019.8.31',
      inviteList: [{phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}, {phone: '15548756985', time: '2019-08-28 15:01'}]
    }
  },
  components: {
    XHeader
  },
  created () {

  },
  methods: {

  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.invite-code {
  display: flex;
  flex: 1;
  background: #fff !important;
  flex-direction: column;
  .main-con {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top{
      width: 100%;
      height: 600px;
      background: #4A7FE8;
      border-radius: 0px 0px 50% 50%;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-weight: bold;
        .mixin-sc(48px;#fff);
      }
      .title.first{
        margin-top: 40px;
      }
      .code-con{
        width: 500px;
        height: 200px;
        border-radius: 30px;
        background: #fff;
        margin: 60px auto 0;
        overflow: hidden;
        .code-text{
          width: 350px;
          height: 90px;
          background: #eee;
          margin: 30px auto 0;
          .mixin-sc(36px;#333);
          text-align: center;
          border-radius: 20px;
          line-height: 90px;
          font-weight: bold;
        }
        .tip{
          width: 100%;
          height: 50px;
          line-height: 50px;
          margin: 5px auto 0;
          text-align: center;
          .mixin-sc(24px;#bbb);
          margin-top: 20px;
        }
      }
      .time{
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        .mixin-sc(26px;#fff);
        margin-top: 50px;
      }
    }
    .middle{
      padding-left: 40px;
      height: 40px;
      margin-top: 30px;
      .mixin-sc(30px;#333);
      .iconfont{
        font-size: 36px;
        margin-right: 16px;
      }
      .person{
        .mixin-sc(30px;#4A7FE8);
      }
    }
    .invite-list{
      display: flex;
      flex: 1;
      margin: 40px;
      border: 2px solid #ddd;
      border-radius: 10px;
      flex-direction: column;
      .con{
        width: 100%;
        height: 100%;
        overflow: scroll;
        .invite-item{
          width: 100%;
          height: 80px;
          border-bottom: 1px solid #ddd;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          .phone{
            margin-left: 30px;
            .mixin-sc(24px;#aaa);
          }
          .time{
            margin-right: 50px;
            .mixin-sc(24px;#aaa);
          }
        }
        .invite-item.last{
          border: none;
        }
      }

    }
  }
}
</style>

<style lang="less" scope>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.invite-code{
  .vux-x-dialog{
    .weui-dialog{
      .weui-dialog__bd{
        padding: 0px 20px!important;
      }
    }
  }
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
}
</style>
