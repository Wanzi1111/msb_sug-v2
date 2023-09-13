<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="loadings._operation_complaints_getComplaints" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" />
    <el-tabs v-model="activeState">
      <el-tab-pane v-for="(item, index) in stateList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._operation_complaints_getComplaints" />
    </el-tabs>
    <basics-action :actions="act" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_complaints_getComplaints"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    >
      <template slot="id" slot-scope="scope">
        <div class="columns-txt">{{ scope.row.id }}</div>
        <div class="columns-note">{{ scope.row.createTime }}</div>
      </template>
      <template slot="username" slot-scope="scope">
        <div class="columns-txt">{{ scope.row.username }}</div>
        <div class="columns-note">{{ scope.row.mobile }}</div>
        <div class="columns-note">UID: {{ scope.row.userId }}</div>
      </template>
      <template slot="userOrigin" slot-scope="scope">
        <div class="columns-txt">{{ scope.row.flowsStatusString }}</div>
        <div class="columns-note">{{ scope.row.userOrigin }}</div>
      </template>
      <template slot="complaintsStringType" slot-scope="scope">
        <div class="columns-txt">{{ scope.row.complaintsStringType }}</div>
        <div class="columns-note">{{ scope.row.content }}</div>
      </template>
    </basics-table>
    <el-dialog width="650px" title="回访记录" :visible.sync="dialogVisible">
      <div>
        <div class="complain_header">
          <span>投诉内容</span>
          <span>{{ echorecord.complaintsTime }}</span>
        </div>
        <p class="complain_body">{{ echorecord.content }}</p>
      </div>
      <basics-form v-if="complaints.operationStatus !== 2 && dialogVisible" ref="rvisitrecordForm" :key="complaints.id" :loadings="loadings" :forms="rvisitrecord" :actions="rvisitrecordAct" style="padding-bottom:20px;" @changeForm="changeForm" />
      <div v-show="echorecord">
        <p class="historyrecord">
          <span>历史记录</span>
          <span v-if="complaints.operationStatus === 2">投诉类型:{{ complaints.complaintsStringType }}</span>
          <span v-if="!!echorecord.recordDetails && complaints.operationStatus === 2 && [1,2,3].indexOf(complaints.complaintsType) !== -1">被投诉人:{{ echorecord.recordDetails[0].aimName || '无' }}</span>
          <span v-else>&emsp;</span>
        </p>
        <div ref="history_complain" class="history_complain">
          <div v-for="(item, index) in echorecord.recordDetails" :key="index" class="history_complain_con">
            <div>
              <p class="history_complain_item">
                <span>{{ item.createTime }}</span>
                <span v-if="item.userDto && item.userDto.phone">处理人：{{ item.userDto ? item.userDto.userName : '' }} {{ item.userDto ? item.userDto.phone : '' }}</span>
              </p>
              <p>{{ item.detailContent || '无' }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getComplaints, getScreenCondition, getRecord, getComplaintsNumbers, upDateComplaintsStatus, addRecord, exportComplaints } from '@/api/operate/complain'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import BasicsForm from '@/components/BasicsForm'
import { default as act } from './actions/actions'
import rvisitrecord, { actions as rvisitrecordAct } from './forms/rvisitrecord'
import columns, { actions } from './columns/list'
import searchs from './searchs/searchs'
import moment from 'moment'
import { createBlob } from '@/utils'
import { mapGetters } from 'vuex'

/* const EXPRESS_TYPE = {
  ALL: 999,
  ALL_LABEL: '全部',
  PENDING: 0,
  PENDING_LABEL: '待处理',
  PROCESSING: 1,
  PROCESSING_LABEL: '处理中',
  CLOSED: 2,
  CLOSED_LABEL: '已关闭',
  INVALID: 3,
  INVALID_LABEL: '无效投诉'
} */
const EXPRESS_TYPE = {
  ALL: 999,
  ALL_LABEL: '全部',
  PENDING: 0,
  PENDING_LABEL: '未处理',
  PROCESSING: 1,
  PROCESSING_LABEL: '跟踪中',
  CLOSED: 2,
  CLOSED_LABEL: '已解决',
  INVALID: 3,
  INVALID_LABEL: '无效投诉'
}

