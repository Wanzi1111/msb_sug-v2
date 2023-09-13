<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
      <div class="user_form">
        <div class="title-content">
          <img :src="logo" alt="">
          <h3 class="title">客服平台</h3>
        </div>
        <div class="form_box">
          <el-form-item prop="mobile">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="mobile"
              v-model="loginForm.mobile"
              placeholder="手机号"
              name="mobile"
              type="text"
              maxlength="11"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="lock" />
              <!--<svg-icon icon-class="token" />-->
            </span>
            <el-input
              ref="password"
              v-model="loginForm.password"
              class="code_val"
              placeholder="密码"
              name="password"
              type="password"
              maxlength="20"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <!--<div class="get_code">获取验证码</div>-->
          <nocaptcha
            :appkey="'FFFF0N0000000000A148'"
            :scene="'nc_login'"
            :lang="'cn'"
            @callback="getToken"
          />
        </div>
        <el-button class="user_btn" :disabled="!loginFlag" :loading="loading" type="primary" @click.native.prevent="handleLogin">登&emsp;录</el-button>
      </div>
    </el-form>
    <div class="copyright">
      <span>Powered by </span>
      <svg-icon icon-class="copyright" />
      <span> 2020 MEISHUBAO.COM</span>
    </div>
    <canvas id="appBackDrop" ref="appBackDrop" />
  </div>
</template>

<script>
import logo from '@/assets/images/msb-transparent.png'
import nocaptcha from 'vue-nocaptcha/lib/nocaptcha_pc.js'

export default {
  name: 'Login',
  components: { nocaptcha },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (value.length < 11 || value.length > 11) {
        callback(new Error('手机号需11位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      logo: logo,
      loginForm: {
        mobile: '',
        password: ''
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      loginFlag: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    console.log(this.$store)
  },
  mounted() {
    this.backdrop = this.$refs['appBackDrop']
    document.body.insertBefore(this.backdrop, document.getElementById('app'))
    require(`@/assets/backdrops/0${Math.floor(Math.random() * 5) + 1}`)
    if (this.loginForm.mobile === '') {
      this.$refs.mobile.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
    document.body.removeChild(this.backdrop)
    this.loading = false
  },
  methods: {
    getToken(e) {
      this.loginFlag = true
      // delete e.nc
      // Object.assign(this.loginForm, e)
    },
    handleLogin() {
      if (this.loginFlag) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #ddd;
$cursor: #ddd;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 25px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      border-bottom: 1px solid #484848;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
      &:focus {
        border-color: #65b1f7;
      }
    }
  }

}
</style>

<style lang="scss" scoped>
/deep/ .nc_wrapper {
  margin: 0 auto;
  margin-bottom: 30px;
  width: 336px !important;
}
/deep/ .nc-container .nc_scale span{
  height: 34px;
}

#appBackDrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
}
//$bg: -webkit-linear-gradient(bottom, #005bea, #00c6fb);
$bg: #000;
$dark_gray: #DDD;
$light_gray: #DDD;

.login-container {
  min-height: 100vh;
  width: 100%;
  background: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    height: 400px;
    max-width: 100%;
    padding: 0 50px;
    margin: 120px auto 0;
    /*background-color: rgba(255,255,255,.15);*/
    border-radius: 10px;
    display: flex;
    align-items: center;
    // border: 1px solid rgba(255,255,255,.1);

    .user_logo {
      flex: 1;
      text-align: center;

      img {
        width: 180px;
      }
    }

    .user_form {
      flex: 1;
      text-align: center;
    }
  }

  .form_box {
    margin: 40px auto;
    width: 80%;
    position: relative;
  }

  .get_code {
    position: absolute;
    border: 1px solid #1890ff;
    padding: 8px 10px;
    right: 0;
    top: 70px;
    border-radius: 4px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
    transition: all .35s;
    &:hover {
      border-color: #46a6ff;
      color: #46a6ff;
    }
  }

  .user_btn {
    width: 80%;
    height: 48px;
    font-size: 16px;
    box-shadow: 0 4px 10px #005eea, 0 0 1px #005eea;
  }

  .code_val {
    /deep/ input {
      padding-right: 105px;
    }
  }

  .copyright {
    position: relative;
    color: #76808a;
    text-align: center;
    font-size: 14px;
    margin-top: 20px;
  }

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    position: absolute;
    left: -6px;
    top: 6px;

    .svg-icon {
      font-size: 18px;
    }
  }

  .title-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80px;
    }

    .title {
      margin-left: 10px;
      display: inline-block;
      font-size: 22px;
      color: $light_gray;
      text-align: center;
      font-weight: bold;
      font-family: serif, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    }
  }
}
</style>
