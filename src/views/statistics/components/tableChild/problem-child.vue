<template>
  <div class="component-problem-child">
    <basics-table
      ref="table"
      :loading="loadings._k8s_api_complaint_api_statistics_problemSon"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
    >
      <template slot="classifyRate" slot-scope="scope">
        <div>{{ scope.row.classifyRate + '%' }}</div>
      </template>
      <template slot="problemRate" slot-scope="scope">
        <div>{{ scope.row.problemRate + '%' }}</div>
      </template>
    </basics-table>
  </div>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import columns from './columns/problem-child-list'
import { problemSon } from '@/api/statistics/problem'
import { mapGetters } from 'vuex'
export default {
  name: 'ComponentProblemChild',
  components: { BasicsTable },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: [],
      columns: columns,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const data = { }
      Object.assign(data, {
        createDateBegin: this.row.createDateBegin,
        createDateEnd: this.row.createDateEnd,
        problemPid: this.row.problemIdNew
      })
      problemSon({
        ...data
      }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.total = res.payload.total
          this.list = res.payload
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.component-problem-child {}
</style>
