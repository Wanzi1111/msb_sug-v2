<template>
  <div>
    <el-drawer
      title="用户订单"
      :visible.sync="visible"
      :before-close="handleClose"
      destroy-on-close
      size="90%"
      class="drawer-approval-detail"
    >
      <div class="app-container">
        <el-tabs v-model="activeChannelState">
          <el-tab-pane
            v-for="item in channelTypeList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
        <basics-table
          ref="table"
          :loading="
            loadings._k8s_api_complaint_api_v1_complaint_order_getBearList ||
              loadings._k8s_api_complaint_api_v1_complaint_order_getOneToOneList ||
              loadings._k8s_api_complaint_api_v1_complaint_order_getShopOrderList
          "
          :table="table"
          :list="list"
          :get-list="getList"
          :columns="columns"
          :total="total"
          :list-query="listQuery"
        >
          <template slot="promotionsList" slot-scope="scope">
            <div v-if="scope.row.promotionsList && scope.row.promotionsList.length !== 0">
              <p>{{ scope.row.promotionsList[0].flow_approval_id }}</p>
              <p>关联审批单:{{ scope.row.promotionsList[0].gifts_name }}</p>
              <p>关联赠品活动:{{ scope.row.promotionsList[0].promotions_name }}</p>
              <a style="color: #409eff" @click="logisticsTracking(scope.row)">物流追踪</a>
            </div>
          </template>
          <template slot="express_total" slot-scope="scope">
            <div>
              <p> 已发：{{ scope.row.express_total }}个</p>
              <a style="color: #409eff" @click="logisticsTracking(scope.row)">物流追踪</a>
            </div>
          </template>
          <template slot="action" slot-scope="scope">
            <div>
              <a v-if="!['2', '3'].includes(activeChannelState)" style="color: #409eff" @click="openOrderProtocol(scope.row)">查看协议</a>
              <a v-if="['4'].includes(activeChannelState)" style="color: #409eff" @click="logisticsTracking(scope.row)">物流追踪</a>
            </div>
          </template>
          <template slot="rmbAmount" slot-scope="scope">
            <div>
              <p v-if="scope.row.classAmount">课时: {{ scope.row.classAmount }}课时</p>
              <p v-if="scope.row.coinAmount">{{ `${activeChannelState === '1' ? '金币':'小熊币'}: ${scope.row.coinAmount}` }}</p>
              <p v-if="scope.row.rmbAmount">现金: ￥{{ scope.row.rmbAmount }}</p>
            </div>
          </template>
        </basics-table>
      </div>
    </el-drawer>

    <logisticsTrajectory
      v-if="logisticsTrajectoryFlag"
      :logistics-trajectory-flag="logisticsTrajectoryFlag"
      :row-data="logisticsDetailDto"
      :more-bear-order="moreBearOrder"
      @cancel="cancel"
    />
  </div>
</template>
<script>
import { channelTypeList } from './config'
import {
  User1V1List,
  BearList,
  AwardList,
  ReturnList,
  IntegralList
} from './columns/index.js'
import { mapGetters } from 'vuex'
import {
  getBearList,
  getPayOrder,
  getRewardOrder,
  getRefundOrder,
  getShopOrderList,
  getBearExpress,
  getShopExpress,
  getBearExpressTrace
  } from '@/api/work-order/orderFormApi'
