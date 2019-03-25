<template>
  <div class="common-header">
    <div class="user" @click="clickSetting">
      <span class="user-icon"></span>
      <!-- <i class="iconfont icon-yonghu"></i> -->
    </div>
    <div class="logo-con">
      <div class="logo"></div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vux'
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '',
      userName: '',
      dialogVisible: false
    }
  },
  components: {
    Icon
  },
  created () {

  },
  methods: {
    clickSetting (e) {
      this.$emit('click-user-icon', true)
    },
    logOut () {
      sessionStorage.removeItem('token')
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style/base.less';
.common-header{
  height: 80px!important;
  display: flex;
  flex-direction: row;
  background: #fff!important;
  .user{
    width: 90px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    // i{
    //   width: 50px;
    //   height: 50px;
    //   .mixin-sc(50px;#333);
    // }
    .user-icon{
      display: inline-block;
      width: 48px;
      height: 48px;
      background: url('../../image/user1.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }
  .logo-con{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    .logo{
      width: 127px;
      height: 36px;
      background: url('../../image/logo-new.png') no-repeat center center;
      margin-right: 40px;
      background-size: 100% 100%;
    }
  }
}

</style>
