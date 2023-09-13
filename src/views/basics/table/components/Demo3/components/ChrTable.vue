<template>
  <basics-table
    ref="table"
    :table="table"
    :loading="loading"
    :list="list"
    :get-list="getList"
    :columns="columns"
    :total="0"
    :list-query="listQuery"
  />
</template>
<script>
import BasicsTable from '@/components/BasicsTable'

export default {
  name: 'ChrTable',
  components: { BasicsTable },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      table: { stripe: true },
      loading: false,
      list: [],
      columns: [],
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    console.log(this.row)
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { row } = this
      const data = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            'data': {
              'header': [
                { 'prop': 'class_time', 'label': `上课时间${row.name}` },
                { 'prop': 'in_time', 'label': `进入教室时间${row.name}` },
                { 'prop': 'out_time', 'label': `出教室时间${row.name}` }
              ],
              'list': [
                { 'in_time': row.name, 'out_time': row.name, 'class_time': '2020-05-07 12:01:45' }
              ]
            },
            'status': 0,
            'msg': 'ok'
          })
        }, 500)
      })
      this.loading = false
      const { header, list } = data.data
      this.list = list
      const columns = []
      header.map((item, index) => {
        if (index < row.index) {
          columns.push({
            prop: item.prop,
            label: item.label,
            align: 'center'
          })
        }
      })
      this.columns = columns
    }
  }
}
</script>
