<template>
  <div class="assign-role">
    <div class="assign-info">
      <div class="table-list">
        <div class="table-left">
          <div class="left-actions">
            <el-input v-model="roleName" class="input" placeholder="请输入角色名称" clearable />
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
          <basics-table-sel
            ref="tableSel"
            :list="roleList"
            :columns="selColumns"
            :list-query="{}"
            :attr="{height: '400'}"
            @selection-change="handleSelectionChange"
          />
        </div>
        <div class="table-right">
          <div class="right-actions">
            <span class="role-num">已选{{ roleNum }}个角色</span>
            <el-button type="primary" @click="clearAll">全部移除</el-button>
          </div>
          <basics-table
            ref="table"
            :list="selList"
            :columns="columns"
            :list-query="{}"
            :attr="{height: '400'}"
            :table="{ emptyText: '暂无数据，请选择角色'	}"
          />
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" :loading="loadings._permissions_api_role_alloc" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>
<script>

import { getRoleList } from '@/api/unified-permissions/role'
import BasicsTable from '@/components/BasicsTable'
import BasicsTableSel from '@/components/BasicsTable'

import columns from './columns/normal-role-list'
import selColumns from './columns/sel-role-list'
import { mapGetters } from 'vuex'

export default {
  name: 'AssignRole',
  components: { BasicsTable, BasicsTableSel },
  props: {
    roleIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      roleName: '', // 角色名称
      columns: columns,
      selColumns: selColumns,
      roleList: [],
      selList: []
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    roleNum() {
      return this.selList.length
    }
  },
  created() {
    this.getRoles()
  },
  mounted() {
  },
  methods: {
    // 获取角色列表
    getRoles() {
      const params = {
        pageNum: 1,
        pageSize: 100, // 暂时不分页
        roleName: this.roleName
      }
      getRoleList(params).then(res => {
        this.roleList = res.data.list || []
        this.setRowSelection()
        console.log('结果', res)
      })
    },
    onCancel() {
      this.$emit('onCancel')
    },
    onSubmit() {
      if (this.selList.length === 0) {
        return this.$message.error('请先分配角色')
      }
      this.$emit('onSubmit', this.selList)
    },
    // 根据人员列表的角色，让对应角色行默认勾选
    setRowSelection() {
      for (const row of this.roleList) {
        if (this.roleIds.includes(row.id)) {
          this.$nextTick(() => {
            this.$refs.tableSel.getRef().toggleRowSelection(row, true)
          })
        }
      }
    },
    // 移除全部
    clearAll() {
      this.$refs.tableSel.getRef().clearSelection()
    },
    // 根据部门和角色查询列表
    handleSearch() {
      this.getRoles()
    },
    // 勾选回调
    handleSelectionChange(row) {
      // 最多可选择10个角色
      console.log('勾选', row)
      if (row.length > 10) {
        return this.$message.error('最多可选择10个角色')
      }
      this.selList = row
    }
  }
}
</script>
<style lang="scss" scoped>
  .assign-role {
    .assign-info {
      // margin-top: 20px;
      padding: 0 20px;
      .table-list {
        display: flex;
        .table-left {
          flex: 1;
          margin-right: 20px;
          .left-actions {
            height: 50px;
            display: flex;
            align-items: center;
            .input {
              width: 170px;
              margin-right: 20px;
            }
          }
        }
        .table-right {
          flex: 1;
          .right-actions {
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .role-num {
              margin-right: 20px;
            }
          }

        }
      }
    }
    .btns {
      padding: 0 20px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      // height: 100px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
