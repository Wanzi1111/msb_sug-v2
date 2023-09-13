<template>
  <div class="c-status-progress">
    <div class="middle-title">
      <span class="color-999">投诉状态占比</span>
      <el-tooltip class="item" effect="dark" placement="top" content="当前条件下的投诉处理的各状态占比">
        <i class="el-icon-warning-outline color-999" />
      </el-tooltip>
    </div>
    <div class="middle-progress">
      <div class="progress-text">
        <span v-for="(item, key) in progressData" :key="key">{{ item.name }}</span>
      </div>
      <div class="progress-value">
        <el-progress v-for="(item, key) in progressData" :key="key" class="progress-item" type="circle" :width="100" :stroke-width="10" :percentage="item.value" :color="item.color" />
      </div>
    </div>
    <el-divider />
    <div class="middle-botttm">
      <span>当前时间段累计</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentStatusProgress',
  data() {
    return {
      progressData: []
    }
  },
  methods: {
    initProgressData(data) {
      // console.log(data)
      this.progressData = [
        {
          name: '待处理',
          value: +data.unHandleRate || 0,
          color: '#B2293B'
        },
        {
          name: '处理中',
          value: +data.handleRate || 0,
          color: '#DF2C42'
        },
        {
          name: '已关闭',
          value: +data.closeRate || 0,
          color: '#F7AA4B'
        },
        {
          name: '已回访',
          value: +data.solveRate || 0,
          color: '#40A1FF'
        },
        /* {
          name: '评级满意',
          value: +data.pleasedRate || 0,
          color: '#37C9C9'
        }, */
        {
          name: '无效投诉',
          value: +data.invalidRate || 0,
          color: '#939393'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.c-status-progress {
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
  .middle-botttm {
    font-size: 13px;
  }
}
</style>
