<template>
  <div>
    <basics-search ref="searchUpgrade" :loading="loadings._operation_web_version_upgrade_getUpgradeVersion" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_web_version_upgrade_getUpgradeVersion"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <el-dialog
      :title="isEditState ? '修改升级配置' : '发布新升级'"
      :visible.sync="dialogVisible"
      width="480px"
      :before-close="closeAdd"
    >
      <basics-form :key="dialogVisible" ref="addUpgrade" :loading="loadings._operation_web_version_upgrade_putUpgradeVersion" :forms="forms" :actions="formActions" @changeForm="changeForm" @submitForm="submitForm" />
    </el-dialog>
  </div>
</template>

<script>
import { getVersionDesc } from '@/api/app-upgrade/version'
import { editUpgradeVersion, getUpgradeVersion, putUpgradeVersion } from '@/api/app-upgrade/upgrade'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions as act } from './columns/list'
import actions from './actions/list'
import searchs from './searchs/searchs'
import forms, { actions as formAct } from './forms/list'
import { mapGetters } from 'vuex'

export default {
  name: 'Upgrade',
  components: { BasicsAction, BasicsTable, BasicsSearch, BasicsForm },
  props: {
    labelDrop: {
      type: Object,
      default: () => {}
    } // 初始化客户端和升级类型
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  data() {
    return {
      activeName: 'check',
      table: { stripe: true },
      columns: columns,
      actionFunction: act({ edit: this.edit, openCloseCheck: this.openCloseCheck }),
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
      editDat: {},
      isEditState: false, // 当前是否是修改
      // 回显的时候，版本号是异步请求回来的，我们必须先将已选中的版本号存起来，
      // 等版本号列表请求成功后，再根据这个参数是否存在进行回显
      editVersion: ''
    }
  },
  watch: {
    'labelDrop'(val, oladVal) {
      if (val.clientDrop.length) {
        this.$refs.searchUpgrade.set({
          type: 'options',
          data: {
            clientTypeId: val.clientDrop,
            upgradeTypeId: val.upgradeTypeDrop
          }
        })
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 根据客户端和升级类型获取版本号
    getVersion(clientTypeId, upgradeTypeId) {
      getVersionDesc({ clientTypeId: clientTypeId, upgradeTypeId: upgradeTypeId, enableState: 1 }).then(res => {
        const data = res.data || []
        const version = []
        data.map(item => {
          version.push({
            label: item.versiondesc,
            value: `${item.versiondesc},${item.versionCode[item.versionCode.length - 1]}`
          })
        })
        this.$refs.addUpgrade.set({
          type: 'options',
          data: { version: version }
        })
        const { editVersion } = this
        this.$refs.addUpgrade.set({
          type: 'defaultVal',
          data: { version: editVersion },
          validateField: false
        })
        this.editVersion = ''
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
    // 获取数据统计列表
    getList() {
      const { query, listQuery } = this
      getUpgradeVersion({
        ...query,
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 新建审核配置
    create(dat = {}) {
      const { isEditState } = this
      this.dialogVisible = true
      this.$nextTick(() => {
        const { labelDrop } = this
        const { clientDrop, upgradeTypeDrop } = labelDrop
        this.$refs.addUpgrade.set({
          type: 'options',
          data: {
            clientTypeId: clientDrop,
            upgradeTypeId: upgradeTypeDrop
          }
        })
        this.$refs.addUpgrade.set({
          type: 'attr',
          data: {
            clientTypeId: { disabled: false },
            upgradeTypeId: { disabled: false },
            version: { disabled: false },
            updateLevel: { disabled: false },
            pushType: { disabled: false }
          }
        })
        this.$refs.addUpgrade.setAction({
          type: 'item',
          data: { submit: { label: '添加' }}
        })
        // 回显编辑框的值
        if (isEditState) {
          // 将需要回显的版本号存起来，当版本号列表请求完成后，再进行回显
          this.editVersion = `${dat.versionDesc},${dat.versionCode}`
          this.$refs.addUpgrade.set({
            type: 'defaultVal',
            data: {
              clientTypeId: dat.clientTypeId,
              upgradeTypeId: dat.upgradeTypeId,
              // version: version,
              updateLevel: dat.updateLevel,
              pushType: dat.pushType,
              updateDesc: dat.updateDesc,
              state: dat.state
            }
          })
          this.$refs.addUpgrade.set({
            type: 'attr',
            data: {
              clientTypeId: { disabled: true },
              upgradeTypeId: { disabled: true },
              version: { disabled: true },
              updateLevel: { disabled: true },
              pushType: { disabled: true }
            }
          })
          this.$refs.addUpgrade.setAction({
            type: 'item',
            data: { submit: { label: '修改' }}
          })
        }
      })
    },
    // 关闭添加
    closeAdd() {
      this.isEditState = false
      this.dialogVisible = false
    },
    // 联动下拉框
    changeForm(val, oldVal) {
      const { isEditState } = this
      if (val.clientTypeId && val.upgradeTypeId && (val.clientTypeId !== oldVal.clientTypeId || val.upgradeTypeId !== oldVal.upgradeTypeId)) {
        this.getVersion(val.clientTypeId, val.upgradeTypeId)
      }
      if (val.updateLevel !== oldVal.updateLevel && !isEditState) {
        if (val.updateLevel === 1) {
          // 非强制升级，通知可选
          if (val.pushType === 2) {
            this.$refs.addUpgrade.set({
              type: 'defaultVal',
              data: { pushType: '' },
              validateField: false
            })
          }
          this.$refs.addUpgrade.set({
            type: 'attr',
            data: { pushType: { disabled: false }}
          })
        } else if (val.updateLevel === 2) {
          // 强制升级，必消息通知，不可选
          this.$refs.addUpgrade.set({
            type: 'defaultVal',
            data: { pushType: 2 }
          })
          this.$refs.addUpgrade.set({
            type: 'attr',
            data: { pushType: { disabled: true }}
          })
        }
      }
    },
    // 保存版本/修改版本
    submitForm(val) {
      const { isEditState } = this
      if (!isEditState) {
        // 新增
        const data = {
          updateDesc: val.updateDesc,
          updateLevel: val.updateLevel,
          pushType: val.pushType,
          state: val.state,
          versionCode: val.version.split(',')[1],
          versionDesc: val.version.split(',')[0],
          clientTypeId: val.clientTypeId,
          upgradeTypeId: val.upgradeTypeId
        }
        putUpgradeVersion(data).then(res => {
          this.closeAdd()
          this.$message.success('添加版本成功')
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      } else {
        // 修改
        const { editDat } = this
        const data = {
          appVersionId: editDat.id,
          updateDesc: val.updateDesc,
          state: val.state
        }
        editUpgradeVersion(data).then(res => {
          this.closeAdd()
          this.$message.success('修改版本配置成功')
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 打开修改
    edit(dat, row, index) {
      // 1.将当前是修改状态打开，2.回显编辑框的值
      this.editDat = row
      this.isEditState = true
      this.create(row)
    },
    // 启用禁用审核
    openCloseCheck(dat, row, index) {
      const data = {
        appVersionId: row.id,
        state: row.state ^ 1
      }
      editUpgradeVersion(data).then(() => {
        this.$message.success(row.state ? '禁用成功' : '启用成功')
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

