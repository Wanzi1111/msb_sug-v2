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
          补发货审批
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
          <el-col :span="4">补发类别:</el-col>
          <el-col :span="19" :offset="1">{{
            types[drawerApprovalDeatail.type]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">收货信息:</el-col>
          <el-col :span="19" :offset="1">{{
            `${drawerApprovalDeatail.receiptName +
              '' +
              drawerApprovalDeatail.receiptTel}~~${drawerApprovalDeatail.receiptAddressProvince +
              '' +
              drawerApprovalDeatail.receiptAddressCity +
              '' +
              drawerApprovalDeatail.receiptAddressArea +
              '' +
              drawerApprovalDeatail.receiptAddressDetail}`
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订单号:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">课程进度:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.currentLesson
          }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="4">补发商品:</el-col>
          <el-col :span="19" :offset="1">
            <span
              v-for="item of drawerApprovalDeatail.productdetails"
              :key="item.id"
            >{{ `${item.name}(${item.count})` }}</span>
            <!--盒子随材单件补发&&(系统课or体验课)-->
            <span
              v-if="
                drawerApprovalDeatail.mode === 'SINGLE' &&
                  [1, 2].includes(drawerApprovalDeatail.courseType)
              "
            >
              【
              {{ ['体验课', '系统课'][drawerApprovalDeatail.courseType - 1] }}
              {{ drawerApprovalDeatail.sup }}
              {{ drawerApprovalDeatail.level }}
              】
            </span>
          </el-col>
        </el-row>
        <el-row v-show="+drawerApprovalDeatail.stage !== 0">
          <el-col :span="4">开课期数:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.periodName
          }}</el-col>
        </el-row>
        <!-- 只有整盒补发+(体验课|系统课|训练营)在审批时有选择版本的控件 -->
        <el-row
          v-if="
            drawerApprovalDeatail.mode === 'DEFAULT' &&
              [
                'EXPERIENCE_MATERIALS',
                'SYSTEM_MATERIALS',
                'TRAINING_BABY_SELF',
                'TRAINING_TRADITIONAL_PAINTING',
                'TRAINING_GCDF'
              ].includes(drawerApprovalDeatail.type)
          "
        >
          <el-col :span="4">版本信息:</el-col>
          <el-col :span="19" :offset="1">
            <VersionBox
              name="version"
              :version-redeem="drawerApprovalDeatail.version"
              @result="getVersion"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请原因:</el-col>
          <el-col :span="19" :offset="1">
            {{ reasonList[drawerApprovalDeatail.reason]
            }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">发起时间:</el-col>
          <el-col :span="19" :offset="1">
            {{ drawerApprovalDeatail.ctimeFormdate }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">补货说明:</el-col>
          <el-col :span="19" :offset="1">{{
            drawerApprovalDeatail.reissueMsg
          }}</el-col>
        </el-row>
        <el-row v-if="drawerApprovalDeatail.attsUrl">
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
import * as tools from '@/utils/mini_tool_lk'
import { getToken } from '@/utils/auth'
import VersionBox from '@/components/MSearch/searchItems/moreVersionBox'
import {
  getReplenishDetail,
  isAggrePass,
  getFlowDetailNodeTable,
  queryUserMobile
} from '@/api/myExamine'
export default {
  name: 'RepairDrawer',
  components: { VersionBox },
  // inject: ['cr'],
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
      giftList: [], // 修改数量table
      version: '',
      userId: getToken('userId'), // 当前登录人的id
      sraffmobile: getToken('userMobile'), // 当前登录人的手机号
      isShow: false,
      drawerApprovalDeatail: {},
      types: {
        // 补发类别枚举
        EXPERIENCE_MATERIALS: '体验课盒子随材',
        SYSTEM_MATERIALS: '系统课盒子随材',
        TRAINING_BABY_SELF: '训练营盒子随材-宝宝自己画',
        TRAINING_TRADITIONAL_PAINTING: '训练营盒子随材-国画特辑',
        TRAINING_GCDF: '训练营盒子随材-职业规划',
        STORE: '小熊商城',
        RECOMMEND: '推荐有礼',
        INVITATION: '邀请有奖',
        GIFT: '关单赠品',
        HANDWORK_COURSE: '小熊手工'
      },
      changeReason: '',
      reasonList: {
        OTHER_REASON: '其他',
        PRESS_REASON: '印厂原因',
        COMPANY_REASON: '公司原因',
        WAREHOUSE_REASON: '仓库原因',
        USER_REASON: '用户原因',
        EXPRESS_REASON: '快递原因',
        QUALITY_REASON: '商品质量'
      },
      dialogVisible: false
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
    // 抽屉详细信息-done
    async getAllData() {
      console.log(this.forSonDataApprovalId, 'this.forSonDataApprovalId')
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const { code, payload } = await getReplenishDetail({
          subject: this.activeChannelState,
          flowApprovalId: this.forSonDataApprovalId
      }).finally(() => {
        loading.close()
      })
      if (!code && payload) {
        payload.ctimeFormdate = tools.formatDate(payload.ctime)
        if (payload.courseType === 1 || payload.courseType === 2) {
          // 1-体验课    2-系统课   转化难度
          payload.sup = (payload.courseType === 1
            ? { S1: 'S1-进阶', S2: 'S2-基础', S3: 'S3' }
            : {
                S1: 'S1-进阶',
                S2: 'S2-基础',
                S3: 'S3',
                S4: 'S1-基础',
                S5: 'S2-进阶',
                S6: 'S3专项'
              })[payload.sup]
        }
        this.drawerApprovalDeatail = payload
        this.giftList = payload.productdetails // 修改补发货数量弹窗数据
      } else {
        this.$message.error('右边框数据加载失败')
        this.drawerApprovalDeatail = {}
      }
    },
    async getTableNode() {
      // 抽屉里审核流程table
      getFlowDetailNodeTable({
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
      if (assert) {
        // 同意审批:如果是整盒补发&&如下类型,必须选择版本
        if (
          this.drawerApprovalDeatail.mode === 'DEFAULT' &&
          [
            'EXPERIENCE_MATERIALS',
            'SYSTEM_MATERIALS',
            'TRAINING_BABY_SELF',
            'TRAINING_TRADITIONAL_PAINTING',
            'TRAINING_GCDF'
          ].includes(this.drawerApprovalDeatail.type) &&
          !this.version
        ) {
          this.$message.warning('请选择版本号')
          return
        }
      }
      this.$prompt('请输入审批原因', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        inputValue: !assert ? '' : '同意'
      }).then(({ value }) => {
        if (/\S+/g.test(value)) {
          const params = {
            flowApprovalId: this.forSonDataApprovalId,
            approvalRemark: value,
            isConfirm: true,
            version: this.version,
            staffId: this.staffId,
            realName: this.realName,
            channelPid: this.channelPidValue,
            subject: this.activeChannelState
          }
          if (!assert) {
            params.isConfirm = false
            delete params.version
          }
          isAggrePass(params).then(({ code }) => {
            if (!code) {
              this.$message.success('审核处理完成')
              // this.cr.checkPending(this.cr.params) // 刷新父级列表
              this.handleClose() // 关闭抽屉自身
            }
          })
        } else {
          this.$message.error('审批原因是必填项')
        }
      })
    },
    // 详细信息-版本盒子-done
    getVersion(val) {
      this.version = val ? val.version : val
    },
    // 关闭抽屉-done
    handleClose() {
      this.isShow = false
      // this.cr.currentType = '' // 该抽屉关闭,父dom抹掉该组件;确报再次开屉,父级dom树重新添加,它能初始化-全接口新数据
    },
    handleCloseReason(done) {
      done()
    },
    // 用户电话的加密眼睛
    async isDisturbMobile() {
      const { drawerApprovalDeatail: { userTel, userId }, activeChannelState, staffId, userTelIcon } = this
      const data = {
        subject: activeChannelState,
        uid: userId, // 当前用户id
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
.change-reason {
  padding-top: 0;
  font-size: 16px;
  margin-left: 10px;
}
</style>
