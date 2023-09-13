<template>
  <div>
    <el-button style="margin-bottom: 10px" size="mini" icon="el-icon-plus" plain type="primary" @click="() => openDl({pName: row.typeName, pcode: row.code})">
      新增二级分类
    </el-button>
    <basics-table
      ref="table"
      :table="table"
      :loading="loading"
      :loadings="loadings"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :action-function="actions"
    />
    <!-- 新增商品 -->
    <el-dialog
      :title="title"
      :visible.sync="classState"
      width="500px"
      :before-close="closeDl"
    >
      <basics-form :key="classState" ref="createMateriel" :loading="formLoading" :forms="classFrom" :actions="classAct" @submitForm="submitForm" />
    </el-dialog>
  </div>
</template>

<script>
import { categoryList, isEnable, categorySave, categoryUpdate } from '@/api/goods/category'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import forms, { actions as classAct } from './forms/class'
import { mapGetters } from 'vuex'

export default {
  name: 'ChrCate',
  components: { BasicsTable, BasicsForm },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actions: actions({ switchState: this.switchState, edit: this.edit }),
      total: 0,
      list: [],
      loading: false,
      classState: false,
      classFrom: [],
      classAct: {},
      dat: {},
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    title() {
      const { isEdit } = this
      return isEdit ? `修改二级分类` : `新增二级分类`
    },
    formLoading() {
      return this.loadings._logistics_product_type_save || this.loadings._logistics_product_type_update
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const { row } = this
      const data = {
        pcode: row.code,
        level: 2,
        pageAble: false
      }
      this.loading = true
      categoryList(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
      }).finally(() => {
        this.loading = false
      })
    },
    switchState(status, id) {
      isEnable({
        id: id,
        status: status
      }).then(() => {
        this.$message.success(status ? '启用分类成功' : '停用分类成功')
        this.getList()
      })
    },
    edit(dat) {
      const { row } = this
      this.isEdit = true
      this.openDl({ ...dat, pName: row.typeName, pcode: row.code })
    },
    openDl(dat) {
      this.classFrom = forms(dat)
      this.classAct = classAct({ closeDl: this.closeDl, isEdit: this.isEdit })
      this.classState = true
    },
    closeDl() {
      this.classState = false
      this.$nextTick(() => {
        this.isEdit = false
      })
    },
    submitForm(val) {
      const { isEdit } = this
      if (isEdit) {
        const data = {
          typeName: val.typeName,
          typeDesc: val.typeDesc
        }
        categoryUpdate({ ...data, id: val.id }).then(() => {
          this.$message.success('修改二级分类成功')
          this.getList()
          this.closeDl()
          if (isEdit) {
            this.isEdit = false
          }
        })
      } else {
        const data = {
          level: 2, // 一级1二级2
          pcode: val.pcode,
          status: 1, // 1 启用 0 停用
          typeName: val.typeName,
          typeDesc: val.typeDesc
        }
        categorySave(data).then(() => {
          this.$message.success('新增二级分类成功')
          this.getList()
          this.closeDl()
        })
      }
    }
  }
}
</script>
