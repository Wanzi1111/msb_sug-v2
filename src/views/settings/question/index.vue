<template>
  <div>
    <div class="app-container title-container">
      <basics-title
        title="投诉问题设置"
        line
        :actions="[{
          type: 'button', // 按钮
          label: '新建问题类型',
          click: createQuestion,
          attr: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-plus',
            permission: ['admin']
          }
        }]"
      />
    </div>
    <div class="app-container">
      <!-- <basics-search ref="searchs" :loading="loadings._k8s_api_complaint_api_problem_getByPage" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" /> -->
      <el-tabs v-model="activeState">
        <el-tab-pane v-for="(item, index) in channelTypeList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._k8s_api_complaint_api_problem_getByPage" />
      </el-tabs>
      <!-- <basics-action :actions="act" /> -->
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_problem_getByPage"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />

      <el-dialog class="dialogForm" width="480px" :title="info.title" :visible.sync="dialogNewVisible">
        <!-- <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">{{ info.instroduct }}</h2> -->
        <basics-form ref="complaintForm" :key="dialogNewVisible" :loading="false" :forms="complaintForm" :actions="complaintFormAction" style="padding-bottom:20px;" @submitForm="submitForm" @changeForm="changeNewForm" />
      </el-dialog>
    </div>
  </div>

</template>
<script>
import { getQuestionList, addProblem, editProblem, enableProblem, moveProblem } from '@/api/operate/question'
import { getBypid } from '@/api/operate/complainNew'
import BasicsTable from '@/components/BasicsTable'
// import BasicsSearch from '@/components/BasicsSearch'
// import BasicsAction from '@/components/BasicsAction'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import { addQuestionForm, addComplintQuestionForm, actions as complaintFormAction } from './forms/form'

import searchs from './searchs/index'

import { default as act } from './actions/actions'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { TabListOne } from './config'

// 1 addQuestion 新建问题, 2 editQuestion, 3 addComplaintQuestion 4 editComplaintQuestion

