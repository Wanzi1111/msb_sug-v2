<template>
  <div>
    <div class="app-container app-complain-title">
      <span>短信记录</span>
    </div>
    <div class="app-container">
      <basics-menu-taps
        :actions="TabList"
        :active-index="activeIndex"
        :handle-select="activeIndexChange"
        :disabled="loadings._ums_meixiu_api_sms_api_messagePlatForm_selectDinc"
      />
      <basics-search
        ref="searchs"
        :loading="loadings._ums_meixiu_api_sms_api_messagePlatForm_selectDinc"
        style="margin-top: 12px"
        :searchs="searchs"
        @submitSearch="submitSearch"
        @changeSearch="changeSearch"
      />
      <el-tabs v-model="activeTypeTabsOneValue">
        <el-tab-pane
          v-for="item in TypeTabList"
          :key="item.key"
          :label="item.label"
          :name="item.value"
        >
          <span slot="label" class="tabpaneBadge">
            <el-badge :value="groupCountMap[item.key] !== 0?groupCountMap[item.key]:''" :max="99999" style="line-height: 25px">
              {{ item.label }}
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <basics-table
        ref="table"
        :table="table"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
        :loading="loadings._ums_meixiu_api_sms_api_messagePlatForm_selectSmsRecordList"
      >
        <template slot="SMSType" slot-scope="scope">
          <div>{{ scope.row | SMSType }}</div>
        </template>
        <template slot="uid" slot-scope="scope">
          <div>UID：{{ scope.row.uid }}</div>
          <div class="table-small-box">
            {{ scope.row.area }}
            {{ (disturbMobileObj && (scope.row.id === disturbMobileObj.id && scope.row.mobile === disturbMobileObj.mobile)) ?
              scope.row.mobile :
              scope.row.mobile.replace(/([0-9]{3})([0-9]{5})([0-9]{3})/, '$1*****$3') }}
            <svg-icon
              style="cursor: pointer;"
              :icon-class="disturbMobileIcone(scope.row)"
              @click="isDisturbMobile(scope.row)"
            />
          </div>
        </template>
        <template slot="numberWords" slot-scope="scope">
          <div>{{ scope.row.numberWords }}/{{ scope.row.apartSize }}</div>
        </template>
        <template slot="sendTime" slot-scope="scope">
          <div>{{ scope.row.sendTime | timeFormat }}</div>
        </template>
      </basics-table>
    </div>
    <el-dialog
      width="730px"
      :title="'短信详情'"
      :visible.sync="dialog"
    >
      <div style="display: flex; align-items: center">
        <span style="color: #555;font-size: 16px;margin-right: 20px">短信信息</span>
      </div>
      <el-divider />
      <div class="info-box">
        <div> <span>场景ID：</span> {{ actionObj.scenarioId }} </div>
        <div> <span>供应商：</span> {{ actionObj.supplierName }} </div>
        <div> <span>场景名称：</span> {{ actionObj.scenarioName }} </div>
        <div> <span>中台模版ID：</span> {{ actionObj.templateId }} </div>
        <div> <span>短信类型：</span> {{ actionObj | SMSType }} </div>
        <div> <span>UID：</span> {{ actionObj.uid }} </div>
        <div> <span>短信签名：</span> 【{{ actionObj.signature }}】 </div>
        <div> <span>手机号：</span>
          {{ disturbMobileObj ?
            actionObj.mobile :
            actionObj.mobile && actionObj.mobile.replace(/([0-9]{3})([0-9]{5})([0-9]{3})/, '$1*****$3') }}
          <svg-icon
            style="cursor: pointer;"
            :icon-class="disturbMobileIcone(actionObj)"
            @click="isDisturbMobile(actionObj)"
          />
        </div>
        <div> <span>字数/拆分条数：</span> {{ actionObj.numberWords }}/{{ actionObj.apartSize }} </div>
        <div> <span>业务请求ID：</span> {{ actionObj.requestId }} </div>
      </div>
      <div class="call-box">
        <div> <span>短信内容：</span> {{ actionObj.messageContent }} </div>
      </div>
      <div style="display: flex; align-items: center">
        <span style="color: #555;font-size: 16px;margin-right: 20px;margin-top: 20px">发送情况</span>
      </div>
      <el-divider />
      <div class="call-box">
        <div>
          <span>请求时间：
            <el-tooltip effect="dark" content="请求时间：业务请求中台的时间" placement="top">
              <i style="color: rgb(176,176,176)" class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          {{ actionObj.requestTime | timeFormat }}
        </div>
        <div>
          <span>发送时间：
            <el-tooltip effect="dark" content="发送时间：中台请求供应商的时间" placement="top">
              <i style="color: rgb(176,176,176)" class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          {{ actionObj.sendTime | timeFormat }}
        </div>
        <div>
          <span>供应商发送时间：
            <el-tooltip effect="dark" content="供应商发送时间：供应商发送短信的时间" placement="top">
              <i style="color: rgb(176,176,176)" class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          {{ actionObj.supplierSendTime | timeFormat }}
        </div>
        <div>
          <span>返回结果时间：
            <el-tooltip effect="dark" content="返回结果时间：运营商返回状态的时间" placement="top">
              <i style="color: rgb(176,176,176)" class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          {{ actionObj.backTime | timeFormat }}
        </div>
        <div> <span>短信状态：</span> <el-button :type="type[+actionObj.sendStatus]" size="mini" plain>{{ actionObj.messageStatus }}</el-button> </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog = false; disturbMobileObj = null ">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { selectDinc,
 selectSmsOneTypeList,
  selectSmsTwoTypeList,
   selectSmsMessageTemplateList,
   selectSmsRecordList } from '@/api/messageList/index'
