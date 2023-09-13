<template>
  <div>
    <el-dialog
      title="补发货审批"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="900px"
      @close="cancel"
    >
      <basics-form
        ref="complaintForm"
        :key="repairFlag"
        :forms="repairForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        class="repair-form-box"
        @submitForm="submitApproval"
        @changeForm="changeApproval"
      >
        <!-- 补发类别 -->
        <template slot="type" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="form-item"
          >
            <el-radio-group v-model="scope.form.type" @change="chooseType">
              <el-radio label="MATERIALS">整盒补发</el-radio>
              <el-radio label="SINGLE">散件补发</el-radio>
              <el-radio
                v-if="
                  targetItemOrder.regtype === 'FIRST_ORDER' ||
                    targetItemOrder.regtype === 'RENEW' ||
                    targetItemOrder.regtype === 'MAKEUP' ||
                    targetItemOrder.regtype === 'RENEW_MAKEUP'
                "
                label="GIFT"
              >赠品补发</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!-- 选择物流 -->
        <template slot="logisticsItem" slot-scope="scope">
          <el-form-item
            v-show="formRepair.type === 'SINGLE'"
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="formRepair.type === 'SINGLE' ? scope.item.rules : []"
          >
            <el-select
              v-model="scope.form.logisticsItem"
              placeholder="请选择物流单"
              no-data-text="无数据"
              @change="selectReair"
            >
              <el-option
                v-for="item of logisticsList"
                :key="item.productId"
                :label="item.showMessage"
                :value="item.productId"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 收货人 -->
        <template slot="receiptName" slot-scope="scope">
          <div class="address">
            <el-form-item
              :label="scope.item.label"
              :prop="scope.item.prop"
              :rules="scope.item.rules"
              class="repair-form"
            >
              <el-input v-model="scope.form.receiptName" disabled />
              <div class="repair-address" @click="repairAddress">
                <span>修改收货地址</span>
              </div>
            </el-form-item>
          </div>
        </template>
        <!-- 收货人电话 -->
        <template slot="receiptTel" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="repair-form"
          >
            <el-input v-model="scope.form.receiptTel" disabled />
          </el-form-item>
        </template>
        <!-- 收货人地址 -->
        <template slot="totalAddress" slot-scope="scope">
          <div class="address">
            <el-form-item
              :label="scope.item.label"
              :prop="scope.item.prop"
              :rules="scope.item.rules"
              class="repair-form"
            >
              <el-input v-model="scope.form.totalAddress" disabled />
              <div v-if="addressStatus" class="repair-tips">
                <span>疫情禁发区, 可能有延迟！</span>
              </div>
            </el-form-item>
          </div>
        </template>
        <!-- 补发难度 -->
        <template slot="sup" slot-scope="scope">
          <el-form-item
            v-if="formRepair.type == 'MATERIALS'"
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="formRepair.type === 'MATERIALS' ? scope.item.rules : []"
            class="repair-form"
          >
            <div class="reapirProduct">
              <!-- 难度-级别-按钮 -->
              <div class="reapirProduct-detail">
                <repair-sup
                  :key="supKey"
                  :choose-one="formRepair.packagesType"
                  @result="getSup"
                />
                <repair-level
                  v-if="formRepair.packagesType !== 'EXPERIENCE_COURSE'"
                  :key="supKey + 2"
                  :choose-one="formRepair.packagesType"
                  @result="getLevel"
                />
              </div>
            </div>
          </el-form-item>
        </template>
        <!-- 选择商品 -->
        <template slot="selectList" slot-scope="scope">
          <el-form-item
            ref="selectListShops"
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="product-repair repair-form"
          >
            <div class="chooseProducto" @click="showsuicailist">
              <i class="el-icon-plus" />
              <span>盒子随材选择商品</span>
            </div>
            <div class="content-gift">
              <div
                v-if="formRepair.selectList && formRepair.selectList.length > 0"
                class="changeGift"
              >
                <el-table :data="formRepair.selectList">
                  <el-table-column label="商品id" prop="id" align="center" />
                  <el-table-column label="商品名称" prop="name" align="center" />
                  <el-table-column label="商品数量" prop="count" align="center" />
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="text"
                        @click="deleteItem(scope.row.id)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>
        </template>
        <!-- 补发原因 -->
        <template slot="reason" slot-scope="scope">
          <el-form-item
            :label="scope.item.label"
            :prop="scope.item.prop"
            :rules="scope.item.rules"
            class="form-item"
          >
            <el-radio-group v-model="scope.form.reason">
              <el-radio label="PRESS_REASON">印厂原因</el-radio>
              <el-radio label="COMPANY_REASON">公司原因</el-radio>
              <el-radio label="WAREHOUSE_REASON">仓库原因</el-radio>
              <el-radio label="USER_REASON">用户原因</el-radio>
              <el-radio label="EXPRESS_REASON">快递原因</el-radio>
              <el-radio label="QUALITY_REASON">商品质量</el-radio>
              <el-radio label="OTHER_REASON">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </basics-form>
    </el-dialog>

    <!-- 弹窗1-选择商品 -->
    <el-dialog
      title="选择商品"
      :visible.sync="productDialog"
      width="40%"
      height="70vh"
      class="choose-product-gift shangpin"
    >
      <el-input
        v-if="productDialog"
        v-model="forFilter"
        style="margin-bottom: 10px"
        placeholder="键入商品名称筛选"
      />
      <el-table
        v-if="productDialog"
        :data="computedGiftList"
        width="100%"
        border
        align="center"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选列 -->
        <el-table-column
          v-if="!isSingleOrMutiple"
          type="selection"
          align="center"
        />
        <el-table-column prop="name" label="商品名称" align="center" />
        <!-- 多选列 -->
        <el-table-column v-if="!isSingleOrMutiple" align="center" label="数量">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.count"
              :min="1"
              size="small"
              :disabled="!scope.row.canOperating"
            />
          </template>
        </el-table-column>
        <!-- 单选列 -->
        <el-table-column v-if="isSingleOrMutiple" align="center" label="单选">
          <input name="Fruit" type="radio">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 弹窗 选择地址 -->
    <el-dialog title="收货地址" width="950px" :visible.sync="addresListDialog">
      <AddressListDialog
        v-if="addresListDialog"
        :user-id="formRepair.userId"
        :address-id="formRepair.addressId"
        :country-code="countryCode"
        :country-name="countryName"
        :is-china="isChina"
        :is-default-address="0"
        @result="changeListDialog"
        @getListInfos="getListInfos"
      />
    </el-dialog>
  </div>
