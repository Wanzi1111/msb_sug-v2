<!--
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-15 18:46:34
-->
<template>
  <div class="app-container home-container">
    <p :class="`title ${show ? 'title_illustration' : ''}`">欢迎使用客服平台</p>
    <!--<img class="illustration" src="@/assets/images/c1.png">-->
    <!--<img class="illustration" src="@/assets/images/c2.png">-->
    <!--<img class="illustration" src="@/assets/images/c3.png">-->
    <img v-if="show" class="illustration" src="@/assets/images/c4.png">
    <!--<img class="illustration" src="@/assets/images/c5.png">-->
    <!--    <img v-else class="illustration" src="@/assets/images/c6.png">-->
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      show: true
      // show: parseInt(Math.random()*10) >= 5
    }
  },
  mounted() {
    console.log(this.$route, '======')
  }
}
</script>

<style lang="scss" scoped>
  .home-container {
    padding: 20px;
    margin: 20px;
    height: calc(100% - 40px);
    width: calc(100% - 40px);
    position: absolute;
    display: flex;
    flex-direction: column;
    /*!* justify-content: center;*/
  }
  .title {
    /*text-align: center;*/
    /*font-size: 28px;*/
    /*color: #666666;*/
    /*font-family: serif, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;*/

    text-align: center;
    font-size: 20px;
    color: #333;
    font-family: cursive;
    font-weight: bold;
  }
  .title_illustration {
    color: #6072fb;
  }
  .illustration {
    width: 460px;
    margin: 0 auto;
  }
</style>
