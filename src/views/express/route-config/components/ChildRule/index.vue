<template>
  <div>
    <p>物流业务线： {{ businessMap[row.businessCode] }}</p>
    <p>规则组名称： {{ row.routGroupName }}</p>
    <p>生效时间： {{ row.lastOpenTime }}</p>
    <basics-table
      ref="table"
      :table="table"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :action-function="actions"
    />
    <!-- :loadings="loadings" -->
    <!-- 编辑路由 -->
    <el-dialog
      :title="'编辑路由'"
      :visible.sync="dialogVisable"
      width="600px"
      destroy-on-close
      :before-close="closeDl"
    >
      <basics-form ref="formRoute" :attr="{labelWidth: '106px', customClass: 'route-form'}" :forms="forms" :actions="formRouteAct" @submitForm="submitRouteForm">
        <template slot="desp">
          <div class="desp">
            <span class="main-font">{{ `${currRuleItem.title}  ${currRuleItem.routName}` }}</span>
            <span>
              {{ `${currRuleItem.groupTitle} ${currRuleItem.businessLabel} : ${currRuleItem.routGroupName}` }}
            </span>
          </div>
        </template>
        <template slot="city">
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
        </template>
      </basics-form>
    </el-dialog>
  </div>

</template>

<script>
import { findBy, levelUpdate, delRout, switchRule, updateRule } from '@/api/express/route-config'
import { queryAll } from '@/api/express/national'
import { businessList, houseListApi } from '@/api/goods/manage'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions } from './columns/list'
import forms, { actions as formRouteAct } from './forms/class'
import { mapGetters } from 'vuex'

export default {
  name: 'ChrCate',
  components: { BasicsTable, BasicsForm },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      provinceNames: [],
      cityOptions: [],
      isContainsHmt: 0,
      deliveryArea: 1,
      currRuleItem: {},
      table: { stripe: true },
      columns: columns,
      actions: actions({ setUp: this.setUp, setDown: this.setDown, tableAction: this.tableAction }),
      total: 0,
      list: [],
      forms: forms,
      formRouteAct: formRouteAct({ closeDl: this.closeDl }),
      dialogVisable: false,
      businessMap: {
        11: '美术宝1v1',
        12: '美术宝小班课',
        13: '小熊美术'
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    // this.getBusiness()
    this.getList()
  },
  methods: {
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
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode,
            leaf: false
          })
          this.businessMap[item.businessCode] = item.businessName
        })
        this.$nextTick(async() => {
          if (action === 'edit') { // 回显发货仓库
            const list = await this.getWarehouseList(businessCode, codeArr)
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
          list.map(item => {
            this.cityOptions.push({
              label: item.provinceName,
              value: item.provinceName
            })
          })
          // if (this.cityOptions.length > 0) {
          //   this.provinceNames = [this.cityOptions[0].value]
          // }
        }
        loop(data)
      })
    },
    // 关闭弹窗
    closeDl() {
      this.dialogVisable = false
    },
    // 提交规则表单
    submitRouteForm(val) {
      const params = {
        appointSupplier: val.appointSupplier,
        businessCode: val.warehouseNo[0],
        deliveryArea: this.deliveryArea,
        groupId: this.currRuleItem.groupId,
        isContainsHmt: this.isContainsHmt,
        provinceNames: this.provinceNames,
        routName: val.routName,
        supplierId: val.warehouseNo[1],
        wareHouse: val.warehouseNo[2],
        routId: this.currRuleItem.routId
      }
      updateRule(params).then(res => {
        this.getList()
        this.closeDl()
        this.$message.success('编辑成功')
      })
    },
    // 路由规则上下移
    setRuleUpDown(row, type) {
      levelUpdate({ routId: row.routId, type }).then(res => {
        this.getList()
        this.$message.success(`路由规则${row.routName}${type ? '上移' : '下移'}成功`)
      })
    },
    // 路由规则启用停用
    setRuleSwitchs(row) {
      switchRule({ routId: row.routId, status: row.status ^ 1 }).then(res => {
        this.getList()
        this.$message.success(`路由规则${row.routName}${Number(row.status) ? '停用' : '启用'}成功`)
      })
    },
    // 上移操作
    setUp(dat, row) {
      if (Number(row.status)) {
        return this.$message.warning('启用状态下不可操作')
      }
      this.setRuleUpDown(row, 1)
    },
    // 下移操作
    setDown(dat, row) {
      if (Number(row.status)) {
        return this.$message.warning('启用状态下不可操作')
      }
      this.setRuleUpDown(row, 0)
    },
    // 表格操作
    tableAction(dat, row, index, name) {
      if (name === 'editRoute') { // 编辑路由
        if (Number(row.status)) {
          return this.$message.warning('启用状态下不可操作')
        }
        this.getBusiness('edit', [row.businessCode, row.supplierId, row.wareHouseCode])
        this.getCity()
        this.dialogVisable = true
        this.currRuleItem = row
        if (row.areas === '全国') {
          this.deliveryArea = 1
        } else {
          this.deliveryArea = 0
          this.provinceNames = row.areas.split(',')
        }
        this.$nextTick(() => {
          this.$refs.formRoute.recoveryForm(row, false)
        })
      } else if (name === 'setRuleStart') {
        this.setRuleSwitchs(row)
      } else if (name === 'setRuleEnd') {
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
      }
    },
    getList() {
      const { row } = this
      const params = {
        groupId: row.id, // 父级传参
        pageAble: false
      }
      findBy(params).then(res => {
        const data = res.data || {}
        const list = data.rows || []
        this.list = list.map(item => {
          return {
            ...item,
            businessLabel: this.businessMap[item.businessCode]
          }
        })
        this.total = 0 // 不分页
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
