<template>
  <div class="commisision_style">
    <el-dialog
      title="添加执行人"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="700px"
      @close="close"
    >
      <div class="add_style">
        <div class="add_left">
          <el-select
            v-model="executorUserIds"
            multiple
            filterable
            remote
            placeholder="支持搜索"
            :remote-method="remoteMethod"
            @change="changeExecutorUser"
          >
            <el-option
              v-for="item in commissionData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div class="botton_style">
            <el-button type="primary" @click="submitData">{{ `确定(${executorUserIds.length}/${list.length})` }}</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </div>
        <div class="add_right">
          <h2>员工列表</h2>
          <el-checkbox-group
            v-for="item in list"
            :key="item.value"
            v-model="checkList"
            @change="changeCheckbox"
          >
            <el-checkbox :label="item.label" />
          </el-checkbox-group>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Commisision',
  props: {
    commisisionFlag: { type: Boolean },
    states: { type: Array, default: () => [] },
    list: { type: Array, default: () => [] },
    executorUser: { type: Array, default: () => [] }
  },
  data() {
    return {
      visible: this.commisisionFlag,
      checkList: this.executorUser,
      executorUserIds: this.executorUser,
      commissionData: []
    }
  },
  watch: {
    commisisionFlag(newVal) {
      this.visible = newVal
    },
    // 替换掉不同姓名查询上一个姓名展示问题
    'executorUserIds': {
      deep: true,
      handler: function(val, valOld) {
      if (val !== valOld) {
        this.list.map(item => {
          if (val.includes(item.value)) {
            this.executorUserIds.push(item.label)
            const index = this.executorUserIds.findIndex(text => text === item.value)
            this.executorUserIds.splice(index, 1)
          }
        })
      }
     }
    }
  },
  methods: {
    //   确定选择待办人
    submitData() {
      this.$emit('changeUserid', this.executorUserIds)
      this.$emit('openList', false)
    },
    //   关闭弹框
    close() {
      this.$emit('openList', false)
    },
    // 远程搜索的框 query 搜索的内容
    remoteMethod(query) {
      if (query !== '') {
        setTimeout(() => {
          this.commissionData = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.commissionData = []
      }
    },
    // 多选框选中的时候改变输入框的tab人员标签
  changeCheckbox(val) {
    this.executorUserIds = val
  },
  // 远程搜索框选中或删除改变右边的多选框
  changeExecutorUser(val) {
    this.checkList = val
  }
  }
}
</script>
<style lang='scss' scoped>
.commisision_style {
  /deep/.el-dialog__body {
    padding: 0;
  }
  .add_style {
    width: 100%;
    height: 500px;
    display: flex;
    grid: 50% 100%/1fr 1fr;
    .add_left {
      width: 50%;
      border-right: 1px solid #ddd;
      position: relative;
      .el-select {
        width: 100%;
        padding: 10px;
      }

      .botton_style {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 20px;
      }
    }
    .add_right {
      overflow: auto;
      width: 50%;
      padding: 20px;
      .el-checkbox-group {
        padding: 10px;
      }
    }
  }
}
</style>
