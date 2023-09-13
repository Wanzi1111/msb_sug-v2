<!--
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-29 18:47:14
 * @LastEditors: Zhangjiali
 * @LastEditTime: 2021-09-27 15:59:12
 -->
<template>
  <div class="container">
    <el-select
      v-model="supDataInner"
      class="item-style"
      clearable
      size="mini"
      placeholder="选择难度"
      @change="supChange"
    >
      <el-option
        v-for="item in isMusic ? supListMusic : supList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
// import axios from '@/api/axiosConfig'
import {
  SUP_LEVEL_LIST,
  SUP_LEVEL_LIST_TRIAL,
  TRAINING,
  SUP_LEVEL_LIST_MUSIC
} from '@/utils/supList'

export default {
  name: 'RepairSup',
  props: {
    chooseOne: {
      type: String,
      default: ''
    },
    isMusic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      supListMusic: SUP_LEVEL_LIST_MUSIC,
      supDataInner: ''
    }
  },
  computed: {
    supList() {
      return {
        EXPERIENCE_COURSE: SUP_LEVEL_LIST_TRIAL,
        SYSTEM_COURSE: SUP_LEVEL_LIST,
        TRAINING_CAMP_COURSE: TRAINING
      }[this.chooseOne]
    }
  },
  mounted() {
    console.log(this.supList)
    // this.$root.$on('qingkong', () => {
    //   this.supDataInner = ''
    // })
  },
  methods: {
    supChange(data) {
      console.log(data, 'data')
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 138px !important;
}
</style>
