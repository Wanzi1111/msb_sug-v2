<template>
  <div>
    <el-dialog title="售后历史" :visible.sync="visible" width="500px">
      <el-table :data="gridData">
        <el-table-column property="problemTwoName" label="售后类型">
          <template slot-scope="scope">
            <a style="color:#3C56F2" @click="tableAction(scope.row.complaintNo)">{{ scope.row.problemTwoName }}</a>
          </template>
        </el-table-column>
        <el-table-column property="ctime" label="售后时间" width="200" />
        <el-table-column property="cpStatus" label="售后状态">
          <template slot-scope="scope">
            <span>{{ cpStatusData[scope.row.cpStatus] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAfterSaleHistory } from '@/api/operate/complainNew'
import { mapState } from 'vuex'
export default {
  name: 'AfterHistory',
  props: {
    afterHistoryFlag: { type: Boolean },
    afterSaleId: { type: String, default: '' }
  },
  computed: {
    ...mapState('global', ['cpStatusData'])
  },
  data() {
    return {
      visible: this.afterHistoryFlag,
      gridData: []
    }
  },
  watch: {
    afterHistoryFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAfterSaleHistory()
    })
  },
  methods: {
    getAfterSaleHistory() {
      getAfterSaleHistory({ afterSaleId: this.afterSaleId }).then(res => {
        const { code, payload } = res
        if (code === 0) {
          this.gridData = payload
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    tableAction(value) {
      window.open(`/workOrder/newAfterSaleDetail/${value}`)
    }
  }
}
</script>
<style style='scss' scoped>
</style>