import searchs from './searchs/index'
import { TypeTabList } from './config'
import columns, { actions } from './columns'
import moment from 'moment'

export default {
   name: 'MessageList',
   filters: {
    timeFormat(e) {
      return (e !== '0' && e) ? moment(+e).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    SMSType(e) {
      const domesticForeign = { 0: '国内', 1: '国际' }
      const messageType = { 0: '通知短信', 1: '营销短信', 2: '验证码' }
      return `${domesticForeign[+e['domesticForeign']]}-${messageType[+e['messageType']]}`
    }
    },
   data() {
       return {
         type: ['primary', 'primary', 'success', 'danger', 'warning', 'warning', 'warning'],
         activeIndex: '',
         businessType: '',
         activeTypeTabsOneValue: 'null',
         TabList: [],
         searchs,
         columns,
         actionFunction: actions({
           tableAction: this.tableAction
         }),
         table: {
          stripe: false,
          border: false
        },
         total: 0,
         list: [],
         listQuery: {
           page: 1,
           limit: 20
         },
         searchQuery: {
         sendTimeStart: moment(new Date() - 29 * 24 * 60 * 60 * 1000).format('YYYYMMDD'),
         sendTimeEnd: moment(new Date()).format('YYYYMMDD')
         },
         TypeTabList,
         actionObj: {},
         disturbMobileObj: null,
         dialog: false,
         listSupplierNameType: [],
         groupCountMap: {},
         typeFlag: true
       }
   },
   computed: {
    disturbMobileIcone() {
      return function(e) {
        if (e?.id !== this.disturbMobileObj?.id || e?.mobile !== this.disturbMobileObj?.mobile) {
          return 'eye'
        } else {
          return 'eye-open'
        }
      }
    },
    ...mapGetters(['loadings'])
   },
   watch: {
     activeTypeTabsOneValue: function(val, oldVal) {
       if (val !== oldVal) {
         this.getList()
       }
     }
   },
   mounted() {
     this.$nextTick(() => {
       this.getSelectDinc()
       this.getSelectSmsMessageTemplateList()
     })
   },
   methods: {
     activeIndexChange(id, idList) {
         this.listQuery = {
          page: 1,
          limit: 20
        }
        this.$refs.searchs.set({
           type: 'defaultVal',
           data: {
             twoType: ''
           }
         })
       this.getSelectSmsTwoTypeList(id)
       this.businessType = this.TabList?.find(item => item.children?.find(val => val.value === id))?.value
       this.activeIndex = id
       this.getList()
     },
    // 获取短信列表的业务线
    async getSelectDinc() {
      const res = await selectDinc()
      const { code, payload: { listBusinessType, listSupplierNameType }} = res
      if (code === 0) {
        this.TabList = this.setTabData(listBusinessType)
        this.listSupplierNameType = listSupplierNameType
        const newdata = this.TabList
        newdata.map((val) => {
        this.getselectSmsOneTypeList(val)
        })
        if (newdata[0].value) {
          this.businessType = newdata[0].value
        }
      }
     },
    // 获取短信的二级分类
     async getselectSmsOneTypeList(val) {
       const data = {
         businessType: val.code,
         pageNum: 1,
         pageSize: 9999
       }
       const res = await selectSmsOneTypeList(data)
       const { code, payload: { list }} = res
       if (code === 0) {
        val.children = list
        val.type = val.children.length !== 0 ? 'submenu' : 'item'
        val.children.map(item => {
              item['type'] = 'item'
              item['title'] = item.oneTypeName
              item['value'] = item.id
        })
        // 给初始的一级tab加默认高亮 去子集的第一个数据的id
        this.activeIndex = this.TabList[0]?.children[0]?.id
        if (this.activeIndex && this.typeFlag) {
          this.typeFlag = false
          this.getSelectSmsTwoTypeList(this.activeIndex)
          this.getList()
        }
       }
     },
     async getSelectSmsTwoTypeList(val) {
       const data = {
         parentId: val,
         pageNum: 1,
         pageSize: 9999
       }
       const res = await selectSmsTwoTypeList(data)
       const { code, payload: { list }} = res

       if (code === 0) {
         this.$refs.searchs.set({
           type: 'options',
           data: {
             twoType: this.tranFormData(list)
           }
         })
       }
     },
    //  获取短信签名
     async getSelectSmsMessageTemplateList() {
      const data = {
        pageNum: 1,
        pageSize: 9999
        }
        const res = await selectSmsMessageTemplateList(data)
        const { code, payload: { list }} = res
        if (code === 0) {
          this.$refs.searchs.set({
            type: 'options',
            data: { signature: list?.reduce((pre, cur) => {
              return pre.find((i) => i.signature === cur.signature)
                ? pre : [...pre, cur]
            }, [])
            .map((item) => {
              return {
                label: item.signature,
                value: item.signature
              } || []
            }) }
          })
        }
     },
    //  tab数据二次处理
    setTabData(data) {
      return data.map((v) => {
        return {
          ...v,
          type: 'submenu',
          title: v.desc,
          value: v.code,
          children: []
        }
      })
    },
    async getList() {
      const { searchQuery, activeIndex, listQuery, activeTypeTabsOneValue, businessType } = this
      const data = {
        ...searchQuery,
        businessType: businessType,
        sendStatus: activeTypeTabsOneValue === 'null' ? undefined : activeTypeTabsOneValue,
        pageNum: listQuery.page,
        pageSize: listQuery.limit,
        oneId: activeIndex === 'null' ? undefined : activeIndex
         }
      const res = await selectSmsRecordList(data)
      const { code, payload: { list, totalSize, groupCountMap }} = res
      if (code === 0) {
          this.list = list
          this.total = totalSize
          this.groupCountMap = { ...groupCountMap, 'null': Object.keys(groupCountMap).reduce((pre, cur) => {
            pre += groupCountMap[cur]
            return pre
          }, 0) }
      }
    },
    // 转化数据
    tranFormData(data) {
      return data.map(item => {
        return {
          label: item.desc || item.twoTypeName || item.signature,
          value: item.code || item.id || item.signature
        }
      })
    },
    submitSearch(value, state = false) {
    if (state) {
         this.searchQuery = {
         sendTimeStart: moment(new Date() - 29 * 24 * 60 * 60 * 1000).format('YYYYMMDD'),
         sendTimeEnd: moment(new Date()).format('YYYYMMDD')
         }
         this.activeIndex = this.TabList[0]?.children[0]?.id
         this.businessType = this.TabList[0]?.value
         this.listQuery = {
          page: 1,
          limit: 20
        }
        // 重置分类的数据
         this.typeFlag = true
        if (this.activeIndex && this.typeFlag) {
          this.typeFlag = false
          this.getSelectSmsTwoTypeList(this.activeIndex)
        }
      } else {
      const newSearchQuery = { ...this.searchQuery, ...value }
      newSearchQuery.domesticForeign = value.SMSType.length ? value.SMSType[1]?.split('-')?.[0] : ''
      newSearchQuery.messageType = value.SMSType.length ? value.SMSType[1]?.split('-')?.[1] : ''

      newSearchQuery.sendTimeStart = value.sendTimeList ? moment(value.sendTimeList[0]).format('YYYYMMDD') : ''
      newSearchQuery.sendTimeEnd = value.sendTimeList ? moment(value.sendTimeList[1]).format('YYYYMMDD') : ''

      newSearchQuery.scenarioName = ''
      newSearchQuery.scenarioId = ''
      newSearchQuery.templateId = ''
      newSearchQuery.requestId = ''
      newSearchQuery[value.sceneInfoInputSelectProp] = value.sceneInfoInputSelect

      newSearchQuery.uid = ''
      newSearchQuery.mobile = ''
      newSearchQuery[value.userInfoInputSelectProp] = value.userInfoInputSelect

      newSearchQuery.oneId = (this.activeIndex !== 'null' && this.activeIndex) || ''
      newSearchQuery.twoId = (this.activeIndex !== 'null' && value.twoType) || ''
      // delete newSearchQuery.sendTimeList
      // delete newSearchQuery.oneId
      this.searchQuery = { ...newSearchQuery, twoType: undefined }
      }
      this.getList()
    },
    changeSearch(value) {
      const newSearchQuery = { ...this.searchQuery, ...value }
      newSearchQuery.sendTimeStart = value.sendTimeList ? moment(value.sendTimeList[0]).format('YYYYMMDD') : ''
      newSearchQuery.sendTimeEnd = value.sendTimeList ? moment(value.sendTimeList[1]).format('YYYYMMDD') : ''
      const threeDay = 30 * 24 * 60 * 60 * 1000
      const days = moment(newSearchQuery.sendTimeEnd).valueOf() - moment(newSearchQuery.sendTimeStart).valueOf()
      if (days && days > threeDay) {
        this.$refs.searchs.set({
          type: 'defaultVal',
          data: { sendTimeList: [moment(new Date() - 29 * 24 * 60 * 60 * 1000).valueOf(), moment(new Date()).valueOf()] }
        })
        this.$message({
          type: 'error',
          message: '时间范围不能超过30天'
        })
      }
    },
    tableAction(dat, row, index, type) {
      this.actionObj = row
      this.actionObj.supplierName = this.listSupplierNameType?.find(val => val.code === row.supplierName)?.desc
      this.disturbMobileObj = null
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    isDisturbMobile(e) {
      if (e?.id === this.disturbMobileObj?.id) {
        this.disturbMobileObj = null
      } else {
        this.disturbMobileObj = e
      }
    }
   }
}
</script>
<style lang='scss' scoped>
.info-box, .call-box {
  display: flex;
  flex-wrap: wrap;
  align-items: left;
  justify-content: left;
  &>div {
    width: 50%;
    // margin-bottom: 16px;
    &>span {
      width: 110px;
      line-height: 40px;
      display: inline-block;
      text-align: right;
      font-weight: 500;
    }
  }
}
.call-box {
  &>div {
    width: 100%;
    &>span {
      width: 130px;
      flex-shrink: 0;
    }
  }
}
/deep/.search-container{
  .el-col:nth-last-child(1){
    width: 22%;
  }
  .el-col:nth-last-child(3){
    width: 28%;
  }
}
</style>
