<template>
  <div>
    <el-dialog
      :title="claimsInfoData && claimsInfoData.id ? '编辑赔付审批' : '创建赔付审批'"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      @close="cancel"
      @ensure="ensure"
    >
      <basics-form
        ref="complaintForm"
        :key="claimsFlag"
        :forms="claimsForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        width="800px"
        class="claims-form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <template slot="userInfo" slot-scope="scope">
          <span class="title-name">{{ scope.item.label }}</span>
        </template>
        <template slot="userMobile" slot-scope="scope">
          <el-form-item v-bind="scope.item">
            <span>{{ userMobile }}</span>
          </el-form-item>
        </template>
        <template slot="userName" slot-scope="scope">
          <el-form-item v-bind="scope.item">
            <span>{{ formData && formData.userName || '-' }}</span>
          </el-form-item>
        </template>
        <template slot="schemeCompensation" slot-scope="scope">
          <span class="title-name">{{ scope.item.label }}</span>
        </template>
        <template slot="amount" slot-scope="scope">
          <el-form-item v-bind="scope.item" :rules="rules.amount" class="claims-form">
            <el-input v-model="scope.form.amount">
              <template
                v-if="scope.form.currencyType === '2'"
                slot="suffix"
              >小熊币</template>
              <template
                v-if="scope.form.currencyType === '3'"
                slot="suffix"
              >金币</template>
              <template
                v-if="scope.form.currencyType === '4' && formClaims.channelEum === 'USER_1V1'"
                slot="suffix"
              >1v1课时</template>
              <template
                v-if="scope.form.currencyType === '4' && formClaims.channelEum === 'USER_XBK'"
                slot="suffix"
              >小班课时</template>
            </el-input>
            <p v-if="formData && formData.compensationCount">
              该用户历史赔付记录 <span style="color: #ff4949">{{ formData.compensationCount }}</span>次；<a
                style="color: #409eff; margin-left: 20px"
                @click="openClaimsHistoryFlag"
              >查看详情</a>
            </p>
            <span v-show="['2', '3'].includes(changeData.currencyType) && changeData.source === '1' && Number(scope.form.amount) > Number(changeData.coinAmount)" style="color: #ff4949; font-size: 12px">赔付额度已超实际支付额度，请慎重操作！</span>
          </el-form-item>
        </template>
        <template slot="goods" slot-scope="scope">
          <el-form-item
            ref="selectListShops"
            v-bind="scope.item"
            class="claims-form product-claims"
          >
            <div class="chooseProducto">
              <i class="el-icon-plus" />
              <span @click="openProductsFn">选择商品</span>
            </div>
            <div v-if="scope.form.currencyType === '6' && scope.form.goods.length > 0" class="content-gift">
              <div class="changeGift">
                <el-table :data="scope.form.goods">
                  <el-table-column
                    label="商品id"
                    prop="productCode"
                    align="center"
                  />
                  <el-table-column
                    label="商品名称"
                    prop="productName"
                    align="center"
                  />
                  <el-table-column
                    label="商品数量"
                    prop="productSum"
                    align="center"
                  />
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="text"
                        @click="deleteItem(scope.row.productCode)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>
        </template>
        <!-- 收货人地址 -->
        <template slot="addressId" slot-scope="scope">
          <div class="newAddresInfo">
            <el-form-item v-bind="scope.item" class="claims-form">
              <el-input
                v-model="scope.form.addressId"
                type="textarea"
                :disabled="true"
              />
              <div v-if="addressStatus" class="address-tips">
                <span>当前地址不支持发货，请切换收货地址！</span>
              </div>
            </el-form-item>
            <div class="claims-address" @click="claimsAddress">修改地址</div>
          </div>
        </template>
        <template slot="evidenceCompensation" slot-scope="scope">
          <span class="title-name">{{ scope.item.label }}</span>
        </template>
        <template slot="partyradio" slot-scope="scope">
          <span class="title-name">{{ scope.item.label }}</span>
        </template>
        <template slot="responsibleParty" slot-scope="scope">
          <el-form-item v-bind="scope.item" class="form-item">
            <el-radio
              v-for="(item, index) in scope.item.options"
              :key="index"
              v-model="scope.form.responsibleParty"
              :label="item.label"
            />
          </el-form-item>
        </template>
      </basics-form>
    </el-dialog>

    <!-- 弹窗 选择地址 -->
    <el-dialog title="收货地址" :visible.sync="addresListDialog">
      <div class="address-info">
        <div v-for="(item, index) in addressList" :key="index">
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
    <!-- 赔付历史 -->
    <claimsHistory
      v-if="claimsHistoryFlag"
      :claims-history-flag="claimsHistoryFlag"
      :user-id="formData.userId"
      @cancel="cancelFlag"
    />
    <!-- 选择商品 -->
    <shopList
      v-if="shopListFlag"
      :disable-check="disableCheck"
      :shop-list-flag="shopListFlag"
      @cancel="cancelFlag"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { claimsForm } from '../forms/actionsForm'
