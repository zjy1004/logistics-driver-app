<template>
  <div class="footer">
    <router-link to="/repairShopWaybillList" class="footer-item" :class="{active: $route.name === 'RepairShopWaybillList' || $route.name === 'Index'}">
      <i class="iconfont icon-dingdan2"></i>
      <div class="footer-title">运单</div>
    </router-link>
    <router-link to="/mine" class="footer-item" :class="{active: $route.name === 'Mine'}">
      <i class="iconfont icon-wode1"></i>
      <div class="footer-title">我的</div>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'FooterBar',
  data () {
    return {
      isRepairShop: false
    }
  },
  created () {
    let companyType = JSON.parse(sessionStorage.getItem('userInfo')).companyType
    if (companyType === 6) {
      this.isRepairShop = true
    } else {
      this.isRepairShop = false
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
 .footer{
    background-color: #fafbfe;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    a {
      text-decoration: none;
      // height: 100%;
     }
    .footer-item{
      padding-top: 10px;
      height: 100%;
      flex: 1;
      line-height: 1;
      text-align: center;
      color: #CCCCCC;
      .iconfont{
        font-size: 50px;
      }
      .footer-title {
        margin-top: 10px;
        font-size: 26px;
      }
    }
    .active{
      color: #4A7FE8;
    }
  }
</style>
