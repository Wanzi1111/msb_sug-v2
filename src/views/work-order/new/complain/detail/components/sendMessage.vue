<template>
  <div class="sendMessage">
    <el-dialog
      title="发送短信"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="600px"
      @close="cancel"
    >
      <basics-form
        ref="complaintForm"
        :key="visible"
        :class="messageNum > 3 ? 'form-box overAuto SendMsg' : 'form-box'"
        :forms="messageForm"
        :actions="complaintFormAction"
        @submitForm="submitSendMsg"
        @changeForm="changeSendMsg"
      >
        <template slot="scenarioId" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="SendMsg_form_item"
          >
            <el-select
              v-model="scope.form.scenarioId"
              placeholder="请选择模板"
              @change="changeProblemIdOne"
            >
              <el-option
                v-for="item in scope.item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div :class="messageContentStr ? 'messageContentStyle' : ''">
            {{ messageContentStr }}
          </div>
          <div
            v-show="messageContentStr.length !== 0"
            style="float: right; margin-right: 20px"
          >
            {{ messageContentLength }}
          </div>
        </template>
        <template v-if="closeEnumTpyeFlag" slot="closeEnum" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
          >
            <el-radio-group v-model="scope.form.closeEnum" :disabled="rowData.cpStatus === 3">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template slot="templateParam" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="SendMsg_form_item"
          >
            <el-input
              v-model="scope.form[scope.item.prop]"
              style="width: 300px"
              :maxlength="scope.item.attr.maxlength"
            />
          </el-form-item>
        </template>
        <template slot="tips">
          <div style="margin-bottom: 20px; padding-left: 110px">
            <p>*{s数字}中的数字代表变量最大长度。</p>
            <p>*中文英文符号统一计算为一个字符。</p>
            <p>{{ `* 短信字数${tip}=70个字，按照70个字一条短信计算。` }}</p>
            <p>* 短信字数>70个字，按照67个字记为一条短信计算。</p>
            <p>* 默认同步服务记录</p>
          </div>
        </template>
      </basics-form>
    </el-dialog>
  </div>
