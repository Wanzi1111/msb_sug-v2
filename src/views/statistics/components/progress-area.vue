<template>
  <div class="c-area-progress">
    <div class="middle-title">
      <span class="color-999">大区类型</span>
      <!-- <el-tooltip class="item" effect="dark" placement="top" content="当前条件下的热点投诉问题及其占比">
        <i class="el-icon-warning-outline color-999" />
      </el-tooltip> -->
    </div>
    <div class="middle-progress">
      <div v-for="(item, key) in progressData" :key="key" class="progress-content" @click="clickProgress(item)">
        <div class="progress-text">
          <span>{{ item.name }}</span>
        </div>
        <div class="progress-value">
          <el-progress class="progress-item" type="circle" :width="100" :stroke-width="10" :percentage="+item.value" :color="item.color" />
        </div>
      </div>
    </div>
    <el-divider />
    <div class="middle-botttm">
      <span v-if="progressData.length">大区:{{ curArea }} 投诉总量: {{ curTotal }} 占比:{{ curRate }}</span>
      <span v-else>---</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentAreaProgress',
  data() {
    return {
      progressData: [],
      colorArr: ['#B2293B', '#DF2C42', '#F7AA4B', '#40A1FF', '#37C9C9'],
      curArea: '',
      curTotal: '',
      curRate: ''
    }
  },
  methods: {
    initProgressData(list, total) {
      this.progressData = []
      list.forEach((item, index) => {
        this.progressData.push({
          name: item.areaName,
          value: (item.total * 100 / total).toFixed(2),
          color: this.colorArr[index],
          total: item.total
        })
      })
      if (!this.progressData.length) {
        return
      }
      this.curArea = this.progressData[0].name
      this.curTotal = list[0].total
      this.curRate = this.progressData[0].value + '%'
    },
    clickProgress(item) {
      this.curArea = item.name
      this.curTotal = item.total
      this.curRate = item.value + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.c-area-progress {
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
    min-height: 120px;
    display: flex;
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
