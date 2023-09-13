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
          转入订单审批
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
          <el-col :span="4">转入订单号:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.importOrderNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">原支付方式:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              WE_CHAT: '微信',
              ALI_PAY: '支付宝',
              BANK: '银行'
            }[drawerApprovalDeatail.payWay]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">转入订单金额:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.importOrderFee
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">转入来源:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              IMPORT_1V1: '1对1转入',
              IMPORT_XBK: '小班课转入',
              IMPORT_OFFLINE: '线下对公转账'
            }[drawerApprovalDeatail.importSource]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">选择课程:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              PACKAGE_ID_3: '小熊美术年系统课—首单',
              PACKAGE_ID_27: '小熊美术半年系统课—首单'
            }[drawerApprovalDeatail.selectCourse]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">课程级别:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              S4: 'S1-基础',
              S1: 'S1-进阶',
              S2: 'S2-基础',
              S5: 'S2-进阶',
              S3: 'S3',
              S6: 'S3专项'
            }[drawerApprovalDeatail.selectSup]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">收货信息:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.receiptName +
              drawerApprovalDeatail.receiptTel +
              '----' +
              drawerApprovalDeatail.receiptAddressProvince +
              drawerApprovalDeatail.receiptAddressCity +
              drawerApprovalDeatail.receiptAddressArea +
              drawerApprovalDeatail.receiptAddressStreet +
              drawerApprovalDeatail.receiptAddressDetail
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">转入原因:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.reason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">附件:</el-col>
          <el-col :span="19" :offset="1">
            <div class="demo-image__preview">
              <span
                v-if="
                  drawerApprovalDeatail.attsUrl &&
                    drawerApprovalDeatail.attsUrl.split(',').length
                "
              >
                <el-image
                  v-for="(item, index) of drawerApprovalDeatail.attsUrl.split(
                    ','
                  )"
                  :key="index"
                  style="width: 120px; height: 120px;padding:3px"
                  :src="item"
                  fit="contain"
                  :preview-src-list="[item]"
                />
              </span>
              <span v-else>未上传</span>
            </div>
          </el-col>
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
import { formatTeamNameSup, SUP_LEVEL_UPPER } from '@/utils/supList'
import * as tools from '@/utils/mini_tool_lk'
import {
  entryOrderDetail,
  getFlowDetailNodeTable,
  isAggrePass
} from '@/api/myExamine'
export default {
  name: 'Classes',
  components: {},
  props: {
    name: { type: String, default: '' },
    staffId: { type: String, default: '' },
    realName: { type: String, default: '' },
    userDrawerId: { type: String, default: '' },
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
      SUP_LEVEL_UPPER,
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
        window.open(BOSS_HOST_XX + '/' + subject + '/#/details/' + this.userDrawerId)
    },
    // 抽屉详细信息-done
    async getAllData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const { code, payload } = await entryOrderDetail({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }
      ).finally(() => {
        loading.close()
      })
      if (!code && payload) {
        this.drawerApprovalDeatail = payload
        // 如果获取过来的手机号不是脱敏的就处理一下
        if (!payload.userTel.includes('*')) {
        this.drawerApprovalDeatail.newuserTel = payload.userTel
        this.drawerApprovalDeatail.userTel = `${payload.userTel.slice(0, 3)}****${payload.userTel.slice(-4)}`
        }
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
      const { drawerApprovalDeatail: { userTel, newuserTel }} = this
    if (userTel.includes('*')) {
      this.userTelIcon = 'eye-open'
      this.drawerApprovalDeatail.userTel = newuserTel
    } else {
      this.userTelIcon = 'eye'
      this.drawerApprovalDeatail.userTel = `${newuserTel.slice(0, 3)}****${newuserTel.slice(-4)}`
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