</template>
<script>
import { messageForm } from './forms/actionsForm'
import { actions as complaintFormAction } from '../../forms/complaintForm'
import { selectSmsScenarioConfigurationList, sentShortMessage } from '@/api/messageList'
import { getToken } from '@/utils/auth'
export default {
  name: 'SendMessage',
  props: {
    sendMsgFlag: { type: Boolean },
    rowData: { type: Object, default: () => {} },
    userMobile: { type: String, default: '' },
    closeEnumTpyeFlag: { type: Boolean, default: false }

  },
  data() {
    return {
      messageNum: 0,
      messageForm: JSON.parse(JSON.stringify(messageForm)),
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      messageContentStr: '',
      messageContentStrBackups: '',
      visible: this.sendMsgFlag
    }
  },
  computed: {
    // 计算模板字数的长度和条数
    messageContentLength() {
      const { messageContentStr } = this
      let str = ''
      let num = 1
      if (messageContentStr?.length > 70) {
        //  短信字数 > 70个字，按照67个字一条短信计算
        const ceilLen = messageContentStr?.length
        num = Math.ceil(ceilLen / 67)
        str = messageContentStr?.length + '字/' + num + '条'
      } else if (messageContentStr?.length <= 70) {
        // 短信字数<=70个字，按照70个字一条短信计算
        str = messageContentStr?.length + '字/' + num + '条'
      }
      return str
    },
    tip() { return '<' }
  },
  watch: {
    sendMsgFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
      this.$nextTick(() => {
        // 给发短信的手机号加默认值
        this.$refs?.complaintForm?.set({
          type: 'defaultVal',
          data: { mobile: this.userMobile ? this.userMobile : this.rowData.userMobile }
        })
        this.getSmsScenarioConfigurationList()
      })
  },
  methods: {
    // 发短信表单的提交事件
    submitSendMsg(values) {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(values.mobile)
      if (reg) {
        delete values.tips
      // 拼接模板参数
      const templateParam = Object.values(values).slice(3).toString()
      // 过滤场景id
      const scenarioId = this.scenarioIdData?.find(val => val.value === values.scenarioId)?.scenarioId
      const data = {
        complaintNo: this.rowData.complaintNo,
        area: '+86',
        scenarioId,
        templateParam,
        shortMessageContent: this.messageContentStr,
        currentStaffId: getToken('userId'),
        mobile: values.mobile,
        closeEnum: this.closeEnumTpyeFlag ? values.closeEnum : '0'

      }
      sentShortMessage(data).then(res => {
        const { code } = res
        if (code === 0) {
          this.$message.success('发送成功')
          this.$parent.acceptFirst()
          setTimeout(() => {
           this.$router.go(0)
          }, 500)
        }
      }).catch(error => {
          this.$message.error(error)
      })
      this.$emit('cancel')
      } else {
        this.$message({
          message: '用户手机号格式不正确',
          type: 'error'
        })
      }
    },
    // 发短信表单的改变事件
     changeSendMsg(val) {
        let resultStr = this.messageContentStrBackups
        let count = 0
        delete val.mobile
        delete val.scenarioId
        delete val.tips
        Object.keys(val).forEach((key, i) => {
            if (key.includes('templateParam')) {
                const slotName = key.split('-')[2]
                const itemValue = val[key] || slotName
                resultStr = resultStr.replace(slotName.trim(), () => {
                    count++
                    if (count === i) {
                        return itemValue?.trim()
                    }
                })
            }
        })
        this.messageContentStr = resultStr
    },
    // 改变模板的下拉数据，控制模板的数据
    changeProblemIdOne(value) {
      this.messageForm = JSON.parse(JSON.stringify(messageForm))
          this.messageFormOption.find(val => {
            if (val.value === value) {
              this.messageContentStr = val.messageContent
              this.messageContentStrBackups = val.messageContent
            }
          })
          const index = this.messageContentStr.match(/\{[^\}]+\}/g)
          this.messageNum = index?.length
          const popdata = this.messageForm.pop()
          index?.map((item, key) => {
            this.messageForm[this.messageForm.length] = {
           prop: `templateParam-${key}-${item}`,
           label: `参数填写${item}`,
           slot: 'templateParam',
           type: 'input',
           attr: {
             maxlength: item[1] === 's' ? Number(item.slice(2, -1)) : undefined
           },
           rules: [ // 校验
            { required: true, message: '参数必填！' }
           ]
         }
          })
          this.messageForm.push(popdata)
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
    },
    // 获取模板id 本期只对接创蓝模板
    getSmsScenarioConfigurationList() {
      // supplierName 只查创蓝供应商的
      // businessType 业务线
      const data = {
         businessType: this.rowData.messageBusiness,
         supplierName: 4,
         twoId: this.rowData.twoid || '',
         enableStatus: '0'
      }
      selectSmsScenarioConfigurationList(data).then(res => {
        const { code, payload: { list }} = res
        if (code === 0) {
         const newdata = list.map(val => {
            return {
              label: `${val.scenarioId}-${this.rowData.businessName}-${val.scenarioName}`,
              value: val.id,
              messageContent: val.messageContent,
              scenarioId: val.scenarioId
            }
          })
          this.scenarioIdData = newdata
          this.messageForm.find((val, index) => {
            if (val.prop === 'scenarioId') {
              val.options = newdata
              this.messageFormOption = newdata
              messageForm[index].options = newdata
            }
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.sendMessage{
.form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
  .form-item {
    /deep/.el-form-item__content {
      width: 100%;
      margin-left: 120px;
    }
  }
}
.messageContentStyle{
  width: 100%;
  padding: 10px 0px 30px 120px;
}
.SendMsg{
  height: 400px;
}
.overAuto{
  overflow: auto;
}
.SendMsg_form_item{
    display: flex;
}
}
</style>
