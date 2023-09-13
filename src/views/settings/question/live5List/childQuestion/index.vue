<!--
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:12:47
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:25:13
-->
<template>
  <div>
    <basics-table
      ref="table"
      :loading="loadings._k8s_api_complaint_api_problem_getBypid"
      :table="table"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :action-function="actions"
    />

    <el-dialog width="480px" :title="info.title" :visible.sync="dialogNewVisible" :modal-append-to-body="false">
      <!-- <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">{{ info.instroduct }}</h2> -->
      <basics-form ref="complaintForm" :key="dialogNewVisible" :loading="false" :forms="complaintForm" :actions="complaintFormAction" style="padding-bottom:20px;" @submitForm="submitForm" @changeForm="changeNewForm" />
    </el-dialog>
  </div>
</template>
<script>
import { getQuestionChildrenList, editProblem, enableProblem, moveProblem, getFloorInfo } from '@/api/operate/question'

import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import { addComplintQuestionChildrenForm, actions as complaintFormAction } from './forms/form'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'ChildQuestion',
  components: { BasicsTable, BasicsForm },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      table: { stripe: true, border: true },
      columns: columns,
      actions: actions({ tableAction: this.tableAction }),
      total: 0,
      businessId: 0,
      list: [],
      // forms: addComplintQuestionChildrenForm,
      dialogNewVisible: false,
      complaintFormAction: complaintFormAction({ cancel: this.cancel, ensure: this.ensure }),
      complaintForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      rowData: {}
      // formAct:
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
  },
  methods: {
    moveProblemFn(row, upDown) {
      const params = {
        id: row.id,
        upDown
      }
      moveProblem(params).then(res => {
        if (res.code === 0) {
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    tableAction(dat, row, index, name) {
      const param = {
        problemIdNew: Number(row.problemIdNew),
        floor: 5
      }
      getFloorInfo(param).then(res => {
        this.businessId = res.payload.businessId
        this.$refs.complaintForm.recoveryForm({
          channelPid: res.payload.cpTypePid,
          cpProblemRemark: res.payload.cpTypeOne,
          cpType: res.payload.cpTypeTwo,
          ...res.payload
        })
        addComplintQuestionChildrenForm(true)
      })
      switch (name) {
        case 'editQuestionType':
          this.editQuestion(row)
          break
        case 'setStatus':
          this.setStatusFn(row)
          break
        case 'setUp':
          this.moveProblemFn(row, 0)
          break
        case 'setDown':
          this.moveProblemFn(row, 1)
          break
        case 'addComplintQuestion':
          this.addComplintQuestion(row)
          break
        default:
          break
      }
    },
    // 启用停用
    setStatusFn(row) {
      const config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        label: '提示',
        text: row.problemStatus === 0 ? '确定设为停用吗？' : '确定设为启用吗？'
      }
      // 二次弹窗
      this.$confirm(config.text, config.label, {
        confirmButtonText: config.confirmButtonText,
        cancelButtonText: config.cancelButtonText,
        type: config.type,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const { id } = row
            const problemStatus = row.problemStatus === 0 ? 1 : 0
            enableProblem({ id, problemStatus }).then(async(res) => {
              done()
              this.$message.success('操作成功')
              this.cancel()
              this.getList()
            })
          } else {
            done()
          }
        }
      }).catch(() => {})
    },
    editQuestion(row) {
      this.rowData = row
      // 编辑问题分类
      this.info = {
        title: '编辑投诉问题',
        instroduct: '',
        type: 'editQuestion'
      }
      this.complaintForm = addComplintQuestionChildrenForm(true)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({
          problemIdNew: row.problemIdNew
        })
        this.$refs.complaintForm.set({
          type: 'rules',
          data: { problemIdNew: [] }
        })
      })
    },
    // 编辑问题分类
    editQuestionFn(val) {
      const { id, pid } = this.rowData
      const data = {
        ...val,
        cpType: val.cpTypeFive,
        pid: pid,
        id,
        businessId: this.businessId
      }
      editProblem(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    getList() {
      const { row } = this
      const params = {
        pid: row.problemIdNew
      }
      getQuestionChildrenList(params).then(res => {
        const data = res.payload || []
        // const list = data.rows || []
        this.list = data
        this.total = 0 // 不分页
      })
    },
    submitForm(val) {
      this.editQuestionFn(val)
    },
    changeNewForm() {

    },
    cancel() {
      this.dialogNewVisible = false
      this.complaintForm = []
      this.rowData = {}
      this.info = {
        title: '',
        instroduct: '',
        type: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

