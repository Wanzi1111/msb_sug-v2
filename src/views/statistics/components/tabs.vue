<template>
  <div class="component-tabs">
    <el-button v-for="(item, index) in tabs" :key="item.value" :class="[{'el-button--primary': item.click}]" size="small" @click="clickTab(index, item.value)">{{ item.name }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'ComponentsTabs',
  data() {
    return {
      tabs: [
        {
          name: '全部',
          value: 0,
          click: true
        },
        {
          name: '1对1用户',
          value: 1011
        },
        {
          name: '1对1老师',
          value: 1012
        },
        {
          name: '小班课用户',
          value: 1021
        },
        {
          name: '小班课老师',
          value: 1022
        },
        {
          name: '小熊用户',
          value: 1031
        },
        {
          name: '书法课用户',
          value: 1041
        },
        {
          name: '小熊音乐',
          value: 1051
        },
        {
          name: '书画院用户',
          value: 1061
        },
        {
          name: '小熊舞蹈用户',
          value: 1071
        },
        {
          name: '小熊手工',
          value: 1081
        },
        {
          name: '绘本创作',
          value: 2011
        }
      ],
      // 之前tab
      tabBeforeIndex: 0
    }
  },
  methods: {
    clickTab(index, value) {
      if (this.tabBeforeIndex === index) {
        return
      }
      this.$set(this.tabs[index], 'click', true)
      this.$set(this.tabs[this.tabBeforeIndex], 'click', false)
      this.tabBeforeIndex = index
      this.$emit('tabSelect', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-tabs {
  /deep/ {
    .el-button {
      border: none;
      margin-right: 20px;
    }
  }
}
</style>
