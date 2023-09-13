<!-- 消息中心 -->
<template>
  <div class="message-statistics-home">
    <div class="app-container app-complain-title">
      <span>消息中心</span>
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
    <div class="app-container">
      <el-tabs v-model="activeTabsOneValue">
        <el-tab-pane v-for="item in TabList" :key="item.key" :label="item.label" :name="item.value">
          <span v-if="badgeData[item.key]" slot="label" class="tabpaneBadge">
            <el-badge :value="badgeData[item.key]">{{ item.label }}</el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <message-list
        :message-data-list="dataList"
        :total="total"
        :list-query="listQuery"
        :get-list="getList"
        :loading="loadings._k8s_api_complaint_api_news_getComplaintNews"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getToken } from '@/utils/auth'
// const createUserId = getToken('userId')
import { getComplaintNews, getComplaintNewsNum } from '@/api/message'
import { mapGetters } from 'vuex'
import { TabList } from './config'
import MessageList from '@/components/MessageList'
const init_pagaination = {
  page: 1,
  limit: 20
}
export default {
  name: 'MessageNotification',
  components: {
    MessageList
  },
  data() {
    return {
      valueDate: [moment().subtract(1, 'M').startOf('day'), moment().endOf('day')],
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
            console.log([start, end])
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
      activeTabsOneValue: '2',
      TabList,
      badgeData: {}, // 角标统计
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    activeTabsOneValue() {
      this.listQuery = {
        ...init_pagaination
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    loadings(newVal, oldVal) {
      // 全局发生读取数据操作时刷新当前页面列表数据
      if (newVal._k8s_api_complaint_api_news_immediatelyHandle !==
      oldVal._k8s_api_complaint_api_news_immediatelyHandle &&
      !newVal._k8s_api_complaint_api_news_immediatelyHandle) {
        this.getList()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    changeDate(val) {
      this.valueDate = val
      this.listQuery = {
        ...init_pagaination
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    getList() {
      const { valueDate, listQuery, activeTabsOneValue } = this
      const data = {
        staffId: getToken('userId'),
        readStatus: undefined,
        createDateBegin: undefined,
        createDateEnd: undefined
      }
      if (valueDate) {
        data.createDateBegin = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        data.createDateEnd = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      } else {
        data.createDateBegin = undefined
        data.createDateEnd = undefined
      }
      // 获取所有数据数量统计
      getComplaintNewsNum(data).then(res => {
        if (res?.code === 0) {
          const newBadgeData = {}
          let count = 0
          const { payload } = res
          payload.forEach((v) => {
            count += v['cou']
            newBadgeData[v['readStatus'] + ''] = v['cou']
          })
          newBadgeData['2'] = count
          this.badgeData = newBadgeData
        }
      })
      if (activeTabsOneValue !== '2') data.readStatus = activeTabsOneValue * 1
      // 获取消息列表数据
      getComplaintNews({
        ...data,
        pageNumber: (listQuery.page) * 1 - 1,
        pageSize: listQuery.limit
      }).then(res => {
        if (res?.code === 0) {
          const { payload } = res
          this.dataList = payload?.data
          this.total = payload?.total * 1
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-divider--horizontal {
    margin: 5px 0;
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
.message-statistics-home {
  min-width: 960px;
  overflow: auto;
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
}
</style>
