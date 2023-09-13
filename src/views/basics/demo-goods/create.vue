<template>
  <div>

    <div class="title-container">
      <basics-title title="新增商品" line>可以创建各种类型的商品</basics-title>
    </div>

    <div class="app-container">

      <basics-form ref="form" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />

    </div>
  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/create'
export default {
  name: 'BasicsDemoGoodsCreate',
  components: { BasicsTitle, BasicsForm },
  data() {
    return {
      forms: forms,
      actions: actions({ goTo: this.goTo }),
      dialogVisible: false
    }
  },
  created() {
    // this.$nextTick(() => {
    //   this.$refs.form.recoveryForm({
    //     input: 18
    //   }, false)
    // })
  },
  mounted() {
    this.$refs.form.recoveryForm({
      input: 999
    }, false)
  },
  methods: {
    changeForm(val, oldVal) {
      console.log(val, oldVal)
    },
    submitForm(val) {
      console.log(val)
    },
    goTo(dat) {
      console.log(dat)
    }
  }
}
</script>

