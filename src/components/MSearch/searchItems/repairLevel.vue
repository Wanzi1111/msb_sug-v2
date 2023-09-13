<!--
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-29 18:47:14
 * @LastEditors: Zhangjiali
 * @LastEditTime: 2021-07-23 18:08:40
 -->
<template>
  <div class="container">
    <el-select
      v-model="levelDataInner"
      class="item-style"
      clearable
      size="mini"
      placeholder="选择级别"
      @change="levelChange"
    >
      <el-option
        v-for="item in levelList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      />
    </el-select>
  </div>
</template>

<script>
// import axios from '@/api/axiosConfig'

export default {
  name: 'RepairLevel',
  props: {
    chooseOne: {
      type: String,
      default: ''
    },
    isWriteApp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      levelDataInner: null,
      RAINING: [
        { id: 1, name: 'L1' }
        // { id: 2, name: 'L2' } 只支持训练营二期补发货，二期只有L1
      ]
    }
  },
  computed: {
    levelList() {
      return {
        SYSTEM_COURSE: this.SUP_LEVEL_LIST,
        TRAINING_CAMP_COURSE: this.RAINING
      }[this.chooseOne]
    },
    SUP_LEVEL_LIST() {
      return this.isWriteApp
        ? [{ id: 1, name: 'L1' }]
        : [
            { id: 1, name: 'L1' },
            { id: 2, name: 'L2' },
            { id: 3, name: 'L3' },
            { id: 4, name: 'L4' },
            { id: 5, name: 'L5' },
            { id: 6, name: 'L6' },
            { id: 7, name: 'L7' },
            { id: 8, name: 'L8' },
            { id: 9, name: 'L9' },
            { id: 10, name: 'L10' },
            { id: 11, name: 'L11' },
            { id: 12, name: 'L12' }
          ]
    }
  },
  mounted() {
    this.$root.$on('qingkong', () => {
      this.levelDataInner = ''
    })
  },
  methods: {
    levelChange(data) {
      console.log(data, 'data')
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 120px !important;
}
</style>
