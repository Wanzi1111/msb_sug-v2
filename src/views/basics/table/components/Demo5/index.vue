<template>
  <basics-table
    ref="table"
    :attr="attr"
    :loading="loading"
    :columns="columns"
    :list="list"
    :get-list="getList"
    :total="total"
    :list-query="listQuery"
  >
    <template slot="action" slot-scope="scope">
      <el-button size="mini" @click="click(scope)">操作</el-button>
    </template>
    <template slot="action1" slot-scope="scope">
      <div>AAA!!! {{ scope.row.action }}</div>
    </template>
  </basics-table>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'

export default {
  name: 'Demo4',
  components: { BasicsTable },
  data() {
    return {
      attr: { stripe: true },
      loading: false,
      columns: [
        {
          label: 'index',
          prop: 'index',
          align: 'center'
        },
        {
          label: 'user',
          prop: 'user',
          align: 'center'
        },
        {
          label: 'name',
          prop: 'name',
          align: 'center'
        },
        {
          label: '操作',
          align: 'center',
          slot: 'action'
        },
        {
          label: '操作1',
          prop: 'user',
          align: 'center',
          slot: 'action1'
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          render: (h, dat, row, index) => {
            return h('div', { style: { color: 'red' }}, 'BBB')
          }
        }
      ],
      list: [
        {
          user: '1',
          name: '1',
          index: 3
        },
        {
          user: '2',
          name: '2',
          index: 2
        }
      ],
      total: 1,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    getList() {
    },
    click(scope) {
      console.log(scope)
    }
  }
}
</script>
