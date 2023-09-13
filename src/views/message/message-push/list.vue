<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="loadings._operation_notice_noticeList" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_notice_noticeList"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actions"
    />
    <el-dialog
      title="失败原因"
      :visible.sync="visible"
      width="600px"
      :before-close="close"
    >
      <div class="fail-note">
        <span>总失败次数：{{ failDat.failTotalNumbers }}次&emsp;失败占比：{{ failDat.faiTotalRate ? `${failDat.faiTotalRate}%` : '' }}</span>
      </div>
      <div class="fail-table">
        <el-table v-loading="loadings._operation_notice_failMessageStatistics" stripe border fit highlight-current-row :data="failDat.table" style="width: 100%">
          <el-table-column prop="failReason" label="失败原因" align="center">
            <template slot-scope="scope">
              {{ scope.row.failReason || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="failNumbers" label="失败次数" align="center" width="100" />
          <el-table-column prop="failRate" label="失败占比" align="center" width="100">
            <template slot-scope="scope">
              {{ scope.row.failRate ? `${scope.row.failRate}%` : '' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNoticeList, noticeSetting, failMessageStatistics } from '@/api/message/index'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import columns, { actions } from './columns/list'
import searchs from './searchs/searchs'
import { mapGetters } from 'vuex'

export default {
  name: 'MessagePush',
  components: { BasicsTable, BasicsSearch },
  data() {
    return {
      table: { stripe: true },
      group1v1: [],
      group1v4: [],
      newgroup: [],
      businessType: [],
      pushType: [],
      targeType: [],
      ackType: [],
      columns: columns,
      actions: actions({ failView: this.failView }),
      searchs: searchs({ search: this.$refs }),
      total: 0,
      respondent: [],
      dialogVisible: false,
      list: null,
      echorecord: {},
      query: {},
      queryAfter: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      complaints: {},
      visible: false,
      failDat: {
        failTotalNumbers: '',
        faiTotalRate: '',
        table: []
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getConfig()
  },
  methods: {
    // 获取配置
    getConfig() {
      noticeSetting().then(res => {
        const business = res.data.businessType || []
        const pushty = res.data.pushType || []
        const ack = res.data.ackType || []
        const group1 = res.data.group1v1 || []
        const group4 = res.data.group1v4 || []
        const targe = res.data.targeType || []
        const loop = (type) => {
          const list = []
          type.map(item => {
            list.push({
              label: item.label,
              value: item.code
            })
          })
          return list
        }
        this.businessType = loop(business)
        this.pushType = loop(pushty)
        this.ackType = loop(ack)
        this.group1v1 = loop(group1)
        this.group1v4 = loop(group4)
        this.newgroup = this.group1v1.concat(this.group1v4)
        this.targeType = loop(targe)
        this.$refs.searchs.set({
          type: 'options',
          data: {
            businessId: this.businessType,
            pushType: this.pushType,
            reachType: this.ackType,
            pushTarget: this.targeType
          }
        })
        this.initSearch()
      })
    },
    // 根据业务线设置默认消息分组
    setGroup(businessId) {
      let group = []
      if (businessId === '101') {
        group = this.group1v1
        this.$refs.searchs.set({
          type: 'options',
          data: {
            group: group
          }
        })
      } else if (businessId === '102') {
        group = this.group1v4
        this.$refs.searchs.set({
          type: 'options',
          data: {
            group: group
          }
        })
      } else {
        this.$refs.searchs.set({
          type: 'options',
          data: {
            group: group
          }
        })
      }
      const groupVal = group.length ? group[0].value : ''
      this.$refs.searchs.set({
        type: 'defaultVal',
        data: {
          group: groupVal
        }
      })
      return groupVal
    },
    // 默认搜索
    initSearch() {
      const { businessType, pushType, ackType, targeType } = this

      const businessIdVal = businessType.length ? businessType[0].value : ''
      const pushTypeVal = pushType.length ? pushType[0].value : ''
      const reachTypeVal = ackType.length ? ackType[0].value : ''
      const pushTargetVal = targeType.length ? targeType[0].value : ''

      this.$refs.searchs.set({
        type: 'defaultVal',
        data: {
          businessId: businessIdVal,
          pushType: pushTypeVal,
          reachType: reachTypeVal,
          pushTarget: pushTargetVal
        }
      })
      const groupVal = this.setGroup(businessIdVal)
      this.query = {
        ...this.query,
        businessId: businessIdVal,
        pushType: pushTypeVal,
        reachType: reachTypeVal,
        pushTarget: pushTargetVal,
        group: groupVal
      }
      this.getList()
    },
    // 搜索条件改变事件
    changeSearch(val, oldVal) {
      this.query = val
      this.queryAfter = JSON.parse(JSON.stringify(val))
      if (val.businessId !== oldVal.businessId) {
        this.setGroup(val.businessId)
      }
    },
    // 搜索
    submitSearch(val, state = false) {
      // 点击重置
      if (state) {
        this.initSearch()
      } else {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = val
        this.queryAfter = JSON.parse(JSON.stringify(val))
        this.getList()
      }
    },
    // 获取投诉列表
    getList() {
      const { query, listQuery } = this
      const data = {
        ...query
      }
      for (const name in data) {
        !data[name] && delete data[name]
      }
      getNoticeList(data, {
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        data.list.map(mydata => {
          // 推送类型
          this.pushType.map(pushtype => {
            if (mydata.pushType === pushtype.value) {
              mydata.pushTypeLabel = pushtype.label
            }
          })
          // 推送对象
          this.targeType.map(targetype => {
            if (mydata.pushTarget === targetype.value) {
              mydata.pushTargetLabel = targetype.label
            }
          })
          // 触达方式
          this.ackType.map(acktype => {
            if (mydata.reachType === acktype.value) {
              mydata.reachTypeLabel = acktype.label
            }
          })
          // 消息分组
          this.newgroup.map(group => {
            if (mydata.group === group.value) {
              mydata.groupLabel = group.label
            }
          })
        })
        this.total = data.total || 0
      })
    },
    // 查看失败原因
    failView(dat, row, index) {
      console.log(row)
      if (!row.failNumbers || row.failNumbers === '0' || row.failNumbers === 0) {
        return false
      }
      this.visible = true
      const { queryAfter } = this
      const data = {
        businessId: queryAfter.businessId,
        pushType: row.pushType,
        reachType: row.reachType,
        group: row.group || '',
        pushTarget: row.pushTarget,
        messageName: row.messageName,
        sendDate: queryAfter.sendDate
      }
      failMessageStatistics(data).then(res => {
        const data = res.data || []
        const one = data[0] || {}
        const failTotalNumbers = one.failTotalNumbers || ''
        const faiTotalRate = one.faiTotalRate || ''
        this.failDat = {
          failTotalNumbers: failTotalNumbers,
          faiTotalRate: faiTotalRate,
          table: data
        }
      })
    },
    // 失败原因 - 关闭
    close() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .fail-note {
    margin-bottom: 20px;
    font-size: 16px;
  }
  .fail-table /deep/ .el-table__header {
    th {
      background-color: #f4f4f5;
    }
  }
</style>
