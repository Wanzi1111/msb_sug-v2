<template>
  <div class="home-container">
    <div class="app-container home-title">
      <span>下载中心</span><b style="color:red">（每条数据仅保留7天，请尽快下载）</b>
    </div>
    <div class="app-container">
      <basics-table
        :table="table"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      >
        <template slot="action" slot-scope="scope">
          <a v-if="(+scope.row.status) === 1" :href="scope.row.url" style="color:#3C56F2">下载</a>
          <span v-else>-</span>
        </template>
      </basics-table>
    </div>
  </div>
</template>
<script>
import columns, { actions } from './columns'
// import moment from 'moment'
import { getExportList } from '@/api/work-order'

const init_pagination = {
  page: 0,
  limit: 20
}
export default {
   name: '',
   data() {
       return {
        columns,
        list: [],
        total: 0,
        listQuery: { ...init_pagination },
        table: {
        stripe: false,
        border: false
        },
        actionFunction: actions({})
       }
   },
  mounted() {
    this.getList()
  },
  methods: {
    // 请求下载中心列表
    async getList() {
      const { listQuery } = this
      const res = await getExportList({
        size: listQuery.limit,
        page: (listQuery.page) * 1 - 1
        })
      const { code, payload: { content, totalElements }} = res
      if (code === 0) {
          this.list = content
          this.total = totalElements * 1 || 0
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.home-container {
  min-width: 960px;
  .home-title {
    display: flex;
    align-items: center;
    border-radius: 5px;
    span {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 18px;
      line-height: 36px;
    }
  }
}
</style>
