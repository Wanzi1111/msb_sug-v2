<template>
  <div>
    <div class="app-container app-complain-title">
      <span>呼叫记录</span>
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
      <el-tabs v-model="activeTabsOneValue">
        <el-tab-pane
          v-for="item in TabList"
          :key="item.key"
          :disabled="loadings._k8s_api_complaint_api_eum_getCallRecords"
          :label="item.label"
          :name="item.value"
        >
          <span slot="label" class="tabpaneBadge">
            {{ item.label }}
          </span>
        </el-tab-pane>
      </el-tabs>
      <basics-search
        ref="searchs"
        :loading="loadings._k8s_api_complaint_api_eum_callUserIntention &&
          loadings._k8s_api_complaint_api_eum_getChannelAndCallStatus"
        :searchs="searchs"
        @submitSearch="submitSearch"
        @changeSearch="changeSearch"
      />
      <el-tabs v-model="activeTypeTabsOneValue">
        <el-tab-pane
          v-for="item in TypeTabList"
          :key="item.id"
          :label="item.name"
          :name="item.id +''"
        >
          <span slot="label" class="tabpaneBadge">
            {{ item.name }}
          </span>
        </el-tab-pane>
      </el-tabs>
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_v2_complaint_getComplaintCallRecords"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      >
        <template slot="complaintNo" slot-scope="scope">
          <div>{{ scope.row.complaintNo }}</div>
          <div class="table-small-box">{{ scope.row.startTimeFormat }}</div>
        </template>
        <template slot="userMobile" slot-scope="scope">
          <div>UID：{{ scope.row.userId }}</div>
          <div class="table-small-box">
            {{ scope.row.encryptionUserMobile }}
          </div>
        </template>
        <template slot="time" slot-scope="scope">
          <div
            v-if="!['0', '1'].includes(scope.row.recordStatus)"
            class="time-box"
          >
            <div
              style="
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              "
            >
              <div>开始：{{ scope.row.startTime | timeFormat }}</div>
              <div>接通：{{ scope.row.onTime | timeFormat }}</div>
              <div>结束：{{ scope.row.endTime | timeFormat }}</div>
            </div>
          </div>
          <div v-else slot="time">
            <div>--</div>
          </div>
        </template>
      </basics-table>
    </div>
    <el-dialog
      v-if="Visible"
      title="通话详情"
      :visible.sync="Visible"
      width="600px"
    >
      <div class="info-box" style="">
        <div><span>用户UID：</span> {{ actionObj.userId }}</div>
        <div><span>渠道来源：</span> 美术宝1v1-投诉回访</div>
        <div><span>主叫号码：</span> {{ actionObj.userMobile }}</div>
        <div><span>业务请求ID：</span> {{ actionObj.complaintNo }}</div>
        <div><span>服务主体：</span> 客服 </div>
        <div><span>供应商：</span> 一知 </div>
        <div><span>服务主体ID：</span> {{ ServiceuserId }}</div>
        <div><span>模板ID：</span> {{ Bypid }}</div>
      </div>
      <el-divider />
      <div style="display: flex; align-items: center; margin-bottom: 30px">
        <span style="color: #303133; font-size: 18px; margin-right: 20px">通话结果</span>
        <el-button v-if="robotDetails.intentLevel && robotDetails.intentLevelName" type="warning" size="mini" plain>{{ robotDetails.intentLevel + robotDetails.intentLevelName }}</el-button>
        <el-button v-if="robotDetails.callStatus && robotDetails.callStatusDesc" :type="type[robotDetails.recordStatus]" size="mini" plain>{{ robotDetails.callStatus + robotDetails.callStatusDesc }}</el-button>
      </div>
      <div v-show="Object.keys(robotDetails).length !== 0">
        <div class="call-box">
          <div v-if="robotDetails.fullAudioUrl">
            <audios
              :url="robotDetails.fullAudioUrl"
            />
          </div>
          <div><span>通话ID：</span> {{ robotDetails.id }}</div>
          <div> <span>通话时长：</span> {{ `呼叫 ${robotDetails.callTime || '--'} 秒 / 通话 ${robotDetails.chatDuration || '--'} 秒` }} </div>
          <div><span>意向标签：</span> {{ robotDetails.intentLevelName }}</div>
          <div> <span>采集反馈：</span> {{ robotDetails.feedback }} </div>
        </div>
      </div>
      <div v-show="Object.keys(robotDetails).length === 0" class="emptyStyle">
        <b>暂无记录</b>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { TabList } from './config'
import { mapGetters } from 'vuex'
import searchs from './searchs/searchs'
import BasicsSearch from '@/components/BasicsSearch'
import columns, { actions } from './columns'
import { default as act } from './actions'
import {
  getComplaintCallRecords,
  getCallUserIntention,
  getChannelAndCallStatus,
  getCallRecords,
  getCallRequest,
  getComplaintCallRecordsDetail,
  downexportCallList
} from '@/api/outboundRecords/index'
import moment from 'moment'
import { getToken } from '@/utils/auth'
import { createBlob } from '@/utils'

