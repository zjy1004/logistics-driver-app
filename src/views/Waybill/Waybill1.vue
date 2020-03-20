<template>
   <div class="waybill">
      <div class="c-header">全部运单</div>
      <!-- 有运单 -->
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh" v-if="waybillListData.length > 0" class="content">
        <div class="c-waybill">
          <div class="c-title">
            最近运单
          </div>
          <ul class="c-w-wrap">
            <li @click="handleDetail(item.waybillId)" class="c-w-item" :key="index" v-for="(item, index) in waybillListData.slice(0, 3)" >
              <div class="item-top">
                <div class="name">
                  {{item.receiveClientName}}
                </div>
                <div class="status">
                  {{item.waybillStatus}}
                </div>
              </div>
              <div class="item-bottom">
                <div>
                  <span class="time">开单日期:</span>
                  <span class="time">{{item.createTime}}</span>
                </div>
                <div>
                  <span class="time">代收金额:</span>
                  <span class="money">￥{{item.receivableGoods}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="waybillListData.length > 3" class="c-w-more">
            <span class="a" @click="handleMore()">查看更多运单 ></span>
          </div>
        </div>
      </van-pull-refresh>
      <!-- 无运单 -->
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh" v-if="waybillListData.length === 0" class="noBill">
        <div class="imgWrap">
          <img src="../../image/noInfo.png" alt="">
        </div>
      </van-pull-refresh>
    <footer-bar />
   </div>
</template>

<script type="text/ecmascript-6">
import FooterBar from '@/components/FooterBar/FooterBar'
import WaybillAjax from '@/api/WayBill/WayBill'
import { PullRefresh } from 'vant'
export default {
  name: 'Waybill',
  components: { FooterBar, [PullRefresh.name]: PullRefresh },
  data () {
    return {
      isLoading: false,
      waybillQueryParam: {
        // createTimeEnd: '',
        // createTimeStart: '',
        waybillStatus: ''
      },
      waybillListData: []
    }
  },
  methods: {
    // 更多运单
    handleMore () {
      this.$router.push({name: 'MoreWaybill'})
    },
    // 下拉刷新
    waybillRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.getWaybill()
        this.isLoading = false
      }, 500)
    },
    // 运单详情
    handleDetail (id) {
      this.$router.push({name: 'WaybillDetail', query: {id: id}})
    },
    // 获取所有运单
    getWaybill () {
      WaybillAjax.AllWaybill(this.waybillQueryParam).then(res => {
        if (res.code === 200) {
          this.waybillListData = res.data
          this.waybillListData.map(item => {
            // 运单状态
            switch (item.waybillStatus) {
              case 1:
                item.waybillStatus = '已装车'
                break
              case 2:
                item.waybillStatus = '运输中'
                break
              case 3:
                item.waybillStatus = '已签收'
                break
              case 4:
                item.waybillStatus = '已拒签'
                break
              case 5:
                item.waybillStatus = '已完成'
                break
              case 6:
                item.waybillStatus = '已取消'
                break
              case 9:
                item.waybillStatus = '待入库'
                break
              case 10:
                item.waybillStatus = '待退货'
                break
              case 11:
                item.waybillStatus = '待装车'
                break
              default:
                break
            }
          })
        }
      })
    }
  },
  created () {
    this.getWaybill()
  }
}
</script>

<style scoped lang="less">
.waybill {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .c-header {
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 36px;
      color: #24282E;
      font-weight: 500;
      background:rgba(255,255,255,1);
    }
    .van-pull-refresh {
      height: 100%;
      overflow: auto;
     /deep/ .van-pull-refresh__track {
        height: 100%;
      }
    }
    /deep/ .van-pull-refresh__text {
        font-size: 28px;
      }
    /deep/ .van-pull-refresh__loading span{
        font-size: 28px;
      }
  .content {
    height:100%;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    .c-title {
      height: 70px;
      font-size: 32px;
      line-height: 70px;
      padding: 0 15px;
    }
    .c-waybill {
      height: 100%;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      flex: 1;
      .c-w-wrap {
        height: 660px;
        width: 100%;
        overflow: hidden;
        .c-w-item {
          height: 200px;
          width: 100%;
          margin-bottom: 20px;
          .item-top {
            height: 80px;
            display: flex;
            align-items: center;
            padding: 0 40px;
            justify-content: space-between;
            background:#F7F9FC;
            .name {
              font-size: 30px;
              color: #24282E;
              font-weight: 500;
            }
            .status {
              font-size: 30px;
              color: #F57017;
              font-weight: 400;
            }
          }
          .item-bottom {
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            justify-content: space-around;
            background:#FFFFFF;
            padding: 0 40px;
            .time {
              color: #565C66;
              font-size: 26px;
              font-weight: 400;
            }
            .money {
              color: #3573EE;
              font-size: 26px;
              font-weight: 500;
            }
          }
        }
      }
      .c-w-more {
        height: 75px;
        width: 100%;
        margin-top: 50px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .a {
          color: #3573EE;
          font-size: 28px;
        }
      }
    }
  }
  .noBill {
    width: 100%;
    height: 100%;
    background: #FFF;
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;
    .imgWrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      img {
        width: 290px;
        height: 220px;
      }
      .msg {
        margin-top: 35px;
        font-size: 24px;
        width: auto;
        text-align: center;
        color: #D4D6DE;
      }
    }
  }
  .footer {
    height: 120px;
    width: 100%
  }
}
</style>
