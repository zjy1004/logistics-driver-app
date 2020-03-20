
<template>
  <div class="waybillDetail">
    <x-header
      title="运单详情"
      :left-options="{backText: ''}"
    />
    <div class="cells-wrap">
      <van-pull-refresh v-model="isLoading" @refresh="waybillRefresh">
        <div class="cells">
          <div class="cell">
            <div class="left">收货方</div>
            <div class="right">{{waybillDetailObj.receiveClientName}}</div>
          </div>
          <div class="cell">
            <div class="left">运输状态</div>
            <div class="right">{{waybillDetailObj.waybillStatusName}}</div>
          </div>
          <div class="cell" v-if="waybillDetailObj.withdrawStatus !== null">
            <div class="left">提现状态</div>
            <div class="right" v-if = "waybillDetailObj.withdrawStatus === '已提现'" :class="{'goToDetail':waybillDetailObj.withdrawStatus === '已提现'}" @click="goToDetail(waybillDetailObj.waybillId)">{{waybillDetailObj.withdrawStatus}}<span> > </span></div>
            <div class="right" v-if = "waybillDetailObj.withdrawStatus !== '已提现'">{{waybillDetailObj.withdrawStatus}}</div>
          </div>
        </div>
        <div class="cells">
          <div class="cell">
            <div class="left">代收货款</div>
            <div class="right">￥{{waybillDetailObj.receivableGoods || 0}}</div>
          </div>
          <div class="cell">
            <div class="left">货款手续费</div>
            <div class="right">￥{{waybillDetailObj.goodsPoundage || 0}}</div>
          </div>
          <div class="cell">
            <div class="left">实收货款</div>
            <div class="right">￥{{waybillDetailObj.actualPaymentGoods || 0}}</div>
          </div>
          <div class="cell">
            <div class="left">运费金额</div>
            <div class="right">￥{{waybillDetailObj.freight || 0}}</div>
          </div>
          <div class="cell">
            <div class="left">运费付款方</div>
            <div class="right">{{waybillDetailObj.freightPayer}}</div>
          </div>
        </div>
        <div class="cells">
          <div class="cell">
            <div class="left">物流公司</div>
            <div class="right">{{waybillDetailObj.logisticsCompany}}</div>
          </div>
          <div class="cell">
            <div class="left">运单号</div>
            <div class="right">{{waybillDetailObj.waybillNumber}}</div>
          </div>
          <div class="cell">
            <div class="left">配送司机</div>
            <div class="right">{{waybillDetailObj.driver}}</div>
          </div>
          <div class="cell">
            <div class="left">联系电话</div>
            <div class="right">
              <a class="iphoneA" v-if="isIos" :href="'tel://'+waybillDetailObj.driverPhone">{{waybillDetailObj.driverPhone}}</a>
              <a v-else @click="clickService(waybillDetailObj.driverPhone)">{{waybillDetailObj.driverPhone}}</a>
            </div>
          </div>
        </div>
        <div class="cells">
          <div class="img-cell">
            <div class="img-left">签收照片</div>
            <div class="img-right">
              <div class="img-wrap" v-for="(item, index) in imgPreview" :key="index" @click="clickImg(item, index)"><img :src="item"></div>
            </div>
          </div>
        </div>
        <div class="cells" v-if="waybillDetailObj.waybillDeliveryType !== 1">
          <div class="cell">
            <div class="left">途径线路</div>
            <div class="right">{{waybillDetailObj.routerName}}</div>
          </div>
        </div>
        <div class="cells" v-if="receiptInfoList.length > 0">
          <div class="cell receiptTitle">
            <div class="receiptTitle-left">收款信息调整</div>
            <div class="right"></div>
          </div>
        </div>
        <div class="receipt" v-if="receiptInfoList.length > 0">
          <div class="cells receipt-con" v-for="(item, index) in receiptInfoList" :key="index">
            <div class="cell">
              <div class="left">修改内容</div>
              <div class="right">{{item.feeType}}</div>
            </div>
            <div class="cell">
              <div class="left">付款方</div>
              <div class="right">{{item.payerName}}</div>
            </div>
            <div class="cell">
              <div class="left">应收</div>
              <div class="right">￥{{item.oldValue}}</div>
            </div>
            <div class="cell">
              <div class="left">修改后金额</div>
              <div class="right">￥{{item.newValue}}</div>
            </div>
            <div class="cell">
              <div class="left">变更差额</div>
              <div class="right">￥{{item.changeBalance}}</div>
            </div>
            <div class="cell">
              <div class="left">修改时间</div>
              <div class="right">{{item.createTime}}</div>
            </div>
            <div class="cell">
              <div class="left">备注</div>
              <div class="right">{{item.remark}}</div>
            </div>
          </div>
        </div>
        <div class="cells track" v-if="trackList && trackList.length > 0">
          <div class="track-con">
            <div class="item-con" :key="index" v-for="(item, index) in trackList">
              <div class="left-item" :class="{'first-left-item': index === 0,'last-left-item': index === (trackList.length - 1)}">
                <div class="circle"></div>
                <div class="line" v-show="trackList && trackList.length > 1"></div>
              </div>
              <div class="right-item">
                <div class="status-row">{{item.statusRow}}（{{item.operateTime}}）</div>
                <div class="detail-row" :class="{'first-left-item': index === 0}">{{item.operate}}</div>
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <van-image-preview
      v-model="imgPreviewShow"
      :images="imgPreview"
      :start-position="preViewIndex"
      show-indicators="true"
      >
    </van-image-preview>
  </div>
