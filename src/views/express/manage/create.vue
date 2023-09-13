<template>
  <div v-loading="detailLoading" class="app-container">
    <basics-block :title="id ? '修改物流单' : '创建物流单'" back>
      <basics-form ref="createExpress" :loading="loadings._logistics_order_mpCreateOrder" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm">
        <template slot="goods" slot-scope="scope">
          <el-form-item v-bind="scope.item" class="form-item">
            <el-button v-if="!(scope.form && scope.form.goods && Object.keys(scope.form.goods).length)" style="margin-left: 5px" type="primary" size="mini" @click="openDl">选择商品</el-button>
            <template v-else>
              <span style="color: #333333; font-size: 16px">{{ scope.form.goods.productCode }}&ensp;{{ scope.form.goods.productName }}</span>
              <el-button v-if="!isEdit" style="margin-left: 5px" size="mini" @click="openDl">重新选择</el-button>
            </template>
            <a v-if="!isEdit" style="margin-left: 10px;color: #46a6ff" href="/goods/manage">没有？创建新商品</a>
          </el-form-item>
        </template>
      </basics-form>
    </basics-block>

    <el-dialog
      title="选择商品"
      :visible.sync="goodsState"
      width="80%"
      :before-close="() => closeDl()"
    >
      <choice-goods @choice="choice" />
    </el-dialog>

  </div>
</template>

<script>
import { businessList, houseListApi } from '@/api/goods/manage'
import { queryAll, queryByParam } from '@/api/express/national'
import { mpCreateOrder, queryOrderDetail } from '@/api/express/manage'
import BasicsBlock from '@/components/BasicsBlock'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/create'
import ChoiceGoods from './components/ChoiceGoods/index'
import { mapGetters } from 'vuex'

