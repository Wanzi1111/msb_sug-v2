<template>
  <div>
    <div class="title-container">
      <basics-title title="导入记录" line />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._logistics_manage_queryRecord" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._logistics_manage_queryRecord"
        :loadings="loadings"
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
import { queryRecord, exportRecord } from '@/api/express/file'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import searchs from './searchs/list'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import { mapGetters } from 'vuex'
import { createBlob } from '@/utils'
import moment from 'moment'

export default {
  name: 'ExpressImportLog',
  components: { BasicsTitle, BasicsSearch, BasicsAction, BasicsTable },
  data() {
    return {
      searchs: searchs,
      act: act({ jump: this.jump }),
      table: { stripe: true },
      columns: columns,
      actions: actions({ look: this.look, download: this.download }),
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
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    changeSearch(val) {
      this.query = val
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
    // 查看物流单
    look(row) {
      this.$router.push({ name: 'ExpressManage', query: { batchId: row.batchId, time: null }})
    },
    // 下载数据
    download(sta, row) {
      exportRecord({
        batchId: row.batchId,
        status: sta
      }).then(res => {
        const name = sta ? `导入批次${row.batchId}物流单的成功数据` : `导入批次${row.batchId}物流单的失败数据`
        createBlob(`${name}-${moment().format('YYYY-MM-DD')}.xls`, res)
        this.$message.success('批量创建物流单数据下载成功')
      })
    },
    getList() {
      const { query, listQuery } = this
      const time = query.time || []
      const createTimeStart = time[0] || ''
      const createTimeEnd = time[1] || ''
      const data = {
        createTimeStart: createTimeStart,
        createTimeEnd: createTimeEnd,
        type: query.type,
        // operUid: '', // 创建人
        page: listQuery.page,
        pageSize: listQuery.limit
      }
      queryRecord(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      })
    }
  }
}
</script>
