<template>
   <div class="register">
     <x-header
      @on-click-back="goback()"
      title="注册"
      :left-options="{backText: '', preventGoBack: true}"
    />
    <div class="line"></div>
    <div class="register-con">
      <div class="title">请选择物流公司</div>
      <div class="logistics" @click="selectLogistics()">
        <van-field
          disabled
          v-model="form.logisticsName"
          placeholder="搜索物流公司名称" />
      </div>
      <div class="title">请选择角色</div>
      <div class="role">
        <div class="r-item" :class="{'active': Number(form.roleType) === 1}" @click="changeRole(1)">
          <div class="r-icon">
            <div class="icon-wrap">
              <i class="iconfont icon-shangdian"></i>
            </div>
          </div>
          <div class="r-title">经销商</div>
        </div>
        <div class="r-item" :class="{'active': Number(form.roleType) === 2}" @click="changeRole(2)">
          <div class="r-icon">
            <div class="icon-wrap">
              <i class="iconfont icon-leijianzhuxiulix"></i>
            </div>
          </div>
          <div class="r-title">修理厂</div>
        </div>
      </div>
      <div class="button">
        <div class="b-con" @click="next()">下一步</div>
      </div>
    </div>
   </div>
</template>

<script>
import { XHeader } from 'vux'
import { Field } from 'vant'
export default {
  name: '',
  data () {
    return {
      form: {
        logisticsName: '',
        logisticsId: '',
        roleType: ''
      }
    }
  },
  components: {
    XHeader,
    [Field.name]: Field
  },
  created () {
    let flag = this.$route.query.from
    if (flag === 'selectRole') {
      let logisticsForm = this.$route.query.logisticsForm
      this.form.logisticsName = logisticsForm.logisticsName
      this.form.logisticsId = logisticsForm.logisticsId
      this.form.roleType = logisticsForm.roleType
    }
  },
  methods: {
    goback () {
      this.$router.push({name: 'Login'})
    },
    selectLogistics () {
      this.$router.push({name: 'SearchRegisterLogistics', query: {logisticsForm: this.form}, from: 'selectRole'})
    },
    changeRole (val) {
      this.form.roleType = val
    },
    next () {
      this.$router.push({name: '', query: {logisticsForm: this.form}, from: 'selectRole'})
      debugger
    }
  }
}
</script>

<style lang="less" scope>
.register {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff !important;
  .register-con {
    width: 100%;
    height: 100%;
    padding: 40px;
    .title {
      width: 100%;
      height: 80px;
      line-height: 80px;
      font-size: 32px;
      color: #aaa;
    }
    .logistics {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
    }
    .role {
      width: 100%;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20px;
      .r-item {
        width: 240px;
        height: 280px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .r-icon {
          height: 200px;
          width: 220px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-wrap {
            width: 180px;
            height: 180px;
            line-height: 180px;
            text-align: center;
            border-radius: 90px;
            background-color: rgba(102,102,102,.7);
          }
          i {
            font-size: 110px;
            color: #fff;
          }
        }
        .r-title {
          height: 60px;
          width: 100%;
          line-height: 60px;
          text-align: center;
          font-size: 32px;
        }
      }
      .r-item.active {
        border: 3px solid #0066FF;
        border-radius: 10px;
        background-color: rgba(170,170,170,.1);
        .r-icon {
          .icon-wrap {
            background: #0066FF;
          }
        }
        .r-title {
          color: #4D7BFE;
        }
      }
    }
    .b-con {
      width: 660px;
      height: 80px;
      background: #fff;
      margin: 100px auto 0px;
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

<style scope lang="less">
@import '~vux/src/styles/1px.less';
@import '../../style/base.less';
.register{
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
  .van-cell {
    height: 80px;
    border: 2px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    .van-cell__value--alone {
      height: 100%;
    }
    .van-field__body {
      height: 100%;
      .mixin-sc(28px;#24282E);
      .van-field__control:disabled {
        color: #24282E;
      }
      input {
        height: 50px;
        width: 100%;
        line-height: 50px;
        display: inline-block;
      }
      /* WebKit browsers */
      input::-webkit-input-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Mozilla Firefox 19+ */
      input::-moz-placeholder {
        .mixin-sc(28px;#676767);
      }
      /* Internet Explorer 10+ */
      input:-ms-input-placeholder {
        .mixin-sc(28px;#676767);
      }
    }
  }
}
</style>
