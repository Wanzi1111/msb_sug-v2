
<template>
  <div id="tableList" :class="{ 'no-padding': size > total }">
    <el-table
      id="outTable"
      v-loading="loading"
      style="width: 100%"
      :size="tableSize"
      :data="dataList"
      :header-row-class-name="headerRowClasFn"
      :header-row-style="headerRowStyleFn"
      :max-height="
        size > total && tableHeight != 'auto' ? +tableHeight + 50 : tableHeight
      "
      :header-cell-style="{
        fontSize: '12px',
        color: '#666',
        fontWeight: 'normal'
      }"
      element-loading-text="玩命加载中~"
      element-loading-spinner="el-icon-loading"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <slot />
    </el-table>
    <div v-if="size <= total" class="page_box">
      <el-pagination
        background
        :layout="layOut"
        :current-page="page"
        :page-size.sync="size"
        :total="total"
        @current-change="pageChange_handler"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Etable',
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    tableSize: {
      type: String,
      default: 'medium'
    },
    tableHeight: {
      type: [String, Number],
      default: 'auto'
    },
    size: {
      type: Number,
      default: 20
    },
    page: Number,
    total: Number,
    showAllTotalNum: {
      type: Boolean,
      default: false
    },
    // thead > tr 样式
    headerRowClasFn: {
      type: Function,
      default: () => {}
    },
    headerRowStyleFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dataLists: [],
      maxHeight: null,
      layOut: 'prev, pager, next'
    }
  },
  created() {
    if (this.showAllTotalNum) {
      this.layOut = 'prev, pager, next, total'
    }
  },
  mounted() {},
  methods: {
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.$emit('pageChange', page)
    },
    /**
     * @description 排序 回调事件
     */
    sortChange(column) {
      this.$emit('sort-change', column)
    },
    /**
     * @description 勾选 回调事件
     */
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
#tableList {
  min-width: 900px;
  position: relative;
  padding-bottom: 50px;
  &.no-padding {
    padding-bottom: 0;
  }
}
.page_box {
  height: 50px;
  display: flex;
  align-items: center;
  text-align: right;
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 15px;
}
</style>
