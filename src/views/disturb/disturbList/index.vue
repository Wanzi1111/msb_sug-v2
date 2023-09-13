<template>
  <div>
    <div class="app-container app-complain-title">
      <span>勿扰名单</span>
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
      <basics-menu-taps
        :actions="TabList"
        :active-index="activeIndex"
        :handle-select="activeIndexChange"
        :disabled="loadings._ums_meixiu_api_out_in_platForm_getBusinessTypeSupplierNameList"
      />
      <basics-search
        ref="searchs"
        style="margin-top: 12px"
        :searchs="searchs"
        :loading="loadings._ums_meixiu_api_out_in_platForm_getBusinessTypeSupplierNameList"
        @submitSearch="onsubmitSearch"
      >
        <template slot="handlePeople" class="search-item">
          <el-input
            v-model="searchQuery.inputName"
            placeholder="请输入"
            class="search-item-element"
            size="small"
          >
            <el-select
              slot="prepend"
              v-model="searchQuery.selectName"
              placeholder="请选择"
              class="el-input-select"
            >
              <el-option label="姓名" value="1" />
              <el-option label="手机号" value="2" />
            </el-select>
          </el-input>
        </template>
      </basics-search>
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :table="table"
        :list="list"
        :loading="loadings._ums_meixiu_api_out_in_platForm_ObNotDisturbListList"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      >
        <template slot="disturbMobile" slot-scope="scope">
          <div class="columns-txt">
            {{
              scope.row.disturbMobile === disturbMobile
                ? scope.row.disturbMobile
                : `${scope.row.disturbMobile.slice(
                  0,
                  3
                )}****${scope.row.disturbMobile.slice(-4)}`
            }}
            <svg-icon
              style="cursor: pointer"
              :icon-class="disturbMobileIcone(scope.row.disturbMobile)"
              @click="isDisturbMobile(scope.row.disturbMobile)"
            />
          </div>
        </template>
        <template slot="listType" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.listType | listName }}</div>
        </template>
        <template slot="remark" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.remark }}</div>
        </template>
        <template slot="enjoinTime" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.enjoinTime | timeFormat }}</div>
        </template>
        <template slot="entryUser" slot-scope="scope">
          <div class="columns-txt">
            {{ scope.row.entryUser + scope.row.entryMobile }}
          </div>
        </template>
      </basics-table>
    </div>
    <!-- 添加勿扰标签 弹出框 -->
    <el-dialog
      width="550px"
      :title="info.title"
      :visible.sync="dialogNewVisibleDisturb"
    >
      <basics-form
        ref="disturbFormref"
        :key="dialogNewVisibleDisturb"
        class="complaint-form-box"
        :forms="DisturbForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        @submitForm="onFormSubmit"
      />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import searchs from './search/search'
