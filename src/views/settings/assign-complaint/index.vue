<template>
  <div>
    <div class="app-container title-container">
      <basics-title title="投诉分配设置" />
    </div>
    <div class="app-box">
      <el-card v-permission="['admin']" shadow="nerver" class="auto-complaint">
        <div slot="header" class="header">
          <span class="title">自动分配</span>
          <el-switch :value="ifAutoComplaint" @change="handleAutoComplaintSwitch" />
        </div>
        <div class="con">
          开启后系统会根据投诉单来源与员工所属业务线平均分配，<span>仅支持1v1用户、小熊美术、书法用户、小熊音乐用户分配</span>。
        </div>
      </el-card>
      <div class="division" />
      <el-card shadow="nerver" class="distribution-list">
        <div slot="header" class="header">
          <div>
            <span class="title">分配名单</span>
            <span
              class="text"
            >（名单中共<b> {{ staticsData.total || 0 }} </b>位员工，其中参与投诉单自动分配的有<b> {{ staticsData.aotuComplaintNum || 0 }} </b>位）</span>
          </div>
          <el-button v-permission="['admin']" @click="handleAddPeople">{{ addPeopleStatus ? '取消添加名单': '添加名单' }}</el-button>
        </div>

        <basics-search
          ref="search"
          :searchs="searchConfig"
          :loading="loadings._k8s_api_complaint_api_staff_searchUserInfo"
          @changeSearch="onSearchChange"
          @submitSearch="hanleSearch"
        />

        <el-row :gutter="12">
          <el-col :span="!addPeopleStatus ? 24 : 16">
            <basics-table
              :key="tableKey"
              :columns="columns"
              :list="list"
              :get-list="getUserList"
              :action-function="tableActionFunction"
              :list-query="paginationQuery"
              :total="total"
              :loading="loadings._k8s_api_complaint_api_staff_searchUserInfo || loadings._k8s_api_complaint_api_staff_getByPage || handleParticipationLoading "
              :table="tableAttr"
              @selection-change="handleSelectionChange"
            >
              <template slot="serviceObject" slot-scope="scope">
                <div>
                  {{ scope.row.serviceObject ? transferServiceObj(scope.row.serviceObject) : '--' }}
                </div>
              </template>
              <template slot="serviceUpperNumHeader">
                <span style="display: flex;align-items: center;justify-content: center;">服务上限(人)&nbsp; <svg-icon style="font-size: 22px;cursor: pointer;" icon-class="edits" @click="() => {editNums()}" /></span>
              </template>
              <template slot="serviceUpperNum" slot-scope="scope">
                {{ scope.row.serviceUpperNum }} &nbsp; <svg-icon style="font-size: 22px;cursor: pointer;" icon-class="edits" @click="() => {editNum(scope.row)}" />
              </template>
              <template slot="statusHeader">
                <div style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                  <span>参与状态</span>
                  <div class="status-header">
                    <el-button type="text" @click="() => {handleAllParticipationStatus(false)}">
                      全部关闭
                    </el-button>
                    <el-button type="text" @click="() => {handleAllParticipationStatus(true)}">
                      全部开启
                    </el-button>
                  </div>
                </div>
              </template>
              <template slot="status" slot-scope="scope">
                <el-switch :value="!scope.row.openDistribution" @change="handleParticipationStatus(scope.row)" />
              </template>
              <template slot="problemId" slot-scope="scope">
                <div>
                  <div class="columns-txt">{{ scope.row.problemIdOne }}</div>
                  <div class="columns-note">{{ scope.row.problemIdTwo }}</div>
                  <div class="columns-note">{{ scope.row.problemIdThree }}</div>
                  <div class="columns-note">{{ scope.row.problemIdFour }}</div>
                  <div class="columns-note">{{ scope.row.problemIdFive }}</div>
                </div>
              </template>
            </basics-table>
          </el-col>
          <el-col v-if="addPeopleStatus" :span="8">
            <el-card shadow="nerver">
              <div slot="header" class="name-list-header">
                <span class="title">已选<b> {{ multipleSelection.length }} </b>个员工</span>
                <div v-if="multipleSelection.length">
                  <el-button type="text" @click="handleBatchDelNameList">
                    全部删除
                  </el-button>
                  <el-button type="text" @click="handleBatchAddNameList">
                    全部添加
                  </el-button>
                </div>
              </div>
              <div>
                <div v-if="multipleSelection.length">
                  <div v-for="v in multipleSelection" :key="v.id" class="checked-name-list">
                    {{ v.staffName }} - {{ v.staffMobile }}
                  </div>
                </div>
                <div v-else class="empty-name-list">
                  暂未选择任何员工。
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
import {
  searchUserInfo,
  delDistributionUser,
  openDistributionStaff,
  getAutoDistributionStatus,
  updateAutoDistributionStatus,
  openDistributionStaffList,
  serviceUpperNum
} from '@/api/settings/assign-complaint'
import { getBypidsFilter } from '@/api/operate/question'
import { getChannelIdTree } from '@/api/operate/complainNew'
import { getStaffList } from '@/api/operate/staff-list'
import searchConfig from './search'
import { TableActions, TableColumns, TableColumnsAdd } from './columns'
import { SEIVICE_OBJ_MAP, SERVICE_OBJECT_MAP } from './config'
import { getToken } from '@/utils/auth'

