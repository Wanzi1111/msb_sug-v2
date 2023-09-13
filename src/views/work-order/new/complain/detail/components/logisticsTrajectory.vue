<template>
  <div class="logisticsTrajectory">
    <el-dialog
      title="查询轨迹"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="700px"
      @close="cancel"
    >
      <div class="info-disflex">
        <!-- 多个物流的情况下出现的侧边栏 -->
        <div v-if="moreBearOrder.length > 0 && shopType" class="tabs">
          <span
            v-for="(item, index) in moreBearOrder"
            :key="index"
            :class="
              shopType === item.id ? 'tab tabActive' : 'tab'
            "
            @click="getBearExpressTrace(item)"
          >
            {{ item.product_name }}
          </span>
        </div>
        <!-- 右边的物流轨迹 -->
        <div v-loading="loading" class="info-subVo">
          <div class="info">
            <p>单号：{{ logisticsData.orderNo || "-" }}</p>
            <p>快递公司：{{ logisticsData.logisticsCompany || "-" }}</p>
            <p>状态：{{ logisticsData.status || "-" }}</p>
            <p>快递单号：{{ logisticsData.logisticsId || "-" }}</p>
          </div>
          <div class="activityStyle">
            <el-timeline v-if="logisticsData.subVo.length !== 0">
              <el-timeline-item
                v-for="(activity, index) in logisticsData.subVo"
                :key="index"
                size="large"
                :timestamp="activity.thirdCreateTime"
              >
                <div class="activityinfo">
                  <slot
                    v-if="activity.note || activity.orderStatus"
                    name="timestamp"
                  >
                    <p v-if="activity.orderStatus">
                      {{ activity.orderStatus }}
                    </p>
                    <span>{{ activity.note }}</span>
                  </slot>
                </div>
              </el-timeline-item>
            </el-timeline>
            <div v-else class="svgicon">
              <svg-icon icon-class="empty" />
              <p>暂无相关轨迹</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBearExpressTrace } from '@/api/work-order/orderFormApi'
export default {
  name: 'LogisticsTrajectory',
  props: {
    logisticsTrajectoryFlag: { type: Boolean },
    rowData: { type: Object, default: () => {} },
    moreBearOrder: { type: Array, default: () => [] }
  },
  data() {
    return {
      visible: this.logisticsTrajectoryFlag,
      shopType: this.moreBearOrder && this.moreBearOrder[0]?.id,
      loading: false,
      logisticsData: this.rowData
    }
  },
  watch: {
    logisticsTrajectoryFlag(newVal) {
      this.visible = newVal
    },
    shopType(val, oldVal) {
      if (val && val !== oldVal) {
        this.loading = true
      }
    },
    rowData(newVal) {
      this.logisticsData = newVal
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    // 小熊查询物流轨迹
    getBearExpressTrace(val) {
      if (val.center_express_id === '0') { return this.$message.error('此商品无物流单号~') }
      this.shopType = val.id
      const data = {
        centerExpressId: val.center_express_id
      }
      getBearExpressTrace(data).then((res) => {
        this.loading = false
        const { code, payload } = res
        if (!code) {
          if (payload.orderNo) {
            this.logisticsData = {
              ...payload,
              logisticsCompany: payload.expressName,
              logisticsId: payload.trackingNum
            }
          } else {
            this.$message.error('暂无物流信息~')
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.logisticsTrajectory {
  /deep/ .el-dialog__body {
    padding: 0px 30px 0px 0px;
  }
  .info-disflex {
    display: flex;
    .tabs {
      width: 100px;
      overflow: auto;
      border-right: 1px solid #ccc;
      font-size: 10px;
      .tab {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        display: flex;
        padding: 5px 5px;
        background: #ccc;
        cursor: pointer;
        margin-bottom: 1px;
      }
      .tabActive {
        color: #fff;
        background: hsl(209, 85%, 50%);
      }
      .tab:hover {
        font-weight: bold;
        background: hsl(209, 78%, 74%);
      }
    }
    .info-subVo {
      width: 100%;
      padding: 20px;
    }
    .info {
      padding-left: 40px;
      display: grid;
      text-align: left;
      grid-template-rows: 50px 50px;
      grid-template-columns: 50% 50%;
    }
    .activityStyle {
      height: 300px;
      overflow: auto;
      padding: 10px 0px;
      .activityinfo {
        color: #666;
        padding: 10px 0;
        font-size: 10px;
        p {
          margin-top: -8px;
          font-size: 14px;
          color: #000;
        }
      }
      .el-timeline-item__timestamp.is-bottom {
        margin-top: 0px;
        margin-bottom: 5px;
      }
      .svgicon {
        width: 100%;
        margin-top: 30px;
        text-align: center;
        font-size: 100px;
        p {
          margin-top: 0px;
          font-size: 14px;
          color: #8a8a8a;
        }
      }
    }
  }
}
</style>
