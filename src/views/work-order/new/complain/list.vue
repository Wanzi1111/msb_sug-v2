<template>
  <div v-loading="loadings._k8s_api_complaint_api_v2_complaint_downloadComplaintList">
    <div class="app-container app-complain-title">
      <span>工单列表</span>
      <div>
        <el-select v-model="filterTimeType" style="width: 120px;margin-right: 10px" :disabled="filterTimedisabel" @change="changeTimeType">
          <el-option
            v-for="item in filterTimeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-tabs v-model="activeChannelState">
        <el-tab-pane v-for="(item, index) in channelTypeList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._k8s_api_complaint_api_v2_complaint_getComplaint" />
      </el-tabs>
      <basics-search ref="searchs" :key="workKey" :loading="loadings._k8s_api_complaint_api_v2_complaint_getComplaint" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch">
        <template slot="workOrderType" class="search-item">
          <el-select v-model="query.workOrderType" placeholder="请选择工单类型" class="search-item-element" size="small" @change="changeWorkOrderType">
            <el-option label="投诉工单" value="1" />
            <el-option v-if="['1031', '1041', '1071', '1081', '1051', '2011'].includes(activeChannelState)" label="技术问题" value="2" />
            <el-option v-if="['1031', '1041', '1071', '1081', '1051', '2011'].includes(activeChannelState)" label="用户建议" value="3" />
            <el-option label="质检工单" value="4" />
            <el-option label="售后工单" value="5" />
            <el-option label="新售后工单" value="6" />
          </el-select>
        </template>
        <template slot="complaintPeople" slot-scope="scope" class="search-item">
          <el-input v-model="scope.form.inputName" placeholder="请输入" class="search-item-element" size="small">
            <el-select slot="prepend" v-model="scope.form.selectName" placeholder="请选择" class="el-input-select">
              <el-option label="姓名" value="1" />
              <el-option label="手机号" value="2" />
              <el-option label="UID" value="3" />
            </el-select>
          </el-input>
        </template>
        <template slot="handlePeople" slot-scope="scope" class="search-item">
          <el-input v-model="scope.form.inputName1" placeholder="请输入" class="search-item-element" size="small">
            <el-select slot="prepend" v-model="scope.form.selectName1" placeholder="请选择" class="el-input-select">
              <el-option label="姓名" value="1" />
              <el-option label="手机号" value="2" />
            </el-select>
          </el-input>
        </template>
        <template slot="flagSign" class="search-item">
          <p class="flagSign_stype">
            <span>处理标签</span>
            <svg-icon v-for="(item,index) in flagSignColordata" :key="index" class-name="actionflag" :icon-class="item" @click.stop="clickFilter(index)" />
          </p>
        </template>
      </basics-search>
      <el-tabs v-model="activeState">
        <el-tab-pane v-for="(item, index) in newStateList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._k8s_api_complaint_api_v2_complaint_getComplaint">
          <span v-if="overTimeData.includes(item.value)" slot="label">
            <el-badge is-dot class="tabpaneBadge">{{ item.label }}</el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <el-radio-group v-model="cpStatusRadio" size="mini" class="cp-status-radio" @change="changeCpStatusSub">
        <el-radio v-for="(item, index) in newChildrenStateList[activeState]" :key="index" :label="item.value" border>
          {{ item.label }}</el-radio>
      </el-radio-group>
      <basics-action :key="actTimeKey" :actions="act" />
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_v2_complaint_getComplaint || loadings._k8s_api_complaint_api_business_workOrderList"
        :list="list"
        :get-list="queryListType === 'list' || queryListType === 'afterSaleList'?getList:getworkList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
        @selection-change="handleSelectionChange"
      >
        <template slot="complaintNo" slot-scope="scope">
          <div class="complaint-list-scope-complaintNo">
            <svg-icon :icon-class="flagSignColordata[scope.row.flagSign?scope.row.flagSign:0]" style="cursor: pointer" @click.stop="clickFlag(scope)" />

            <a class="columns-txt counmns-link" @click="tableAction('', scope.row, '', 'doItNow')">{{ scope.row.complaintNo }}</a>
            <el-tag v-if="[1,2,3,4,5,7].includes(scope.row.cpStatus) && scope.row.priority !== 5" size="mini" :type="priorityType[scope.row.priority] ? priorityType[scope.row.priority].color : ''" effect="dark">
              {{ priorityType[scope.row.priority] ? priorityType[scope.row.priority].name : '--' }}
            </el-tag>
          </div>
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
          <!-- 1v1用户：1238(换行)910，1v1老师：123，小班课：12310，小熊和写字123(换行)456 -->
          <template v-if="activeChannelState === '1021' || activeChannelState === '1022'">
            <div class="columns-note">
              {{ scope.row.userRemarkOne }}{{ scope.row.userRemarkTwo ? ' ' + scope.row.userRemarkTwo : '' }}{{ scope.row.userRemarkThree ? ' ' + scope.row.userRemarkThree : '' }}{{ scope.row.userRemarkTen ? ' ' + scope.row.userRemarkTen : '' }}
            </div>
          </template>
          <template v-else>
            <div class="columns-note">{{ scope.row.userRemarkOne }} : {{ scope.row.userRemarkTwo }} {{ scope.row.userRemarkThree }}</div>
            <div v-if="activeChannelState === '1011'" class="columns-note">{{ scope.row.userRemarkEight }} {{ scope.row.userRemarkNine }} {{ scope.row.userRemarkTen }}</div>
            <div v-if="activeChannelState === '1061' || activeChannelState === '1031' || activeChannelState === '1041' || activeChannelState === '1051'" class="columns-note">{{ scope.row.userRemarkFour }} {{ scope.row.userRemarkFive }} {{ scope.row.userRemarkSix }}</div>
          </template>
        </template>
        <template slot="problemsType" slot-scope="scope">
          <div class="columns-txt"><span>{{ scope.row.problemPName }}</span><i v-if="query.workOrderType !== '6'" class="el-icon-edit" style="margin-left: 10px; cursor: pointer" @click="editTypeFn(scope.row)" /></div>
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
        <template slot="handleOperateTypeInfo" slot-scope="scope">
          <div class="columns-txt" style="color:red">{{ scope.row.handleOperateTypeInfo?`- 已${scope.row.handleOperateTypeInfo}`:'' }}</div>
        </template>
        <template slot="workOrderType" slot-scope="scope">
          <div>
            {{ scope.row.problemOneLevelName || '--' }}
            <el-tag size="mini" :type="work_order_priority_tag_color_map[scope.row.priority] || ''" effect="dark" class="cursor-pointer-box" @click="handlePriorityTagClick(scope.row)">
              {{ work_order_priority_map[scope.row.priority] || '--' }}
            </el-tag>
          </div>
          <div class="table-small-box">{{ workOrderSecondMap[scope.row.problemTwoLevel] || '--' }}</div>
          <div class="table-small-box">{{ workOrderThreeMap[scope.row.problemThreeLevel] || '--' }}</div>
        </template>
        <template slot="userName" slot-scope="scope">
          <div>昵称：{{ scope.row.userName }}</div>
          <div class="table-small-box">手机号：{{ scope.row.userMobile }}</div>
          <div class="table-small-box">UID: {{ scope.row.userId }}</div>
        </template>
        <template slot="workUrl" slot-scope="scope">
          <el-image
            v-if="scope.row.workUrlList && scope.row.workUrlList.length!=0"
            slot="reference"
            style="width: 80px; height: 80px"
            :src="scope.row.workUrlList[0]"
            fit="fill"
            @click="popoverVisibleFn(scope)"
          />
          <div v-else>无</div>
        </template>
        <template slot="cpStatus" slot-scope="scope">
          <el-tag :type="['', 'info', 'success', 'danger'][scope.row.cpStatus]" class="cursor-pointer-box" @click="handleStatusClick(scope.row)">{{ work_order_status_map[scope.row.cpStatus] || '' }}</el-tag>
        </template>
      </basics-table>
      <!-- 处理投诉 || 关闭投诉 || 设为无效 弹出框-->
      <el-dialog
        width="450px"
        :title="info.title"
        :visible.sync="dialogNewVisible"
        :loading="loadings._k8s_api_complaint_api_problem_getBypids"
      >
        <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">
          {{ info.instroduct }}</h2>

        <basics-form
          ref="complaintForm"
          :key="dialogNewVisible"
          :loading="loadings._k8s_api_complaint_api_v2_complaint_modifyProblemType"
          :forms="complaintForm"
          :actions="complaintFormAction"
          style="padding-bottom:20px;"
          class="form-item"
          @submitForm="submitForm"
          @changeForm="changeNewForm"
        />
      </el-dialog>
      <!-- 工单列表的出来状态点击的弹框 -->
      <div v-if="modalType">
        <modal-priority v-if="modalType === 'priority'" :data="modalData" @handleModalVis="handleModalVis" />
        <modal-handle-status v-else-if="modalType === 'handleStatus'" :data="modalData" @handleModalVis="handleModalVis" />
      </div>
      <!-- 附件的弹窗 -->
      <el-dialog
        :visible.sync="urlVisible"
        width="70%"
        class="urlDialog"
      >
        <el-carousel v-if="urlVisible">
          <el-carousel-item v-for="v in workUrlList" :key="v">
            <el-image
              style="height: 100%"
              :src="v"
              fit="fill"
            />
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBypids, getBypidsFilter } from '@/api/operate/question'
import { getStaffList } from '@/api/operate/staff-list'
import { getComplaintList, acceptComplaint, getBypid, modifyProblemType, exportSug, getChannelIdTree, getProblemChannelId, updatePriority, getJudgeOverTime, modifyProblemAcceptBatch, invalidToUnaccecpt, modifyProblemTypeBatch, acceptComplaintBatch, invalidToUnaccecptBatch, updateFlagSign, getAfterSaleProblem } from '@/api/operate/complainNew'
import { getWorkOrderList, getWorkOrderListNum, exportWorkOrderList, downloadComplaintSync, exportWorkOrderListSync } from '@/api/work-order'
import act, { classTeacherAct, afterSaleAct, workOrderAct } from './actions/actions'
import { doItForm, closeForm, invalidForm, questTypeForm, priorityForm, editStaffUserForm, accecptForm, visitForm, actions as complaintFormAction } from './forms/complaintForm'
import columns, { actions, workColumns, afterSaleColumns } from './columns/listNew'
import searchs, { workSearch } from './searchs/searchs'
import { mapGetters } from 'vuex'
import { createBlob, getQueryObject } from '@/utils'
import { getToken } from '@/utils/auth'
import moment from 'moment'
import { Message } from 'element-ui'
import _ from 'lodash'
import ModalPriority from './components/modal-priority'
import ModalHandleStatus from './components/modal-handle-status'
import {
    workOrderSecondMap,
    workOrderThreeMap,
    work_order_priority_tag_color_map,
    work_order_priority_map,
    work_order_classification_map,
    work_order_status_map,
    work_order_status_key_map,
    work_order_second_quality_testing_map,
    work_order_second_quality_aftersale_map,
    channelTypeList,
    userTypeEum
} from './config'
import { mapState } from 'vuex'
const {
  baseData: {
    work_order_status,
    new_express_type_list,
    after_sale_type_list,
    new_express_children_type_list,
    after_sale_children_type_list,
    work_type_list,
    work_order_second_map
  }
} = window
const priorityType = {
  '1': {
    color: 'danger', // 急
    id: 1,
    name: '急'
  },
  '2': {
    color: 'warning', // 高
    id: 2,
    name: '高'
  },
  '3': {
    color: '', // 中
    id: 3,
    name: '中'
  },
  '4': {
    color: 'success', // 低
    id: 4,
    name: '低'
  }
  // 5 普通
}
import { debounce } from 'lodash'
export default {
  name: 'OperateComplain',
  components: { ModalPriority, ModalHandleStatus },
  data() {
    return {
      // setTimer,
      urlVisible: false,
      editFn: false, // 是否第一次打开
      tabApiflag: '', // 是否是点击的tab类型
      table: {
        stripe: false,
        border: false
      },
      initCpStatusRadio: '',
      filterTimeOptions: [{
        value: 'createDate',
        label: '创建时间'
      }, {
        value: 'accessDate',
        label: '介入时间'
      }, {
        value: 'closeDate',
        label: '已处理时间'
      }, {
        value: 'updateDate',
        label: '最新处理时间'
      }],
      filterTimeType: 'createDate',
      filterTimedisabel: false,
      cpStatusRadio: '',
      prioritySortFlag: false,
      flagSign: false,
      flagSignColordata: ['huiflag', 'redflag', 'greenflag', 'yellowflag'],
      columns,
      afterSaleColumns,
      workColumns,
      activeState: '0',
      columnsData: JSON.parse(JSON.stringify(columns)),
      staffList: [],
      tableActionRow: {},
      actTimeKey: Date.now(),
      act: act({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          activeState: this.activeState || false,
          tableAction: this.tableAction
          })[this.activeState],
      classTeacherAct: classTeacherAct({
          exportDocument: this.exportDocument,
          flagSignSort: this.flagSignSort,
          flagSign: this.flagSign || false
          }),
      afterSaleAct: afterSaleAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          tableAction: this.tableAction
          })[this.activeState],
      workOrderAct: workOrderAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          prioritySortFlag: this.prioritySortFlag || false
      }),
      actionFunction: actions({
        setInvalid: this.setInvalid,
        visitRecord: this.visitRecord,
        multipleAction: this.multipleAction,
        solve: this.solve,
        tableAction: this.tableAction
      }),
      searchsForm: JSON.parse(JSON.stringify(searchs)),
      searchs: searchs,
      workSearch: workSearch,
      queryListType: 'list',
      workKey: '',
      total: 0,
      list: [],
      echorecord: {},
      query: {
        sort: undefined,
        cpStatus: ['1'],
        pendingType: undefined // 跟进方式
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      complaints: {},
      newStateList: new_express_type_list,
      newChildrenStateList: new_express_children_type_list,
      after_sale_children_type_list,
      after_sale_type_list,
      new_express_type_list,
      workOrderSecondMap,
      workOrderThreeMap,
      work_order_priority_tag_color_map,
      work_order_priority_map,
      work_order_classification_map,
      work_order_status_map,
      work_order_status_key_map,
      work_order_second_quality_testing_map,
      work_order_second_quality_aftersale_map,
      modalData: null,
      modalType: '',
      dialogNewVisible: false,
      dialogNewVisibleSecondary: false,
      checkoutNum: 0,
      checkoutList: [],
      complaintFormAction: complaintFormAction({ cancel: this.cancel, ensure: this.ensure }),
      complaintForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      complaintNo: null,
      cpStatus: null,
      editTypeStatus: null,
      valueDate: [moment().startOf('day'), moment().endOf('day')],
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
      activeChannelState: '1011',
      channelTypeList,
      userTypeList: [],
      userTypeEum,
      batchId: this.$route.params.batchId ? this.$route.params.batchId : undefined,
      priorityType: priorityType,
      problemTypeCache: [], // 问题列表缓存
      overTimeData: [],
      workUrlList: [],
      second_map: work_order_second_map,
      three_map: work_order_classification_map
    }
  },
  computed: {
    timeType() {
      // <!-- 全部: 创建时间 ctime -->
      // <!-- 待处理 : 创建时间 ctime -->
      // <!-- 处理中 : 介入时间 accessTime -->
      // <!-- 已关闭 : 关闭时间 closeTime -->
      // <!-- 已解决 : 用户评价时间 evaluateTime -->
      // <!-- 未解决 : 用户评价时间 evaluateTime -->
      // <!-- 无效投诉 : 处理时间 invalidTime -->
      return function(value) {
        return value.ctime ? moment(value.ctime).format('YYYY-MM-DD HH:mm:ss') : null
      }
    },
    useActiveState() {
      const { activeState, activeChannelState } = this
      return {
        activeState,
        activeChannelState
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
    ...mapGetters(['loadings', 'staffEnum']),
    ...mapState('global', ['cpStatusData'])
  },
  watch: {
    staffEnum: {
      handler: function(val, oldVal) {
        // 过滤出机器人回访和发短信的角色
        const filterData = ['9', '10']
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            businessId: val.businessLine,
            role: val.roles?.filter(val => !filterData.includes(val.value))
          }
        })
      },
      deep: true
    },
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
    useActiveState(val, oldVal) {
      if (val.activeState !== oldVal.activeState) {
          if (val.activeChannelState === '1022') { // 小班课老师
            this.act = classTeacherAct({
             exportDocument: this.exportDocument,
             flagSignSort: this.flagSignSort,
             flagSign: this.flagSign || false
          })
          } else {
            const { workKey } = this
            if (workKey === 'setSearchAfterSale') { // 新售后工单
               this.act = afterSaleAct({
                 exportDocument: this.exportDocument,
                 prioritySort: this.prioritySort,
                 flagSignSort: this.flagSignSort,
                 prioritySortFlag: this.prioritySortFlag || false,
                 flagSign: this.flagSign || false,
                 tableAction: this.tableAction
          })[this.activeState]
            } else if (workKey === 'setSearchWork') { // 工单
               this.act = afterSaleAct({
                 exportDocument: this.exportDocument,
                 prioritySort: this.prioritySort,
                 flagSignSort: this.flagSignSort,
                 prioritySortFlag: this.prioritySortFlag || false,
                 flagSign: this.flagSign || false,
                 tableAction: this.tableAction
          })[this.activeState]
            } else {
            this.act = act({
              exportDocument: this.exportDocument,
              prioritySort: this.prioritySort,
              flagSignSort: this.flagSignSort,
              prioritySortFlag: this.prioritySortFlag || false,
              flagSign: this.flagSign || false,
              activeState: this.activeState || false,
              tableAction: this.tableAction
          })[this.activeState]
            }
          }
      }
      this.actRowList = []
      if (val.activeChannelState !== oldVal.activeChannelState || val.activeState !== oldVal.activeState) {
        this.tableKey += 1
        this.listQuery = {
          page: 1,
          limit: 20
        }
        if (this.initCpStatusRadio) {
          this.cpStatusRadio = this.initCpStatusRadio
          this.initCpStatusRadio = ''
        } else {
          if (val.activeState === '1') {
            this.cpStatusRadio = '13'
          } else if (val.activeState === '2') {
            this.cpStatusRadio = '22'
          } else {
            this.cpStatusRadio = ''
          }
        }
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            problemIdThree: [],
            problemIdFour: [],
            problemIdFive: []
          }
        })
        this.userTypeFn(val.activeChannelState)
        this.setResetVal('channelId')
        this.setResetVal('problemId')
        this.setResetVal('problemIdThree')
        this.setResetVal('problemIdFour')
        this.setResetVal('problemIdFive')
        this.getBypidChannel(val.activeChannelState)
        this.getProblemChannel(val.activeChannelState, 'problemId')
        const { uid, userMobile } = this.$route.query
        if (!(uid || userMobile)) {
           if (val.activeState === 'allNum' || val.activeState === 'myNum') {
          this.getworkList()
          this.$refs.searchs?.set({
          type: 'defaultVal',
          data: {
            workOrderType: this.query.workOrderType
            }
          })
           } else {
            this.getList()
           }
        }
      }
    },
    activeChannelState(val, oldVal) {
      this.$store.dispatch('staffEnum/getEnumConfig')
      const tabType = ['1031', '1041', '1051', '1071', '1081', '2011']
      const workType = ['2', '3', '4', '5']// 技术问题 用户建议 质检工单 售后工单
      const { workOrderType } = this.query
      // 判断tab不是工单类型的业务，重置搜索项、筛选项、筛选初始值
      const { uid, userMobile, channelPid } = this.$route.query
      if (!(uid || userMobile)) {
        if (tabType.includes(val)) {
        if (workType.includes(workOrderType)) {
         this.setSearchWork(workOrderType)
        } else {
          this.setSearchSug('1')
        }
        } else { // 不是工单类型的其他业务线 就重置投诉搜索单
         this.setSearchData()
         // 变化不同的赛选tab
         this.newStateList = new_express_type_list
         this.getList()
        }
      } else if (val !== channelPid && (uid || userMobile)) {
        // 地址栏有参数切换业务线的时候重置页面
        const Url = window.location.href.substring(0, window.location.href.indexOf('?'))
        history.replaceState(null, null, Url)
        this.setSearchSug('1')
        this.initSearch()
      }
       this.userRemarkFn(val)
          if (this.activeChannelState === '1022') {
            this.act = classTeacherAct({
             exportDocument: this.exportDocument,
             flagSignSort: this.flagSignSort,
             flagSign: this.flagSign || false
          })
          } else {
            this.act = act({
             exportDocument: this.exportDocument,
             prioritySort: this.prioritySort,
             flagSignSort: this.flagSignSort,
             prioritySortFlag: this.prioritySortFlag || false,
             flagSign: this.flagSign || false,
             activeState: this.activeState || false,
             tableAction: this.tableAction
          })[this.activeState]
          }
    },
    queryListType(val, oldVal) {
      if (val !== oldVal) {
        if (val === 'worklist') {
          this.$nextTick(() => {
            this.columns = workColumns
            this.getworkList()
          })
        } else if (val === 'list') {
          this.$nextTick(() => {
            this.columns = columns
            this.getList()
          })
        } else if (val === 'afterSaleList') {
          this.$nextTick(() => {
            this.columns = afterSaleColumns
            this.getList()
          })
        }
      }
    }
  },
  created() {
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.$store.dispatch('global/getComplaintStatusEumDtoEnum')
    // this.getList()
    // this.getNumbers()
    // 从主页跳过来的参数 || 详情页页
    this.initParams()
    this.getStaffUserList()// 修改操作人 全部修改人列表
  },
  mounted() {
    const { batchId, query, activeChannelState, activeState } = this
    this.$nextTick(() => {
      if (batchId) {
        this.$refs.searchs?.set({
          type: 'defaultVal',
          data: {
            batchId
          }
        })
        this.query = {
          ...query,
          batchId
        }
      }
      // 详情页面跳转携带参数查询历史工单
      if (this.$route.query.length !== 0) {
       const { uid, userMobile, workType } = this.$route.query
        //  投诉单
        if (!workType && (uid || userMobile)) {
        this.$refs.searchs?.set({
          type: 'defaultVal',
          data: {
            selectName: uid ? '3' : userMobile ? '2' : '',
            inputName: uid || (userMobile || '')
          }
        })
        this.query = {
          ...query,
          userId: uid,
          userMobile
        }
         this.getList()
        }
        // 新售后单
        if (workType) {
          this.setSearchAfterSale(workType)
          this.$nextTick(() => {
          const { uid, userMobile } = this.$route.query
          if (uid || userMobile) {
            this.$refs.searchs?.set({
             type: 'defaultVal',
             data: {
               selectName: uid ? '3' : userMobile ? '2' : '',
               inputName: uid || (userMobile || '')
             }
           })
          }
          })
        this.query = {
          ...query,
          userId: uid,
          userMobile,
          workOrderType: workType
        }
         this.getList()
        }
      }
      const code = this.$route.params && this.$route.params.type ? this.$route.params.type : '1011'
      this.userTypeFn(code)
      this.setResetVal('channelId')
      this.setResetVal('problemId')
      this.getBypidChannel(code)
      this.getProblemChannel(code, 'problemId')
      if (activeChannelState === '1011' && activeState === '0') {
          this.setSearchData()
      }
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
    wordWrapping(text) {
      return text?.replace(/\|/img, '</br>') || '未分类'
    },
    changeCpStatusSub(val) {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.getList()
    },
    // 从主页跳过来的参数
    initParams() {
      const params = this.$route.params
      if (params.type && params.type !== '1011') {
        this.activeChannelState = params.type
      } else if (getQueryObject(window.location.href).channelPid) {
        this.activeChannelState = getQueryObject(window.location.href).channelPid
      }
      if (params.status && params.status !== '0') {
        if (params.cpStatusRadio && params.cpStatusRadio !== '0') {
          this.initCpStatusRadio = params.cpStatusRadio
        }
        this.activeState = params.status
      }
    },
    // 用户类型联动
    userTypeFn(val) {
      const tabType = ['1031', '1041', '1071', '1051', '1081', '2011']
      if (tabType.includes(val)) {
      this.$refs.searchs?.set({
        type: 'options',
        data: {
          userType: this.userTypeEum['all']
        }
      })
      } else {
      this.$refs.searchs?.set({
        type: 'options',
        data: {
          userType: this.userTypeEum[val]
        }
      })
      }
    },
    // 修改搜索项是否显示和隐藏
    setSearchVisibleData(data, flag) {
       data.map(val => {
         this.$refs.searchs?.set({
           type: 'visible',
           data: {
             [val]: flag
           }
         })
       })
    },
    visibleParameters(DataTrue, DataFalse) {
        this.$nextTick(() => {
          this.setSearchVisibleData(DataTrue, true)
          this.setSearchVisibleData(DataFalse, false)
        })
    },
    // 班主任课程顾问联动
    userRemarkFn(val) {
      const tabType = ['1031', '1041', '1071', '1051', '1081', '2011']
      if (val === '1011') { // 1v1用户
        const visibleDataTrue = ['userRemarkNine', 'userRemarkTwo', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['useRemarkOne', 'userRemarkThree', 'userRemarkTwo3', 'userRemarkTwo2', 'userRemarkFour', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      } else if (val === '1012') { // 1v1老师
        const visibleDataTrue = ['userRemarkTwo1', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['userRemarkNine', 'userRemarkTwo', 'userRemarkTwo2', 'userRemarkFour', 'userRemarkTwo3', 'useRemarkOne', 'userRemarkThree', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      } else if (val === '1021') { // 小班课用户
        const visibleDataTrue = ['userRemarkTwo2', 'userRemarkFour', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['userRemarkNine', 'userRemarkTwo', 'userRemarkTwo1', 'userRemarkTwo3', 'useRemarkOne', 'userRemarkThree', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      } else if (val === '1022') { // 小班课老师
        const visibleDataTrue = ['userRemarkTwo3', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['userRemarkTwo2', 'userRemarkFour', 'userRemarkNine', 'userRemarkTwo', 'userRemarkTwo1', 'useRemarkOne', 'userRemarkThree', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      } else if (tabType.includes(val)) { // 小熊
        const visibleDataTrue = ['useRemarkOne', 'userRemarkThree', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['userRemarkTwo3', 'userRemarkTwo2', 'userRemarkFour', 'userRemarkNine', 'userRemarkTwo', 'userRemarkTwo1', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      } else { // 书画院
        const visibleDataTrue = ['problemId', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
        const visibleDataFalse = ['useRemarkOne', 'userRemarkThree', 'userRemarkTwo3', 'userRemarkTwo2', 'userRemarkFour', 'userRemarkNine', 'userRemarkTwo', 'userRemarkTwo1', 'logisticsId', 'outTradeNo', 'exceedStandard']
        this.visibleParameters(visibleDataTrue, visibleDataFalse)
      }
      this.$refs.searchs?.set({
        type: 'defaultVal',
        data: {
          userRemarkTwo1: undefined,
          userRemarkNine: undefined,
          userRemarkTwo: undefined,
          userRemarkTwo2: undefined,
          userRemarkFour: undefined,
          userRemarkTwo3: undefined,
          useRemarkOne: undefined,
          userRemarkThree: undefined,
          workOrderType: '1'
        }
      })
    },
    changeDate(val) {
      this.valueDate = val
      if (this.queryListType === 'list' || this.queryListType === 'afterSaleList') {
         this.getList()
      } else if (this.queryListType === 'worklist') {
         this.getworkList()
      }
    },
    changeTimeType(val) {
      this.filterTimeType = val
    },
    // 获取投诉列表
    getList(type) {
      const { query, listQuery, activeState, activeChannelState, valueDate, filterTimeType, cpStatusRadio } = this
      let beginTime, endTime
      if (valueDate) {
        beginTime = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        endTime = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      } else {
        beginTime = undefined
        endTime = undefined
      }
      var obj = {}
      if (query.selectName) {
        switch (query.selectName) {
          case '3':
            obj.userId = query.inputName
            break
          case '2':
            obj.userMobile = query.inputName
            break
          case '1':
            obj.userName = query.inputName
            break
          default:
            break
        }
      }
      if (query.selectName1) {
        switch (query.selectName1) {
          case '2':
            obj.currentStaffMobile = query.inputName1
            break
          case '1':
            obj.currentStaffName = query.inputName1
            break
          default:
            break
        }
      }
      const data = {
        ...query,
        ...obj,
        cpStatusSub: cpStatusRadio,
        cpStatus: activeState === '0' ? undefined : activeState,
        channelPid: activeChannelState,
        // pendingType: query.pendingType ? query.pendingType : undefined,
        [`${filterTimeType}Begin`]: beginTime,
        [`${filterTimeType}End`]: endTime,
        problemId: this.queryListType === 'afterSaleList' ? query.problemId : this.tranTreeData(query.problemId),
        problemIdThree: query.problemIdThree,
        problemIdFour: query.problemIdFour,
        problemIdFive: query.problemIdFive
      }

      // 多选不传
      if (!data.channelId || data.channelId && data.channelId?.length <= 0) delete data.channelId
      if (!data.userType || data.userType && data.userType?.length <= 0) delete data.userType
      if (!data.problemId || data.problemId && data.problemId?.length <= 0) delete data.problemId
      if (!data.role || data.role && data.role?.length <= 0) delete data.role

      if (data.time) delete data.time
      if (data.inputName) delete data.inputName
      if (data.inputName1) delete data.inputName1
      if (data.userRemarkTwo1) {
        data.userRemarkTwo = data.userRemarkTwo1
        delete data.userRemarkTwo1
      }
      if (data.userRemarkTwo2) {
        data.userRemarkTwo = data.userRemarkTwo2
        delete data.userRemarkTwo2
      }
      if (data.userRemarkTwo3) {
        data.userRemarkTwo = data.userRemarkTwo3
        delete data.userRemarkTwo3
      }
      delete data.selectName
      delete data.selectName1
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      const dataFilter = ['channelId', 'userType', 'role']
      // const dataFilter = ['channelId', 'userType', 'problemId', 'role']
      if (type === 'downLoad') {
        dataFilter.map(item => {
          if (data[item] && data[item]?.length > 0) {
            data[item] = data[item].join(',')
          }
        })
        exportSug({ ...data, cpStatusSub: cpStatusRadio }).then(res => {
          createBlob(`投诉数据统计.xls`, res)
        })
      } else if (type === 'SuperDownload') {
        // 超过2000条超级下载
        this.SuperDownload('list', data, cpStatusRadio)
      } else {
        getComplaintList({
          pageNumber: (listQuery.page) * 1 - 1,
          pageSize: listQuery.limit,
          ...data,
          userMobile: data.userMobile || '',
          workType: query.workOrderType === '6' ? '4' : ''
        }).then(res => {
          const data = res.payload || {}
          this.list = data.data || []
          this.total = (data.total) * 1 || 0
          // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          this.list = []
          this.total = 0
        })
        this.getOverTime({ ...data, userMobile: data.userMobile || '' })
      }
    },
    // 获取工单列表
    getworkList(getType) {
      const {
        listQuery: { page: pageNumber, limit: pageSize },
        activeState,
        activeChannelState,
        prioritySortFlag,
        prioritySortCliced,
        valueDate,
        query
      } = this
      let beginTime, endTime
      if (valueDate) {
        beginTime = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        endTime = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      } else {
        beginTime = undefined
        endTime = undefined
      }
      const payload = {
        pageNumber: pageNumber - 1,
        pageSize,
        // problemOneLevel: [query.workOrderType],
        problemOneLevel: [Number(query.workOrderType - 1) + ''],
        type: activeState === 'allNum' ? '0' : '1',
        businessId: activeChannelState.slice(0, 3),
        createUserId: getToken('userId'),
        createDateBegin: beginTime,
        createDateEnd: endTime,
        channelPid: activeChannelState,
        ...query
      }
      if (prioritySortCliced) {
        payload.sort = 'priority'
      }

      if (getType !== 'downLoad') {
        // 统计
        getWorkOrderListNum(payload).then(res => {
          if (res?.code === 0) {
            this.badgeData = res.payload
            const new_work_order_status = _.cloneDeep(work_order_status)
            // new_work_order_status.forEach(v => {
            // console.log(v)
            //   v.label = `${v.label}（${res.payload[work_order_status_key_map[v.value]] || 0}）`
            // })
            this.$refs.searchs?.set({
              type: 'options',
              data: {
                cpStatus: new_work_order_status
              }
            })
          }
        })
        // 列表
        getWorkOrderList({ ...payload, direction: prioritySortFlag ? 'ASC' : 'DESC' }).then(res => {
          if (res?.code === 0) {
            const { payload: { data, total }} = res
            if (data?.length) {
              data.forEach(v => {
                v.workUrlList = v.workUrl ? v.workUrl.split(',') : []
              })
            }
            this.list = data || []
            this.total = Number(total)
          }
        })
      } else if (getType === 'SuperDownload') {
        // 导出
        if (payload?.problemOneLevel?.length) {
          payload.problemOneLevel = payload.problemOneLevel.join(',') || ''
        } else {
          delete payload.problemOneLevel
        }
        if (payload?.problemTwoLevel?.length) {
          payload.problemTwoLevel = payload.problemTwoLevel.join(',') || ''
        } else {
          delete payload.problemTwoLevel
        }
        if (payload?.problemThreeLevel?.length) {
          payload.problemThreeLevel = payload.problemThreeLevel.join(',') || ''
        } else {
          delete payload.problemThreeLevel
        }
        if (payload?.cpStatus?.length) {
          payload.cpStatus = payload.cpStatus.join(',') || ''
        } else {
          delete payload.cpStatus
        }
        // 超过2000条超级下载
        this.SuperDownload('worklist', payload)
      } else {
        // 导出
        if (payload?.problemOneLevel?.length) {
          payload.problemOneLevel = payload.problemOneLevel.join(',') || ''
        } else {
          delete payload.problemOneLevel
        }
        if (payload?.problemTwoLevel?.length) {
          payload.problemTwoLevel = payload.problemTwoLevel.join(',') || ''
        } else {
          delete payload.problemTwoLevel
        }
        if (payload?.problemThreeLevel?.length) {
          payload.problemThreeLevel = payload.problemThreeLevel.join(',') || ''
        } else {
          delete payload.problemThreeLevel
        }
        if (payload?.cpStatus?.length) {
          payload.cpStatus = payload.cpStatus.join(',') || ''
        } else {
          delete payload.cpStatus
        }
        exportWorkOrderList(payload).then(res => {
          createBlob(`工单列表${moment().format('YYYY-MM-DD_HH:mm')}.xls`, res)
        })
      }
    },
    // 超过2000条预下载
    SuperDownload(type, data, val) {
      if (type === 'list') {
        const dataFilter = ['channelId', 'userType', 'role']
        dataFilter.map(item => {
          if (data[item] && data[item]?.length > 0) {
            data[item] = data[item].join(',')
          }
        })
        downloadComplaintSync({ ...data, cpStatusSub: val }).then(res => {
          console.log('投诉单预下载成功')
        })
      } else if (type === 'worklist') {
        exportWorkOrderListSync(data).then(res => {
          console.log('工单预下载成功')
        })
      }
    },
    tranTreeData(data) {
      if (!data) return undefined
      if (data?.length < 1) return undefined
      const str = data[1]
      return str
    },
    tranVisiData(data) {
      if (!data) return undefined
      if (data?.length < 1) return undefined
      const str = data.join('|')
      return str
    },
    // 默认搜索
    initSearch(val) {
      const { sort } = this.query
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.query = {
        ...val,
        sort
      }
      // this.query.createDateBegin = query.time ? query.time[0] : undefined,
      // this.query.createDateEnd = query.time ? query.time[1] : undefined,
      this.getList()
    },
    toCreateLink() {
      this.$router.push('/workOrder/workOrderCreateList')
    },
    // 下载数据
    exportDocument() {
      // 控制下载数据的时候不能超过60天
      const days = (24 * 60 * 60) * 60
      const beginTime = moment(this.valueDate && this.valueDate[0]).unix()
      const endTime = moment(this.valueDate && this.valueDate[1]).unix()
      const allTime = endTime - beginTime
      // 当时间范围大于60天
      if (allTime > days) {
        this.$alert('时间筛选超过了60天，请调整时间范围。<br/>仅能导出60天内的数据。', '', {
          confirmButtonText: '知道了',
          dangerouslyUseHTMLString: true
        })
      } else if (!this.valueDate) {
        this.$alert('请选择导出时间周期，不能为空', '', {
          confirmButtonText: '知道了',
          dangerouslyUseHTMLString: true
        })
      } else {
        // 导出数据超过2000
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
            if (this.queryListType === 'list' || this.queryListType === 'afterSaleList') {
             this.getList('SuperDownload')
             } else if (this.queryListType === 'worklist') {
              this.getworkList('SuperDownload')
            }
            // 跳去下载中心
            setTimeout(() => {
            this.$router.push({ name: 'downloadPage' })
            }, 3000)
           })
        } else {
          if (this.queryListType === 'list' || this.queryListType === 'afterSaleList') {
           this.getList('downLoad')
          } else if (this.queryListType === 'worklist') {
           this.getworkList('downLoad')
          }
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
        // 新售后单就不显示（处理结果（展示给用户））这个多选框
          this.$refs.complaintForm?.set({
            type: 'visible',
            data: {
              handleComentUser: this.queryListType = !'afterSaleList'
            }
          })
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
        this.$refs.complaintForm?.set({
          type: 'options',
          data: {
            oldId: staffList
          }
        })
        this.$refs.complaintForm?.set({
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
        // 设置下一层级之前，先清空选中的选项，不然会造成之前的数据还在，造成错误
        this.$refs.complaintForm.recoveryForm({
          [key]: null
        })
        this.$refs.complaintForm?.set({
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
      this.$nextTick(() => {
        this.$refs.complaintForm.set({
        type: 'visible',
        data: {
          channelPid: false,
          channelId: false
        }
       })
      })
      this.complaintNo = row.complaintNo
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.editFn = true
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
     const { query: { workOrderType }} = this
      const text = workOrderType === '6' ? '售后' : '投诉'
      if (type === 'tabbtn') {
        this.editTypeStatus = 'doItNow'
        this.info = {
          title: `确定记录${text}处理内容`,
          instroduct: `请输入${text}处理内容${workOrderType !== '6' ? ',如需关闭请选择关闭。' : ''}`
        }
        this.complaintForm = doItForm
       this.$nextTick(() => {
        this.$refs.complaintForm?.set({
          type: 'defaultVal',
          data: {
            workType: workOrderType + '' || null
          }
        })
        this.$refs.complaintForm?.set({
          type: 'visible',
          data: {
            workType: workOrderType !== '6',
            refundType: !!(workOrderType === '6' && row.logisticsId),
            closeEnumTpye: workOrderType !== '6'
          }
        })
      })
        this.dialogNewVisible = true

        this.complaintNo = row.complaintNo // 投诉单号
        this.cpStatus = '2' // 状态 或者为 3（点击关闭）
        // 如果点击关闭投诉 则传递状态值为4
        // 复现关闭
        if (this.closeEnumTpye) {
          const handleComent = this.handleComent
          this.$nextTick(() => {
            this.$refs.complaintForm?.set({
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
        } else { // 老售后
          window.open(`/workOrder/detail/${value}`)
        }
      }
    },
    // 关闭投诉
    closeComplaintFn(row) {
     const { query: { workOrderType }} = this
      const text = workOrderType === '6' ? '售后' : '投诉'
      this.info = {
        title: `确定关闭${text}`,
        instroduct: `请确定${text}问题已处理，关闭后用户将对您的处理服务进行满意度评价！`
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
        if (imgUrl?.length > 0) {
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
        if (val.closeEnumTpye && val.closeEnumTpye?.length > 0) {
          status = '3'
        }
        const { closeEnumNew } = val
        if (closeEnumNew || closeEnumNew === '') {
          val.closeEnum = closeEnumNew
          delete val.closeEnumNew
        }
        if (cpStatus === '6' && val.cpStatusRadio) {
          status = val.cpStatusRadio
          if (val.repeatReason) {
            val.invalidEnum = val.repeatReason
            delete val.repeatReason
          }
          delete val.cpStatusRadio
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
      this.cpStatus = '6' // 传递的状态
    },
    // 调取处理接口
    handleData(data) {
      data.sync = data.sync ? 1 : 0
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
        this.$refs.complaintForm?.set({
          type: 'visible',
          data: {
            repeatReason: val.type === '2'
          }
        })
        this.$refs.complaintForm?.set({
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
        this.$refs.complaintForm?.set({
          type: 'visible',
          data: {
            closeEnum: true
          }
        })
      } else {
        // this.cpStatus = '2'
        this.$refs.complaintForm?.set({
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
    // 搜索
    submitSearch(val, state = false) {
        if (this.queryListType === 'worklist') {
          // 点击重置
          if (state) {
            this.setSearchSug('1')
          } else {
            let searchValues = _.cloneDeep(val)
            // 搜索项 处理
            if (searchValues.userInfoInputSelectProp === '1') {
            searchValues.userId = ~~searchValues.userInfo || ''
           } else {
             searchValues.userMobile = ~~searchValues.userInfo || ''
           }
           if (searchValues.handleInfoInputSelectProp === '2') {
             searchValues.currentStaffId = ~~searchValues.handleInfo || ''
           } else {
             searchValues.currentStaffName = searchValues.handleInfo
           }
           searchValues = _.omit(searchValues, ['userInfoInputSelectProp', 'handleInfoInputSelectProp', 'userInfo', 'handleInfo'])
           !searchValues.problemTwoLevel?.length && delete searchValues.problemTwoLevel
           !searchValues.problemThreeLevel?.length && delete searchValues.problemThreeLevel
           this.query = searchValues
           this.getworkList()
          }
        } else if (this.queryListType === 'list' || this.queryListType === 'afterSaleList') {
          const { sort } = this.query
          // 点击重置
          if (state) {
            this.setChannel([], 'channelPid')
            this.activeState = '0'
            this.activeChannelState = '1011' // 回到1v1用户
            this.initSearch(val)
          } else {
            this.listQuery = {
              page: 1,
              limit: 20
            }
            this.query = val
            this.query = {
              ...val,
              sort
            }
            this.getList()
        }
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
          activeState: this.activeState || false,
          tableAction: this.tableAction
          })[this.activeState]
      this.classTeacherAct = classTeacherAct({
          exportDocument: this.exportDocument,
          flagSignSort: this.flagSignSort,
          flagSign: this.flagSign || false
          })
      this.afterSaleAct = afterSaleAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          tableAction: this.tableAction
          })[this.activeState]
      this.workOrderAct = workOrderAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          prioritySortFlag: this.prioritySortFlag || false
      })
      if (this.queryListType === 'worklist') {
      this.getworkList()
      } else if (this.queryListType === 'list') {
      this.getList()
      }
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
          activeState: this.activeState || false,
          tableAction: this.tableAction
        })[this.activeState]
      this.classTeacherAct = classTeacherAct({
          exportDocument: this.exportDocument,
          flagSignSort: this.flagSignSort,
          flagSign: this.flagSign || false
          })
      this.afterSaleAct = afterSaleAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          tableAction: this.tableAction
          })[this.activeState]
      this.workOrderAct = workOrderAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          prioritySortFlag: this.prioritySortFlag || false
      })
        this.getList()
    },
    // 搜索联动
    changeSearch(val, oldVal) {
      // 切换tabs保持 el-cascader 的key一致
      this.$refs.searchs?.set({
        type: 'attr',
        data: { problemId: { key: this.activeChannelState }}
      })
      const { sort } = this.query
      this.query = {
        ...val,
        sort
      }
      const { uid, userMobile } = this.$route.query
      if (!(uid || userMobile)) {
        if (this.judgeOptimi(val, oldVal, 'selectName')) this.setResetVal('inputName')
      }
      if (this.judgeOptimi(val, oldVal, 'selectName1')) this.setResetVal('inputName1')
      if (val.businessId !== oldVal.businessId && val.businessId) {
        this.setResetVal('channelPid')
        this.setResetVal('channelId')
        this.setResetVal('problemId')
        this.getBypidFn(val.businessId)
      }

      if (val.channelPid !== oldVal.channelPid && val.channelPid) {
        this.setResetVal('channelId')
        this.setResetVal('problemId')
        this.getBypidChannel(val.channelPid)
        this.getProblemChannel(val.channelPid, 'problemId')
      }
      const { channelId, problemId, problemIdThree, problemIdFour } = val
      if (val.workOrderType !== '6' && problemId?.toString() && problemId?.toString() !== oldVal?.problemId?.toString()) {
        this.recursionProb(['problemIdFive', 'problemIdFour', 'problemIdThree'])
        this.getSearchChild(problemId.toString(), 'problemIdThree')
      } else if (problemIdThree?.toString() && problemIdThree?.toString() !== oldVal?.problemIdThree?.toString()) {
        this.recursionProb(['problemIdFive', 'problemIdFour'])
        this.getSearchChild(problemIdThree.toString(), 'problemIdFour')
      } else if (problemIdFour?.toString() && problemIdFour?.toString() !== oldVal?.problemIdFour?.toString()) {
        this.recursionProb(['problemIdFive'])
        this.getSearchChild(problemIdFour.toString(), 'problemIdFive')
      }

      // 新售后工单的售后类型联动售后问题
      // if (val.workOrderType === '6' && problemId && problemId !== oldVal?.problemId) {
      //   this.getAfterSaleProblemFn(this.activeChannelState, problemId, channelId)
      // }
      // 投诉途径是有赞时投诉问题做改变
      if (val.workOrderType === '6' && channelId && channelId !== oldVal.channelId) {
        this.getAfterSaleProblemFn(this.activeChannelState, problemId, channelId)
      }
      // 工单类型联动二级三级效果
      // 2_技术工单二级分类
      // 4_质检工单二级分类
      // 5_售后工单二级分类
        const artServiceLine = ['1031', '1041', '1051', '1071', '1081', '2011']
        const oneVoneorClassServiceLine = ['1011', '1012', '1021', '1022']
        let second_mapData_2 = []
        let second_mapData_4 = []
        let second_mapData_5 = []
        let three_mapData_51 = []
        if (artServiceLine.includes(this.activeChannelState)) { // 这5个业务线 二级分类： 投诉销售 投诉教辅 投诉客服
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '52', '53'].includes(item.value))
          second_mapData_5 = work_order_second_map['5'].filter(item => ['101'].includes(item.value))
          three_mapData_51 = work_order_classification_map['51']
          if (this.activeChannelState === '1031') { // 小熊美术业务线显示小熊美术app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['11'].includes(item.value))
          } else if (this.activeChannelState === '1051') { // 小熊音乐业务线显示小熊音乐app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['14'].includes(item.value))
          } else { // 其他业务线显示小熊boss和其他
            second_mapData_2 = work_order_second_map['2'].filter(item => ['12', '13'].includes(item.value))
          }
        } else if (oneVoneorClassServiceLine.includes(this.activeChannelState)) { // 小班课 1v1 二级分类：投诉销售 投诉班主任 投诉客服 投诉教学老师
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '54', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        } else if (this.activeChannelState === '1061') { // 书画院 二级分类：投诉销售 投诉学管 投诉客服 投诉教学老师
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '56', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        }
        this.second_map = {
          '2': second_mapData_2,
          '4': second_mapData_4,
          '5': second_mapData_5
        }
        this.three_map = {
          ...work_order_classification_map,
          '51': three_mapData_51
        }

      // 根据选择的工单类型联动相应的二级分类
      if (this.queryListType === 'worklist') {
          this.$refs.searchs?.set({
          type: 'options',
          data: {
            problemTwoLevel: this.second_map[val.workOrderType === '3' ? '2' : val.workOrderType]
          }
        })
      if (val.problemTwoLevel !== oldVal.problemTwoLevel) {
        let options = []
        val.problemTwoLevel?.forEach(v => {
          options = [
          ...options,
          ...this.three_map[v]
          ]
        })
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            problemThreeLevel: options
          }
        })
      }
      }
    },
    // 监听工单类型的选项
    changeWorkOrderType(val) {
      const { activeChannelState } = this.useActiveState
      const tabType = ['1031', '1041', '1051', '1071', '1081', '2011']
      const workType = ['2', '3', '4', '5']// 技术问题 用户建议 质检工单 售后工单
      if (tabType.includes(activeChannelState)) { // 小熊用户 书法 舞蹈
        if (workType.includes(val)) {
          this.setSearchWork(val)
        } else if (val === '6') {
          this.setSearchAfterSale(val)
        } else {
          this.setSearchSug(val)
        }
      } else if (!tabType.includes(activeChannelState)) { // 1v1业务线+书画院
        if (['4', '5'].includes(val)) {
          this.setSearchWork(val)
        } else if (val === '6') {
          this.setSearchAfterSale(val)
        } else {
          this.setSearchSug(val)
        }
      }
      this.$refs.searchs?.set({
          type: 'defaultVal',
          data: {
            workOrderType: val
            }
      })
      this.query.workOrderType = val
    },
    // 重置 工单类型的表单
    setSearchWork(val) {
          this.filterTimedisabel = true
          this.activeState = 'allNum'
          const newSearch = []
          newSearch.push({
            ...this.searchs[0],
            defaultVal: val,
            visible: true
          }, ...this.workSearch)
          this.searchs = newSearch
          this.workKey = 'setSearchWork'
          this.newStateList = work_type_list
          this.filterTimeType = 'createDate'
          this.act = workOrderAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          prioritySortFlag: this.prioritySortFlag || false
         })[this.activeState]
          this.queryListType = 'worklist'
          this.actTimeKey = Date.now()
          this.getworkList()
    },
    // 重置 投诉单类型的表单
    setSearchSug(val) {
          this.filterTimedisabel = false
          this.activeState = '0'
          const newSearch = []
          newSearch.push({
            ...this.searchs[0],
            defaultVal: val,
            visible: true
          }, ...this.searchsForm.slice(1))
          this.searchs = newSearch
          this.workKey = 'setSearchSug'
          this.newStateList = new_express_type_list // 二级状态
          this.newChildrenStateList = new_express_children_type_list // 三级状态
          // 新售后工单隐藏
          this.userRemarkFn(this.activeChannelState)
          this.getProblemChannel(this.activeChannelState, 'problemId')
          this.$nextTick(() => {
          this.$refs.searchs?.set({
            type: 'label',
            data: {
              problemId: '投诉问题',
              problemIdThree: '三级分类',
              complaintNo: '投诉单',
              inputName: '投诉人',
              channelId: '投诉途径',
              cpComent: '投诉内容'
            }
          })
          this.$refs.searchs?.set({
            type: 'type',
            data: {
              problemId: 'cascader'
            }
          })
          this.searchs.map(i => {
            if (i.prop === 'problemId') {
              delete i.options
            }
            return i
          })
          })
          this.queryListType = 'list'
          this.act = act({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          activeState: this.activeState || false,
          tableAction: this.tableAction
          })[this.activeState]
          this.actTimeKey = Date.now()
          this.getList()
    },
    // 重置 新售后单的表单
    setSearchAfterSale(val) {
          this.filterTimedisabel = false
          this.activeState = '0'
          const newSearch = []
          newSearch.push({
            ...this.searchs[0],
            defaultVal: val,
            visible: true
          }, ...this.searchsForm.slice(1))
          this.searchs = newSearch
          this.workKey = 'setSearchAfterSale'
          this.newStateList = after_sale_type_list // 二级状态
          this.newChildrenStateList = after_sale_children_type_list // 三级状态
          // 新售后工单
          const visibleDataTrue = ['logisticsId', 'outTradeNo', 'exceedStandard']
          const visibleDataFalse = ['useRemarkOne', 'userRemarkThree', 'userRemarkTwo3', 'userRemarkTwo2', 'userRemarkFour', 'userRemarkTwo1', 'problemIdFour', 'problemIdFive', 'restartTimes', 'pendingType']
          this.visibleParameters(visibleDataTrue, visibleDataFalse)
          this.getAfterSaleProblemFn(this.activeChannelState)
          this.$nextTick(() => {
          this.$refs.searchs?.set({
            type: 'label',
            data: {
              problemId: '售后类型',
              problemIdThree: '售后原因',
              complaintNo: '售后单',
              inputName: '售后人',
              channelId: '售后途径',
              cpComent: '售后内容'
            }
          })
          this.$refs.searchs?.set({
            type: 'type',
            data: {
              problemId: 'select'
            }
          })
          })
          this.act = afterSaleAct({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          tableAction: this.tableAction
          })[this.activeState]
          const { workType } = this.$route.query
          // 详情页面跳转携带参数查询历史工单不请求列表
          if (!workType) {
             this.queryListType = 'afterSaleList'
             this.actTimeKey = Date.now()
             this.getList()
          }
    },
    // 每次切换业务线的初始化数据表单
    setSearchData() {
        this.filterTimedisabel = false
        this.activeState = '0'
          const newSearch = []
          newSearch.push({
            ...this.searchs[0],
            defaultVal: '1'
          }, ...this.searchsForm.slice(1))
          newSearch[4].options = this.userTypeEum['1011']
          this.searchs = newSearch
          this.workKey = 'setSearchData'
          this.userRemarkFn(this.activeChannelState)
          this.$nextTick(() => {
          this.$refs.searchs?.set({
            type: 'label',
            data: {
              problemId: '投诉问题',
              problemIdThree: '三级分类',
              complaintNo: '投诉单',
              inputName: '投诉人',
              channelId: '投诉途径',
              cpComent: '投诉内容'
            }
          })
          })
          this.act = act({
          exportDocument: this.exportDocument,
          prioritySort: this.prioritySort,
          flagSignSort: this.flagSignSort,
          prioritySortFlag: this.prioritySortFlag || false,
          flagSign: this.flagSign || false,
          activeState: this.activeState || false,
          tableAction: this.tableAction
          })[this.activeState]
          this.queryListType = 'list'
          this.actTimeKey = Date.now()
          this.getList()
    },
    // 获取子问题
    getSearchChild(val, key) {
      const params = {
        pids: val
      }
      getBypidsFilter(params).then(res => {
        const data = res.payload || []
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            [key]: this.tranFormChildData(data)
          }
        })
      })
    },
    // 投诉来源
    getBypidFn(val) {
      getBypid({ pid: val }).then(res => {
        this.setChannel(res.payload, 'channelPid')
      })
    },
    // 投诉途径
    getBypidChannel(val) {
      getBypid({ pid: val }).then(res => {
        this.setChannel(res.payload, 'channelId')
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
    // 设置投诉来源
    setChannel(val, key, type) {
      this.$nextTick(() => {
        if (type === 'form') {
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [key]: this.tranFormData(val)
            }
          })
        } else {
          this.$refs.searchs && this.$refs.searchs?.set({
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
        this.$nextTick(() => {
          this.$refs.searchs?.set({
            type: 'options',
            data: {
              problemId: arr
            }
          })
        })
        // this.setChannel(arr, key, type)
      })
    },
    // 获取新售后的售后类型（二级问题）
    getAfterSaleProblemFn(val, pid, cid) {
      const data = {
        channelPid: val,
        problemId: pid || '',
        channelIds: cid?.join(',') || ''
      }
      getAfterSaleProblem(data).then(res => {
        const data = res.payload
        const arr = []
        data.forEach(item => {
          if (item.problemStatus === 0) {
            const obj = {}
            obj.label = item.cpType
            obj.value = item.problemIdNew
            arr.push(obj)
          }
        })
        this.$nextTick(() => {
          if (!pid) {
          this.$refs.searchs?.set({
            type: 'options',
            data: {
              problemId: arr
            }
          })
          } else {
          this.$refs.searchs?.set({
            type: 'options',
            data: {
              problemIdThree: arr
            }
          })
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
    // 返回判断结果
    judgeOptimi(val, oldVal, judge) {
      return val[judge] && val[judge] !== oldVal[judge]
    },
    // 根据表单数据动态设置显示隐藏
    recursionProb(problemArr) {
      console.log(problemArr, 'problemArr')
      problemArr.map(res => {
        this.$refs.searchs?.set({ type: 'options', data: { [res]: null }})
        this.$refs.searchs.recoveryForm({ [res]: null })
      })
    },
    // 清空下拉框的值
    setResetVal(key) {
      this.$refs.searchs?.set({
        type: 'defaultVal',
        data: {
          [key]: undefined
        }
      })
    },
    // 获取任务是否超时
    getOverTime(payload) {
      // 超时未处理不与此筛选条件挂钩
      payload.cpStatus && delete payload.cpStatus
      payload.cpStatusSub && delete payload.cpStatusSub
      getJudgeOverTime(payload).then(res => {
        const data = []
        if (res.code === 0 && res.payload?.length) {
          res.payload.forEach(v => {
            if (v.cpStatusSub === 13) {
              data.push('1')
            } else if (v.cpStatusSub === 22) {
              data.push('2')
            }
          })
        }
        this.overTimeData = data
      })
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
      const complaintNos = this.checkoutList.map(i => i.complaintNo).join(',')
      const param = {
        complaintNo: complaintNos,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile'),
        newStaffId,
        newStaffMobile,
        newStaffName
      }
      // 批量修改操作人的api
      modifyProblemAcceptBatch(param).then(res => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.getList()
          this.initParams()
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
            this.initParams()
            this.getStaffUserList()
          }
        })
      }
    },
    // 批量选中复选框事件
    handleSelectionChange(val) {
      // 选中的数量
      this.checkoutNum = val?.length
      this.checkoutList = val
      this.data = val[0]
      // 替换当前详情的row
      this.tableActionRow = val[0]
    },
    // 提示选中要操作的投诉单提示框
    actionsOpen() {
      const { query: { workOrderType }} = this
      const text = workOrderType === '6' ? '售后' : '投诉'

      this.$alert(`请先选择需要操作的${text}单`, '', {
        confirmButtonText: '知道了',
        showClose: false
      })
    },
    // 工单列表的处理状态点击
    handleStatusClick(data) {
      this.$nextTick(() => {
      this.handleModalVis('handleStatus', data)
      })
    },
    // 工单列表处理对话框
    handleModalVis(type, modalData, ifUpList) {
      if (type) {
        this.modalType = type
        if (modalData) {
          this.modalData = modalData
        }
      } else {
        this.modalType = ''
        this.modalData = ''
      }
      ifUpList && this.initParamsAndGetList()
    },
    // 点击工单类型的优先级
    handlePriorityTagClick(data) {
      if (data.cpStatus === 3) {
        this.$message.warning('已关闭的工单不可修改优先级～')
        return
      }
      this.handleModalVis('priority', data)
    },
    // 列表点击循环变颜色
    clickFlag(scope) {
      const { row, $index } = scope
      const i = row.flagSign
      const index = this.flagSignColordata[i < 0 || i >= 3 ? 0 : i + 1 ]
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
    popoverVisibleFn(val) {
      const { row } = val
      this.workUrlList = row.workUrlList
      this.urlVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
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

.cp-status-radio {
  margin-bottom: 15px;
  .el-radio{
    margin-right: 5px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
  .el-radio__input{
    display: none;
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
  padding: 10px 20px;
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
      width: 100px !important;
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
    span{
      color: rgba(0,0,0,0.85);
      font-weight: 600;
      font-size: 18px;
      line-height: 36px;
    }
  }
.tabpaneBadge {
  /deep/ {
    .el-badge__content.is-fixed.is-dot{
      margin-top: 12px;
      // right: 0;
    }
  }
}
.cursor-pointer-box {
  cursor: pointer;
}
/deep/.el-carousel__container{
    height: 600px;
    text-align: center;
}
.flagSign_stype{
  width: 300px;
  span{
    display: inline-block;
    width: 72px;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color: #606266;
  }
  .actionflag{
    margin-left: 20px;
    cursor: pointer;
  }
}
.urlDialog{
 /deep/ .el-dialog__header{
  padding:20px!important;
  border-bottom: none;
}
}
</style>
