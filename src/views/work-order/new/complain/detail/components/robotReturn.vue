<template>
  <div>
    <el-dialog
      v-if="visible"
      :title="RobotType === 0 ? '机器人回访' : '机器人回访详情'"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="600px"
      @close="cancel"
    >
      <div class="info-box" style="">
        <div><span>用户UID：</span> {{ rowData.userId }}</div>
        <div><span>渠道来源：</span> {{ targetSug }}</div>
        <div v-if="RobotType === 1">
          <span>主叫号码：</span>
          {{
            robotDetails.userMobile
              ? robotDetails.userMobile
              : actionObj.userMobile
          }}
        </div>
        <div v-show="RobotType === 0">
          <span>呼叫号码：</span>
          <span class="callinput">
            <el-input
              v-model="callingNumber"
              :disabled="actionObj.status !== 0"
              maxlength="11"
              placeholder="请输入呼叫号码"
            />
          </span>
          <svg-icon
            v-show="actionObj.status === 0"
            class-name="callicon-icon"
            :icon-class="callingNumberFlag ? 'callicon' : 'call_hui'"
            @click="clickCall"
          />
        </div>
        <div><span>业务请求ID：</span> {{ rowData.complaintNo }}</div>
        <div><span>服务主体：</span> 客服</div>
        <div><span>供应商：</span> 一知</div>
        <div><span>服务主体ID：</span> {{ ServiceuserId }}</div>
        <div><span>模板ID：</span> {{ Bypid }}</div>
      </div>
      <el-divider />
      <div style="display: flex; align-items: center; margin-bottom: 30px">
        <span
          style="color: #303133; font-size: 18px; margin-right: 20px"
        >通话结果</span>
        <el-button
          v-if="robotDetails.intentLevel && robotDetails.intentLevelName"
          type="warning"
          size="mini"
          plain
        >{{
          robotDetails.intentLevel + robotDetails.intentLevelName
        }}</el-button>
        <el-button
          v-if="robotDetails.callStatus && robotDetails.callStatusDesc"
          :type="callType[robotDetails.recordStatus]"
          size="mini"
          plain
        >{{
          robotDetails.callStatus + robotDetails.callStatusDesc
        }}</el-button>
      </div>
      <div v-show="Object.keys(robotDetails).length !== 0">
        <div class="call-box">
          <div v-if="robotDetails.fullAudioUrl">
            <audios :url="robotDetails.fullAudioUrl" />
          </div>
          <div><span>通话ID：</span> {{ robotDetails.id }}</div>
          <div>
            <span>通话时长：</span>
            {{
              `呼叫 ${robotDetails.callTime || "--"} 秒 / 通话 ${
                robotDetails.chatDuration || "--"
              } 秒`
            }}
          </div>
          <div><span>意向标签：</span> {{ robotDetails.intentLevelName }}</div>
          <div><span>采集反馈：</span> {{ robotDetails.feedback }}</div>
        </div>
      </div>
      <div v-show="Object.keys(robotDetails).length === 0" class="emptyStyle">
        <b>暂无记录</b>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  acceptCallComplaint,
  getCallRequest,
  getComplaintCallRecordsDetail
} from '@/api/outboundRecords/index'
import { getToken } from '@/utils/auth'
import { debounce } from 'lodash'
import { Message } from 'element-ui'
export default {
  name: 'RobotReturn',
  props: {
    robotFlag: { type: Boolean },
    rowData: { type: Object, default: () => {} },
    robotType: { type: Number, default: 0 }

  },
  data() {
    return {
      visible: this.robotFlag,
      robotDetails: {},
      callingNumber: '',
      actionObj: {
        status: 0
      },
      ServiceuserId: getToken('userId'),
      Bypid: '',
      callType: ['warning', 'primary', 'success', 'danger', 'primary']
    }
  },
  computed: {
    // 机器人回访详情渠道分辨
    targetSug() {
      let str = ''
      // 美术、书法、音乐、舞蹈、手工
      if (
        ['1031', '1041', '1051', '1071', '1081'].includes(
          this.rowData.channelPid
        )
      ) {
        str = '小熊艺术-投诉回访'
      } else if (['1011', '1021', '1061'].includes(this.rowData.channelPid)) {
        // 小班课 书画院 1v1
        str = '美术宝1v1-投诉回访'
      }
      return str
    },
    callingNumberFlag() {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.callingNumber)
      if (reg) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    robotFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
    this.getCallRequestData()
    this.getComplaintCallRecords()
  },
  methods: {
    // 获取机器人回访模板ID 拨打的手机号 是否是拨打后回访的状态
    async getCallRequestData() {
      const { complaintNo } = this.rowData
      const res = await getCallRequest({ complaintNo })
      const {
        code,
        payload: { channelId, mobile, status }
      } = res
      if (code === 0) {
        this.Bypid = channelId
        this.actionObj.userMobile = mobile
        //  status  0、没有拨打 1、打过
        this.actionObj.status = status
        this.callingNumber = mobile
      }
    },
    // 获取回访详情
    async getComplaintCallRecords() {
      const { complaintNo } = this.rowData
      const res = await getComplaintCallRecordsDetail({ complaintNo })
      const { code, payload } = res
      if (code === 0) {
        this.robotDetails = payload.id === null || '' ? {} : payload
      } else {
        this.robotDetails = {}
      }
    },
    // 拨打主教电话
    clickCall: debounce(async function() {
      const robotData = {
        uid: this.rowData.userId,
        mobile: this.callingNumber,
        channelSource: this.robotDetails.targetsug,
        complaintNo: this.rowData.complaintNo,
        customerName: '客服',
        customerId: this.ServiceuserId,
        supplier: '一知',
        channelId: this.Bypid,
        businessType: '101'
      }
      if (this.callingNumberFlag) {
        const res = await acceptCallComplaint(robotData)
        const { code } = res
        if (code === 0) {
          Message.success('排队中')
          this.$emit('cancel')
          this.$parent.getCallRequestData()
        }
      }
    }, 500),
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang='scss' scoped>
.info-box,
.call-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // justify-content: center;
  & > div {
    width: 50%;
    margin-bottom: 16px;
    & > span {
      width: 90px;
      display: inline-block;
      text-align: right;
    }
  }
}
.call-box {
  margin-top: 30px;
  & > div {
    width: 100%;
    & > span {
      width: 120px;
    }
  }
}
.callicon-icon {
  font-size: 25px;
  cursor: pointer;
  position: relative;
  top: 3px;
}
.callinput {
  display: inline-block;
  width: 140px;
  min-width: 140px;
}
.emptyStyle {
  padding: 30px;
  font-size: 18px;
  text-align: center;
}
</style>

