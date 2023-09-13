<template>
  <div>
    <el-dialog
      :title="info.title"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="700px"
      @close="cancel"
    >
      <div v-if="info.instroduct" style="padding-bottom: 20px">
        <el-alert
          :title="info.instroduct"
          type="warning"
          show-icon
          :closable="false"
        />
      </div>
      <basics-form
        ref="complaintForm"
        :key="agreeApprovalFlag"
        :forms="complaintForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        class="repair-form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <template slot="userCallMobile" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <span>{{ rowData.userCallMobile }}</span>
          </el-form-item>
        </template>
        <template slot="orderNo" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <span>{{ rowData.complaintAfterSaleEntity.orderId || "-" }}</span>
          </el-form-item>
        </template>
        <template slot="productName" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <span>{{ approvalData.productName || rowData.productName }}</span>
          </el-form-item>
        </template>
        <template v-if="rowData.imgUrl" slot="imgUrl" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <div class="commodity-img-box">
              <el-image
                v-for="(itemA, indexA) in rowData.imgUrl.split(',')"
                :key="indexA"
                :preview-src-list="[itemA]"
                :src="itemA"
                alt=""
              />
            </div>
          </el-form-item>
        </template>
        <template slot="asType" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <span>{{ asTypeData[rowData.asType] }}</span>
          </el-form-item>
        </template>
        <template slot="mailLogisticsList" slot-scope="scope">
          <el-form-item :label="scope.item.label" :prop="scope.item.prop">
            <div
              v-if="[2, 3].includes(asTypeNum[rowData.asType])"
              class="mailLogisticsList-detail"
            >
              <div
                v-for="item in rowData.mailLogisticsList"
                :key="item.orderNo"
              >
                <span class="commodity-info-tag"> 物流单号: </span>
                <span>{{ item.orderNo }}</span>
                <span class="commodity-info-tag"> 发货状态: </span>
                <span>{{ item.status }}</span>
                <a style="color: #409eff" @click="openlogisticsTrajectoryFn(item)">查询轨迹</a>
              </div>
            </div>
            <span v-else style="color: red">{{
              rowData.mailLogisticsList ? rowData.mailLogisticsList[0].status : '-'
            }}</span>
          </el-form-item>
        </template>
        <template slot="refundAmount" slot-scope="scope">
          <div class="address">
            <el-form-item
              :label="scope.item.label"
              :prop="scope.item.prop"
              :rules="rules.refundAmount"
              class="repair-form"
            >
              <el-input v-model="scope.form.refundAmount">
                <template slot="suffix">{{ rowData.currency === 5?'金币':rowData.currencyInfo }}</template>
              </el-input>
            </el-form-item>
            <div v-if="rowData.currency !== 5" style="margin-left: 120px;margin-bottom: 10px">注：金额修改范围0＜X≤订单金额</div>
          </div>
        </template>
        <template v-if="rowData.currency === 5" slot="cash" slot-scope="scope">
          <div class="address">
            <el-form-item
              :label="scope.item.label"
              :prop="scope.item.prop"
              :rules="rules.cash"
              class="repair-form"
            >
              <el-input v-model="scope.form.cash">
                <template slot="suffix">现金</template>
              </el-input>
            </el-form-item>
            <div style="margin-left: 120px;margin-bottom: 10px">注：金额修改范围0＜X≤订单金额</div>
          </div>
        </template>
        <template slot="productRemark" slot-scope="scope">
          <div class="address">
            <el-form-item
              :label="scope.item.label"
              :prop="scope.item.prop"
              class="repair-form"
            >
              <el-input v-model="scope.form.productRemark" />
              <div>注：当散件补发没有可选的商品时，可文字说明</div>
            </el-form-item>
          </div>
        </template>
        <!-- 收货人地址 -->
        <template slot="address" slot-scope="scope">
          <div class="newAddresInfo">
            <el-form-item
              v-bind="scope.item"
              class="repair-form"
            >
              <el-input v-model="scope.form.address" type="textarea" :disabled="true" />
              <div v-if="addressStatus" class="address-tips">
                <span>当前地址不支持发货，请切换收货地址！</span>
              </div>
            </el-form-item>
            <div class="repair-address" @click="repairAddress">修改地址</div>
          </div>
        </template>
      </basics-form>
    </el-dialog>

    <!-- 弹窗 选择地址 -->
    <el-dialog title="收货地址" :visible.sync="addresListDialog">
      <div class="address-info">
        <div v-for="(item, index) in approvalData.addressList" :key="index">
          <div :class="item.disabled ? 'addressList addressListDis' : 'addressList'">
            <div>
              <span v-if="item && Object.keys(item).length">{{
                item.consigneeProvince +
                  item.consigneeCity +
                  item.consigneeArea +
                  item.consigneeAddress
              }}</span>
              <span
                v-if="item && Object.keys(item).length"
              >联系人：{{ item.consigneeName + item.consigneeMobile }}</span>
            </div>
            <el-button type="text" :disabled="item.disabled" @click="selectaddres(item)">选择</el-button>
          </div>
          <div v-if="item.disabled" class="address-tips">
            <span>当前地址不支持发货，请切换收货地址！</span>
          </div>
        </div>
        <el-divider />
      </div>
    </el-dialog>

    <!-- 查询轨迹 -->
    <logisticsTrajectory
      v-if="logisticsTrajectoryFlag"
      :logistics-trajectory-flag="logisticsTrajectoryFlag"
      :row-data="logisticsDetailDto"
      @cancel="logisticsTrajectoryCancel"
    />
  </div>
