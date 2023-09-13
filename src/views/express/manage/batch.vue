<template>
  <div class="app-container">
    <basics-block title="批量创建物流单" back>
      <el-form label-width="100px">
        <el-form-item label="导入收件信息">
          <a style="color: #1890ff;" @click="openDl"><i class="el-icon-download" />下载模板</a>
          <upload
            ref="upload"
            :upload-api="importCreateOrder"
            tip="支持扩展名：.xls,.xlsx 且不超过1M"
            :media-rules="{
              size: 1,
              type: '.xls,.xlsx'
            }"
            @uploadEnd="uploadEnd"
          />
        </el-form-item>
        <br>
        <el-form-item>
          <el-button icon="el-icon-check" :loading="loadings._logistics_manage_importCreateOrder" type="primary" @click="nowUp('importsForm')">立即上传</el-button>
          <!--					<el-button icon="el-icon-check" @click="submitForm('importsForm')">跳过，只上传正常数据</el-button>-->
          <!--					<el-button icon="el-icon-download" @click="submitForm('importsForm')">导出文件</el-button>-->
          <el-button icon="el-icon-back" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 下载模板 -->
      <el-dialog
        title="下载模板"
        :visible.sync="tempState"
        width="500px"
        :before-close="closeDl"
      >
        <el-alert
          title="已选择项会填充至下载模板中"
          type="warning"
          effect="dark"
          show-icon
        />
        <basics-form :key="tempState" ref="batchForm" :loading="loadings._logistics_manage_exportTemplate" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm">
          <template slot="goods" slot-scope="scope">
            <el-form-item v-bind="scope.item" class="form-item">
              <el-button v-if="!(scope.form && scope.form.goods && Object.keys(scope.form.goods).length)" style="margin-left: 5px" type="primary" size="mini" @click="openGoodsDl">
                选择商品
              </el-button>
              <template v-else>
                <span style="color: #333333; font-size: 16px">{{ scope.form.goods.productCode }}&ensp;{{ scope.form.goods.productName }}</span>
                <el-button style="margin-left: 5px" size="mini" @click="openGoodsDl">重新选择</el-button>
              </template>
            </el-form-item>
          </template>
        </basics-form>

        <el-dialog
          title="选择商品"
          :visible.sync="goodsState"
          width="80%"
          :before-close="() => closeGoodsDl()"
          append-to-body
        >
          <choice-goods :key="goodsState" @choice="choice" />
        </el-dialog>

      </el-dialog>
    </basics-block>
  </div>
</template>

<script>
import { businessList, houseListApi } from '@/api/goods/manage'
import { exportTemplate, importCreateOrder } from '@/api/express/file'
import BasicsBlock from '@/components/BasicsBlock'
import BasicsForm from '@/components/BasicsForm'
import Upload from './components/Upload'
import forms, { actions } from './forms/batch'
import ChoiceGoods from './components/ChoiceGoods/index'
import { createBlob } from '@/utils'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'ExpressManageBatch',
  components: { BasicsBlock, BasicsForm, Upload, ChoiceGoods },
  data() {
    return {
      forms: forms,
      actions: actions({ closeDl: this.closeDl }),
      tempState: false,
      goodsState: false

    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  methods: {
    importCreateOrder,
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
          this.$refs.batchForm && this.$refs.batchForm.set({
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
          this.$refs.batchForm && this.$refs.batchForm.set({
            type: 'options',
            data: { [optionsKey]: options }
          })
        })
      })
    },
    changeForm(val, oldVal) {
      const { isEdit } = this
      if (val.supplierDelivery && val.supplierDelivery !== oldVal.supplierDelivery) {
        if (val.supplierDelivery === 1) {
          this.$refs.batchForm && this.$refs.batchForm.set({
            type: 'visible',
            data: { supplierId: true }
          })
        } else {
          this.$refs.batchForm && this.$refs.batchForm.set({
            type: 'visible',
            data: { supplierId: false }
          })
        }
      }
      if (val.businessCode && val.businessCode !== oldVal.businessCode) {
        if (!isEdit) {
          this.$refs.batchForm && this.$refs.batchForm.set({
            type: 'defaultVal',
            data: { supplierId: '' },
            validateField: false
          })
        }
        this.getArea({ businessCode: val.businessCode }, 'supplierId', 'supplierId', 'supplierName')
      }
    },
    submitForm(val) {
      // Parameter	Value	Description	Parameter Type	Data Type
      // string
      // businessCode
      // businessCode	query	integer
      // productCode
      // productCode	query	string
      // productName
      // productName	query	string
      // supplierDelivery
      // supplierDelivery	query	integer
      // supplierId
      // supplierId	query	integer
      // wareHouseNo
      // wareHouseNo	query	string
      const goods = val.goods || {}
      const data = {
        businessCode: val.businessCode,
        productCode: goods.productCode,
        productName: goods.productName,
        supplierDelivery: val.supplierDelivery,
        supplierId: val.supplierId,
        wareHouseNo: val.wareHouseNo
      }
      exportTemplate(data).then(res => {
        createBlob(`物流单创建模版-${moment().format('YYYY-MM-DD')}.xlsx`, res)
        this.$message.success('物流单创建模版下载成功')
        this.closeDl()
      })
    },
    ret() {
      this.$router.back()
    },
    openDl() {
      this.tempState = true
      this.getBusiness()
    },
    closeDl() {
      this.tempState = false
    },
    back() {
      this.$router.go(-1)
    },
    openGoodsDl() {
      this.goodsState = true
    },
    closeGoodsDl() {
      this.goodsState = false
    },
    choice(row) {
      this.closeGoodsDl()
      this.$refs.batchForm && this.$refs.batchForm.set({
        type: 'defaultVal',
        data: { goods: row }
      })
    },
    nowUp() {
      this.$refs.upload.actUp()
    },
    // 上传成功关闭
    uploadEnd(data) {
      this.$router.push({ name: 'ExpressManage', query: { batchId: data, time: null }})
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
