<template>
  <div class="app-container">
    <left-content title="业务系统" :sys-list="systemList" @changeSysId="changeSysId" @getList="getList" />
    <right-content ref="rightContent" title="菜单名称" :menu-list="menuList" :current-sys-id="currentSysId" @updateMenuList="updateMenuList" />
  </div>
</template>
<script>
import { getSystemList } from '@/api/unified-permissions/resources'
import { fixedFooter } from '@/utils/mixins'

import LeftContent from './components/LeftContent'
import RightContent from './components/RightContent'
export default {
  name: 'Resources',
  components: {
    LeftContent, RightContent
  },
  mixins: [fixedFooter],
  data() {
    return {
      systemList: [],
      currentSysIdx: undefined,
      currentSysId: undefined,
      menuList: []
    }
  },
  created() {
    this.getSystemList()
  },
  mounted() {

  },
  methods: {
    updateMenuList() {
      getSystemList({}).then(res => {
        this.systemList = res.data || []
        this.menuList = this.systemList[this.currentSysIdx].resList || [] // 从系统数据里取对应的菜单列表
      })
    },
    getSystemList() {
      getSystemList({}).then(res => {
        this.systemList = res.data || []
        if (this.systemList.length > 0) {
          this.currentSysId = this.systemList[0].id
          this.currentSysIdx = 0
          this.menuList = this.systemList[this.currentSysIdx].resList || []
        }
        // console.log('结果', res)
      })
    },
    changeSysId(id, index) {
      this.currentSysIdx = index // 更新选中的系统列表索引
      this.menuList = this.systemList[index].resList || [] // 从系统数据里取对应的菜单列表
      this.$refs.rightContent.changeSysId(id)
    },
    // 编辑/新增操作之后触发列表更新
    getList() {
      this.getSystemList()
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
