<template>
  <div class="app-container">
    <basics-search ref="searchRole" :loading="loadings._permissions_api_role_list" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._permissions_api_role_list"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <el-dialog
      class="role-dialog"
      :title="actionType === 'add' ? '添加角色': '编辑角色'"
      :visible.sync="dialogVisible"
      width="680px"
      :before-close="closeModal"
      destroy-on-close
    >
      <RoleForm ref="roleForm" :sys-options="sysOptions" @onCancel="onCancel" @onSubmit="onSubmit" />

    </el-dialog>
  </div>
</template>

<script>
import { getSystemList } from '@/api/unified-permissions/resources'
import { getRoleList, createRole, updateRole, getRole } from '@/api/unified-permissions/role'

import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import BasicsSearch from '@/components/BasicsSearch'
import columns, { actions as act } from './columns/list'
import searchs from './searchs/searchs'
import actions from './actions/list'
import RoleForm from './RoleForm'
import { mapGetters } from 'vuex'

export default {
  name: 'Role',
  components: { BasicsTable, BasicsAction, BasicsSearch, RoleForm },
  data() {
    return {
      roleName: '', // 角色名称
      table: { stripe: true },
      columns: columns,
      actionFunction: act({ handleEdit: this.handleEdit }),
      actions: actions({ create: this.create }),
      searchs: searchs,
      sysOptions: [],
      list: [],
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      actionType: 'add'
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
    this.getSystemList()
  },
  methods: {
    getSystemList() {
      getSystemList({}).then(res => {
        this.sysOptions = res.data || []
      })
    },
    // 搜索
    submitSearch(obj) {
      console.log('query', obj)
      this.roleName = obj.roleName
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = obj
      this.getList()
    },
    // 获取列表
    getList() {
      const { listQuery: { page, limit }} = this
      const params = {
        pageNum: page,
        pageSize: limit,
        roleName: this.roleName
      }
      getRoleList(params).then(res => {
        this.list = res.data.list || []
        this.total = res.data.total || 0
      })
    },
    // add Role
    create() {
      this.actionType = 'add'
      this.dialogVisible = true
    },
    // 关闭添加
    closeModal() {
      this.dialogVisible = false
    },
    onCancel() {
      this.closeModal()
    },
    onSubmit(res) {
      console.log('角色', res)
      const { roleId, menuPermissions, roleName, sysVal } = res
      if (menuPermissions.length === 0) {
        return this.$message.error('菜单访问权限不能为空')
      }
      if (this.actionType === 'add') {
        // 调用添加角色接口
        createRole({
          roleName,
          systemId: sysVal,
          resIds: menuPermissions
        }).then(res => {
          this.closeModal()
          this.getList()
          this.$message.success('角色添加成功')
        })
      } else {
        // 调用编辑角色接口
        updateRole({
          roleId,
          // groupId,
          roleName,
          systemId: sysVal,
          resIds: menuPermissions
        }).then(res => {
          this.closeModal()
          this.getList()
          this.$message.success('角色修改成功')
        })
      }
    },
    handleEdit(dat, row) {
      // 查询角色详情
      getRole({
        id: row.id
      }).then(res => {
        console.log('结果', res)
        const { data: item } = res
        this.dialogVisible = true
        this.actionType = 'edit'
        this.$nextTick(() => {
          this.$refs.roleForm.setForm({ ...row, ...item, sysVal: item.systemId, menuPermissions: item.resIds, resTreeIds: item.resTreeIds })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .role-dialog {
    /deep/ .el-dialog__body {
      padding: 20px 0;
    }
    /deep/ .el-dialog {
      margin: 0 !important;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
