<template>
  <div>
    <div v-if="isEchoAddress" class="public-red is-echo-address">
      当前商品为「{{
        isChina === 0 ? '中国' : '海外' + chineseCountryName
      }}套餐」仅可修改为{{
        isChina === 0 ? '中国' : '海外' + chineseCountryName
      }}收货地址
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      :hide-required-asterisk="asterisk"
    >
      <el-form-item prop="receiptName">
        <span slot="label">收货人姓名</span>
        <el-input v-model="ruleForm.receiptName" />
      </el-form-item>
      <el-form-item>
        <span slot="label"><span class="public-red">*</span>收货人地址</span>
        <el-cascader
          ref="myCascader"
          v-model="areaSlist"
          placeholder="国内/海外"
          :options="areaLists"
          size="medium"
          filterable
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
          @active-item-change="handleItemChange"
        />
      </el-form-item>
      <el-form-item prop="addressDetail">
        <span slot="label">详细地址</span>
        <el-input v-model="ruleForm.addressDetail" />
      </el-form-item>
      <el-form-item prop="receiptTel">
        <span slot="label"><span class="public-red">*</span>收货人电话</span>
        <div class="zoon-name">
          <el-select v-model="ruleForm.telAreaCode" style="width:100px">
            <el-option
              v-for="item in ZOON_NUMBER"
              :key="item.number"
              :value="item.number"
            >
              {{ item.number + ' ' + item.name }}</el-option>
          </el-select>
          <el-input v-model="ruleForm.receiptTel" />
        </div>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.telAreaCode === '+886'"
        :rules="
          ruleForm.telAreaCode === '+886' ? rules.idCode : [{ required: false }]
        "
        prop="idCode"
      >
        <span slot="label"><span class="public-red">*</span>收货人证件号</span>
        <el-input v-model="ruleForm.idCode" />
        <div style="color:red;font-size:12px">
          台湾地区请务必填写证件号，否则物流无法送达；非台湾地区无需填写
        </div>
      </el-form-item>

      <el-form-item
        v-if="
          ruleForm.telAreaCode !== '+86' &&
            ruleForm.telAreaCode !== '+886' &&
            ruleForm.telAreaCode !== '+852' &&
            ruleForm.telAreaCode !== '+853'
        "
        :rules="
          ruleForm.telAreaCode === '+86' ? [{ required: false }] : rules.zipCode
        "
        prop="zipCode"
      >
        <span slot="label"><span class="public-red">*</span>邮编</span>
        <el-input v-model="ruleForm.zipCode" />
        <div style="color:red;font-size:12px">
          海外地区必须填写邮编！
        </div>
      </el-form-item>
      <el-form-item>
        <span slot="label">同步默认地址</span>
        <el-radio
          v-model="radio"
          label="1"
          :disabled="limitSync"
        >同步</el-radio>
        <el-radio v-model="radio" label="2">无需同步</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          style="width: 100px;"
          type="primary"
          @click="submitForm('ruleForm')"
        >保存</el-button>
        <el-button
          size="small"
          style="width: 100px;"
          @click="cancelAction"
        >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getCenterOSAddressList,
  getCenterAddressList,
  getCenterCountryList,
  getCenterAddressTownList,
  createAddressNew,
  updateAddressNew,
  updateDefaultAddress
 } from '@/api/operate/examineApi'
