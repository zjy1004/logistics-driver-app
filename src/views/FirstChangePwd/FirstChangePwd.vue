<template>
   <div class="changePwd">
    <div class="title">
      首次登录请修改密码
    </div>
    <div class="hint">
      密码为6-16位，仅支持数字和字母间的组合
    </div>
    <div class="pass">
      <input type="password" v-model="form.newPass" placeholder="请输入新密码">
    </div>
     <div class="submit-con1">
      <div class="submit-con" @click="confirm()">确认</div>
    </div>
   </div>
</template>

<script type="text/ecmascript-6">
import ChangePwdAjax from '@/api/changePwd/changePwd'
export default {
  name: '',
  data () {
    return {
      form: {
        oldPass: '123456',
        newPass: ''
      },
      firstLogin: ''
    }
  },
  components: {},
  methods: {
    confirm () {
      if (this.form.newPass === '') {
        this.$vux.toast.show({
          type: 'warn',
          text: '密码不能为空'
        })
      } else if (this.form.newPass.length < 6 || this.form.newPass.length > 16) {
        this.$vux.toast.show({
          type: 'warn',
          text: '新密码长度在6到16个字符'
        })
      } else if (this.form.newPass === this.form.oldPass) {
        this.$vux.toast.show({
          type: 'warn',
          text: '新密码不能与初始化密码相同'
        })
      } else {
        let userInfoObj = JSON.parse(sessionStorage.getItem('userInfo'))
        this.firstLogin = userInfoObj.firstLogin
        if (this.firstLogin === 0) {
          ChangePwdAjax.ChangePwd(this.form).then(res => {
            if (res.code === 200) {
              this.$vux.toast.show({
                type: 'success',
                text: '修改成功'
              })
              setTimeout(() => {
                this.$router.push({name: 'Deal'})
              }, 500)
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.changePwd {
  margin-top: 130px;
  width: 100%;
  height: 100vh;
  padding: 0 40px;
  .title {
    font-size:46px;
    font-weight:500;
    color:rgba(26,26,26,1);
    line-height:75px;
  }
  .hint {
    margin-top: 70px;
    font-size:30px;
    font-weight:500;
    color:rgba(64,64,64,1);
    line-height:42px;
  }
  .pass {
    margin-top: 145px;
    height: 80px;
    width: 100%;
    input{
      // width: 600px;
      width: 100%;
      height: 80px;
      outline: none;
      border: none;
      font-size: 28px;
      margin: 0;
      padding: 0;
      // text-indent: 60px;
      font-size: 28px;
      border-bottom: 1px solid rgba(229,229,229,1);
    }
  }
  .submit-con{
    width: 668px;
    height: 88px;
    background: #fff;
    margin: 200px auto 0px;
    background: #4d64fd;
    color: #fff;
    border-radius: 44px;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
  }
  .submit-con1{
    flex: 1;
    background: #fff;
  }
}
</style>
