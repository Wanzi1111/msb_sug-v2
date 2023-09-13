<template>
  <div>
    <div class="title-container">
      <basics-title title="数据详情" :line="false" />
    </div>
    <div class="app-container">
      <basics-info
        :info="[
          {label: '投放ID：', value: detail.id},
          {label: '物料名称：', value: detail.resourceName},
          {label: '投放时间：', value: `${detail.startTime} ~ ${detail.endTime || '不限'}`, layer: 'large'},
          {label: '点击量：', value: detail.clickCount},
        ]"
      />
      <basics-title
        title="数据统计"
        :actions="[{
          type: 'button', // 按钮
          label: '导出数据',
          click: exports,
          attr: {
            type: 'primary',
            icon: 'el-icon-download'
          }
        }]"
      />
      <basics-table
        :table="table"
        :loading="loadings._operation_resource_clickDetails"
        :list="list"
        :columns="columns"
        :total="0"
        :list-query="listQuery"
      />
    </div>
  </div>
</template>

<script>
import { publishList } from '@/api/advert/put'
import { dataAttr, exportClickReport } from '@/api/advert/put-log'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsInfo from '@/components/BasicsInfo'
import BasicsTable from '@/components/BasicsTable'
import moment from 'moment'
import { createBlob } from '@/utils'
import columns from './columns/detail'
import { mapGetters } from 'vuex'

export default {
  name: 'PutLogDetail',
  components: { BasicsTitle, BasicsInfo, BasicsTable },
  data() {
    return {
      table: { stripe: true },
      id: this.$route.params.id,
      detail: {},
      list: [],
      columns: columns,
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
    this.getDetail()
    this.getData()
  },
  methods: {
    // 获取物料详情
    getDetail() {
      publishList({ id: this.id }, {
        pageNum: 1,
        pageSize: 1
      }).then(res => {
        const data = res.data || {}
        const list = data.list || []
        this.detail = {}
        if (list.length) {
          this.detail = list[0]
        }
      })
    },
    // 数据统计
    getData() {
      dataAttr({ publishId: this.id }).then(res => {
        this.list = res.data || []
      })
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 导出
    exports() {
      exportClickReport({ publishId: this.id }).then(res => {
        createBlob(`广告位数据统计-${moment().format('YYYY-MM-DD')}.xls`, res)
      })
    }
  }
}
</script>
