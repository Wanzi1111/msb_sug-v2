<template>
  <div v-loading="loading" class="statistics-home">
    <div class="app-container home-top">
      <div class="top-title">
        <span>{{ titleName }}</span>
        <el-date-picker
          v-model="valueDate"
          type="datetimerange"
          align="right"
          unlink-panels
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          @change="changeDate"
        />
      </div>
      <el-divider />
      <c-tabs v-if="type === 'StatisticsStatus' || type === 'StatisticsProblems'" @tabSelect="tabSelect" />
      <c-tabs-not-all v-if="type === 'StatisticsArea'" @tabSelect="tabSelect" />
    </div>
    <div class="home-middle">
      <div class="middle-left">
        <div class="middle-title">
          <span class="color-999">投诉总量</span>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">投诉总量：<br>查看所有投诉的数据总量每日变化</div>
            <i class="el-icon-warning-outline color-999" />
          </el-tooltip>
        </div>
        <div class="left-number">
          {{ totalNum }}
        </div>
        <el-divider />
        <div v-if="type === 'StatisticsArea'">
          --
        </div>
        <div v-else class="middle-botttm">
          <span>已完成&nbsp;{{ finishNum }}&nbsp;&nbsp;&nbsp;&nbsp;占比&nbsp;{{ finishRate }}%</span>
        </div>
      </div>
      <c-progress-status v-if="type === 'StatisticsStatus'" ref="progressStatus" />
      <c-progress-problems v-if="type === 'StatisticsProblems'" ref="progressProblems" />
      <c-progress-area v-if="type === 'StatisticsArea'" ref="progressArea" />
    </div>
    <div class="app-container home-bottom">
      <c-table-status v-if="type === 'StatisticsStatus'" ref="tableStatus" :prop-data="params" @dimension="changeDimension" />
      <c-table-problems v-if="type === 'StatisticsProblems'" ref="tableProblems" :prop-data="query" />
      <c-table-area v-if="type === 'StatisticsArea'" ref="tableArea" :prop-data="params" @typeChange="typeChange" />
    </div>
  </div>
</template>

