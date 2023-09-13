
<template>
  <div class="home-container">
    <div class="app-container home-title">
      <span>排班管理<span
        class="home-title-tips"
      >（排班每天凌晨1点之后生效，请谨慎操作）</span></span>
      <el-button
        v-permission="['admin']"
        type="primary"
        icon="el-icon-plus"
        @click="importStaff"
      >导入排班表</el-button>
    </div>
    <div class="app-container">
      <div class="app-container-class">
        <span style="font-size: 14px; color: #606266">班次说明：</span>
        <span
          v-for="(item, key) in classList"
          :key="key"
          :style="{
            color: '#fff',
            backgroundColor: item.color,
            marginRight: '10px',
            marginBottom: '10px',
          }"
          class="class-item"
        >{{ item.title }}</span>
      </div>
      <basics-search
        :loading="loadings._operation_resource_listResource"
        :searchs="searchs"
        @submitSearch="submitSearch"
      />

      <el-table
        align="center"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        size="mini"
        highlight-current-row
        :data="list"
        style="width: 100%"
        border
        :cell-style="setCellColor"
        @cell-click="cellClick"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          min-width="130"
          align="center"
          prop="prop"
          :label="getweek(item.label)"
          :fixed="item.fixed ? true : false"
        >
          <template slot-scope="scope">
            <!-- 触发提示 -->
            <el-tooltip
              v-if="scope.row[item.prop].name"
              class="item"
              effect="dark"
              :content="schedulingObj[scope.row[item.prop].name.replace(/[\r\n]/g, '')]"
              placement="top"
            >
              <el-popover placement="bottom" trigger="click" width="200">
                <div class="column-class">
                  <span
                    v-for="(jtem, key) in classList"
                    :key="key"
                    :style="{
                      color: '#fff',
                      backgroundColor: jtem.color,
                      marginBottom: '5px',
                      marginRight: '10px',
                    }"
                    class="column-item"
                    @click="changeColumn(scope, jtem, item)"
                  >{{ jtem.title }}</span>
                </div>
                <span
                  slot="reference"
                  :style="
                    scope.row[item.prop].name
                      ? 'display: block;height: 100%;width: 100%;cursor: pointer;'
                      : ''
                  "
                >{{ scope.row[item.prop] === 'staffName' ? scope.row[item.prop] : scope.row[item.prop].name }}</span>
              </el-popover>
            </el-tooltip>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 导入排班表 -->
      <el-dialog
        v-if="dialogVisible"
        append-to-body
        title="导入排班表"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <div
          :loading="
            loadings._k8s_api_complaint_api_scheduling_importStaffScheduling
          "
        >
          <upload
            ref="upload"
            :upload-api="importStaffScheduling"
            :reason="reason"
            tip="支持扩展名：.xls,.xlsx 且不超过1M"
            :media-rules="{
              size: 1,
              type: '.xls,.xlsx',
            }"
            @uploadEnd="uploadEnd"
          />
        </div>
        <!-- <br>
        <div style="padding: 0 50px">
          <el-button icon="el-icon-check" :loading="loadings._k8s_api_complaint_api_scheduling_importStaffScheduling" type="primary" @click="nowUp">立即上传</el-button>
          <el-button icon="el-icon-close" @click="closeDl('imports')">取消</el-button>
        </div> -->

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Upload from './components/Upload'
import { getSchedulingList } from '@/api/classes/classes'
import {
  importStaffScheduling,
  getSchedulingStaffList,
  updateStaffScheduling
} from '@/api/classes/scheduling'
import columns, { exColumns } from './columns'
import searchs from './searchs'
import moment from 'moment'
const colorList = [
  '#6495fa',
  '#e76e73',
  '#f09a51',
  '#7a6acc',
  '#57baba',
  '#c7559b'
]

