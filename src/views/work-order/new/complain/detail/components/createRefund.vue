<template>
  <div>
    <el-dialog
      title="退款审批"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="900px"
      @close="cancel"
    >
      <basics-form
        ref="complaintForm"
        :key="visible"
        :forms="refundForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        class="refund-form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <template slot="refundOther">
          <div class="refundOther_stype">
            <p>
              <b>退款规则</b><span>{{
                refundFormObj.isRules ? refundFormObj.isRules : "-"
              }}</span>
            </p>
            <p>
              <b>业务类型</b><span>{{
                refundFormObj.businessType ? refundFormObj.businessType : "-"
              }}</span>
            </p>
            <p>
              <b>支付渠道</b><span>{{
                refundFormObj.payChannel ? refundFormObj.payChannel : "-"
              }}</span>
            </p>
            <p>
              <b>支付币种</b><span>{{
                refundFormObj.coinType ? refundFormObj.coinType : "-"
              }}</span>
            </p>
            <p>
              <b>交易金额</b><span>{{
                refundFormObj.orderAmount ? refundFormObj.orderAmount : "-"
              }}</span>
            </p>
            <p>
              <b>剩余金额</b><span>{{
                refundFormObj.residueFee ? refundFormObj.residueFee : "-"
              }}</span>
            </p>
          </div>
        </template>
        <template slot="refundType" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
          >
            <el-radio-group v-model="scope.form.refundType">
              <el-radio
                v-show="
                  ['系统课', '训练营'].includes(refundFormObj.businessType) &&
                    !isForeignCoin
                "
                :label="0"
              >优惠券退款</el-radio>
              <el-radio
                v-show="refundFormObj.businessType !== '预付款优惠券'"
                :label="1"
              >课程退款</el-radio>
              <el-radio
                v-show="
                  refundFormObj.businessType === '系统课' && moneyCountLevelHalf
                "
                :label="2"
              >降半年课包</el-radio>
              <el-radio
                v-show="
                  refundFormObj.businessType === '系统课' && moneyCountLevelFull
                "
                :label="4"
              >降1年课包</el-radio>
              <el-radio
                v-show="
                  refundFormObj.businessType === '系统课' &&
                    moneyCountLevelFullPlus
                "
                :label="5"
              >降1年半课包</el-radio>
              <el-radio
                v-show="
                  ['系统课', '体验课', '训练营', '美育主题课'].includes(
                    refundFormObj.businessType
                  )
                "
                :label="3"
              >补偿</el-radio>
              <el-radio
                v-show="
                  refundFormObj.businessType === '训练营' &&
                    refundFormObj.orderAmount === 699 &&
                    !pureWeekY
                "
                :label="6"
              >训练营退差价</el-radio>
              <el-radio
                v-show="refundFormObj.businessType === '预付款优惠券'"
                :label="9"
              >预付款优惠券退款</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!--次月课程-随材盒子(出现条件系统课+选中课程退款) -->
        <template
          v-if="
            refundFormObj.refundType === 1 &&
              refundFormObj.businessType === '系统课'
          "
          slot="deductMonth"
          slot-scope="scope"
        >
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
          >
            <el-radio-group v-model="scope.form.deductMonth">
              <el-radio :label="0">不保留</el-radio>
              <el-radio :label="1">保留</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- 随材盒子 -->
        <template
          slot="deductMaterial"
          slot-scope="scope"
        >
          <el-form-item
            v-if="!isForeignCoin && refundFormObj.refundType === 1 &&
              refundFormObj.businessType === '系统课'"
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="deductMaterial-form"
          >
            <el-radio-group
              v-model="scope.form.deductMaterial"
              :disabled="jsonDate3.boxAble"
            >
              <el-radio :label="0">不扣除随材盒子费用</el-radio>
              <el-radio :label="100">扣除【月度】随材盒子100元</el-radio>
              <el-radio :label="120">扣除【半年】随材盒子120元</el-radio>
              <el-radio :label="230">扣除【年度】随材盒子230元</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 【降半年课包】、【降1年课包】、【降1年半课包】也有随材盒子项 -->
          <el-form-item
            v-if="
              [2, 4, 5].includes(refundFormObj.refundType) &&
                refundFormObj.businessType === '系统课' &&
                !isForeignCoin"
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="deductMaterial-form"
          >
            <el-radio-group v-model="scope.form.deductMaterial">
              <el-radio :label="0">不扣除随材盒子差价</el-radio>
              <el-radio :label="110">扣除随材盒子降课包差价110元</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- 关单赠品 -->
        <template
          v-if="
            refundFormObj.refundType === 1 &&
              refundFormObj.businessType === '系统课'
          "
          slot="multipleTable"
        >
          <el-form-item
            v-if="!isForeignCoin"
            label="关单赠品："
            class="form-item"
          >
            <span>（选中扣费）</span>
            <el-table
              v-show="productData && productData.length"
              ref="multipleTable"
              :data="productData"
              tooltip-effect="dark"
              border
              style="width: 50%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                :selectable="checkSelectable"
                label="是否扣费"
                type="selection"
                min-width="55"
              />
              <el-table-column
                label="赠品信息"
                prop="name"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column prop="price" label="赠品价格" min-width="80" />
            </el-table>
            <span v-show="!productData.length">暂无关单赠品</span>
          </el-form-item>
        </template>
        <!-- 课程退款&&系统课 用户已上课周期 -->
        <template
          v-if="
            refundFormObj.refundType === 1 &&
              ['系统课', '训练营', '美育主题课'].includes(
                refundFormObj.businessType
              )
          "
          slot="pureWeekYto"
        >
          <div style="margin-left: 11px">
            <p>
              <b style="margin-right: 10px">用户已上课周期</b><span>{{ pureWeekYto }}</span>
            </p>
          </div>
        </template>
        <!-- 优惠劵 -->
        <template
          v-if="
            refundFormObj.refundType === 0 &&
              ['系统课', '训练营'].includes(refundFormObj.businessType)
          "
          slot="couponType"
          slot-scope="scope"
        >
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="refund-form"
          >
            <el-select
              v-model="scope.form.couponType"
              placeholder="请选择"
              clearable
              :disabled="couponTypeOptionsFlag"
            >
              <el-option
                v-for="item in couponTypeOptions"
                :key="item.name + Math.random()"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 退款金额 -->
        <template slot="refundAmount">
          <div style="margin-left: 53px">
            <p>
              <b style="margin-right: 10px">退款金额</b><span>{{ parseFloat(refundFormObj.Amount).toFixed(2) }}</span>
            </p>
          </div>
        </template>
        <!-- 退款原因 -->
        <template slot="reason" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="form-item"
          >
            <el-radio-group v-model="scope.form.reason">
              <el-radio
                v-show="[1, 2, 3, 4, 5, 6].includes(refundFormObj.refundType)"
                label="服务"
              >服务</el-radio>
              <el-radio
                v-show="[1, 2, 3, 4, 5, 6].includes(refundFormObj.refundType)"
                label="内容"
              >内容</el-radio>
              <el-radio
                v-show="[1, 2, 3, 4, 5, 6].includes(refundFormObj.refundType)"
                label="销售"
              >销售</el-radio>
              <el-radio
                v-show="[1, 2, 3, 4, 5, 6].includes(refundFormObj.refundType)"
                label="盒子"
              >盒子</el-radio>
              <el-radio
                v-show="refundFormObj.refundType === 0"
                label="补发优惠券"
              >补发优惠券</el-radio>
              <el-radio
                v-show="refundFormObj.refundType === 9"
                label="优惠券过期"
              >优惠券过期</el-radio>
              <el-radio
                v-show="refundFormObj.refundType === 9"
                label="买错优惠券"
              >买错优惠券</el-radio>
              <el-radio
                v-show="refundFormObj.refundType === 9"
                label="放弃购课"
              >放弃购课</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </basics-form>
    </el-dialog>
  </div>