export default {
  name: 'Question',
  components: { BasicsTable, BasicsForm },
  data() {
    return {
      table: {
        stripe: false,
        border: false
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      columns: columns,
      total: 0,
      list: null,
      searchs: searchs,
      act: act({ createQuestion: this.createQuestion }),
      actionFunction: actions({
        tableAction: this.tableAction
      }),
      query: {
        channelPid: '1011'
      },
      dialogNewVisible: false,
      complaintFormAction: complaintFormAction({ cancel: this.cancel, ensure: this.ensure }),
      complaintForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      editId: '',
      row: {},
      activeState: '1011',
      channelTypeList: TabListOne
    }
  },
  computed: {
    ...mapGetters(['loadings', 'staffEnum'])
  },
  watch: {
    // staffEnum: {
    //   handler: function(val, oldVal) {
    //     this.$refs.searchs.set({
    //       type: 'options',
    //       data: {
    //         businessId: val.businessLine
    //         // channelPid: val.sources
    //         // channelId: val.channels,
    //         // problemId: val.cpTypes
    //       }
    //     })
    //   },
    //   deep: true
    // },
    activeState(val, oldVal) {
      this.actRowList = []
      if (val !== oldVal) {
        const { query } = this
        // this.tableKey += 1
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = {
          ...query,
          channelPid: val
        }
        this.getList()
      }
    }
  },
  created() {
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.getList()
    // this.getNumbers()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getList()
    // })
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
    getList() {
      const { query, listQuery } = this
      const data = { ...query }
      for (const name in data) {
        !data[name] && delete data[name]
      }
      getQuestionList({
        pageNum: (listQuery.page) * 1 - 1,
        pageSize: listQuery.limit,
        ...data
      }).then(res => {
        if (res.code === 0) {
          const data = res.payload || {}
          this.list = data.data || []
          this.total = (data.total) * 1 || 0
        }
      })
    },
    // 默认搜索
    initSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.query = val
      this.getList()
    },
    tableAction(dat, row, index, name) {
      switch (name) {
        case 'editQuestionType':
          // 编辑父问题分类
          this.editQuestion(row)
          break
        case 'setStatus':
          this.setStatusFn(row)
          break
        case 'addComplintQuestion':
          this.addComplintQuestion(row)
          break
        case 'setUp':
          this.moveProblemFn(row, 0)
          break
        case 'setDown':
          this.moveProblemFn(row, 1)
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
      this.editId = row.id
      // 编辑问题分类
      this.info = {
        title: '编辑问题类型',
        instroduct: '',
        type: 'editQuestion'
      }
      // this.complaintForm = [...addQuestionForm]
      this.complaintForm = addQuestionForm(true)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        const { staffEnum } = this
        this.$refs.complaintForm.recoveryForm({
          businessId: row.businessId + '',
          channelPid: row.channelId,
          problemIdNew: row.problemIdNew,
          cpType: row.cpType,
          cpProblemRemark: row.cpProblemRemark
        })
        // this.getBypidFn(row.businessId, 'form')
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            'businessId': staffEnum.businessLine
          }
        })
      })
    },
    addComplintQuestion(row) {
      this.row = row
      const { channelId: channelPid, cpProblemRemark } = row
      this.info = {
        title: '新建投诉问题',
        instroduct: '',
        type: 'addComplintQuestion'
      }
      this.complaintForm = addComplintQuestionForm
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({
          channelPid,
          cpProblemRemark
        })
      })
    },
    addComplintQuestionFn(val) {
      const { problemIdNew, businessId } = this.row
      const data = {
        ...val,
        pid: problemIdNew,
        businessId
      }
      addProblem(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    submitSearch(val, state = false) {
      if (state) {
        this.setChannel([], 'channelPid')
        this.initSearch(val)
      } else {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = val
        this.getList()
      }
    },
    changeSearch(val, oldVal) {
      // this.query = val
      // if (val.businessId !== oldVal.businessId && val.businessId) {
      //   this.setResetVal('channelPid')
      //   this.getBypidFn(val.businessId)
      // }
    },
    createQuestion() {
      this.info = {
        title: '新建问题类型',
        instroduct: '',
        type: 'addQuestion'
      }
      this.complaintForm = addQuestionForm(false)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        const { staffEnum } = this
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            'businessId': staffEnum.businessLine
          }
        })
      })
    },
    // 投诉来源
    getBypidFn(val, type) {
      getBypid({ pid: val }).then(res => {
        this.setChannel(res.payload, 'channelPid', type)
      })
    },
    // 设置投诉来源
    setChannel(val, key, type) {
      this.$nextTick(() => {
        if (type !== 'form') {
          // 重置后投诉来源下拉框数据消失，所以注释掉，有问题再改
          // this.$refs.searchs.set({
          //   type: 'options',
          //   data: {
          //     [key]: this.tranFormData(val)
          //   }
          // })
        }
        if (type === 'form') {
          this.$refs.complaintForm.set({
            type: 'options',
            data: {
              [key]: this.tranFormData(val)
            }
          })
        }
      })
    },
    // 转化数据
    tranFormData(data) {
      return data.map(item => {
        return {
          label: item.cpSource || item.cpType,
          value: item.id
        }
      })
    },
    // 清空下拉框的值
    setResetVal(key, type) {
      if (type === 'form') {
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            [key]: undefined
          }
        })
      } else {
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: {
            [key]: undefined
          }
        })
      }
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    cancel() {
      this.dialogNewVisible = false
      this.complaintForm = []
      this.editId = ''
      this.row = {}
      this.info = {
        title: '',
        instroduct: '',
        type: ''
      }
    },
    // 1 addQuestion 新建问题, 2 editQuestion, 3 addComplaintQuestion 4 editComplaintQuestion
    // 提交表单
    submitForm(val) {
      const { info } = this
      const { type } = info
      switch (type) {
        case 'addQuestion':
          this.addQuestionFn(val)
          break
        case 'editQuestion':
          this.editQuestionFn(val)
          break
        case 'addComplintQuestion':
          this.addComplintQuestionFn(val)
          break
        default:
          break
      }
    },
    //
    // 表单变化
    changeNewForm(val, oldVal) {
      if (val.businessId !== oldVal.businessId && val.businessId) {
        const { type } = this.info
        if (type !== 'editQuestion') {
          this.setResetVal('channelPid', 'form')
        }
        this.getBypidFn(val.businessId, 'form')
      }
    },
    // 添加问题分类接口
    addQuestionFn(val) {
      const data = {
        ...val,
        pid: 0
      }
      addProblem(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    // 编辑问题分类
    editQuestionFn(val) {
      const { editId: id } = this
      const data = {
        ...val,
        pid: 0,
        id
      }
      editProblem(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .dialogForm{
    .el-form-item__label{
    width: 96px !important;
  }
  }
</style>
