<template>
  <div class="left-content">
    <div class="title">
      {{ title }}
    </div>
    <div class="shipment">
      <el-tree :data="treeData" :props="treeProps" node-key="id" :default-expanded-keys="expandedList" highlight-current accordion @node-click="handleNodeClick" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'LeftContent',
  props: {
    title: {
      type: String,
      default: ''
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      expandedList: []
    }
  },
  watch: {
    treeData(val) {
      if (val && val.length > 0) {
        this.expandedList = val.map(item => item.id)
        // this.handleExpand(val)
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleNodeClick(data) {
      this.$emit('handleTreeNodeClick', data)
    },
    handleExpand(list) { // 默认展开节点
      const children = list[0].children
      if (children && children.length > 0) {
        this.expandedList = children.map(item => item.id)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .left-content {
    width: 25%;
    min-height: calc(100vh - 240px);
    border-right: 1px solid #f1f1f1;
    .title {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      background-color: #fff;
      color: #606266;
    }
    .shipment {
      margin-top: 2px;
      padding: 20px 0 0 20px;
      background-color: #fff;
      height: 100%;
    }
  }
</style>
