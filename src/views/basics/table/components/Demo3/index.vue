<template>
  <basics-table
    ref="table"
    :table="table"
    :loading="loading"
    :list="list"
    :get-list="getList"
    :columns="columns"
    :total="total"
    :list-query="listQuery"
    :action-function="actions"
  />
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from './columns/list'

export default {
  name: 'GoodsData',
  components: { BasicsTable },
  data() {
    return {
      table: { stripe: true },
      columns: columns({ openDl: this.openDl, switchState: this.switchState, edit: this.edit, del: this.del }),
      actions: actions({ switchState: this.switchState, edit: this.edit, del: this.del }),
      total: 1,
      loading: false,
      list: [{
        messageName: '1',
        group: '1',
        pushType: '1',
        pushTarget: '1',
        user: '1',
        name: '1',
        index: 3,
        action: '1'
      }, {
        messageName: '2',
        group: '2',
        pushType: '2',
        pushTarget: '2',
        user: '2',
        name: '2',
        index: 2,
        action: '2'
      }],
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    getList() {
    },
    openDl() {
    },
    switchState() {
      alert('切换')
    },
    edit() {
      this.openDl()
    },
    del() {
      this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该分类吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        alert('删除商品')
        // this.put(putMoreData, moreCheckPut.join(',')).then(() => {
        //   this.$message.success('一件投放成功')
        //   this.putMoreData = {}
        //   this.putSuccessVisible = false
        // }).finally(() => {
        //   this.firstPutSta = false
        // })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
