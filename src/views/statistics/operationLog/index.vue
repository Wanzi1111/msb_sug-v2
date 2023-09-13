
<template>
  <div class="home-container">
    <div class="app-container home-title">
      <span>操作日志</span>
      <el-date-picker
        v-model="valueDate"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        align="right"
        unlink-panels
        range-separator="至"
        :clearable="true"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      />
    </div>
    <div class="app-container">
      <el-tabs v-model="searchQuery.businessId" @tab-click="initPaginationAndGetList">
        <el-tab-pane v-for="(item, index) in channelTypeList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._k8s_api_complaint_api_v2_complaint_getComplaint" />
      </el-tabs>
      <basics-search ref="searchs" :loading="loadings._operation_resource_listResource" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch">
        <template slot="exButton">
          <basics-action :actions="act" style="padding: 0 10px;display: flex;align-items: center;" />
        </template>
      </basics-search>
      <basics-table
        :table="table"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :loading="loadings._k8s_api_complaint_api_operation_logList"
        :list-query="listQuery"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getLogList } from '@/api/log/operationLog'
import { downloadFileWithPath } from '@/utils/index'
import columns from './columns'
import searchs from './searchs'
import { default as act } from './actions/index'
const init_pagination = {
  page: 1,
  limit: 20
}

export default {
  name: 'OperationLog',
  data() {
    return {
      columns,
      searchs,
      list: [],
      total: 0,
      listQuery: { ...init_pagination },
      act: act({ exportOder: this.exportOder }),
      searchQuery: {
        businessId: '1011',
        createDateBegin: moment().subtract(1, 'M').format('YYYY-MM-DD 00:00:00'),
        createDateEnd: moment().format('YYYY-MM-DD 23:59:59')
      },
      channelTypeList: [
        {
          label: '1对1用户',
          value: '1011'
        },
        {
          label: '1对1老师',
          value: '1012'
        },
        {
          label: '小班课用户',
          value: '1021'
        },
        {
          label: '小班课老师',
          value: '1022'
        },
        {
          label: '小熊用户',
          value: '1031'
        },
        {
          label: '书法用户',
          value: '1041'
        },
        {
          label: '小熊音乐',
          value: '1051'
        },
        {
          label: '书画院用户',
          value: '1061'
        },
        {
          label: '小熊舞蹈用户',
          value: '1071'
        },
        {
          label: '小熊手工',
          value: '1081'
        },
        {
          label: '绘本创作',
          value: '2011'
        }
      ],
      valueDate: [moment().subtract(1, 'M').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
      table: {
        stripe: false,
        border: false
      }
    }
  },
  computed: {
    ...mapGetters(['loadings', 'operationEum'])
  },
  watch: {
    valueDate(newVal, oldVal) {
      console.log('valueDate', newVal, oldVal, [moment().subtract(1, 'M').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 改变表单
    changeSearch(val, oldVal) {
      if (val.operationPid && (val.operationPid !== oldVal.operationPid)) {
        const index = this.operationEum.findIndex(item => { return item.value === val.operationPid })
        this.$refs.searchs.set({
          type: 'options',
          data: {
            operationId: this.operationEum[index].sonList
          }
        })
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: {
            operationId: ''
          }
        })
      }
    },
    // 导出订单记录
    exportOder() {
      let paramArr = []
      if (this.searchQuery) {
        paramArr = Object.keys(this.searchQuery).map(v => {
          return `${v}=${this.searchQuery[v]}`
        })
      }
      downloadFileWithPath(`${process.env.VUE_APP_EXPORT_OPERATIONLOG}/api/complaint/api/operation/exportOperationLog?${paramArr.join('&')}`)
    },
    // 提交查询
    submitSearch(values) {
      for (const key in values) {
        if (values[key]) {
          this.searchQuery[key] = values[key]
        } else {
          delete this.searchQuery[key]
        }
      }
      this.searchQuery.createDateBegin = this.valueDate?.[0] || undefined
      this.searchQuery.createDateEnd = this.valueDate?.[1] || undefined
      this.initPaginationAndGetList()
    },
    // 重置分页，查询列表
    initPaginationAndGetList() {
      this.listQuery = { ...init_pagination }
      this.getList()
    },
    // 获取 列表数据
    async getList() {
      const { listQuery: { page, limit }, searchQuery } = this
      const payload = { ...searchQuery }
      try {
        const res = await getLogList({ pageNum: page - 1, pageSize: limit, ...payload })
        const { data, total } = res.payload
        this.list = data
        this.total = parseInt(total)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-width: 960px;
  .home-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    span {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 18px;
      line-height: 36px;
    }
  }
}
</style>
