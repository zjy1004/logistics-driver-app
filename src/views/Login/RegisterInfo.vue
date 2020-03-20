<template>
  <div class="RegisterInfo">
    <x-header
      title="填写注册信息"
      :left-options="{backText: ''}"
    />
    <div class="line"></div>
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="form.username"
          required
          :error = this.formRuls.usernamewarm
          clearable
          label="企业名称"
          placeholder="请输入企业名称"
        />
       </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.username"
          required
          clearable
          label="联系人"
          placeholder="请输入联系人"
        />
       </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.username"
          required
          clearable
          label="联系电话"
          placeholder="请输入联系电话"
        />
       </van-cell-group>
       <van-cell-group>
          <van-field
            v-model="form.sms"
            required
            center
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
          >
            <van-button slot="button" size="small" type="primary" @click="getCode" v-if="!timeShow">获取验证码</van-button>
            <span  slot="button"  v-if="timeShow">{{timeNum}}秒后重新获取</span>
          </van-field>
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.username"
            required
            clearable
            label="登录账号"
            placeholder="请输入登录账号"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.username"
            required
            clearable
            label="登录密码"
            placeholder="请输入登录密码"
          />
        </van-cell-group>
        <van-cell-group>
          <x-address class="addressCss" title="经营区域" v-model="form.businessAreaCodeData" placeholder='请选择经营区域' :list="addressData"></x-address>
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.username"
            required
            clearable
            label="详细地址"
            placeholder="请输入详细地址"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.username"
            clearable
            label="邀请码"
            placeholder="请输入邀请码"
          />
        </van-cell-group>

      <div class="button">
        <div class="b-con" @click="submit(form)">立即注册</div>
      </div>
    </div>
    <van-area
      v-show="areaShow"
      :area-list="areaList"
      @cancel="cancelArea"
      @confirm="confirmArea"
    />
  </div>
</template>

<script>
import { XHeader, XAddress } from 'vux'
import { CellGroup, Field, AddressEdit, Area, Button } from 'vant'
import PayRegisterAjax from '@/api/PayRegister/PayRegister'

export default {
  name: 'RegisterInfo',
  data () {
    return {
      timeShow: false,
      areaShow: false,
      timeNum: '',
      form: {
        username: '',
        sms: '',
        area: ''
      },
      formRuls: {},
      addressData: [],
      areaList: {
        province_list: {
          110000: '北京市',
          120000: '天津市'
        },
        city_list: {
          110100: '北京市',
          110200: '县',
          120100: '天津市',
          120200: '县'
        },
        county_list: {
          110101: '东城区',
          110102: '西城区',
          110105: '朝阳区',
          110106: '丰台区',
          120101: '和平区',
          120102: '河东区',
          120103: '河西区',
          120104: '南开区',
          120105: '河北区'
          // ....
        }
      }
    }
  },
  components: {
    XHeader,
    XAddress,
    [Field.name]: Field,
    [AddressEdit.name]: AddressEdit,
    [Area.name]: Area,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
  created () {
    this.queryArea()
  },
  methods: {
    submit (val) {
      let arr = []
      for (let key in val) {
        if (val[key] === '') {
          arr.push(key + 'warm')
        }
      }
      let obj = {}
      arr.forEach(item => {
        obj[item] = true
      })
      this.formRuls = obj
      console.log(obj, '234')
    },
    changeArea () {
      this.areaShow = true
    },
    cancelArea () {
      this.areaShow = false
    },
    confirmArea () {

    },
    getCode () {
      this.getCountDown()
    },
    getCountDown () { // 倒计时
      const TIME_COUNT = 5
      if (!window.timer) {
        this.timeNum = TIME_COUNT
        this.timeShow = true
        window.timer = setInterval(() => {
          if (this.timeNum > 0 && this.timeNum <= TIME_COUNT) {
            this.timeNum--
          } else {
            this.timeShow = false
            clearInterval(window.timer)
            window.timer = null
          }
        }, 1000)
      }
    },
    queryArea () { // 获取区域
      PayRegisterAjax.queryArea().then(res => {
        if (res.code === 200) {
          this.addressData = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.RegisterInfo {
  display: flex;
  flex: 1;
  //background: #FFF;
  flex-direction: column;
  .main {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-top: 20px;
  }
  .button {
    .b-con {
      width: 660px;
      height: 80px;
      background: #fff;
      margin: 20px auto 0px;
      background: #4d64fd;
      color: #fff;
      border-radius: 40px;
      line-height: 80px;
      text-align: center;
      font-size: 32px;
    }
  }
}
</style>

<style lang="less" scope>
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.RegisterInfo{
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
  .vux-cell-box {
    height: 80px;
    line-height: 80px;
    .weui-cell {
      height: 80px;
      line-height: 80px;
    }
    .weui-label {
      padding-left: 40px;
    }
  }
  .van-cell-group {
    height: 80px;
    line-height: 80px;
  }
  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }
  .van-cell {
    height: 80px;
    line-height: 80px;
    padding: 0 40px;
    border-bottom: 1px solid rgba(229,229,229,1);
  }
  .van-cell__title {
    min-width: 150px;
  }
  .van-cell--required::before {
    left: 20px;
  }
  .weui-label::before {
content: '*';
    position: absolute;
    left: 20px;
    font-size: 14px;
    color: #f44;
  }
  .addressCss {
    .vux-popup-picker-select {
      text-align: left;
    .vux-popup-picker-value .vux-cell-value {
      margin-left: 20px;
    }
    }
  }
}
</style>