</template>
<script>
import { repairForm } from './forms/actionsForm'
import { actions as complaintFormAction } from '../../forms/complaintForm'
import {
  getUid_lk,
  getOrdersByUidRefundOnlyRefund,
  getCourseMaterialsList,
  getProductShops,
  getTopicDetail,
  getExpressBoxByOrderId,
  getExpressListByOrderIdTwo,
  findTrailByOrderNo,
  findSystemByOrderNo,
  applyReplenish,
  getForbidAddressStatus
} from '@/api/operate/examineApi'
import AddressListDialog from './addressListDialog.vue'
import { getStaffInfo } from '../config'
import { formatTeamNameSup } from '@/utils/supList'
import RepairLevel from '@/components/MSearch/searchItems/repairLevel'
import RepairSup from '@/components/MSearch/searchItems/repairSup'

export default {
  name: 'CreateRepair',
  components: {
    AddressListDialog,
    RepairLevel,
    RepairSup
  },
  props: {
    repairFlag: { type: Boolean },
    complaintNo: { type: String, default: '' },
    userMobile: { type: String, default: '' }
  },
  data() {
    return {
      repairForm,
      targetItemOrder: {}, // 选中的订单对象
      logisticsList: [], // 选择物流订单
      formRepair: {},
      productDialog: false, // 待选商品弹窗-开关
      forFilter: '', // 待选商品弹窗输入框过滤
      giftList: [], // 待选商品弹窗展示list
      addresListDialog: false,
      countryCode: '',
      countryName: '',
      isChina: 0,
      orderList: [], // 关联订单list value是{}
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      visible: this.repairFlag,
      addressStatus: ''
    }
  },
  computed: {
    // 在这里过滤后在赋值给待选商品弹窗list
    computedGiftList() {
      return this.giftList.filter((item) => item.name.includes(this.forFilter))
    },
    // 补发商品弹窗展示(互斥)
    // 单选:盒子随材整盒补发、小熊商城、推荐有礼、邀请有奖-true
    // 多选:盒子随材的单件补发、关单赠品-false
    isSingleOrMutiple() {
      return (
        (this.formRepair.type === 'MATERIALS' &&
          this.formRepair.mode === 'DEFAULT') ||
        ['STORE', 'RECOMMEND', 'INVITATION'].includes(this.formRepair.type)
      )
    }
  },
  watch: {
     repairFlag(newVal) {
      this.visible = newVal
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
    this.$nextTick(() => {
          if (this.userMobile) {
             this.createFilter()
          }
    })
  },
  methods: {
    //  表单提交事件
    submitApproval(values) {
      console.log(this.formRepair, values)
      const loading = this.$loading({
        lock: true
      })
      // 当补发货类别type是盒子随材时需要加工一下再传参
      // 区分:系统课盒子-体验课盒子-训练营动物盒子-训练营建筑盒子-训练营手抄报盒子
      let typeTrans = ''
      if (
        this.formRepair.type === 'MATERIALS' ||
        this.formRepair.type === 'SINGLE'
      ) {
        if (this.formRepair.packagesType === 'EXPERIENCE_COURSE') {
          // 盒子-体验课
          typeTrans = 'EXPERIENCE_MATERIALS'
        } else if (this.formRepair.packagesType === 'SYSTEM_COURSE') {
          // 盒子-系统课
          typeTrans = 'SYSTEM_MATERIALS'
        } else if (
          this.formRepair.packagesType === 'TRAINING_CAMP_COURSE'
          // 盒子-训练营
        ) {
          console.error(this.formRepair.sup)
          switch (this.formRepair.sup) {
            case 'S1':
              typeTrans = 'TRAINING_BABY_SELF'
              break
            case 'S2':
              typeTrans = 'TRAINING_TRADITIONAL_PAINTING'
              break
            case 'S3':
              typeTrans = 'TRAINING_GCDF'
              break
            default:
              break
          }
        }
      } else {
        typeTrans = this.formRepair.type
      }
      this.formRepair.attsUrl = values.attsUrl[0]?.url
      const data = Object.assign(
        values,
        this.formRepair,
        { productdetails: values.selectList },
        {
          courseType:
            [
              'EXPERIENCE_COURSE',
              'SYSTEM_COURSE',
              'TRAINING_CAMP_COURSE'
            ].indexOf(this.formRepair.packagesType) + 1
        },
        { type: typeTrans },
        { level: this.formRepair.level.replace(/LEVEL/g, 'L') },
        { complaintNo: this.complaintNo }, // 同步投诉单号
      )
      applyReplenish({ ...data, ...values }).then(({ code }) => {
        this.$emit('cancel')
        this.formRepair.selectList = []
        if (code === 0) {
          this.$message.success('创建补发货审批成功')
        }
        setTimeout(() => {
          loading.close()
        }, 1000)
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
    //  表单改变事件
    async changeApproval(val, valOld) {
      // 手机号校验过了就触发获取关联订单接口
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (val.namex !== valOld.namex && reg.test(val.namex)) {
        this.createFilter(val.namex)
      }
      // 选择关联订单的时候
      if (val.orderId && val.orderId !== valOld.orderId) {
        this.formRepair.orderId = val.orderId
        this.formRepair.type = val.type
        this.targetItemOrder = this.orderList.filter(
          (item) => item.id === val.orderId
        )[0]
        this.formRepair.packagesId = this.targetItemOrder.packagesId // 整盒获取商品加的
        // orderId 已被 v-model赋值
        this.formRepair.outTradeNo = this.targetItemOrder.outTradeNo
        // 课程进度-分体验课和系统课
        this.formRepair.currentLesson = ''
        this.supKey = Date.now()
        if (this.targetItemOrder.regtype === 'EXPERIENCE') {
          this.formRepair.packagesType = 'EXPERIENCE_COURSE'
          const resTrialData = await this.getTrialClassProgress(
            this.targetItemOrder.id
          )
          if (resTrialData) {
            this.formRepair.currentLesson = formatTeamNameSup(
              resTrialData.currentLesson
            )
          }
        } else if (
          this.targetItemOrder.regtype === 'FIRST_ORDER' ||
          this.targetItemOrder.regtype === 'RENEW' ||
          this.targetItemOrder.regtype === 'MAKEUP' ||
          this.targetItemOrder.regtype === 'RENEW_MAKEUP'
        ) {
          this.formRepair.packagesType = 'SYSTEM_COURSE'
          const resSysData = await this.getSystemClassProgress(
            this.targetItemOrder.id
          )
          if (resSysData) {
            this.formRepair.currentLesson = formatTeamNameSup(
              `${resSysData.currentSuper}${resSysData.currentLevel}${resSysData.currentUnit}${resSysData.currentLesson}`
            )
          }
        } else {
          this.formRepair.packagesType = 'TRAINING_CAMP_COURSE'
        }
      }

      // 选择物流的时候
      if (val.logisticsItem && val.logisticsItem !== valOld.logisticsItem) {
        this.formRepair.logisticsItem = val.logisticsItem
      }
    },
    //  改变补发类型
    chooseType(val) {
      console.log(val, '哈哈哈')
      this.$nextTick(() => {
      this.formRepair.type = val
      this.$refs.complaintForm.set({
        type: 'defaultVal',
        data: {
          type: val
        }
      })
      })

      this.clearData()
      const { formRepair } = this
      if (val === 'MATERIALS') {
        this.formRepair.mode = 'DEFAULT'
        // 收获地址查询-盒子非盒子接口不同
        getExpressBoxByOrderId({
          orderId: formRepair.orderId,
          subject: 'ART_APP'
        }).then((res) => {
          if (res && res.code === 0) {
            const data9 = res?.payload
            this.warehouseName = data9?.warehouseName
            this.countryCode = data9?.countryCode
            this.countryName = data9?.countryName
            this.isChina = data9?.type
            Object.assign(this.formRepair, {
              totalAddress:
                data9?.province +
                data9?.city +
                data9?.area +
                data9?.street +
                data9?.addressDetail,

              receiptAddressProvince: data9?.province,
              receiptAddressCity: data9?.city,
              receiptAddressArea: data9?.area,
              receiptAddressStreet: data9?.street,
              receiptAddressDetail: data9?.addressDetail,
              addressId: data9?.addressId,

              idCode: data9?.idCode,
              receiptName: data9?.receiptName,
              receiptTel: data9?.receiptTel,
              stage: data9?.term ? data9?.term : 0,
              oldCenterExpressId: data9?.centerExpressId,
              productId: data9?.productId
            })
            if (data9.province && data9.city && data9.area) {
              this.getAddressStatus(data9.province, data9.city, data9.area)
            }
            this.$nextTick(() => {
              this.$refs.complaintForm.set({
                type: 'defaultVal',
                data: {
                  receiptName: data9?.receiptName,
                  receiptTel: data9?.receiptTel,
                  totalAddress: this.formRepair.totalAddress ? this.formRepair.totalAddress : ''
                }
              })
            })
            this.$forceUpdate()
            console.log(data9.addressId, 'data9?.addressId')
            if (data9?.addressId && data9?.addressId === '0') {
              this.$message.warning('当前物流地址已失效-请填写地址')
              this.formRepair.addressId = '' // 失效 老地址
            }
          } else {
            console.log(this.targetItemOrder, '张杨')
            this.isChina =
              this.targetItemOrder.areaCode === 'CN' ||
              this.targetItemOrder.areaCode === 'cn' ||
              this.targetItemOrder.areaCode === '' ||
              this.targetItemOrder.areaCode === 'HK' ||
              this.targetItemOrder.areaCode === 'MO' ||
              this.targetItemOrder.areaCode === 'TW'
                ? 0
                : 2
            this.countryCode = this.targetItemOrder.areaCode
            this.$message.warning('当前物流地址为空-请填写地址')
            this.formRepair.addressId = '' // 没有 老地址
            this.formRepair.stage = 0
            // this.$set(this.formRepair, 'stage', 0) // 没有拿到收货信息也得赋值stage期
          }
        })
      } else if (val === 'SINGLE') {
        this.formRepair.mode = 'SINGLE'
        getExpressListByOrderIdTwo({
          orderId: formRepair.orderId,
          userId: formRepair.userId,
          subject: 'ART_APP'
        }).then((res) => {
          console.log(res, '不区分盒子返回了些什么')
          this.logisticsList = res.payload.filter((item) => {
            if (item.productName && item.productVersion) {
              return (item.showMessage =
                item.productName + item.productVersion)
            }
          })
          console.log(this.logisticsList, '9999')
        })
      }
    },
    // 清空数据-补发类别改变时 补发方式+课程+难度+级别+选中的商品列表↑
    clearData() {
      this.formRepair.selectList = []
      this.formRepair.logisticsItem = ' '
      this.formRepair.sup = ''
      this.formRepair.level = ''
    },
    selectReair(val) {
      const obj = this.logisticsList.filter(
        (item) => item.productId === val
      )?.[0]
      this.formRepair.sup = obj.sup
      this.formRepair.level = obj.level
      this.formRepair.productId = obj.productId

      this.warehouseName = obj.warehouseName
      this.countryCode = obj.countryCode
      this.countryName = obj.countryName
      this.isChina = obj.type
      Object.assign(this.formRepair, {
        totalAddress:
          obj.province + obj.city + obj.area + obj.street + obj.addressDetail,

        receiptAddressProvince: obj.province,
        receiptAddressCity: obj.city,
        receiptAddressArea: obj.area,
        receiptAddressStreet: obj.street,
        receiptAddressDetail: obj.addressDetail,
        addressId: obj.addressId,

        idCode: obj.idCode,
        receiptName: obj.receiptName,
        receiptTel: obj.receiptTel,
        stage: obj.term,
        oldCenterExpressId: obj.centerExpressId,
        productId: obj.productId
      })
      if (obj.province && obj.city && obj.area) {
        this.getAddressStatus(obj.province, obj.city, obj.area)
      }
    },
    // done-盒子随材专用-弹窗选择商品展示
    showsuicailist() {
      const { formRepair } = this
      if (formRepair.type === 'MATERIALS' || formRepair.type === 'SINGLE') {
        // 体验课默认赋值level1
        formRepair.packagesType === 'EXPERIENCE_COURSE' &&
          (formRepair.level = 'LEVEL1')

        // 补发方式-单选 整盒补发 且未生成物流单
        if (formRepair.mode === 'DEFAULT') {
          if (formRepair.packagesType && formRepair.level && formRepair.sup) {
            const data = {
              packagesId: formRepair.packagesId,
              courseDifficulty: formRepair.sup,
              courseLevel: formRepair.level
            }
            getCourseMaterialsList(data).then((res) => {
              console.log(res, '整盒新街口')
              if (res.payload?.length) {
                this.productDialog = true
                this.giftList = []
                res.payload.forEach((item) => {
                  this.giftList.push({
                    id: item.id,
                    name: item.name,
                    count: 1,
                    canOperating: false,
                    centerProductCode: item.centerProductCode // 中台商品编码
                  })
                })
              } else {
                this.$message.warning('没有商品可进行补发')
              }
            })
          } else {
            this.$message.warning('请填写完整信息')
          }
        } else if (formRepair.mode === 'SINGLE') {
          // 散件且有物流单 选择商品调用 程征波的接口 展示所有的散件，没有物流单时不能进行提交
          console.log(formRepair, '选中的物流订单单肩')
          if (this.logisticsList?.length !== 0) {
            getProductShops({
              id: formRepair.logisticsItem
            }).then((res) => {
              // console.log(res.data.Product.materials_bind_info, '产品对应的散件')
              this.productDialog = true
              this.giftList = []
              res.data.Product.materials_bind_info.forEach((item) => {
                this.giftList.push({
                  id: item.id,
                  name: item.name,
                  count: 1,
                  canOperating: false,
                  centerProductCode: item.center_product_code // 中台商品编码
                })
              })
            })
          } else {
            this.$message.warning('没有可补发的散件')
          }
        }
      }

      if (['STORE', 'RECOMMEND', 'INVITATION'].includes(formRepair.type)) {
        this.getProductTopticGiftList(
          { STORE: 1, RECOMMEND: 2, INVITATION: 6 }[formRepair.type]
        )
      } else if (formRepair.type === 'GIFT') {
        if (this.formRepair.orderId) {
          this.getGiftList()
        } else {
          this.$message.warning('请确认已选择订单')
        }
      }
    },
    // done-功能函数-获取商品(商城+有礼+有奖)数据列表↑
    getProductTopticGiftList(id) {
      this.giftList = []
      getTopicDetail({
        topicId: id
      }).then((res) => {
        if (res && res.payload && res.payload.productList) {
          res.payload.productList.forEach((item) => {
            this.giftList.push({
              id: item.id,
              name: item.name,
              count: 1,
              canOperating: false
            })
          })
          this.productDialog = true
        }
      })
    },
    // done-功能函数-获取商品(关单赠品)数据列表↑
    getGiftList() {
      this.giftList = []
      getTopicDetail({
        topicId: 13
      }).then(({ payload: { productList = [] }}) => {
        if (productList?.length) {
          productList.forEach((item) => {
            this.giftList.push({
              id: item.id,
              name: item.name,
              count: 1,
              canOperating: false
            })
          })
          this.productDialog = true
        } else {
          this.$message.warning('当前用户订单无可选的关单赠品')
        }
      })
    },
    //  补发货审批现根据手机号查用户id 获取管理订单数据
    async createFilter(queryString) {
      const mobile = queryString || this.userMobile
      const queryParams = {
        mobile,
        team_id: '',
        teamType: '',
        subject: 0
      }
      const res = await getUid_lk(queryParams)
      // 给创建退款审批的用户手机号赋值
      repairForm.find((val) => {
        if (val.prop === 'namex') {
          val.defaultVal = this.userMobile
          this.$forceUpdate()
        }
      })
      const { blurrySearch } = res?.data
      this.selectData = blurrySearch
      if (blurrySearch !== '[]' && blurrySearch[0]?.id) {
        const { id } = blurrySearch[0]
        this.formRepair.userId = id
        this.getOrdersByUid(id)
      } else {
        // 给创建退款审批的关联订单赋值
        repairForm.find((val) => {
          if (val.prop === 'orderId') {
            val.options = []
          }
        })
      }
    },
    // 获取关联管理订单数据
    async getOrdersByUid(id) {
      const data = {
        userId: id,
        statues: 'COMPLETED,WAIT_COMPLETED',
        regTypes:
          'DEFAULT,EXPERIENCE,EXPERIENCE_ONE_WEEK,FIRST_ORDER,RENEW,MAKEUP,RENEW_MAKEUP,TRAINING,COUPON,TOPIC_AESTHETIC,SPECIFIC',
        subject: 'ART_APP'
      }
      const res = await getOrdersByUidRefundOnlyRefund(data)
      const { code, payload } = res
      if (code === 0) {
        const data = payload.map((item) => {
          item.showMessage = item.outTradeNo + ` ${item.packagesName}`
          return item
        })
        // 给创建补发货审批的关联订单赋值
        repairForm.find((val) => {
          if (val.prop === 'orderId') {
            val.options = data.map((item) => {
              return {
                label: item.showMessage,
                value: item.id
              }
            })
          }
        })
        this.orderList = data
      }
    },
    // 商品弹窗-单选
    handleCurrentChange(val) {
      console.info(
        '点击任意行内容都会触发element列表current-change事件-以此模拟单选'
      )
      if (this.isSingleOrMutiple) {
        this.formRepair.selectList = [val]
        // 给商品类型赋值
        this.$nextTick(() => {
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: {
              selectList: this.formRepair.selectList
            }
          })
        })
        if (this.formRepair.selectList) {
          this.$refs.selectListShops.clearValidate()
        }
        console.info('单选入筐', this.$refs.complaintForm)
      }
    },
    // 商品弹窗-多选
    handleSelectionChange(val) {
      console.info(val, 9999)
      val.forEach((item) => {
        item.canOperating = true // 选中后-才能操作数量
      })
      this.formRepair.selectList = val
      // 给商品类型赋值
      this.$nextTick(() => {
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            selectList: this.formRepair.selectList
          }
        })
      })
      if (this.formRepair.selectList) {
        this.$refs.selectListShops.clearValidate()
      }
      console.info('复选选入筐', this.formRepair.selectList)
    },
    // done-地址弹窗打开(带老addressId走出去)
    repairAddress() {
      this.addresListDialog = true
    },
    changeListDialog(data) {
      this.addresListDialog = data.addressList
    },
    // 修改收获地址
    getListInfos(val) {
      if (val !== '') {
        Object.assign(this.formRepair, {
          totalAddress: `${val.countryName ? val.countryName + '-' : ''}${
            val.province
          }-${val.city}${val.area ? '-' + val.area : ''}${
            val.street ? '-' + val.street : ''
          }-${val.addressDetail}`,
          receiptAddressProvince: val.province,
          receiptAddressCity: val.city,
          receiptAddressArea: val.area,
          receiptAddressStreet: val.street,
          receiptAddressDetail: val.addressDetail,
          addressId: val.id,
          idCode: val.idCode,
          receiptName: val.receiptName,
          receiptTel: val.receiptTel
        })
        if (val.province && val.city && val.area) {
        this.getAddressStatus(val.province, val.city, val.area)
        }
        // 修改地址后赋值
        this.$nextTick(() => {
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: {
              receiptName: this.formRepair.receiptName,
              receiptTel: this.formRepair.receiptTel,
              totalAddress: this.formRepair.totalAddress
            }
          })
        })
      }
      this.addresListDialog = false
    },
    // done-功能函数-体验课进度↑
    getTrialClassProgress(orderNo) {
      return findTrailByOrderNo({
        orderNo
      })
        .then((res) => {
          if (res.status !== 'OK') {
            return false
          }
          return res.payload
        })
        .catch(() => {
          return false
        })
    },
    // done-功能函数-系统课进度↑
    getSystemClassProgress(orderNo) {
      return findSystemByOrderNo({
        orderNo
      })
        .then((res) => {
          if (res.status !== 'OK') {
            return false
          }
          return res.payload
        })
        .catch(() => {
          return false
        })
    },
    // done-补发商品-选择难度
    getSup(val) {
      this.formRepair.selectList = []
      console.info(val, typeof val)
      if (val) {
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            sup: `S${val}`
          }
        })
        this.formRepair.sup = `S${val}`
      }
    },
    // done-补发商品-选择级别
    getLevel(val) {
      this.formRepair.selectList = []
      if (val) {
        this.formRepair.level = val.replace(/L/g, 'LEVEL')
      }
    },
    // 删除选中的商品
    deleteItem(id) {
      this.formRepair.selectList.splice(
        this.formRepair.selectList.findIndex((item) => item.id === id),
        1
      )
      console.info('删除后最新商品列表', this.formRepair.selectList)
    },
    // 获取该地区是否属于疫情受影响地区
    getAddressStatus(provinceName, cityName, countyName) {
      const data = {
        provinceName,
        cityName,
        countyName
      }
      getForbidAddressStatus(data).then(res => {
        const { code, payload } = res
        if (code === 0) {
          // DEFAULT 非禁发
          // EPIDEMIC_FORBID 疫情停发
          if (payload === 'EPIDEMIC_FORBID') {
            this.addressStatus = true
          } else {
            this.addressStatus = false
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
  .repair-form{
    /deep/.el-form-item__content {
      width: 300px;
      margin-left: 120px;
    }
  }
  .form-item {
    /deep/.el-form-item__content {
      width: 100%;
      margin-left: 120px;
    }
  }
}
.product-repair {
  /deep/.el-form-item__content {
    width: 700px;
  }
  .reapirProduct {
    &-detail {
      display: flex;
    }
    .content-gift {
      width: 600px;
      display: flex;
      align-items: center;
    }
    .changeGift {
      width: 600px;
    }
    .reapirProduct-detail {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .chooseProducto {
    width: 167px;
    padding: 0 8px;
    box-sizing: border-box;
    margin-left: 10px;
    border: 1px solid whitesmoke;
    cursor: pointer;
    color: #999;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
  }
}
.address {
  position: relative;
  width: 55%;
  .repair-address {
    position: absolute;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    right: -100px;
    bottom: 2px;
    color: #2a75ed;
  }
  .repair-tips{
    position: absolute;
    font-weight: bold;
    font-size: 14px;
    right: -180px;
    bottom: 2px;
    color: red;
  }
}
</style>
