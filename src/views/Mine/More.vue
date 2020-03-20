
<template>
  <div class="more">
    <x-header
      title="协议公示"
      :left-options="{backText: ''}"
    />
    <div class="line"></div>
    <div class="list">
      <ul>
        <li @click="checkDetail(item.protocolName, item.protocolType)" :key="index" v-for="(item,index) in listData">《{{item.protocolName}}》&nbsp;&nbsp;（{{item.createTime}}）</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import CommonAxios from '@/api/Common/CommonAxios'
export default {
  name: 'More',
  data () {
    return {
      listData: []
    }
  },
  components: {
    XHeader
  },
  created () {
    this.QueryProtocolVoList()
  },
  methods: {
    QueryProtocolVoList () { // 查询登录协议
      CommonAxios.QueryProtocolVoList().then((response) => {
        if (response.code === 200) {
          this.listData = response.data
        }
      })
    },
    // 点击条款
    checkDetail (protocolName, protocolType) {
      this.$router.push({name: 'ClauseDetail', query: {protocolName, protocolType}})
    }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.more{
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
  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }
  .list{
    display: flex;
    flex: 1;
    ul{
      flex: 1;
      padding: 0px 20px;
      li{
        border-bottom: 1px solid #ccc;
        padding: 20px 0px;
        line-height: 40px;
        .mixin-sc(28px;#5677fc);
      }
    }
  }
}
</style>
