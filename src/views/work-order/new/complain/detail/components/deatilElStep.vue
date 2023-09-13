<template>
  <div>
    <!-- workType为4 新售后单详情节点 -->
    <el-steps v-if="workType" :active="activeStepNum">
      <el-step
        title="发起新售后"
        :description="timeData.ctime"
        icon="el-icon-document"
      />
      <el-step
        v-if="!timeData.youzanAfterSaleCloseTime || timeData.youzanAfterSaleCloseTime && [3, 8, 203, 204].includes(activeStep)"
        title="处理中"
        :description="timeData.accessTime"
        icon="el-icon-edit"
      />
      <el-step
        v-if="timeData.youzanAfterSaleCloseTime && ![3, 8, 203, 204].includes(activeStep)"
        class="youzanAfterSaleStyle"
        title="处理中"
        :description="`预计 ${timeData.youzanAfterSaleCloseTime} 系统自动取消`"
        icon="el-icon-edit"
      />
      <el-step
        title="处理完成"
        :description="timeData.closeTime"
        icon="el-icon-circle-check"
      />
    </el-steps>
    <!-- workType为1 投诉单详情节点 -->
    <el-steps v-else :active="activeStepNum">
      <el-step
        title="发起投诉"
        :description="timeData.ctime"
        icon="el-icon-document"
      />
      <el-step
        :title="aliPayStatus && iPayStatus[aliPayStatus] ? `处理投诉(${iPayStatus[aliPayStatus]})`:'处理投诉' "
        :description="timeData.accessTime"
        icon="el-icon-edit"
      />
      <el-step
        v-show="checkAids === 1"
        title="已转教辅"
        :description="timeData.aidsTime"
        icon="el-icon-position"
      />
      <el-step
        :title="aliPayStatus && closeIPayStatus[aliPayStatus] ? `关闭投诉 (${closeIPayStatus[aliPayStatus]})`:'关闭投诉' "
        :description="timeData.closeTime"
        icon="el-icon-circle-check"
      />
      <el-step
        title="回访登记"
        :description="timeData.visitTime"
        icon="el-icon-edit-outline"
      />
    </el-steps>
  </div>
</template>
<script>
export default {
  name: 'Detailelstep',
  props: {
    activeStep: { type: Number, default: 0 },
    activeStepSub: { type: Number, default: 0 },
    checkAids: { type: Number, default: 0 },
    timeData: { type: Object, default: () => {} },
    workType: { type: Boolean, default: false },
    aliPayStatus: { type: String, default: '' }
  },
  data() {
    return {
      iPayStatus: {
        'MERCHANT_PROCESSING': '商家处理中',
        'MERCHANT_FEEDBACKED': '商家已反馈',
        'PLATFORM_PROCESSING': '平台处理中'
      },
      closeIPayStatus: {
        'FINISHED': '投诉已完结',
        'PLATFORM_FINISH': '平台处理完结',
        'CLOSED': '系统关闭',
        'CANCELLED': '投诉已撤销'
      }
    }
  },
  computed: {
    // activeStep   为  1发起投诉
    // activeStep   为  2处理投诉
    // activeStep   为  3关闭投诉
    // activeStep   为  6投诉单无效
    // activeStep   为  7回访登记
    // checkAids 0没有转教辅 1转教辅
    // activeStepSub  为  25物流审批
    activeStepNum() {
      let active = 0
      const { activeStep, checkAids, timeData } = this
      if (checkAids === 1) { // 转教辅
        if (activeStep === 3) { // 转教辅并且已关闭投诉
           active = 4
        } else if (activeStep === 6) { // 转教辅并且投诉单无效
           active = 4
        } else if (activeStep === 7) { // 转教辅并且已回访登记
          active = 5
        } else { // 不关闭 不回访的状态-刚转到教辅
           active = 3
        }
      } else if ([3, 8, 203, 204].includes(activeStep)) { // 关闭投诉 用户取消 处理成功 处理失败
        active = 4
      } else if (activeStep === 6) { // 投诉单无效
        active = 4
      } else if (activeStep === 7) { // 回访登记
        active = 5
      } else if (timeData.youzanAfterSaleCloseTime) { // 有赞倒计时进度的时候
        active = 2
      } else { // 其他
        active = activeStep
      }
      return active
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/.el-step__title.is-process {
  color: #303133;
  font-weight: none;
}
/deep/.el-step__title {
  // color: #c0c4cc;
  font-weight: 500;
}
/deep/.el-step__description {
  color: #303133;
}
.youzanAfterSaleStyle{
/deep/.el-step__description {
  color: red;
}
}
</style>
