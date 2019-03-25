
<template>
  <div class="user-info">
    <x-header
      title="个人信息"
      :left-options="{backText: ''}"
    />
    <group>
      <cell title="姓名" :value="userInfo.userName"></cell>
      <cell title="联系电话" :value="userInfo.phone"></cell>
      <cell title="登录账号" :value="userInfo.account"></cell>
    </group>
    <group>
      <cell title="物流公司" :value="userInfo.logisticsName"></cell>
      <cell title="所属站点" :value="userInfo.stationName"></cell>
      <cell title="驾驶车辆" :value="userInfo.cars"></cell>
    </group>
  </div>
</template>

<script>
import { XHeader, Group, Cell } from 'vux'
import MyCenterAjax from '@/api/MyCenter/MyCenter'
export default {
  name: 'UserInfo',
  data () {
    return {
      userInfo: {
        userName: '', // 姓名
        phone: '', // 联系电话
        account: '', // 登录账号
        logisticsName: '', // 物流公司名称
        stationName: '', // 所属站点
        cars: '' // 驾驶车辆
      }
    }
  },
  components: {
    XHeader,
    Cell,
    Group
  },
  created () {
    this.queryDetail()
  },
  methods: {
    queryDetail () {
      let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
      let userId = userInfoObj.userId
      MyCenterAjax.queryUserInfo({userId}).then((response) => {
        if (response.code === 200) {
          this.userInfo = {...response.data}
          this.userInfo.cars = response.data.logisticsPersonnelCarParamList.map(item => {
            return item.carNumber
          }).join(',')
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.user-info{
  display: flex;
  flex: 1;
  background: #F3F4F5;
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
  .weui-cell{
    height: 108px;
    padding: 0 40px;
    label{
      .mixin-sc(32px;#676767);
    }
    .weui-cell__ft{
      .mixin-sc(30px;#000);
    }
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.user-info{
  height: 100%;
  width: 100%;
}
</style>
