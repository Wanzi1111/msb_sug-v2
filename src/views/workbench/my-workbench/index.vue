<template>
  <div v-loading="loadings._k8s_api_complaint_api_v2_complaint_downloadComplaintList">
    <div>
      <div class="app-container app-complain-title">
        <div class="title-box">
          <span>我的工单</span>
          <div v-permission="['admin']">
            <el-switch :value="ifAutoComplaint" @change="handleOpenComplaintSwitch" />
            <b v-if="ifAutoComplaint">关闭后，系统不再根据投诉单来源与员工所属业务线平均分配。</b>
            <b v-else>开启后，系统会根据投诉单来源与员工所属业务线平均分配。</b>
          </div>
        </div>
        <div>
          <el-date-picker
            v-model="valueDate"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :default-time="['00:00:00', '23:59:59']"
            @change="changeDate"
          />
        </div>
      </div>
      <div class="app-container">
        <el-tabs v-model="activeTabsOneValue">
          <el-tab-pane v-for="item in TabListOne" :key="item.key" :label="item.label" :name="item.value">
            <span v-if="badgeData[item.key]" slot="label" class="tabpaneBadge">
              <el-badge :value="badgeData[item.key]">{{ item.label }}</el-badge>
            </span>
          </el-tab-pane>
        </el-tabs>

        <div class="querySelect">
          <el-input v-model="query.inputName" placeholder="请输入" class="search-item-element" size="small" @change="getList">
            <el-select slot="prepend" v-model="query.selectName" placeholder="请选择" class="el-input-select">
              <el-option label="投诉单号" value="complaintNo" />
              <el-option label="手机号" value="userMobile" />
              <el-option label="UID" value="complaintUserId" />
              <el-option label="新售后单" value="workType" />
            </el-select>
          </el-input>
        </div>

        <div class="tabs-two-box">
          <div class="custom-radio-group">
            <div v-for="v in TaskStatusList" :key="v.key" :class=" taskStatusValue !== v.value ? 'custom-radio' : 'custom-radio custom-radio-active'" @click="handleStatusClick(v.value)">
              <span class="custom-radio-value">{{ badgeData[v.key] }}</span>
              <span class="custom-radio-title">{{ v.label }}</span>
            </div>
          </div>
          <!-- <el-radio-group v-model="taskStatusValue" size="mini" class="task-status-radio">
            <el-radio v-for="item in TaskStatusList" :key="item.key" :label="item.value" border>
              <el-badge v-if="badgeData[item.key]" :value="badgeData[item.key]">{{ item.label }}</el-badge>
              <span v-else>{{ item.label }}</span>
            </el-radio>
          </el-radio-group> -->

          <el-tabs v-model="activeTabsTwoValue">
            <el-tab-pane v-for="item in TabList" :key="item.key" :label="item.label" :name="item.value">
              <span v-if="badgeData[item.key]" slot="label" class="tabpaneBadge">
                <el-badge :value="badgeData[item.key]">{{ item.label }}</el-badge>
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="action_style">
            <basics-action :actions="act" />
            <div class="action">
              <svg-icon v-for="(item,index) in flagSignColordata" :key="index" class-name="actionflag" :icon-class="item" @click.stop="clickFilter(index)" />
            </div>
            <div class="followUp">
              <el-select v-model="query.pendingType" clearable placeholder="请选择跟进方式" @change="changePendingType">
                <el-option
                  v-for="item in followUp"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <basics-table
            ref="table"
            :table="table"
            :list="list"
            :get-list="getList"
            :columns="columns"
            :total="total"
            :list-query="listQuery"
            :action-function="actionFunction"
            :loading="loadings._k8s_api_complaint_api_v2_complaint_myWorkComplaintList"
            @selection-change="handleSelectionChange"
          >
            <template slot="complaintNo" slot-scope="scope">
              <div class="complaint-list-scope-complaintNo">
                <svg-icon :icon-class="flagSignColordata[scope.row.flagSign]" style="cursor: pointer" @click.stop="clickFlag(scope)" />

                <a class="columns-txt counmns-link" @click="toDetail(scope.row)">{{ scope.row.complaintNo }}</a>
                <el-tag v-if="[1,2,3,4,5,7].includes(scope.row.cpStatus) && scope.row.priority !== 5" size="mini" :type="PriorityType[scope.row.priority] ? PriorityType[scope.row.priority].color : ''" effect="dark">
                  {{ PriorityType[scope.row.priority] ? PriorityType[scope.row.priority].name : '-' }}
                </el-tag>
              </div>
              <!-- <div class="columns-note">{{ scope.row.createTime }}</div> -->
              <div class="columns-note">{{ timeType(scope.row) }}</div>
            </template>
            <template slot="channelPName" slot-scope="scope">
              <div class="columns-txt">{{ scope.row.channelPName }}</div>
              <div class="columns-note">{{ scope.row.channelName }}</div>
            </template>
            <template slot="userName" slot-scope="scope">
              <div class="columns-txt">{{ scope.row.userName }}</div>
              <div class="columns-note">{{ scope.row.userMobile }}</div>
              <div class="columns-note">UID: {{ scope.row.userId }}</div>
            </template>
            <template slot="userType" slot-scope="scope">
              <div class="columns-txt">{{ userTypeName(scope.row.userType) }}</div>
            </template>
            <template slot="userLabel" slot-scope="scope">
              <!-- 1v1用户：1238(换行)910，1v1老师：123，小班课：12310，小熊和书法123(换行)456 -->
              <template v-if="activeTabsTwoValue === '1021' || activeTabsTwoValue === '1022'">
                <div class="columns-note">
                  {{ scope.row.userRemarkOne }}{{ scope.row.userRemarkTwo ? ' ' + scope.row.userRemarkTwo : '' }}{{ scope.row.userRemarkThree ? ' ' + scope.row.userRemarkThree : '' }}{{ scope.row.userRemarkTen ? ' ' + scope.row.userRemarkTen : '' }}
                </div>
              </template>
              <template v-else>
                <div class="columns-note">{{ scope.row.userRemarkOne }} : {{ scope.row.userRemarkTwo }} {{ scope.row.userRemarkThree }}</div>
                <div v-if="activeTabsTwoValue === '1011'" class="columns-note">{{ scope.row.userRemarkEight }} {{ scope.row.userRemarkNine }} {{ scope.row.userRemarkTen }}</div>
                <div v-if="activeTabsTwoValue === '1031' || activeTabsTwoValue === '1041' || activeTabsTwoValue === '1051'" class="columns-note">{{ scope.row.userRemarkFour }} {{ scope.row.userRemarkFive }} {{ scope.row.userRemarkSix }}</div>
              </template>
            </template>
            <template slot="problemsType" slot-scope="scope">
              <div class="columns-txt"><span>{{ scope.row.problemPName }}</span><i class="el-icon-edit" style="margin-left: 10px; cursor: pointer" @click="editTypeFn(scope.row)" /></div>
              <div class="columns-note" v-html="wordWrapping(scope.row.problemName)" />
            </template>
            <template slot="cpProblems" slot-scope="scope">
              <!-- <div class="columns-txt">{{ scope.row.problemPName }}</div> -->
              <div class="columns-note">{{ parseContent(scope.row) }}</div>
            </template>
            <template slot="currentStaffName" slot-scope="scope">
              <div class="columns-txt">{{ scope.row.currentStaffName }}</div>
              <div class="columns-note">{{ scope.row.currentStaffMobile }}</div>
            </template>
            <!-- <template slot="ctime" slot-scope="scope">
              <div v-timeout="scope.row" class="columns-txt" />
            </template> -->
          </basics-table>

          <!-- 处理投诉 || 关闭投诉 || 设为无效 弹出框-->
          <el-dialog width="450px" :title="info.title" :visible.sync="dialogNewVisible" :loading="loadings._k8s_api_complaint_api_problem_getBypids">
            <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">{{ info.instroduct }}</h2>
            <basics-form ref="complaintForm" :key="dialogNewVisible" :loading="loadings._k8s_api_complaint_api_v2_complaint_modifyProblemType" :forms="complaintForm" :actions="complaintFormAction" style="padding-bottom:20px;" class="form-item" @submitForm="submitForm" @changeForm="changeNewForm" />
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import { createBlob } from '@/utils'
import { getBypids } from '@/api/operate/question'
import { getStaffList } from '@/api/operate/staff-list'
import { getToken } from '@/utils/auth'
import { acceptComplaint, modifyProblemType, getChannelIdTree, getProblemChannelId, exportSug, updatePriority, modifyProblemAcceptBatch, invalidToUnaccecpt, modifyProblemTypeBatch, acceptComplaintBatch, invalidToUnaccecptBatch, updateFlagSign } from '@/api/operate/complainNew'
import { getMyWorkComplaintList, openDistributionStaff, myWorkNum, getUserInfoById } from '@/api/settings/assign-complaint'
import { default as act } from './actions'
import { doItForm, closeForm, invalidForm, questTypeForm, priorityForm, editStaffUserForm, accecptForm, visitForm, actions as complaintFormAction } from './forms/complaintForm'
import columns, { actions } from './columns'
import { TabListOne, TabListTwo, TaskStatusList, PriorityType } from './config'
import { Message } from 'element-ui'
import { debounce } from 'lodash'
import { downloadComplaintSync } from '@/api/work-order'
const { baseData: { Agency_follow_up_method }} = window

