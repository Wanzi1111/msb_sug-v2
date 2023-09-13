<template>
  <div>
    <el-dialog
      title="添加待办"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="600px"
      @close="cancel"
    >
      <basics-form
        ref="complaintForm"
        :key="visible"
        :forms="addBacklogForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        class="form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <template slot="executeTime" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="form-item"
          >
            <el-date-picker
              v-model="scope.form.executeTime"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </template>
        <template slot="executorUserIds" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="form-item"
          >
            <el-button type="primary" plain icon="el-icon-plus" @click="openList(true)">添加执行人</el-button>
            <el-select
              v-model="executorUserData"
              multiple
              filterable
              remote
              placeholder="支持搜索"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in commissionData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </basics-form>
    </el-dialog>

    <commisisionList
      :key="commisisionKey"
      :commisision-flag="commisisionFlag"
      :list="list"
      :states="states"
      :executor-user="executorUser"
      @openList="openList"
      @changeUserid="changeUserid"
    />
  </div>
</template>
<script>
import { addBacklogForm } from './forms/actionsForm'
import { actions as complaintFormAction } from '../../forms/complaintForm'
import { getAllStaff, setAddPending } from '@/api/operate/sugDeitail.js'
import commisisionList from '../components/commissionList.vue'
import moment from 'moment'
const {
  baseData: { Agency_follow_up_method }
} = window
export default {
  name: 'AddBacklog',
  components: { commisisionList },
  props: {
    backlogFlag: { type: Boolean },
    complaintNo: { type: String, default: '' },
    channelPid: { type: String, default: '' }
  },
  data() {
    return {
      visible: this.backlogFlag,
      followUp: Agency_follow_up_method,
      commisisionFlag: false,
      addBacklogForm,
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      commissionData: [],
      list: [],
      states: [],
      executorUser: [],
      commisisionKey: 0,
      executorUserData: [],
      pickerOptions: {
     disabledDate(date) {
       // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
       return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
       }
      }
    }
  },
  watch: {
    backlogFlag(newVal) {
      this.visible = newVal
    },
    // 替换掉不同姓名查询上一个姓名展示问题
    'executorUserData': {
      deep: true,
      handler: function(val, valOld) {
      if (val !== valOld) {
        this.list.map(item => {
          if (val.includes(item.value)) {
            this.executorUserData.push(item.label)
            const index = this.executorUserData.findIndex(text => text === item.value)
            this.executorUserData.splice(index, 1)
          }
        })
      this.$refs.complaintForm.set({
        type: 'defaultVal',
        data: {
          executorUserIds: this.executorUserData
        }
      })
      }
     }
    }
  },
  mounted() {
      this.$nextTick(() => {
        this.getAllStaffData()
      })
  },
  methods: {
    // 获取所有的客服人员
    async getAllStaffData() {
      const res = await getAllStaff()
      const { code, payload } = res
      if (code === 0) {
        this.states = payload.map(val => val.name)
        this.list = payload.map(val => {
          return { value: val.id, label: val.name }
        })
      }
    },
    // 添加待办人
    submitApproval(val) {
      // 添加待办人数据处理
      const mapExecutorUser = []
      this.list.map(item => {
        if (val.executorUserIds.includes(item.label)) {
          mapExecutorUser.push(item.value)
        }
      })

      // 跟进方式数据处理
      // const arr = ['101', '102', '103', '104', '105']
      const arr = this.followUp.map(val => val.value)
      arr.map((item, index) => {
          if (val.type.includes(item)) {
            arr[index] = item
          } else {
            arr[index] = ''
          }
        return arr
     })

      const data = {
        ...val,
        executeTime: moment(val.executeTime).valueOf(), // 跟进时间
        channelPid: this.channelPid, // 渠道id
        complaintNo: this.complaintNo, // 投诉单号
        type: arr.join(','), // 根据方式
        executorUserIds: mapExecutorUser.join(',') // 执行人id
      }
      setAddPending(data).then(res => {
        const { code } = res
        if (code === 0) {
          this.$emit('cancel')
          this.executorUserData = [] // 清空待办人数据
          this.$message.success('添加待办成功')
        } else {
          this.$message.error('添加待办失败')
        }
        console.log(res, 'res')
      })
    },
    // 表单的cahnge事件
    changeApproval(val) {
      // 添加执行人弹框的子组件赋值
      this.executorUser = val.executorUserIds
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
      this.executorUserData = [] // 清空待办人数据
    },
    remoteMethod(query) {
        if (query !== '') {
          setTimeout(() => {
            this.commissionData = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.commissionData = []
        }
    },
    // 打开待办人弹框
    openList(val) {
      this.commisisionFlag = val
      this.commisisionKey++
    },
    // 子组件改变待办人确定后的人员去改变父组件的待办人人员
    changeUserid(val) {
      this.executorUserData = val
    }
  }
}
</script>
<style lang='scss' scoped>
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
  .el-button--primary.is-plain{
    border: 1px dotted #3C56F2;
  }
}
</style>
