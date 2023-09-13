<template>
  <div>
    {{ text }}
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ClockTime',
  props: {
    columns: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      timer: null,
      text: ''
    }
  },
  mounted() {
    this.countDown(this.columns)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    countDown(columns) {
      const { ctime } = columns
      // 7天有效期
      const days = (24 * 60 * 60) * 7
      const ctimeTime = moment(ctime && ctime).unix()// 下载的时间
      const utimeTime = days// 7天有效期
      const ceatetime = ctimeTime + utimeTime// 从创建到开始推7天后的时间
      const newtime = moment(new Date()).unix()// 当前的时间
      let ntime = ceatetime - newtime // 时间差
      this.timer = setInterval(() => {
          ntime--
          this.text = this.getMinutes(ntime)
          if (ntime <= 0) {
              this.text = moment(ceatetime * 1000).format('YYYY-MM-DD HH:mm:ss')
              clearInterval(this.timer)
          }
      }, 1000)
    },
    getMinutes(times) {
      let day = 0
      let hour = 0
      let minute = 0
      let second = 0// 时间默认值
      if (times > 0) {
          day = Math.floor(times / 86400)
          hour = Math.floor((times % 86400) / 3600)
          minute = Math.floor((times % 3600) / 60)
          second = Math.floor(times % 60)
      }
      if (hour <= 9) hour = '0' + hour
      if (minute <= 9) minute = '0' + minute
      if (second <= 9) second = '0' + second
      if (day <= 0) {
      return hour + ':' + minute + ':' + second
      } else {
      return day + '天' + hour + ':' + minute + ':' + second
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .isActive {
    color: red;
  }
</style>>
