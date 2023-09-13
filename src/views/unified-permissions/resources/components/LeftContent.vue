<template>
  <div class="left-content">
    <div class="title">
      {{ title }}
      <!-- <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="addSystem">
        新增
      </el-button> -->
    </div>
    <div class="shipment">
      <div v-for="(item, index) in sysList" :key="item.id" class="shipment-item" :class="{active: item.id === currentSysId}" @click="changeSys(item, index)">
        <span>{{ item.name }}</span>
        <el-button class="btn-edit" type="success" icon="el-icon-edit" circle size="mini" @click.stop="editSystem(item)" />
      </div>
    </div>
    <el-dialog
      :title="actionType === 'add' ? '新增业务系统':'编辑业务系统'"
      :visible.sync="dialogSysVisable"
      width="480px"
      :before-close="closeSysDialog"
    >
      <basics-form :key="dialogSysVisable" ref="sysForm" :loading="sysLoading" :forms="forms" :actions="formActions" @submitForm="submitSysForm" />
    </el-dialog>
  </div>
</template>
<script>
import { createSystem, updateSystem } from '@/api/unified-permissions/resources'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions as formAct } from './forms/system-list'
import { mapGetters } from 'vuex'

export default {
  name: 'LeftContent',
  components: {
    BasicsForm
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    sysList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogSysVisable: false,
      actionType: 'add',
      forms: forms,
      formActions: formAct({ closeSysDialog: this.closeSysDialog }),
      currentSysId: 1
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    sysLoading() {
      return this.loadings._permissions_api_res_sys_add || this.loadings._permissions_api_res_sys_mod
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    addSystem() {
      this.actionType = 'add'
      this.dialogSysVisable = true
    },
    // 切换系统
    changeSys(item, index) {
      this.currentSysId = item.id
      this.$emit('changeSysId', this.currentSysId, index)
    },
    editSystem(item) {
      this.actionType = 'edit'
      this.dialogSysVisable = true
      this.$nextTick(() => {
        this.$refs.sysForm.recoveryForm(item, false)
      })
    },
    // 关闭弹窗 -业务系统
    closeSysDialog() {
      this.dialogSysVisable = false
    },
    submitSysForm(res) {
      const { id, name, url } = res
      if (this.actionType === 'add') {
        // 调用添加系统接口
        createSystem({
          name,
          url
        }).then(res => {
          this.$message.success('系统添加成功')
          this.$emit('getList')
          this.dialogSysVisable = false
        })
      } else {
        // 调用编辑系统接口
        updateSystem({
          id,
          name,
          url
        }).then(res => {
          this.$message.success('系统修改成功')
          this.$emit('getList')
          this.dialogSysVisable = false
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .left-content {
    width: 25%;
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
      .shipment-item {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.active {
          color: #13ce66;
          cursor: pointer;
        }
        &:hover {
          color: #13ce66;
          cursor: pointer;
        }
        .btn-edit {
          margin-right: 20px;
        }
      }
    }
  }
</style>
