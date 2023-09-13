<!-- 工作绩效 -->
<template>
  <div class="work-statistics-home">
    <div class="app-container home-top">
      <div class="top-title">
        <span>工作绩效</span>
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
      <div v-if="false" class="top-tabs">
        <el-divider />
        <el-button v-for="item in channelTypeList" :key="item.value" :class="[{'el-button--primary': item.value === currentChannel}]" size="small" @click="clickChannel(item.value)">{{ item.label }}</el-button>
      </div>
    </div>
    <div class="home-middle">
      <div class="middle-left">
        <div class="middle-title">
          <span class="color-999">平均处理时效</span>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">所选时间范围内的创建的投诉单后续跟踪统计，员工的投诉问题<br>处理的完成数、平均处理时效、分日时效图表</div>
            <i class="el-icon-warning-outline color-999" />
          </el-tooltip>
        </div>
        <div class="left-number">
          {{ allAverageTime }}
        </div>
        <el-divider />
        <div class="middle-botttm color-666">
          <span>投诉总数{{ total }}</span>
          <span>已完成{{ totalClosed }}</span>
          <span>占比{{ totalClosedRate }}</span>
        </div>
      </div>
      <!-- 明星员工排行榜 -->
      <div class="middle-right">
        <div class="middle-right-top">
          <!--  tab -->
          <span class="sort-title color-999">明星员工</span>
          <el-radio-group v-model="sortType" size="small" style="flex:1">
            <el-radio-button v-for="sort in sortTypeList" :key="sort.value" :label="sort.value">{{ sort.label }}</el-radio-button>
          </el-radio-group>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              完成数：员工已完成数据，含已关闭、已解决、未解决<br>
              处理数：员工在处理数<br>
              解决数：员工关闭，用户评价已解决数<br>
              处理时效：投诉接入时间到关闭时间平均值<br>
            </div>
            <i class="el-icon-warning-outline color-999" />
          </el-tooltip>
        </div>
        <!-- user sort list -->
        <div class="user-sort-list">
          <ul class="user-sort-list-item">
            <li v-for="(item, key) in startStaffList.slice(0, 3)" :key="item.mobile"><i class="sort-icon before">{{ key + 1 }}</i>{{ item.name }} <span>{{ item[sortType] }}</span></li>
          </ul>
          <ul class="user-sort-list-item">
            <li v-for="(item, key) in startStaffList.slice(3, 6)" :key="item.mobile"><i class="sort-icon">{{ key + 3 }}</i>{{ item.name }} <span>{{ item[sortType] }}</span></li>
          </ul>
          <ul class="user-sort-list-item">
            <li v-for="(item, key) in startStaffList.slice(6, 9)" :key="item.mobile"><i class="sort-icon">{{ key + 6 }}</i>{{ item.name }} <span>{{ item[sortType] }}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="app-container home-bottom">
      <div class="home-bottom-handle">
        <basics-search ref="searchs" style="width: 70%" :loading="loadings._k8s_api_complaint_api_v2_complaint_getComplaint" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch">
          <template slot="handlePeople" slot-scope="scope" class="search-item">
            <el-input v-model="scope.form.inputName1" placeholder="请输入" class="search-item-element" size="small">
              <el-select slot="prepend" v-model="scope.form.selectName1" placeholder="请选择" class="el-input-select">
                <el-option label="姓名" value="1" />
                <el-option label="手机号" value="2" />
              </el-select>
            </el-input>
          </template>
        </basics-search>
        <div class="download-data">
          <el-button plain size="small" @click="download">下载数据</el-button>
        </div>
      </div>
      <div class="bottom-table">
        <!-- 表头需要加sortable，所以还是用非配置的方法写 -->
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="员工姓名"
            sortable
            min-width="100"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
            min-width="140"
          >
            <template slot-scope="scope">
              <span class="columns-txt">
                {{
                  scope.row.mobile === disturbMobile
                    ? scope.row.mobile
                    : `${scope.row.mobile.slice(0,3)}****${scope.row.mobile.slice(-4)}`
                }}
                <svg-icon
                  style="cursor: pointer"
                  :icon-class="disturbMobileIcone(scope.row.mobile)"
                  @click="isDisturbMobile(scope.row.mobile)"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unHandleCount"
            label="待处理"
            sortable
            min-width="100"
          />
          <el-table-column
            prop="handleCount"
            label="处理中"
            sortable
            min-width="100"
          />
          <el-table-column
            prop="closeCount"
            label="关闭数"
            sortable
            min-width="100"
          />
          <el-table-column
            prop="solveCount"
            label="回访已解决"
            sortable
            min-width="120"
          />
          <el-table-column
            prop="unPleasedCount"
            label="评价满意"
            sortable
            min-width="100"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.pleasedCount }} {{ scope.row.pleasedRate ? `(${scope.row.pleasedRate})` : '-' }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="unPleasedCount"
            label="评价不满意"
            sortable
            min-width="120"
          >
            <template slot-scope="scope">
              <p>{{ scope.row.unPleasedCount }} {{ scope.row.unPleasedRate ? `(${scope.row.unPleasedRate})` : '-' }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="invalidCount"
            label="设置无效"
            sortable
            min-width="100"
          />
          <el-table-column
            prop="averageTime"
            label="平均处理时效"
            sortable
            min-width="140"
          />
        </el-table>
        <!-- <el-pagination
          class="page-class"
          :current-page="curPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'
import search from './search/search'
import { getStatisticsStaffList, exportStaff } from '@/api/operate/statistics'
import { createBlob } from '@/utils'

export default {
  name: 'WorkStatisticsHome',
  // components:{},
  data() {
    return {
      searchs: search,
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
      // 之前tab
      currentChannel: '0',
      // 排序状态
      sortTypeList: [
        {
          label: '正在处理',
          value: 'handleCount'
        },
        {
          label: '完成处理',
          value: 'closeCount'
        },
        /* {
          label: '回访已解决',
          value: 'solveCount'
        }, */
        {
          label: '评价满意',
          value: 'pleasedCount'
        },
        {
          label: '处理时效',
          value: 'averageTime'
        }
      ],
      channelTypeList: [
        {
          label: '全部',
          value: '0'
        },
        {
          label: '1v1用户',
          value: '1011'
        },
        {
          label: '1v1老师',
          value: '1012'
        },
        {
          label: '小班课用户',
          value: '1021'
        },
        {
          label: '小班课老师',
          value: '1022'
        },
        {
          label: '小熊用户',
          value: '1031'
        },
        {
          label: '书法用户',
          value: '1041'
        },
        {
          value: '1051',
          label: '小熊音乐'
        }
      ],
      sortType: 'handleCount',
      tableData: [],
      curPage: 1,
      query: {},
      startStaffList: [],
      startStaffListTotal: 0,
      total: 0,
      totalClosed: 0,
      totalClosedRate: '0%',
      allAverageTime: '',
      disturbMobile: ''

    }
  },
  computed: {
    ...mapGetters(['loadings', 'staffEnum']),
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
    staffEnum: {
      handler: function(val, oldVal) {
        this.$refs.searchs.set({
          type: 'options',
          data: {
            businessId: val.businessLine,
            role: val.roles
          }
        })
      },
      deep: true
    },
    sortType(val, old) {
      this.getStarStaff(val)
    }
  },
  created() {
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.getList()
    this.getStarStaff()
  },
  methods: {
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e === this.disturbMobile) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e
      }
    },
    changeDate(val) {
      // console.log(val, 'date')
      this.getList()
    },
    clickChannel(val) {
      if (this.currentChannel === val) return
      this.currentChannel = val
      this.getList()
      this.getStarStaff()
    },

    // 搜索
    submitSearch(val, state = false) {
      // 点击重置
      if (state) {
        this.initSearch(val)
      } else {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = _.cloneDeep(val)
        this.getList()
      }
    },
    // 搜索联动
    changeSearch(val, oldVal) {
      this.query = val
      if (val.selectName1 && val.selectName1 !== oldVal.selectName1) {
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: { inputName1: '' }
        })
      }
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

    getList() {
      // console.log('list')
      const { query, valueDate, currentChannel } = this
      // console.log(query, 'query')
      var obj = {}
      let beginTime, endTime
      if (valueDate) {
        beginTime = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        endTime = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      } else {
        beginTime = undefined
        endTime = undefined
      }
      /** 搜索 */
      const { selectName1, inputName1 } = query
      // 姓名搜索
      if (selectName1 === '1') {
        Object.assign(obj, { name: inputName1 })
        delete query.inputName1
        delete query.selectName1
      }
      // 手机号搜索
      if (selectName1 === '2') {
        Object.assign(obj, { mobile: inputName1 })
        delete query.inputName1
        delete query.selectName1
      }

      // 全部渠道
      if (currentChannel === '0') {
        delete obj.channelPid
      } else {
        Object.assign(obj, { channelPid: currentChannel })
      }

      const data = {
        ...query,
        ...obj,
        createDateBegin: beginTime,
        createDateEnd: endTime
      }
      // console.log(data)
      getStatisticsStaffList(data).then(res => {
        const data = res.payload || {}
        this.tableData = data.countList || []
        this.total = (data.total) * 1 || 0
        this.totalClosed = (data.solveCount) * 1 || 0
        this.totalClosedRate = data.solveRate || '0%'
        this.allAverageTime = data.allAverageTime
      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.list = []
        this.total = 0
        this.totalClosed = 0
        this.totalClosedRate = '0%'
      })
    },

    /**
     * 明星员工
     * 根据列表对应的字段排序；除 ”处理时效“外，都是倒序
     */
    getStarStaff(sort = this.sortType) {
      const { valueDate, currentChannel } = this
      var obj = {}
      let beginTime, endTime
      if (valueDate) {
        beginTime = `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`
        endTime = `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      } else {
        beginTime = undefined
        endTime = undefined
      }
      Object.assign(obj, {
        createDateBegin: beginTime,
        createDateEnd: endTime
      })
      // 全部渠道
      if (currentChannel === '0') {
        delete obj.channelPid
      } else {
        Object.assign(obj, { channelPid: currentChannel })
      }

      getStatisticsStaffList(obj).then(res => {
        const data = res.payload || {}
        const list = data.countList || []
        // console.log(list)
        this.startStaffListTotal = (data.total) * 1 || 0

        // 排序条件
        const countList = _.orderBy(list, [sort], [sort !== 'averageTime' ? 'desc' : 'asc'])
        // 取前9名
        this.startStaffList = countList.slice(0, 9)
        // console.log(this.startStaffList, 'countList')

      // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.startStaffList = []
        this.startStaffListTotal = 0
      })
    },

    // handleCurrentChange(val) {
    //   console.log(val)
    // },
    // handleSizeChange(val) {
    //   console.log(val)
    // }

    download() {
      const { query, valueDate, currentChannel } = this
      const data = {
        createDateBegin: `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        createDateEnd: `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      }
      if (currentChannel && currentChannel !== '0') {
        data.channelPid = currentChannel
      }
      if (query.role) {
        data.role = query.role
      }
      if (query.selectName1 === '1' && query.inputName1) {
        data.name = query.inputName1
      }
      if (query.selectName1 === '2' && query.inputName1) {
        data.mobile = query.inputName1
      }
      exportStaff(data).then(res => {
        createBlob(`工作绩效统计.xls`, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.color-999 {
  color: #999;
}
.color-666 {
  color: #666;
}
/deep/ {
  .el-divider--horizontal {
    margin: 15px 0;
  }
}
.work-statistics-home {
  min-width: 960px;
  overflow: auto;
  .home-top {
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
    .top-tabs {
      /deep/ {
        .el-button {
          border: none;
          margin-right: 20px;
        }
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
      span{
        margin-right: 15px;
      }
    }
    .middle-left {
      flex: 1;
      margin: 0px 20px;
      padding: 20px;
      background-color: #fff;
      .left-number {
        font-size: 30px;
        height: 115px;
      }
    }
    .middle-right {
      flex: 3;
      margin-right: 20px;
      padding: 20px;
      background-color: #fff;
      &-top{
        display: flex;
        align-items: center;
      }
      .sort-title{
        font-size: 12px;
        margin-right: 10px;
      }
      .user-sort-list{
        margin-top: 10px;
        display: flex;
        &-item{
          flex: 1;
        }
        ul{
          list-style: none;
          font-size: 12px;
          li{
            line-height: 40px;
            span{
              margin-left: 30px;
            }
          }
        }
        .sort-icon{
          display: inline-block;
          margin-right: 10px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 20px;
          text-align: center;
          font-style: normal;
          background-color: #f4f4f4;
          &.before{
            background-color: #324758;
            color: #fff;
          }
        }
      }
    }
  }
  .home-bottom {
    border-radius: 5px;
    &-handle{
      display: flex;
      justify-content: space-between;
      // .download-data{
      //   width: 300px;
      //   text-align: right;
      // }
    }
  }
  .bottom-table {
      /deep/ {
        .el-table {
          font-size: 13px;
        }
      }
      .page-class {
        margin-top: 30px;
        text-align: right;
      }
    }
}
/deep/ .el-input-select {
  width: 90px;
}
// /deep/ .search-item {
//     margin-bottom: 10px;
//     display: flex;
//     align-items: center;
//     height: 36px;
//     .search-item-label {
//       display: block;
//       width: 86px;
//       text-align: right;
//       margin-right: 10px;
//       font-size: 14px;
//       color: #606266;
//     }
//     .search-item-element {
//       display: flex;
//       flex: 1;
//       // width: 50%;
//       margin-right: 10px;
//       .el-input-group__prepend{
//         display: flex;
//         width: 90px;
//         flex: 1;
//         align-items: center;
//       }
//     }

//   }

</style>
