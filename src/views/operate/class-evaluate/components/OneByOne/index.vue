<template>
  <div>
    <basics-search ref="searchs" :loading="loadings._api_pc_operate_list" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" />
    <basics-action :actions="formal" />
    <basics-action :actions="act" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._api_pc_operate_list"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
    />
  </div>
</template>

<script>
import { classList, statistics, exportEvaluate } from '@/api/operate/class-evaluate'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import { default as act } from './actions/actions'
import formal from './actions/formal'
import columns from './columns/list'
import searchs from './searchs/searchs'
import moment from 'moment'
import { createBlob } from '@/utils'
import { mapGetters } from 'vuex'

const defStatistics = {
  auFour: '',
  foFour: '',
  foThree: '',
  foPercen: '',
  foEvaluate: '',
  foOne: '',
  foCount: '',
  foFive: '',
  auPercen: '',
  foTwo: '',
  auEvaluate: '',
  auTwo: '',
  auCount: '',
  auFive: '',
  auThree: '',
  auOne: ''
}
export default {
  name: 'OneByOne',
  components: { BasicsTable, BasicsSearch, BasicsAction },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      searchs: searchs,
      total: 0,
      act: act({ exportDocument: this.exportDocument, statistics: defStatistics }),
      formal: formal({ statistics: defStatistics }),
      list: null,
      query: {},
      searchQuery: {},
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    // this.getList()
    // this.getStatistics()
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
      this.getStatistics()
    })
  },
  methods: {
    // 获取正式课试听课的统计数据
    getStatistics() {
      const { query } = this
      const classTime = query.classTime || []
      const data = {
        ...query,
        beginTime: classTime[0],
        endTime: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      statistics(data).then(res => {
        if (res.status === 0) {
          const statistics = res.data || {}
          this.act = act({ exportDocument: this.exportDocument, statistics: { ...defStatistics, ...statistics }})
          this.formal = formal({ statistics: { ...defStatistics, ...statistics }})
        }
      })
    },
    // 获取投诉列表
    getList() {
      const { query, listQuery } = this
      this.searchQuery = { ...query }
      const classTime = query.classTime || []
      const data = {
        ...query,
        beginTime: classTime[0],
        endTime: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      classList({
        pageNumber: listQuery.page,
        pageSize: listQuery.limit,
        ...data
      }).then(res => {
        const data = res.data || {}
        this.list = data.data || []
        this.total = data.total || 0
      })
    },
    // 搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.query = val
      this.getList()
      this.getStatistics()
    },
    changeSearch(val) {
      this.query = val
    },
    // 导出
    exportDocument() {
      const { searchQuery } = this
      const classTime = searchQuery.classTime || []
      const data = {
        ...searchQuery,
        beginTime: classTime[0],
        endTime: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      exportEvaluate(data).then(res => {
        createBlob(`1对1课后评价数据统计-${moment().format('YYYY-MM-DD')}.xls`, res)
      })
    }
  }
}
</script>
