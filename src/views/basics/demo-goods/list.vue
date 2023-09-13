<template>
  <div>

    <div class="title-container">
      <basics-title title="商品列表" line>
        <i class="el-icon-box" /> 平台的商城商品列表，包括赠品与画画套装
      </basics-title>
    </div>

    <div class="app-container">

      <basics-search ref="search" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />

      <basics-action :actions="act" />

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
        :action-function="actions"
      />
    </div>

  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsAction from '@/components/BasicsAction'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import act from './actions/list'
import columns, { actions } from './columns/list'
import searchs from './searchs/list'

export default {
  name: 'BasicsDemoList',
  components: { BasicsTitle, BasicsAction, BasicsSearch, BasicsTable },
  data() {
    return {
      act: act({ create: this.create, ex: this.ex }),
      searchs: searchs,
      table: { stripe: true },
      columns: columns,
      actions: actions({ view: this.view, put: this.put, del: this.del }),
      list: null,
      loading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeSearch() {

    },
    submitSearch() {
      this.getList()
    },
    create() {
      this.$router.push({ name: 'BasicsDemoGoodsCreate' })
    },
    ex() {
      alert('ex goods')
    },
    view() {
      this.$router.push({ name: 'BasicsDemoGoodsDetail' })
    },
    put() {

    },
    del() {
      this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该商品吗？', {
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
    },
    getList() {
      this.loading = true
      // fetchList(this.listQuery).then(response => {
      const list = []
      for (let i = 0; i < 20; i++) {
        list.push({ id: i + 1, name: `G689-${i}马克笔`, type: '商品', category: '马克笔', time: '2020-05-18 19:02:00', state: 1 })
      }
      this.list = list
      this.total = 28
      //   setTimeout(() => {
      this.loading = false
      //   }, 500)
      // })
    },
    handleSelectionChange(val) {
      console.log(val)
    }
  }
}
</script>
