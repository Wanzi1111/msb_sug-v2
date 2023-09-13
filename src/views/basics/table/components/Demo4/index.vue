<template>
  <basics-table
    :columns="columns"
    :list="list"
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
        },
        {
          label: '操作',
          align: 'center',
          slot: 'action'
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
      ]
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