const init_pagaination = {
  page: 1,
  limit: 100,
  pageSizes: [10, 30, 40, 50, 100]
}

export default {
  name: 'AssignComplaint',
  data() {
    return {
      ifAutoComplaint: false, // 是否开启 自动分配
      searchConfig,
      SERVICE_OBJECT_MAP,
      addPeopleStatus: false, // 开启添加名单的状态
      columns: TableColumns,
      tableKey: 0, // 加上这玩意儿，就可以解决动态添加 selection列 展示不出来的问题？？！
      paginationQuery: { ...init_pagaination },
      searchQury: {},
      total: 0,
      tableActionFunction: TableActions({ handleDelte: this.handleDelte }),
      list: [],
      staticsData: { total: 0, aotuComplaintNum: 0 },
      multipleSelection: [],
      tableAttr: {
        stripe: true,
        border: false,
        height: 700
      },
      problemIdOneList: [],
      handleParticipationLoading: false,
      userId: getToken('userId')
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  mounted() {
      this.$nextTick(() => {
        this.getAutoDistributionStatus()
        this.getUserList()
      })
  },
  methods: {
    initPaninationAndGetList() {
      this.paginationQuery = { ...init_pagaination }
      this.getUserList()
    },
    getUserList() {
      const { page: pageNum, limit: pageSize } = this.paginationQuery
      if (!this.addPeopleStatus) {
        searchUserInfo({ pageNum: pageNum - 1, pageSize, ...this.searchQury }).then(res => {
          if (res.code === 0) {
            const { total, data, openTotal } = res.payload
            this.list = data
            this.total = Number(total)
            this.staticsData = {
              total,
              aotuComplaintNum: openTotal
            }
            if (!data?.length) {
              this.$message.warning('暂无符合条件的名单~')
            }
          }
        })
      } else {
        getStaffList({ pageNum: pageNum - 1, pageSize, ...this.searchQury }).then(res => {
          if (res.code === 0) {
            const { total, data } = res.payload
            this.list = data
            this.total = Number(total)
            if (!data?.length) {
              this.$message.warning('暂无符合条件的名单~')
            }
          }
        })
      }
    },
    hanleSearch(val, ifReset) {
      const values = JSON.parse(JSON.stringify(val))
      if (values.problemId && values.problemId.length) {
        values.problemIdOne = values.problemId[0]
        values.problemIdTwo = values.problemId[1]
        delete values.problemId
      }
      const allValue = Object.values(values)
      const flag = allValue.every(v => {
        if (typeof v === 'object' && !v.length) {
          return true
        } else {
          return !v
        }
      })
      if (flag) {
        this.$message.warning('请输入业务线或者手机号～')
        if (!ifReset) {
          return
        }
      }
      this.searchQury = {
        ...values,
        serviceObject: values?.serviceObject?.length ? values.serviceObject.join(',') : ''
      }
      this.initPaninationAndGetList()
    },
    // 更新 自动分配 状态
    handleAutoComplaintSwitch(value) {
      this.$confirm(`确定${value ? '开启' : '关闭'}自动分配吗？`, '自动分配设置', { type: 'warning' }).then(() => {
        updateAutoDistributionStatus({ status: value ? 0 : 1 }).then(res => {
          if (res.code === 0) {
            this.ifAutoComplaint = value
          }
        })
      })
    },
    // 获取 自动分配 状态
    getAutoDistributionStatus() {
      getAutoDistributionStatus().then(res => {
        if (res?.code === 0) {
          this.ifAutoComplaint = !res.payload
        }
      })
    },
    // 更新多个 自动分配状态
    handleAllParticipationStatus(e) {
      const { multipleSelection } = this
      if (multipleSelection.length === 0) {
        const title = e ? '请先选择需要开启的员工！' : '请先选择需要关闭的员工！'
        this.$confirm(title, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        const userIds = multipleSelection.filter((v) => v.openDistribution === Number(e))
        if (userIds.length === 0) {
          this.$message({
            type: 'info',
            message: '无可操作人员'
          })
        } else {
          const title = e ? `确定要开启${userIds.length}位员工自动分配吗？` : `确定要关闭${userIds.length}位员工自动分配吗？`
          this.$confirm(title, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            const userIdList = userIds.map(v => v.id).join(',')
            openDistributionStaffList({ userIds: userIdList, status: Number(!e) }).then((res) => {
              if (res?.code === 0) {
                this.initPaninationAndGetList()
                this.$message({
                  type: 'success',
                  message: e ? '开启成功' : '关闭成功!'
                })
              }
            })
          })
        }
      }
    },
    // 更新 单个客服 自动分配 状态
    handleParticipationStatus(rowData) {
      const { openDistribution, id } = rowData
      const messageObj = {
        title: !openDistribution ? '确定关闭吗？' : '确定开启吗？',
        message: !openDistribution ? '关闭后，该客服不再参与自动分配' : '开启后，该客服将参与自动分配',
        succMessage: !openDistribution ? '已关闭此员工自动分配～' : '已开启此员工自动分配～'
      }
      this.$confirm(messageObj.message, messageObj.title, {
        type: 'warning',
        beforeClose: debounce((action, instance, done) => {
          if (action === 'confirm') {
            done()
           this.handleParticipationLoading = true
          openDistributionStaff({ userId: id, status: openDistribution === 0 ? 1 : 0 }).then(res => {
          if (res?.code === 0) {
            this.handleParticipationLoading = false
            this.$message.success(messageObj.succMessage)
            this.initPaninationAndGetList()
          }
           })
          } else {
            done()
          }
        }, 500)
        }).catch(() => {})
    },
    // 处理 删除
    handleDelte(_, row) {
      this.$confirm('删除后，该客服不再参与自动分配', '确定删除吗？', { type: 'warning' }).then(() => {
        const { id } = row
        delDistributionUser({ userId: id, status: 1 }).then(res => {
          if (res?.code === 0) {
            this.$message.success('删除成功～')
            this.initPaninationAndGetList()
          }
        })
      })
    },
    tranFormDataTree(data) {
      const arr = []
      data.map(item => {
        const obj = {}
        obj.label = item.cpType
        obj.value = item.problemIdNew
        arr.push(obj)
      })
      return arr
    },
    // 获取问题分类列表
    getProblemChannel(val) {
      const code = `${val}1`
      getChannelIdTree({ channelPid: code }).then(res => {
        const data = res.payload
        const arr = []
        data.forEach(item => {
          if (item.problemStatus === 0) {
            const obj = {}
            obj.label = item.cpType
            obj.value = item.problemIdNew
            obj.children = this.tranFormDataTree(item.problems)
            arr.push(obj)
          }
        })
        this.problemIdOneList = arr
        this.$nextTick(() => {
          this.$refs.search.set({
            type: 'options',
            data: {
              problemIdOne: arr
            }
          })
        })
        // this.setChannel(arr, key, type)
      })
    },
    // 搜索框 change
    onSearchChange(val, oldVal) {
      if (val.businessId && val.businessId !== oldVal.businessId) {
        this.$refs.search.set({ type: 'options', data: { serviceObject: SEIVICE_OBJ_MAP[val.businessId] }})
        this.$refs.search.set({ type: 'defaultVal', data: { serviceObject: '' }})
        this.$refs.search.set({ type: 'defaultVal', data: { problemIdOne: '', problemIdTwo: '', problemIdThree: '', problemIdFour: '', problemIdFive: '' }})
        // 获取问题分类列表
        this.getProblemChannel(val.businessId)
      }
      if (val.problemIdOne && val.problemIdOne !== oldVal.problemIdOne) {
        this.$refs.search.set({ type: 'defaultVal', data: { problemIdTwo: '', problemIdThree: '', problemIdFour: '', problemIdFive: '' }})
        let arr = []
        this.problemIdOneList.forEach(item => {
          if (item.value === val.problemIdOne) {
            arr = item.children
          }
        })
        this.$nextTick(() => {
          this.$refs.search.set({
            type: 'options',
            data: {
              problemIdTwo: arr
            }
          })
        })
      }
      if (val.staffMobile && val.staffMobile !== oldVal.staffMobile) {
        this.$refs.search.set({
          type: 'defaultVal',
          data: {
            staffMobile: val.staffMobile.replace(/\D/g, '')
          }
        })
      }

      const { problemId, problemIdThree, problemIdFour, problemIdTwo } = val
      if (problemId?.toString() && problemId?.toString() !== oldVal?.problemId?.toString()) {
        this.recursionProb(['problemIdFive', 'problemIdFour', 'problemIdThree'])
        this.getSearchChild(problemId.toString(), 'problemIdThree')
      } else if (problemIdTwo?.toString() && problemIdTwo?.toString() !== oldVal?.problemIdTwo?.toString()) {
        this.recursionProb(['problemIdFive', 'problemIdFour', 'problemIdThree'])
        this.getSearchChild(problemIdTwo.toString(), 'problemIdThree')
      } else if (problemIdThree?.toString() && problemIdThree?.toString() !== oldVal?.problemIdThree?.toString()) {
        this.recursionProb(['problemIdFive', 'problemIdFour'])
        this.getSearchChild(problemIdThree.toString(), 'problemIdFour')
      } else if (problemIdFour?.toString() && problemIdFour?.toString() !== oldVal?.problemIdFour?.toString()) {
        this.recursionProb(['problemIdFive'])
        this.getSearchChild(problemIdFour.toString(), 'problemIdFive')
      }
    },
    // 获取子问题
    getSearchChild(val, key) {
      const params = {
        pids: val
      }
      getBypidsFilter(params).then(res => {
        const data = res.payload || []
        this.$refs.search.set({
          type: 'options',
          data: {
            [key]: this.tranFormChildData(data)
          }
        })
      })
    },
    tranFormChildData(data) {
      return data.map(item => {
        return {
          label: item.problemStatus ? '（内部）' + item.cpType : item.cpType,
          value: item.problemIdNew
        }
      })
    },
    // 根据表单数据动态设置显示隐藏
    recursionProb(problemArr) {
      problemArr.map(res => {
        this.$refs.search.set({ type: 'options', data: { [res]: null }})
        this.$refs.search.recoveryForm({ [res]: null })
      })
    },
    // 处理 分配多个名单 状态
    /**
     * @param val String 1: 关闭添加名单 2: 开启添加名单
     */
    handleAddPeople(val) {
      if ([1, 2].includes(val)) {
        this.addPeopleStatus = val !== 1
      } else {
        this.addPeopleStatus = !this.addPeopleStatus
      }
      this.columns = this.addPeopleStatus ? [...TableColumnsAdd] : [...TableColumns]
      this.multipleSelection = []
      this.tableKey += 1
      this.initPaninationAndGetList()
    },
    // 处理表格 多选
    handleSelectionChange(val) {
      console.log('handleSelectionChange', val)
      if (this.addPeopleStatus) {
        if (val.length) {
          const staffNames = []
          val.forEach(v => {
            if (!v.autoDistribution) {
              staffNames.push(v.staffName)
            }
          })
          if (staffNames.length) {
            this.$confirm(`${staffNames.join(',')}已在名单中～`)
          }
        }
      }
      this.multipleSelection = val
    },
    // 批量开启
    handleBatchAddNameList() {
      this.$confirm('确定全部添加吗', '', { type: 'warning' }).then(() => {
        const ids = this.multipleSelection.map(v => v.id).join(',')
        delDistributionUser({ userId: ids, status: 0 }).then(res => {
          if (res?.code === 0) {
            this.$message.success('添加成功～')
            this.initPaninationAndGetList()
          }
        })
      })
    },
    // 处理服务对象转化
    transferServiceObj(val) {
      let str = ''
      val.split(',').forEach((v, i) => {
        str += `${SERVICE_OBJECT_MAP[v]}${i < val.split(',').length - 1 ? ',' : ''}` || ''
      })
      return str
    },
    // 批量删除
    handleBatchDelNameList() {
      this.$confirm('确定全部删除吗?', '', { type: 'warning' }).then(() => {
        const ids = this.multipleSelection.map(v => v.id).join(',')
        delDistributionUser({ userId: ids, status: 1 }).then(res => {
          if (res?.code === 0) {
            this.$message.success('删除成功～')
            this.initPaninationAndGetList()
          }
        })
      })
    },
    // 修改人数上线
    editNum(row) {
      this.$prompt(`确定修改${row.staffName}的服务上限吗？`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (e) => {
          if (Number(e) > 0 && Number(e) < 1000) {
            return true
          }
          return false
        },
        inputValue: row.serviceUpperNum,
        inputErrorMessage: '只能输入大于等于1且小于1000的数字！',
        center: true
      }).then(({ value }) => {
        console.log(value)
        serviceUpperNum({ userIds: row.id, num: value }).then((res) => {
          if (res?.code === 0) {
            this.initPaninationAndGetList()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      })
    },
    // 批量修改人数上线
    editNums() {
      const { multipleSelection } = this
      if (multipleSelection.length === 0) {
        this.$confirm('请先选择需要操作的员工！', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        let inputValue = Infinity
        multipleSelection.forEach((v) => {
          inputValue = Math.min(inputValue, v.serviceUpperNum)
        })
        this.$prompt(`确定修改${multipleSelection.length}人的服务上限吗？`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (e) => {
            if (Number(e) > 0 && Number(e) < 1000) {
              return true
            }
            return false
          },
          inputValue,
          inputErrorMessage: '只能输入大于等于1且小于1000的数字！',
          center: true
        }).then(({ value }) => {
          const userIds = multipleSelection.map(v => v.id).join(',')
          serviceUpperNum({ userIds, num: value }).then((res) => {
            if (res?.code === 0) {
              this.initPaninationAndGetList()
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .cell {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-switch__label--left {
      color: #909399 !important;
      line-height: 20px;
    }
    .el-switch__core {
      line-height: 20px;
    }
  }
}
.auto-complaint {
  .header {
    .title {
      vertical-align: middle;
    }
  }
  .con {
    font-size: 14px;
    span {
      color: rgb(214, 44, 44);
    }
  }
}

.distribution-list {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .text {
      font-size: 12px;
      b {
        color: blue;
      }
    }
  }
}

.name-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /deep/ .el-button--medium {
    padding: 0;
  }
  b {
    color: rgb(214, 44, 44);
  }
}

.checked-name-list {
  font-size: 14px;
  margin-bottom: 10px;
}

.empty-name-list {
  text-align: center;
  font-size: 14px;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/ .el-button--small {
    padding: 2px
  }
}
</style>
