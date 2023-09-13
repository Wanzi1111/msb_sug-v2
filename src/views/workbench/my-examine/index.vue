<template>
  <div v-loading.fullscreen.lock="permissionView">
    <div v-if="permission">
      <div class="app-container app-complain-title">
        <span>我的审批</span>
        <div>
          <el-date-picker
            v-model="daterangeTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="changeDate"
          />
        </div>
      </div>
      <div class="app-container">
        <el-tabs v-model="activeChannelState">
          <el-tab-pane
            v-for="(item, index) in TabList"
            :key="index"
            :disabled="loadings._ai_api_api_b_v1_staff_findStaffByMobile"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
        <basics-search
          ref="searchs"
          :searchs="searchs"
          :loading="loadings._ai_api_api_b_v1_staff_findStaffByMobile"
          @submitSearch="submitSearch"
          @changeSearch="changeSearch"
        >
          <!-- <template slot="handlePeople" class="search-item">
            <el-input
              v-model="searchQuery.inputName"
              placeholder="请输入学员ID/手机号"
              class="search-item-element"
              size="small"
            >
              <el-select
                slot="prepend"
                v-model="searchQuery.selectName"
                placeholder="请选择"
                class="el-input-select"
              >
                <el-option label="学员ID" value="1" />
                <el-option label="手机号" value="2" />
              </el-select>
            </el-input>
          </template> -->
          <template slot="departmentIds" class="search-item">
            <department
              ref="DepartmentIds"
              name="DepartmentIds"
              placeholder="全部部门"
              :only-dept="1"
              :active-channel-state="activeChannelState"
              @result="getSearchData1"
            />
          </template>
        </basics-search>
        <el-tabs v-model="activeState">
          <el-tab-pane
            v-for="(item, index) in TabListTwo"
            :key="index"
            :disabled="loadings._ai_api_api_b_v1_staff_findStaffByMobile"
            :label="item.label"
            :name="item.value"
          >
            <span v-if="item.key" slot="label" class="tabpaneBadge">
              <el-badge :value="item.key">{{ item.label }}</el-badge>
            </span>
          </el-tab-pane>
        </el-tabs>
        <basics-table
          ref="table"
          :table="table"
          :list="list"
          :get-list="getList"
          :columns="columns"
          :total="total"
          :loading="
            loadings._ai_api_api_b_v1_approval2_list_showAll ||
              loadings._ai_api_api_b_v1_staff_findStaffByMobile ||
              loadings._ai_api_api_b_v1_approval2_list_apply ||
              loadings._ai_api_api_b_v1_approval2_list_pending
          "
          :list-query="listQuery"
        >
          <template slot="applyName" slot-scope="scope">
            <div>
              {{ scope.row.applyName }}
            </div>
            <div>
              {{ scope.row.applyDepartment }}
            </div>
          </template>
          <template slot="type" slot-scope="scope">
            <div>
              {{
                typeListStatus[scope.row.type]
              }}
            </div>
          </template>
          <template slot="userTel" slot-scope="scope">
            <div class="columns-txt">
              {{ scope.row.userTel=== disturbMobile ? scope.row.userTel
                :`${scope.row.userTel.slice(0,3)}****${scope.row.userTel.slice(-4)}` }}
              <svg-icon
                v-show="scope.row.userTel"
                style="cursor: pointer"
                :icon-class="disturbMobileIcone(scope.row.userTel)"
                @click="isDisturbMobile(scope.row.userTel)"
              />
            </div>
          </template>
          <template slot="periodName" slot-scope="scope">
            {{

              periodNameStatus[activeChannelState === 'DANCE_APP'? scope.row.orderRegType :
                activeChannelState === 'HANDWORK_APP'?'HANDMADE'
                : scope.row.managementType]
            }}
            {{ scope.row.periodName }}
          </template>
          <template slot="repiarContent" slot-scope="scope">
            <div>{{ scope.row.repiarContent }}</div>
            <div>
              <span v-if="scope.row.type === 'ADJUSTMENT_SUP'">{{
                formatTeamNameSup(scope.row.period)
              }}</span>
              <span v-else>{{ scope.row.period }}</span>
            </div>
            <div>
              <span v-if="scope.row.type === 'ADJUSTMENT_SUP'">{{
                formatTeamNameSup(scope.row.receptContent) || "-"
              }}</span>
              <span v-else>{{ scope.row.receptContent }}</span>
            </div>
            <div>{{ scope.row.reason }}</div>
            <div>{{ scope.row.extra }}</div>
          </template>
          <template slot="status" slot-scope="scope">
            <div class="wait-pending" @click="getApprovalDeatail(scope.row)">
              {{
                {
                  PENDING: "待审批",
                  REVOCATION: "审批撤销",
                  COMPLETED: "审批通过",
                  DECLINE: "审批拒绝",
                }[scope.row.status]
              }}
            </div>
          </template>
          <template slot="action" slot-scope="scope">
            <div
              v-if="
                scope.row.status === 'PENDING' && scope.row.applyId === staffId
              "
              class="wait-pending"
              @click="revocation(scope.row.id)"
            >
              撤销
            </div>
            <div v-else>--</div>
          </template>
        </basics-table>
      </div>
    </div>
    <!-- 退款详情抽屉_全托 -->
    <refundDrawer
      v-if="currentType === 'REFUND' && isRouterAlive"
      :key="isRouterAlive"
      ref="refundDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :diolog-refund-tag="diologRefundTag"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :channel-pid-value="channelPidValue"
    />
    <!-- 补发货详情抽屉_全托 -->
    <repairDrawer
      v-if="currentType === 'REISSUE' && isRouterAlive"
      :key="isRouterAlive"
      ref="repairDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :channel-pid-value="channelPidValue"
    />
    <!-- 随材打包抽屉_全托 -->
    <packageDrawer
      v-if="currentType === 'PACKAGE_BOX' && isRouterAlive"
      :key="isRouterAlive"
      ref="packageDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :channel-pid-value="channelPidValue"
    />
    <!-- 订单转入抽屉_全托 -->
    <entryOrderDrawer
      v-if="currentType === 'CHANGE_CUSTOMER_IMPORT' && isRouterAlive"
      :key="isRouterAlive"
      ref="entryOrderDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :user-drawer-id="userDrawerId"
      :channel-pid-value="channelPidValue"
    />
    <!-- 学员转班抽屉_全托 -->
    <reverseConceptDrawer
      v-if="currentType === 'CHANGE_CUSTOMER' && isRouterAlive"
      :key="isRouterAlive"
      ref="reverseConceptDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :diolog-refund-tag="diologRefundTag"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :channel-pid-value="channelPidValue"
    />
    <!-- 商城物流撤单抽屉_全托 -->
    <aftermarketDrawer
      v-if="currentType === 'BEAR_GOLD_COIN' && isRouterAlive"
      :key="isRouterAlive"
      ref="aftermarketDrawer"
      :name="activeState"
      :for-son-data-approval-person-id="forSonDataApprovalPersonId"
      :for-son-data-approval-id="forSonDataApprovalId"
      :diolog-refund-tag="diologRefundTag"
      :active-channel-state="activeChannelState"
      :staff-id="staffId"
      :real-name="realName"
      :channel-pid-value="channelPidValue"
    />
    <div v-if="!permission" class="app-box">
      <el-table
        :empty-text="emptyText"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { TabListOne, TabListTwo } from './config'
