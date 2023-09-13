<template>
  <div>
    <div class="title-container">
      <basics-title title="商品库存统计" line />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._logistics_warehouse_product_statistics" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <basics-table
        ref="table"
        :attr="attr"
        :loading="loadings._logistics_warehouse_product_statistics"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
      />
    </div>
  </div>
</template>

<script>
import { businessList } from '@/api/goods/manage'
import { stockList } from '@/api/goods/stock'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import searchs from './searchs/list'
import columns, { actions } from './columns/list'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsStock',
  components: { BasicsTitle, BasicsSearch, BasicsTable },
  data() {
    return {
      searchs: searchs,
      attr: { stripe: true },
      columns: columns,
      actions: actions({ view: this.view }),
      total: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      query: {},
      businessAttr: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  async created() {
    await this.getBusiness()
    this.getList()
  },
  methods: {
    // 获取业务线
    getBusiness() {
      return new Promise((resolve, reject) => {
        businessList().then(res => {
          const businessCode = []
          const data = res.data || []
          const businessAttr = []
          data.map(item => {
            businessCode.push({
              label: item.businessName,
              value: item.businessCode
            })
            businessAttr[item.businessCode] = item.businessName
          })
          this.businessAttr = businessAttr
          this.$nextTick(() => {
            this.$refs.searchs && this.$refs.searchs.set({
              type: 'options',
              data: { businessCode: businessCode }
            })
          })
          resolve()
        }).catch(e => reject(e))
      })
    },
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
    // 跳转到库存明细
    view(row) {
      const {
        productCode,
        supplierProductCode,
        productName,
        warehouseNo
      } = row
      this.$router.push({ name: 'GoodsStockDetail', query: {
        productCode,
        supplierProductCode,
        productName,
        warehouseNo
      }})
    },
    getList() {
      const { query, listQuery } = this
      const type = query.type || []
      const productChildType = (type || []).map(item => item[1])
      const data = {
        page: listQuery.page,
        pageSize: listQuery.limit,
        businessCode: query.businessCode,
        productName: query.productName,
        // productType: productType,
        productChildType: productChildType
      }
      stockList(data).then(res => {
        const data = res.data || {}
        const list = data.rows || []
        const { businessAttr } = this
        list.map(item => {
          item.businessName = businessAttr[item.businessCode]
        })
        this.list = list
        this.total = data.records || 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .columns-note {
    color: #aaa;
  }
</style>
