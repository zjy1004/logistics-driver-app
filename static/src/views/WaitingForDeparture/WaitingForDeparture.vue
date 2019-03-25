<template>
  <div class="WaitingForDeparture">
    <div class="haveShifts" v-if="listData.length>0">
      <div class="shifts">
        <van-pull-refresh v-model="recIsLoading" @refresh="recOnRefresh">
          <div class="main">
            <ul>
              <li :class="{'checkedStyle':item.checked === true}" :key="index" v-for="(item,index) in listData" @click="checkItem(item)"><span>{{item.lineName}} - {{item.departureTime}} {{item.temporaryFlag === 1 ? ' (临时)' : ''}}</span></li>
            </ul>
          </div>
        </van-pull-refresh>
      </div>

        <div class="StartLoading">
            <span class="circle" @click="gotoDetail()">
              <div class="text1">开始</div>
              <div class="text2">装车</div>
            </span>
        </div>
      </div>

    <div class="noShifts" v-if="listData.length ===0">
      <van-pull-refresh v-model="noBillRecisLoading" @refresh="noBillRecOnRefresh">
        <div class="bgImage">
        </div>
        <p>本日没有剩余待发车的班次，辛苦啦！</p>
      </van-pull-refresh>
    </div>

  </div>
</template>

<script>
import WaitingForDepartureAjax from '@/api/WaitingForDeparture/WaitingForDeparture'
import { PullRefresh } from 'vant'

export default {
  props: {
    tabValue: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      noBillRecisLoading: false, // 无运单-判断下拉刷新
      recIsLoading: false, // 判断下拉刷新
      listData: [],
      runShiftId: '',
      lineId: '',
      lineTime: ''
    }
  },
  created () {
    this.queryLineRunShiftList()
  },
  watch: {
    listData (newVal, oldVal) {
      // this.runShiftId = newVal[0].runShiftId
      // this.lineTime = newVal[0].departureTime
    },
    tabValue (newVal, oldVal) {
      if (newVal === 3) {
        this.queryLineRunShiftList()
      } else {
        // this.$emit('sendVal', this.runShiftId, this.lineTime)
      }
    }
  },
  methods: {
    checkItem (val) {
      this.listData = this.listData.map((item, index) => {
        if (item.runShiftId === val.runShiftId) {
          item.checked = true
          this.runShiftId = val.runShiftId
          this.lineTime = val.departureTime
          this.lineId = val.lineId
        } else {
          item.checked = false
        }
        return item
      })
    },
    queryLineRunShiftList () {
      WaitingForDepartureAjax.queryLineRunShiftList().then(res => {
        if (res.code === 200) {
          this.listData = res.data.map((item, index) => {
            if (index === 0) {
              item.checked = true
            } else {
              item.checked = false
            }
            return item
          })
          if (res.data.length > 0) {
            this.runShiftId = res.data[0].runShiftId
            this.lineTime = res.data[0].departureTime
            this.lineId = res.data[0].lineId
          }
        }
      })
    },
    gotoDetail () {
      this.$router.push({name: 'ConfirmDepart', query: {runShiftId: this.runShiftId, lineTime: this.lineTime, lineId: this.lineId}})
    },
    // 下拉刷新
    recOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.recIsLoading = false
        this.queryLineRunShiftList()
      }, 500)
    },
    // 无运单-下拉刷新
    noBillRecOnRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.noBillRecisLoading = false
        this.queryLineRunShiftList()
      }, 500)
    }
  },
  components: {
    [PullRefresh.name]: PullRefresh

  }
}
</script>

<style lang="less">
.WaitingForDeparture {
  .van-pull-refresh {
    height: 100%;
    overflow: hidden;
    overflow-x: hidden;
    overflow: scroll;
    padding-right: 10px;
  }
  .van-pull-refresh::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  .van-pull-refresh::-webkit-scrollbar:vertical {
    width: 12px;
  }
  .van-pull-refresh::-webkit-scrollbar:horizontal {
    height: 12px;
  }
  .van-pull-refresh::-webkit-scrollbar-thumb {
    background-color: #9a9a9a;
    border-radius: 10px;
    border: 1px solid #ffffff;
  }
  .van-pull-refresh::-webkit-scrollbar-track {
    border-radius: 10px;
  }
}
</style>

<style lang="less" scoped>
.WaitingForDeparture {
  width: 100%;
  text-align: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  .shifts {
    overflow: auto;
    display: flex;
    flex: 1;
    justify-content: center;
    margin-top: 95px;
  }
  .main {
    width: 600px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  ul {
    width: 600px;
    height: 620px;

    li {
      font-size: 30px;
      font-weight: 500;
      //color: #ffffff;
      color: #737373;
      margin-bottom: 35px;
      //background:rgba(77,117,253,1);
      background:#ffffff;
      border-radius:6px;
      width: 100%;
      height: 95px;
      line-height: 95px;
      span {
        font-size: 30px;
        font-weight: 500;
      }
    }
  }

  .StartLoading {
    width: 100%;
    .circle {
      margin-top: 95px;
      width:169px;
      height:169px;
      background:linear-gradient(158deg,rgba(79,125,254,1),rgba(105,144,254,1));
      border-radius:50%;
      display: inline-block;
      font-weight: bold;
      color: #ffffff;
      .text1 {
        margin-top: 30px;
        font-size: 39px;
      }
      .text2 {
        margin-top: 25px;
        font-size: 39px;
      }
    }
  }

  .checkedStyle {
    background:rgba(77,117,253,1);
    color: #ffffff;
  }

  .noShifts {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 285px;
    align-items: center;
    .bgImage {
      width: 290px;
      height: 220px;
      background: url(../../image/WaitingForDeparture.png) no-repeat;
      background-size: 100% 100%;
    }
    p {
      margin-top: 34px;
      color: #D4D6DE;
      font-size: 24px;
    }
  }

      &::-webkit-scrollbar{
        background-color:yellow;
        width: 20px;
    }
}
</style>
