<template>
  <div>
    <div class="title-container">
      <basics-title :title="title" line back />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._logistics_warehouse_product_detail" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <basics-table
        ref="table"
        :attr="attr"
        :loading="loadings._logistics_warehouse_product_detail"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :list-query="listQuery"
      >
        <template slot="action" slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </basics-table>
    </div>
  </div>
</template>

<script>
import { stockDetail } from '@/api/goods/stock'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import searchs from './searchs/detail'
import columns from './columns/detail'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsStockDetail',
  components: { BasicsTitle, BasicsSearch, BasicsTable },
  data() {
    return {
      title: '',
      searchs: searchs,
      attr: { stripe: true },
      columns: columns,
      total: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      query: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {

  },
  mounted() {
    const { productCode = '', productName = '' } = this.$route.query
    this.title = `${productCode}  ${productName}`
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    changeSearch(query) {
      this.query = query
    },
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 跳转到创建物流、批量发货页
    jump(name) {
      this.$router.push({ name: name })
    },
    getList() {
      const { query, listQuery } = this
      const { productCode = '', warehouseNo = '' } = this.$route.query
      const data = {
        page: listQuery.page,
        pageSize: listQuery.limit,
        'from': Array.isArray(query.period) ? query.period[0] : '', // 开始时间
        'to': Array.isArray(query.period) ? query.period[1] : '', // 结束时间
        changeType: query.changeType || '', // 变更类型
        productCode, // 商品仓库中的编码
        warehouseNo // 仓库编码
      }
      stockDetail(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      })
    }
  }
}
</script>
