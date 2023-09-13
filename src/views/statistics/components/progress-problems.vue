<template>
  <div class="c-problems-progress">
    <div class="middle-title">
      <span class="color-999">重点问题</span>
      <el-tooltip class="item" effect="dark" placement="top" content="当前条件下的热点投诉问题及其占比">
        <i class="el-icon-warning-outline color-999" />
      </el-tooltip>
    </div>
    <div class="middle-progress">
      <div v-for="(item, key) in progressData" :key="key" class="progress-content" @click="clickProgressItem(item)">
        <div class="progress-text">
          <span>{{ item.problemName }}</span>
        </div>
        <div class="progress-value">
          <el-progress class="progress-item" type="circle" :width="100" :stroke-width="10" :percentage="+item.problemRateShow" :color="item.color" />
        </div>
      </div>

    </div>
    <el-divider />
    <div class="middle-botttm">
      <span>{{ curText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentProblemsProgress',
  data() {
    return {
      progressData: [],
      colorArr: ['#B2293B', '#DF2C42', '#F7AA4B', '#40A1FF', '#37C9C9'],
      curText: ''
    }
  },
  methods: {
    initProgressData(data) {
      // console.log(data)
      data.forEach((item, index) => {
        // 把最后的%去掉
        item.problemRateShow = item.problemRate.slice(0, -1) || 0
        item.color = this.colorArr[index]
      })
      data.sort((a, b) => {
        return b.problemCount - a.problemCount
      })
      this.progressData = data
      if (data.length) {
        this.curText = `${data[0].problemName} ${data[0].problemCount}条 占投诉总量${data[0].problemRate}`
      } else {
        this.curText = ''
      }
    },
    clickProgressItem(item) {
      // console.log(item)
      this.curText = `${item.problemName} ${item.problemCount}条 占投诉总量${item.problemRate}`
    }
  }
}
</script>

<style lang="scss" scoped>
.c-problems-progress {
  flex: 3;
  margin-right: 20px;
  padding: 20px;
  background-color: #fff;
  .color-999 {
    color: #999;
  }
  .middle-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &> span {
      flex: 1;
      font-size: 12px;
    }
  }
  .middle-progress {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    min-height: 119px;
    .progress-content {
      flex: 1;
      cursor: pointer;
      .progress-text {
        display: flex;
        margin-bottom: 5px;
        span {
          flex: 1;
          text-align: center;
          font-size: 13px;
          color: #606266;
        }
      }
      .progress-value {
        display: flex;
        .progress-item {
          flex: 1;
          position: relative;
          /deep/ {
            .el-progress-circle {
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
  .middle-botttm {
    font-size: 13px;
  }
}
</style>
