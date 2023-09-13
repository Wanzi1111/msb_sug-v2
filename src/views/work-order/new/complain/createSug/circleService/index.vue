<template>
  <div>
    <div class="title-container">
      <basics-title
        title="工商投诉 [后台创建记录]"
        :actions="act"
      />
    </div>
    <div class="app-container">
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_v2_complaint_batchComplaintList"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />
    </div>
  </div>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from './columns/list'
import { default as act } from './actions/actions'
import { mapGetters } from 'vuex'
import { batchComplaintList, exportBatchRecord } from '@/api/operate/createSug'
import { Message } from 'element-ui'
import { createBlob } from '@/utils'
import moment from 'moment'
export default {
  name: 'StaffList',
  components: { BasicsTable },
  data() {
    return {
      act: act({ addSug: this.addSug, jump: this.jump }),
      table: {
        stripe: false,
        border: false
      },
      columns,
      total: 0,
      list: null,
      query: {},
      listQuery: {
        page: 1,
        limit: 20,
        type: 1
      },
      actionFunction: actions({
        tableAction: this.tableAction
      })
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {

  },
  created() {
    this.getList()
    // this.info.title = '创建投诉'
    // this.dialogVisible = true
    // this.sugForm = userForm
  },
  mounted() {

  },
  methods: {
    addSug() {
      this.$router.push({ name: 'createService', params: { type: '1' }})
      // this.info.title = '创建投诉'
      // this.dialogVisible = true
      // this.sugForm = userForm
      // this.getProblemChannel('1011', 'problemId')
    },
    jump() {
      this.$router.push({ name: 'batchImport', params: { type: '1' }})
    },
    tableAction(dat, row, index, name) {
      switch (name) {
        case 'progress':
          this.progressCheckFn(row)
          break
        case 'downLoadSuccess':
          this.downLoadSuccessFn(row)
          break
        case 'downLoadError':
          this.downLoadErrorFn(row)
          break
        default:
          break
      }
    },
    progressCheckFn(row) {
      this.$router.push({ name: 'OperateNewComplain', params: { batchId: row.batchId }})
    },
    downLoadSuccessFn(row) {
      const params = {
        type: 0,
        batchId: row.batchId
      }
      exportBatchRecord(params).then(res => {
        if (res.type === 'application/octet-stream') {
          createBlob(`投诉单成功导出数据-${moment().format('YYYY-MM-DD')}.xlsx`, res)
          Message.success('导出成功')
        } else {
          Message.error('导出失败')
        }
      })
    },
    downLoadErrorFn(row) {
      const params = {
        type: 1,
        batchId: row.batchId
      }
      exportBatchRecord(params).then(res => {
        createBlob(`投诉单失败导出数据-${moment().format('YYYY-MM-DD')}.xlsx`, res)
        if (res.type === 'application/octet-stream') {
          Message.success('导出成功')
        } else {
          Message.error('导出失败')
        }
      })
    },
    getList() {
      const { listQuery } = this
      batchComplaintList({
        pageNumber: (listQuery.page) * 1 - 1,
        pageSize: listQuery.limit,
        type: listQuery.type
      }).then(res => {
        const data = res.payload || {}
        this.list = data.data || []
        this.total = (data.total) * 1 || 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