</template>
<script>
import { refundForm } from './forms/actionsForm'
import { actions as complaintFormAction } from '../../forms/complaintForm'
import {
  getUid_lk,
  getOrdersByUidRefundOnlyRefund,
  getResidueFee,
  getOrderproductList,
  getGmExamByUidAndOrderId,
  getBackStatus,
  getChannel,
  getPeriod,
  queryUnionCouponOrderInfo,
  getPaymentPay,
  getCoupon,
  submito
} from '@/api/operate/examineApi'
import { getStaffInfo } from '../config'
import { rainbow } from '@/utils/mini_tool_lk'
export default {
  name: 'CreateRefund',
  props: {
    refundFlag: { type: Boolean },
    complaintNo: { type: String, default: '' },
    userMobile: { type: String, default: '' }
  },
  data() {
    return {
      refundForm,
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      refundFormObj: {
        a: 1
      },
      isThird: 0,
      productData: [],
      couponTypeOptions: [], // 优惠券项
      couponTypeOptionsFlag: false,
      examType: false, // 国考券核销否
      pureWeekY: '', // 已周数(给接口)
      pureWeekS: '', // 剩周数(给接口)
      selectOrder: {}, // 公用选中的订单项
      onePrice: '', // 关单赠品,次月课程,随材盒子 用到的月单价
      fontPrice: 0, // 关单赠品最终核算价格
      productPrice: 0,
      refundFormData: [],
      jsonDate3: {
        // 次月课程,随材盒子
        boxAble: false
      },
      moneyCountLevelHalf: false, // 半年
      moneyCountLevelFullPlus: false, // 1年半
      moneyCountLevelFull: false, // 一年
      visible: this.refundFlag,
      refundMonthsComputed: 0,
      productList: [] // 关单商品的选中列表
    }
  },
  computed: {
    isForeignCoin() {
      return (
        this.refundFormObj.coinType && this.refundFormObj.coinType !== 'RMB'
      )
    },
    // 接口随材盒子整理传递
    delivery_box() {
      switch (this.refundFormObj.deductMaterial) {
        case 0:
          return this.refundFormObj.refundType === 1 ? 0 : 1
        default:
          return this.refundFormObj.deductMaterial
      }
    },
    pureWeekYto() {
      // 已经上课时间
      if (this.pureWeekY === '') {
        return ''
      } else if (this.pureWeekY / 4 >= 1) {
        return `${Math.floor(this.pureWeekY / 4)}个月${
          this.pureWeekY % 4 ? (this.pureWeekY % 4) + '周' : ''
        }`
      } else {
        return (this.pureWeekY % 4) + '周'
      }
    }
  },
  watch: {
    refundFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.userMobile) {
        this.createFilter()
      }
    })
  },
  methods: {
    // 计算退款额(基础退费基础上+次月课程+随材盒子+关单赠品)
    refundAmountComputed(val) {
      if (val === 1) {
        // 课程退款
        if (this.refundFormObj.deductMonth === 1 && this.onePrice > 0) {
          // 保留次月
          return (
            parseFloat(
              this.refundFormObj.refundAmount - (this.onePrice + this.fontPrice)
            ) || 0
          ).toFixed(2)
        } else if (this.refundFormObj.deductMonth === 0) {
          // 不保留次月
          return (
            parseFloat(
              this.refundFormObj.refundAmount -
                (this.refundFormObj.deductMaterial + this.fontPrice)
            ) || 0
          ).toFixed(2)
        } else {
          return (parseFloat(this.refundFormObj.refundAmount) || 0).toFixed(2)
        }
        // 降课包类型-随材盒子
      } else if ([2, 4, 5].includes(val)) {
        if (this.refundFormObj.deductMaterial === 0) {
          // 不扣除随材盒子差价
          return parseFloat(this.refundFormObj.deductMaterialMount).toFixed(2)
        } else {
        return (
          parseFloat(
            this.refundFormObj.Amount - this.refundFormObj.deductMaterial
          ) || 0
        ).toFixed(2)
        }
      } else {
        // 退款类型-其他
        return (parseFloat(this.refundFormObj.Amount) || 0).toFixed(2)
      }
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
    },
    // 创建退款、补发货审批现根据手机号查用户id 获取管理订单数据
    async createFilter(val) {
      const res = await getUid_lk({
        mobile: val || this.userMobile
      })
      // 给创建退款审批的用户手机号赋值
      this.$refs.complaintForm.recoveryForm({
        mobile: this.userMobile
      })
      const { blurrySearch } = res?.data
      if (blurrySearch !== '[]' && blurrySearch[0]?.id) {
        const { id } = blurrySearch[0]
        this.refundFormObj.name = id
        this.getOrdersByUid(id)
      } else {
        // 给创建退款审批的关联订单赋值
       this.$refs.complaintForm.set({
          type: 'options',
          data: {
            order: []
          }
        })
      }
    },
    // 获取管理订单数据
    async getOrdersByUid(id) {
      const data = {
        userId: id,
        statues: 'COMPLETED,WAIT_COMPLETED',
        regTypes:
          'DEFAULT,EXPERIENCE,EXPERIENCE_ONE_WEEK,FIRST_ORDER,RENEW,MAKEUP,RENEW_MAKEUP,TRAINING,COUPON,TOPIC_AESTHETIC,SPECIFIC,SPECIAL,HANDMADE',
        subject: 'ART_APP'
      }
      const res = await getOrdersByUidRefundOnlyRefund(data)
      const { code, payload } = res
      if (code === 0) {
        const data = payload.map((item) => {
          item.relationOrder =
            item.outTradeNo.replace(/[^\d]+/g, '') +
            `(^_^)${item.packagesName}`
          return item
        })
        this.refundFormData = data
        // 给创建退款审批的关联订单赋值
        refundForm.find((val) => {
          if (val.prop === 'order') {
            val.options = data.map((item) => {
              return {
                label: item.relationOrder,
                value: item.outTradeNo
              }
            })
          }
        })
      }
    },
    // 审批的提交事件
    submitApproval(val) {
      const loginInfor = getStaffInfo()
      this.selectOrder = this.refundFormData.filter((item) => {
          return item.outTradeNo === val.order
        })[0]
      const params1 = {
        refundRule:
          this.refundFormObj.isRules === '符合'
            ? 0
            : this.refundFormObj.isRules === '不符合'
            ? 1
            : null, // 符合规则
        channelOuterName: this.refundFormObj.orderSource || '', // 第三方导入订单来源
        channelId: this.refundFormObj.orderSourceId || '', // 第三方导入订单来源id
        isImport: this.isThird, // 1是0否
        userId: this.refundFormObj.name, // userId(选择用户取)
        customerPhone: val.mobile, // 客户手机(选择用户取)
        orderId: this.refundFormObj.orderId, // 订单id(关联订单取)
        outTradeNo: val.order, // 订单号(关联订单取)
        productMsg: this.selectOrder?.relationOrder.split('(^_^)')[1], // 商品信息(关联订单取)
        regType: this.refundFormObj.businessType, // 业务类型
        channel: this.refundFormObj.payChannel, // 支付渠道
        coinType: this.refundFormObj.coinType, // 支付币种
        relationOrderCoupon: this.refundFormObj.relationOrderCoupon || '', // 关联订单(优惠券)
        couponOid: this.refundFormObj.couponOid || '', // 贺磊要的关联订单号
        orderFee: this.refundFormObj.orderAmount, // 订单金额
        residueFee: this.refundFormObj.residueFee, // 剩余金额
        refundType: this.refundFormObj.refundType, // 退款类型
        refundFee: parseFloat(this.refundFormObj.Amount).toFixed(2), // 退款金额——新
        refundReason: val.reason, // 退款原因
        refundMsg: val.explain, // 退款说明
        couponType: this.refundFormObj.couponType || '', // 选择退哪种优惠券
        attsUrl: val.imgUrl[0]?.url, // 附件地址

        periodAll: this.pureWeekS + this.pureWeekY, // 订单总周期“周”
        periodAlready: this.pureWeekY, // 已上课周期“周”(原味)
        periodResidue: this.pureWeekS, // 剩余上课周期“周”(原味)
        periodRefund: this.refundMonthsComputed * 4, // (剩余的全退)多少周期“周”(floor处理后,小于真实剩余周数periodResidue)-新

        productList: this.productList ? this.productList : [], // 新版关单赠品
        deductMonth: this.refundFormObj.deductMonth, // 次月课程
        deductMaterial: this.delivery_box, // 随材盒子

        applyUserId: loginInfor.staffId,
        applyUserName: loginInfor.staffName,
        applyUserDeapartmentId: loginInfor.applyDepartmentId,
        applyUserDeapartmentName: loginInfor.applyDepartment,
        complaintNo: this.complaintNo // 同步投诉单号
      }
      if (Number(this.refundFormObj.Amount) > 0) {
        if (this.isThird) {
        this.$confirm(
          '此订单是第三方渠道导入订单,请顾问老师告知用户，去购买渠道进行退款操作。详情联系杨阳老师',
          '提示',
          {
            showCancelButton: false,
            type: 'warning'
          }
        ).then(() => {
          const loading = this.$loading({
            lock: true
          })
          submito(params1)
            .then(({ code }) => {
              this.approvalFlag = false
              if (code === 0) {
                this.$message.success('创建退款审批成功')
              }
            })
            .catch((err) => {
              console.info(err)
            })
            .finally(() => {
              setTimeout(() => {
                loading.close()
              }, 1000)
            })
        })
      } else {
        const loading = this.$loading({
          lock: true
        })
        submito(params1)
          .then(({ code }) => {
            this.$emit('cancel')
            if (code === 0) {
              this.$message.success('创建退款审批成功')
            }
          })
          .catch((err) => {
            console.info(err)
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
      }
      } else {
          this.$message({
            message: '退款金额不能小于0~',
            type: 'error'
          })
      }
    },
    // 审批的改变事件
    async changeApproval(val, valOld) {
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (val.mobile !== valOld.mobile && reg.test(val.mobile)) {
        this.createFilter(val.mobile)
      }
      // 关联订单联动
      this.isThird = 0
      let targetItem = {}
      if (val.order !== valOld.order) {
        targetItem = this.refundFormData.filter((item) => {
          return item.outTradeNo === val.order
        })[0]
        this.refundFormObj.Amount = this.refundAmountComputed(null)
      }
      // 显示业务类型
      if (targetItem && targetItem.regtype) {
        switch (targetItem.regtype) {
          case 'TRAINING':
            this.refundFormObj.businessType = '训练营'
            break
          case 'TOPIC_AESTHETIC':
            this.refundFormObj.businessType = '美育主题课'
            break
          case 'COUPON':
            this.refundFormObj.businessType = '预付款优惠券'
            break
          case 'SPECIAL':
          case 'EXPERIENCE':
          case 'EXPERIENCE_ONE_WEEK':
            this.refundFormObj.businessType = '体验课'
            break
          default:
            this.refundFormObj.businessType = '系统课'
            break
        }
      }
      // 导入订单红色显示(只限体验课)
      if (targetItem && targetItem.regtype === 'EXPERIENCE') {
        this.isThird =
          Number(targetItem.importTime) > 0 && targetItem.importTime ? 1 : 0
      }
      // 获取该订单剩余金额
      if (targetItem && targetItem.id) {
        const { code, payload } = await getResidueFee({
          orderId: targetItem.id,
          subject: 'ART_APP'
        }).catch(() => {
          this.$message({
            message: '该订单剩余金额获取失败',
            type: 'error'
          })
        })
        if (!code && payload > 0) {
          this.refundFormObj.residueFee = payload
          // this.refundFormObj.residueFee = 600
        } else {
          this.$message({
            message: '该订单剩余金额获取失败或为0',
            type: 'warning'
          })
          // setTimeout(() => {
          //   location.reload()
          // }, 3000)
        }
      }
      if (targetItem && targetItem.id) {
        // 获取关单赠品列表
        await getOrderproductList({
          orderId: targetItem.id,
          subject: 'ART_APP'
        }).then((res) => {
          this.productData = res.payload
        })
        const query = {
          orderId: targetItem.id,
          uid: this.refundFormObj.name,
          subject: 'ART_APP'
        }
        // 获取国美考级-检测已核销-标识必扣费
        this.examType = false
        await getGmExamByUidAndOrderId(query).then((res) => {
          if (res.payload && res.payload.status === 'ALREADYCHECK') {
            this.examType = true
          }
        })
        // 查询订单退款规则状态 {code,payload: { isRefundStatus }}
        const {
          code,
          payload: { isRefundStatus }
        } = await getBackStatus({
          subject: 'ART_APP',
          orderId: targetItem.id
        }).catch(() => {
          this.$message({
            message: '未能获取退款规则',
            type: 'error'
          })
        })
        if (code === 0 && isRefundStatus === 1) {
          this.refundFormObj.isRules = '不符合'

          // toss limit 不合规的订单 只有系统课老师且职级是组长经理 才能提
          if (location.href.includes('toss')) {
            const storagel = JSON.parse(localStorage.getItem('teacher'))
            const isct = storagel.dutyId === '2'
            const iscaptain =
              storagel.rank === '组长' || storagel.rank === '经理'
            if (!(isct && iscaptain)) {
              const confirmText = [
                '组员不可提交超期退费',
                '如必须提交，可联系组长或服务运营'
              ]
              const newDatas = []
              const h = this.$createElement
              for (const i in confirmText) {
                newDatas.push(h('section', null, confirmText[i]))
              }
              this.$confirm('必填', {
                showClose: false, // 右上角x
                closeOnClickModal: false, // 点击遮罩关闭mask
                closeOnPressEscape: false, // esc键关闭mask
                roundButton: true, // 圆角按钮
                title: '提示',
                message: h('div', null, newDatas),
                showCancelButton: false,
                type: 'warning'
              }).then(() => {
                location.reload()
              })
            }
          }
        } else if (code === 0 && isRefundStatus !== 1) {
          this.refundFormObj.isRules = '符合'
        } else {
          this.$message({
            message: '未能获取退款规则',
            type: 'warning'
          })
        }
      }
      // 只有isThird===1是第三方订单,才去查来源
      if (targetItem && targetItem?.payChannel && this.isThird) {
        const { code, payload } = await getChannel({
          id: targetItem.payChannel
        }).catch((err) => {
          console.warn(err)
          this.$message({
            message: '第三方导入订单来源获取失败',
            type: 'error'
          })
        })
        if (!code && payload && payload.channelOuterName) {
          this.refundFormObj.orderSource = payload.channelOuterName
          this.refundFormObj.orderSourceId = payload.id
        } else {
          this.$message({
            message: '第三方导入订单来源获取失败',
            type: 'warning'
          })
        }
      }
      // 只有系统课||训练营||美育课 才去查-已上课时
      let remainingWeekdata = ''
      let reduceWeekdata = ''
      if (
        targetItem &&
        targetItem.id &&
        ['系统课', '训练营', '美育主题课'].includes(
          this.refundFormObj.businessType
        )
      ) {
        const res = await getPeriod({
          orderNo: targetItem.id
        }).catch((err) => {
          console.warn(err)
          this.$message({
            message: '课程剩余信息未获能获取,无法计算退款',
            type: 'error'
          })
        })
        const { payload } = res
        remainingWeekdata = payload?.remainingWeek
        reduceWeekdata = payload?.reduceWeek
      }
      // toss limit 已开课的系统课订单，销售老师不能发起退款申请
      if (
        location.href.includes('toss') &&
        reduceWeekdata > 0 &&
        JSON.parse(localStorage.getItem('teacher')).dutyId === '1'
      ) {
        const confirmText = [
          '社群销售不可提交已开课系统课订单',
          '如有疑问请联系销售运营'
        ]
        const newDatas = []
        const h = this.$createElement
        for (const i in confirmText) {
          newDatas.push(h('section', null, confirmText[i]))
        }
        this.$confirm('必填', {
          showClose: false, // 右上角x
          closeOnClickModal: false, // 点击遮罩关闭mask
          closeOnPressEscape: false, // esc键关闭mask
          roundButton: true, // 圆角按钮
          title: '提示',
          message: h('div', null, newDatas),
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          location.reload()
        })
      }
      // 获取课程信息
      if (remainingWeekdata) {
        this.pureWeekS = remainingWeekdata
        this.pureWeekY = reduceWeekdata
        // console.info(
        //   `接口得到课程剩余${this.pureWeekS},已上课${this.pureWeekY}`
        //   )
      }
      // 显示支付币种
      if (targetItem && targetItem.coinType) {
        this.refundFormObj.coinType = targetItem.coinType
      }
      // 显示订单金额
      if (targetItem && targetItem.amount) {
        this.refundFormObj.orderAmount =
          this.refundFormObj.coinType === 'RMB'
            ? targetItem.amount
            : targetItem.otherAmount
            this.moneyCountLevelHalfFn(this.refundFormObj.orderAmount)
            this.moneyCountLevelFullFn(this.refundFormObj.orderAmount)
            this.moneyCountLevelFullPlusFn(this.refundFormObj.orderAmount)
      }
      // 显示关联订单(优惠券)-累加订单金额↑用于显示(该订单只在大陆用软妹币支付)
      if (targetItem && parseInt(targetItem.associatedOrderId)) {
        const {
          payload: {
            couponOrderUseFlag,
            outShowName,
            unionOrder: { outTradeNo, amount, id }
          }
        } = await queryUnionCouponOrderInfo({
          orderId: targetItem.id
        }).catch((err) => {
          console.warn(err)
          this.$message({
            message: '关联订单信息获取失败',
            type: 'error'
          })
        })
        if (couponOrderUseFlag) {
          this.refundFormObj.orderAmount += amount // 订单金额累加
          this.refundFormObj.couponOid = id // 优惠券订单id
          this.refundFormObj.relationOrderCoupon =
            outTradeNo.replace(/[^\d]+/g, '') + `(^_^)${outShowName}` // 订单编号(^_^)名称
        }
      }
      // 拿到选中订单的id,取支付渠道
      if (targetItem && targetItem.id) {
        this.refundFormObj.orderId = targetItem.id // 存oid給iphone
        await getPaymentPay(
          JSON.stringify({ oid: targetItem.id, status: '2' })
          // 查询条件:status-2完成状态;type-1收入
        )
          .then(({ data: { PaymentPay }}) => {
            if (PaymentPay && PaymentPay.trade_type) {
              this.refundFormObj.payChannel = rainbow[PaymentPay.trade_type]
              this.$forceUpdate()
              if (rainbow[PaymentPay.trade_type] === '支付宝H5支付') {
                this.isAlipay = true
              }
            } else if (PaymentPay && !PaymentPay.trade_type) {
              this.refundFormObj.payChannel = rainbow[PaymentPay.trade_type]
            } else {
              this.$message({
                message: '支付渠道未能获取',
                type: 'warning'
              })
            }
          })
          .catch((e) => {
            console.error(e)
            this.$message({
              message: '支付渠道未能获取',
              type: 'error'
            })
          })
      }
      // 以上为关联表单  不可修改退款相关显示

      // 次月课程改变
      if (val.deductMonth !== valOld.deductMonth) {
        // 保留-选中随材盒子不扣费并锁定操作
        if (val.deductMonth === 1) {
          this.jsonDate3.boxAble = true
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: {
              deductMaterial: 0
            }
          })
          this.refundFormObj.deductMaterial = 0
          this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
        } else if (val.deductMonth === 0) {
          // 不保留 随材盒子自由选择
          this.jsonDate3.boxAble = false
          this.refundFormObj.deductMaterial = ''
        }
        this.refundFormObj.deductMonth = val.deductMonth
      }
      // 退款类型改变
      if (val.refundType !== valOld.refundType) {
        this.refundFormObj.refundType = val.refundType
        val.deductMonth = ''
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
          couponType: ''
          }
        })
        this.$forceUpdate()
        this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
        targetItem = this.refundFormData.filter((item) => {
          return item.outTradeNo === val.order
        })[0]
        if (val.refundType === 0) {
           this.refundFormObj.Amount = '0.00'
           this.$forceUpdate()
        }
      }
      // primary->存起来方便公用
      this.selectOrder = targetItem
      // 初始就触发,执行前确认关联订单已选择
      if (this.selectOrder && Object.keys(this.selectOrder).length) {
        // 课程退款+降课包=>随材盒子
        // val.refundType:0 选中优惠券时-获取优惠券列表
        if (val.refundType === 0) {
          this.couponTypeOptionsFlag = false
          if (this.refundFormObj.residueFee >= 200) {
            this.couponTypeOptions = []
            this.refundFormObj.couponType = ''
            await getCoupon({
              packageId: this.selectOrder.packagesId
            })
              .then(({ code, payload }) => {
                if (!code && payload.length) {
                  this.couponTypeOptions = payload
                } else {
                  this.$message({
                    message: '优惠券类型未能获取',
                    type: 'warning'
                  })
                }
                // throw new Error('WEWE')
              })
              .catch((err) => {
                console.warn(err)
                this.$message({
                  message: '优惠券类型未能获取',
                  type: 'error'
                })
              })
          } else {
            this.couponTypeOptionsFlag = true
            this.$message({
              message: '当前剩余金额小于200元,不能选择优惠券退款昂',
              type: 'warning'
            })
          }
        } else if (val.refundType === 1) {
          // 选中课程退款时
          if (
            ['系统课', '训练营', '美育主题课'].includes(
              this.refundFormObj.businessType
            )
          ) {
            //  VIRTUAL_GOODS-虚拟商品自动勾选-国考
            const that = this
            this.$nextTick(() => {
              that.productData.forEach((row) => {
                if (row.type === 'VIRTUAL_GOODS') {
                  this.$refs.multipleTable.toggleRowSelection(row, true)
                }
              })
            })
            if (
              typeof this.pureWeekS === 'number' &&
              Object.prototype.toString.call(this.pureWeekY) ===
                '[object Number]'
            ) {
              // 计算系统课退费,得保证取到剩总课时和已上课时
              const yiYue = Math.ceil(this.pureWeekY / 4) // 已上课向上取整
              const shengYue = Math.floor(this.pureWeekS / 4) // 剩余课数向下取整
              console.warn(
                '选择退款类型为课程退款-(系统课-训练营-美育课),计算所得',
                '已上周数-真实:' + this.pureWeekY,
                '已上月份-ceil取整:' + yiYue,
                '剩余周数-真实:' + this.pureWeekS,
                '剩余月份-floor取整:' + shengYue
              )
              // 计算课程退费
              if (shengYue <= 0) {
                this.$confirm('该订单剩余课程时间不足1个月, 不支持退款', {
                  showCancelButton: false,
                  type: 'error'
                }).then(() => {
                  // this.onCancel('refundFormObj')
                  setTimeout(() => {
                    location.reload()
                  }, 4000)
                })
              } else {
                // 全年半年二合一
                const interfaceTy = (this.pureWeekS + this.pureWeekY) / 4 // 总周数
                const priceTre = this.refundFormObj.residueFee / interfaceTy // 单价
                this.onePrice = priceTre
                this.refundFormObj.refundAmount =
                  this.refundFormObj.residueFee - priceTre * yiYue
                this.refundFormObj.refundMonths = shengYue // 退了几个月的课
              }
            }
          } else {
            // 体验课直接退全部,导入型直接0
            this.refundFormObj.refundAmount = this.refundFormObj.residueFee
          }
        // 计算退款金额
        this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
        this.$forceUpdate()
          // 降为半年包(分两类情况价格不同)
        } else if (val.refundType === 2) {
          const shengYue = Math.floor(this.pureWeekS / 4)
          if (this.refundFormObj.businessType === '系统课') {
            if (shengYue >= 6 && this.refundFormObj.residueFee >= 881) {
              if (
                this.refundFormObj.orderAmount === 2680 ||
                this.refundFormObj.orderAmount === 2180
              ) {
                this.refundFormObj.Amount = 881
              } else if (
                this.refundFormObj.orderAmount === 2800 ||
                this.refundFormObj.orderAmount === 2600
              ) {
                this.refundFormObj.Amount = 1101
                // Number(this.selectOrder.buytime) < 1607011200000
                //   ? 1101
                //   : 1001
              } else {
                this.$message.warning('订单金额未涵盖')
              }
              this.refundFormObj.refundMonths = 6
            } else {
              this.$message({
                message: '该订单课余量低于6个月或余额低于881,不支持该降包类型',
                type: 'warning'
              })
              // this.onCancel('refundFormObj')
              setTimeout(() => {
                location.reload()
              }, 4000)
            }
          } else {
            this.$message({
              message: '该订单非年课订单,不支持降包',
              type: 'warning'
            })
            // this.onCancel('refundFormObj')
            setTimeout(() => {
              location.reload()
            }, 4000)
          }
          // 降1年课包
        } else if (val.refundType === 4) {
          const shengYue = Math.floor(this.pureWeekS / 4)
          if (shengYue >= 12 && this.refundFormObj.residueFee >= 1600) {
            if (
              this.refundFormObj.orderAmount === 3181 ||
              this.refundFormObj.orderAmount === 2981
            ) {
              this.refundFormObj.Amount = 1880
            } else if (
              this.refundFormObj.orderAmount === 4680 ||
              this.refundFormObj.orderAmount === 5280
            ) {
              this.refundFormObj.Amount = 2080
            } else if (
              this.refundFormObj.orderAmount === 3681 ||
              this.refundFormObj.orderAmount === 3881 ||
              this.refundFormObj.orderAmount === 2601 ||
              this.refundFormObj.orderAmount === 2701 ||
              this.refundFormObj.orderAmount === 5200 ||
              this.refundFormObj.orderAmount === 4200
            ) {
              this.refundFormObj.Amount = 1600
            } else {
              this.$message.warning('订单金额未涵盖')
            }
            this.refundFormObj.refundMonths = 12
          } else {
            this.$message({
              message:
                '该订单课余量低于12个月或剩余金额低于1600,不支持该降包类型',
              type: 'warning'
            })
            // this.onCancel('refundFormObj')
            setTimeout(() => {
              location.reload()
            }, 4000)
          }
        } else if (val.refundType === 5) {
          // 降1年半课包
          const shengYue = Math.floor(this.pureWeekS / 4)
          if (shengYue >= 18 && this.refundFormObj.residueFee >= 2601) {
            if (
              this.refundFormObj.orderAmount === 5200 ||
              this.refundFormObj.orderAmount === 4200
            ) {
              this.refundFormObj.Amount = 2701
            } else if (
              this.refundFormObj.orderAmount === 4680 ||
              this.refundFormObj.orderAmount === 5280
            ) {
              this.refundFormObj.Amount = 3181
              // Number(this.selectOrder.buytime) < 1607011200000 ? 3181 : 3081
            } else {
              this.$message.warning('订单金额未涵盖')
            }
            this.refundFormObj.refundMonths = 18
          } else {
            this.$message({
              message:
                '该订单课余量低于18个月或剩余金额低于2601,不支持该降包类型',
              type: 'warning'
            })
            // this.onCancel('refundFormObj')
            setTimeout(() => {
              location.reload()
            }, 4000)
          }
        } else if (val.refundType === 3) {
          // 补偿
          this.$prompt('13或100或200', '补偿金额', {
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            confirmButtonText: '确定',
            inputPattern: /^(200|100|13)$/,
            inputErrorMessage: '只能13或100或200'
          }).then(({ value }) => {
            if (this.refundFormObj.residueFee < value) {
              this.$message.error('补偿金额不能大于剩余金额')
              this.refundFormObj.Amount = value
              setTimeout(() => {
                location.reload()
              }, 3000)
            } else {
              this.refundFormObj.Amount = value
              this.$forceUpdate()
            }
          })
        } else if (val.refundType === 6) {
          // 训练营补差价满足条件直接退-400
          this.refundFormObj.Amount = 400
        } else if (val.refundType === 9) {
          // 预付款优惠券退款-全退剩余金额
          this.refundFormObj.refundMonths = ''
          this.refundFormObj.Amount = this.refundFormObj.residueFee
        }
        this.refundFormObj.deductMaterialMount = this.refundFormObj.Amount
      }
      if (val.refundType === 0) {
      // 优惠劵改变
      if (val.couponType !== valOld.couponType) {
        if (val.couponType) {
          const targetItem = this.couponTypeOptions.filter((item) => {
            return item.name === val.couponType
          })[0]
          this.refundFormObj.Amount = targetItem.amount
          this.$forceUpdate()
          if (this.refundFormObj.refundAmount > this.refundFormObj.residueFee) {
            this.$message({
              message: '退款金额不能大于剩余金额',
              type: 'error'
            })
            this.refundFormObj.refundAmount = ''
          }
        }
      }
      }
      if (val.refundType === 1) {
        // 计算退款金额
        this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
        this.$forceUpdate()
      }
      // 随材盒子改变金额改变
      if (val.deductMaterial !== valOld.deductMaterial) {
        this.refundFormObj.deductMaterial = val.deductMaterial
           this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
           this.$forceUpdate()
      }
      console.log(this.refundFormObj)
     // 统一规划退款预警值
      if (this.refundFormObj.residueFee - Number(this.refundFormObj.Amount) < 0 || Number(this.refundFormObj.Amount) < 0) { // 剩余金额减去退款金额 或 退款金额小于0
          this.$message.warning(
            (this.refundFormObj.Amount < 0 ? '退款金额小于0' : '退款金额大于剩余金额') +
              ',不可选择~'
          )
          if (val.deductMaterial !== 0 && this.refundFormObj.Amount < 0) {
            this.$refs.complaintForm?.set({
            type: 'defaultVal',
            data: {
              deductMaterial: 0
            }
          })
          this.refundFormObj.Amount = this.refundAmountComputed(val.refundType)
          }
      }

    // 统一规划退款月数预警值
      if (this.refundFormObj.refundMonths - this.refundFormObj.deductMonth >= 0) {
        this.refundMonthsComputed = this.refundFormObj.refundMonths - this.refundFormObj.deductMonth
        if (this.refundMonthsComputed < 0) {
          this.$message.warning('经核算退款月数小于0,重置')
           setTimeout(() => {
             location.reload()
            this.onCancel('refundForm')
           }, 3000)
        }
      }
    },
    checkSelectable(row, index) {
      if (
        (row.id === '3462' && this.examType) ||
        row.id === '3492' ||
        row.id === '3493'
      ) {
        return undefined
      } else {
        return true
      }
    },
    handleSelectionChange(val) {
      this.productList = []
      this.productPrice = 0
      // 核算选中赠品价格+整合选中赠品
      if (val.length) {
        val.forEach((item) => {
          this.productPrice = this.productPrice + item.price
          this.productList.push(item)
        })
      }
      this.fontPrice = this.productPrice
      this.refundFormObj.Amount = this.refundAmountComputed(this.refundFormObj.refundType)
    },
    moneyCountLevelHalfFn(orderAmount) {
      // 半年
      if (
        orderAmount === 2800 ||
        orderAmount === 2600 ||
        orderAmount === 2680 ||
        orderAmount === 2180
      ) {
        this.moneyCountLevelHalf = true
      } else {
        this.moneyCountLevelHalf = false
      }
    },
    moneyCountLevelFullFn(orderAmount) {
      // 一年
      if (
        orderAmount === 3181 ||
        orderAmount === 2981 ||
        orderAmount === 3681 ||
        orderAmount === 3881 ||
        orderAmount === 2601 ||
        orderAmount === 2701 ||
        orderAmount === 4680 ||
        orderAmount === 5280 ||
        orderAmount === 5200 ||
        orderAmount === 4200
      ) {
        this.moneyCountLevelFull = true
      } else {
        this.moneyCountLevelFull = false
      }
    },
    moneyCountLevelFullPlusFn(orderAmount) {
      // 1年半
      if (
        orderAmount === 4680 ||
        orderAmount === 5280 ||
        orderAmount === 5200 ||
        orderAmount === 4200
      ) {
        this.moneyCountLevelFullPlus = true
      } else {
        this.moneyCountLevelFullPlus = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.refundOther_stype {
  width: 100%;
  padding: 0 53px;
  display: grid;
  grid: 43px 40px/1fr 1fr;
  b {
    margin-right: 10px;
  }
}
.refund-form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
  .refund-form {
    /deep/.el-form-item__content {
      width: 300px;
      margin-left: 120px;
    }
  }
  .deductMaterial-form {
    /deep/.el-form-item__content {
      width: 700px;
      margin-left: 120px;
      .el-radio {
        line-height: 2;
      }
    }
  }
  .form-item {
    /deep/.el-form-item__content {
      width: 100%;
      margin-left: 120px;
    }
  }
}
</style>