<script>
// import echarts from 'echarts'
import cProgressProblems from './components/progress-problems'
import cProgressStatus from './components/progress-status'
import cProgressArea from './components/progress-area'
import cTableStatus from './components/table-status'
import cTableProblems from './components/table-problems'
import cTableArea from './components/table-area'
import { problemList } from '@/api/statistics/problem'
import { statusList } from '@/api/statistics/status'
import { areaList } from '@/api/statistics/area'
import cTabs from './components/tabs'
import cTabsNotAll from './components/tabsNotAll'
import moment from 'moment'
export default {
  name: 'StatisticsHome',
  components: { cProgressStatus, cProgressProblems, cProgressArea, cTableStatus, cTableProblems, cTableArea, cTabs, cTabsNotAll },
  data() {
    return {
      loading: false,
      // 区分投诉统计/投诉问题
      type: '',
      titleName: '',
      valueDate: [new Date(new Date().addDays(1 - new Date().getDate()).toLocaleDateString()), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)],
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
      totalNum: '',
      finishNum: 0,
      finishRate: 0,
      query: {},
      params: {}
    }
  },
  created() {
    this.type = this.$route.name
    this.init()
  },
  methods: {
    init() {
      switch (this.type) {
        case 'StatisticsStatus':
          this.titleName = '投诉状态统计'
          break
        case 'StatisticsProblems':
          this.titleName = '投诉问题统计'
          break
        case 'StatisticsArea':
          this.titleName = '投诉大区统计'
          break
      }
      this.initData()
    },
    // 获取数据
    initData() {
      if (this.type === 'StatisticsStatus') {
        this.initStatusData()
      } else if (this.type === 'StatisticsProblems') {
        this.initProblemsData()
      } else if (this.type === 'StatisticsArea') {
        this.initAreaData()
      }
    },
    // 投诉统计数据
    async initStatusData() {
      const { valueDate, params } = this
      if (!valueDate) {
        this.$message.error('日期不能为空')
        return
      }
      if (!valueDate.length) {
        this.$message.error('日期不能为空')
        return
      }
      Object.assign(params, {
        createDateBegin: `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        createDateEnd: `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`,
        dimension: params.dimension || 0 // 默认是0
      })
      const resData = await this.getStatusList(params)
      if (!resData) {
        return
      }
      // 中间进度条的数据
      this.totalNum = resData.total
      // 已完成就是待回访+已解决+评价满意+评价不满意
      this.finishNum = resData.close
      this.finishRate = resData.closeRate
      // 进度条数据
      this.$refs.progressStatus.initProgressData(resData)
      // 处理表格数据
      this.$refs.tableStatus.getList(resData)
    },
    getStatusList(data) {
      return statusList({
        ...data
      })
        .then(res => {
          if (res.code === 0) {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => { return false })
    },
    // 投诉问题数据
    async initProblemsData() {
      const { valueDate } = this
      if (!valueDate) {
        this.$message.error('日期不能为空')
        return
      }
      if (!valueDate.length) {
        this.$message.error('日期不能为空')
        return
      }
      this.query.createDateBegin = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
      this.query.createDateEnd = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      this.loading = true
      const resData = await this.getProblemsData(this.query)
      this.loading = false
      if (!resData) {
        return
      }
      // 中间进度条的数据
      this.totalNum = resData.total
      this.finishNum = resData.solveCount
      this.finishRate = resData.solveRate ? resData.solveRate.slice(0, -1) : '0'
      // 取前5条数据展示为进度条
      this.$refs.progressProblems.initProgressData(resData.countList.slice(0, 5))
      // 底部表格的数据
      // 把valuedata塞进去，自模块需要用
      resData.countList.forEach((item) => {
        item.createDateBegin = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        item.createDateEnd = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      })
      this.$refs.tableProblems.getList(resData)
    },
    getProblemsData(query) {
      return problemList({
        ...query
      })
        .then(res => {
          if (res.code === 0) {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => { return false })
    },
    // 投诉大区数据
    async initAreaData() {
      const { valueDate, params } = this
      if (!valueDate) {
        this.$message.error('日期不能为空')
        return
      }
      if (!valueDate.length) {
        this.$message.error('日期不能为空')
        return
      }
      let initAreaType
      switch (params.channelPid || 1011) {
        case 1011:
          initAreaType = 4
          break
        case 1012:
          initAreaType = 7
          break
        case 1021:
        case 1022:
          initAreaType = 11
          break
        case 1061:
        case 1031:
        case 1041:
        case 1051:
        case 1071:
        case 1081:
        case 2011:
          initAreaType = 9
          break
      }
      Object.assign(params, {
        createDateBegin: `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        createDateEnd: `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`,
        channelPid: +params.channelPid || 1011,
        type: +params.areaType || initAreaType
      })
      this.loading = true
      const resData = await this.getAreaData(params)
      this.loading = false
      if (!resData) {
        return
      }
      // console.log(resData)
      this.totalNum = resData.total
      this.$refs.progressArea.initProgressData(resData.areaList.slice(0, 5), resData.total)
      console.log(params, 'params')
      this.$refs.tableArea.initRadios(params.channelPid, params.type)
      this.$refs.tableArea.initColumns(params.channelPid)
      this.$refs.tableArea.initList(resData)
    },
    getAreaData(params) {
      return areaList({
        ...params
      })
        .then(res => {
          if (res.code === 0) {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => { return false })
    },
    tabSelect(value) {
      if (value === 0) {
        if (this.type === 'StatisticsStatus' || this.type === 'StatisticsArea') {
          delete this.params.channelPid
        } else if (this.type === 'StatisticsProblems') {
          delete this.query.channelPid
        }
      } else {
        if (this.type === 'StatisticsStatus') {
          this.params.channelPid = value
        } else if (this.type === 'StatisticsProblems') {
          this.query.channelPid = value
        } else if (this.type === 'StatisticsArea') {
          this.params.channelPid = value
          delete this.params.areaType
        }
      }
      this.initData()
    },
    changeDimension(value) {
      this.params.dimension = value
      this.initData()
    },
    changeDate(val) {
      this.valueDate = val
      this.initData()
    },
    typeChange(value) {
      this.params.areaType = value
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.color-999 {
  color: #999;
}
/deep/ {
  .el-divider--horizontal {
    margin: 15px 0;
  }
}
.statistics-home {
  min-width: 960px;
  overflow: auto;
  .home-top {
    padding-bottom: 10px;
    border-radius: 5px;
    .top-title {
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
  .home-middle {
    display: flex;
    border-radius: 5px;
    .middle-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      &> span {
        flex: 1;
        font-size: 12px;
      }
    }
    .middle-botttm {
      font-size: 13px;
    }
    .middle-left {
      flex: 1;
      margin: 0px 20px;
      padding: 20px;
      background-color: #fff;
      .left-number {
        font-size: 30px;
        height: 134px;
      }
    }
  }
  .home-bottom {
    border-radius: 5px;
  }
}
</style>
