<template>
  <div>
    <div class="title-container">
      <basics-title title="商品分类" line />
    </div>
    <div class="app-container">
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :table="table"
        :events="events"
        :loading="loading"
        :loadings="loadings"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
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
  </div>
</template>

<script>
import { categoryList, isEnable, categorySave, categoryUpdate } from '@/api/goods/category'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import forms, { actions as classAct } from './forms/class'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsCategory',
  components: { BasicsTitle, BasicsAction, BasicsTable, BasicsForm },
  data() {
    return {
      act: act({ openDl: this.openDl }),
      table: { stripe: true },
      events: { 'sort-change': this.sortChange },
      columns: columns,
      actions: actions({ switchState: this.switchState, edit: this.edit, del: this.del }),
      total: 0,
      list: [],
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      classState: false,
      classFrom: [],
      classAct: {},
      dat: {},
      isEdit: false,
      orderBy: 1
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    title() {
      const { isEdit } = this
      return isEdit ? `修改一级分类` : `新增一级分类`
    },
    formLoading() {
      return this.loadings._logistics_product_type_save || this.loadings._logistics_product_type_update
    }
  },
  created() {
    this.getList()
  },
  methods: {
    sortChange(params) {
      const { order, prop } = params
      console.log('prop:', prop, 'type:', order)
      if (order) {
        this.orderBy = order === 'ascending' ? 1 : 2
        this.getList()
      }
    },
    getList() {
      const { listQuery } = this
      const data = {
        pcode: 0,
        level: 1,
        orderBy: this.orderBy,
        page: listQuery.page,
        pageSize: listQuery.limit
      }
      this.loading = true
      categoryList(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
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
      this.isEdit = true
      this.openDl(dat)
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
          this.$message.success('修改分类成功')
          this.getList()
          this.closeDl()
          if (isEdit) {
            this.isEdit = false
          }
        })
      } else {
        const data = {
          level: 1, // 一级1二级2
          pcode: '0',
          status: 0, // 1 启用 0 停用,新建的一级分类默认不启用
          typeName: val.typeName,
          typeDesc: val.typeDesc
        }
        categorySave(data).then(() => {
          this.$message.success('新增分类成功')
          this.getList()
          this.closeDl()
        })
      }
    }
  }
}
</script>
