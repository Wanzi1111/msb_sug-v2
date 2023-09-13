<template>
  <div class="message-statistics-home">
    <div class="app-container app-complain-title">
      <span>我的待办</span>
      <el-date-picker
        v-if="activeTabsOneValue !== '2'"
        v-model="valueDate"
        type="datetimerange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        :clearable="false"
        @change="changeDate"
      />
    </div>
    <div class="app-container">
      <el-tabs v-model="activeTabsOneValue">
        <el-tab-pane
          v-for="item in TabList"
          :key="item.key"
          :label="item.label"
          :name="item.value"
        >
          <span v-if="badgeData[item.key]" slot="label" class="tabpaneBadge">
            <el-badge :value="badgeData[item.key]">{{ item.label }}</el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>

      <el-checkbox-group
        v-model="checkList"
        class="checkbox_style"
        @change="changeCheckbox"
      >
        <el-checkbox
          v-for="item in followUp"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>

      <BacklogCard
        :data-list="dataList"
        :total="total"
        :list-query="listQuery"
        :get-list="getList"
        :loading="loadings._k8s_api_complaint_api_pending_pendingList"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getpendingList } from '@/api/operate/sugDeitail'
import { mapGetters } from 'vuex'
import { TabList } from './config'
import BacklogCard from './components/backlogCard.vue'
const {
  baseData: { Agency_follow_up_method }
} = window

const init_pagaination = {
  page: 1,
  limit: 20
}
export default {
  name: 'MessageNotification',
  components: {
    BacklogCard
  },
  data() {
    return {
      name: 'backlog',
      followUp: Agency_follow_up_method,
      checkList: ['101', '102', '103', '104', '105'],
      valueDate: [moment().startOf('day'), moment().endOf('day')],
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              const day = new Date().getDay()
              const end = new Date()
              const start = new Date().addDays(1 - day)
              console.log([start, end])
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const date = new Date().getDate()
              const end = new Date()
              const start = new Date().addDays(1 - date)
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      activeTabsOneValue: '1',
      TabList,
      badgeData: {}, // 角标统计
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      typeStr: '',
      startDataFlag: false
      }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    activeTabsOneValue(val) {
      this.listQuery = {
        ...init_pagaination
      }
      const { valueDate, startDataFlag } = this
      if (val === '1') { // 今日待办的日期
      if (startDataFlag) { // 是否改变了日期的值
        this.valueDate = [moment(valueDate[0]).valueOf(), moment(valueDate[1]).valueOf()]
      } else {
        this.valueDate = [moment().startOf('day'), moment().endOf('day')]
      }
      } else if (val === '0') { // 全部待办的日期默认一个月
      if (startDataFlag) { // 是否改变了日期的值
        this.valueDate = [moment(valueDate[0]).valueOf(), moment(valueDate[1]).valueOf()]
      } else {
        this.valueDate = [moment().startOf('day'), moment().add(1, 'M').endOf('day')]
      }
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    loadings(newVal, oldVal) {
      // 全局发生读取数据操作时刷新当前页面列表数据
      if (
        newVal._k8s_api_complaint_api_pending_immediateComplaint !==
          oldVal._k8s_api_complaint_api_pending_immediateComplaint &&
        !newVal._k8s_api_complaint_api_pending_immediateComplaint
      ) {
        this.getList()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.TabList.map(val => {
        this.getList(val.key)
      })
    })
  },
  methods: {
    changeDate(val) {
      this.valueDate = val
      this.listQuery = {
        ...init_pagaination
      }
      this.startDataFlag = true
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 查询列表
    getList() {
      const { valueDate, listQuery, activeTabsOneValue } = this
      const arr = this.followUp.map(val => val.value)
      arr.map((item, index) => {
        if (this.checkList.includes(item)) {
          arr[index] = item
        } else {
          arr[index] = ''
        }
        return arr
      })

      const data = {
        type: arr.join(','),
        page: listQuery.page * 1 - 1,
        size: listQuery.limit
      }
      if (activeTabsOneValue === '1') {
        data.executeStartTime = moment().startOf('day').format('x')
        data.executeEndTime = moment().endOf('day').format('x')
        data.status = 1
      } else if (activeTabsOneValue === '0') {
        if (valueDate) {
          data.executeStartTime = `${moment(valueDate[0]).valueOf()}`
          data.executeEndTime = `${moment(valueDate[1]).valueOf()}`
        } else {
          data.executeStartTime = undefined
          data.executeEndTime = undefined
        }
        data.status = undefined
      } else {
          data.executeStartTime = undefined
          data.executeEndTime = undefined
          data.status = 2
      }

      if (this.checkList?.length !== 0) {
        // 获取消息列表数据
        getpendingList(data).then((res) => {
          if (res?.code === 0) {
            const { payload } = res
            this.dataList = payload?.data
            this.total = payload?.totalSize * 1
          } else {
            this.dataList = []
          }
        })
      // 获取角标的数据
      this.TabList.map(val => {
        this.getCountNum(data, val.key)
      })
      } else {
        this.$message.error('跟进方式不能为空')
        this.dataList = []
        this.total = 0
        this.badgeData = {}
      }
    },
    // 查询角标数量
    getCountNum(data, key) {
      const { valueDate, startDataFlag } = this
      const StartTime = moment().startOf('day').format('x')
      const EndTime = moment().endOf('day').format('x')
      if (key === '1') { // 今天待办
           data.executeStartTime = StartTime
           data.executeEndTime = EndTime
           data.status = 1
      } else if (key === '0') { // 全部待办
        if (startDataFlag) {
          data.executeStartTime = `${moment(valueDate[0]).valueOf()}`
          data.executeEndTime = `${moment(valueDate[1]).valueOf()}`
        } else {
          data.executeStartTime = moment().startOf('day').valueOf()
          data.executeEndTime = moment().add(1, 'M').endOf('day').valueOf()
        }
          data.status = undefined
      } else {
          data.executeStartTime = undefined
          data.executeEndTime = undefined
          data.status = 2
      }
        getpendingList(data).then(res => {
          if (res?.code === 0) {
            const { payload } = res
            const newBadgeData = { ...this.badgeData }
            newBadgeData[key] = payload?.totalSize * 1
            this.badgeData = newBadgeData
          }
        })
    },
    // 跟进方式的状态
    changeCheckbox(valarr) {
      this.checkList = valarr
      this.getList()
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
    .el-badge__content.is-fixed {
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
.checkbox_style {
  margin-bottom: 15px;
}
</style>