export default {
  name: 'SchedulingManage',
  components: { Upload },
  data() {
    return {
      columns: [...columns, ...exColumns.slice(0, moment().daysInMonth())],
      exColumns,
      searchs,
      list: [],
      searchQuery: { month: moment(), staffName: '' },
      dialogVisible: false,
      title: '新增',
      reason: '',
      classList: [],
      colorMap: new Map(),
      row: '',
      columnData: '',
      schedulingObj: {}
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    getweek() {
      console.log(this.searchQuery)
      var weeks = ['一', '二', '三', '四', '五', '六', '日']
      return function(e) {
        let week = 0
        week = moment(this.searchQuery.month.date(e)).format('E')
        return e === '姓名' ? e : `${e} (${weeks[week - 1]})`
      }
    }
  },
  mounted() {
    // 获取班次列表
    window.lwy = moment
    this.getClassList()
  },
  methods: {
    importStaffScheduling,
    setCellColor: function(e) {
      // {row,column,rowIndex,columnIndex}
      const { row, columnIndex, column } = e
      if (
        this.row === row &&
        this.columnData === column &&
        column.label !== '姓名'
      ) {
        return 'background-color: #3C56F2;color: #fff;font-size: 14px'
      } else {
        const Rowname = row[this.columns[columnIndex].prop].name
        if (Rowname) {
        return {
          backgroundColor:
            this.colorMap.get(Rowname.replace(/[\r\n]/g, '')) || '#f5f5f5',
          color: this.colorMap.get(Rowname.replace(/[\r\n]/g, ''))
            ? '#fff'
            : '#606266',
          fontSize: '14px'
        }
        }
      }
    },
    importStaff() {
      this.dialogVisible = true
    },
    // 批量回填表单 - 上传
    // nowUp() {
    //   this.$refs.upload.actUp()
    // },
    // 上传结束
    uploadEnd() {
      console.log(121212)
    },
    // 新增排班
    addClass() {
      this.dialogVisible = true
      this.rowId = ''
    },
    // 提交查询
    submitSearch(data) {
      // 表头适配当前月份天数
      this.columns = [
        {
          prop: 'staffName',
          label: '姓名',
          align: 'center',
          fixed: 'left',
          width: 100
        },
        ...exColumns.slice(0, moment(data.month).daysInMonth())
      ]
      this.searchQuery = {
        ...this.searchQuery,
        ...data,
        month: moment(data.month || moment())
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 获取班次列表
    async getClassList() {
      const res = await getSchedulingList({})
      this.classList = res.payload.map((item, key) => {
        this.colorMap.set(`${item.schedulingName}`, colorList[key % 6])
        return {
          ...item,
          title: `${item.schedulingName}: ${item.schedulingBeginTime}-${item.schedulingEndTime}`,
          color: colorList[key % 6]
        }
      })
      // 生成排班对象
      this.schedulingObj = this.classList.reduce((prev, cur) => {
        const obj = {
          ...prev,
          [cur.schedulingName]: cur.title
        }
        return obj
      }, {})

      this.$nextTick(() => {
        this.getList()
      })
    },
    // 获取列表数据
    async getList() {
      const res = await getSchedulingStaffList({
        ...this.searchQuery,
        month: moment(this.searchQuery.month).format('YYYY/MM')
      })
      this.list = res.payload || []
    },
    // 点击某个单元格加高亮
    cellClick(row, column) {
      this.row = row
      this.columnData = column
    },
    // 点击每个单元格改变当前排版的数据
    changeColumn(scope, jtem, item) {
      const { row, $index } = scope
      // jtem 每个班次tab的一项
      // item 每个表格的当前内容
      // scope 获取当前row 和 当前要改变的下标
      row[item.prop].name = jtem.schedulingName
      this.list.splice($index, 1, row)
      updateStaffScheduling({
        id: row[item.prop]?.id,
        schedulingName: row[item.prop]?.name,
        staffName: row.staffName,
        schedulingDate: row[item.prop]?.schedulingDate
      }).then(res => {
        console.log(res, 'res')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ .el-table .cell {
//   padding: 0px !important;
// }
.class-item {
  padding: 8px 5px;
  border-radius: 5px;
  font-size: 14px;
  color: #606266;
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
      .home-title-tips {
        font-size: 12px;
        color: rgb(250, 97, 100);
      }
    }
  }
  .app-container-class {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
}
.column-class {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  height: 280px;
  overflow: auto;
  scrollbar-width: none;
}
.column-item {
  display: inline-block;
  // padding: 8px 5px;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}
</style>