</template>

<script>
// import { PullRefresh, ImagePreview } from 'vant'
import { PullRefresh } from 'vant'
import { XHeader } from 'vux'
import ENUMS from '@/enums/enums'
import WaybillAjax from '@/api/WayBill/WayBill'
export default {
  name: 'WaybillDetail',
  data () {
    return {
      imgPreviewShow: false,
      preViewIndex: 0,
      ImagePreviewDialog: '',
      imgPreview: [
        '../../../static/android.png',
        '../../../static/login-bg.png',
        '../../../static/android.png'
      ],
      waybillID: '',
      telNum: '',
      isIos: true,
      isLoading: false,
      waybillDetailObj: {
        sendClientName: '', // 发货方
        waybillStatusName: '', // 运输状态
        packageNameFirst: '', // 货品名称
        packageQuantity: '', // 包裹数量
        receivableGoods: '', // 货款金额
        freight: '', // 运费金额
        freightPayer: '', // 运费付款方
        logisticsCompany: '', // 物流公司
        waybillNumber: '', // 运单号
        driver: '', // 配送司机
        driverPhone: '', // 联系电话
        route: ''
      },
      receiptInfoList: [],
      trackList: []
    }
  },
  components: {
    XHeader,
    [PullRefresh.name]: PullRefresh
  },
  // beforeRouteLeave (to, from, next) {
  //   this.ImagePreviewDialog.close()
  //   next()
  // },
  created () {
    let phoneType = this.getPhoneInfo()
    if (phoneType !== 'iPhone') {
      this.isIos = false
    }
    this.queryDetail(this.$route.query.id)
    this.waybillID = this.$route.query.id
  },
  methods: {
    ImagePreview () {
    },
    clickImg (img, index) {
      this.preViewIndex = index
      this.imgPreviewShow = true
      // this.imagePreviewDialog = ImagePreview({
      //   images: this.imgPreview,
      //   startPosition: index,
      //   onClose () {
      //   }
      // })
    },
    goToDetail (val) {
      this.$router.push({name: 'CashWithdrawalDetail', query: {waybillId: val}})
    },
    toAndroid () {
      try {
        window.android.callPhone(this.telNum)
      } catch (error) {
        console.log(error)
      }
    },
    // 安卓点击客服
    clickService (val) {
      this.telNum = val
      this.toAndroid()
    },
    waybillRefresh () {
      setTimeout(() => {
        this.$vux.toast.show({
          type: 'success',
          text: '刷新成功！'
        })
        this.queryDetail(this.$route.query.id)
        this.isLoading = false
      }, 500)
    },
    queryDetail (id) {
      WaybillAjax.QueryDetail({waybillId: id}).then(res => {
        if (res.code === 200) {
          let { data } = res
          if (data.waybillFeeUpdateRecordVoList !== null && data.waybillFeeUpdateRecordVoList.length > 0) {
            this.receiptInfoList = data.waybillFeeUpdateRecordVoList.map(item => {
              if (item.payer === 1) {
                item.payerName = '发货方'
              } else if (item.payer === 2) {
                item.payerName = '收货方'
              } else {
                item.payerName = ''
              }
              return item
            })
          } else {
            this.receiptInfoList = []
          }
          this.waybillDetailObj = {...data}
          ENUMS.waybillStatus.forEach(status => {
            if (status.id === data.waybillStatus) {
              this.waybillDetailObj.waybillStatusName = status.name
            }
          })
          ENUMS.withdrawStatus.forEach(li => {
            if (li.id === data.withdrawStatus) {
              this.waybillDetailObj.withdrawStatus = li.name
            }
          })
          this.trackList = data.waybillTransportInfoList && data.waybillTransportInfoList.map(item => {
            ENUMS.operateType.forEach(status => {
              if (status.id === item.operateType) {
                item.statusRow = status.name
              }
            })
            return item
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.waybillDetail {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background: #fff!important;
  flex-direction: column;
  .van-pull-refresh{
    overflow-y: scroll;
    /deep/ .van-pull-refresh__track {
      height: 100%;
    }
  }
  /deep/ .van-pull-refresh__text {
    font-size: 28px!important;
  }
  /deep/ .van-pull-refresh__loading span{
    font-size: 28px!important;
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
  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }
  .cells-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;

    .cells {
      width: 100%;
      height: auto;
      // margin-bottom: 10px;
      border-top: 2px solid #ccc;
      .receiptTitle {
        background-color: #ccc;
        width: 100%;
        .receiptTitle-left {
          color: #222;
          font-size: 32px;
        }
      }
      .cell {
        height: 70px;
        width: 100%;
        display: flex;
        padding: 0 40px;
        align-items: center;
        justify-content: space-between;
        .left {
          color: #2C2E33;
          font-size: 30px;
        }
        .right {
          color: #000;
          font-size: 30px;
          a{
            .mixin-sc(30px;#3573EE);
          }
        }
        .goToDetail {
          color: #3573EE !important;
        }
        .r-detail {
          color: #3573EE;
          font-size: 30px;
        }
        .r-detailNO {
          color: #999;
          font-size: 30px;
        }
      }
      .img-cell {
        height: 210px;
        width: 100%;
        display: flex;
        padding: 0 40px;
        display: flex;
        // align-items: center;
        // justify-content: space-between;
        .img-left {
          height: 70px;
          line-height: 70px;
          color: #2C2E33;
          font-size: 30px;
        }
        .img-right {
          height: 210px;
          line-height: 210px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          color: #000;
          font-size: 30px;
        }
        .img-wrap {
          width: 150px;
          height: 150px;
          margin-left: 20px;
          border-radius: 10px;
          border: 2px dashed #aaa;
          img {
            height: 100%;
            width: 100%;
            border-radius: 10px;
          }
        }
      }
    }
    .receipt {
      width: 100%;
      height: auto;
      .receipt-con {
        height: 490px;
      }
    }
    .track{
      display: flex;
      min-height: 40px;
      .track-con{
        display: flex;
        height: auto;
        flex-direction: column;
        padding: 20px 0px;
        width: 100%;
        .item-con{
          width: 100%;
          min-height: 110px;
          display: flex;
          flex-direction: row;
          .left-item{
            width: 80px;
            min-height: 100%;
            position: relative;
            .line{
              position: absolute;
              left: 50%;
              margin-left: -1px;
              width: 2px;
              height: 100%;
              // min-height: 110px;
              background: rgb(204,204,204);
            }
            .circle{
              position: absolute;
              z-index: 2;
              top: 50%;
              left: 50%;
              margin-left: -15px;
              margin-top: -15px;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: rgb(204,204,204);
            }
          }
          .first-left-item{
            color: rgb(0,153,255)!important;
            .circle{
              background: rgb(0,153,255);
            }
            .line{
              position: absolute;
              height: 50%;
              left: 50%;
              bottom: 0px;
            }
          }
          .last-left-item{
            .line{
              position: absolute;
              height: 50%;
              left: 50%;
              top: 0px;
            }
          }
          .right-item{
              width: 100%;
              min-height: 110px;
              height: auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
              // padding: 20px 0px 10px 0px;
            .status-row,.detail-row{
              width: 100%;
              min-height: 40px;
              line-height: 40px;
              .mixin-sc(28px;#1A1A1A);
            }
          }
        }
      }
    }
  }
}
</style>
