<template>
  <div>

    <div class="title-container">
      <basics-title title="搜索" line />
    </div>

    <div class="app-container">
      <basics-search ref="search" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
    </div>

    <div class="app-container">
      <el-button @click="options">修改options</el-button>
      <el-button @click="defaultVal">修改defaultVal</el-button>
      <el-button @click="visible">修改visible</el-button>
      <el-button @click="attr">修改attr</el-button>
      <el-button @click="item">修改item</el-button>
    </div>

  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import searchs from './searchs/searchs'

export default {
  name: 'BasicsSearchs',
  components: { BasicsTitle, BasicsSearch },
  data() {
    return {
      searchs: searchs
    }
  },
  mounted() {
    this.$refs.search.recoveryForm({
      name1: 'sdsa',
      name2: 'dsad'
    })
  },
  methods: {
    changeSearch(val, oldVal) {
      console.log(val, oldVal)
    },
    submitSearch(val) {
      console.log(val)
    },
    options() {
      this.$refs.search.set({
        type: 'options',
        data: { select: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }
      })
    },
    defaultVal() {
      this.$refs.search.set({
        type: 'defaultVal',
        data: { select: 'a' }
      })
    },
    visible() {
      this.$refs.search.set({
        type: 'visible',
        data: { select: false, name4: false, time: false }
      })
    },
    attr() {
      this.$refs.search.set({
        type: 'attr',
        data: { select: { disabled: true }}
      })
    },
    item() {
      this.$refs.search.set({
        type: 'item',
        data: { select: {
          prop: 'inputNumber2',
          label: '计数器2',
          type: 'inputNumber', // 计数器,
          defaultVal: 2
        }}
      })
    }
  }
}
</script>

