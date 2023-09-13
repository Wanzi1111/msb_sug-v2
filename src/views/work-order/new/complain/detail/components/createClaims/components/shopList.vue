<template>
  <div class="shop-list">
    <el-dialog
      title="选择商品"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-input
        v-model="productName"
        placeholder="请根据商品名称进行筛选"
        class="input-with-select"
        @change="getCompensateProductsFn"
      >
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
      <el-table
        ref="multipleTable"
        :data="shopListData"
        class="shop-table"
        row-key="productCode"
        @select="selectTable"
        @select-all="selectTableAll"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column property="productName" label="商品名称" />
        <el-table-column
          property="productSum"
          label="数量"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.productSum"
              :min="1"
              :disabled="scope.row.checkNum"
              @blur="cahngeNumber(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel(true)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCompensateProducts } from '@/api/myExamine'
export default {
  name: 'ShopList',
  props: {
    shopListFlag: { type: Boolean },
    disableCheck: { type: Boolean },
    productList: { type: Array, default: () => {} }
  },
  data() {
    return {
      visible: this.shopListFlag,
      shopListData: [],
      productName: '',
      selectProductData: [],
      checkData: [],
      prevCheckData: []
    }
  },
  watch: {
    shopListFlag(newVal) {
      this.visible = newVal
      this.checkData = []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getCompensateProductsFn()
    })
  },
  methods: {
    // 选择商品列表
    getCompensateProductsFn() {
      const loading = this.$loading({
        lock: true
      })
      getCompensateProducts({ productName: this.productName }).then((res) => {
        loading.close()
        const { code, payload } = res
        if (code === 0) {
          this.shopListData =
            payload.map((val) => {
              return {
                ...val,
                productName: val.productName,
                productCode: val.productCode,
                productSum: 0,
                checkNum: true
              }
            }) || []
          this.prevCheckData = [...this.prevCheckData, ...this.checkData]
          if (!this.productName && this.checkData?.length > 0) {
            // 积分商城只取最后一次勾选数据
            const data = this.disableCheck
              ? this.checkData.slice(-1)
              : this.prevCheckData
            data.map((val) => {
              this.shopListData.map((item) => {
                if (val.productCode === item.productCode && !val.checkNum) {
                  item.checkNum = val.checkNum
                  item.productSum = val.productSum
                  this.$nextTick(() => {
                    this.$refs.multipleTable.toggleRowSelection(item, true)
                  })
                }
                return item
              })
            })
          }
        }
      })
    },
    cancel(val) {
       this.$emit('cancel', val ? this.checkData : [])
    },
    selectTable(row, item) {
      // 选中或反选 决定数量是否可修改
      const check = row.length && row.indexOf(item) !== -1
      this.shopListData.map((val) => {
        if (val.productCode === item.productCode) {
          val.checkNum = !check
          val.productSum = !check ? 1 : item.productSum
        }
        return val
      })
      if (row.length > 1 && this.disableCheck) {
        const del_row = row.shift()
        // 只能选一个时 只有选中的可修改数量
        del_row.checkNum = true
        del_row.productSum = 1
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
      this.checkData = row
    },
    selectTableAll(row) {
      // 全选
      if (!this.disableCheck) {
        if (row.length) {
          row.forEach((val) => {
            this.shopListData.forEach((item) => {
              if (item.productCode === val.productCode) {
                item.checkNum = false
                item.productSum = 1
              }
            })
          })
        } else {
          this.shopListData.forEach((item) => {
            item.checkNum = true
            item.productSum = 1
          })
        }
        return (this.checkData = row)
      }
      // 单选
      if (this.checkData.length) {
        this.checkData = []
        this.shopListData.map((val) => {
          val.checkNum = true
          val.productSum = 1
          this.$refs.multipleTable.toggleRowSelection(val, false)
          return val
        })
      } else {
        row.length = 1
        this.checkData = [row[0]]
        row[0].checkNum = false
        row[0].productSum = 1
        this.$refs.multipleTable.toggleRowSelection(row[0], true)
      }
    },
    cahngeNumber(value) {
      if (Number(value.productSum) > Number(value.stockNum)) {
        value.productSum = 1
        this.$message.error('您的数量超出库存~')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.shop-list {
  .input-with-select {
    padding: 0 5px;
  }
  .shop-table {
    height: 500px;
    overflow: auto;
  }
}
</style>