export default {
  name: 'ModifyAddress',
  props: {
    modifyFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    echoAddress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    userId: {
      required: true,
      type: String,
      default: ''
    },
    isDefaultAddress: {
      required: true,
      type: Number,
      default: 0
    },
    isChina: {
      required: true,
      type: Number,
      default: 0
    },
    countryCode: {
      required: true,
      type: String,
      default: ''
    },
    countryName: {
      required: true,
      type: String,
      default: ''
    },
    chineseCountryName: {
      required: true,
      type: String,
      default: ''
    },
    limitSync: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入收货姓名'))
      } else {
        const reg = /[^\s]/
        if (!reg.test(value)) {
          callback(new Error('收货人姓名，开头不能有空格'))
        }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        // const reg = /^1[3456789]\d{9}$/
        // if (!reg.test(value)) {
        //   callback(new Error('请输入正确手机号'))
        // }
        callback()
      }
    }
    return {
      radio: this.isDefaultAddress === 1 ? '1' : '2',
      asterisk: false,
      country_code: '', // 国家编码
      country_name: '', // 国家名称
      address_company: '', // 收件人公司地址
      zip_code: '', // 邮政编码
      ZOON_NUMBER: [],
      overseas: [],
      areaSlist: [], // 省市区联动地址选择
      areaLists: [], // 省市区联动地址选择-相关
      province: null,
      city: null,
      area: null,
      areaCode: null,
      street: null,
      ruleForm: {
        receiptName: '',
        receiptTel: '',
        addressDetail: '',
        idCode: '',
        zipCode: '',
        telAreaCode: '+86'
      },
      addressId: '',
      rules: {
        receiptName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        receiptTel: [
          {
            maxlength: 11,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        zipCode: [
          {
            required: true,
            message: '请输入邮编地址',
            trigger: 'blur'
          }
        ],
        idCode: [
          {
            required: true,
            message: '请输入收货人证件号',
            trigger: 'blur'
          }
        ],
        addressDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      operatorId: '',
      addressList: [],
      levelFourList: [],
      isEchoAddress: false,
      isDefault: 0
    }
  },

  async created() {
    this.isEchoAddress = Object.prototype.hasOwnProperty.call(
      this.echoAddress,
      'type'
    )
    this.getAreaLists()
  },
  methods: {
    // 各父级选项值
    async handleExpandChange(res) {
      if (res[0] === '00000' && res.length === 2) {
        const e = await getCenterOSAddressList({
         countryCode: +res[1] === 18 ? 'MY0000' : res[1]
        })
        if (e.payload.data.length > 0) {
          e.payload.data.forEach((item) => {
            item.label = `${item.simpleName}(${item.provinceName})`
            item.value = item.provinceName
            item.children = item.citys
            item.children.forEach((items) => {
              items.label = `${items.simpleName}(${items.cityName})`
              items.value = items.cityName
              items.children = items.citys
            })
          })
          this.areaLists[1].children.forEach((item) => {
            if (item.value === (+res[1] === 18 ? 'MY0000' : res[1])) {
              item.children = e.payload.data
            }
          })
        }
      }
    },
    async getAreaLists() {
      const obj = [
        {
          label: '国内',
          value: '99999',
          children: [],
          disabled: this.isChina === 2 //
        },
        {
          label: '海外',
          value: '00000',
          children: [],
          disabled: this.isChina === 0 //
        }
      ]
      getCenterAddressList().then((res) => {
        const _data = res.payload.data
        _data.forEach((ele) => {
          ele.label = ele.provinceName
          ele.value = ele.id
          ele.children = ele.citys
          ele.children.forEach((val) => {
            val.label = val.cityName
            val.value = +val.cityCode + 999
            val.children = val.countys
            val.children.forEach((_value) => {
              _value.label = _value.countyName
              _value.value = _value.countyCode
              _value.children = [{ label: '暂不选择', value: '' }]
            })
          })
        })
        obj[0].children = _data
        this.getOverseas(obj)
      })
    },
    async getOverseas(e) {
      const res = await getCenterCountryList()
      if (res.payload.data && res.payload.data.length > 0) {
        res.payload.data.forEach((item) => {
          item.label = `${item.simpleName}(${item.countryName})`
          item.value = item.countryCode
          item.children = []
        })
        e[1].children = res.payload.data
        this.areaLists = e
        // 999999 新增地址
        if (+this.echoAddress.type === 2) {
          this.areaLists.forEach((item) => {
            item.children.forEach((res) => {
              // console.log(res.countryCode, this.countryCode)
              if (res.countryCode === this.countryCode) {
                // 海外的时候，当前物流为哪个国家，就只能选择那个国家的地址
                res.disabled = false
              } else {
                res.disabled = true
              }
            })
          })
        }
        if (this.echoAddress.id) {
          const echoCopy = await this.echoAddress.countryCode
          await this.handleExpandChange(['00000', echoCopy])
          await this.echoAddressOperate()
        }
      }
    },
    handleItemChange(data) {
      const addressList = this.areaLists
      if (data[0] === '00000') {
        this.handleExpandChange(data)
        return
      }
      addressList.forEach((res) => {
        if (data[0] === res.value && data[0] === '99999') {
          res.children.forEach((ele) => {
            if (+data[1] === +ele.value) {
              ele.children.forEach((val) => {
                if (+data[2] === +val.cityCode + 999) {
                  val.children.forEach((item) => {
                    if (+data[3] === +item.countyCode) {
                      getCenterAddressTownList({
                          code: data[3]
                      }).then(
                        (data) => {
                          const _data = data.payload
                          _data.forEach((codeVal) => {
                            const add = {
                              label: codeVal.townName,
                              value: codeVal.townCode
                            }
                            item.children.push(add)
                            if (codeVal.townName === this.echoAddress.street) {
                              this.street = codeVal.townName
                              this.$set(this.areaSlist, 4, codeVal.townCode)
                            }
                          })
                          this.levelFourList = _data
                        }
                      )
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    // 回显收货地址
    async echoAddressOperate() {
      this.addressId = this.echoAddress.id
      this.ruleForm.receiptName = this.echoAddress.receiptName
      this.ruleForm.receiptTel = this.echoAddress.receiptTel
      this.ruleForm.addressDetail = this.echoAddress.addressDetail
      this.ruleForm.idCode = this.echoAddress.idCode
      this.ruleForm.zipCode = this.echoAddress.zipCode
      this.ruleForm.telAreaCode = this.echoAddress.telAreaCode
      const areaList = this.areaLists
      this.echoAddress.type === 2
        ? this.$set(this.areaLists[0], 'disabled', true)
        : this.$set(this.areaLists[1], 'disabled', true)
      const provinces = []
      const citys = []
      const areas = []
      if (+this.echoAddress.type === 2) {
        // 海外

        areaList.forEach((item) => {
          item.children.forEach((res) => {
            if (res.countryCode === this.echoAddress.countryCode) {
              // 海外的时候，当前物流为哪个国家，就只能选择那个国家的地址
              res.disabled = false
            } else {
              res.disabled = true
            }
            if (res.countryName === this.echoAddress.countryName) {
              provinces.push(res)
              res.children.forEach((ele) => {
                if (ele.value === this.echoAddress.province) {
                  citys.push(ele)
                  ele.children.forEach((val) => {
                    if (val.value === this.echoAddress.city) {
                      areas.push(val)
                    }
                  })
                }
              })
            }
          })
        })
        this.province = provinces[0].countryName
        this.city = citys[0].provinceName
        this.area = areas[0].cityName
        this.areaSlist = [
          '00000',
          provinces[0].value,
          citys[0].value,
          areas[0].value
        ]
      } else {
        areaList.forEach((item) => {
          item.children.forEach((res) => {
            if (res.label === this.echoAddress.province) {
              provinces.push(res)
              res.children.forEach((ele) => {
                if (ele.label === this.echoAddress.city) {
                  citys.push(ele)
                  ele.children.forEach((val) => {
                    if (val.label === this.echoAddress.area) {
                      areas.push(val)
                    }
                  })
                }
              })
            }
          })
        })
        this.province = provinces[0].label
        this.city = citys[0].label
        this.area = areas[0].label

        this.areaSlist = [
          '99999',
          provinces[0].value,
          citys[0].value,
          areas[0].value,
          ''
        ]
        this.handleItemChange(this.areaSlist)
      }
    },
    // 级联城市级联
    handleChange(data) {
      const addressList = this.areaLists
      const childValue =
        data[0] === '00000' ? addressList[1].children : addressList[0].children
      this.ruleForm.telAreaCode =
        childValue.find((item) => item.value === data[1]).telAreaCode || '+86'
      const internal = this.areaLists.filter((item) => +item.value === +data[0])
      const provinces = internal[0].children.filter((item) =>
        data[0] === '00000' ? item.value === data[1] : +item.value === +data[1]
      )
      const citys = provinces[0].children.filter((item) =>
        data[0] === '00000' ? item.value === data[2] : +item.value === +data[2]
      )
      const areas = citys[0].children.filter((item) =>
        data[0] === '00000' ? item.value === data[3] : +item.value === +data[3]
      )
      const streets = this.levelFourList.filter(
        (item) => +item.townCode === +data[4]
      )
      this.internal = internal[0].value
      this.province =
        data[0] === '00000' ? provinces[0].countryName : provinces[0].label
      this.city = data[0] === '00000' ? citys[0].value : citys[0].label
      this.area = data[0] === '00000' ? areas[0].value : areas[0].label
      this.areaCode = data[3]
      this.street = data[4] ? streets[0].townName : ''
    },
    // 确认
    async submitForm(formName) {
      const routerTitle = this.$route?.meta?.title // 路由title
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            addressId: this.addressId,
            isDefault: this.isDefault,
            userId: this.userId,
            province: this.areaSlist[0] === '00000' ? this.city : this.province,
            city: this.areaSlist[0] === '00000' ? this.area : this.city,
            area: this.areaSlist[0] === '00000' ? '' : this.area,
            street: this.street,
            ...this.ruleForm,
            type: this.areaSlist[0] === '00000' ? 2 : 0,
            module: routerTitle || '', // 模块
            client: 'BOSS', // 来源-端
            countryCode: this.countryCode,
            countryName: this.countryName
          }
          if (this.areaSlist[0] === '00000') {
            Object.assign(params, {
              countryName: this.province,
              countryCode: this.areaSlist[1]
            })
          }
          if (params.addressId) {
            const obj = {
              '00000': updateAddressNew,
              '99999': updateAddressNew
            }
            // 修改接口
            obj[this.areaSlist[0]](params).then((res) => {
              if (res.code === 0) {
                this.$message({
                  message: '修改地址成功',
                  type: 'success'
                })
                this.$emit(
                  'closeAddChangeAddress',
                  this.addressId,
                  this.radio,
                  res.payload
                )
              }
            })
          } else {
            const obj = {
              '00000': createAddressNew,
              '99999': createAddressNew
            }
            if (this.userId === 'noInterface') {
              // 纯录入
              this.$emit('pureInutAction', params)
            } else {
              // 新增接口
              obj[this.areaSlist[0]](params).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    message: '新增地址成功',
                    type: 'success'
                  })
                  this.$emit(
                    'closeAddChangeAddress',
                    res.payload.id,
                    this.radio,
                    res.payload
                  )
                }
              })
            }
          }
        }
      })
    },
    // 取消
    cancelAction() {
      this.$emit('closeAddChangeAddress', 'cancel')
      this.$emit('pureInutActionCancel') // 订单转入审批
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('modifyAddressExpress', 2)
    },
    updateDefaultAddress(id) {
      const params = {
        addressId: id,
        userId: this.userId,
        module: this.$route?.meta?.title, // 路由title
        client: 'BOSS' // 来源-端
      }
      updateDefaultAddress(params).then((res) => {
        if (res?.code === 0) {
          // this.$message.success('操作成功')
          this.isDefault = res.payload.isDefault
          this.$emit('modifyAddressExpress')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.public-red {
  color: red;
  margin-right: 3px;
}
.zoon-name {
  display: flex;
}
.choiceAddRess {
  max-height: 150px;
  overflow-y: scroll;
  .mt-20 {
    margin-top: 20px;
    &:nth-child(1) {
      margin-top: 0px;
    }
  }
}
.areaLists-css {
  position: relative;
  top: 30px;
  left: 18px;
  font-size: 14px;
  font-weight: 600;
}
</style>
<style lang="scss" scoped>
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: '';
}
.is-echo-address {
  margin-left: 20px;
  padding-bottom: 10px;
}
</style>
