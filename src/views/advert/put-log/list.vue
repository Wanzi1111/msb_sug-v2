<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="loadings._operation_resource_publishList" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_resource_publishList"
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
import { publishList } from '@/api/advert/put'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import { advertConfig } from '@/api/advert/ad-position'
import columns, { actions } from './columns/list'
import searchs from './searchs/searchs'
import { mapGetters } from 'vuex'

export default {
  name: 'Putlog',
  components: { BasicsTable, BasicsSearch },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: actions({ dataDetails: this.dataDetails }),
      searchs: searchs,
      list: null,
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    // this.getConfig()
  },
  mounted() {
    this.$refs.searchs.set({
      type: 'defaultVal',
      data: {
        publishStatus: '0'
      }
    })
    this.$refs.searchs.search()
  },
  methods: {
    // 搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 获取数据统计列表
    getList() {
      const { query, listQuery } = this
      const time = query.time || []
      let startTime = ''; let endTime = ''
      if (time.length) {
        startTime = time[0]
        endTime = time[1]
      }
      const data = {
        ...query,
        startTime: startTime,
        endTime: endTime
      }
      delete data.time
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      publishList(data, {
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 获取配置
    getConfig() {
      advertConfig().then(res => {
        // const business = res.data.businessType || []
        // const client = res.data.clientType || []
        const advert = res.data.advertType || []
        const lopp = (type) => {
          const list = []
          type.map(item => {
            list.push({
              label: item,
              value: item
            })
          })
          return list
        }
        const advertType = lopp(advert)
        this.$refs.searchs.set({
          type: 'options',
          data: {
            advertType: advertType
          }
        })
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: {
            publishStatus: '0'
          }
        })
        this.$refs.searchs.search()
      }).catch(() => {

      })
    },
    // 跳转到数据详情
    dataDetails(dat, row, index) {
      this.$router.push({ name: 'PutLogDetail', params: { id: row.id }})
    }
  }
}
</script>
