<template>
  <div>
    <basics-search ref="searchs" :loading="loadings._logistics_product_list" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
    <basics-table
      ref="table"
      :attr="attr"
      :loading="loadings._logistics_product_list"
      :columns="columns"
      :list="list"
      :get-list="getList"
      :total="total"
      :list-query="listQuery"
      :action-function="actions"
    />
  </div>
</template>

<script>
import { businessList, productList } from '@/api/goods/manage'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import searchs from './searchs/list'
import columns, { actions } from './columns/list'
import { mapGetters } from 'vuex'

export default {
  name: 'ChoiceGoods',
  components: { BasicsSearch, BasicsTable },
  data() {
    return {
      searchs: searchs,
      attr: { stripe: true },
      columns: columns,
      actions: actions({ choice: this.choice }),
      total: 0,
      loading: false,
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
    this.getList()
    this.getBusiness()
  },
  methods: {
    // 获取业务线
    getBusiness() {
      businessList().then(res => {
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode
          })
        })
        this.businessCode = businessCode
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
        })
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
    getList() {
      const { query, listQuery } = this
      const type = query.type || []
      const productChildType = []
      type.map(item => {
        productChildType.push(item[item.length - 1])
      })
      const data = {
        page: listQuery.page,
        pageSize: listQuery.limit,
        businessCode: query.businessCode,
        productName: query.productName,
        // productType: productType,
        productChildType: productChildType // 二级分类code
      }
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      productList(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      })
    },
    choice(row) {
      this.$emit('choice', row)
    }
  }
}
</script>
