<template>
  <el-dialog
    :title="type ? `现有库存：${allTotal}` : '设置仓库'"
    :visible.sync="state"
    width="800px"
    :before-close="() => closeDl()"
  >

    <!--现有库存-->
    <div v-if="type">
      <el-button style="margin-bottom: 10px" icon="el-icon-refresh" type="success" :loading="loadings._logistics_warehouse_product_updateSupplierStock" @click="refresh">更新</el-button>
      <basics-table :key="state" :columns="newColumns" :list="newList" :loading="houseLoading">
        <template slot="action" slot-scope="scope">
          <el-input v-if="isEdit[`stock${scope.$index}`] === true" :ref="`stock${scope.$index}`" v-model="scope.row.stock" style="width: 260px" oninput="value = value.replace(/[^0-9]/g, '')" maxlength="5">
            <el-select slot="prepend" v-model="scope.row.numType" style="width: 76px">
              <el-option label="添加" :value="1" />
              <el-option label="扣减" :value="2" />
            </el-select>
            <div slot="append">
              <el-button :loading="loadings._logistics_warehouse_product_updateStock" @click="() => saveNum(`stock${scope.$index}`, scope.row)">
                确定
              </el-button>
              <el-button :loading="loadings._logistics_warehouse_product_updateStock" @click="() => swEdit(`stock${scope.$index}`, false)">
                取消
              </el-button>
            </div>
          </el-input>
          <a v-else style="color: #1890ff" class="code-edit" @click="() => swEdit(`stock${scope.$index}`, true)">添加库存</a>
        </template>
      </basics-table>
      <p>累计出库数： {{ deliveryTotal }}</p>
    </div>
    <!--设置仓库-->
    <div v-else>
      <p class="title">{{ row.productCode }}&emsp;{{ row.productName }}</p>
      <basics-table :key="state" :columns="houseColumns" :list="houseLists" :loading="loadings._logistics_warehouse_product_list">
        <template slot="action" slot-scope="scope">
          <a style="color: #1890ff" href="javascript:;" @click="() => openFormDl(1, scope.row)">编辑</a>
          <a style="color: #ff4949" href="javascript:;" @click="() => del(scope.row)">删除</a>
        </template>
      </basics-table>
      <el-button style="margin-top: 10px" icon="el-icon-circle-plus-outline" type="primary" @click="() => openFormDl(0)">添加仓库</el-button>

      <!--设置仓库-->
      <el-dialog
        :title="isEdit ? '修改仓库' : '添加仓库'"
        :visible.sync="createState"
        width="500px"
        :before-close="() => closeFormDl()"
        append-to-body
      >
        <basics-form :key="createState" ref="setHouse" :loading="goodsLoading" :forms="forms" :actions="actions" @submitForm="submitForm" @changeForm="changeForm" />
      </el-dialog>
    </div>

  </el-dialog>
</template>

<script>
import {
  houseListApi,
  houseSave,
  houseUpdate,
  houseList,
  deleteHouse,
  productOne,
  updateStock,
  updateSupplierStock
} from '@/api/goods/manage'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/goods'
import houseColumns from './columns/house'
import newColumns from './columns/new'
import { mapGetters } from 'vuex'

