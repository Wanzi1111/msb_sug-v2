<template>
  <div>
    <div class="app-container title-container">
      <basics-title
        title="渠道接口设置"
        :actions="[{
          type: 'button', // 按钮
          label: '新建投诉渠道',
          click: createChannel,
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
      <!-- <basics-action :actions="act" /> -->
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_channel_getByPage"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />
      <el-dialog class="dialogForm" width="480px" :title="info.title" :visible.sync="dialogNewVisible" destroy-on-close>
        <basics-form ref="complaintForm" :key="dialogNewVisible" :loading="false" :forms="complaintForm" :actions="complaintFormAction" style="padding-bottom:20px;" @submitForm="submitForm" @changeForm="changeNewForm" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getChannelList, addChannelApi, editChannelApi } from '@/api/operate/channel'
import { getBypid } from '@/api/operate/complainNew'
import BasicsTable from '@/components/BasicsTable'
// import BasicsSearch from '@/components/BasicsSearch'
// import BasicsAction from '@/components/BasicsAction'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import { addChannelForm, addComplintChannelForm, actions as complaintFormAction } from './forms/form'
import { default as act } from './actions/actions'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
export default {
  name: 'Channel',
  components: { BasicsTable, BasicsForm },
  data() {
    return {
      table: {
        stripe: true,
        border: false
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      columns: columns,
      total: 0,
      list: [],
      act: act({ createChannel: this.createChannel }),
      actionFunction: actions({
        tableAction: this.tableAction
      }),
      query: {},
      dialogNewVisible: false,
      complaintFormAction: complaintFormAction({ cancel: this.cancel, ensure: this.ensure }),
      complaintForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      editId: '',
      row: {}
    }
  },
  computed: {
    ...mapGetters(['loadings', 'staffEnum'])
  },
  created() {
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.getList()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getList()
    // })
  },
  methods: {
    getList() {
      const { query, listQuery } = this
      const data = { ...query }
      for (const name in data) {
        !data[name] && delete data[name]
      }
      getChannelList({
        pageNum: (listQuery.page) * 1 - 1,
        pageSize: listQuery.limit,
        ...data
      }).then(res => {
        if (res.code === 0) {
          const data = res.payload || {}
          this.list = data.content || []
          this.total = (data.totalElements) * 1 || 0
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
        case 'editChannelType':
          // 编辑父问题分类
          this.editChannel(row)
          break
        case 'addComplintChannel':
          this.addComplintChannel(row)
          break
        default:
          break
      }
    },
    editChannel(row) {
      this.row = row
      // 编辑渠道分类
      this.info = {
        title: '编辑投诉来源',
        instroduct: '',
        type: 'editChannel'
      }
      // this.complaintForm = [...addQuestionForm]
      this.complaintForm = addChannelForm(true)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        const { staffEnum } = this
        this.$refs.complaintForm.recoveryForm({
          businessId: row.businessId + '',
          cpSource: row.cpSource
        })
        // this.getBypidFn(row.businessId, 'form')
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            'businessId': staffEnum.businessLine
          }
        })
        // this.$refs.complaintForm.set({
        //   type: 'disabled',
        //   data: {
        //     businessId: true
        //   }
        // })
      })
    },
    addComplintChannel(row) {
      this.row = row
      const { cpSource, businessId } = row
      this.info = {
        title: '新建投诉途径（接口调用参数配置）',
        instroduct: '',
        type: 'addComplintChannel'
      }
      this.complaintForm = addComplintChannelForm(true)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        const { staffEnum } = this

        this.$refs.complaintForm.recoveryForm({
          businessId: businessId + '',
          cpSourceType: cpSource
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            'businessId': staffEnum.businessLine
          }
        })
      })
    },
    addComplintChannelFn(val) {
      const { id, businessId } = this.row
      const data = {
        ...val,
        pid: id,
        businessId
      }
      addChannelApi(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    // submitSearch(val, state = false) {
    //   if (state) {
    //     this.setChannel([], 'channelPid')
    //     this.initSearch(val)
    //   } else {
    //     this.listQuery = {
    //       page: 1,
    //       limit: 20
    //     }
    //     this.query = val
    //     this.getList()
    //   }
    // },
    // changeSearch(val, oldVal) {
    //   // this.query = val
    //   // if (val.businessId !== oldVal.businessId && val.businessId) {
    //   //   this.setResetVal('channelPid')
    //   //   this.getBypidFn(val.businessId)
    //   // }
    // },
    createChannel() {
      this.info = {
        title: '新建投诉来源',
        instroduct: '',
        type: 'addChannel'
      }
      this.complaintForm = addChannelForm(false)
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
        case 'addChannel':
          this.addChannelFn(val)
          break
        case 'editChannel':
          this.editChannelFn(val)
          break
        case 'addComplintChannel':
          this.addComplintChannelFn(val)
          break
        default:
          break
      }
    },
    //
    // 表单变化
    changeNewForm(val, oldVal) {
      // if (val.businessId !== oldVal.businessId && val.businessId) {
      //   console.log(this.info, 'this.info')
      //   const { type } = this.info
      //   if (type !== 'editChannel') {
      //     this.setResetVal('channelPid', 'form')
      //   }
      //   this.getBypidFn(val.businessId, 'form')
      // }
    },
    // 添加问题分类接口
    addChannelFn(val) {
      const data = {
        ...val,
        pid: val.businessId
      }
      addChannelApi(data).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
        }
      })
    },
    // 编辑问题分类
    editChannelFn(val) {
      const { id } = this.row
      const data = {
        ...val,
        pid: val.businessId,
        id
      }
      editChannelApi(data).then(res => {
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
    width: 106px !important;
  }
  }
</style>
