<template>
  <div class="app-container">
    <basics-search ref="searchVersion" :loading="loadings._operation_web_version_client_getClientVersion" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_web_version_client_getClientVersion"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <el-dialog
      title="添加版本"
      :visible.sync="dialogVisible"
      width="480px"
      :before-close="closeAdd"
    >
      <basics-form :key="dialogVisible" ref="addVersion" :loading="loadings._operation_web_version_client_putClientVersion" :forms="forms" :actions="formActions" @changeForm="changeForm" @submitForm="submitForm" />
    </el-dialog>
  </div>
</template>

<script>
import { getClientVersion, getLabelDrop, getVersionDesc, putClientVersionweb } from '@/api/app-upgrade/version'
import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions as act } from './columns/list'
import searchs from './searchs/searchs'
import actions from './actions/list'
import forms, { actions as formAct } from './forms/list'
import { mapGetters } from 'vuex'

export default {
  name: 'Version',
  components: { BasicsTable, BasicsAction, BasicsSearch, BasicsForm },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: act({}),
      actions: actions({ create: this.create }),
      searchs: searchs,
      forms: forms,
      formActions: formAct({ quit: this.closeAdd }),
      list: null,
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false,
      clientDrop: [],
      upgradeTypeDrop: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getLabel()
    this.getList()
  },
  methods: {
    // 获取客户端和升级类型
    getLabel() {
      getLabelDrop().then(res => {
        const data = res.data || {}
        const clientDrop = (data.clientDrop || []).map(item => {
          return {
            label: item.value,
            value: item.label
          }
        })
        const upgradeTypeDrop = (data.upgradeTypeDrop || []).map(item => {
          return {
            label: item.value,
            value: item.label
          }
        })
        this.clientDrop = clientDrop
        this.upgradeTypeDrop = upgradeTypeDrop
        this.$refs.searchVersion.set({
          type: 'options',
          data: {
            clientTypeId: clientDrop,
            upgradeTypeId: upgradeTypeDrop
          }
        })
      })
    },
    // 根据客户端和升级类型获取版本号
    getVersion(clientTypeId, upgradeTypeId) {
      getVersionDesc({ clientTypeId: clientTypeId, upgradeTypeId: upgradeTypeId }).then(res => {
        const data = res.data || []
        const version = []
        data.map(item => {
          version.push({
            label: `${item.versiondesc},VersionCode:${item.versionCode[item.versionCode.length - 1]}`,
            value: `${item.versiondesc},${item.versionCode[item.versionCode.length - 1]}`
          })
        })
        this.$refs.addVersion.set({
          type: 'options',
          data: { version: version }
        })
        this.$refs.addVersion.set({
          type: 'defaultVal',
          data: { version: '' },
          validateField: false
        })
      })
    },
    // 搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.query = val
      this.getList()
    },
    // 获取列表
    getList() {
      const { query, listQuery } = this
      getClientVersion({
        ...query,
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // add version
    create() {
      this.dialogVisible = true
      this.$nextTick(() => {
        const { clientDrop, upgradeTypeDrop } = this
        this.$refs.addVersion.set({
          type: 'options',
          data: {
            clientTypeId: clientDrop,
            upgradeTypeId: upgradeTypeDrop
          }
        })
      })
    },
    // 关闭添加
    closeAdd() {
      this.dialogVisible = false
    },
    // 联动下拉框
    changeForm(val, oldVal) {
      if (val.clientTypeId && val.upgradeTypeId && (val.clientTypeId !== oldVal.clientTypeId || val.upgradeTypeId !== oldVal.upgradeTypeId)) {
        this.getVersion(val.clientTypeId, val.upgradeTypeId)
      }
    },
    // 保存版本
    submitForm(val) {
      const data = {
        clientTypeId: val.clientTypeId,
        upgradeTypeId: val.upgradeTypeId,
        versionDesc: val.version.split(',')[0],
        versionCode: val.version.split(',')[1]
      }
      putClientVersionweb(data).then(() => {
        this.closeAdd()
        this.$message.success('添加版本成功')
        this.getList()
      })
    }
  }
}
</script>