const init_pagaination = {
  page: 1,
  limit: 10
}
const userId = getToken('userId')
const userName = getToken('cname')

export default {
  name: 'MyWorkBench',
  data() {
    return {
      followUp: Agency_follow_up_method,
      ifAutoComplaint: false, // 是否参与自动分配
      tabApiflag: '', // 是否是点击的tab类型
      TabListOne,
      TabListTwo,
      TaskStatusList,
      taskStatusValue: '1',
      activeTabsOneValue: '0',
      activeTabsTwoValue: '0',
      badgeData: {}, // 角标统计
      table: {
        stripe: true,
        border: false
      },
      prioritySortFlag: false,
      flagSign: false,
      flagSignColordata: ['huiflag', 'redflag', 'greenflag', 'yellowflag'],
      columns,
      checkoutNum: 0,
      checkoutList: [],
      tableActionRow: {},
      act: act({
        exportDocument: this.exportDocument,
        prioritySort: this.prioritySort,
        flagSignSort: this.flagSignSort,
        prioritySortFlag: this.prioritySortFlag || false,
        flagSign: this.flagSign || false,
        tableAction: this.tableAction,
        taskStatusValue: this.taskStatusValue || false
        }),
      actionFunction: actions({
        setInvalid: this.setInvalid,
        visitRecord: this.visitRecord,
        multipleAction: this.multipleAction,
        solve: this.solve,
        tableAction: this.tableAction
      }),
      total: 0,
      list: null,
      query: {
        sort: undefined, // 搜索项
        pendingType: undefined, // 跟进方式
        inputName: '',
        selectName: 'complaintNo'
      },
      listQuery: { ...init_pagaination },
      complaints: {},
      newChildrenStateList: TabListTwo,
      dialogNewVisible: false,
      complaintFormAction: complaintFormAction({ cancel: this.cancel, ensure: this.ensure }),
      complaintForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      complaintNo: null,
      cpStatus: null,
      editTypeStatus: null,
      valueDate: [moment().subtract(1, 'month'), moment()],
      pickerOptions: {
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick(picker) {
            const day = new Date().getDay()
            const end = new Date()
            const start = new Date().addDays(1 - day)

            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const date = new Date().getDate()
            const end = new Date()
            const start = new Date().addDays(1 - date)
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      PriorityType: PriorityType,
      problemTypeCache: [], // 问题列表缓存
      serviceObject: ''
    }
  },
  computed: {
    timeType() {
      return function(value) {
        return value.ctime ? moment(value.ctime).format('YYYY-MM-DD HH:mm:ss') : null
      }
    },
    userTypeName() {
      return function(val) {
        // 1体验2付费3在职4停职5新注册6体验7系统8注销
        const userTypeMap = new Map()
        userTypeMap.set(1, '体验用户')
        userTypeMap.set(2, '付费用户')
        userTypeMap.set(3, '在职老师')
        userTypeMap.set(4, '停职老师')
        userTypeMap.set(5, '新注册用户')
        userTypeMap.set(6, '体验课用户')
        userTypeMap.set(7, '系统课用户')
        userTypeMap.set(8, '已注销用户')
        return userTypeMap.get(+val)
      }
    },
    ...mapGetters(['loadings']),
    ...mapState('global', ['cpStatusData']),
    // 根据员工名片勾选的业务线显示tab业务线
    TabList() {
      const { serviceObject, TabListTwo } = this
      const serviceArr = serviceObject?.split(',')
      serviceArr?.push('0')
      const tabList = TabListTwo?.filter(item => {
        if (serviceArr?.includes(item.value)) {
          return item
        }
      })
      return tabList
    }
  },
  watch: {
    cpStatusData: {
      handler: function(val) {
         this.actionFunction = actions({
           setInvalid: this.setInvalid,
           visitRecord: this.visitRecord,
           multipleAction: this.multipleAction,
           solve: this.solve,
           tableAction: this.tableAction,
           cpStatusData: val
         })
      },
      deep: true
    },
    taskStatusValue() {
       this.initParamsAndGetList()
    },
    activeTabsTwoValue() {
      this.initParamsAndGetList()
    },
    activeTabsOneValue() {
      this.initParamsAndGetList()
    },
    'query.selectName': function(val, oldVal) {
      if (val !== oldVal) {
        this.query.inputName = ''
      }
    }
  },
  created() {
    this.getStaffUserList()// 修改操作人 全部修改人列表
    this.$store.dispatch('global/getComplaintStatusEumDtoEnum')
  },
  mounted() {
    this.$nextTick(() => {
      this.getAutoComplaintStatus()
    })
  },
  methods: {
    // 兼容第一版paypal参数cpComent为json数组的情况
    parseContent(row) {
      if (['PayPal平台投诉'].includes(row.channelName)) {
        try {
          if (JSON.parse(row.cpComent) instanceof Array) {
            return JSON.parse(row.cpComent)[0]?.content || ''
          } else {
            return row.cpComent || ''
          }
        } catch (error) {
          return row.cpComent
        }
      } else {
      return row.cpComent || ''
      }
    },
    // 获取修改人全部名单
    getStaffUserList() {
      getStaffList({
        pageNum: 0,
        pageSize: 1000
      }).then(res => {
        if (res.code === 0) {
          const arr = []
          const data = res.payload || {}
          // arr = data.data || []
          data.data.map(item => {
            if (item.status === 0) {
              arr.push({
                value: item.id,
                label: item.staffName,
                staffId: item.id,
                staffMobile: item.staffMobile,
                staffName: item.staffName
              })
            }
          })
          this.staffList = arr
        }
      })
    },
    handleStatusClick(value) {
      this.taskStatusValue = value
      this.act = act({
        exportDocument: this.exportDocument,
        prioritySort: this.prioritySort,
        prioritySortFlag: this.prioritySortFlag || false,
        tableAction: this.tableAction,
        taskStatusValue: this.taskStatusValue || false
      })
    },
    handleOpenComplaintSwitch() {
      this.$confirm(`确定${this.ifAutoComplaint ? '关闭' : '开启'}自动分配么？`, '自动分配设置', { type: 'warning' }).then(() => {
        openDistributionStaff({ userId, type: 1, status: this.ifAutoComplaint ? 1 : 0 }).then(res => {
          if (res.code === 0) {
            this.ifAutoComplaint = !this.ifAutoComplaint
          }
        })
      })
    },
    getAutoComplaintStatus() {
      getUserInfoById({ userId }).then(res => {
        if (res?.code === 0) {
          const { openDistribution, serviceObject: servicestr } = res.payload
          this.serviceObject = servicestr
          this.ifAutoComplaint = !openDistribution
            this.getList()
        }
      })
    },
    // 初始化页面 分页参数 && 重新请求列表
    initParamsAndGetList() {
      this.listQuery = {
        ...init_pagaination
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    wordWrapping(text) {
      return text.replace(/\|/img, '</br>') || '未分类'
    },
    changeDate() {
      this.initParamsAndGetList()
    },
    toDetail(row) {
        if (row.complaintAfterSaleEntity?.type) { // 新售后
          window.open(`/workOrder/newAfterSaleDetail/${row.complaintNo}`)
        } else { // 老售后或投诉
          window.open(`/workOrder/detail/${row.complaintNo}`)
        }
    },
    // 获取投诉列表 && 统计
    getList(type) {
      const { activeTabsOneValue, activeTabsTwoValue, taskStatusValue, valueDate, query } = this
      const { page, limit: pageSize } = this.listQuery
      let createDateBegin, createDateEnd
      if (this.valueDate) {
        createDateBegin = moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        createDateEnd = moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const queryObj = {
        type: activeTabsOneValue,
        channelPid: activeTabsTwoValue,
        myStatus: taskStatusValue,
        createDateBegin,
        createDateEnd
      }
      const userInfoObj = {
        userName,
        userId
      }
      const newquery = {
        ...query,
        [query.selectName]: query.inputName || undefined
      }
      if (type === 'downLoad') {
        exportSug({ ...queryObj, ...userInfoObj }).then(res => {
          createBlob(`我的工作台投诉数据统计${moment().format('YYYY-MM-DDHH:mm')}.xls`, res)
        })
        return
      } else if (type === 'SuperDownload') {
        // 超过2000条预下载
        downloadComplaintSync({ ...queryObj, userInfoObj }).then(res => {
          console.log('投诉单预下载成功')
        })
      }
      getMyWorkComplaintList({ pageNumber: page - 1, pageSize, ...queryObj, ...userInfoObj, ...newquery }).then(res => {
        if (res?.code === 0) {
          const { data, total } = res.payload
          this.list = data
          this.total = Number(total)
        }
      })
      // 角标 统计
      myWorkNum({ ...queryObj, ...userInfoObj, ...newquery }).then(res => {
        if (res?.code === 0) {
          this.badgeData = res.payload
        }
      })
    },
    // 下载数据
    exportDocument() {
      // 控制下载数据的时候不能超过60天
      const days = (24 * 60 * 60) * 60
      const beginTime = moment(this.valueDate[0]).unix()
      const endTime = moment(this.valueDate[1]).unix()
      const allTime = endTime - beginTime
      // 当时间范围大于60天
      if (allTime > days) {
        this.$alert('时间筛选超过了60天，请调整时间范围。<br/>仅能导出60天内的数据。', '', {
          confirmButtonText: '知道了',
          dangerouslyUseHTMLString: true
        })
      } else {
        if (this.total > 2000) {
           this.$confirm("<div>导出数据超过<span style='color:red'>2000</span>条，请稍后去下载中心下载<div>", '是否确定导出数据', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定导出',
            cancelButtonText: '取消导出'
           }).then(res => {
             this.$message({
              type: 'warning',
              message: '正在跳往下载中心'
            })
             this.getList('SuperDownload')
            // 跳去下载中心
            setTimeout(() => {
            this.$router.push({ name: 'downloadPage' })
            }, 3000)
           })
        } else {
          this.getList('downLoad')
        }
      }
    },
    // 立即处理或关闭投诉或者设定为无效投诉
    tableAction(dat, row, index, name, type) {
      this.tabApiflag = type
      switch (name) {
        case 'doItNow': // 立即处理操作
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.doItNowFn(row || this.tableActionRow, type)
          }
          break
        case 'closeComplaint': // 关闭投诉
          this.closeComplaintFn(row)
          break
        case 'setInvalid': // 设为无效
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.setInvalid(dat, row || this.tableActionRow, index, type)
          }
          break
        case 'editType': // 修改类型
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.editTypeFn(row || this.tableActionRow, type)
          }
          break
        case 'editStaffUser': // 修改操作人
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.editStaffUser(row || this.tableActionRow, type)
          }
          break
        case 'setAccecpt': // 设为待处理
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.setAccecptFn(row || this.tableActionRow)
          }
          break
        case 'doVisit': // 回访登记
          if (type === 'tabbtn' && this.checkoutNum <= 0) {
            this.actionsOpen()
          } else {
            this.doVisitFn(row || this.tableActionRow)
          }
          break
        case 'setPriority': // 设置优先级
          this.setPriorityFn(row)
          break
      }
    },
    setPriorityFn(row) {
      this.editTypeStatus = 'setPriority'
      // 设置优先级
      this.info = {
        title: '设置优先级',
        instroduct: '请确定将此问题列为重点问题并置顶'
      }
      this.complaintForm = priorityForm
      this.complaintNo = row.complaintNo
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({ priority: row.priority })
      })
    },
    // 修改操作人
    editStaffUser(row, type) {
      this.editTypeStatus = 'editStaffUser'
      const { staffList, data } = this
      this.info = {
        title: '确定批量修改操作人',
        instroduct: '将问题由当前处理人转给他人处理'
      }
      this.complaintForm = editStaffUserForm
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({
          oldId: type === 'tabbtn' ? '' : data.currentStaffId + ''
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            oldId: staffList
          }
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            id: staffList
          }
        })
      })
    },
    // 回访登记
    doVisitFn(row) {
      this.info = {
        title: '确定批量记录回访内容',
        instroduct: '请输入投诉处理内容，并标记问题是否已解决。'
      }
      this.complaintNo = row.complaintNo
      this.editTypeStatus = 'doVisit'
      this.complaintForm = visitForm
      this.dialogNewVisible = true
    },
    // 设待处理状态
    setAccecptFn(row) {
      this.info = {
        title: '确定批量设置为待处理',
        instroduct: '请确定将此问题恢复为待处理状态'
      }
      this.complaintNo = row.complaintNo
      this.editTypeStatus = 'setAccecpt'
      this.complaintForm = accecptForm
      this.dialogNewVisible = true
    },
    setPriorityApi(val) {
      const data = {
        ...val,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      updatePriority(data).then(res => {
        this.cancel()
        this.$message.success('操作成功')
        this.getList()
      })
    },
    getSelectList(val) {
      const { problemPid, problemId, problemIdThree, problemIdFour } = val
      this.getProblemChild(problemPid, 'problemId')
      this.getProblemChild(problemId?.toString(), 'problemIdThree')
      this.getProblemChild(problemIdThree?.toString(), 'problemIdFour')
      this.getProblemChild(problemIdFour?.toString(), 'problemIdFive')
    },
    // 获取子问题
    getProblemChild(val, key) {
      const params = {
        pids: val
      }
      getBypids(params).then(res => {
        const data = res.payload || []
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            [key]: this.tranFormChildData(data)
          }
        })
      })
    },
    tranFormChildData(data) {
      return data.map(item => {
        return {
          label: item.problemStatus ? '（内部）' + item.cpType : item.cpType,
          value: item.problemIdNew
        }
      })
    },
    // 修改类型
    editTypeFn(row, type) {
      this.editTypeStatus = 'editType'
      this.info = {
        title: `确定${type === 'tabbtn' ? '批量' : ''}修改类型`,
        instroduct: '修改投诉问题类型'
      }
      const { channelPid: channelId } = row
      const arr = ['problemId', 'problemIdThree', 'problemIdFour', 'problemIdFive']
      this.complaintForm = questTypeForm
      this.complaintNo = row.complaintNo
      this.dialogNewVisible = true
      this.$nextTick(() => {
        // 保证已停用的问题在修改类型时不会回显
        this.getProblemChannelForm(channelId, 'problemPid', 'form').then(_ => {
          const upDefaultValueFlag = this.problemTypeCache.some(v => v.id === row.problemPid && v.problemStatus === 0)
          if (upDefaultValueFlag) {
            this.getSelectList(row)
            if (type === 'tabbtn') return
            this.$refs.complaintForm.recoveryForm({ problemPid: row.problemPid, problemId: row.problemId, problemIdThree: row.problemIdThree, problemIdFour: row.problemIdFour, problemIdFive: row.problemIdFive })
          }
        })
      })
      // 如果是批量选中的状态就阻止回显
      if (type === 'tabbtn') return
      arr.map(res => {
        if (Array.isArray(row[res])) {
          row[res]
        } else if (row[res]) {
          if (row[res] === '0') row[res] = ''
          else row[res] = row[res]?.split(',')
        }
      })
    },
    // 立即处理按钮
    doItNowFn(row, type) {
      if (type === 'tabbtn') {
        this.editTypeStatus = 'doItNow'
        this.info = {
          title: '确定记录投诉处理内容',
          instroduct: '请输入投诉处理内容，如需关闭请选择关闭。'
        }
        doItForm.forEach(v => {
          if (v.prop === 'workType') {
            v.defaultVal = this.data.workType + '' || null
          }
        })
        this.complaintForm = doItForm
        this.dialogNewVisible = true

        this.complaintNo = row.complaintNo // 投诉单号
        this.cpStatus = '2' // 状态 或者为 3（点击关闭）
        // 如果点击关闭投诉 则传递状态值为4
        // 复现关闭
        if (this.closeEnumTpye) {
          const handleComent = this.handleComent
          this.$nextTick(() => {
            this.$refs.complaintForm.set({
              type: 'defaultVal',
              data: {
                closeEnumTpye: ['1'],
                closeEnum: handleComent
              }
            })
          })
        }
      } else {
        const value = row.complaintNo
        if (row.complaintAfterSaleEntity?.type) { // 新售后
          window.open(`/workOrder/newAfterSaleDetail/${value}`)
        } else { // 老售后或投诉
          window.open(`/workOrder/detail/${value}`)
        }
        // const param = {
        //   complaintNo: value,
        //   currentStaffId: getToken('userId'),
        //   currentStaffName: getToken('cname'),
        //   currentStaffMobile: getToken('userMobile')
        // }
        // acceptFirstRecord(param)
        // this.$router.push({ name: 'OperateComplainDetail', params: { id: row.complaintNo }})
        // this.info = {
        //   title: '记录投诉处理内容',
        //   instroduct: '请输入投诉处理内容，如需关闭请选择关闭。'
        // }
        // this.complaintForm = doItForm
        // this.dialogNewVisible = true

      // this.complaintNo = row.complaintNo // 投诉单号
      // this.cpStatus = '2' // 状态 或者为 3（点击关闭）
      // 如果点击关闭投诉 则传递状态值为4
      }
    },
    // 关闭投诉
    closeComplaintFn(row) {
      this.info = {
        title: '确定关闭投诉',
        instroduct: '请确定投诉问题已处理，关闭后用户将对您的处理服务进行满意度评价！'
      }
      this.complaintForm = closeForm
      this.dialogNewVisible = true

      this.complaintNo = row.complaintNo // 投诉单号
      this.cpStatus = '3' // 状态 或者（点击关闭）
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },

    cancel() {
      this.dialogNewVisible = false
      this.complaintNo = null // 投诉单号
      this.cpStatus = null
      this.editTypeStatus = null
      this.info = {
        title: '',
        instroduct: ''
      }
    },
    // 提交表单
    submitForm: debounce(function(val) {
      const { editTypeStatus, complaintNo, cpStatus } = this
      if (val.imgUrl) {
        const arr = []
        const { imgUrl } = val
        if (imgUrl.length > 0) {
          imgUrl.forEach(item => {
            arr.push(item.url)
          })
          val.imgUrl = arr.join(',')
        } else {
          val.imgUrl = undefined
        }
      }
      if (val.videoUrl) {
        val.videoUrl = val.videoUrl.url || ''
      } else {
        val.videoUrl = ''
      }
      if (editTypeStatus === 'editType') {
        // 修改类型
        this.setQuestion({ ...val, complaintNo })
      } else if (editTypeStatus === 'setPriority') {
        // 设置优先级
        this.setPriorityApi({ ...val, complaintNo })
      } else if (editTypeStatus === 'editStaffUser') {
        // 修改操作人
        this.setStaffUser(val)
      } else if (editTypeStatus === 'setAccecpt') {
        // 设为待处理
        this.invalidToUnaccecptFn(val)
      } else if (editTypeStatus === 'doVisit') {
        // 回访登记
        this.setDoVisit(val)
      } else {
        var status = cpStatus
        if (val.closeEnumTpye && val.closeEnumTpye.length > 0) {
          status = '3'
        }
        const { closeEnumNew } = val
        if (closeEnumNew || closeEnumNew === '') {
          val.closeEnum = closeEnumNew
          delete val.closeEnumNew
        }
        if (cpStatus === '6' && val.taskStatusValue) {
          status = val.taskStatusValue
          if (val.repeatReason) {
            val.invalidEnum = val.repeatReason
            delete val.repeatReason
          }
          delete val.taskStatusValue
        }
        this.handleData({
          ...val,
          complaintNo,
          cpStatus: status,
          currentStaffId: getToken('userId'),
          currentStaffName: getToken('cname'),
          currentStaffMobile: getToken('userMobile')
        })
      }
    }, 500),
    // 处理问题类型
    setQuestion(val) {
      const arr = ['problemId', 'problemIdThree', 'problemIdFour', 'problemIdFive']
      arr.map(res => {
        if (Array.isArray(val[res])) {
          val[res] = val[res].toString()
        } else if (val[res]) {
          val[res]
        }
      })
      if (!val.problemIdThree) {
        val.problemIdFour = ''
        val.problemIdFive = ''
      } else if (!val.problemIdFour) {
        val.problemIdFive = ''
      }
      // 批量选中的id
      const complaintNos = this.checkoutList.map(i => i.complaintNo).join(',')
      const data = {
        ...val,
        complaintNo: complaintNos || val.complaintNo,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      if (this.tabApiflag === 'tabbtn') {
        modifyProblemTypeBatch(data).then(res => {
          this.cancel()
          this.$message.success('操作成功')
          this.getList()
        })
      } else {
        modifyProblemType(data).then(res => {
          this.cancel()
          this.$message.success('操作成功')
          this.getList()
        })
      }
    },

    // 设为无效
    setInvalid(dat, row, index, type) {
      this.info = {
        title: `确定${type === 'tabbtn' ? '批量' : ''}设为无效`,
        instroduct: '请确定投诉问题为违规或无效问题'
      }
      this.complaintForm = invalidForm
      this.dialogNewVisible = true

      // 向后端传递的值
      this.complaintNo = row.complaintNo // 投诉单号
      this.cpStatus = '60' // 传递的状态
    },
    // 调取处理接口
    handleData(data) {
      if (this.tabApiflag === 'tabbtn') {
        const complaintNos = this.checkoutList.map(i => i.complaintNo).join(',')
        const datas = {
          ...data,
          complaintNos: complaintNos || data.complaintNo
        }
        acceptComplaintBatch(datas).then(res => {
          this.cancel()
          this.$message.success('操作成功')
          this.getList()
        })
      } else {
        acceptComplaint(data).then(res => {
          this.cancel()
          this.$message.success('操作成功')
          this.getList()
        })
      }
    },
    // 投诉表单变化
    changeNewForm(val, oldVal) {
      if (Object.keys(val)?.length === 3 && (Object.keys(val).includes('invalidEnum') || Object.keys(val).includes('repeatReason')) && val.cpStatusRadio !== oldVal.cpStatusRadio) {
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            repeatReason: val.type === '2'
          }
        })
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            invalidEnum: val.type === '1'
          }
        })
      }
      // if (val.problemPid !== oldVal.problemPid && oldVal.problemPid) {
      //   this.$refs.complaintForm.set({
      //     type: 'defaultVal',
      //     data: {
      //       problemId: undefined
      //     }
      //   })
      //   this.getProblemChild(problemPid, 'problemId')
      // }
      if (val.closeEnumTpye && val.closeEnumTpye[0] === '1') {
        // this.cpStatus = '3'
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            closeEnum: true
          }
        })
      } else {
        // this.cpStatus = '2'
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            closeEnum: false
          }
        })
      }
      const { problemPid, problemId, problemIdThree, problemIdFour } = val
      if (problemPid && problemPid !== oldVal.problemPid) {
        this.getProblemChild(problemPid, 'problemId')
      } else if (problemId?.toString() && problemId?.toString() !== oldVal?.problemId?.toString()) {
        this.$refs.complaintForm.set({ type: 'options', data: { problemIdThree: [], problemIdFour: [], problemIdFive: [] }})
        this.$refs.complaintForm.recoveryForm({ problemIdThree: '', problemIdFour: '', problemIdFive: '' })
        this.getProblemChild(problemId.toString(), 'problemIdThree')
      } else if (problemIdThree?.toString() && problemIdThree?.toString() !== oldVal.problemIdThree?.toString()) {
        this.$refs.complaintForm.set({ type: 'options', data: { problemIdFour: [], problemIdFive: [] }})
        this.$refs.complaintForm.recoveryForm({ problemIdFour: '', problemIdFive: '' })
        this.getProblemChild(problemIdThree.toString(), 'problemIdFour')
      } else if (problemIdFour?.toString() && problemIdFour?.toString() !== oldVal.problemIdFour?.toString()) {
        this.$refs.complaintForm.set({ type: 'options', data: { problemIdFive: [] }})
        this.$refs.complaintForm.recoveryForm({ problemIdFive: '' })
        this.getProblemChild(problemIdFour?.toString(), 'problemIdFive')
      }
    },
    // 优先级排序
    prioritySort() {
      const { query, prioritySortFlag } = this
      if (!prioritySortFlag) {
        this.query = {
          ...query,
          sort: 'priority'
        }
      } else {
        this.query = {
          ...query,
          sort: undefined
        }
      }
      this.prioritySortFlag = !this.prioritySortFlag
      this.act = act({
        exportDocument: this.exportDocument,
        prioritySort: this.prioritySort,
        flagSignSort: this.flagSignSort,
        prioritySortFlag: this.prioritySortFlag || false,
        flagSign: this.flagSign || false,
        taskStatusValue: this.taskStatusValue || false
        })
      this.getList()
    },
    // 标签排序
    flagSignSort() {
      const { query, flagSign } = this
      if (!flagSign) {
        this.query = {
          ...query,
          sort: 'flag_sign'
        }
      } else {
        this.query = {
          ...query,
          sort: undefined
        }
      }
      this.flagSign = !this.flagSign
      this.act = act({
        exportDocument: this.exportDocument,
        prioritySort: this.prioritySort,
        flagSignSort: this.flagSignSort,
        prioritySortFlag: this.prioritySortFlag || false,
        flagSign: this.flagSign || false,
        taskStatusValue: this.taskStatusValue || false
        })
      this.getList()
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
    // 获取问题分类列表
    getProblemChannel(val, key, type) {
      getChannelIdTree({ channelPid: val }).then(res => {
        const data = res.payload
        const arr = []
        data.forEach(item => {
          if (item.problemStatus === 0) {
            const obj = {}
            obj.label = item.cpType
            obj.value = item.id
            obj.children = this.tranFormDataTree(item.problems)
            arr.push(obj)
          }
        })
      })
    },
    getProblemChannelForm(val, key, type) {
      return getProblemChannelId({ channelId: val }).then(res => {
        const data = res.payload ? res.payload?.filter(v => v?.problemStatus?.toString() !== '1')?.map(v => {
          v.id = v.problemIdNew
          return v
        }) : []
        this.problemTypeCache = res.payload
        this.setChannel(data, key, type)
      })
    },
    tranFormDataTree(data) {
      const arr = []
      data.map(item => {
        const obj = {}
        obj.label = item.cpType
        obj.value = item.problemIdNew
        arr.push(obj)
      })
      return arr
    },
    // 表单提交修改操作人
    setStaffUser(val) {
      const { staffList } = this
      const arr = staffList.filter(item => item.value === val.id)
      const {
        staffId: newStaffId,
        staffMobile: newStaffMobile,
        staffName: newStaffName
      } = arr[0]
      // 批量选中的id
      const complaintNos = this.checkoutList.map(val => val.complaintNo).join(',')
      const param = {
        complaintNo: complaintNos,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile'),
        newStaffId,
        newStaffMobile,
        newStaffName
      }
      modifyProblemAcceptBatch(param).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
          this.getStaffUserList()
        }
      })
    },
    // 表单提交回访
    setDoVisit(val) {
      const { handleComent, handleStatus, imgUrl, videoUrl } = val
      const { complaintNo } = this
      if (handleStatus === '70' || handleStatus === '71') {
        this.handleData({
          handleComent,
          complaintNo,
          cpStatus: handleStatus,
          currentStaffId: getToken('userId'),
          currentStaffName: getToken('cname'),
          currentStaffMobile: getToken('userMobile'),
          imgUrl: imgUrl,
          videoUrl: videoUrl
        })
        // 去解决
      } else {
        // 转为待解决
        this.invalidToUnaccecptFn({
          handleComent,
          cpStatus: handleStatus
        })
      }
    },
    // 修改无效为待处理
    invalidToUnaccecptFn(val) {
      const { complaintNo } = this
      const complaintNos = this.checkoutList.map(i => i.complaintNo).join(',')
      const params = {
        complaintNo: complaintNos || complaintNo,
        ...val,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      if (this.tabApiflag === 'tabbtn') {
        invalidToUnaccecptBatch(params).then(res => {
          if (res.code === 0) {
            Message.success('操作成功')
            this.cancel()
            this.getList()
            this.initParams()
            this.getStaffUserList()
          }
        })
      } else {
        invalidToUnaccecpt(params).then(res => {
          if (res.code === 0) {
            Message.success('操作成功')
            this.cancel()
            this.getList()
            this.getStaffUserList()
          }
        })
      }
    },
    // 批量选中复选框事件
    handleSelectionChange(val) {
      // 选择的单子是新售后单不显示设为无效和立即处理
     if (val.map(val => Number(val.workType)).includes(4)) {
      this.act = act({
        exportDocument: this.exportDocument,
        prioritySort: this.prioritySort,
        prioritySortFlag: this.prioritySortFlag || false,
        tableAction: this.tableAction,
        taskStatusValue: '4' || false
      })
     } else {
       this.handleStatusClick(this.taskStatusValue)
     }
      // 选中的数量
      this.checkoutNum = val.length
      this.checkoutList = val
      this.data = val[0]
      // 替换当前详情的row
      this.tableActionRow = val[0]
    },
    // 提示选中要操作的投诉单提示框
    actionsOpen() {
      this.$alert('请先选择需要操作的投诉单', '', {
        confirmButtonText: '知道了',
        showClose: false
      })
    },
    // 列表点击循环变颜色
    clickFlag(scope) {
      const { row, $index } = scope
      const i = row.flagSign
      const index = this.flagSignColordata[i < 0 || i >= 3 ? 0 : i + 1]
      row.flagSign = this.flagSignColordata.indexOf(index)
      this.list.splice($index, 1, row)
      const indexflagSign = i < 0 || i >= 3 ? 0 : i + 1
      // 改变小彩旗的颜色
      updateFlagSign({
        complaintNo: row.complaintNo,
        flagSign: indexflagSign
      }).then(res => {
        console.log(res, 'res')
      })
    },
    // 点击小彩旗过滤出小彩旗的数据
    clickFilter(val) {
      if (val + 1 !== this.query.flagSign) { // 点击不同小彩旗就过滤查询接口
        this.query.flagSign = val
      } else { // 点击相同的小彩旗恢复原来的数据
        this.query.flagSign = undefined
      }
      this.getList()
    },
    // 筛选跟进方式
    changePendingType(val) {
      if (val) {
        this.query.pendingType = val
      } else {
        this.query.pendingType = undefined
      }
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.querySelect{
    width: 200px;
    float: right;
    position: relative;
    top: -57px;
    .el-input-select {
    width: 100px;
   }
}
.tabs-two-box {
  padding: 0 12px;
}
.form-item{
  .el-upload {
    background-color: red !important;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
  }
}

.task-status-radio {
  .el-radio{
    margin-right: 18px;
    margin-bottom: 10px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
  .el-radio.is-bordered+.el-radio.is-bordered {
    margin-left: 0;
  }
  /deep/ .el-badge__content.is-fixed{
    top: -8px;
    right: 0px;
  }
}
.columns-txt {
  font-size: 12px;
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
/deep/ .app-container .el-tabs__header{
  margin: 0 0 23px;
}
/deep/ .el-input-select {
  // background-color: #fff;
  width: 90px;
}
.counmns-link{
  color: rgb(60, 86, 242);
  margin-right: 6px;
}
.form-item{
  /deep/ .el-form-item__label{
      width: 92px !important;
  }
}
/deep/ .search-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    // justify-content: center;
    height: 36px;
    .search-item-label {
      display: block;
      width: 86px;
      /*text-align-last: justify;*/
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      color: #606266;
    }
    .search-item-element {
      display: flex;
      flex: 1;
      // width: 50%;
      margin-right: 10px;
      .el-input-group__prepend{
        display: flex;
        width: 90px;
        flex: 1;
        align-items: center;
      }
    }

  }
  .app-complain-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-box {
      width: 460px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    span{
      color: rgba(0,0,0,0.85);
      font-weight: 600;
      font-size: 16px;
      // line-height: 36px;
    }
    b {
      font-size: 12px;
      font-weight: 400;
      color: #999;
    }
  }
.tabpaneBadge {
  /deep/ {
    .el-badge__content.is-fixed{
      right: 2px;
      top: 12px;
    }

  }
}

.custom-radio-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  .custom-radio {
    cursor: pointer;
    font-size: 12px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    margin-right: 10px;
    color: #606266;
    width: 80px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    .custom-radio-value {
      font-size: 18px;
    }
  }
  .custom-radio-active {
    background-color: #3C56F2;
    color: #fff;
  }
}
.action_style{
  width: 100%;
  display: flex;
  .action{
    width: 200px;
  }
  .actionflag{
    margin-top: 7px;
    margin-left: 20px;
    cursor: pointer;
  }
  .followUp{
    width: 200px;
    position: absolute;
    right: 50px;
  }
}

</style>
