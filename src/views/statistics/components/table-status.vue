<template>
  <div class="components-status-table">
    <div class="bottom-radios">
      <div class="radios-box">
        <div class="raiod-line">
          <span class="radios-name">统计维度:</span>
          <el-checkbox-group v-model="radioFirst" class="radios-class" @change="checkboxChange($event, 'first')">
            <el-checkbox v-for="option in firstOptions" :key="option.order" :label="option.order">{{ option.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="raiod-line">
          <span class="radios-name">
            统计指标:</span>
          <el-checkbox-group v-model="radioSecond" class="radios-class" :min="1" @change="checkboxChange($event, 'second')">
            <el-checkbox v-for="option in secondOptions" :key="option.order" :label="option.order">{{ option.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="download-data">
        <el-button plain @click="download">下载数据</el-button>
      </div>
    </div>
    <div class="bottom-table">
      <!-- 表头需要加sortable，所以还是用非配置的方法写 -->
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          v-for="item in showColumns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.name"
          :sortable="item.sort"
          :fixed="item.fixed"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="item.sort">
              <span>{{ scope.row[item.prop] || 0 }}</span>
              <span v-if="item.rate">({{ scope.row[item.rate] || '0%' }})</span>
            </div>
            <div v-else>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="false"
        class="page-class"
        :current-page="curPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { cloneDeep, debounce } from 'lodash'
import { exportStatus } from '@/api/statistics/status'
import { createBlob } from '@/utils'
export default {
  name: 'ComponentStatusTable',
  props: {
    propData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      // radio
      // 第一行的选中值
      radioFirst: [],
      // 第一行的全部值
      firstOptions: [{ name: '创建日期', order: 1 }, { name: '投诉途径', order: 2 }, { name: '问题类型', order: 3 }],
      // 第二行的选中值
      radioSecond: [4, 5, 6, 7, 8, 11, 12],
      // 第二行的全部值
      secondOptions: [
        { name: '投诉总量', order: 4 },
        { name: '待处理', order: 5 },
        { name: '处理中', order: 6 },
        // { name: '待回访', order: 7 },
        { name: '已关闭', order: 7 },
        { name: '已回访', order: 8 },
        // { name: '已解决', order: 8 }, { name: '评价满意', order: 9 }, { name: '评价不满意', order: 10 },
        { name: '无效投诉', order: 11 }, { name: '解决时效', order: 12 }],
      // 缺失的项的下标
      reduceOptions: [10, 3, 2, 1],
      // 表格的全部列表项
      totalColumns: [
        { name: '投诉来源', prop: 'channelName', fixed: 'left' },
        { name: '创建日期', prop: 'date' },
        { name: '投诉途径', prop: 'channelId' },
        { name: '问题类型', prop: 'problemPid' },
        { name: '投诉总量', sort: true, prop: 'complaintTotal' },
        { name: '待处理', sort: true, prop: 'unHandleCount', rate: 'unHandleRate' },
        { name: '处理中', sort: true, prop: 'handleCount', rate: 'handleRate' },
        { name: '待回访', sort: true, prop: 'closeCount', rate: 'closeRate' },
        { name: '已解决', sort: true, prop: 'solveCount', rate: 'solveRate' },
        { name: '评价满意', sort: true, prop: 'pleasedCount', rate: 'pleasedRate' },
        { name: '评价不满意', sort: true, prop: 'unPleasedCount', rate: 'unPleasedRate' },
        { name: '无效投诉', sort: true, prop: 'invalidCount', rate: 'invalidRate' },
        { name: '解决时效', sort: true, prop: 'averageTime' }
      ],
      // 用于显示的列表项
      showColumns: [],
      curPage: 1,
      channelMap: new Map()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.initMaps()
      // 减列表项
      this.reduceColumns(this.radioFirst.concat(this.radioSecond))
    },
    initMaps() {
      this.channelMap.set(1011, '1v1用户')
      this.channelMap.set(1012, '1v1老师')
      this.channelMap.set(1021, '小班课用户')
      this.channelMap.set(1022, '小班课老师')
      this.channelMap.set(1031, '小熊用户')
      this.channelMap.set(1061, '书画院用户')
      this.channelMap.set(1041, '书法用户')
      this.channelMap.set(1051, '小熊音乐')
      this.channelMap.set(1999, '投诉中心测试')
    },
    getList(data) {
      data.countList.forEach((item) => {
        item.channelName = +item.channelPid ? this.channelMap.get(+item.channelPid) : (this.propData.channelPid ? this.channelMap.get(this.propData.channelPid) : '全部')
      })
      this.tableData = data.countList
    },
    // 减列表项
    reduceColumns(columns) {
      // 在首位加进去投诉来源
      columns.splice(0, 0, 0)
      // totalColumns一共有13项，多了一项在最前面的投诉来源
      // radios一共有12项
      // 和总量挨个比对
      let tempArr = cloneDeep(this.totalColumns)
      for (let i = 0, len = 12; len >= i; len--) {
        if (len !== columns[columns.length - 1]) {
          tempArr.splice(len, 1)
        } else {
          columns.splice(columns.length - 1, 1)
        }
      }
      this.showColumns = cloneDeep(tempArr)
      tempArr = null
    },
    clickTab(val) {
      if (this.tabBefore === val) return
      this.$set(this.tabs[this.tabBefore], 'click', false)
      this.$set(this.tabs[val], 'click', true)
      this.tabBefore = val
    },
    // 改变选中项
    checkboxChange: debounce(function(val, type) {
      // 增减列表项
      if (type === 'first') {
        this.reduceColumns(val.sort((a, b) => { return a - b }).concat(this.radioSecond))
        // 确定dimension的值
        this.dimensionValue()
      } else if (type === 'second') {
        this.reduceColumns(this.radioFirst.concat(val.sort((a, b) => { return a - b })))
      }
    }, 500),
    dimensionValue() {
      // 维度(0没有维度1日期2途径3问题 4日期+途径5日期+问题6途径+问题7日期+途径+问题)
      if (!this.radioFirst.length) {
        this.$emit('dimension', 0)
      } else if (this.radioFirst.length === 1) {
        this.$emit('dimension', +this.radioFirst[0])
      } else if (this.radioFirst.length === 2) {
        switch (+this.radioFirst[0] + +this.radioFirst[1]) {
          case 3:
            this.$emit('dimension', 4)
            break
          case 4:
            this.$emit('dimension', 5)
            break
          case 5:
            this.$emit('dimension', 6)
            break
        }
      } else if (this.radioFirst.length === 3) {
        this.$emit('dimension', 7)
      }
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    download() {
      const { propData, radioSecond } = this
      const data = {
        createDateBegin: this.propData.createDateBegin,
        createDateEnd: this.propData.createDateEnd,
        dimension: this.propData.dimension,
        complaintTotal: radioSecond.includes(4),
        unHandle: radioSecond.includes(5),
        handle: radioSecond.includes(6),
        close: radioSecond.includes(7),
        solve: radioSecond.includes(8),
        pleased: radioSecond.includes(9),
        unPleased: radioSecond.includes(10),
        invalid: radioSecond.includes(11),
        solveTime: radioSecond.includes(12)
      }
      if (propData.channelPid) {
        data.channelPid = propData.channelPid
      }
      exportStatus(data).then(res => {
        createBlob(`投诉状态统计.xls`, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-status-table {
  .bottom-radios {
    display: flex;
    font-size: 14px;
    .radios-box {
      flex: 1;
      .raiod-line {
        margin-bottom: 15px;
        .radios-name {
          margin-right: 20px;
        }
        .radios-class {
          display: inline-block;
          /deep/ {
            .el-checkbox__label {
              font-size: 12px;
            }
          }
        }
      }
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
</style>
