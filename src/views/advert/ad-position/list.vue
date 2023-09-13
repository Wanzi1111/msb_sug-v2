<template>
  <div class="app-container">
    <basics-action :actions="act" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_resource_listAdvert"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <!--新增-->
    <el-dialog
      title="新建广告位"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="closeDl"
    >
      <div class="ad-container">
        <basics-form :key="dialogVisible" ref="form" :loading="loadings._operation_resource_addAdvert" :forms="forms" :actions="formActions" @changeForm="changeForm" @submitForm="submitForm" />
        <el-button class="create-ad-type" icon="el-icon-plus" type="text" @click="createAdType">新增广告类型</el-button>
      </div>
    </el-dialog>
    <!--新增广告类型-->
    <el-dialog
      title="新建广告类型"
      :visible.sync="createAdVisible"
      width="500px"
      :before-close="closeAdDl"
    >
      <div class="ad-container">
        <basics-form :key="createAdVisible" ref="adForm" :loading="loadings._operation_resource_addAdvertConfig" :forms="adType" :actions="adActions" @submitForm="submitAdForm" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAdvert, addAdvert, actionAdvert, createAd } from '@/api/advert/ad-position'
import { materielSize } from '@/api/advert/materiel'
import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import { default as act } from './actions/list'
import forms, { actions as formActions } from './forms/list'
import adType, { adActions } from './forms/ad-type'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'AdPosition',
  components: { BasicsTable, BasicsAction, BasicsForm },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: actions({ startUsing: this.startUsing }),
      act: act({ create: this.create }),
      forms: forms,
      adType: adType,
      formActions: formActions({ quit: this.closeDl }),
      adActions: adActions({ quit: this.closeAdDl }),
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false,
      createAdVisible: false
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
  },
  methods: {
    // 筛选项联动
    changeForm(val, oldVal) {
      const { clientType } = this.$store.getters.adConfig
      const { businessType } = val
      if (businessType && businessType !== oldVal.businessType) {
        const clientTypeOption = clientType[businessType].map(v => {
          return {
            label: v,
            value: v
          }
        })
        this.$refs.form.set({
          type: 'options',
          data: {
            clientType: clientTypeOption
          }
        })
      }
    },
    // 获取广告位列表
    getList() {
      const { listQuery } = this
      listAdvert({
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 获取配置
    async getConfig(refresh = false) {
      if (!refresh) return
      await store.dispatch('app/getAdConfig')
      const { advertType } = store.getters.adConfig
      this.$refs.form.set({
        type: 'options',
        data: {
          advertType
        }
      })
    },
    // 禁用
    startUsing(dat, row, index) {
      let txt = '请确认，是否启用广告位?'
      let message = '启用成功'
      if (!row.enabled) {
        txt = '请确认，是否禁用广告位?'
        message = '禁用成功'
      }
      this.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        actionAdvert({ advertId: row.id, status: ~~!row.enabled }).then(() => {
          this.list[index].enabled = ~~!this.list[index].enabled
          this.list = [...this.list]
          this.$message.success(message)
        })
      })
    },
    // 新增广告位 - 打开
    create() {
      this.dialogVisible = true
      // this.getConfig()
    },
    // 新增广告位 - 关闭
    closeDl() {
      this.dialogVisible = false
    },
    // 新增广告位 - 提交
    submitForm(val) {
      const data = {
        ...val
      }
      addAdvert(data).then(() => {
        this.closeDl()
        this.$message.success('新增广告位成功')
        this.getList()
      })
    },
    // 新增广告类型 - 开启
    createAdType() {
      this.createAdVisible = true
      materielSize().then(res => {
        const resourceSize = []
        const data = res.data || []
        data.map(item => {
          resourceSize.push({
            label: `${item.osType}(${item.resourceSize})`,
            value: item.resourceSize
          })
        })
        // this.$nextTick(() => {
        this.$refs.adForm.set({
          type: 'options',
          data: { size: resourceSize }
        })
        // })
      })
    },
    // 新增广告类型 - 关闭
    closeAdDl() {
      this.createAdVisible = false
    },
    // 新增广告类型 - 提交
    submitAdForm(val) {
      const data = {
        type: 'advertType',
        value: `${val.type},${val.size}`
      }
      createAd(data).then(res => {
        this.closeAdDl()
        this.$message.success('新增广告类型成功')
        this.getConfig(true)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ad-container {
    padding: 20px;
  }
  .create-ad-type {
    position: absolute;
    left: 425px;
    top: 232px;
  }
</style>
