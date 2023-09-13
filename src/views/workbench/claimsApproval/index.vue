<template>
  <div>
    <div>
      <div class="app-container app-complain-title">
        <span>赔付审批</span>
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
        <el-tabs v-model="channelPid">
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
          :loading="loadings._k8s_api_complaint_api_v1_complaint_approval_getList"
          @submitSearch="submitSearch"
        >
          <template slot="userId" slot-scope="scope" class="search-item">
            <el-input v-model="scope.form.inputName" placeholder="请输入用户信息" class="search-item-element" size="small">
              <el-select slot="prepend" v-model="scope.form.selectName" placeholder="请选择" class="el-input-select">
                <el-option label="ID" value="1" />
                <el-option label="手机号" value="2" />
              </el-select>
            </el-input>
          </template>
        </basics-search>
        <el-tabs v-model="status">
          <el-tab-pane
            v-for="(item, index) in TabListStatus"
            :key="index"
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
          :loading="loadings._k8s_api_complaint_api_v1_complaint_approval_getList"
          :get-list="getList"
          :columns="columns"
          :total="total"
          :list-query="listQuery"
        >
          <template slot="userMobile" slot-scope="scope">
            <div class="columns-txt">
              {{
                scope.row.userMobile === disturbMobile &&
                  scope.row.id === disturbId
                  ? scope.row.userMobile
                  : `${scope.row.userMobile.slice(
                    0,
                    3
                  )}****${scope.row.userMobile.slice(-4)}`
              }}
              <svg-icon
                v-show="scope.row.userMobile"
                style="cursor: pointer"
                :icon-class="disturbMobileIcone(scope.row)"
                @click="isDisturbMobile(scope.row)"
              />
            </div>
          </template>
          <template slot="comment" slot-scope="scope">
            <div>订单:{{ scope.row.outTradeNo || '-' }}</div>
            <div>
              赔付方式：{{ currencyTypeAction[scope.row.currencyType] }}
            </div>
            <div>赔付场景：{{ scope.row.scene }}</div>
            <div>责任方：{{ scope.row.responsibleParty }}</div>
            <div>用户历史赔付次数：{{ scope.row.count }}次</div>
          </template>
          <template slot="amount" slot-scope="scope">
            <div v-if="scope.row.currencyType === 6">
              {{ scope.row.goods.toString() }}
            </div>
            <div v-else>{{ `${scope.row.amount} ${scope.row.currencyType === 4 ? channelPidMap[scope.row.channelPid] : currencyTypeAction[scope.row.currencyType]}` }}</div>
          </template>
          <template slot="status" slot-scope="scope">
            <div class="wait-pending" @click="getApprovalDeatail(scope.row)">
              {{ statusAction[scope.row.status] }}
            </div>
          </template>
          <template slot="action" slot-scope="scope">
            <div
              v-if="scope.row.status === 0 && scope.row.cid === userId"
              class="wait-pending"
              @click="revocation(scope.row.id)"
            >
              撤销
            </div>
            <div
              v-if="scope.row.status === 2 && scope.row.cid === userId"
            >
              <span class="wait-pending" @click="emitClaimsForm(scope.row)">编辑</span>
              <span class="wait-pending" @click="revocation(scope.row.id)">撤销</span>
            </div>
            <div v-else-if="scope.row.status === 4">已生效</div>
            <div v-else-if="scope.row.status === 5">失败</div>
            <div v-else>--</div>
          </template>
        </basics-table>
      </div>
    </div>
    <claimsDrawer
      v-if="claimsDrawerFlag && rowData.id"
      :claims-drawer-flag="claimsDrawerFlag"
      :currency-type-action="currencyTypeAction"
      :status-action="statusAction"
      :row-data="rowData"
      :role="role"
      @handleClose="handleClose"
      @getList="getList"
    />
    <!-- 编辑赔付审批 -->
    <createClaims
      v-if="claimsFlag"
      :claims-flag="claimsFlag"
      :claims-info-data="claimsInfoData"
      :user-mobile="claimsInfoData.userMobile"
      @cancel="handleClose"
      @getCount="getCount"
      @getList="getList"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getUserInfoById } from '@/api/settings/assign-complaint'
import { getToken } from '@/utils/auth'
import searchs from './search'
import { TabListStatus } from './config'
import columns from './columns/index'
import {
  getClaimsList,
  getApprovalAllStaff,
  setRevoke,
  getCount,
  checkEdit
} from '@/api/myExamine'
import claimsDrawer from './components/claimsDrawer'
import createClaims from '../../work-order/new/complain/detail/components/createClaims/index.vue'

