
<template>
  <div class="editPsd">
    <x-header
      title="设置"
      :left-options="{backText: ''}"
    />
    <div class="line"></div>
    <div style="margin: 0 auto;">
      <p class="findPsd">修改密码</p>
      <div class="main">
        <h5>旧密码</h5>
        <input type="password" v-model="form.oldPass" placeholder="请输入旧密码">
      </div>
      <div class="main">
        <h5>新密码</h5>
        <input type="password" v-model="form.newPass" placeholder="请输入新密码">
      </div>
      <div class="btn_f">
        <span class="sureBtn" @click="sure()">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAjax from '@/api/Login/Login'

import { XHeader } from 'vux'
export default {
  name: 'editPsd',
  data () {
    return {
      form: {
        oldPass: '',
        newPass: ''
      }
    }
  },
  components: {
    XHeader
  },
  created () {
  },
  methods: {
    sure () {
      if (this.form.oldPass === '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入旧密码'
        })
      } else if (this.form.oldPass !== '') {
        if (this.form.newPass === '') {
          this.$vux.toast.show({
            type: 'warn',
            text: '请输入新密码'
          })
        } else {
          if (this.form.newPass.length < 6 || this.form.newPass.length > 16) {
            this.$vux.toast.show({
              type: 'warn',
              text: '新密码长度在 6 到 16 个字符'
            })
          } else {
            this.updatePsd(this.form)
          }
        }
      }
    },
    updatePsd (val) {
      LoginAjax.updatePsd(val).then(res => {
        if (res.code === 200) {
          this.$router.back(-1)
          this.$vux.toast.show({
            type: 'success',
            text: '密码修改成功'
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: res.message
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
.editPsd{
  display: flex;
  flex: 1;
  background: #fff!important;
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

  .line {
    width: 100%;
    background-color: rgba(229,229,229,1);
    height: 2px;
  }

  .findPsd {
    width: 100%;
    height: 154px;
    line-height: 154px;
    padding-left: 40px;
    font-size:46px;
    color: #1A1A1A;
    margin: 20px 0;
  }

  .main {
    width: 100%;
    height: 150px;
    padding: 0 40px;
    h5 {
    height:28px;
    line-height: 28px;
    font-size:30px;
    }
      input{
      width: 600px;
      height: 80px;
      outline: none;
      border: none;
      margin: 0;
      padding: 0;
      font-size: 28px;
      border-bottom: 1px solid rgba(229,229,229,1);
    }
  }
  .btn_f {
    text-align: center;
  }
  .sureBtn {
    display: inline-block;
    width:668px;
    height:88px;
    text-align: center;
    line-height: 88px;
    font-size:32px;
    color: #fff;
    font-weight: bold;
    background:linear-gradient(90deg,rgba(77,100,253,1),rgba(77,128,253,1));
    border-radius:44px;
    margin-top: 200px;
  }
}
</style>
