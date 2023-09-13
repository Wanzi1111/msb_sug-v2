<template>
  <div>

    <basics-table
      ref="table"
      :table="table"
      :handle-selection-change="handleSelectionChange"
      :loading="loading"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />

  </div>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from './columns/list'

export default {
  name: 'BasicsTables',
  components: { BasicsTable },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: actions({ ok: this.ok }),
      list: null,
      loading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      // fetchList(this.listQuery).then(response => {
      this.list = [
        {
          id: 1,
          content: 'content',
          author: 'author',
          forecast: 'forecast',
          action1: 'action1',
          importance: 'importance',
          type: 1
        },
        {
          id: 1,
          content: 'content',
          author: 'author',
          forecast: 'forecast',
          action1: 'action1',
          importance: 'importance',
          type: 1
        }
      ]
      this.total = 50
      //   setTimeout(() => {
      this.loading = false
      //   }, 500)
      // })
    },
    ok(dat, row, index) {
      console.log(dat, row, index)
      this.$refs.table.clearSelection()
    },
    del(dat, row, index) {
      console.log(dat, row, index)
    },
    handleSelectionChange(val) {
      console.log(val)
    }
  }
}
</script>
