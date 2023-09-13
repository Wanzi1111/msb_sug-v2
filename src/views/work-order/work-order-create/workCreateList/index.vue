<template>
  <div>
    <div class="app-container app-complain-title">
      <span>创建工单</span>
      <div>
        <basics-action :actions="act" />
      </div>
    </div>

    <div class="app-container">
      <el-tabs v-model="activeTabsOneValue">
        <el-tab-pane
          v-for="item in TabList"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          :disabled="item.disabled"
        >
          <span slot="label" class="tabpaneBadge">
            {{ item.label }}
          </span>
        </el-tab-pane>
      </el-tabs>
      <div>
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
  </div>
</template>
<script>
import TabList from './config'
import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import columns, { actions } from './columns'
import { mapGetters } from 'vuex'
import { default as act } from './action'
import { batchComplaintList, exportBatchRecord } from '@/api/operate/createSug'
import { createBlob } from '@/utils'
import { Message } from 'element-ui'
import moment from 'moment'
export default {
  name: '',
  components: { BasicsTable, BasicsAction },
  data() {
    return {
      act: act({ addSug: this.addSug, jump: this.jump }),
      total: 0,
      list: [],
      TabList,
      activeTabsOneValue: '2',
      columns,
      Visible: false,
      actionObj: {},
      actionFunction: actions({
        tableAction: this.tableAction
      }),
      table: {
        stripe: false,
        border: false
      },
      listQuery: {
        page: 1,
        limit: 20,
        type: 2
      },
      query: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
      activeTabsOneValue: function(val, oldval) {
          this.listQuery.type = val
          this.getList()
      }
  },
  created() {
      this.getList()
  },
  methods: {
    //   跳入创建工单页面
    addSug() {
      this.$router.push({ name: 'workOrderCreate', params: { type: this.activeTabsOneValue }})
    },
    jump() {
      this.$router.push({ name: 'batchImport', params: { type: this.activeTabsOneValue }})
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
    // 列表请求
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
<style lang='scss' scoped>
.app-complain-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 18px;
    line-height: 36px;
  }
}
</style>