export default {
  name: 'OperateComplain',
  components: { BasicsTable, BasicsSearch, BasicsAction, BasicsForm },
  data() {
    const complaintsNumbers = {
      totalNumbers: '',
      lastWeekNumbers: '',
      weekNumbers: '',
      todayNumbers: ''
    }
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: actions({
        setInvalid: this.setInvalid,
        visitRecord: this.visitRecord,
        multipleAction: this.multipleAction,
        solve: this.solve
      }),
      searchs: searchs,
      total: 0,
      complaintsNumbers: {
        totalNumbers: '',
        lastWeekNumbers: '',
        weekNumbers: '',
        todayNumbers: ''
      },
      act: act({ exportDocument: this.exportDocument, complaintsNumbers: this.complaintsNumbers || complaintsNumbers, total: this.total || 0 }),
      rvisitrecord: rvisitrecord,
      respondent: [],
      rvisitrecordAct: rvisitrecordAct({ visitAction: this.visitAction }),
      dialogVisible: false,
      formrecord: {},
      list: null,
      echorecord: {},
      query: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      complaints: {},
      operationStatus: [],
      entrySource: [],
      complaintType: [],
      userFlowStatus: [],
      complaintUser: [],
      activeState: '999',
      stateList: [
        { label: EXPRESS_TYPE.ALL_LABEL, value: `${EXPRESS_TYPE.ALL}` },
        { label: EXPRESS_TYPE.PENDING_LABEL, value: `${EXPRESS_TYPE.PENDING}` },
        { label: EXPRESS_TYPE.PROCESSING_LABEL, value: `${EXPRESS_TYPE.PROCESSING}` },
        { label: EXPRESS_TYPE.CLOSED_LABEL, value: `${EXPRESS_TYPE.CLOSED}` },
        { label: EXPRESS_TYPE.INVALID_LABEL, value: `${EXPRESS_TYPE.INVALID}` }
      ]
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    activeState(val, oldVal) {
      this.actRowList = []
      if (val !== oldVal) {
        /* if (![EXPRESS_TYPE.ALL_LABEL].includes(parseInt(val))) {
          this.columns = [
            {
              type: 'selection',
              width: 40,
              align: 'center'
            },
            ...columns
          ]
        } else {
          this.columns = columns
        } */
        this.act = act({
          exportDocument: this.exportDocument,
          complaintsNumbers: this.complaintsNumbers,
          total: this.total,
          operationStatus: val
        })
        this.tableKey += 1
        this.listQuery = {
          page: 1,
          limit: 10
        }
        this.getList()
      }
    }
  },
  created() {
    // this.getList()
    this.getConfig()
    // this.getNumbers()
  },
  methods: {
    // 获取投诉各个时间段的投诉数量 getComplaintsNumbers
    getNumbers() {
      const { query } = this
      getComplaintsNumbers({ complaintUser: query.complaintUser }).then(res => {
        if (res.status === 0) {
          const total = this.total
          this.complaintsNumbers = res.data || {}
          this.act = act({ exportDocument: this.exportDocument, complaintsNumbers: this.complaintsNumbers, total: total })
        }
      })
    },
    // 获取投诉列表
    getList() {
      const { query, listQuery, activeState } = this
      const data = {
        complaintUser: query.complaintUser,
        userName: query.userName,
        userFlowStatus: query.userFlowStatus ? query.userFlowStatus.join(',') : '',
        complaintType: query.complaintType ? query.complaintType.join(',') : '',
        operationStatus: activeState !== '999' ? activeState : query.operationStatus ? query.operationStatus.join(',') : '',
        entrySource: query.entrySource ? query.entrySource.join(',') : '',
        complaintTime: query.complaintTime ? query.complaintTime.join(',') : ''
      }
      for (const name in data) {
        !data[name] && delete data[name]
      }
      getComplaints({
        pageNum: listQuery.page,
        pageCount: listQuery.limit,
        ...data
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      }).finally(() => {
        this.getNumbers()
      })
    },
    // 获取配置
    getConfig() {
      getScreenCondition().then(res => {
        const userFlow = res.data.userFlowStatus || []
        const complaint = res.data.complaintType || []
        const operation = res.data.operationStatus || []
        const entrysource = res.data.entrySource || []
        const complaintuser = res.data.complaintUser || []
        const loop = (type) => {
          const list = []
          type.map(item => {
            list.push({
              label: item.label,
              value: item.code,
              group: item.group
            })
          })
          return list
        }
        const userFlowStatus = loop(userFlow)
        const complaintType = loop(complaint)
        const operationStatus = loop(operation)
        const entrySource = loop(entrysource)
        const complaintUser = loop(complaintuser)

        this.operationStatus = operationStatus
        this.entrySource = entrySource
        this.complaintType = complaintType
        this.userFlowStatus = userFlowStatus
        this.complaintUser = complaintUser

        this.initSearch()
      })
    },
    // 默认搜索老师
    initSearch() {
      const { userFlowStatus, complaintType, entrySource, complaintUser, operationStatus } = this
      // 默认投诉用户 1对1老师 ，取对应val
      let val = ''
      for (let i = 0; i < complaintUser.length; i++) {
        if (complaintUser[i].label === '1对1老师') {
          val = complaintUser[i].value
        }
      }

      const userFilter = (arr, val) => {
        const newArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].group.indexOf(val) !== -1) {
            newArr.push(arr[i])
          }
        }
        return newArr
      }

      // 根据投诉用户取用户类型、投诉类型、投诉来源
      const userFlowStatusFilter = userFilter(userFlowStatus, val) || []
      const complaintTypeFilter = userFilter(complaintType, val) || []
      const entrySourceFilter = userFilter(entrySource, val) || []

      this.$refs.searchs.set({
        type: 'options',
        data: {
          userFlowStatus: userFlowStatusFilter,
          complaintType: complaintTypeFilter,
          entrySource: entrySourceFilter,
          operationStatus: operationStatus,
          complaintUser: complaintUser
        }
      })

      this.$refs.searchs.set({
        type: 'defaultVal',
        data: {
          complaintUser: val
        }
      })
      this.query = {
        ...this.query,
        complaintUser: val
      }
      this.getList()
    },
    // 设为无效
    setInvalid(dat, row, index) {
      this.$confirm('您是否要将当前投诉设为无效投诉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upDateComplaintsStatus({
          complaintId: row.id,
          complaintStatus: 3
        }).then(res => {
          if (res.status === 0) {
            this.getList()
          }
        })
      }).catch(e => e)
    },
    // 回访记录
    visitRecord(dat, row, index) {
      this.dialogVisible = true
      this.complaints = row
      this.$nextTick(() => {
        this.$refs.history_complain.scrollTop = 0
      })
      getRecord({
        complaintsId: row.id
      }).then(res => {
        const complaint = res.data.complaintsTypeLabel || []
        const teacherComplaints = res.data.teacherComplaintsTypeLabel || []
        const teacherCompselect = res.data.teacherComplaintsType || []
        this.respondent = res.data.userInfoModelList || []
        const lopp = (type) => {
          const list = []
          type.map(item => {
            list.push({
              label: item.label,
              value: item.code
            })
          })
          return list
        }

        const complaintType = lopp(complaint)
        const teacherComplaintsTypeLabel = lopp(teacherComplaints)
        this.echorecord = res.data

        if (row.operationStatus !== 2) {
          this.$refs.rvisitrecordForm.set({
            type: 'options',
            data: {
              complaintType: complaintType
            }
          })
          this.$refs.rvisitrecordForm.set({
            type: 'options',
            data: {
              teacherComplaintsTypeLabel: teacherComplaintsTypeLabel
            }
          })
          this.$refs.rvisitrecordForm.set({
            type: 'defaultVal',
            data: {
              teacherComplaintsTypeLabel: teacherCompselect
            }
          })
          this.$refs.rvisitrecordForm.set({
            type: 'defaultVal',
            data: { complaintType: this.echorecord.complaintsType }
          })
        }
      })

      this.formrecord = {
        complaintsId: row.id,
        userId: row.userId
      }
    },
    // 重新开启
    multipleAction(dat, row, index) {
      this.$confirm('您是否要重新开启当前投诉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upDateComplaintsStatus({
          complaintId: row.id,
          complaintStatus: 0
        }).then(res => {
          if (res.status === 0) {
            this.getList()
          }
        })
      }).catch(e => e)
    },
    // 已解决
    solve(dat, row, index) {
      upDateComplaintsStatus({
        complaintId: row.id,
        complaintStatus: 2
      }).then(res => {
        if (res.status === 0) {
          this.$message.success('咨询投诉已被解决')
          this.getList()
        }
      })
    },
    // 表单变化
    changeForm(val, oldVal) {
      // 投诉类型变化
      if (val.complaintType && val.complaintType !== oldVal.complaintType) {
        let new_respondent = {}
        new_respondent = this.respondent.find((item) => item.typeId === val.complaintType) || {}
        const userInfoMode = new_respondent.userInfoModelList || []
        const options = []
        for (let i = 0; i < userInfoMode.length; i++) {
          // console.log('userInfoMode[i]')
          // console.log(userInfoMode[i])
          // console.log(userInfoMode)
          options.push({
            label: userInfoMode[i].username,
            value: userInfoMode[i].id
          })
        }
        // options.push({
        //   label: '其他',
        //   value: 99999999
        // })
        if (options.length) {
          this.$refs.rvisitrecordForm.set({
            type: 'options',
            data: {
              recordDetails: options
            }
          })
          this.$refs.rvisitrecordForm.set({
            type: 'defaultVal',
            data: {
              recordDetails: options[0].value
            }
          })
        }

        // 隐藏投诉分类
        if (val.complaintType === 3) {
          this.$refs.rvisitrecordForm.set({
            type: 'visible',
            data: { teacherComplaintsTypeLabel: true }
          })
        } else {
          this.$refs.rvisitrecordForm.set({
            type: 'visible',
            data: { teacherComplaintsTypeLabel: false }
          })
        }
      }

      // 隐藏被投诉人
      if (val.complaintType !== 1 && val.complaintType !== 2 && val.complaintType !== 3) {
        this.$refs.rvisitrecordForm.set({
          type: 'visible',
          data: { recordDetails: false }
        })
      } else {
        this.$refs.rvisitrecordForm.set({
          type: 'visible',
          data: { recordDetails: true }
        })
      }

      // 隐藏 已解决、继续跟踪
      if (val.checkbox1.length >= 1) {
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { invalid: true }
        })
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { keepon: false }
        })
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { resolved: false }
        })
      } else {
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { invalid: false }
        })
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { keepon: true }
        })
        this.$refs.rvisitrecordForm.setAction({
          type: 'visible',
          data: { resolved: true }
        })
      }
    },
    // 搜索
    submitSearch(val, state = false) {
      // 点击重置
      if (state) {
        this.initSearch()
      } else {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = val
        this.getList()
      }
    },
    // 搜索联动
    changeSearch(val, oldVal) {
      this.query = val
      if (val.complaintUser && val.complaintUser !== oldVal.complaintUser) {
        const { entrySource, complaintType, userFlowStatus } = this

        const userFilter = (arr, val) => {
          const newArr = []
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].group.indexOf(val) !== -1) {
              newArr.push(arr[i])
            }
          }
          return newArr
        }

        // 根据投诉用户取用户类型、投诉类型、投诉来源
        const userFlowStatusFilter = userFilter(userFlowStatus, val.complaintUser) || []
        const complaintTypeFilter = userFilter(complaintType, val.complaintUser) || []
        const entrySourceFilter = userFilter(entrySource, val.complaintUser) || []

        this.$refs.searchs.set({
          type: 'options',
          data: {
            userFlowStatus: userFlowStatusFilter,
            complaintType: complaintTypeFilter,
            entrySource: entrySourceFilter
          }
        })
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: {
            userFlowStatus: '',
            complaintType: '',
            entrySource: ''
          }
        })
      }
      // if (!val.complaintUser) {
      //   this.$refs.searchs.set({
      //     type: 'options',
      //     data: {
      //       userFlowStatus: [],
      //       complaintType: [],
      //       entrySource: []
      //     }
      //   })
      // }
    },
    // 导出
    exportDocument() {
      const { query } = this
      const data = {
        complaintUser: query.complaintUser,
        userName: query.userName,
        userFlowStatus: query.userFlowStatus ? query.userFlowStatus.join(',') : '',
        complaintType: query.complaintType ? query.complaintType.join(',') : '',
        operationStatus: query.operationStatus ? query.operationStatus.join(',') : '',
        entrySource: query.entrySource ? query.entrySource.join(',') : '',
        complaintTime: query.complaintTime ? query.complaintTime.join(',') : ''
      }
      exportComplaints(data).then(res => {
        createBlob(`投诉数据统计-${moment().format('YYYY-MM-DD')}.xls`, res)
      })
    },
    // 回访记录操作
    visitAction(val, type) {
      this.formrecord.complaintsType = val.complaintType
      this.formrecord.aimId = val.recordDetails
      this.formrecord.teacherComplaintsType = val.teacherComplaintsTypeLabel ? val.teacherComplaintsTypeLabel.join(',') : ''
      this.formrecord.detailContent = val.detailContent
      this.formrecord.operationStatus = type
      addRecord(this.formrecord).then(res => {
        if (res.status === 0) {
          this.getList()
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.columns-txt {
  text-align: left;
}
.columns-note {
  color: #999999;
  font-size: 12px;
  text-align: left;
}
.materielcon{
  padding: 20px 10px;
}
/deep/ .el-dialog__body{
  padding: 10px 20px!important;
}
.complain_header{
  display: flex;
  justify-content: space-between;
  color: #000000;
}
.complain_body{
  width: 100%;
  max-height:80px;
  overflow: auto;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
.historyrecord{
  display: flex;
  justify-content: space-between;
}
.history_complain{
  max-height: 250px;
  overflow: auto;
}
.history_complain_item {
  display: flex;
  span {
    flex: 1;
  }
}
.history_complain_con{
  width: 100%;
}
/deep/ .el-form-item{
  margin-bottom: 10px!important;
}
/deep/ .el-dialog__header{
  padding:10px!important;
}
/deep/ .el-dialog__body{
  padding: 10px 20px 0!important;
  font-size: 10px!important;
}
/deep/ .el-form-item--medium .el-form-item__content {
    line-height: 18px;
}
/deep/ .el-dialog{
  margin-top: 5vh!important;
}
/deep/ .el-tooltip__popper{
  max-width: 400px!important;
}
</style>
