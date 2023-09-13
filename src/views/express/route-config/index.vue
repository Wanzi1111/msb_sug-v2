<template>
  <div>
    <div class="title-container">
      <basics-title
        title="路由配置"
        line
      />
    </div>
    <div class="app-container">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane v-for="(tab,index) in tabList" :key="index" :label="tab.label" :name="tab.name" />
      </el-tabs>
      <basics-search v-show="activeTab == 'routeRule'" ref="searchs" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <div v-show="activeTab == 'ruleGroup'" class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="createRuleGroup">新增规则组</el-button>
      </div>
      <basics-table
        :key="activeTab"
        ref="table"
        :table="table"
        :loading="loadings._logistics_rout_group_list || loadings._logistics_rout_findBy"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
      >
        <template slot="groupName" slot-scope="scope">
          <span>{{ `${scope.row.levels} ${scope.row.businessLabel} : ${scope.row.routGroupName}` }}</span>
        </template>
      </basics-table>
    </div>
    <!-- 新增/编辑规则组 -->
    <el-dialog
      :title="ruleGroupDialogMode === 'addRuleGroup' ? '新增规则组': '编辑规则组'"
      :visible.sync="dialogRuleVisable"
      width="500px"
      destroy-on-close
      :before-close="closeDl"
    >
      <basics-form ref="formRuleGroup" :forms="formRule" :actions="formRuleAct" @submitForm="submitRuleForm" />
    </el-dialog>
    <!-- 添加/编辑路由 -->
    <el-dialog
      :title="routeDialogMode ==='addRoute' ? '添加路由': '编辑路由'"
      :visible.sync="dialogRouteVisable"
      width="600px"
      destroy-on-close
      :before-close="closeDl"
    >
      <basics-form ref="formRoute" :attr="{labelWidth: '106px', customClass: 'route-form'}" :forms="formRoute" :actions="formRouteAct" @submitForm="submitRouteForm">
        <template slot="desp">
          <div class="desp">
            <template v-if="routeDialogMode === 'editRoute'">
              <span class="main-font">{{ `${currRuleItem.title}  ${currRuleItem.routName}` }}</span>
              <span>
                {{ `${currRuleItem.groupTitle} ${currRuleItem.businessLabel} : ${currRuleItem.routGroupName}` }}
              </span>
            </template>
            <span v-if="routeDialogMode === 'addRoute'">
              {{ `${currRuleGroup.levels} ${currRuleGroup.businessLabel} : ${currRuleGroup.routGroupName}` }}
            </span>
          </div>
        </template>
        <template slot="city">
          <!-- slot-scope="scope" -->
          <!-- <el-form-item v-bind="scope.item" class="form-item"> -->
          <div class="form-item">
            <span class="span-item">配送区域</span>
            <el-select v-model="deliveryArea" placeholder="请选择" class="select-item">
              <el-option
                v-for="item in [{value:1,label:'全国'},{value:0,label:'区域'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-show="deliveryArea === 1" v-model="isContainsHmt" placeholder="请选择">
              <el-option
                v-for="item in [{value:0,label:'不含港澳台'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-show="deliveryArea === 0" v-model="provinceNames" collapse-tags multiple placeholder="请选择">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- </el-form-item> -->
        </template>
      </basics-form>
    </el-dialog>
  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import searchs from './searchs/list'
import formRule, { actions as formRuleAct } from './forms/rule'
import formRoute, { actions as formRouteAct } from './forms/route'
import columnsRuleGroup, { actions as actionsRuleGroup } from './columns/rule-group'
import columnsRouteRule, { actions as actionsRouteRule } from './columns/route-rule'
import { queryAll } from '@/api/express/national'
import { groupList, groupAdd, groupUpdate, groupOnoff, groupRemove, addRule, findBy, delRout, switchRule, levelUpdate, updateRule } from '@/api/express/route-config'
import { businessList, houseListApi } from '@/api/goods/manage'
import { mapGetters } from 'vuex'

