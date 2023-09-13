<template>
  <div class="role-form">
    <div class="info">
      <div class="title">
        角色信息
      </div>
      <el-form ref="roleForm" :model="roleForm" :rules="rules" class="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
    </div>
    <div class="choose-permission">
      <div class="title">
        选择权限
      </div>
      <div class="query-wrapper">
        <el-select v-model="roleForm.sysVal" placeholder="请选择">
          <el-option
            v-for="item in sysOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" size="medium" class="btn" @click="queryPermission">查询</el-button>
      </div>
      <div class="title">
        菜单访问权限
      </div>
      <div class="permissions">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          default-expand-all
          check-on-click-node
          node-key="id"
          :props="defaultProps"
        />
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" :loading="roleLoading" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  name: 'RoleForm',
  components: { },
  props: {
    sysOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleForm: {
        roleName: '',
        sysVal: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 15, message: '长度不得超过15个字符', trigger: 'blur' }
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      buildNodeArr: [],
      resTreeIds: []
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    roleLoading() {
      return this.loadings._permissions_api_role_add || this.loadings._permissions_api_role_mod
    }
  },
  watch: {
    'roleForm.sysVal'(val) {
      const findObj = this.sysOptions.find(item => item.id === val)
      if (findObj) {
        this.treeData = findObj.resList || []
        if (this.treeData.length > 0) { // 新的回显勾选逻辑
          // this.buildNodeArr = this.buildNode(this.treeData)
          // 获取目标节点id，解决tree组件回显时将半选置为全选的bug
          const checkedKeys = this.filterCheckedKeys(this.resTreeIds)
          this.$refs.tree.setCheckedKeys(checkedKeys)
        }
      }
    }
  },
  methods: {
    buildNode(treeNode, target = []) {
      for (const item of treeNode) {
        target.push(item)
        item.children && item.children.length > 0 && (target = [...target, ...this.buildNode(item.children)])
      }
      return target
    },
    // 暂时废弃
    filterCheckedKeysAlias(checkedKeys, buildNodeArr, target = []) {
      for (const item of checkedKeys) {
        const findObj = buildNodeArr.find(cell => cell.id === item.id)
        if (findObj) {
          if ((findObj.children || []).length === (item.children || []).length) {
            target.push(item.id)
          }
        }
        item.children && item.children.length > 0 && (target = [...target, ...this.filterCheckedKeys(item.children, buildNodeArr)])
      }
      return target
    },
    // 根据返回的数据匹配出叶子节点的id
    filterCheckedKeys(checkedKeys, target = []) {
      for (const item of checkedKeys) {
        if ((item.children || []).length === 0) {
          target.push(item.id)
        }
        item.children && item.children.length > 0 && (target = [...target, ...this.filterCheckedKeys(item.children)])
      }
      return target
    },
    queryPermission() {
      console.log('查询权限列表')
    },
    onCancel() {
      this.$emit('onCancel')
    },
    setForm(data) {
      this.roleForm = data
      // const { menuPermissions } = this.roleForm
      const { resTreeIds } = this.roleForm
      this.resTreeIds = resTreeIds
      // 旧的回显勾选逻辑
      // menuPermissions && this.$refs.tree.setCheckedKeys(menuPermissions)
    },
    onSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.roleForm.menuPermissions = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
          this.$emit('onSubmit', this.roleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
  .role-form {
    .info {
      padding: 0 20px;
      .form {
        margin-top: 20px;
        /deep/ .el-input {
          width: 200px;
        }
      }
    }
    .choose-permission {
      padding: 20px 20px 0;
      border-top: solid 1px #ddd;
      .query-wrapper {
        margin: 10px 0 20px;
        .btn {
          margin-left: 10px;
        }
      }
      .permissions {
        width: 300px;
        max-height: 310px;
        overflow: auto;
        margin-top: 10px;
        padding: 10px 6px;
        border: solid 1px #ddd;
        /deep/ .el-checkbox {
          margin-right: 8px;
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