const init_pagaination = {
  page: 1,
  limit: 20
}
const type = ['warning', 'primary', 'success', 'danger', 'primary']
export default {
  name: '',
  filters: {
    timeFormat(e) {
      return e && e !== '0' ? moment(+e).format('YYYY-MM-DD HH:mm:ss') : '--'
    }
  },
  components: { BasicsSearch },
  data() {
    return {
      total: 0,
      ServiceuserId: getToken('userId'),
      Bypid: '',
      list: [],
      type,
      info: {
        title: '',
        instroduct: ''
      },
      searchs: searchs,
      daterangeTime: [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)],
      TabList,
      activeTabsOneValue: '101',
      TypeTabList: [],
      activeTypeTabsOneValue: 'all',
      columns,
      Visible: false,
      actionObj: {},
      actionFunction: actions({
        tableAction: this.toDetails
      }),
      table: {
        stripe: false,
        border: false
      },
      listQuery: { ...init_pagaination },
      searchQuery: {},
      callStatus: {},
      act: act({ exportDocument: this.exportDocument })

    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    activeTabsOneValue(val, oldVal) {
      if (val !== oldVal) {
        this.getList()
      }
    },
    activeTypeTabsOneValue(val, oldVal) {
      const { allCallStatusList, pendingList, processingList, successfulCallList, callFailedList, notDisturnList } = this.callStatus
      const type = { 'all': allCallStatusList, '0': pendingList, '1': processingList, '2': successfulCallList, '3': callFailedList, '4': notDisturnList }
      if (val !== oldVal) {
        this.setChannel(type[val], 'callStatus')
        this.getList()
      }
    }
  },
  mounted() {
    this.getCallUserIntentionData()
    this.getCallRecordsData()
    this.getChannelAndCallStatusData()
    this.getList()
  },
  methods: {
    //   改变日期
    changeDate(val) {
      this.daterangeTime = val
    },
    submitSearch(val, state = false) {
      if (state) {
         this.daterangeTime = [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)]
         this.listQuery = {
          ...init_pagaination
        }
      } else {
        this.searchQuery = {
          ...val
        }
      }
        this.getList()
    },
    changeSearch() {},
    // 获取列表tab通话状态
    async getCallRecordsData() {
      const res = await getCallRecords()
      this.TypeTabList = [{
        id: 'all',
        name: '全部'
      }, ...res.payload]
    },
    // 获取用户意向下拉数据
    async getCallUserIntentionData() {
      const res = await getCallUserIntention()
      this.setChannel(res.payload.intentionList, 'callUserIntention')
    },
    // 获取通话状态下拉数据
    async getChannelAndCallStatusData() {
      const res = await getChannelAndCallStatus()
      const { payload } = res
      this.callStatus = payload || {}
      this.setChannel(payload['allCallStatusList'], 'callStatus')
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
        } else {
          this.$refs.searchs && this.$refs.searchs.set({
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
          label: item.intentionName || item.desc,
          value: item.code || item.intentionCode
        }
      })
    },
    // 请求呼叫记录列表
    async getList() {
      const { searchQuery, listQuery } = this
      const newSearchQuery = {
        ...searchQuery,
        businessType: this.activeTabsOneValue,
        recordStatus:
          this.activeTypeTabsOneValue === 'all'
            ? ''
            : +this.activeTypeTabsOneValue,
        pageNum: listQuery.page * 1 - 1,
        pageSize: listQuery.limit,
        startTime: `${moment(this.daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        endTime: `${moment(this.daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      }
      const res = await getComplaintCallRecords(newSearchQuery)
        if (res?.code === 0) {
          const {
            payload: { data, total }
          } = res
          this.list = data
          this.total = total * 1 || 0
        }
    },
    // 通话详情
    async toDetails(dat, row, index, type) {
      // 获取模板ID
      this.getCallRequestData(row)
      this.getComplaintCallRecords(row)
        this.actionObj = row
    },
    // 获取机器人回访模板ID 拨打的手机号 是否是拨打后回访的状态
    async getCallRequestData(row) {
      const data = {
        complaintNo: row.complaintNo
      }
     const res = await getCallRequest(data)
     const { code, payload: { channelId, mobile }} = res
     if (code === 0) {
       this.Bypid = channelId
       this.actionObj.userMobile = mobile
     }
    },
    // 获取回访详情
    async getComplaintCallRecords(row) {
      const data = {
        complaintNo: row.complaintNo
      }
      const res = await getComplaintCallRecordsDetail(data)
      const { code, payload } = res
      if (code === 0) {
       this.robotDetails = payload.id === null || '' ? {} : payload
       this.Visible = true
      } else {
        this.robotDetails = {}
      }
    },
    // 下载呼叫记录
    exportDocument() {
      const { searchQuery, listQuery } = this
      const newSearchQuery = {
        ...searchQuery,
        businessType: this.activeTabsOneValue,
        recordStatus:
          this.activeTypeTabsOneValue === 'all'
            ? ''
            : +this.activeTypeTabsOneValue,
        pageNum: listQuery.page * 1 - 1,
        pageSize: listQuery.limit,
        startTime: `${moment(this.daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        endTime: `${moment(this.daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      }
      downexportCallList(newSearchQuery).then(res => {
          createBlob(`呼叫记录${moment().format('YYYY-MM-DD_HH:mm')}.xls`, res)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
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
.info-box,
.call-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // justify-content: center;
  & > div {
    width: 50%;
    margin-bottom: 16px;
    & > span {
      width: 90px;
      display: inline-block;
      text-align: right;
    }
  }
}
.call-box {
  margin-top: 30px;
  & > div {
    width: 100%;
    & > span {
      width: 120px;
    }
  }
}
.emptyStyle{
  padding: 30px;
  font-size: 18px;
  text-align: center;
}
</style>
