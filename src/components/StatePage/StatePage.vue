<template>
  <div class="state-page">
    <div class="main">
      <div class="main-img" :class="{'is-not-found': isNotFound, 'service-error': !isNotFound}"></div>
      <div class="tip-text">{{tipText}}</div>
      <div class="go-home" @click="goHome">返回首页</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatePage',
  data () {
    return {
      isNotFound: false,
      tipText: '糟糕！当前页面错误！'
    }
  },
  created () {
    if (this.$router.currentRoute && this.$router.currentRoute.query !== undefined) {
      if (Number(this.$router.currentRoute.query.errorType) === 404) {
        this.isNotFound = true
        this.tipText = '糟糕！当前页面错误！'
      } else {
        this.isNotFound = false
        this.tipText = '糟糕！当前服务器页面故障！'
      }
    }
  },
  methods: {
    goHome (e) {
      this.$router.push({path: '/Deal'})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style/base.less';
.state-page{
  display: flex;
  flex: 1;
  background: #f3f4f5;
  .main{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-img{
      width: 300px;
      height: 260px;
    }
    .is-not-found{
      background: url('../../image/not-found.png') no-repeat center center;
      background-size: 100% 100%;
    }
    .service-error{
      background: url('../../image/service-error.png') no-repeat center center;
      background-size: 100% 100%;
    }
    .tip-text{
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      color: #d4d6de;
      text-align: center;
      margin-top: 40px;
      margin-bottom: 98px;
    }
    .go-home{
      width: 650px;
      height: 88px;
      font-size: 30px;
      text-align: center;
      line-height: 88px;
      background: #4d80fd;
      color: #fff;
      border-radius: 70px;
    }
  }
}

</style>
