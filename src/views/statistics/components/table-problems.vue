<template>
  <div class="components-problems-table">
    <div class="table-up">
      <div class="text-box">
        投诉来源：
        <span class="font-bold">全部</span>
        <span class="font-bold">共{{ total }}条投诉</span>
      </div>
      <el-button plain @click="download">下载数据</el-button>
    </div>
    <div class="table-content">
      <basics-table
        ref="table"
        :table="table"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import columns from './columns/table-problem-list'
import { exportProblem } from '@/api/statistics/problem'
import { createBlob } from '@/utils'
export default {
  name: 'ComponentProblemsTable',
  components: { BasicsTable },
  props: {
    propData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      columns: columns,
      total: 0,
      table: {
        stripe: false,
        border: false
      }
    }
  },
  methods: {
    getList(data) {
      this.total = data.total
      this.list = data.countList
    },
    download() {
      const data = {
        createDateBegin: this.propData.createDateBegin,
        createDateEnd: this.propData.createDateEnd
      }
      if (this.propData.channelPid) {
        data.channelPid = this.propData.channelPid
      }
      exportProblem(data).then(res => {
        createBlob(`投诉问题统计.xls`, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-problems-table {
  .table-up {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .text-box {
      flex: 1;
      font-size: 13px;
      .font-bold {
        font-weight: bold;
        margin-right: 10px;
      }
    }
  }
  /deep/ .pagination-container {
    display: none;
  }
}
</style>