import { actions as complaintFormAction } from '../../../forms/complaintForm'
import {
  getCompensateOrderList,
  getAddressById,
  getUserAddress,
  createClaimsUrl,
  getDetailInfo
} from '@/api/myExamine'
import { getLongUserId, checkSaleRegion } from '@/api/operate/complainNew'
import claimsHistory from '../claimsHistory.vue'
import shopList from './components/shopList.vue'
import { debounce } from 'lodash'
const { baseData: { currencyTypeMap }} = window
export default {
  name: 'CreateClaims',
  components: { claimsHistory, shopList },
  props: {
    claimsFlag: { type: Boolean },
    rowData: { type: Object, default: () => {} },
    userMobile: { type: String, default: '' },
    workType: { type: Boolean },
    claimsInfoData: { type: Object, default: () => {} }
  },
  data() {
    const amountRules = (rule, value, callback) => {
      const regular = /^[0-9]([0-9]+)?$/
      const radixPoint = /^(\-)*(\d+)\.(\d\d\d).*$/
      const { formClaims, changeData } = this
        if (!value) {
          return callback(new Error('赔付额度必填！'))
        }
        setTimeout(() => {
          if (!Number(value)) {
             callback(new Error('请输入正确的退款金额数值！'))
          } else {
            // 小熊币 金币
            if (['2', '3'].includes(changeData.currencyType)) {
              if (!regular.test(value)) {
                callback(new Error('请输入正确的赔付额度, 且为正整数!'))
              } else if (+value > 40000) {
                callback(new Error('单笔赔付额度上限40000!'))
              } else {
                callback()
              }
            } else if (['4'].includes(changeData.currencyType)) {
              if (String(value).indexOf('.') !== -1 && radixPoint.test(value)) {
                callback(new Error('只能保留两位小数!'))
              } else if (formClaims.channelEum === 'USER_1V1' && Number(value) > 10) {
                callback(new Error('1对1课时上限＞0，≤10节课时!'))
              } else if (formClaims.channelEum === 'USER_XBK' && Number(value) > 3) {
                callback(new Error('小班课课时上限＞0，≤3节课时!'))
              } else {
                callback()
              }
            }
          }
        }, 500)
      }
    return {
      addresListDialog: false,
      claimsHistoryFlag: false,
      shopListFlag: false,
      claimsForm,
      formClaims: {
        cid: getToken('userId'),
        createName: getToken('cname'),
        goods: [],
        addressId: '',
        channelEum: '',
        countryCode: '',
        courseName: '',
        platform: '',
        outTradeNo: '',
        city: ''
      },
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      visible: this.claimsFlag,
      formData: this.rowData,
      orderList: [],
      addressList: [],
      currencyTypeMap,
      sceneList: [],
      reasonList: [],
      disableCheck: false,
      rules: {
        amount: [
          { required: true, message: '赔付额度必填！' },
          { validator: amountRules, trigger: ['blur', ' change'] }
        ]
      },
      changeData: {
        currencyType: '',
        coinAmount: '',
        source: ''
      },
      addressStatus: false
    }
  },
  computed: {
    tip() {
      return '<'
    },
    ...mapGetters(['claimsType'])

  },
  watch: {
    claimsFlag(newVal) {
      this.visible = newVal
    },
    rowData(newVal) {
      this.formData = newVal
    },
    'formClaims.goods': function(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.$refs.complaintForm?.recoveryForm({
          goods: val || []
        })
        // 商品变动时触发地址禁发
        if (this.formClaims.city && val?.length > 0) {
          this.checkSaleRegion()
        }
      }
    }
  },
  // done-登录人信息
  created() {
    this.$store.dispatch('claimsType/getClaimsConfig')
  },
  mounted() {
    this.$nextTick(async() => {
      // 编辑回显详情接口
      if (this.claimsInfoData?.id && this.claimsInfoData?.approvalNo) {
        await this.getDetailInfo()
      }
      const { formData, claimsInfoData } = this
      let currencyTypeData = []
      if (['1011', '1021'].includes(formData?.channelPid || claimsInfoData?.channelPid)) {
        currencyTypeData = this.currencyTypeMap.filter(val => val.value !== '2')
      } else {
        currencyTypeData = this.currencyTypeMap.filter(val => ['2', '6'].includes(val.value))
      }
      this.$refs.complaintForm?.set({
        type: 'options',
        data: {
          currencyType: currencyTypeData || []
        }
      })
      // 新增
      if (!this.claimsInfoData?.id) {
        await this.getLongUserId()
        await this.getCompensateOrderList(!!Number('0'))
      }
    })
  },
  methods: {
    // 获取小熊的长id
   async getLongUserId() {
    if (!['1031', '1041', '1051', '1071', '1081'].includes(this.formData?.channelPid || this.claimsInfoData?.channelPid)) return false
     const res = await getLongUserId({ userId: this.formData.userId })
     const { code, payload } = res
     if (code === 0) {
        this.formData.userId = payload
     }
    },
    // 详情回显
    getDetailInfo() {
      const loading = this.$loading({
        lock: true
      })
      getDetailInfo({
        id: this.claimsInfoData.id,
        approvalNo: this.claimsInfoData.approvalNo
      }).then((res) => {
        loading.close()
        const { code, payload } = res
        if (!code) {
      let newImages = []
      if (payload.images) {
        newImages = payload?.images?.split(',').map((v) => {
          return { name: v.split('/')[v.split('/').length - 1], url: v }
        })
      }
      let newVideos = []
      if (payload.videos) {
        newVideos = payload?.videos?.split(',').map((v) => {
          return { name: v.split('/')[v.split('/').length - 1], url: v }
        })
      }
      this.$nextTick(async() => {
          this.formData = {
            ...this.claimsInfoData,
            ...payload,
            compensationCount: payload.count
          }
         this.$refs.complaintForm.recoveryForm({
          ...payload,
          currencyType: String(payload.currencyType),
          source: String(payload.source),
          images: newImages || [],
          videos: newVideos[0] || {},
          goods: payload.goodsInfo && JSON.parse(payload.goodsInfo) || []
        })
        this.formClaims.goods = payload.goodsInfo && JSON.parse(payload.goodsInfo) || []
        if (payload?.userId) {
          await this.getLongUserId()
        }
        if (this.formData?.userId) {
          await this.getCompensateOrderList(!!Number(payload.source))
        }
      })
      }
      })
    },
    // 关联商品数据
    getCompensateOrderList(val) {
      const { formData, workType } = this
      const data = {
        channelPid: formData?.channelPid,
        orderId: workType ? formData.orderId : '0',
        shop: val,
        userId: formData?.userId
      }
      this.$refs.complaintForm.set({
        type: 'options',
        data: {
          orderId: []
        }
      })
      getCompensateOrderList(data).then((res) => {
        const { code, payload } = res
        if (code === 200) {
          this.orderList = payload?.map((val) => {
            return {
              ...val,
              value: val.orderId,
              label: `${val.outTradeNo}(${val.orderName})`
            }
          })
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              orderId: this.orderList || []
            }
          })
          this.$nextTick(async() => {
            // 编辑回显对应订单数据
           await this.setFormClaims(formData?.orderId)
           if (this.claimsInfoData?.id) {
            await this.$refs.complaintForm?.recoveryForm({
               orderId: this.formClaims?.outTradeNo ? formData?.orderId : ''
             })
           }
          })
        }
      })
    },
    // 选择商品列表
    openProductsFn() {
      this.shopListFlag = true
    },
    // 根据地址id查询详细地址
    getAddressByIdFn(val) {
      if (!val) return this.$message.error('请选择关联订单进行地址查询~')
      const { formData } = this
      const data = {
        businessType: ['USER_1V1', 'TEACHER_1V1', 'USER_XBK', 'TEACHER_XBK'].includes(val.channelEnum) ? 'ONETOONE' : 'BEAR',
        addressId: val.addressId || formData.addressId,
        userId: formData.userId
      }
      getAddressById(data).then(res => {
        const { code, payload } = res
        if (code === 200) {
          const newAddresInfo = payload?.countryName + payload?.province + payload?.city + payload?.area + payload?.addressDetail
          const newAddresUser = payload?.receiptName + payload?.receiptTel
          this.$refs.complaintForm?.recoveryForm({
            addressId: (newAddresInfo && newAddresUser) ? newAddresInfo + '联系人:' + newAddresUser : ''
          })
         this.formClaims = {
          ...this.formClaims,
          countryCode: payload?.countryCode,
          city: payload?.city
         }
        //  详细地址id时是否地区禁用
          if (this.formClaims?.city && this.formClaims.goods?.length > 0) {
           this.checkSaleRegion()
          }
        }
      })
    },
    // 赔付审批单的订单地址列表
    getUserAddressFn(val) {
      if (!val) return this.$message.error('请选择关联订单进行地址查询~')
      const { formData } = this
      const data = {
        channelEum: val,
        userId: formData.userId
      }
      getUserAddress(data).then(res => {
        const { code, payload } = res
        if (code === 0) {
          this.addressList = payload.addressList.map(val => {
            val.disabled = false
            return val
          })
        } else {
          this.$message.error('获取地址失败地址')
        }
      })
    },
    //  表单提交事件
    submitApproval: debounce(async function(values) {
      const { formClaims, formData, userMobile, claimsInfoData } = this
      if (values.images) {
        const arr = []
        const { images } = values
        if (images.length > 0) {
          images.forEach((item) => {
            arr.push(item.url)
          })
          values.images = arr.join(',')
        } else {
          values.images = undefined
        }
      }
      if (values.videos) {
        values.videos = values.videos.url || ''
      } else {
        values.videos = ''
      }
      const data = {
        ...values,
        ...formClaims,
        id: claimsInfoData?.id,
        complaintNo: formData.complaintNo,
        userId: formData.userId,
        scene: this.sceneList.find(i => i.value === values.scene)?.label,
        reason: this.reasonList.find(i => i.value === values.reason)?.label,
        responsibleParty: values.responsibleParty,
        userMobile: userMobile,
        userName: formData.userName
      }
      const loading = this.$loading({
        lock: true
      })
      createClaimsUrl(data).then(res => {
        loading.close()
        const { code } = res
        if (code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
        this.cancel()
        // 编辑后刷新列表
        if (claimsInfoData?.id) {
          this.$emit('getCount')
          this.$emit('getList')
        } else {
          this.$emit('getComplain')
          this.$emit('getComplaintRecords')
        }
      }).catch(() => {
        loading.close()
      })
  }, 500),
    // 表单的改变事件
    async changeApproval(val, oldVal) {
      const { formData, claimsInfoData } = this
      // 订单来源联动关联商品列表
      if (val.source !== oldVal.source) {
        this.changeData.source = val.source
        if (formData?.userId && oldVal.source && val.source !== oldVal.source) {
          this.getCompensateOrderList(!!Number(val.source))
        }
        this.$refs.complaintForm.recoveryForm({
          orderId: ''
        })
        // 来源是app订单并且是1v1的时候 或者订单直接是积分商城时 = 选择商品限制选择一个
        if ((val.source === '0' && formData?.channelPid === '1011') || val.source === '1') {
          this.disableCheck = true
        } else {
          this.disableCheck = false
        }
        this.formClaims.goods = []
      }
      // 关联订单联动回显地址和地址列表
      if (val.orderId && val.orderId !== oldVal.orderId) {
        await this.setFormClaims(val.orderId)
      }
      // 赔付方式联动赔付场景
      if (val.currencyType && val.currencyType !== oldVal.currencyType) {
        this.changeData.currencyType = val.currencyType
        const key = this.currencyTypeMap.find(i => i.value === val.currencyType)?.key
        const sceneList = this.claimsType.find(i => i.currencyType === key)?.scenes
        this.sceneList = sceneList || []
      // 编辑拿下拉列表数据做对应回显
      if (claimsInfoData?.id && this.sceneList?.length > 0) {
        this.$nextTick(() => {
          this.$refs.complaintForm.recoveryForm({
            scene: this.sceneList?.find(i => i.label === formData?.scene)?.value
          })
        })
      }
        // 赔付方式不是实物时，商品列表为空
        if (val.currencyType !== '6') {
          this.formClaims.goods = []
        }
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            scene: sceneList || []
          }
        })
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            amount: !!['2', '3', '4'].includes(val.currencyType),
            goods: !!['6'].includes(val.currencyType),
            addressId: !!['6'].includes(val.currencyType)
          }
        })
        this.$refs.complaintForm.recoveryForm({
          scene: '',
          reason: ''
        })
      }
      // 赔付场景联动赔付原因
      if (String(val.scene) && val.scene !== oldVal.scene) {
        const reasonList = this.sceneList.find(i => i.value === val.scene)?.reasons
        this.reasonList = reasonList || []
      // 编辑拿下拉列表数据做对应回显
      if (claimsInfoData?.id && this.reasonList?.length > 0) {
        this.$nextTick(() => {
          this.$refs.complaintForm.recoveryForm({
            reason: this.reasonList.find(i => i.label === formData?.reason)?.value
          })
        })
      }
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            reason: reasonList || []
          }
        })
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            reason: !!reasonList?.length
          }
        })
      }
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
    },
    cancelFlag(data) {
      this.formClaims.goods = data
      this.claimsHistoryFlag = false
      this.shopListFlag = false
    },
    // 删除选中的商品
    deleteItem(productCode) {
      this.formClaims.goods.splice(this.formClaims.goods.findIndex((item) => item.productCode === productCode), 1)
    },
    claimsAddress() {
      if (!this.addressList?.length) return this.$message.error('暂无多条地址数据~')
      this.addresListDialog = true
      this.addressList = this.addressList.map(val => {
        val.disabled = false
        return val
      })
    },
    // 修改收货地址
    selectaddres(val) {
       this.formClaims = {
        ...this.formClaims,
        countryCode: val.consigneeCountryCode,
        addressId: val.id
       }
      if (val.id) {
        this.checkSaleRegion(val)
      }
    },

    // 获取当前地址是否可发货
    checkSaleRegion(val) {
    const { formClaims } = this
    if (!formClaims.goods?.length) return this.$message.error('请先选择商品~')
      const data = {
        cityName: val ? val.consigneeCity : formClaims.city,
        productCodeList: formClaims.goods.map(item => item.productCode)
      }
      checkSaleRegion(data).then(res => {
        const { code, payload } = res
        if (code !== 0) return
        const flag = Object.values(payload).some(item => !item)
        if (flag) {
          // 弹窗选择地址
          if (val?.id) {
              val.disabled = true
              this.addressList = [...this.addressList]
          } else { // 关联订单默认地址
              this.addressStatus = true
          }
          // 有一项不支持就现在禁发提示 多个商品提示
          const tip = []
          formClaims.goods.map(val => {
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
          if (val?.id) {
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
              addressId: newAddresInfo && newAddresUser ? newAddresInfo + '联系人:' + newAddresUser : ''
            }
          })
          }
        }
      })
    },
    openClaimsHistoryFlag() {
      this.claimsHistoryFlag = true
    },
    // 对应订单数据
    async setFormClaims(orderId) {
        let findInfo = this.orderList?.find(i => i.value === orderId)
        findInfo = {
          ...findInfo,
          addressId: this.formData?.addressId
        }
        this.changeData.coinAmount = findInfo?.coinAmount
        this.formClaims = {
          ...this.formClaims,
          addressId: findInfo?.addressId,
          channelEum: findInfo?.channelEnum,
          courseName: findInfo?.orderName,
          platform: findInfo?.platform ? findInfo?.platform : '1',
          outTradeNo: findInfo?.outTradeNo,
          city: findInfo?.city
        }
        // 订单id获取详细地址
      if (findInfo?.addressId && findInfo?.channelEnum) {
        await this.getAddressByIdFn(findInfo)
      }
      // 订单id获取地址列表
      if (findInfo?.channelEnum) {
        await this.getUserAddressFn(findInfo?.channelEnum)
      }
      // 订单地址城市获取是否禁发
      if (this.formClaims.goods?.length > 0 && this.formClaims?.city) {
        await this.checkSaleRegion()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.claims-form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
  .claims-form {
    /deep/.el-form-item__content {
      width: 300px;
      margin-left: 120px;
    }
    p {
      margin: 0;
    }
  }
  .form-item {
    /deep/.el-form-item__content {
      width: 80%;
      margin-left: 120px;
    }
  }
  .title-name {
    font-size: 18px;
    color: #000;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .title-name:before {
    content: "";
    display: block;
    width: 4px;
    height: 20px;
    background: #409eff;
    margin-right: 5px;
  }
  .product-claims {
    /deep/.el-form-item__content {
      width: 700px;
    }
    .content-gift {
      width: 600px;
      display: flex;
      align-items: center;
    }
    .changeGift {
      width: 600px;
    }
    .chooseProducto {
      width: 100px;
      padding: 0 8px;
      box-sizing: border-box;
      margin-left: 10px;
      border: 1px solid #eee;
      cursor: pointer;
      color: #999;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #fff;
    }
  }
  .newAddresInfo {
    display: flex;
    .claims-address {
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      color: #409eff;
      margin: 15px 0px 0px 15px;
    }
  }
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
.address-tips{
  font-weight: bold;
  font-size: 14px;
  color: red;
}
</style>
