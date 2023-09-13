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
          退款审批
        </h2>
      </template>
      <div class="approvallk">
        <el-row>
          <el-col :offset="1" :span="23"><h4>审批详情</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请人:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.applyUserName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请部门:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.applyUserDeapartmentName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">用户电话:</el-col>
          <el-col
            :span="19"
            :offset="1"
          >
            <a
              style="color:#3C56F2"
              target="_blank"
              @click="devATestChange()"
            >
              {{ drawerApprovalDeatail.customerPhone }}
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
          <el-col
            :span="19"
            :offset="1"
          >{{ drawerApprovalDeatail.outTradeNo
          }}<span
            v-if="drawerApprovalDeatail.isImport"
            style="color:red"
          >(此为第三方导入订单)</span></el-col>
        </el-row>
        <el-row v-if="drawerApprovalDeatail.channelOuterName">
          <el-col :span="4">订单来源:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.channelOuterName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">业务类型:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.regType
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">商品信息:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.productMsg
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">退款规则:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.refundRule ? '不符合' : '符合'
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">支付币种:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              RMB: '人民币',
              CNY: '人民币',
              USD: '美元',
              HKD: '港币',
              TWD: '台币'
            }[drawerApprovalDeatail.coinType]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">交易金额:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.orderFee
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">剩余金额:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.residueFee
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">支付渠道:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.channel
          }}</el-col>
        </el-row>
        <el-row v-if="drawerApprovalDeatail.payeeName">
          <el-col :span="4">收款人姓名:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.payeeName
          }}</el-col>
        </el-row>
        <el-row v-if="drawerApprovalDeatail.payeeAccount">
          <el-col :span="4">支付宝账号:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.payeeAccount
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">退款类型:</el-col>
          <el-col :span="19" :offset="1">{{
            {
              0: '优惠券退款',
              1: '课程退款',
              2: '降半年包',
              3: '补偿',
              4: '降1年包',
              5: '降1年半包',
              6: '训练营补差',
              7: '器材退款',
              8: '体验课退差价',
              9: '预付款优惠券退款'
            }[drawerApprovalDeatail.refundType]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">已上课周期:</el-col>
          <el-col :span="19" :offset="1">{{
            `
           ${Math.floor(
             drawerApprovalDeatail.periodAlready / 4
            )}月${drawerApprovalDeatail.periodAlready % 4}周
           `
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">关单赠品:</el-col>
          <el-col :span="19" :offset="1">
            <span
              v-if="
                !(
                  drawerApprovalDeatail.productList &&
                  drawerApprovalDeatail.productList.length
                )
              "
            >不扣除赠品费用</span>
            <el-table
              v-if="
                drawerApprovalDeatail.productList &&
                  drawerApprovalDeatail.productList.length
              "
              ref="multipleTable"
              :data="drawerApprovalDeatail.productList"
              tooltip-effect="dark"
              style="width: 50%"
              border
            >
              <el-table-column
                label="赠品信息"
                prop="name"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column prop="price" label="赠品价格" min-width="120" />
            </el-table>
          </el-col>
        </el-row>
        <el-row
          v-if="
            drawerApprovalDeatail.deductMonth === 1 ||
              drawerApprovalDeatail.deductMonth === 0
          "
        >
          <el-col :span="4">次月课程:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.deductMonth === 1 ? '保留' : '不保留'
          }}</el-col>
        </el-row>
        <el-row
          v-if="
            drawerApprovalDeatail.deductMaterial === 1 ||
              drawerApprovalDeatail.deductMaterial === 0
          "
        >
          <el-col :span="4">随材盒子:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.deductMaterial === 1
              ? '扣除随材盒子费用'
              : '不扣除随材盒子费用'
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">退款金额:</el-col>
          <el-col :span="2" :offset="1">{{
            drawerApprovalDeatail.refundFee
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">退款原因:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.refundReason
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">退款说明:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.refundMsg
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">附件:</el-col>
          <el-col :span="19" :offset="1">
            <div class="demo-image__preview">
              <el-image
                v-if="drawerApprovalDeatail.attsUrl"
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.attsUrl"
                fit="contain"
                :preview-src-list="[drawerApprovalDeatail.attsUrl]"
              />
              <span v-else>未上传</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="23"><h4>审批节点</h4></el-col>
          <el-col :offset="1" :span="23" style="margin-bottom:10px">
            <mark>当前类别(可更改):</mark>
            <el-select
              v-model="diologRefundTagCopy"
              :style="{ 'margin-left': '10px', width: '140px' }"
              size="mini"
              @change="diologRefundTagChange"
            >
              <el-option
                v-for="(value, key) in {
                  未分类: 'NONE',
                  家长考虑中: 'PARENT_HESITANT',
                  物流退回中: 'EXPRESS_NOT_RETURN',
                  未联系上家长: 'CANT_CONTACT_PARENT',
                  挽单试听1V1: 'WD_TRIAL_1V1',
                  挽单试听小班课: 'WD_TRIAL_SMALL'
                }"
                :key="value"
                :label="key"
                :value="value"
              />
            </el-select>
          </el-col>
          <el-col :offset="1" :span="22">
            <el-table
              :data="tableDataNode"
              :header-cell-style="{
                background: '#3C56F2',
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
              <el-table-column label="审批自动通过剩余时间" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.autoApprovalTimeSwitch === 'OPEN'"
                    style="color:red"
                  >{{
                    scope.row.autoApprovalTime
                      ? formatTime(scope.row.autoApprovalTime, false)
                      : '--'
                  }}</span>
                  <span
                    v-else-if="scope.row.autoApprovalTimeSwitch === 'CLOSE'"
                    style="color:red"
                  >{{ '自动通过计时中止,审批不会自动通过' }}</span>
                  <span v-else style="color:red">{{ '--' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作时间" align="center">
                <template slot-scope="scope">
                  {{ timeFormate(scope.row.utime) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="name === '1'">
          <el-col :span="22" :offset="1" style="text-align:right;padding-top:5px">
            <el-button
              @click="dialogFormVisible_checkbox = true"
            >拒 绝</el-button>
            <el-button
              type="primary"
              @click="ensureReplenish"
            >同 意</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <!-- 退款-拒绝后的dialog_with_checkbox -->
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible_checkbox"
      :destroy-on-close="true"
      :before-close="destroylkCheckbox"
    >
      <el-form
        ref="refundForm_checkbox"
        :model="form_checkbox"
        label-position="top"
        :rules="rules_checkbox"
      >
        <el-form-item label="请输入原因" prop="reason">
          <el-input v-model="form_checkbox.reason" />
        </el-form-item>
        <el-form-item label="恢复学生放课与随材物流" prop="isRecover">
          <el-switch
            v-model="form_checkbox.isRecover"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="confirmCheckbox">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改金额弹窗-->
    <el-dialog
      title="修改金额"
      :visible.sync="changeCapital"
      :destroy-on-close="true"
      :before-close="destroyCapital"
    >
      <el-form
        ref="refundForm_capital"
        :model="form_capital"
        label-position="top"
        :rules="rules_capital"
      >
        <el-form-item label="键入修改金额" prop="cash">
          <el-input
            type="number"
            step="0.01"
            :value="form_capital.cash"
            @input="form_capital.cash = $event.replace(/[^0-9.]/g, '')"
          />
        </el-form-item>
        <el-form-item label="特殊说明" prop="explain">
          <el-input
            v-model="form_capital.explain"
            type="textarea"
            :rows="4"
            placeholder="请输入修改金额的理由"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="confirm_capital">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { formatTeamNameSup } from '@/utils/supList'
import { formatTime, debounce } from '@/utils/mini_tool_lk'
import * as tools from '@/utils/mini_tool_lk'
import {
  updateAutoApprovalTime,
  getFlowDetail,
  getFlowDetailNodeTable,
  diologRefundTagChange,
  queryUserMobile,
  isAggrePass
} from '@/api/myExamine'
export default {
  name: 'RefundDrawer',
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
    diologRefundTag: {
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
    // 修改金额的自定义校验
    var validateName = (rule, value, callback) => {
      if (Number(value) !== parseFloat(value)) {
        // 防一手科学计数法e(事件里处理了负号)
        callback(new Error('金额里有杂质!'))
      } else {
        if (Number(value) > Number(this.drawerApprovalDeatail.residueFee)) {
          callback(new Error('当心！你已超过剩余金额!'))
        } else {
          callback()
        }
      }
    }
    return {
      userTelIcon: 'eye',
      interruptcantPoint: true,
      interruptShow: false,
      isShow: false,
      formatTeamNameSup,
      userId: getToken('userId'), // 当前登录人的id
      sraffmobile: getToken('userMobile'), // 当前登录人的手机号
      drawerApprovalDeatail: {}, // 详情normal
      tableDataNode: [], // 详情里-审批节点数据
      diologRefundTagCopy: '',
      userId_rescue: '', // 新建挽单记录表单提交 用到
      dialogFormVisible_checkbox: false, // 审批拒绝-关联物流弹窗
      // 审批拒绝关联物流弹窗form数据
      form_checkbox: {
        reason: '',
        isRecover: true
      },
      rules_checkbox: {
        // 审批拒绝关联物流弹窗form校验
        reason: [{ required: true, message: '请填写原因', trigger: 'blur' }],
        isRecover: [{ required: true, message: '是否恢复', trigger: 'change' }]
      },
      changeCapital: false, // 修改金额弹窗
      form_capital: {
        // 修改金额弹窗form数据
        cash: '',
        explain: ''
      },
      rules_capital: {
        // 审批拒绝关联物流弹窗form校验
        cash: [{ required: true, validator: validateName, trigger: 'blur' }],
        explain: [
          { required: true, message: '不能闷声改金额', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    formatTime: () => formatTime,
    timeFormate() {
      return tools.formatDate
    }
  },
  async mounted() {
   await this.getAllData()
    this.diologRefundTagCopy = this.diologRefundTag // 单项数据流-基本类型值deepclone
  },
  methods: {
    devATestChange() {
      const BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
      const subjects = {
       users: 'ART_APP',
       write_app: 'WRITE_APP',
       music_app: 'MUSIC_APP',
       dance_app: 'DANCE_APP',
       handwork_app: 'HANDWORK_APP'
     }
       let subject = ''
        for (const key in subjects) {
          if (subjects[key] === this.activeChannelState) {
             subject = key
          }
        }
        window.open(BOSS_HOST_XX + '/' + subject + '/#/details/' + this.drawerApprovalDeatail.userId)
    },
    // 关闭自身抽屉-beforeClose
    handleClose() {
      this.isShow = false
    },
    // 手动中止自动通过计时_防抖
    interrupt: debounce(async function() {
      const { code } = await updateAutoApprovalTime({
        flowApprovalId: this.forSonDataApprovalId,
        approvalId: this.staffId,
        autoApprovalTimeSwitch: 'CLOSE'
      })
      if (code === 0) {
        this.$message.success('手动中止成功')
        // 刷新抽屉详细-2信息(normal+table审批节点)+中止按钮状态
        this.getAllData()
      } else {
        this.$message.error('手动中止失败')
      }
    }, 2000),
    // 抽屉详细-2信息(normal+table审批节点)
    async getAllData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })

      const { code, payload } = await getFlowDetail({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }
      ).finally(() => {
        loading.close()
      })
      if (!code && payload) {
        payload.ctimeFormdate = tools.formatDate(payload.ctime)
        this.drawerApprovalDeatail = payload
        this.userId_rescue = payload.userId // 挽救单子表单提交用到
      } else {
        this.$message.error('右边框数据加载失败')
        this.drawerApprovalDeatail = {}
      }
      // another-interface:table审批节点
      getFlowDetailNodeTable({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }).then(({ code, payload }) => {
        if (!code) {
          this.tableDataNode = payload
        } else {
          this.$message.warning('右边框审批节点table数据加载失败')
        }
      })
    },
    // 审批-拒绝弹窗-beforeClose
    destroylkCheckbox() {
      this.$refs.refundForm_checkbox.resetFields()
      this.dialogFormVisible_checkbox = false
    },
    // 审批-拒绝弹窗-确认拒绝按钮(只有确认按钮)
    confirmCheckbox() {
      this.$refs.refundForm_checkbox.validate(async(valid) => {
        if (valid) {
          const params = {
            isRecover: this.form_checkbox.isRecover ? 1 : 0,
            approvalRemark: this.form_checkbox.reason,
            flowApprovalId: this.forSonDataApprovalId,
            isConfirm: false,
            staffId: this.staffId,
            realName: this.realName,
            channelPid: this.channelPidValue,
            subject: this.activeChannelState
          }
          isAggrePass(params).then((res) => {
            if (!res.code) {
              this.$message.success('审核处理完成')
              this.destroylkCheckbox() // 关闭审批拒绝弹窗
              this.handleClose() // 关闭抽屉自身
            }
          })
        } else {
          return false
        }
      })
    },
    // 审批-同意
    ensureReplenish() {
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputValue: '同意',
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.forSonDataApprovalId,
            isConfirm: true,
            staffId: this.staffId,
            realName: this.realName,
            channelPid: this.channelPidValue
          }
          isAggrePass(params).then((res) => {
            if (!res.code) {
              this.$message.success('审核处理完成')
              this.handleClose() // 关闭抽屉自身
            }
          })
        })
        .catch(() => {})
    },
    // 修改金额弹窗(只有确认按钮)-beforeClose
    destroyCapital() {
      this.$refs.refundForm_capital.resetFields()
      this.changeCapital = false
    },
    // 修改金额弹窗-确认按钮
    confirm_capital() {
      this.$refs.refundForm_capital.validate(async(valid) => {
        if (valid) {
          const { code } = await this.$http.Backend.changeCash({
            flowApprovalId: this.forSonDataApprovalId,
            refundFee: this.form_capital.cash,
            refundMsg: this.form_capital.explain
          })
          if (code === 0) {
            this.$message.success('修改金额成功')
            this.drawerApprovalDeatail.refundFee = this.form_capital.cash // 更新-抽屉详情_退款金额
            this.destroyCapital() // 关闭修改金额弹窗
          } else {
            this.$message.warning('修改金额失败')
          }
        } else {
          return false
        }
      })
    },
    // 退款抽屉-标签类型更改
    diologRefundTagChange(val) {
      diologRefundTagChange({
        id: this.forSonDataApprovalId,
        tag: val
      }).then(({ code }) => {
        !code && this.$message.success('标签类型修改成功')
      })
    },
    // 用户电话的加密眼睛
    async isDisturbMobile() {
      const { drawerApprovalDeatail: { customerPhone, userId }, activeChannelState, staffId, userTelIcon } = this
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
              this.drawerApprovalDeatail.customerPhone = mobile
            }
          }
      } else {
        this.userTelIcon = 'eye'
        this.drawerApprovalDeatail.customerPhone = `${customerPhone.slice(0, 3)}****${customerPhone.slice(-4)}`
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
