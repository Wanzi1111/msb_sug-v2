<template>
  <div>

    <basics-action :actions="act" />

    <basics-table
      ref="table"
      :table="table"
      :loading="loading"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
    />

    {{ JSON.stringify(list) }}

  </div>
</template>

<script>
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import { default as act } from './actions/list'
import columns from './columns/list'

export default {
  name: 'Demo2',
  components: { BasicsAction, BasicsTable },
  data() {
    return {
      act: act({ edit: this.edit, save: this.save }),
      table: { stripe: true },
      columns: columns(),
      total: 1,
      loading: false,
      list: [
        {
          messageName: '1',
          group: '1',
          pushType: '1',
          pushTarget: '1',
          user: '1',
          name: '1',
          action: '1'
        }, {
          messageName: '2',
          group: '2',
          pushType: '2',
          pushTarget: '2',
          user: '2',
          name: '2',
          action: '2'
        }
      ],
      listQuery: {
        page: 1,
        limit: 20
      },
      columnsSta: false
    }
  },
  methods: {
    edit() {
      this.columnsSta = !this.columnsSta
      this.columns = columns(this.columnsSta)
    },
    save() {
      console.log(this.list)
      this.columnsSta = false
      this.columns = columns(this.columnsSta)
    },
    getList() {

    }
  }
}
</script>
