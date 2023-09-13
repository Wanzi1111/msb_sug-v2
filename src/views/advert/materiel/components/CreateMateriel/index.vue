<template>
  <div>
    <h3>请输入物料尺寸</h3>
    <!-- <basics-form ref="form" :forms="forms" :actions="actions" @submitForm="submitForm" @changeForm="changeForm" /> -->
    <basics-form ref="form" :forms="forms" :actions="actions" @submitForm="submitForm" />
  </div>
</template>

<script>
import BasicsForm from '@/components/BasicsForm'
import forms, { actions as formAct } from './forms/index'
import { addResourceSize } from '@/api/advert/materiel'
export default {
  name: 'CreateMateriel',
  components: { BasicsForm },
  props: {
    cancel: {
      default: () => {},
      type: Function
    },
    getSize: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {
      forms: forms,
      form: {},
      actions: formAct({ cancel: this.cancel, ensure: this.ensure })
    }
  },
  methods: {
    // 确认提交尺寸
    ensure() {
      this.$refs.form.defaultAction('submit')
    },
    submitForm(val) {
      this.$confirm('确认添加？').then(() => {
        addResourceSize(val).then(() => {
          this.cancel()
          this.getSize()
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        })
      }).catch()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