export default {
  name: 'RouteConfig',
  components: { BasicsTitle, BasicsSearch, BasicsTable, BasicsForm },
  data() {
    return {
      provinceNames: [],
      cityOptions: [],
      isContainsHmt: 0,
      deliveryArea: 1,
      currRuleGroup: {},
      currRuleItem: {},
      businessItems: [],
      ruleGroupDialogMode: 'addRuleGroup',
      routeDialogMode: 'addRoute',
      dialogRuleVisable: false,
      dialogRouteVisable: false,
      searchs: searchs,
      table: { stripe: true },
      columns: columnsRuleGroup,
      formRule: formRule,
      formRoute: formRoute,
      formRuleAct: formRuleAct({ closeDl: this.closeDl }),
      formRouteAct: formRouteAct({ closeDl: this.closeDl }),
      actions: actionsRuleGroup({ tableAction: this.tableAction }),
      total: 0,
      list: [
        // { name: 1, status: 0 }, { name: 2, status: 1 }
      ],
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      activeTab: 'ruleGroup',
      tabList: [
        { label: '规则组', name: 'ruleGroup' },
        { label: '路由规则', name: 'routeRule' }
      ],
      businessMap: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getBusiness()
    this.$nextTick(() => {
      this.getCity()
      setTimeout(() => {
        this.getGroupList()
      }, 200)
    })
  },
  methods: {
    getGroupList() {
      groupList({}).then(res => {
        const list = res.data || []
        this.total = 0
        const groupItems = []
        this.list = list.map(item => {
          groupItems.push(
            {
              value: item.id,
              label: item.routGroupName
            }
          )
          return {
            ...item,
            businessLabel: this.businessMap[item.businessCode]
          }
        })
        this.$refs.searchs && this.$refs.searchs.set({
          type: 'options',
          data: { groupId: groupItems }
        })
        console.log(res, 1234)
      })
    },
    async getWarehouseList(businessItems, codeArr) {
      const params = {
        businessCode: codeArr[0]
      }
      // 获取到第二层对应的数据
      const secondArr = []
      const secondIds = []
      const res = await houseListApi(params);
      (res.data || []).forEach(item => {
        if (!secondIds.includes(item.supplierId)) {
          secondIds.push(item.supplierId)
          secondArr.push(
            {
              businessCode: item.businessCode,
              label: item.supplierName,
              value: item.supplierId,
              leaf: false
            }
          )
        }
      })
      // 获取到第三层对应的数据
      const reqObj = {
        businessCode: codeArr[0],
        supplierId: codeArr[1]
      }
      const thirdArr = []
      const ret = await houseListApi(reqObj);
      (ret.data || []).forEach(item => {
        thirdArr.push(
          {
            value: item.warehouseCode,
            label: item.warehouseName,
            leaf: true
          }
        )
      })
      // 把第三层的数据放入对应第二层的数据下
      secondArr.forEach(item => {
        if (item.value === codeArr[1]) {
          item.children = thirdArr
          item.noLoad = true
        }
      })
      // 把第二层的数据放入对应第一层的数据下
      businessItems.forEach(item => {
        if (item.value === codeArr[0]) {
          item.children = secondArr
          item.noLoad = true
        }
      })
      return businessItems
    },
    // 获取业务线
    getBusiness(action, codeArr) {
      businessList().then(res => {
        const data = res.data || []
        this.businessItems = []
        data.map(item => {
          this.businessItems.push({
            label: item.businessName,
            value: item.businessCode
          })
          this.businessMap[item.businessCode] = item.businessName
        })
        this.$nextTick(async() => {
          if (action === 'edit') { // 回显发货仓库
            const list = await this.getWarehouseList(this.businessItems, codeArr)
            this.$refs.formRoute && this.$refs.formRoute.set({
              type: 'options',
              data: { warehouseNo: list }
            })
            this.$refs.formRoute && this.$refs.formRoute.set({
              type: 'defaultVal',
              data: {
                warehouseNo: codeArr
              }
            })
          } else {
            this.$refs.formRuleGroup && this.$refs.formRuleGroup.set({
              type: 'options',
              data: { businessCode: this.businessItems }
            })
            this.$refs.formRoute && this.$refs.formRoute.set({
              type: 'options',
              data: { warehouseNo: this.businessItems }
            })
            this.$refs.searchs && this.$refs.searchs.set({
              type: 'options',
              data: { warehouseNo: this.businessItems }
            })
            this.$refs.searchs && this.$refs.searchs.set({
              type: 'options',
              data: { businessCode: this.businessItems }
            })
          }
        })
      })
    },
    // 获取省市区
    getCity() {
      queryAll().then(res => {
        const data = res.data || []
        this.cityOptions = []
        const loop = list => {
          const arr = []
          list.map(item => {
            const obj = {
              label: item.provinceName,
              value: item.provinceName
            }
            this.cityOptions.push({
              label: item.provinceName,
              value: item.provinceName
            })
            // if (item.citys && item.citys.length) { //市级数据
            //   obj.children = loop(item.citys)
            // }
            arr.push(obj)
          })
          // if (this.cityOptions.length > 0) { 待改动
          //   this.provinceNames = [this.cityOptions[0].value]
          // }
          return arr
        }
        const city = loop(data)
        this.$refs.searchs && this.$refs.searchs.set({
          type: 'options',
          data: { areas: [{ label: '全国-不含港澳台', value: '全国' }, ...city] }
        })
      })
    },
    // 提交路由表单
    submitRouteForm(val) {
      const params = {
        appointSupplier: val.appointSupplier,
        businessCode: val.warehouseNo[0],
        deliveryArea: this.deliveryArea,
        groupId: this.currRuleGroup.id || this.currRuleItem.groupId,
        isContainsHmt: this.isContainsHmt,
        provinceNames: this.provinceNames,
        routName: val.routName,
        supplierId: val.warehouseNo[1],
        wareHouse: val.warehouseNo[2]
      }
      if (this.routeDialogMode === 'addRoute') {
        addRule(params).then(res => {
          this.getGroupList()
          this.closeDl()
          this.$message.success('新增成功')
        })
      } else {
        params.routId = this.currRuleItem.routId
        updateRule(params).then(res => {
          this.getList()
          this.closeDl()
          this.$message.success('编辑成功')
        })
      }

      console.log('提交路由表单', val)
    },
    // 提交规则表单
    submitRuleForm(val) {
      if (this.ruleGroupDialogMode === 'addRuleGroup') {
        groupAdd({
          ...val
        }).then(res => {
          this.getGroupList()
          this.closeDl()
          this.$message.success('新增成功')
        })
      } else {
        groupUpdate({
          ...val
        }).then(res => {
          this.getGroupList()
          this.closeDl()
          this.$message.success('编辑成功')
        })
      }
      console.log('提交规则表单', val)
    },
    // 关闭弹窗
    closeDl() {
      if (this.dialogRouteVisable) {
        this.dialogRouteVisable = false
        this.deliveryArea = 1
        this.provinceNames = []
      } else {
        this.dialogRuleVisable = false
      }
    },
    // 规则组启用停用
    setGroupSwitchs(row) {
      groupOnoff({ id: row.id, status: row.status ^ 1 }).then(res => {
        this.getGroupList()
        this.$message.success(`组名${row.routGroupName}${row.status ? '停用' : '启用'}成功`)
      })
    },
    // 规则组上下移
    setGroupUpDown(row, flag) {
      groupRemove({ ...row, flag }).then(res => {
        this.getGroupList()
        this.$message.success(`组名${row.routGroupName}${flag ? '上移' : '下移'}成功`)
      })
    },
    // 路由规则启用停用
    setRuleSwitchs(row) {
      switchRule({ routId: row.routId, status: row.status ^ 1 }).then(res => {
        this.getList()
        this.$message.success(`路由规则${row.routName}${Number(row.status) ? '停用' : '启用'}成功`)
      })
    },
    // 路由规则上下移
    setRuleUpDown(row, type) {
      levelUpdate({ routId: row.routId, type }).then(res => {
        this.getList()
        this.$message.success(`路由规则${row.routName}${type ? '上移' : '下移'}成功`)
      })
    },
    // 表格操作
    tableAction(dat, row, index, name) {
      if (name === 'addRoute') { // 添加路由
        if (row.status) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.getBusiness()
        this.getCity()
        this.dialogRouteVisable = true
        this.routeDialogMode = 'addRoute'
        this.currRuleGroup = row
      } else if (name === 'editRoute') { // 编辑路由
        if (Number(row.status)) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.getBusiness('edit', [row.businessCode, row.supplierId, row.wareHouseCode])
        this.getCity()
        this.dialogRouteVisable = true
        this.routeDialogMode = 'editRoute'
        this.currRuleItem = row
        if (row.areas === '全国') {
          this.deliveryArea = 1
        } else {
          this.deliveryArea = 0
          this.provinceNames = row.areas.split(',')
        }
        this.$nextTick(() => {
          this.$refs.formRoute.recoveryForm({
            ...row
            // warehouseNo: [row.businessCode, row.supplierId, row.wareHouseCode]
          }, false)
        })
      } else if (name === 'setRuleStart') { // 设置路由规则启动
        this.setRuleSwitchs(row)
      } else if (name === 'setRuleEnd') { // 设置路由规则停用
        this.setRuleSwitchs(row)
      } else if (name === 'delRoute') { // 删除路由
        if (Number(row.status)) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.$confirm('删除后将无法恢复，请确认是否删除',
          '你确定要删除该配置吗？',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          delRout({
            routId: row.routId,
            status: row.status
          }).then(_ => {
            this.getList()
            this.$message({
              type: 'success',
              message: `路由配置${row.routName}已删除。`
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (name === 'editRuleGroup') { // 编辑规则组
        if (row.status) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.ruleGroupDialogMode = 'editRuleGroup'
        this.dialogRuleVisable = true
        this.getBusiness()
        this.$nextTick(() => {
          this.$refs.formRuleGroup.recoveryForm(row, false)
        })
      } else if (name === 'setStop') { // 设置规则组停用
        this.setGroupSwitchs(row)
      } else if (name === 'setStart') { // 设置规则组启用
        this.setGroupSwitchs(row)
      } else if (name === 'setRuleGroupUp') { // 设置规则组上移
        if (row.status) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.setGroupUpDown(row, 1)
        // this.$message.warning('已是规则组内最高优先级')
      } else if (name === 'setRuleGroupDown') { // 设置规则组下移
        if (row.status) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.setGroupUpDown(row, 0)
      }
    },
    // 上移操作
    setUp(dat, row) {
      if (Number(row.status)) {
        return this.$message.warning('启用状态下不可操作')
      }
      // this.$message.warning('已是规则组内最高优先级')
      this.setRuleUpDown(row, 1)
    },
    // 下移操作
    setDown(dat, row) {
      if (Number(row.status)) {
        return this.$message.warning('启用状态下不可操作')
      }
      this.setRuleUpDown(row, 0)
    },
    // 新增规则组
    createRuleGroup() {
      console.log('新增规则组')
      this.ruleGroupDialogMode = 'addRuleGroup'
      this.dialogRuleVisable = true
      this.getBusiness()
    },
    changeSearch(data, oldData) {
      // this.query = data
    },
    // 查询事件回调
    submitSearch(params) {
      this.query = params
      this.listQuery = {
        page: 1,
        limit: 10
      }
      console.log(123, this.query)
      this.getList()
    },
    // 获取路由规则列表
    async getList() {
      const { page, limit: pageSize } = this.listQuery

      const params = { ...this.query }
      Object.keys(params).forEach(key => {
        if (key === 'areas') {
          params['provinceName'] = params['areas'] || undefined
          delete params['areas']
        }
        if (params[key] === '') {
          params[key] = undefined
        }
      })
      params.pageAble = true
      params.page = page
      params.pageSize = pageSize
      if (Array.isArray(params.warehouseNo)) {
        params.businessCode = params.warehouseNo[0] || params.businessCode
        params.supplierId = params.warehouseNo[1]
        params.wareHouseCode = params.warehouseNo[2]
        delete params.warehouseNo
      }
      // if (params.areas === 'nationwide') {
      //   params.isContainsHmt = 1
      //   delete params.areas
      // }

      const ret = await findBy(params)
      if (ret.status === 0) {
        const data = ret.data || {}
        const list = data.rows || []
        this.list = list.map(item => {
          return {
            ...item,
            businessLabel: this.businessMap[item.businessCode]
          }
        })
        this.total = data.records || 0
      }
    },
    // 切换tab
    handleTabClick(tab, event) {
      const { name } = tab
      if (name === 'ruleGroup') {
        this.columns = columnsRuleGroup
        this.getGroupList()
        this.actions = actionsRuleGroup({ tableAction: this.tableAction })
      } else if (name === 'routeRule') {
        this.columns = columnsRouteRule
        this.getList()
        this.actions = actionsRouteRule({ setUp: this.setUp, setDown: this.setDown, tableAction: this.tableAction })
      }
      console.log(name, this.activeTab)
    }
  }
}
</script>
<style lang="scss" scoped>
.columns-note {
  color: #aaa;
}
.btns {
  text-align: right;
  margin-bottom: 10px;
}
.form-item {
  margin-bottom: 22px;
  .span-item {
    margin-left: 35px;
    font-weight: bold;
    margin-right: 11px;
  }
  .select-item {
    width: 180px;
  }
}
.desp {
  background-color: #f4f4f5;
  padding: 14px;
  border: 1px solid #DCDFE6;
  margin-bottom: 16px;
  .main-font {
    font-weight: bold;
    display: block;
    margin-bottom: 6px;
    font-size: 16px;
  }
}
</style>
