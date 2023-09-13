<template>
  <div class="right-content">
    <div class="title">
      {{ title }}
    </div>
    <div class="shipment">
      <basics-search ref="searchUser" :loading="loadings._permissions_api_user_list" class="basic-search" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" />
      <basics-table
        ref="table"
        class="basic-table"
        :table="table"
        :loading="loadings._permissions_api_user_list"
        :list="tableList"
        :get-list="getUsers"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />
    </div>
    <el-dialog
      class="assign-dialog"
      title="分配角色"
      :visible.sync="dialogRoleVisible"
      width="960px"
      :before-close="closeModal"
    >
      <!-- destroy-on-close -->
      <assign-role :key="dialogRoleVisible" :role-ids="roleIds" @onCancel="onCancel" @onSubmit="onSubmit" />
    </el-dialog>
    <el-dialog
      title="开通后台账号"
      :visible.sync="dialogAccountVisible"
      width="480px"
      :before-close="closeAccountDialog"
    >
      <basics-form :key="id" ref="createAccount" :loading="loadings._permissions_api_user_pwd_mod" :forms="forms" :actions="formActions" @submitForm="submitForm" />
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, editUser, allotRole } from '@/api/unified-permissions/user'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import AssignRole from './AssignRole'
import BasicsForm from '@/components/BasicsForm'

import searchs from './searchs/searchs'
import columns, { actions as act } from './columns/list'
import forms, { actions as formAct } from './forms/list'
import { mapGetters } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    BasicsSearch,
    BasicsTable,
    BasicsForm,
    AssignRole
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orgId: undefined, // 部门ID
      id: '', // 当前员工id
      name: '', // 员工姓名
      table: { stripe: true },
      tableList: [],
      columns: columns,
      actionFunction: act({ handleAssignRole: this.handleAssignRole, handleCreateAccount: this.handleCreateAccount }),
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      searchs: searchs,
      dialogRoleVisible: false,
      forms: forms,
      formActions: formAct({ quit: this.closeAccountDialog }),
      dialogAccountVisible: false,
      roleIds: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getUsers()
  },
  mounted() {

  },
  methods: {
    // 更新orgId
    changeOrgId(id) {
      this.orgId = id
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.getUsers()
    },
    // 获取用户列表
    getUsers() {
      const { listQuery: { page, limit }} = this
      const params = {
        pageNum: page,
        pageSize: limit,
        orgId: this.orgId,
        name: this.name
      }
      getUserList(params).then(res => {
        this.tableList = res.data.list || []
        this.total = res.data.total || 0
        // console.log('结果', res)
      })
    },
    // 搜索
    submitSearch(data) {
      this.name = data.name
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.getUsers()
    },
    // 监听输入框
    changeSearch(data) {
      this.name = data.name
    },
    // 分配角色
    handleAssignRole(dat, row) {
      this.id = row.id
      this.roleIds = row.roleId || []
      this.dialogRoleVisible = true
    },
    // 开通账号
    handleCreateAccount(dat, row) {
      this.dialogAccountVisible = true
      console.log('开通账号', row)
      this.$nextTick(() => {
        this.$refs.createAccount.recoveryForm(row, false)
      })
    },
    // 关闭弹窗
    closeModal() {
      this.dialogRoleVisible = false
    },
    closeAccountDialog() {
      this.dialogAccountVisible = false
    },
    submitForm(data) {
      const { id, password } = data
      // 编辑用户接口
      editUser({
        id, password
      }).then(res => {
        console.log('结果', res)
        this.$message.success('开通账号成功')
        this.getUsers()
      })
      this.dialogAccountVisible = false
    },
    onCancel() {
      this.closeModal()
    },
    onSubmit(list) {
      console.log('分配的角色', list.map(item => item.roleName).join(','))
      const roleIds = list.map(item => item.roleId)
      // const groupIds = list.map(item => item.groupId)
      // 分配角色接口
      allotRole({
        id: this.id,
        roleIds
        // groupIds
      }).then(res => {
        this.getUsers()
        this.closeModal()
        this.$message.success('分配角色成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .right-content {
    width: 75%;
    min-height: calc(100vh - 240px);
    border-right: 1px solid #f1f1f1;
    .title {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      background-color: #fff;
      color: #606266;
    }
    .shipment {
      margin-top: 2px;
      padding: 20px 0 0 20px;
      background-color: #fff;
      height: 100%;
      .basic-search {
        margin-right: 20px;
      }
      .basic-table {
        margin-right: 20px;
        /deep/ .el-table__row {
            td:not(.is-hidden):last-child{
              border-left: solid 1px #dfe6ec;
            }
        }
        /deep/ th:not(.is-hidden):last-child{
            border-left: solid 1px #dfe6ec;
          }
      }
    }
    .assign-dialog {
      /deep/ .el-dialog__body {
        padding: 20px 0;
      }
    }
  }
</style>
