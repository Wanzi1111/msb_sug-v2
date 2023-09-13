<template>
  <div class="home-container">
    <div class="app-container home-title">
      <span>数据看版</span>
      <el-date-picker
        v-model="valueDate"
        type="datetimerange"
        align="right"
        unlink-panels
        range-separator="至"
        :clearable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        @change="changeDate"
      />
    </div>
    <div v-loading="loadings._k8s_api_complaint_api_statistics_homePageCount" class="app-container home-list">
      <div v-for="(item, key) in homeList" :key="key" class="list-item">
        <div class="item-top">
          <!-- <img class="top-img" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"> -->
          <span class="top-title">{{ item.channelName }}</span>
          <el-button class="top-detail" type="text" @click="clickDetail(item)">详情</el-button>
        </div>
        <el-divider />
        <div class="item-content">
          <div class="data-box" @click="clickItem(item, '0')">
            <div class="data-content">
              <div class="data-title">投诉总量</div>
              <div class="data-num">{{ item.complaintTotal }}</div>
            </div>
          </div>
          <el-divider direction="vertical" />
          <div v-for="(child, index) in item.childList" :key="index" class="data-box" @click="clickItem(item, child.status, child.cpStatusRadio)">
            <div class="data-content">
              <el-badge :value="child.rate" class="item">
                <div class="data-title">{{ child.name }}</div>
              </el-badge>
              <div class="data-num" :class="[{'red-class': index === 0}]">{{ child.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { homeList } from '@/api/dataBoard'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'HomePage',
  data() {
    return {
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
      channelMap: new Map(),
      homeList: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.initChannelMap()
    this.initList()
  },
  methods: {
    initChannelMap() {
      this.channelMap.set('1011', '1v1用户')
      this.channelMap.set('1012', '1v1老师')
      this.channelMap.set('1021', '小班课用户')
      this.channelMap.set('1022', '小班课老师')
      this.channelMap.set('1031', '小熊用户')
      this.channelMap.set('1041', '书法用户')
      this.channelMap.set('1999', '投诉中心测试')
      this.channelMap.set('1051', '小熊音乐')
      this.channelMap.set('1061', '书画院用户')
      this.channelMap.set('1071', '小熊舞蹈用户')
      this.channelMap.set('1081', '小熊手工')
      this.channelMap.set('2011', '绘本创作')
    },
    async initList() {
      const { valueDate } = this
      if (!valueDate) {
        this.$message.error('日期不能为空')
        return
      }
      if (!valueDate.length) {
        this.$message.error('日期不能为空')
        return
      }
      const params = {}
      Object.assign(params, {
        createDateBegin: `${moment(valueDate[0]).format('YYYY-MM-DD HH:mm:ss')}`,
        createDateEnd: `${moment(valueDate[1]).format('YYYY-MM-DD HH:mm:ss')}`
      })
      const resData = await this.getList(params)
      if (!resData) {
        return
      }
      // let template = {
      //   averageTime: null,
      //   channelId: null,
      //   channelPid: "1071",
      //   closeCount: 1,
      //   closeRate: "2.7%",
      //   complaintTotal: 37,
      //   date: null,
      //   handleCount: 27,
      //   handleRate: "72.97%",
      //   invalidCount: 0,
      //   invalidRate: "0%",
      //   pleasedCount: 0,
      //   pleasedRate: "0%",
      //   problemPid: null,
      //   solveCount: 0,
      //   solveRate: "0%",
      //   unHandleCount: 9,
      //   unHandleRate: "24.32%",
      //   unPleasedCount: 0,
      //   unPleasedRate: "0%"
      // }
      // resData.push(template)
      resData.forEach((item) => {
        item.channelName = this.channelMap.get(item.channelPid)
        item.childList = []
        item.childList.push({ name: '待处理', rate: item.unHandleRate || '0%', count: item.unHandleCount || 0, status: '1' })
        item.childList.push({ name: '处理中', rate: item.handleRate || '0%', count: item.handleCount || 0, status: '2' })
        item.childList.push({ name: '已关闭', rate: item.closeRate || '0%', count: item.closeCount || 0, status: '3' })
        item.childList.push({ name: '已解决', rate: item.solveRate || '0%', count: item.solveCount || 0, status: '7' })
        item.childList.push({ name: '评价满意', rate: item.pleasedRate || '0%', count: item.pleasedCount || 0, status: '7', cpStatusRadio: '72' })
        item.childList.push({ name: '评价不满意', rate: item.unPleasedRate || '0%', count: item.unPleasedCount || 0, status: '7', cpStatusRadio: '73' })
        item.childList.push({ name: '无效投诉', rate: item.invalidRate || '0%', count: item.invalidCount || 0, status: '6' })
      })
      // console.log(resData, 'resData')
      this.homeList = resData
    },
    getList(params) {
      return homeList({ ...params })
        .then((res) => {
          if (res.code === 0) {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    changeDate(val) {
      this.valueDate = val
      this.initList()
    },
    clickDetail(item) {
      this.$router.push({ name: 'OperateNewComplain', params: { type: item.channelPid }})
    },
    clickItem(item, status, cpStatusRadio) {
      this.$router.push({ name: 'OperateNewComplain', params: { type: item.channelPid, status: status, cpStatusRadio: cpStatusRadio }})
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-divider--horizontal {
    margin: 0;
  }
}
.home-container {
  min-width: 960px;
  .home-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    span {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 18px;
      line-height: 36px;
    }
  }
  .home-list {
    border-radius: 5px;
    min-height: 600px;
    .list-item {
      border-radius: 5px;
      border: 1px solid #DCDFE6;
      margin: 10px 0;
      .item-top {
        padding: 10px;
        display: flex;
        align-items: center;
        .top-img {
          margin-left: 5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .top-title {
          flex: 1;
          padding-left: 10px;
        }
      }
      .item-content {
        display: flex;
        align-items: center;
        /deep/ .el-divider--vertical {
          height: 4em;
        }
        .data-box {
          flex: 1;
          text-align: center;
          padding:30px 20px;
          cursor: pointer;
          .data-content {
            display: inline-block;
            text-align: left;
            .data-title {
              font-size: 12px;
              color: #999;
              margin-bottom: 5px;
              padding-left: 3px;
            }
            .data-num {
              font-size: 30px;
            }
            .red-class {
              color: #FF5500;
            }
            /deep/ {
              .el-badge {
                .el-badge__content {
                  right: 0px;
                  top: -5px;
                  background-color: #F2F2F2;
                  color: #AAAAAA;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
