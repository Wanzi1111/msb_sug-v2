<template>
  <div>
    <basics-search ref="searchs" :loading="loadings._xbk_crCommentDetail_listCommentDetail" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" />
    <basics-action :actions="formal" />
    <basics-action :actions="act" />
    <basics-action :actions="special" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._xbk_crCommentDetail_listCommentDetail"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
    />
  </div>
</template>

<script>
import { xbkStatistics, listCommentDetail, xbkExport } from '@/api/operate/class-evaluate'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import { default as act } from './actions/actions'
import formal from './actions/formal'
import special from './actions/special'
import columns from './columns/list'
import searchs from './searchs/searchs'
import moment from 'moment'
import { createBlob } from '@/utils'
import { mapGetters } from 'vuex'

const defStatistics = {
  totalStuNum: '0',
  alreadyStuNum: '0',
  alreadyPercent: '0',
  fivePercent: '0',
  fourPercent: '0',
  threePercent: '0',
  twoPercent: '0',
  onePercent: '0'
}
export default {
  name: 'SmallClass',
  components: { BasicsTable, BasicsSearch, BasicsAction },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      searchs: searchs,
      total: 0,
      act: act({ statistics: defStatistics }),
      formal: formal({ statistics: defStatistics }),
      special: special({ exportDocument: this.exportDocument, statistics: defStatistics }),
      list: null,
      query: {},
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
        classTimeStart: classTime[0],
        classTimeEnd: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      xbkStatistics(data).then(res => {
        if (res.status === 0) {
          const statisticsList = res.data || []
          let statisticsAct, statisticsFormal, statisticsSpecial
          // FORMAL_LESSON(1,"正式课")
          // SPECIALIZE_LESSON(2,"专修课")
          // AUDITION_LESSON(3,"试听课")
          for (let i = 0; i < statisticsList.length; i++) {
            if (statisticsList[i].lessonType === 1) {
              statisticsFormal = statisticsList[i]
            }
            if (statisticsList[i].lessonType === 2) {
              statisticsSpecial = statisticsList[i]
            }
            if (statisticsList[i].lessonType === 3) {
              statisticsAct = statisticsList[i]
            }
          }
          this.formal = formal({ statistics: { ...defStatistics, ...statisticsFormal }})
          this.act = act({ statistics: { ...defStatistics, ...statisticsAct }})
          this.special = special({ exportDocument: this.exportDocument, statistics: { ...defStatistics, ...statisticsSpecial }})
        }
      })
    },
    // 获取投诉列表
    getList() {
      const { query, listQuery } = this
      const classTime = query.classTime || []
      const data = {
        ...query,
        classTimeStart: classTime[0],
        classTimeEnd: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      listCommentDetail({
        pageNum: listQuery.page,
        pageSize: listQuery.limit,
        ...data
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
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
      const { query } = this
      const classTime = query.classTime || []
      const data = {
        ...query,
        classTimeStart: classTime[0],
        classTimeEnd: classTime[1]
      }
      delete data.classTime
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      xbkExport(data).then(res => {
        createBlob(`小班课课后评价数据统计-${moment().format('YYYY-MM-DD')}.xls`, res)
      })
    }
  }
}
</script>
