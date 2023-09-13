<template>
  <div>

    <div class="title-container">
      <basics-title title="表单" line />
    </div>

    <div class="app-container">
      <div>
        <el-button @click="options">修改options</el-button>
        <el-button @click="defaultVal">修改defaultVal</el-button>
        <el-button @click="rules">修改rules</el-button>
        <el-button @click="visible">修改visible</el-button>
        <el-button @click="attr">修改attr</el-button>
        <el-button @click="item">修改item</el-button>
        <el-button @click="dialogVisible = true">Dialog Form</el-button>
      </div>

      <el-dialog width="600px" title="新增" :visible.sync="dialogVisible">
        <basics-form ref="createForm" :forms="create" :actions="createAct" @changeForm="changeForm" @submitForm="submitForm" />
      </el-dialog>

      <basics-form ref="form" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />

    </div>
  </div>
</template>
/**
 * @author: Liwei
 * @description: 表单示例页，文档阅读@/components/BasicsForm/README.md
 * @date: 2020/1/5
 */
<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/forms'
import create, { actions as createAct } from './forms/create'
export default {
  name: 'BasicsForms',
  components: { BasicsTitle, BasicsForm },
  data() {
    return {
      forms: forms,
      create: create,
      actions: actions({ goTo: this.goTo }),
      createAct: createAct({ quit: this.quit }),
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
    },
    quit() {
      this.dialogVisible = false
    },
    options() {
      this.$refs.form.set({
        type: 'options',
        data: { radio: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }
      })
    },
    defaultVal() {
      this.$refs.form.set({
        type: 'defaultVal',
        data: { radio: 'a' }
      })
    },
    rules() {
      this.$refs.form.set({
        type: 'rules',
        data: { radio: [{ required: true, message: '年龄不能为空' }] }
      })
    },
    visible() {
      this.$refs.form.set({
        type: 'visible',
        data: { radio: false }
      })
    },
    attr() {
      this.$refs.form.set({
        type: 'attr',
        data: { radio: { disabled: true }}
      })
    },
    item() {
      this.$refs.form.set({
        type: 'item',
        data: { radio: {
          prop: 'inputNumber2',
          label: '计数器2',
          type: 'inputNumber', // 计数器,
          defaultVal: 0
        }}
      })
    }
  }
}
</script>