</template>
<script>
import { actions as complaintFormAction } from '../../forms/complaintForm'
import { getStaffInfo } from '../config'
import { asTypeData, asTypeNum } from './config'
import { handleAfterSale, checkSaleRegion } from '@/api/operate/complainNew'
import logisticsTrajectory from './logisticsTrajectory.vue'
import { getToken } from '@/utils/auth'
import { debounce } from 'lodash'

export default {
  name: 'AgreeApproval',
  components: {
    logisticsTrajectory
  },
  props: {
    agreeApprovalFlag: { type: Boolean },
    complaintNo: { type: String, default: '' },
    info: { type: Object, default: () => {} },
    rowData: { type: Object, default: () => {} },
    approvalRefundForm: { type: Array, default: () => [] },
    approvalData: { type: Object, default: () => {} }
  },
  data() {
    const refundAmountRules = (rule, value, callback) => {
      const { rowData } = this
        if (!value) {
          return callback(new Error('退款金额必填！'))
        }
        setTimeout(() => {
          if (!Number(value)) {
             callback(new Error('请输入正确的退款金额数值！'))
          } else {
            if ([2, 3, 5].includes(rowData.currency)) {
              // 小熊币 金币
              if (Number(value) > Number(rowData.refundAmount)) {
                callback(new Error('退款金额不能大于实付金额!'))
              } else if (String(value).indexOf('.') !== -1) {
                callback(new Error('请输入正确的退款金额格式, 不可保留小数点!'))
              } else {
                callback()
              }
            } else if ([1, 4].includes(rowData.currency)) {
              // 人民币 课时
              if (Number(value) > Number(rowData.refundAmount)) {
                callback(new Error('退款金额不能大于实付金额!'))
              } else {
                callback()
              }
            }
          }
        }, 500)
      }
    const cashRules = (rule, value, callback) => {
      const { rowData } = this
        if (!value) {
          return callback(new Error('退款金额必填！'))
        }
        setTimeout(() => {
          if (!Number(value)) {
             callback(new Error('请输入正确的退款金额数值！'))
          } else {
            // 现金
            if (Number(value) > Number(rowData.complaintAfterSaleEntity && rowData.complaintAfterSaleEntity.cash)) {
              callback(new Error('退款金额不能大于实付金额!'))
            } else {
              callback()
            }
          }
        }, 500)
      }
    return {
      formRepair: {},
      addresListDialog: false,
      countryCode: '',
      countryName: '',
      isChina: 0,
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      visible: this.agreeApprovalFlag,
      complaintForm: this.approvalRefundForm,
      asTypeData,
      asTypeNum,
      logisticsTrajectoryFlag: false,
      logisticsDetailDto: {},
      emitAddress: {},
      newProductDataList: [],
      rules: {
        refundAmount: [
          { required: true, message: '退款金额必填！' },
          { validator: refundAmountRules, trigger: ['blur', ' change'] }
        ],
        cash: [
          { required: true, message: '退款金额必填！' },
          { validator: cashRules, trigger: ['blur', ' change'] }
        ]
      },
      addressStatus: false,
      productDataCode: []
    }
  },
  watch: {
    agreeApprovalFlag(newVal) {
      this.visible = newVal
    },
    approvalRefundForm: {
      handler: function(val, oldVal) {
        if (val.length !== 0 && oldVal.length !== 0) {
          this.complaintForm = val
        }
      },
      deep: true
    }
  },
  // done-登录人信息
  created() {
    const staff = getStaffInfo()
    this.formRepair.applyId = staff.staffId
    this.formRepair.applyName = staff.staffName
    this.formRepair.applyDepartment = staff.applyDepartment
  },
  mounted() {
    const { approvalData, rowData } = this
    // 回显
    this.$nextTick(() => {
    this.$refs.complaintForm?.recoveryForm({
      ...approvalData,
      productCode: rowData.productName,
      productDataList: '',
      refundAmount: this.parseIntFn(rowData.refundAmount),
      cash: rowData.complaintAfterSaleEntity && rowData.complaintAfterSaleEntity.cash,
      reissueType: approvalData.reissueType ? String(approvalData.reissueType) : '1'
    })
    if (approvalData.address?.length !== 0) {
      // 新地址
      const newAddresInfo = approvalData.address?.consigneeProvince +
            approvalData.address?.consigneeCity +
            approvalData.address?.consigneeArea +
            approvalData.address?.consigneeAddress
      // 新联系人
      const newAddresUser = approvalData.address?.consigneeName +
            approvalData.address?.consigneeMobile
      this.$refs.complaintForm?.recoveryForm({
        address: (newAddresInfo && newAddresUser) ? newAddresInfo + '联系人:' + newAddresUser : ''
      })
      this.emitAddress = approvalData.address
    }

    // 散件补发的时候显示商品数据
    if (approvalData.productDataList?.length) {
      this.newProductDataList = approvalData.productDataList
      approvalData.productDataList = approvalData.productDataList?.map(val => {
        return {
          label: val.productName,
          value: val.productCode
        }
      })
      this.$refs.complaintForm.set({
        type: 'options',
        data: {
          productDataList: approvalData.productDataList
        }
      })
    }
    })
  },
  methods: {
    parseIntFn(val) {
      if ([1, 4].includes(this.rowData.currency)) { // 人民币 课时
        return val
      } else if ([2, 3].includes(this.rowData.currency)) { // 小熊币 金币
        return parseInt(val)
      } else {
        return parseInt(val)
      }
    },
    //  表单提交事件
    submitApproval: debounce(async function(values) {
      const { approvalData, rowData, emitAddress, newProductDataList } = this

      const data = {
        ...approvalData,
        ...values,
        id: approvalData.id ? approvalData.id : '',
        complaintNo: rowData.complaintNo,
        type: asTypeNum[rowData.asType],
        refundAmount: this.parseIntFn(values.refundAmount),
        cash: values.cash,
        productName: approvalData.productName || rowData.productName,
        productCode: approvalData.productCode || rowData.complaintAfterSaleEntity.productCode,
        productDataList: newProductDataList?.filter(item => values.productDataList?.includes(item.productCode)),
        address: emitAddress?.length !== 0 ? emitAddress : '',
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      // 补发&供应链驳回&不是第一次触发审核=重审
      if (rowData.asType === 'REPLENISHMENT' && rowData.cpStatusSub === 27 && approvalData.id) {
        data.status = 3
      } else {
        data.status = 1
      }
      await this.handleAfterSaleFn(data)
    }, 500),

    handleAfterSaleFn(data) {
      const loading = this.$loading({
        lock: true
      })
      handleAfterSale(data).then((res) => {
        loading.close()
        const { code } = res
        if (code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
        this.$emit('cancel')
        this.$emit('getComplain')
      })
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
      this.formRepair.selectList = []
    },
    logisticsTrajectoryCancel() {
      this.logisticsTrajectoryFlag = false
    },
    //  表单改变事件
    async changeApproval(val, valOld) {
      if (val.reissueType !== valOld.reissueType) {
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            productCode: val.reissueType === '1',
            productDataList: val.reissueType === '2',
            productRemark: val.reissueType === '2'
          }
        })
        this.productDataCode = []
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            productDataList: []
          }
        })
        if (val.reissueType === '1') this.checkSaleRegion()
      } else if (val.productDataList?.length > 0 && JSON.stringify(val.productDataList) !== JSON.stringify(valOld.productDataList)) {
        this.productDataCode = val.productDataList
        this.checkSaleRegion()
      }
    },
    // done-地址弹窗打开
    repairAddress() {
      this.addresListDialog = true
      this.approvalData.addressList = this.approvalData.addressList.map(val => {
        val.disabled = false
        return val
      })
    },
    // 修改收货地址
    selectaddres(val) {
      this.checkSaleRegion(val)
    },
    // 查看轨迹
    openlogisticsTrajectoryFn(row) {
      this.logisticsDetailDto = row
      this.logisticsTrajectoryFlag = true
    },
    // 获取当前地址是否可发货
    checkSaleRegion(val) {
    const { approvalData, rowData, productDataCode } = this
    const productCode = approvalData.productCode || rowData.complaintAfterSaleEntity?.productCode
      const data = {
        cityName: val ? val.consigneeCity : approvalData.address?.consigneeCity,
        productCodeList: productDataCode?.length > 0 ? productDataCode : productCode.split(',')
      }
      checkSaleRegion(data).then(res => {
        const { code, payload } = res
        if (code !== 0) return
        const flag = Object.values(payload).some(val => !val)
        if (flag) {
          if (val) {
            val.disabled = true
            this.approvalData.addressList = [...this.approvalData.addressList]
          } else {
            this.addressStatus = true
          }
          // 有一项不支持就现在禁发提示
        const tip = []
        this.newProductDataList.map(val => {
          for (const key in payload) {
            if (payload[key] === false && val.productCode === key) {
              tip.push(val.productName)
            }
          }
        })
        this.$message.error(`以上商品不支持发货,${tip.join(',')}`)
        } else {
          this.addressStatus = false
          // 不禁发才地址回显
          if (val) {
          this.addresListDialog = false
          const newAddresInfo = val.consigneeProvince +
                  val.consigneeCity +
                  val.consigneeArea +
                  val.consigneeAddress
          const newAddresUser = val.consigneeName +
                  val.consigneeMobile
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: {
              address: newAddresInfo && newAddresUser ? newAddresInfo + '联系人:' + newAddresUser : ''
            }
          })
          this.emitAddress = val
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.repair-form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
  .repair-form {
    /deep/.el-form-item__content {
      width: 300px;
      margin-left: 120px;
    }
    /deep/.el-input__suffix {
      font-weight: bold;
      color: #666;
    }
  }
  .form-item {
    /deep/.el-form-item__content {
      width: 100%;
      margin-left: 120px;
    }
  }
}
.mailLogisticsList-detail {
  display: flex;
  flex-flow: row wrap;
}
.address-info{
  height: 400px;
  overflow: auto;
}
.addressList{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  .el-button{
    font-size: 14px;
  }
}
.addressListDis{
  color: #ccc;
}
.address {
  position: relative;
  width: 55%;
}
.newAddresInfo{
  display: flex;
  .repair-address {
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    color: #409eff;
    margin: 15px 0px 0px 15px;
  }
}
.commodity-img-box {
  width: 100px;
  margin-top: 10px;
  display: flex;
  .el-image {
    margin-right: 5px;
  }
}
.address-tips{
  font-weight: bold;
  font-size: 14px;
  color: red;
}
</style>