export default {
  name: 'Create',
  components: { BasicsTable, BasicsForm },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Number,
      default: 0
    },
    businessCode: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      forms: [],
      actions: actions({ closeDl: this.closeFormDl }),
      houseColumns: houseColumns,
      newColumns: newColumns,
      houseLists: [],
      newList: [],
      createState: false,
      isEdit: false,
      deliveryTotal: 0,
      allTotal: 0,
      oldSupplierProductCode: ''
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    goodsLoading() {
      return this.loadings._logistics_warehouse_save || this.loadings._logistics_warehouse_update
    },
    houseLoading() {
      return this.loadings._logistics_warehouse_product_updateSupplierStock || this.loadings._logistics_warehouse_product_productOne
    }
  },
  watch: {
    state(val) {
      if (val) {
        const { type } = this
        if (type) {
          this.getProductOne()
        } else {
          this.getList()
        }
      }
    }
  },
  methods: {
    getList() {
      const { row } = this
      houseList({ productCode: row.productCode }).then(res => {
        const data = res.data || {}
        this.houseLists = data.list || []
      })
    },
    getProductOne() {
      const { row } = this
      productOne({ productCode: row.productCode }).then(res => {
        const data = res.data || {}
        const newList = data.list || []
        newList.forEach(item => (item.numType = 1))
        this.newList = newList
        this.deliveryTotal = data.deliveryTotal || 0 // 累计出库数
        this.allTotal = data.total || 0 // 现有库存
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
        this.$refs.setHouse && this.$refs.setHouse.set({
          type: 'options',
          data: { [optionsKey]: options }
        })
      })
    },
    closeDl(sta = 0) {
      this.$emit('closeDl', sta)
    },
    changeForm(val, oldVal) {
      const { isEdit } = this
      if (val.businessCode && val.businessCode !== oldVal.businessCode) {
        if (!isEdit) {
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'defaultVal',
            data: { supplierId: '', warehouseCode: '' },
            validateField: false
          })
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'options',
            data: { supplierId: [], warehouseCode: [] }
          })
        }
        this.getArea({ businessCode: val.businessCode }, 'supplierId', 'supplierId', 'supplierName')
      }
      if (val.supplierId && val.supplierId !== oldVal.supplierId) {
        if (!isEdit) {
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'defaultVal',
            data: { warehouseNo: '' },
            validateField: false
          })
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'options',
            data: { warehouseCode: [] }
          })
        }
        this.getArea({
          businessCode: val.businessCode,
          supplierId: val.supplierId
        }, 'warehouseNo', 'warehouseCode', 'warehouseName')
      }
    },
    submitForm(val) {
      const { isEdit, row } = this
      const data = {
        productName: row.productName,
        ...val
      }
      console.log(data)
      if (isEdit) {
        houseUpdate({ ...data, oldSupplierProductCode: this.oldSupplierProductCode }).then(() => {
          this.$message.success('修改仓库成功')
          this.getList()
          this.closeFormDl()
        })
      } else {
        houseSave(data).then(() => {
          this.$message.success('添加仓库成功')
          this.getList()
          this.closeFormDl()
        })
      }
    },
    openFormDl(sta, dat = {}) {
      this.oldSupplierProductCode = dat.productCode
      this.isEdit = sta
      this.createState = true
      const { row } = this
      this.forms = forms(row, dat)
      this.$nextTick(() => {
        const { businessCode } = this
        this.$refs.setHouse && this.$refs.setHouse.set({
          type: 'options',
          data: { businessCode: businessCode }
        })
      })
      if (sta) {
        this.$nextTick(() => {
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'attr',
            data: {
              businessCode: { disabled: true },
              supplierId: { disabled: true },
              warehouseNo: { disabled: true }
            }
          })
          this.$refs.setHouse && this.$refs.setHouse.set({
            type: 'defaultVal',
            data: {
              businessCode: dat.businessCode,
              supplierId: dat.supplierId,
              warehouseNo: dat.warehouseCode,
              supplierProductCode: dat.productCode
            }
          })
        })
      }
    },
    closeFormDl() {
      this.createState = false
      this.oldSupplierProductCode = ''
    },
    del(dat) {
      this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该仓库吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            const { row } = this
            deleteHouse({
              ...dat,
              productCode: row.productCode,
              supplierProductCode: dat.productCode,
              warehouseNo: dat.warehouseCode
            }).then(() => {
              this.$message.success('删除仓库成功')
              this.getList()
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    // 刷新
    refresh() {
      const { row } = this
      updateSupplierStock({ productCode: row.productCode }).then(res => {
        this.$message.success('更新第三方库存成功')
        this.getProductOne()
      })
    },
    swEdit(key, sta) {
      this.isEdit = {
        ...this.isEdit,
        [key]: sta
      }
      if (sta) {
        this.$nextTick(() => {
          this.$refs[key].focus()
        })
      }
    },
    saveNum(key, dat) {
      const { row } = this
      const data = {
        amount: dat.stock,
        id: dat.id,
        type: dat.numType,
        warehouseNo: dat.warehouseCode,
        productCode: row.productCode
      }
      updateStock(data).then(() => {
        this.swEdit(key, false)
        this.getProductOne()
        this.$message.success(dat.numType === 1 ? '添加库存成功' : '扣减库存成功')
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.title {
  background-color: #f2f2f2;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 10px;
  margin: 0 0 20px 0;
}

.code-edit {
  padding: 2px 5px;

  .edit-icon {
    display: none;
  }

  &:hover {
    .edit-icon {
      display: inline;
    }
  }
}
</style>
