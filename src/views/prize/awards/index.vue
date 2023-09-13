<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="gLoadings._ums_api_activity_userPrize_getUserPrize" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :loading="gLoadings._ums_api_activity_userPrize_getUserPrize"
      :get-list="getList"
      v-bind="gTable"
    />

    <!--导出-->
    <el-dialog
      title="导出"
      :visible.sync="gVisible.visible"
      width="500px"
      :before-close="() => changeGVisible('visible', false)"
    >
      <basics-form
        :key="gVisible.visible"
        ref="addShow"
        :loading="gLoadings._ums_api_activity_userPrize_exportUserPrize"
        :forms="forms"
        :actions="formActions"
        @submitForm="submitForm"
      />
    </el-dialog>

    <p-view v-if="gVisible.viewVisible" :id="actId" :visible="gVisible.viewVisible" :close="() => changeGVisible('viewVisible', false)" />
    <imports v-if="gVisible.importVisible" :visible="gVisible.importVisible" :close="closeImports" />
  </div>
</template>

<script>

import actions from './actions'
import columns, { actions as tableActions } from './columns'
import searchs from './searchs'
import forms, { actions as formActions } from './forms'
import mixins from '@/mixins'
import moment from 'moment'
import PView from './components/View'
import Imports from './components/Imports'
import { createBlob } from '@/utils'

export default {
  name: 'PrizeAwards',
  components: { Imports, PView },
  mixins: [mixins.table],
  data() {
    return {
      actions: actions({ exports: this.exports, imports: this.imports }),
      searchs: searchs,
      gTable: {
        columns: columns,
        listQuery: {
          page: 1,
          limit: 10
        },
        actionFunction: tableActions({ view: this.view })
      },
      forms: forms,
      formActions: formActions({ closeDl: () => this.changeGVisible('visible', false) }),
      actId: null,
      box: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      const { query, listQuery } = this.gTable
      this.$api.getUserPrize({
        ...query,
        pageNo: listQuery.page - 1,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.payload || {} // TODO
        this.gTable.list = data.content || []
        this.gTable.total = parseInt(data.totalElements || 0)
      })
      // this.gTable.list = [{ id: 1 }, { id: 2 }]
    },
    // 搜索
    submitSearch(val) {
      this.gTable.listQuery = {
        page: 1,
        limit: 10
      }
      this.gTable.query = val
      this.getList()
    },
    // 导出
    submitForm(val) {
      const time = val.time || []
      const beginTime = time[0] ? moment(time[0]).format('YYYY-MM-DD') : ''
      const endTime = time[1] ? moment(time[1]).format('YYYY-MM-DD') : ''
      this.$api.exportUserPrize({
        ...val,
        beginTime: beginTime,
        endTime: endTime
      }).then(res => {
        createBlob(`获奖列表-${moment().format('YYYY-MM-DD')}.xls`, res)

        this.$message.success('导出成功')
        this.changeGVisible('visible', false)
      })
    },
    // 打开导出
    exports(sta = false) {
      this.changeGVisible('visible')
      this.changeGVisible('isEdit', sta)
    },
    // 导入
    imports() {
      this.changeGVisible('importVisible')
    },
    // 详情
    view(id) {
      this.actId = id
      this.changeGVisible('viewVisible')
    },
    closeImports(sta = 0) {
      this.changeGVisible('importVisible', false)
      if (sta === 1) {
        this.getList()
      }
    }
  }
}
</script>