import moment from 'moment'
const init_pagaination = {
  page: 1,
  pageSize: 20
}
const {
  baseData: { channel_type_list, currencyTypeMap, statusMap }
} = window
export default {
  name: 'ClaimsApproval',
  components: {
    claimsDrawer,
    createClaims
  },
  data() {
    return {
      userId: getToken('userId'),
      channel_type_list,
      currencyTypeMap,
      statusMap,
      TabListStatus,
      daterangeTime: [moment().startOf('days'), moment().endOf('days')],
      channelPid: '1011',
      searchs,
      searchQuery: {
        selectedInData: '1'
      },
      listQuery: { ...init_pagaination },
      columns,
      list: [],
      table: {
        stripe: false,
        border: false
      },
      status: 'all',
      total: 0,
      serviceObject: '',
      allStaffData: [],
      disturbMobile: '',
      disturbId: '',
      claimsDrawerFlag: false,
      rowData: {},
      role: '',
      channelPidMap: {
        1011: '1v1课时',
        1021: '小班课课时'
      },
      claimsFlag: false

    }
  },
  computed: {
    ...mapGetters(['loadings']),
    // 根据员工名片勾选的业务线显示tab业务线
    TabList() {
      const { serviceObject, channel_type_list } = this
      const serviceArr = serviceObject.split(',')
      const tabList = channel_type_list.filter((item) => {
        if (serviceArr.includes(item.value)) {
          return item
        }
      })
      return tabList
    },
    // 控制电话眼
    disturbMobileIcone() {
      return function(e) {
        if (e.userMobile === this.disturbMobile && e.id === this.disturbId) {
          return 'eye-open'
        } else {
          return 'eye'
        }
      }
    },
    currencyTypeAction() {
      let obj = {}
      this.currencyTypeMap.map((val) => {
        obj = {
          ...obj,
          [val.value]: val.label
        }
      })
      return obj
    },
    statusAction() {
      let obj = {}
      this.statusMap.map((val) => {
        obj = {
          ...obj,
          [val.value]: val.label
        }
      })
      return obj
    }
  },
  watch: {
    // 监听业务线
    channelPid: function(val, oldVal) {
      if (val !== oldVal) {
        this.getCount()
        this.getList()
      }
    },
    // 监听审批类型
    status: function(val, oldVal) {
      if (val !== oldVal) {
        this.status = val
        this.getList()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAutoComplaintStatus()
      this.getStaffUserList()
    })
  },
  methods: {
    // 获取可以看几条业务线
    getAutoComplaintStatus() {
      const loading = this.$loading({
        lock: true
      })
      getUserInfoById({ userId: getToken('userId') }).then((res) => {
        loading.close()
        if (res?.code === 0) {
          const { serviceObject: servicestr, role } = res.payload
          this.serviceObject = servicestr
          if (role) {
            this.role = role
            // 当从详情页跳进来看审批进度的根据手机号查询
            const { channelPid, approvalNo, userId } = this.$route.query
            const tabValue = this.TabList.find(
              (val) => val.value === channelPid
            )
            if (channelPid && approvalNo && tabValue) {
              this.$nextTick(() => {
                this.channelPid = tabValue.value
                this.$refs.searchs?.set({
                  type: 'defaultVal',
                  data: {
                    approvalNo: approvalNo
                  }
                })
              })
            } else if (channelPid && userId && tabValue) {
              this.$nextTick(() => {
                this.channelPid = tabValue.value
                this.$refs.searchs?.set({
                  type: 'defaultVal',
                  data: {
                    inputName: userId
                  }
                })
              })
            } else {
              this.channelPid = this.TabList[0].value
            }
            this.$nextTick(() => {
              this.getCount()
              this.getList()
            })
          }
        }
      })
    },
    // 申请人员的名单
    getStaffUserList() {
      getApprovalAllStaff().then((res) => {
        if (res.code === 0) {
          const data = res.payload || {}
          this.allStaffData = data.map((item, index) => {
            return {
              value: index,
              label: item
            }
          })
          this.$refs.searchs?.set({
            type: 'options',
            data: {
              createName: this.allStaffData || []
            }
          })
        }
      })
    },
    changeDate(val) {
      this.daterangeTime = val || []
},
    getList() {
      const { channelPid, searchQuery, listQuery, daterangeTime, status } = this
      const loading = this.$loading({
        lock: true
      })
      const data = {
        channelPid,
        ...searchQuery,
        status: searchQuery.status
          ? searchQuery.status
          : ['0'].includes(status)
          ? status
          : '',
        staffId: ['0', '1'].includes(status) ? getToken('userId') : '',
        cid: status === '2' ? getToken('userId') : '',
        pageNum: listQuery.page * 1 - 1,
        pageSize: listQuery.pageSize,
        createName: this.allStaffData.find(
          (val) => val.value === searchQuery.createName
        )?.label,
        userId: searchQuery.userId || this.$route.query.userId,
        approvalNo: searchQuery.approvalNo || this.$route.query.approvalNo
      }
      if (searchQuery.selectedInData) {
        switch (searchQuery.selectedInData) {
          case '1':
            data.beginDate =
            daterangeTime[0] &&
              moment(daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss') || ''
            data.endDate =
            daterangeTime[1] &&
              moment(daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss') || ''
            break
          case '2':
            data.approvalStartDate =
            daterangeTime[0] &&
              moment(daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss') || ''
            data.approvalEndDate =
            daterangeTime[1] &&
              moment(daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss') || ''
            break
        }
      }
      getClaimsList(data).then((res) => {
        loading.close()
        const { code, payload } = res
        if (code === 0) {
          this.total = +payload.total
          this.list = payload.data?.map(val => {
            val.goods = val.goods?.map(item => {
                item.text = item.productName + '/' + item.productSum
              return item.text
            })
            return val
          }) || []
        }
      })
    },
    getCount() {
      const { channelPid, searchQuery, daterangeTime, role } = this
      const data = {
        channelPid,
        ...searchQuery,
        role,
        staffId: getToken('userId'),
        createName: this.allStaffData.find(
          (val) => val.value === searchQuery.createName
        )?.label,
        userId: searchQuery.userId || this.$route.query.userId,
        approvalNo: searchQuery.approvalNo || this.$route.query.approvalNo
      }
      if (searchQuery.selectedInData) {
        switch (searchQuery.selectedInData) {
          case '1':
            data.beginDate =
            daterangeTime[0] &&
              moment(daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss') || ''
            data.endDate =
            daterangeTime[1] &&
              moment(daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss') || ''
            break
          case '2':
            data.approvalStartDate =
            daterangeTime[0] &&
              moment(daterangeTime[0]).format('YYYY-MM-DD HH:mm:ss') || ''
            data.approvalEndDate =
            daterangeTime[1] &&
              moment(daterangeTime[1]).format('YYYY-MM-DD HH:mm:ss') || ''
            break
        }
      }
      getCount(data).then((res) => {
        const { code, payload } = res
        if (code === 0) {
          this.TabListStatus.map((val, index) => {
            this.TabListStatus[index].key = payload[index]
            return val
          })
        }
      })
    },
    submitSearch(val, state = false) {
      if (state) {
        this.channelPid = '1011'
        this.searchQuery = {
          selectedInData: '1'
        }
        this.daterangeTime = [
          moment().startOf('days'),
          moment().endOf('days')
        ]
      } else {
        this.searchQuery = {
          ...this.searchQuery,
          ...val,
          userId: val.selectName === '1' ? val.inputName : '',
          userMobile: val.selectName === '2' ? val.inputName : ''
        }
      }
      this.getList()
      this.getCount()
    },
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e.userMobile === this.disturbMobile && e.id === this.disturbId) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e.userMobile
        this.disturbId = e.id
      }
    },
    getApprovalDeatail(row) {
      this.$nextTick(() => {
        this.rowData = row
        this.claimsDrawerFlag = true
      })
    },
    handleClose() {
      this.claimsDrawerFlag = false
      this.claimsFlag = false
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
            id: id
          }
          setRevoke(data).then((res) => {
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
    emitClaimsForm(row) {
      checkEdit({
        id: row.id
      }).then(res => {
        const { code, payload } = res
        if (!code) {
          if (payload) {
            this.claimsInfoData = row
            this.claimsFlag = true
          } else {
            this.$message.error('超出7日不可编辑~')
          }
        }
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
.tabpaneBadge {
  /deep/ {
    .el-badge__content.is-fixed {
      right: 2px;
      top: 12px;
    }
  }
}
// 操作
.wait-pending {
  cursor: pointer;
  color: #2a75ed;
}
/deep/ .search-item {
    .el-input-group__prepend {
     .el-input-select{
        display: flex;
        width: 90px;
        flex: 1;
        align-items: center;
      }
    }
}
</style>
