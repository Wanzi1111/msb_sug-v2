<template>
  <div class="right-content">
    <div class="title">
      {{ title }}
      <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="addMenu">
        新增菜单
      </el-button>
    </div>
    <div class="shipment">
      <basics-table
        ref="table"
        class="basic-table"
        :table="table"
        :loading="loadings._permissions_api_res_sys_list"
        :list="menuList"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />
    </div>
    <el-dialog
      :title="actionType === 'add' ? '新增菜单':'编辑菜单'"
      :visible.sync="dialogMenuViable"
      width="480px"
      :before-close="closeMenuDialog"
    >
      <basics-form :key="dialogMenuViable" ref="menuForm" :loading="menuLoading" :forms="forms" :actions="formActions" @changeForm="changeMenuForm" @submitForm="submitMenuForm" />
    </el-dialog>
  </div>
</template>
<script>
import { createMenu, updateMenu, getMenuList } from '@/api/unified-permissions/resources'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'

import columns, { actions as act } from './columns/list'
import forms, { actions as formAct } from './forms/menu-list'
import { mapGetters } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    BasicsTable,
    BasicsForm
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line
    currentSysId: [Number, String], 
    menuList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      systemId: undefined,
      table: {
        stripe: true,
        rowKey: 'id',
        defaultExpandAll: false,
        treeProps: { children: 'children', hasChildren: 'hasChildren' }
      },
      tableList: [],
      columns: columns,
      actionFunction: act({ handleMenuEdit: this.handleMenuEdit }),
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogMenuViable: false,
      actionType: 'add',
      forms: forms,
      formActions: formAct({ closeMenuDialog: this.closeMenuDialog }),
      menuOptions: []
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    menuLoading() {
      return this.loadings._permissions_api_res_menu_add || this.loadings._permissions_api_res_menu_mod
    }
  },
  watch: {
    currentSysId(val) {
      this.systemId = val
    }
  },
  created() {
    // this.getList()根据接口暂时废弃
  },
  mounted() {

  },
  methods: {
    setDisable(list, id) {
      for (const item of list) {
        if (item.id === id) {
          item.disabled = true
        }
        if (item.children && item.children.length > 0) {
          this.setDisable(item.children, id)
        }
      }
    },
    deepClone(variable) {
      let value
      if (this.getType(variable) === 'object') {
        value = {}
        for (var key in variable) {
          value[key] = this.deepClone(variable[key])
        }
        return value
      }
      if (this.getType(variable) === 'array') {
        value = []
        for (var i = 0, len = variable.length; i < len; i++) {
          value[i] = this.deepClone(variable[i])
          if (value[i].children && value[i].children.length === 0) {
            delete value[i].children
          }
        }
        return value
      }
      return variable
    },
    getType(val) {
      return Object.prototype.toString.call(val).split(/\[object\s(.*)]/)[1].toLowerCase()
    },
    configMenu(id) {
      this.$nextTick(() => {
        const menuList = this.deepClone(this.menuList)
        // const menuList = JSON.parse(JSON.stringify(this.menuList))
        if (id) { // 编辑菜单时，禁止父级菜单中点自己
          this.setDisable(menuList, id)
        }
        this.$refs.menuForm.set({
          type: 'options',
          data: {
            // parentMenu: this.menuOptions
            parentMenu: menuList
          }
        })
      })
    },
    // 新增菜单
    addMenu() {
      this.actionType = 'add'
      this.dialogMenuViable = true
      this.configMenu()
    },
    // 获取列表
    getList() {
      getMenuList({
        systemId: this.systemId
      }).then(res => {
        // this.tableList = res
        console.log('结果', res)
      })
    },
    // 编辑 -菜单
    handleMenuEdit(dat, row) {
      console.log('编辑', dat, row)
      this.actionType = 'edit'
      this.dialogMenuViable = true
      this.$nextTick(() => {
        row.parentMenu = row.parentId
        this.$refs.menuForm.recoveryForm(row, false)
        this.configMenu(row.id)
      })
    },
    // 关闭弹窗 -菜单
    closeMenuDialog() {
      this.dialogMenuViable = false
    },
    changeMenuForm(val, oldVal) {
      if (val.clientTypeId && val.upgradeTypeId && (val.clientTypeId !== oldVal.clientTypeId || val.upgradeTypeId !== oldVal.upgradeTypeId)) {
        console.log(val.clientTypeId, val.upgradeTypeId)
      }
    },
    submitMenuForm(res) {
      console.log('保存菜单', res)
      const { id, name, type, url, parentMenu, level } = res
      let parentId = 0
      let levelNum = 1
      if (parentMenu) {
        if (Array.isArray(parentMenu)) {
          parentId = parentMenu.slice(-1)[0] || 0
          levelNum = parentMenu.length + 1
        } else {
          parentId = parentMenu
          levelNum = level
        }
      }
      if (this.actionType === 'add') {
        // 调用添加菜单接口
        createMenu({
          name,
          type,
          url: url.replace(/^\s+|\s+$/g, ''),
          parentId,
          level: levelNum,
          systemId: this.systemId
        }).then(res => {
          this.$message.success('菜单添加成功')
          this.$emit('updateMenuList')
          this.dialogMenuViable = false
        })
      } else {
        // 调用编辑菜单接口
        updateMenu({
          id,
          name,
          type,
          url: url.replace(/^\s+|\s+$/g, ''),
          parentId,
          level: levelNum,
          systemId: this.systemId
        }).then(res => {
          this.$message.success('菜单修改成功')
          this.$emit('updateMenuList')
          this.dialogMenuViable = false
        })
      }
    },
    changeSysId(id) {
      // this.getList() 根据接口暂时废弃
      this.systemId = id
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-add {
        height: 28px;
        margin-right: 10px;
      }
    }
    .shipment {
      margin-top: 2px;
      padding: 20px 0 0 20px;
      background-color: #fff;
      height: 100%;
      .basic-table {
        margin-right: 20px;
      }
    }
    .assign-dialog {
      /deep/ .el-dialog__body {
        padding: 20px 0;
      }
    }
  }
</style>
