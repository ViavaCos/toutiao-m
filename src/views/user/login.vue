<template>
  <div>
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="登录"
    ></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        v-model="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
        :error-message="errMsg.mobile"
      />
      <van-field
        @blur="checkCode"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
        :error-message="errMsg.code"
      >
        <van-button class="p5" slot="button" size="mini" type="primary">
          发送验证码
        </van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button @click="login" type="info" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 表格数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 报错信息
      errMsg: {
        mobile: null,
        code: null
      }
    }
  },
  methods: {
    // 手机号校验
    checkMobile () {
      const { mobile } = this.loginForm
      if (!mobile) {
        // 非空判断
        this.errMsg.mobile = '请输入手机号'
        // 因为不能return赋值语句，所以return false
        return false
      }
      const MobileFormat = /^1[3-9]\d{9}$/.test(mobile)
      if (!MobileFormat) {
        // 格式判断
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      // 条件都满足的情况下，去掉提示信息
      this.errMsg.mobile = null
    },
    // 验证码校验
    checkCode () {
      const { code } = this.loginForm
      if (!code) {
        // 非空判断
        this.errMsg.code = '请输入验证码'
        // 因为不能return赋值语句，所以return false
        return false
      }
      const codeFormat = /^\d{6}$/.test(code)
      if (!codeFormat) {
        // 格式判断
        this.errMsg.code = '验证码格式错误'
        return false
      }
      // 条件都满足的情况下，去掉提示信息
      this.errMsg.code = null
    },
    // 登录
    async login () {
      this.checkMobile()
      this.checkCode()
      const { mobile, code } = this.errMsg
      if (!mobile && !code) {
        // 根据是否存在报错信息来实现表单的整体校验
        // alert('登录成功')
        try {
          // 发送登录请求
          const data = await login(this.loginForm)
          // window.console.log(data)
          // 设置token给vuex和本地存储
          this.setToken(data)
          // debugger
          // 页面跳转
          // window.console.log(this)
          this.$router.push(this.$route.query.returnUrl || '/user')
          this.$toast.fail('登录成功')
        } catch (error) {
          // Toast.fail('失败文案');
          this.$toast.fail('登录失败')
        }

        // BUG：捕获不到错误
        // try {
        //   await login(this.loginForm)
        // } catch (error) {
        //   alert(error)
        // }
      }
    },
    ...mapMutations(['setToken'])
  }
}

// 1. 不要忘记给token转成JSON字符串
// 2. 不要忘记在request.js中给你的instance写上return
// 3. 不要忘记给你的user.js中的login函数写上return
// 4. 不要忘记修改完vue.config.js中的代码后重启服务器
</script>

<style scoped lang="less">
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
