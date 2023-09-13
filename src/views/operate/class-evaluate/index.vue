<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="1对1" name="oneByOne">
        <one-by-one />
      </el-tab-pane>
      <el-tab-pane label="小班课" name="smallClass">
        <small-class />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OneByOne from './components/OneByOne'
import SmallClass from './components/SmallClass'
export default {
  name: 'OperateClassEvaluate',
  components: {
    OneByOne,
    SmallClass
  },
  data() {
    return {
      activeName: 'oneByOne'
    }
  },
  methods: {
    handleClick() {

    }
  }
}
</script>
