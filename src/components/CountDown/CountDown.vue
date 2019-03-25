<template>
    <span>{{this.dateVal}}</span>
</template>

<script>
export default {
  props: {
    timeProps: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      dateVal: ''
    }
  },
  created () {
    this.getCountdown()
  },
  methods: {
    getCountdown () {
      var countdownMinute = this.timeProps // 10分钟倒计时
      var startTimes = new Date()// 开始时间
      var endTimes = new Date(startTimes.setMinutes(startTimes.getMinutes() + countdownMinute))// 结束时间
      var curTimes = new Date()// 当前时间
      var surplusTimes = endTimes.getTime() / 1000 - curTimes.getTime() / 1000// 结束毫秒-开始毫秒=剩余倒计时间

      // 进入倒计时
      let countdowns = setInterval(() => {
        surplusTimes--
        var minu = Math.floor(surplusTimes / 60)
        var secd = Math.round(surplusTimes % 60)
        if (secd < 10) {
          secd = '0' + secd
        }
        this.dateVal = minu + ':' + secd
        if (surplusTimes <= 0) {
          clearInterval(countdowns)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
