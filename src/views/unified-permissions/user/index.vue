<template>
  <div class="app-container">
    <left-content title="公司部门管理" :tree-data="treeData" @handleTreeNodeClick="handleTreeNodeClick" />
    <right-content ref="rightContent" title="部门人员" />
  </div>
</template>
<script>
import { getOrgTree } from '@/api/unified-permissions/user'
import { fixedFooter } from '@/utils/mixins'

import LeftContent from './components/LeftContent'
import RightContent from './components/RightContent'
export default {
  name: 'User',
  components: {
    LeftContent,
    RightContent
  },
  mixins: [fixedFooter],
  data() {
    return {
      text: '用户管理',
      treeData: []
    }
  },
  created() {
    this.getOrgTrees()
  },
  mounted() {

  },
  methods: {
    handleTreeNodeClick(data) {
      console.log('tree click', data)
      this.$refs.rightContent.changeOrgId(data.id)
    },
    getOrgTrees() {
      getOrgTree({}).then(res => {
        this.treeData = res.data || []
        // console.log('结果', res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    display: flex;
    padding: 0;
    background-color: #f1f1f1;
  }
</style>
<style lang="scss">
  .fixed-footer {
    height: initial !important;
    padding: 30px 0;
  }
  .fixed-main {
    min-height: calc(100vh - 165px) !important;
  }
</style>

