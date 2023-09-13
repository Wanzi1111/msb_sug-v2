<!--
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:12:47
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-09 17:43:29
-->
<template>
  <div>
    <basics-table
      ref="table"
      :loading="loadings._k8s_api_complaint_api_channel_getBypid"
      :table="table"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :action-function="actions"
    />

    <el-dialog class="dialogForm" width="480px" :title="info.title" :visible.sync="dialogNewVisibleChannel" :modal-append-to-body="false">
      <!-- <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">{{ info.instroduct }}</h2> -->
      <basics-form ref="complaintForm" :key="dialogNewVisibleChannel" :loading="false" :forms="complaintForm" :actions="complaintFormAction" style="padding-bottom:20px;" @submitForm="submitForm" @changeForm="changeNewForm" />
    </el-dialog>
  </div>
</template>
<script>
import { getChannelChildrenList, editChannelApi } from '@/api/operate/channel'

import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import { addComplintChannelChildrenForm, actions as complaintFormAction } from './forms/form'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'ChildChannel',
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
      list: [],
      // forms: addComplintQuestionChildrenForm,
      dialogNewVisibleChannel: false,
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
    ...mapGetters(['loadings', 'staffEnum'])
  },
  created() {
    this.getList()
  },
  methods: {
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    tableAction(dat, row, index, name) {
      switch (name) {
        case 'editChannelType':
          this.editChannel(row)
          break
        default:
          break
      }
    },
    editChannel(row) {
      this.rowData = row
      // const { channelId } = this.row
      const { staffEnum } = this
      const rowParent = this.row
      // 编辑问题分类
      this.info = {
        title: '编辑投诉途径（接口调用参数配置）',
        instroduct: '',
        type: 'editChannel'
      }
      this.complaintForm = addComplintChannelChildrenForm(true)
      this.dialogNewVisibleChannel = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({
          businessId: rowParent.businessId + '',
          cpSourceType: rowParent.cpSource,
          cpSource: row.cpSource
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            'businessId': staffEnum.businessLine
          }
        })
      })
    },
    // 编辑问题分类
    editChannelFn(val) {
      const { id } = this.rowData
      const { businessId } = this.row
      const pid = this.row.id
      const data = {
        ...val,
        pid,
        id,
        businessId
      }
      editChannelApi(data).then(res => {
        if (res.code === 0) {
          this.getList()
          this.cancel()
          Message.success('操作成功')
        }
      })
    },
    getList() {
      const { row } = this
      const params = {
        pid: row.id
      }
      getChannelChildrenList(params).then(res => {
        const data = res.payload || []
        this.list = data
        this.total = 0 // 不分页
      })
    },
    submitForm(val) {
      const { info } = this
      const { type } = info
      switch (type) {
        case 'editChannel':
          this.editChannelFn(val)
          break
        default:
          break
      }
    },
    changeNewForm() {

    },
    cancel() {
      this.dialogNewVisibleChannel = false
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