import logisticsTrajectory from '../logisticsTrajectory.vue'
const init_pagaination = {
  page: 1,
  limit: 20
}
export default {
  name: 'OrderFormDrawer',
  components: { logisticsTrajectory },
  props: {
    orderFormFlag: { type: Boolean },
    channelPid: { type: String, default: '' },
    longUserId: { type: String, default: '' }
  },
  data() {
    return {
      visible: this.orderFormFlag,
      activeChannelState: 'null',
      channelTypeList,
      columns: BearList,
      columnsObj: {
        0: BearList,
        1: User1V1List,
        2: AwardList,
        3: ReturnList,
        4: IntegralList
      },
      listQuery: { ...init_pagaination },
      list: [],
      total: 0,
      table: {
        stripe: false,
        border: false
      },
      logisticsTrajectoryFlag: false,
      logisticsDetailDto: {},
      moreBearOrder: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    orderFormFlag(val) {
      this.visible = val
    },
    activeChannelState(val, oldVal) {
      if (val !== oldVal) {
        this.columns = this.columnsObj[val]
        if (this.longUserId) {
          this.getList()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.channelPid) {
        if (['1011', '1021'].includes(this.channelPid)) {
          this.activeChannelState = '1'
          this.channelTypeList = this.channelTypeList.filter((val) =>
            ['1', '2', '3', '4'].includes(val.value)
          )
        } else if (
          ['1031', '1041', '1051', '1071', '1081'].includes(this.channelPid)
        ) {
          this.activeChannelState = '0'
          this.channelTypeList = this.channelTypeList.filter((val) =>
            ['0', '4'].includes(val.value)
          )
        } else if (
          ['2011'].includes(this.channelPid)
        ) {
          this.activeChannelState = '0'
          this.channelTypeList = this.channelTypeList.filter((val) =>
            ['0'].includes(val.value)
          )
        }
      }
    })
  },
  methods: {
    handleClose() {
      this.$emit('cancel')
    },
    getList() {
      const { activeChannelState, longUserId, listQuery } = this
      const data = {
        userId: longUserId,
        ...listQuery,
        pageNum: listQuery.page * 1,
        pageSize: listQuery.limit
      }
      delete data.page
      delete data.limit
    switch (activeChannelState) {
      case '0':// 小熊订单
        this.getListAll(data, getBearList)
      break
      case '1':// 1v1
        this.getListAll(data, getPayOrder)
      break
      case '2':// 奖励
        this.getListAll(data, getRewardOrder)
      break
      case '3':// 退费订单
        this.getListAll(data, getRefundOrder)
      break
      case '4':// 积分商城
        if (['1011', '1021'].includes(this.channelPid)) {
          data.businessType = 'ONETOONE'
        } else if (['1031', '1041', '1051', '1071', '1081'].includes(this.channelPid)) {
          if (this.channelPid === '1041') {
            data.businessType = 'WRITE'
          } else if (this.channelPid === '1051') {
            data.businessType = 'BEARMUSIC'
          } else {
            data.businessType = 'BEAR'
          }
        }
        this.getListAll(data, getShopOrderList)
      break
    }
    },
    getListAll(data, requestUrl) {
      const { activeChannelState } = this
      const loading = this.$loading({
        lock: true
      })
      requestUrl(data).then((res) => {
        loading.close()
        const { code, payload } = res
        if (!code) {
          if (['1', '3'].includes(activeChannelState)) {
            this.list = payload
            this.total = 0
          } else if (activeChannelState === '2') {
            this.list = payload.list
            this.total = payload.totalSize || 0
          } else {
            this.list = payload.content
            this.total = payload.totalElements || 0
          }
        }
      })
    },
    // 查看协议
    openOrderProtocol(row) {
      const { order_protocol, contractVersion, agreementUrl } = row
      const MEIXIU_H5 = process.env.VUE_APP_MEIXIU_H5
      // 小熊 order_protocol
      // 积分商城 contractVersion
      // 1v1 agreementUrl
      if (order_protocol || contractVersion || agreementUrl) {
        if (order_protocol) {
          window.open(order_protocol)
        } else if (agreementUrl) {
          window.open(agreementUrl)
        } else if (contractVersion) {
          window.open(MEIXIU_H5 + '/exchangeAgreement/' + contractVersion)
        }
      } else {
        this.$message.error('暂无协议可查看~')
      }
    },
    cancel() {
      this.logisticsTrajectoryFlag = false
    },
    // 物流追踪
    logisticsTracking(row) {
      const { activeChannelState } = this
      if (activeChannelState === '0') {
        this.getBearExpress(row.id)
      } else if (activeChannelState === '4') {
        this.getShopExpress(row.id)
      }
    },
    // 小熊订单物流 多个
    getBearExpress(val) {
      const data = {
        orderId: val,
        userId: this.longUserId
      }
      getBearExpress(data).then(res => {
        const { code, payload } = res
        if (!code) {
          if (payload.content.length > 0) {
            this.moreBearOrder = payload.content.map((val, index) => {
              val.id = String(index)
              return val
            })
            this.getBearExpressTrace(payload.content[0]?.center_express_id)
          } else {
            this.$message.error('暂无更多物流信息~')
          }
        }
      })
    },
    // 积分商城订单物流 单个
    getShopExpress(val) {
      const data = {
        orderId: val
      }
      getShopExpress(data).then(res => {
        const { code, payload } = res
        if (!code) {
          if (payload.orderNo) {
            this.logisticsDetailDto = {
              ...payload,
              logisticsCompany: payload.expressName,
              logisticsId: payload.trackingNum
            }
            this.logisticsTrajectoryFlag = true
          } else {
            this.$message.error('暂无物流信息~')
          }
        }
      })
    },
    // 小熊查询物流轨迹
    getBearExpressTrace(val) {
      const data = {
        centerExpressId: val
      }
      getBearExpressTrace(data).then(res => {
        const { code, payload } = res
        if (!code) {
          if (payload.orderNo) {
            this.logisticsDetailDto = {
              ...payload,
              logisticsCompany: payload.expressName,
              logisticsId: payload.trackingNum
            }
            this.logisticsTrajectoryFlag = true
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
</style>
