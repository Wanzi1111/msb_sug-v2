<template>
  <div>
    <el-dialog
      title="赔付历史"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-table :data="claimsHistoryData">
        <el-table-column property="approvalNo" label="赔付单号" width="150">
          <template slot-scope="scope">
            <a style="color:#3C56F2" @click="tableAction(scope.row)">{{ scope.row.approvalNo }}</a>
          </template>
        </el-table-column>
        <el-table-column property="outTradeNo" label="关联订单号" width="200" />
        <el-table-column property="currencyType" label="赔付方式" align="center">
          <template slot-scope="scope">
            <span>{{ currencyTypeMap[scope.row.currencyType] }}</span>
          </template>
        </el-table-column>
        <el-table-column property="amount" label="赔付方案" align="center" show-overflow-tooltip width="170">
          <template slot-scope="scope">
            <span v-if="scope.row.currencyType === 6">{{ scope.row.goods.toString() }}</span>
            <span v-else>{{ `${scope.row.amount} ${scope.row.currencyType === 4 ? channelPidMap[scope.row.channelPid] : currencyTypeMap[scope.row.currencyType]}` }}</span>
          </template>

        </el-table-column>
        <el-table-column property="status" label="审批状态" align="center">
          <template slot-scope="scope">
            <span>{{ statusMap[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column property="ctime" label="创建时间" width="200" align="center" />
        <el-table-column property="createName" label="操作人" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getClaimsList } from '@/api/myExamine'
import { mapState } from 'vuex'
export default {
  name: 'ClaimsHistory',
  props: {
    claimsHistoryFlag: { type: Boolean },
    userId: { type: String, default: '' }
  },
  computed: {
    ...mapState('global', ['cpStatusData'])
  },
  data() {
    return {
      visible: this.claimsHistoryFlag,
      claimsHistoryData: [],
      statusMap: {
        0: '待审批',
        1: '审批通过',
        2: '审批拒绝',
        3: '审批撤销',
        4: '审批完成'
      },
      currencyTypeMap: {
        2: '小熊币',
        3: '金币',
        4: '课时',
        6: '实物'
      },
      channelPidMap: {
        1011: '1v1课时',
        1021: '小班课课时'
      }
    }
  },
  watch: {
    claimsHistoryFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getClaimsListFn()
    })
  },
  methods: {
    getClaimsListFn() {
      const loading = this.$loading({
        lock: true
      })
      getClaimsList({ userId: this.userId }).then(res => {
        loading.close()
        const { code, payload } = res
        if (code === 0) {
          this.claimsHistoryData = payload.data.map(val => {
            val.goods = val.goods?.map(item => {
                item.text = item.productName + '/' + item.productSum
              return item.text
            })
            return val
          })
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    tableAction(row) {
     if (row.approvalNo && row.channelPid) {
       const openHerf = this.$router.resolve({
         path: '/claimsApproval',
         query: {
           approvalNo: row.approvalNo,
           channelPid: row.channelPid
         }
        })
        window.open(openHerf.href, '_blank')
     }
    }
  }
}
</script>
<style style='scss' scoped>
</style>
