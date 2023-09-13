<template>
  <div :class="{ isActive: out_time }">
    {{ `${out_time ?'超时:':''}  ${text}` }}
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ClockTime',
  props: {
    disabled: {
      type: Array,
      required: false,
      default: () => []
    },
    columns: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      timer: null,
      text: '',
      out_time: false
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
      const { nodeStartTime, cpStatus, ctime } = columns
      const getimes = moment(nodeStartTime && nodeStartTime).unix()// 节点的时间
      const ctimes = moment(ctime && ctime).unix()// 创建的时间
      // const getInvalidTime = moment(invalidTime && invalidTime).unix()// 已关闭，回访的时间
      // const getCloseTime = moment(closeTime && closeTime).unix()// 无效投诉的时间
      const newtime = moment(new Date()).unix()// 当前的时间
      let times = newtime - getimes// 已经创建了多久的时间
      // 处理不需要计时的选项
      if ((this.disabled.length > 0 && this.disabled.includes(cpStatus))) { // 3 6 7 或者asType是 待发货的时候 我要退款（无需退货）
             this.text = this.getMinutes(getimes - ctimes)
        // if (cpStatus === 6) {
        //   this.text = this.getMinutes(getInvalidTime - getimes)
        // } else {
        //   this.text = this.getMinutes(getCloseTime - getimes)
        // }
          return
      }
      this.timer = setInterval(() => {
          times++
          this.text = this.getMinutes(times)
          if (times <= 0) {
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
      if (day > 0) hour = 24 * day + hour
      if (hour <= 9) hour = '0' + hour
      if (minute <= 9) minute = '0' + minute
      if (second <= 9) second = '0' + second
      if (hour >= 72) {
          this.out_time = true
      }
      return hour + ':' + minute + ':' + second
    }
  }
}
</script>

<style lang="scss" scoped>
  .isActive {
    color: red;
  }
</style>>
