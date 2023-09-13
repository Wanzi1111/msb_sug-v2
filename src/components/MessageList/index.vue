<template>
  <div>
    <div v-if="!isNoData" v-loading="loading" class="message-list">
      <template v-for="( item, index ) in messageDataList">
        <message-card
          :key="index"
          :item="item"
          :name="name"
          @getlist="getList"
        />
        <el-divider v-if="dividerShow(index)" :key="index" />
      </template>
      <pagination v-show="showPagination" :total="total" :page-sizes="listQuery.pageSizes" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <div v-if="isNoData" class="divider">暂无数据</div>
  </div>
</template>

<script>
import MessageCard from '../MessageCard'
import Pagination from '../Pagination' // Secondary package based on el-pagination
export default {
  name: 'MessageList',
  components: {
    MessageCard,
    Pagination
  },
  props: {
    messageDataList: {
      default: () => [],
      type: Array
    },
    listQuery: {
      type: Object,
      default: () => ({})
    },
    getList: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    dividerShow() {
      return function(index) {
        return index !== this.messageDataList.length - 1
      }
    },
    isNoData() {
      return this.messageDataList.length === 0
    },
    showPagination() {
      return this.total > 0
    }
  }
  // watch: {
  //   messageDataList(newVal, oldVal) {
  //     console.log(newVal, oldVal)
  //   }
  // }
  // methods: {
  // }
}
</script>

<style lang="scss" scoped>
.message-list {
  width: 100%;
  padding: 5px 0;
  /deep/ .el-divider__text {
    color: #999;
  }
}
.divider{
  padding: 100px;
  text-align: center;
  color: #999;
}
</style>
