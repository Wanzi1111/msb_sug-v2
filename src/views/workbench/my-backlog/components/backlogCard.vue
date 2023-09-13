<template>
  <div>
    <div v-if="!isNoData" v-loading="loading" class="backlogcard-list">
      <el-card v-for="item in dataList" :key="item.id" class="box-card">
        <div slot="header" class="clearfix">
          <span>待办：投诉单 {{ item.complaintNo }}</span>
          <div v-if="item.status === 1" class="actions">
            <el-button type="text" @click="toDetail(item)">前往处理</el-button>
            <el-button type="text" @click="cancelBlock(item)">关闭</el-button>
          </div>
          <div v-if="item.status === 2" class="actions">
            <el-button type="text" @click="toDetail(item)">查看记录</el-button>
            <el-button type="text" disabled>已完结</el-button>
          </div>
        </div>
        <div class="text item">跟进内容：{{ item.content }}</div>
        <div class="text item">沟通方式：{{ item.typeList }}</div>
        <div class="text item">跟进时间：{{ item.executeTimeInfo }}</div>
      </el-card>
      <pagination
        v-show="showPagination"
        :total="total"
        :page-sizes="listQuery.pageSizes"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <div v-if="isNoData" class="divider">暂无数据</div>

    <!-- 修改或关闭代办待办 -->
    <el-dialog
      title="关闭待办任务"
      :visible="backlogFlag"
      destroy-on-close
      :close-on-click-modal="false"
      width="600px"
      @close="cancel"
    >
      <basics-form
        ref="emitBacklogForm"
        :key="backlogFlag"
        :forms="emitBacklogForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        class="refund-form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <template slot="complaintNo" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            class="form-item"
          >
            <div>{{ backlogData.complaintNo }}</div>
          </el-form-item>
        </template>
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
      </basics-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { immediateComplaint } from '@/api/message'
import { emitBacklogForm, actions as complaintFormAction } from './form'
import moment from 'moment'
const {
  baseData: { Agency_follow_up_method }
} = window
export default {
  name: 'BacklogCard',
  components: {
    Pagination
    // EmitBacklogDialog
  },
  props: {
    dataList: {
      default: () => [],
      type: Array
    },
    listQuery: {
      type: Object,
      default: () => ({})
    },
    getList: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      backlogFlag: false,
      followUp: Agency_follow_up_method,
      emitBacklogForm,
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      pickerOptions: {
        disabledDate(date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      backlogData: {}
    }
  },
  computed: {
    isNoData() {
      return this.dataList.length === 0
    },
    showPagination() {
      return this.total > 0
    }
  },
  methods: {
    toDetail(item) {
      window.open(`/workOrder/detail/${item.complaintNo}`)
    },
    cancelBlock(item) {
      this.backlogFlag = true
      this.$nextTick(() => {
        this.backlogData = item
        item = {
          ...item,
          executeTime: item.executeTimeInfo,
          type: item.type.split(','),
          status: [2]
        }
        this.$refs.emitBacklogForm?.recoveryForm(item, false)
      })
    },
    cancel() {
      this.backlogFlag = false
    },
    // 表单的cahnge事件
    changeApproval(val) {
      // 添加执行人弹框的子组件赋值
    },
    ensure() {
      this.$refs.emitBacklogForm.defaultAction('submit')
    },
    submitApproval(val) {
      const { backlogData } = this
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
        pendingId: backlogData.id,
        staffId: backlogData.executorId,
        executeTime: moment(val.executeTime).valueOf(),
        type: arr.join(','),
        status: val.status.length ? val.status[0] : 1
      }
      console.log(data)
      // 我的待办列表的立即处理
      immediateComplaint(data).then((res) => {
        if (res?.code === 0) {
          if (data.status) {
            this.$message.success('修改成功')
          } else {
            this.$message.success('关闭成功')
          }
          this.backlogFlag = false
          this.$emit('getList')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.text {
  font-size: 14px;
}

.item {
  margin: 5px 0px;
  color: #999999;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.backlogcard-list {
  width: 100%;
  margin-bottom: 15px;
  .box-card {
    margin-bottom: 15px;
  }
  .actions {
    float: right;
    padding: 3px 0;
    button {
      padding: 0;
    }
  }
  /deep/.el-card__header {
    padding: 10px 15px;
  }
  /deep/.el-card__body {
    padding: 10px 15px;
  }
}
.divider {
  padding: 100px;
  text-align: center;
  color: #999;
}
.refund-form-box {
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
  .el-button--primary.is-plain {
    border: 1px dotted #3c56f2;
  }
}
</style>
