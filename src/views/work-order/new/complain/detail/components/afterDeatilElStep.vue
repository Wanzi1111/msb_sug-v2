<template>
  <div>
    <el-steps :active="activeStepNum">
      <el-step
        v-for="(item, index) in afterDetailElstep"
        :key="index"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :class="item.csstyle"
      />
    </el-steps>
  </div>
</template>
<script>
import {
  automaticRefund,
  noInterceLogistics,
  interceLogistics,
  returnMoney,
  exchangeGoods,
  replenishDispatch,
  userCancel,
  serviceCancel
} from './config'
export default {
  name: 'AfterDetailelstep',
  props: {
    timeData: { type: Object, default: () => {} },
    newAsType: { type: String, default: '' },
    approvalData: { type: Object, default: () => {} }
  },
  data() {
    return {
      afterDetailElstep: [],
      nodeOrder: 1
    }
  },
  computed: {
    // cpType 0 仅退款
    // cpType 1 退货退款
    // cpType 2 换货
    // cpType 3 补发
    // cpType 4 申请售后
    activeStepNum() {
      let active = 0
      const {
        timeData: { cpStatus, cpStatusSub }, nodeOrder, approvalData
      } = this
      switch (nodeOrder) {
        case 1:
        case 2:
          if (cpStatus === 1) {
            active = 1
          } else if ([203, 204, 3].includes(cpStatus)) { // 仅退款/不拦截物流-退款完成
           active = 3
          } else if (cpStatus === 2) {
            if (approvalData.id && cpStatusSub === 27) {
              active = 2
            } else {
              active = 2
            }
          }
        break
        case 3:
          if (cpStatus === 1) {
            active = 1
          } else if ([203, 204, 3].includes(cpStatus)) { // 拦截物流-退款完成
           active = 4
          } if (cpStatus === 2) {
            if (cpStatusSub !== 25 || (approvalData.id && cpStatusSub === 27)) { // 拦截物流-客服审核
              active = 2
            } else if ([25, 29].includes(cpStatusSub)) { // 拦截物流-供应链审核
              active = 3
            }
          }
        break
        case 4:
          if (cpStatus === 1) {
            active = 1
          } else if ([203, 204, 3].includes(cpStatus)) { // 退货退款-退款完成
           active = 5
          } if (cpStatus === 2) {
            if (cpStatusSub === 20 || (approvalData.id && cpStatusSub === 27)) { // 退货退款-客服审核
              active = 2
            } else if (cpStatusSub === 23) { // 退货退款-待回填单号
              active = 3
            } else if ([25, 29].includes(cpStatusSub)) { // 退货退款-供应链审核
              active = 4
            }
          }
        break
        case 5:
          if (cpStatus === 1) {
            active = 1
          } else if ([203, 204, 3].includes(cpStatus)) { // 换货-已完成
           active = 6
          } if (cpStatus === 2) {
            if (cpStatusSub === 20 || (approvalData.id && cpStatusSub === 27)) { // 换货-客服审核
              active = 2
            } else if (cpStatusSub === 23) { // 换货-待回填单号
              active = 3
            } else if ([25, 29].includes(cpStatusSub)) { // 换货-供应链审核
              active = 4
            } else if (cpStatusSub === 28) { // 换货-供应链发货
              active = 5
            }
          }
        break
        case 6:
          if (cpStatus === 1) {
            active = 1
          } else if ([203, 204, 3].includes(cpStatus)) { // 补发-已完成
           active = 5
          } if (cpStatus === 2) {
            if (cpStatusSub === 20 || (approvalData.id && cpStatusSub === 27)) { // 补发-客服审核
              active = 2
            } else if ([25, 29].includes(cpStatusSub)) { // 补发-供应链审核
              active = 3
            } else if (cpStatusSub === 28) { // 补发-供应链发货
              active = 4
            }
          }
        break
        case 7:
          active = 2// 用户取消 客服拒绝 回填单号超时
        break
      }
      return active
    }
  },
  watch: {
    timeData: {
      handler: function(val) {
        if (val.length !== 0) {
          this.automaticRefund = this.caseStatusFn(val)
        }
      },
      deep: true
    }
  },
  methods: {
    // 区分当前状态的
    caseStatusFn(val) {
      const {
        timeData: { interceptLogistics, cpStatus, cpStatusSub },
        newAsType
      } = this
      if (val.length !== 0) {
        if (['0', '1', '2', '3', '4'].includes(newAsType) && cpStatus === 8) {
          // 用户取消 客服拒绝 回填单号超时 nodeOrder-7
          this.afterDetailElstep = userCancel(val)
          this.nodeOrder = 7
        }
        if (['0', '1', '2', '3', '4'].includes(newAsType) && cpStatus === 3 && cpStatusSub === 81) {
          // 客服拒绝  nodeOrder-7
          this.afterDetailElstep = serviceCancel(val)
          this.nodeOrder = 7
        }
        if (newAsType === '0' && interceptLogistics === -1 && cpStatus !== 8 && cpStatusSub !== 81) {
          // 仅退款-系统自动退款 nodeOrder-1
          this.afterDetailElstep = automaticRefund(val)
          this.nodeOrder = 1
        }
        if (newAsType === '0' && interceptLogistics === 1 && cpStatus !== 8 && cpStatusSub !== 81) {
          // 仅退款-不拦截物流 nodeOrder-2
          this.afterDetailElstep = noInterceLogistics(val)
          this.nodeOrder = 2
        }
        if (newAsType === '0' && interceptLogistics === 0 && cpStatus !== 8 && cpStatusSub !== 81) {
          // 仅退款-拦截物流 nodeOrder-3
          this.afterDetailElstep = interceLogistics(val)
          this.nodeOrder = 3
        }
        if (newAsType === '1' && cpStatus !== 8 && cpStatusSub !== 81) {
          // 退货退款 nodeOrder-4
          this.afterDetailElstep = returnMoney(val)
          this.nodeOrder = 4
        }
        if (newAsType === '2' && cpStatus !== 8 && cpStatusSub !== 81) {
          // 换货 nodeOrder-5
          this.afterDetailElstep = exchangeGoods(val)
          this.nodeOrder = 5
        }
        if (newAsType === '3' && cpStatus !== 8 && cpStatusSub !== 81) {
          // 补发 nodeOrder-6
          this.afterDetailElstep = replenishDispatch(val)
          this.nodeOrder = 6
        }
      }
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
.afterSaleStyle {
  /deep/.el-step__description {
    color: red;
    position: relative;
    right: 60px;
  }
}
</style>
