import { Post } from '@/api/axios.config'
const ChangePwdAjax = {
  ChangePwd (params) {
    // 手机端修改密码
    let result = Post('/crm/auth/password/update', params)
    return result
  }
}

export default ChangePwdAjax