import searchs from './search'
import columns from './columns/index'
import {
  findStaffByMobile,
  showAllList,
  pendingList,
  applyList,
  completedList,
  getReplenishReset,
  getDepartmentTeacherEx,
  getPeriods,
  getAllCount
} from '@/api/myExamine'
import { getToken } from '@/utils/auth'
import { formatTeamNameSup, SUP_LEVEL_UPPER, timestamp } from '@/utils'
import refundDrawer from './components/refundDrawer.vue'
import repairDrawer from './components/repairDrawer'
import packageDrawer from './components/packageDrawer.vue'
import entryOrderDrawer from './components/entryOrderDrawer.vue'
import reverseConceptDrawer from './components/reverseConceptDrawer.vue'
import aftermarketDrawer from './components/aftermarketDrawer.vue'
import Department from '@/components/MSearch/searchItems/department'
import { rainbowFart } from '@/utils/mini_tool_lk'
import { getUserInfoById } from '@/api/settings/assign-complaint'
const init_pagaination = {
  page: 1,
  limit: 20
}
const {
  baseData: {
    productVersion_type,
    onlyStatus_type,
    music_app_productVersion,
    write_app_productVersion,
    course_type,
    write_app_courseOptions,
    music_app_courseOptions,
    dance_app_courseOptions,
    handmade_courseOptions

  }
} = window
export default {
  name: 'MyExamine',
  components: {
    refundDrawer,
    repairDrawer,
    Department,
    packageDrawer,
    entryOrderDrawer,
    reverseConceptDrawer,
    aftermarketDrawer
  },
  data() {
    return {
      permissionView: false,
      permission: false, // 是否可见
      TabListOne,
      TabListTwo,
      activeChannelState: 'null',
      daterangeTime: [
        new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1000
        )
      ],
      activeState: '0',
      searchs,
      searchQuery: {
        // inputName: '',
        // selectName: '1',
        selectedInData: '1'
      },
      columns,
      list: [],
      table: {
        stripe: false,
        border: false
      },
      userTel: '',
      queryUserTel: this.$route.params.userTel,
      listQuery: { ...init_pagaination },
      staffId: '',
      realName: '',
      total: 0,
      productVersion_type,
      onlyStatus_type,
      music_app_productVersion,
      write_app_productVersion,
      course_type,
      write_app_courseOptions,
      music_app_courseOptions,
      dance_app_courseOptions,
      handmade_courseOptions,
      formatTeamNameSup,
      SUP_LEVEL_UPPER,
      timestamp,
      rainbowFart,
      currentType: '', // 申请单类型
      forSonDataApprovalPersonId: '', // 申请单申请人id
      forSonDataApprovalId: '', // 申请单id
      diologRefundTag: '', // 退款特有的
      teacherList: [],
      type: '',
      typeObj: {
        'ART_APP': course_type,
        'WRITE_APP': write_app_courseOptions,
        'MUSIC_APP': music_app_courseOptions,
        'DANCE_APP': dance_app_courseOptions,
        'HANDWORK_APP': handmade_courseOptions
      },
      // typeListStatus: {},
      badgeObj: {},
      departmentIds: '',
      serviceObject: '',
      templateParamObj: {},
      isRouterAlive: '',
      userDrawerId: '',
      emptyText: '您当前账户的手机号和小熊boss账户手机号不匹配，暂不能查看此页面～',
      disturbMobile: ''

    }
  },
  computed: {
    ...mapGetters(['loadings']),
    // 处理不同业务线类别的审批类型状态
    typeListStatus() {
      const { activeChannelState, productVersion_type, write_app_productVersion, music_app_productVersion } = this
      const obj = {}
      let data = []
      if (activeChannelState === 'ART_APP' || activeChannelState === 'DANCE_APP') {
        data = productVersion_type
      } else if (activeChannelState === 'WRITE_APP') {
        data = write_app_productVersion
      } else {
        data = music_app_productVersion
      }
      data.map(val => {
        obj[val.value] = val.label
      })
      return obj
    },
    // 筛选业务线
    filterPeriodNameStatus() {
      const { activeChannelState, course_type, dance_app_courseOptions, write_app_courseOptions, music_app_courseOptions } = this
      let newdata = []
      if (activeChannelState === 'ART_APP') {
        newdata = course_type
      } else if (activeChannelState === 'DANCE_APP') {
        newdata = dance_app_courseOptions
      } else if (activeChannelState === 'WRITE_APP') {
        newdata = write_app_courseOptions
      } else if (activeChannelState === 'MUSIC_APP') {
        newdata = music_app_courseOptions
      } else if (activeChannelState === 'HANDWORK_APP') {
        newdata = handmade_courseOptions
      }
      return newdata
    },
    // 课程类型
    periodNameStatus() {
      const newobj = {}
      this.filterPeriodNameStatus.map(val => {
        newobj[val.value] = val.label
      })
      return newobj
    },
    // 根据员工名片勾选的业务线显示tab业务线
    TabList() {
      const { serviceObject, TabListOne } = this
      const serviceArr = serviceObject.split(',')
      const tabList = TabListOne.filter(item => {
        if (serviceArr.includes(item.key)) {
          return item
        }
      })
      return tabList
    },
    channelPidValue() {
      return this.TabList.find(val => val.value === this.activeChannelState)?.key
    },
    // 控制电话眼
    disturbMobileIcone() {
      return function(e) {
        if (e !== this.disturbMobile) {
          return 'eye'
        } else {
          return 'eye-open'
        }
      }
    }
  },
  watch: {
    // 监听业务线
    activeChannelState: function(val, oldVal) {
      if (val !== oldVal && val !== 'null') {
        this.activeState = '0'
        if (this.$refs.DepartmentIds) {
          this.$refs.DepartmentIds.dataValue = ''
        }
        this.$refs.searchs?.set({
          type: 'defaultVal',
          data: {
            type: '',
            userTel: '',
            managementType: '',
            period: '',
            teacherIds: '',
            id: '',
            selectedInData: '1',
            onlyStatus: ''
          }
        })
        this.searchQuery = {
          selectedInData: '1'
        }
        this.getList()
      }
      if (val === 'ART_APP' || val === 'DANCE_APP') {
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            type: this.productVersion_type
          }
        })
      } else if (val === 'WRITE_APP') {
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            type: this.write_app_productVersion
          }
        })
      } else {
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            type: this.music_app_productVersion
          }
        })
      }
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            managementType: this.typeObj[val]
          }
        })
        // 舞蹈用户的时候不显示期数 其他业务线显示
        this.$refs.searchs?.set({
          type: 'visible',
          data: {
            period: !['DANCE_APP', 'HANDWORK_APP'].includes(val)
          }
        })
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            period: []
          }
        })
    },
    // 监听审批类型
    activeState: function(val, oldVal) {
      if (val !== oldVal) {
        this.$refs.searchs?.set({
          type: 'visible',
          data: {
            onlyStatus: val !== '1'
          }
        })
        this.getList()
      }
    }
  },
  created() {
    this.$store.dispatch('global/BusinessTypeSupplierNameList')
  },
  mounted() {
    this.$nextTick(() => {
      this.getAutoComplaintStatus()
    })
  },
  methods: {
    // 获取可以看几条业务线
    getAutoComplaintStatus() {
      getUserInfoById({ userId: getToken('userId') }).then(res => {
        if (res?.code === 0) {
          const { serviceObject: servicestr } = res.payload
          this.serviceObject = servicestr
          this.getFindStaffByMobile()
          this.getTeacher()
        }
      })
    },
    // 获取全部老师
    getTeacher(query = '') {
      const q = {
        bool: {
          must: query
            ? [{ wildcard: { 'realname.keyword': `*${query}*` }}]
            : []
        }
      }
      const data = {
        query: q,
        size: 20
      }
      const newData = {
        data,
        query: `{
        TeacherListEx(query: ${JSON.stringify(JSON.stringify(q))}, size: ${20}){
          id
          realname
          phone
          subject
          duty_id
          departmentInfo {
            name
          }
          work_status
        }
      }`
      }
      getDepartmentTeacherEx(newData).then((res) => {
        this.$nextTick(() => {
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            teacherIds: this.tranFormData(res.data.TeacherListEx)
          }
        })
        })
      })
    },
    // 转化数据
    tranFormData(data) {
      return data.map((item) => {
        return {
          label: item.realname || item.period_name,
          value: item.period || item.id
        }
      })
    },
    // 搜索表单提交事件
    submitSearch(val, state = false) {
      if (state) {
        this.activeState = '0'
        this.activeChannelState = this.TabList[0].value // 回到小熊美术
        this.daterangeTime = [
          new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1000
          )
        ]
        this.$refs.searchs?.set({
          type: 'options',
          data: {
            period: []
          }
        })
        this.searchQuery = {
          selectedInData: '1'
        }
        this.$refs.DepartmentIds.dataValue = ''
        this.departmentIds = ''
        this.queryUserTel = ''
      } else {
        this.searchQuery = {
          ...this.searchQuery,
          ...val,
          departmentIds: this.departmentIds,
          period: String(val.period)
        }
      }
      this.getList()
    },
    // 搜索表单的变化事件
    changeSearch(val, oldVal) {
      if (val.managementType && val.managementType !== oldVal.managementType) {
        // 根据课程类型获取期数的type参数不同
        this.type = this.filterPeriodNameStatus.find(item => item.value === val.managementType).key
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: {
            period: ''
          }
        })
        this.getData()
      }
    },
    // 获取期数
    getData(queryString = '') {
      const { activeChannelState } = this
      let subject = 0
      if (activeChannelState === 'ART_APP') {
           subject = 0
      } else if (activeChannelState === 'DANCE_APP') {
           subject = 5
      } else if (activeChannelState === 'WRITE_APP') {
           subject = 1
      } else if (activeChannelState === 'MUSIC_APP') {
           subject = 3
      }
      const queryParams = {
        bool: {
          must: [
            { wildcard: { 'period_name.keyword': `*${queryString}*` }},
            { term: { subject }}
          ]
        }
      }
      if (this.type) {
        queryParams.bool.must.push({ term: { type: `${this.type}` }})
      }
      const query = queryParams
      const sort = { id: 'desc' }
      const newData = {
        data: {
          query,
          sort
        },
        query: `{
                  ManagementListEx(query:${JSON.stringify(
                    JSON.stringify(query)
                  )}, sort: ${JSON.stringify(JSON.stringify(sort))}){
                    id
                    period
                    period_name
                  }
                }`
      }
      getPeriods(newData).then((res) => {
        this.$refs.searchs.set({
          type: 'options',
          data: {
            period: this.tranFormData(res.data.ManagementListEx)
          }
        })
      })
    },
    // 部门搜索
    getSearchData1(val) {
      this.departmentIds = val.DepartmentIds
        ? String(val.DepartmentIds)
        : ''
    },
    // 用来获取审批列表的必传参数 staffId
    async getFindStaffByMobile() {
        const res = await findStaffByMobile({
          mobile: getToken('userMobile')
        })
        const { payload, code } = res
        this.permissionView = true
        if (code === 0) {
         this.permissionView = false
         // 没有有小熊的账号
         if (!payload) {
           this.permission = false
           this.emptyText = '您当前账户的手机号和小熊boss账户手机号不匹配，暂不能查看此页面～'
         }
         // 有小熊的账号
         if (payload) {
          this.staffId = payload.id
          this.realName = payload.realName
          // 有可操作的业务线可查看此页面
          if (this.TabList.length !== 0) {
            this.permission = true
          } else {
          // 没有可操作的业务线就无法查看此页面
           this.permission = false
           this.emptyText = '请检查当前用户在员工管理 - 员工列表中所负责的业务线是否包含“小熊美术”、“小熊书法”、“小熊音乐”、“小熊舞蹈”、“小熊手工”中的至少一个～'
          }
        // 当从详情页跳进来看审批进度的根据手机号查询
        const { key, userTel } = this.$route.params
        const { subject, id } = this.$route.query
        const tabValue = this.TabListOne.find(val => val.key === key || val.key === subject)
           if (key && userTel && tabValue) {
             this.activeChannelState = tabValue.value
             this.$forceUpdate()
             this.$nextTick(() => {
               this.$refs.searchs?.set({
                 type: 'defaultVal',
                 data: {
                   userTel: userTel
                 }
               })
             })
           } else if (subject && id && tabValue) { // 当从详情解决记录的查看审批跳进来看审批进度的根据审批单号查询
             this.activeChannelState = tabValue.value
             this.$forceUpdate()
             this.$nextTick(() => {
               this.$refs.searchs?.set({
                 type: 'defaultVal',
                 data: {
                   id: id
                 }
               })
             })
           } else {
             // 根据tab的改变自动调用获取审批列表和角标接口
             this.activeChannelState = this.TabList[0].value
           }
         }
        }
    },
    //   改变日期
    changeDate(val) {
      this.daterangeTime = val
    },
    // 根据业务线分类获取审批列表
    getList() {
      const { activeState } = this
      switch (activeState) {
        // 全部
        case '0':
          this.getExamineList(showAllList)
          break
        // 待我审批
        case '1':
          this.getExamineList(pendingList)
          break
        // 我发起的
        case '2':
          this.getExamineList(applyList)
          break
        // 我已审批
        case '3':
          this.getExamineList(completedList)
          break
      }
    },
    // 分别获取审批列表数据
    async getExamineList(valRequest) {
      const {
        activeChannelState,
        listQuery,
        staffId,
        searchQuery,
        daterangeTime,
        queryUserTel
      } = this
      const obj = {}
      if (searchQuery.selectedInData) {
        switch (searchQuery.selectedInData) {
          case '1':
            obj.startTime = moment(daterangeTime[0]).valueOf()
            obj.endTime = moment(daterangeTime[1]).valueOf()
            break
          case '2':
            obj.approvalStartTime = moment(daterangeTime[0]).valueOf()
            obj.approvalEndTime = moment(daterangeTime[1]).valueOf()
            break
          default:
            break
        }
      }
      if (this.$route?.query.length !== 0) {
        searchQuery.id = this.$route.query.id
      }
      const data = {
        ...searchQuery,
        ...obj,
        subject: activeChannelState,
        staffId,
        page: listQuery.page * 1 - 1,
        size: listQuery.limit,
        orderRegType: searchQuery.managementType,
        userTel: queryUserTel || searchQuery.userTel
      }

      delete data.selectedInData
      if (activeChannelState === 'DANCE_APP' || activeChannelState === 'HANDWORK_APP') {
      delete data.managementType
      } else {
      delete data.orderRegType
      }
      if (activeChannelState !== 'null') {
         this.getallKey(data)
      try {
        const res = await valRequest(data)
        const {
          code,
          payload: { content, totalElements }
        } = res
        if (code === 0) {
          this.total = +totalElements
          this.list = content.map((item) => {
            const zhaiyao = item.abstractContent.split('^')
            item.repiarContent = zhaiyao[0]
            item.period = zhaiyao[1]
            item.receptContent = zhaiyao[2]
            item.reason = zhaiyao[3]
            item.extra = zhaiyao[4]
            item.openTime = timestamp(item.ctime, 2)
            item.approveTime =
              item.endTime === '0' ? '--' : timestamp(item.endTime, 2)
            item.user = {
              id: item.uid,
              mobile: item.userTel
            }
            return item
          })
        }
      } catch (error) {
        this.$message.error('失败')
      }
      }
    },
    // 获取所有角标
    async getallKey(data) {
      const res = await getAllCount(data)
      const {
          code,
          payload
        } = res
        if (code === 0) {
          for (const key in payload) {
          this.TabListTwo.map(val => {
            if (val.index === key) {
              val.key = payload[key] !== '0' ? payload[key] : ''
            }
            return val
          })
          }
        }
    },
    // 撤销审批
    revocation(id) {
      this.$confirm('是否确定撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            flowApprovalId: id,
            subject: this.activeChannelState,
            staffId: this.staffId,
            channelPid: this.channelPidValue,
            staffName: getToken('cname'),
            operationName: getToken('cname'),
            operationMobile: getToken('userMobile'),
            operationId: getToken('userId')
          }
          getReplenishReset(data).then((res) => {
            if (res && !res.code) {
              this.$message.success('撤销成功')
              this.getList()
            } else {
              this.$message.error('撤销失败')
            }
          })
        })
        .catch(() => {})
    },
    // 审核状态
    getApprovalDeatail(row) {
      const { type, id, applyId, tag } = row
      this.currentType = type // 全局配置:申请单类型
      this.isRouterAlive = row.id
      this.forSonDataApprovalId = id // 全局配置:申请单id
      this.forSonDataApprovalPersonId = applyId // 全局配置:申请单申请人id
      this.diologRefundTag = tag // 仅退款详情:更改节点用到
      this.userDrawerId = row.userId
      // 本期只有退款和补发货有详情抽屉  其余跳进小熊boss后台
      const typeStatus = ['REFUND', 'REISSUE', 'PACKAGE_BOX', 'CHANGE_CUSTOMER_IMPORT', 'CHANGE_CUSTOMER', 'BEAR_GOLD_COIN']
      const subjects = {
       approval: 'ART_APP',
       write_app: 'WRITE_APP',
       music_app: 'MUSIC_APP',
       dance_app: 'DANCE_APP'
     }
      if (typeStatus.includes(type)) {
        // 9个独立自主抽屉
        this.$nextTick(() => {
          this.$refs[this.rainbowFart[type]].isShow = true
        })
      } else {
        const BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
        let subject = ''
        for (const key in subjects) {
          if (subjects[key] === this.activeChannelState) {
             subject = key
          }
        }
        window.open(BOSS_HOST_XX + '/' + subject + '/#/approvalCenter/')
      }
    },
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e === this.disturbMobile) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e
      }
    }
  }
}
</script>
<style lang='scss' scoped>
// 操作
.wait-pending {
  cursor: pointer;
  color: #2a75ed;
}
.tabpaneBadge {
  /deep/ {
    .el-badge__content.is-fixed{
      right: 2px;
      top: 12px;
    }

  }
}
.app-complain-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 18px;
    line-height: 36px;
  }
}
/deep/ .search-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  height: 36px;
  .search-item-label {
    display: block;
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color: #606266;
  }
  .el-select {
    width: 90px;
  }
  .search-item-element {
    display: flex;
    flex: 1;
    margin-right: 10px;
    .el-input-group__prepend {
      display: flex;
      width: 90px;
      flex: 1;
      align-items: center;
    }
  }
}
.app-box{
  /deep/.el-table__empty-text{
    width: 100%;
    padding: 20px 0;
  }
}
</style>
