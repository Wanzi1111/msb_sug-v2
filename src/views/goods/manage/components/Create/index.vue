<template>
  <el-dialog
    :title="isEdit ? '修改商品' : '新增商品'"
    :visible.sync="state"
    width="500px"
    :before-close="() => closeDl()"
  >
    <basics-form :key="state" ref="createGoods" :loading="goodsLoading" :forms="forms" :actions="actions" @submitForm="submitForm">
      <template slot="marketPrice" slot-scope="scope">
        <el-form-item v-bind="scope.item" class="form-item">
          <el-input v-model="scope.form.marketPrice" style="width: 300px" placeholder="请输入市场价" maxlength="9">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </template>
      <template slot="costPrice" slot-scope="scope">
        <el-form-item v-bind="scope.item" class="form-item">
          <el-input v-model="scope.form.costPrice" style="width: 300px" placeholder="请输入成本价" maxlength="9">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </template>
      <template slot="productWeight" slot-scope="scope">
        <el-form-item v-bind="scope.item" class="form-item">
          <el-input v-model="scope.form.productWeight" style="width: 300px" placeholder="请输入重量属性" maxlength="9">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
      </template>
    </basics-form>
  </el-dialog>
</template>

<script>
import { productSave, productUpdate } from '@/api/goods/manage'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/goods'
import { mapGetters } from 'vuex'

export default {
  name: 'Create',
  components: { BasicsForm },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    businessCode: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forms: forms,
      actions: actions({ closeDl: this.closeDl })
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    goodsLoading() {
      return this.loadings._logistics_product_save || this.loadings._logistics_product_update
    }
  },
  watch: {
    state(val) {
      if (val) {
        this.$nextTick(() => {
          const { businessCode, row, isEdit } = this
          this.$refs.createGoods && this.$refs.createGoods.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
          if (isEdit) {
            const type = []
            row.productType && (type.push(row.productType))
            row.productChildType && (type.push(row.productChildType))
            this.$refs.createGoods && this.$refs.createGoods.set({
              type: 'defaultVal',
              data: {
                productName: row.productName,
                type: type,
                businessCode: row.businessCode,
                marketPrice: row.marketPrice,
                costPrice: row.costPrice,
                productWeight: row.productWeight,
                specDesc: row.specDesc,
                note: row.note
              }
            })
          }
        })
      }
    }
  },
  methods: {
    valiPass(rule, value, callback) {
      console.log(value)
      if (!/^d*(?:.d{0,2})?$/.test(value)) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    closeDl(sta = 0) {
      this.$emit('closeDl', sta)
    },
    submitForm(val) {
      const { isEdit, row } = this
      const type = val.type || []
      const productType = type[0] || ''
      const productChildType = type[1] || ''
      const data = {
        businessCode: val.businessCode,
        costPrice: val.costPrice,
        marketPrice: val.marketPrice,
        note: val.note,
        productName: val.productName,
        productType: productType,
        productChildType: productChildType,
        productWeight: val.productWeight,
        specDesc: val.specDesc
      }
      if (isEdit) {
        productUpdate({ ...data, id: row.id }).then(() => {
          this.$message.success('修改商品成功')
          this.closeDl(1)
        })
      } else {
        productSave(data).then(() => {
          this.$message.success('新增商品成功')
          this.closeDl(1)
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .form-item {
    /deep/ .el-form-item__label {
      width: 86px;
      margin-right: 10px;
    }
    /deep/ .el-form-item__content {
      display: flex;
    }
  }
</style>