export default {
  name: 'ExpressManageCreate',
  components: { BasicsBlock, BasicsForm, ChoiceGoods },
  data() {
    return {
      id: this.$route.query.id,
      isEdit: !!this.$route.query.id,
      order: {},
      forms: forms,
      actions: actions(this.$route.query.id),
      goodsState: false,
      cityData: []
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    detailLoading() {
      return this.loadings._logistics_product_business_list ||
        this.loadings._logistics_national_queryAll ||
        this.loadings._logistics_order_queryOrderDetail
    }
  },
  async created() {
    this.getBusiness()
    await this.getCity()
    const { id } = this
    if (id) {
      await this.getDetail()
    }
  },
  methods: {
    getDetail() {
      return new Promise((resolve, reject) => {
        const { id } = this
        queryOrderDetail({ id: id }).then(res => {
          const data = res.data || {}
          const addressSnapshot = data.addressSnapshot || {}
          const order = data.order || {}
          this.order = order

          const consigneeProvince = `${addressSnapshot.consigneeProvince},${addressSnapshot.consigneeProvinceCode}`
          const consigneeCity = `${addressSnapshot.consigneeCity},${addressSnapshot.consigneeCityCode}`
          const consigneeArea = `${addressSnapshot.consigneeArea},${addressSnapshot.consigneeAreaCode}`
          const consigneeTown = `${addressSnapshot.consigneeTown},${addressSnapshot.consigneeTownCode}`

          const value = {
            goods: {
              productCode: order.productCode,
              productName: order.productName
            },
            supplierDelivery: order.supplierDelivery,
            businessCode: order.businessCode,
            supplierId: order.supplierId,
            consigneeName: addressSnapshot.consigneeName,
            consigneeMobile: addressSnapshot.consigneeMobile,
            city: [
              consigneeProvince || '',
              consigneeCity || '',
              consigneeArea || '',
              addressSnapshot.consigneeTown ? consigneeTown : '-'
            ],
            consigneeAddress: addressSnapshot.consigneeAddress
          }

          if (addressSnapshot.consigneeTown) {
            this.initTown(addressSnapshot.consigneeAreaCode, addressSnapshot.consigneeProvinceCode, addressSnapshot.consigneeCityCode, addressSnapshot.consigneeAreaCode)
          }
          this.$nextTick(() => {
            this.$refs.createExpress && this.$refs.createExpress.set({
              type: 'defaultVal',
              data: value
            })
          })
          resolve()
        }).catch(e => reject(e))
      })
    },
    // 当回显时，有乡镇，那么先需查询乡镇并存入cityData结构中
    initTown(code, province, city, area) {
      queryByParam({
        code: code,
        level: 3
      }).then(res => {
        const data = res.data || {}
        const nodes = [{
          code: '-',
          value: '-',
          label: '暂不选择',
          leaf: true
        }]
        data.map(item => {
          nodes.push({
            code: item.townCode,
            value: `${item.townName},${item.townCode}`,
            label: item.townName,
            leaf: true
          })
        })
        const { cityData } = this
        cityData.map(provinceItem => {
          if (provinceItem.children.length && provinceItem.code === province) {
            provinceItem.children.map(cityItem => {
              if (cityItem.children.length && cityItem.code === city) {
                cityItem.children.map(areaItem => {
                  // areaItem.code === area && (areaItem.children = nodes)
                  if (areaItem.code === area) {
                    areaItem.children = nodes
                    areaItem.noLoad = true
                  }
                })
              }
            })
          }
        })
      })
    },
    // 获取业务线
    getBusiness() {
      businessList().then(res => {
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode
          })
        })
        this.$nextTick(() => {
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
        })
      })
    },
    getArea(dat, optionsKey, optionsValue, optionsLabel) {
      houseListApi(dat).then(res => {
        const data = res.data || []
        const ids = []
        const options = []
        data.map(item => {
          if (!ids.includes(item[optionsValue])) {
            ids.push(item[optionsValue])
            options.push({
              label: item[optionsLabel],
              value: item[optionsValue]
            })
          }
        })
        this.$nextTick(() => {
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'options',
            data: { [optionsKey]: options }
          })
        })
      })
    },
    getCity() {
      return new Promise((resolve, reject) => {
        queryAll().then(res => {
          const data = res.data || []
          const loop = list => {
            const arr = []
            list.map(item => {
              let value = ''
              if (item.countyCode) {
                value = `${item.countyName},${item.countyCode}`
              } else if (item.cityCode) {
                value = `${item.cityName},${item.cityCode}`
              } else if (item.provinceCode) {
                value = `${item.provinceName},${item.provinceCode}`
              }
              const obj = {
                label: item.countyName || item.cityName || item.provinceName,
                value: value,
                code: item.countyCode || item.cityCode || item.provinceCode
              }
              obj.children = [{
                code: '-',
                value: '-',
                label: '暂不选择',
                leaf: true
              }]
              if (item.citys && item.citys.length) {
                obj.children = loop(item.citys)
              }
              if (item.countys && item.countys.length) {
                obj.children = loop(item.countys)
              }
              arr.push(obj)
            })
            return arr
          }
          const city = loop(data)
          this.cityData = city // 这里浅拷贝，改变cityData就会改变级联数据，initTown方法也会改变数据
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'options',
            data: { city: city }
          })
          resolve()
        }).catch(e => reject(e))
      })
    },
    changeForm(val, oldVal) {
      const { isEdit } = this
      if (val.supplierDelivery && val.supplierDelivery !== oldVal.supplierDelivery) {
        if (val.supplierDelivery === 1) {
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'visible',
            data: { supplierId: true }
          })
        } else {
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'visible',
            data: { supplierId: false }
          })
        }
      }
      if (val.businessCode && val.businessCode !== oldVal.businessCode) {
        if (!isEdit) {
          this.$refs.createExpress && this.$refs.createExpress.set({
            type: 'defaultVal',
            data: { supplierId: '' },
            validateField: false
          })
        }
        this.getArea({ businessCode: val.businessCode }, 'supplierId', 'supplierId', 'supplierName')
      }
    },
    submitForm(val) {
      const city = val.city || []
      const consigneeProvinceStr = city[0] || ''
      const consigneeCityStr = city[1] || ''
      const consigneeAreaStr = city[2] || ''
      const consigneeTownStr = city[3] || ''

      const consigneeProvinceArr = consigneeProvinceStr.split(',')
      const consigneeCityArr = consigneeCityStr.split(',')
      const consigneeAreaArr = consigneeAreaStr.split(',')
      const consigneeTownArr = consigneeTownStr.split(',')

      const [consigneeProvince = '', consigneeProvinceCode = ''] = consigneeProvinceArr || []
      const [consigneeCity = '', consigneeCityCode = ''] = consigneeCityArr || []
      const [consigneeArea = '', consigneeAreaCode = ''] = consigneeAreaArr || []
      const [consigneeTown = '', consigneeTownCode = ''] = consigneeTownArr || []

      const data = {
        businessCode: val.businessCode, // 业务线
        productCode: val.goods.productCode, // 产品code
        supplierDelivery: val.supplierDelivery, // 发货方式
        supplierId: val.supplierId, // 承运商
        channelCode: val.channelCode, // 中台业务编码、暂时定死
        address: {
          consigneeCountry: '中国',
          consigneeCountryCode: 'cn',
          consigneeName: val.consigneeName,
          consigneeProvince: consigneeProvince,
          consigneeCity: consigneeCity,
          consigneeArea: consigneeArea,
          consigneeTown: consigneeTown !== '-' ? consigneeTown : '',
          consigneeProvinceCode: consigneeProvinceCode,
          consigneeCityCode: consigneeCityCode,
          consigneeAreaCode: consigneeAreaCode,
          consigneeTownCode: consigneeTownCode,
          consigneeAddress: val.consigneeAddress,
          consigneeMobile: val.consigneeMobile
        }
      }
      const { isEdit, id } = this
      if (isEdit) {
        data.id = id
      }
      mpCreateOrder(data).then(res => {
        const { isEdit, order } = this
        const data = res.data || {}
        const orderNo = isEdit ? order.orderNo : data.orderNo
        this.$message.success(isEdit ? '物流单修改成功' : '物流单创建成功')
        this.$router.push({ name: 'ExpressManage', query: { orderNo: orderNo, time: null }})
      })
    },
    openDl() {
      this.goodsState = true
    },
    closeDl() {
      this.goodsState = false
    },
    choice(row) {
      this.closeDl()
      this.$refs.createExpress && this.$refs.createExpress.set({
        type: 'defaultVal',
        data: { goods: row }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
    vertical-align: middle;
    // width: 300px;
  }
  /deep/ .el-form-item__label {
    display: flex;
    width: 86px !important;
    margin-right: 10px;
    align-items: center;
    justify-content: flex-end;
    align-self: flex-start;
    line-height: 1.3;
    min-height: 36px;
    vertical-align: middle;
    flex-shrink: 0;
  }
}
</style>
