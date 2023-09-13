<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" autocomplete="on">
      <div class="user_form">
        <div class="title-content">
          <img :src="logo" alt="">
          <h3 class="title">客服平台</h3>
        </div>
      </div>
    </el-form>
    <p v-if="loading" class="loading-box">
      <i class="el-icon-loading" />
    </p>
    <canvas id="appBackDrop" ref="appBackDrop" />
  </div>
</template>

<script>
import logo from '@/assets/images/msb-transparent.png'
import { MessageBox } from 'element-ui'

export default {
  name: 'SsoLogin',
  data() {
    return {
      logo: logo,
      loading: false,
      redirect: '/'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.backdrop = this.$refs['appBackDrop']
    document.body.insertBefore(this.backdrop, document.getElementById('app'))
    require(`@/assets/backdrops/0${Math.floor(Math.random() * 5) + 1}`)
    this.$nextTick(() => {
        this.handleLogin()
    })
  },
  methods: {
    handleLogin() {
      const { auth_code } = this.$route.query
      if (auth_code) {
        this.loading = true
        this.$store.dispatch('user/ssoLogin', { auth_code })
          .then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((res) => {
            this.loading = false
            // console.log('res', res)
            MessageBox.confirm(
              res,
              '登录失败',
              {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.$router.push({ path: this.redirect || '/' })
              location.reload()
            })
          })
      } else {
        const { VUE_APP_SSO_URL, NODE_ENV, VUE_APP_PRODUCT_URL } = process.env
        let loginUrl = `${VUE_APP_SSO_URL}/login?from=${window.location.href}`
        // 兼容下本地跳转登录
        if (NODE_ENV === 'development') {
          loginUrl += `&productUrl=${VUE_APP_PRODUCT_URL}`
        }
        window.location.href = loginUrl
      }
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