import { default as act } from './actions/actions'
import columns, { actions } from './columns/index'
import {
  ObNotDisturbListList,
  addOrUpdateObNotDisturb
} from '@/api/disturb/index'
import { addOrUpdateObNotDisturbNew } from '@/api/operate/complainNew'
import {
  disturbForm,
  categorieDatas,
  actions as complaintFormAction
} from './forms/complaintForm'
import { mapState } from 'vuex'
import moment from 'moment'
import { getToken } from '@/utils/auth'
const init_pagaination = {
  page: 1,
  limit: 20
}
export default {
  name: '',
  filters: {
    timeFormat(e) {
      return e !== '0' && e ? moment(+e).format('YYYY-MM-DD HH:mm:ss') : '永久'
    },
    listName(e) {
      let listType = []
      Object.keys(window.BusinessListData)?.forEach((v) => {
        if (window.BusinessListData[v]) {
          window.BusinessListData[v].forEach((vv) => {
            if (vv.value === e) {
              listType = vv.label
            }
          })
        }
      })
      return listType
    }
  },
  data() {
    return {
      moment,
      valueDate: '',
      activeIndex: '1_allChildLIst',
      activeIndexId: '1',
      daterangeTime: [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)],
      searchQuery: {
        disturbMobile: '', // 手机号码
        listType: '', //  勿扰类型
        enjoinTime: '',
        releaseTime: '',
        inputName: '',
        selectName: '1'
      },
      dialogNewVisibleDisturb: false,
      searchs,
      columns,
      disturbForm,
      DisturbForm: [],
      info: {
        title: '',
        instroduct: ''
      },
      table: {
        stripe: false,
        border: false
      },
      actionFunction: actions({
        removeblacklist: this.removeblacklist
      }),
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      activeChannelState: '01',
      act: act({
        addblacklist: this.addblacklist,
        showTabFlag: this.showTabFlag || false
      }),
      disturbMobile: ''
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    ...mapState({
      TabList: (state) =>
        state.global.BusinessListData?.businessClassificationLIst,
      allChildLIst: (state) => state.global.BusinessListData?.allChildLIst
    }),
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
    // 当状态为业务线显示按钮类型状态
    activeIndexId(val, oldval) {
      if (val === '1' || (val === '3' && val !== oldval)) {
        this.act = act({ addblacklist: this.addblacklist, showTabFlag: false })
      } else {
        this.act = act({ addblacklist: this.addblacklist, showTabFlag: true })
      }
    },
    activeIndex(val, oldval) {
      this.initParamsAndGetList()
    }
  },
  created() {
    this.$store.dispatch('global/BusinessTypeSupplierNameList')
    this.$nextTick(() => {
      this.$refs.searchs.set({
        type: 'options',
        data: { listType: this.allChildLIst }
      })
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
      console.log(this.TabList, 'TabList')
    })
    this.$refs.searchs.set({
      type: 'options',
      data: { listType: this.allChildLIst }
    })
    this.$refs.searchs.set({
      type: 'defaultVal',
      data: { listType: [] }
    })
  },
  methods: {
    //   获取所有的黑名单列表
    getList() {
      const { searchQuery, listQuery } = this
      const obj = {}
      if (searchQuery.selectName) {
        switch (searchQuery.selectName) {
          case '2':
            obj.entryMobile = searchQuery.inputName
            obj.entryUser = ''
            break
          case '1':
            obj.entryUser = searchQuery.inputName
            obj.entryMobile = ''
            break
          default:
            break
        }
      }
      const newSearchQuery = {
        ...searchQuery,
        ...obj,
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }
      // 每次获取列表数据重置查看手机号
      this.disturbMobile = ''
      ObNotDisturbListList(newSearchQuery).then((res) => {
        if (res?.code === 0) {
          const {
            payload: { list, totalSize, page }
          } = res
          this.list = list
          this.total = totalSize
          if (page > 1 && list.length === 0) {
            this.listQuery = {
              ...init_pagaination,
              page: page - 1
            }
            this.$nextTick(() => {
              this.getList()
            })
          }
        }
      })
    },
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e === this.disturbMobile) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e
      }
    },
    initParamsAndGetList() {
      this.listQuery = {
        ...init_pagaination
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 获取点击头部tab的index
    activeIndexChange(id, idList) {
      this.activeIndex = id
      this.activeIndexId = idList[0]
      this.$refs.searchs.set({
        type: 'options',
        data: { listType: window.BusinessListData[id?.split('_')[1]] }
      })
      this.$refs.searchs.set({
        type: 'defaultVal',
        data: { listType: [] }
      })
      this.searchQuery = {
        ...this.searchQuery,
        listType: ''
      }
      this.initParamsAndGetList()
    },
    //   改变日期
    changeDate(val) {
      this.daterangeTime = val
    },
    //   添加勿扰
    addblacklist() {
      this.info = {
        title: '添加勿扰'
      }
      this.dialogNewVisibleDisturb = true
      this.DisturbForm = disturbForm
    },
    // 提交勿扰标签的表单二次确认
    onFormSubmit(values) {
      this.$confirm(
        '<span style="color:red">数据将进行过滤，请谨慎操作</span>',
        '是否确认提交？',
        {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.addOrUpdateObNotDisturbNewFn(values)
      })
    },
    // 提交勿扰标签的表单
    addOrUpdateObNotDisturbNewFn(values) {
      const newData = { ...values }
      newData.types = values.types.toString()
      newData.cname = getToken('cname')
      newData.cmobile = getToken('userMobile')
      newData.uid = getToken('userId')
      newData.effectDays = +values.effectDays
      newData.mobiles = values.mobiles.replace(/\n/g, ',')
      newData.origin = 4
      newData.ctype = 4
      newData.categories = []
      values.categories.map(val => {
        if ([1, 2].includes(val)) {
          newData.categories.push('30-' + val)
        } else if ([3, 4, 5, 6].includes(val)) {
          newData.categories.push('31-' + val)
        } else {
          newData.categories.push(String(val))
        }
      })
      newData.infos = []
      categorieDatas.map(val => {
        if (values.categories.includes(val.value)) {
          if (values.types.includes(1)) {
            newData.infos.push(val.label + '营销短信勿扰')
          }
          if (values.types.includes(2)) {
            newData.infos.push(val.label + '营销电话勿扰')
          }
        }
      })
      addOrUpdateObNotDisturbNew(newData).then((res) => {
        if (res?.code === 0) {
          this.initParamsAndGetList()
          this.$message({
            type: 'success',
            message: '新增成功'
          })
        }
      })
      this.dialogNewVisibleDisturb = false
    },
    // 移出黑名单
    removeblacklist(dat, row, index) {
      this.$confirm('确定把用户移出勿扰吗？', '', {
        distinguishCancelAndClose: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      })
        .then(() => {
          const newrow = {}
          newrow.isRelease = '1'
          newrow.id = row.id
          addOrUpdateObNotDisturb(newrow).then((res) => {
            if (res?.code === 0) {
              this.initParamsAndGetList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch((action) => {
          return
        })
    },
    // 搜索表单内容
    onsubmitSearch(val, state = false) {
      // 点击重置
      if (state) {
        this.searchQuery = {
            selectName: '1'
        }
        this.daterangeTime = [new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000)]
      } else {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.searchQuery = {
          ...this.searchQuery,
          disturbMobile: val.disturbMobile,
          listType: val.listType?.join(),
          enjoinTime: this.daterangeTime?.[0]
        ? moment(this.daterangeTime[0]) + ''
        : '',
          releaseTime: this.daterangeTime?.[1]
        ? moment(this.daterangeTime[1]).endOf('day') + ''
        : ''
        }
      }
        this.getList()
    },
    // 取消表单内容
    cancel() {
      this.dialogNewVisibleDisturb = false
    },
    ensure() {
      this.$refs.disturbFormref.defaultAction('submit')
    }
  }
}
</script>
<style lang="scss" scoped>
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
.columns-txt {
  font-size: 12px;
  text-align: left;
}
.columns-note {
  color: #999999;
  font-size: 12px;
  text-align: left;
}
/deep/ .search-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    height: 36px;
    .search-item-label {
      display: block;
      // width: 100px;
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      color: #606266;
    }
    .el-select{
      width: 90px;
    }
    .search-item-element {
      display: flex;
      flex: 1;
      margin-right: 10px;
      .el-input-group__prepend{
        display: flex;
        width: 90px;
        flex: 1;
        align-items: center;
      }
    }
  }
</style>
