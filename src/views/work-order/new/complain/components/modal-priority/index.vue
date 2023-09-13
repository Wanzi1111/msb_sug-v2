<template>
  <el-dialog title="设置优先级" :visible="vis" width="500px" destroy-on-close @close="handleFormAction">
    <div style="margin-bottom: 20px">请确定将此问题列为重点问题并置顶</div>
    <div v-loading="loadings._k8s_api_complaint_api_business_setPriority">
      <basics-form ref="formRef" :forms="form" :actions="formActions" />
    </div>
  </el-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import { setPriority } from '@/api/work-order'
import { getToken } from '@/utils/auth' // get token from cookie
import { priorityForm, formActions } from './form'

const currentStaffId = getToken('userId')
const currentStaffName = getToken('cname')

export default {
  name: 'ModalPriority',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      vis: true,
      form: priorityForm,
      formActions: formActions({ cancel: this.handleFormAction, ensure: this.handleFormAction })
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  mounted() {
    const { data: { priority }} = this
    setTimeout(() => {
      this.$refs?.formRef?.set({
        type: 'defaultVal',
        data: { priority: priority + '' }
      })
    }, 0)
  },
  methods: {
    handleFormAction(values, type) {
      if (type) {
        const { data: { complaintNo }} = this
        setPriority({ ...values, complaintNo, currentStaffId, currentStaffName }).then(res => {
          if (res?.code === 0) {
            this.$message.success('更新优先级成功～')
            this.$emit('handleModalVis', '', '', 1)
          }
        })
      } else {
        this.$emit('handleModalVis', '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  /deep/ .el-form-item__label{
    width: 92px !important;
  }
}
</style>
