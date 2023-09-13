<template>
  <div>
    <el-drawer
      :visible.sync="isShow"
      :destroy-on-close="true"
      :before-close="handleClose"
      size="50%"
      class="drawer-approval-detail"
    >
      <template v-slot:title>
        <h2>
          随材打包申请
        </h2>
      </template>
      <div class="approvallk">
        <el-row>
          <el-col :offset="1" :span="23"><h4>审批详情</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请人:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.applyName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请部门:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.applyDepartment
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">用户电话:</el-col>
          <el-col :span="19" :offset="1">
            <a
              style="color:#3C56F2"
              target="_blank"
              @click="devATestChange()"
            >
              {{ drawerApprovalDeatail.userTel }}
            </a>
            <svg-icon
              style="cursor: pointer"
              :icon-class="userTelIcon"
              @click="isDisturbMobile()"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订单号:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="4">当前物流状态:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.currentExpress
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请理由:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.applyReason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">打包数量:</el-col>
          <el-col :span="19" :offset="1">
            {{ drawerApprovalDeatail.packageCount }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">商品信息:</el-col>
          <el-col :span="19" :offset="1">
            <div
              v-for="(childItem,
                      childIndex) of drawerApprovalDeatail.packageProductParse"
              :key="childIndex"
              class="array-info-class"
            >
              <div class="array-info-item">
                商 品:{{ childItem.name && childItem.name }}
              </div>
              <div class="array-info-item">
                版 本:{{ childItem.proVersion && childItem.proVersion }}
              </div>
              <div class="array-info-item">
                商品码:{{
                  childItem.centerProductCode && childItem.centerProductCode
                }}
              </div>
            </div>
            {{
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="23"><h4>审批节点</h4></el-col>
          <el-col :offset="1" :span="22">
            <el-table
              :data="tableDataNode"
              :header-cell-style="{
                background: 'rgba(31,116,249,.7)',
                color: '#fff'
              }"
            >
              <el-table-column
                prop="approvalName"
                label="发起人/审核人"
                align="center"
              />
              <el-table-column prop="statusStr" label="审批状态" align="center" />
              <el-table-column
                prop="approvalRemark"
                label="审批意见"
                align="center"
              />
              <el-table-column label="操作时间" align="center">
                <template slot-scope="scope">
                  {{ timeFormate(scope.row.utime) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="name === '1'">
          <el-col
            :span="22"
            :offset="1"
            style="text-align:right;padding-top:5px"
          >
            <el-button @click="comfirmEnd(0)">拒绝</el-button>
            <el-button type="primary" @click="comfirmEnd(1)">同意</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { formatTeamNameSup } from '@/utils/supList'
import * as tools from '@/utils/mini_tool_lk'
import {
  getPackageInfo,
  getFlowDetailNodeTable,
  queryUserMobile,
  isAggrePass
} from '@/api/myExamine'

export default {
  name: 'Package',
  components: {},
//   inject: ['cr'],
  props: {
    name: { type: String, default: '' },
    staffId: { type: String, default: '' },
    realName: { type: String, default: '' },
    forSonDataApprovalId: {
      type: String,
      default: ''
    },
    forSonDataApprovalPersonId: {
      type: String,
      default: ''
    },
    activeChannelState: {
      type: String,
      default: ''
    },
    channelPidValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userTelIcon: 'eye',
      tableDataNode: [], // 审批流程节点-专有接口获取
      isShow: false,
      formatTeamNameSup,
      drawerApprovalDeatail: {}
    }
  },
  computed: {
    timeFormate() {
      return tools.formatDate
    }
  },
  async mounted() {
    await this.getAllData()
    this.getTableNode()
  },
  methods: {
    devATestChange() {
      const BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
      const subjects = {
       users: 'ART_APP',
       write_app: 'WRITE_APP',
       music_app: 'MUSIC_APP',
       dance_app: 'DANCE_APP'
     }
       let subject = ''
        for (const key in subjects) {
          if (subjects[key] === this.activeChannelState) {
             subject = key
          }
        }
        window.open(BOSS_HOST_XX + '/' + subject + '/#/details/' + this.drawerApprovalDeatail.userId)
    },
    // 抽屉详细信息-done
    async getAllData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const { code, payload } = await getPackageInfo({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }
      ).finally(() => {
        loading.close()
      })
      if (!code && payload) {
        payload.packageProductParse = JSON.parse(payload.packageProduct)
        this.drawerApprovalDeatail = payload
      } else {
        this.$message.error('右边框数据加载失败')
        this.drawerApprovalDeatail = {}
      }
    },
    async getTableNode() {
      // 抽屉里审核流程table
       await getFlowDetailNodeTable({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }).then(({ code, payload }) => {
        if (!code) {
          this.tableDataNode = payload
        }
      })
    },
    // 审批按钮操作-done
    comfirmEnd(assert) {
      this.$prompt('请输入审批原因', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        inputValue: !assert ? '' : '同意'
      }).then(({ value }) => {
        if (/\S+/g.test(value)) {
          const params = {
            realName: this.realName,
            staffId: this.staffId,
            flowApprovalId: this.forSonDataApprovalId,
            approvalRemark: value,
            isConfirm: true,
            channelPid: this.channelPidValue,
            subject: this.activeChannelState
          }
          if (!assert) {
            params.isConfirm = false
          }
          isAggrePass(params).then(({ code }) => {
            if (!code) {
              this.$message.success('审核处理完成')
              this.handleClose() // 关闭抽屉自身
            }
          })
        } else {
          this.$message.error('审批原因是必填项')
        }
      })
    },
    // 关闭抽屉-done
    handleClose() {
      this.isShow = false
    },
    // 用户电话的加密眼睛
    async isDisturbMobile() {
      const { drawerApprovalDeatail: { userTel, userId }, activeChannelState, staffId, userTelIcon } = this
      const data = {
        subject: activeChannelState,
        uid: userId, // 用户id
        operatorId: staffId
      }
      if (userTelIcon === 'eye') {
        const res = await queryUserMobile(data)
        const {
            code,
            payload: { mobile }
          } = res
          if (code === 0) {
            if (mobile) {
              this.userTelIcon = 'eye-open'
              this.drawerApprovalDeatail.userTel = mobile
            }
          }
      } else {
        this.userTelIcon = 'eye'
        this.drawerApprovalDeatail.userTel = `${userTel.slice(0, 3)}****${userTel.slice(-4)}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-approval-detail {
  padding-top: 50px;
  font-size: 16px;
  .el-drawer {
    overflow: auto;
  }
}
.array-info-class {
  margin-bottom: 20px;
  .array-info-item {
    height: 20px;
  }
}
// el原类名追加样式
.approvallk {
  padding-left: 10px;
}
.approvallk .el-row {
  margin-bottom: 10px;
}
.approvallk .el-row:nth-last-of-type {
  margin-bottom: 0;
}
.approvallk .el-row .el-col-4 {
  text-align: right;
}
</style>
