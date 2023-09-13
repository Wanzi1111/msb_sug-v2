<template>
  <div>
    <div class="title-container">
      <basics-title title="数据统计" line />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :searchs="searchs" :loading="loadings._logistics_order_staticicsOrderData" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <!-- <el-tabs v-model="activeTab" @tab-click="handleTabClick">
				<el-tab-pane v-for="(tab,index) in tabList" :key="index" :label="tab.label" :name="tab.name" />
			</el-tabs> -->
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._logistics_order_staticicsOrderData"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
      />
    </div>
  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsTable from '@/components/BasicsTable'
import searchs from './searchs/list'
import columns, { actions } from './columns/list'
import { businessList } from '@/api/goods/manage'
import { staticicsOrderData } from '@/api/express/manage'
import { queryAll } from '@/api/express/national'
import { productList } from '@/api/goods/manage'
import { queryAllExpressCompany } from '@/api/express/supplier'
import { mapGetters } from 'vuex'

export default {
  name: 'ExpressData',
  components: { BasicsTitle, BasicsSearch, BasicsTable },
  data() {
    return {
      searchs: searchs,
      table: { stripe: true },
      columns: columns,
      actions: actions({}),
      total: 0,
      list: [],
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      activeTab: 'day',
      tabList: [
        { label: '按日统计', name: 'day' },
        { label: '按周统计', name: 'week' },
        { label: '按月统计', name: 'month' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getBusiness()
    this.getExpressCompany()
    this.getCity()
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    // 获取收货区域
    getCity() {
      queryAll().then(res => {
        const data = res.data || []
        const loop = list => {
          const arr = []
          list.map(item => {
            const obj = {
              label: item.countyName || item.cityName || item.provinceName,
              value: item.countyCode || item.cityCode || item.provinceCode
            }
            if (item.citys && item.citys.length) {
              obj.children = loop(item.citys)
            }
            // if (item.countys && item.countys.length) {
            //   obj.children = loop(item.countys)
            // }
            arr.push(obj)
          })
          return arr
        }
        const city = loop(data)
        this.$refs.searchs && this.$refs.searchs.set({
          type: 'options',
          data: { consigneeProvince: city }
        })
      })
    },
    // 获取承运商
    getExpressCompany() {
      queryAllExpressCompany().then(res => {
        const expressCode = []
        const data = res.data || []
        data.map(item => {
          expressCode.push({
            label: item.expressName,
            value: item.expressCode,
            id: item.id
          })
        })
        this.expressCode = expressCode
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { supplierId: expressCode }
          })
        })
      })
    },
    // 获取业务线
    getBusiness() {
      businessList().then(res => {
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode,
            leaf: false
          })
        })
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { warehouseNo: businessCode }
          })
        })
      })
    },
    changeSearch(data, oldData) {
      this.query = data
    },
    getArea(dat, optionsKey, optionsValue, optionsLabel) {
      productList(dat).then(res => {
        const data = res.data || []
        const ids = []
        const options = []
        data.map(item => {
          if (!ids.includes(item[optionsValue])) {
            ids.push(item[optionsValue])
            options.push({
              label: item[optionsLabel],
              value: item[optionsValue]
            })
          }
        })
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { [optionsKey]: options }
          })
        })
      })
    },
    // 查询事件回调
    submitSearch(params) {
      this.query = params
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.getList()
    },
    // 获取数据列表
    async getList() {
      const { page, limit: pageSize } = this.listQuery
      const productType = this.query.productType || []
      const productChildType = []
      productType.map(item => {
        productChildType.push(item[item.length - 1])
      })
      const params = {
        'businessCode': this.query.businessCode || null, // 业务线
        'consigneeCity': this.query.consigneeProvince && this.query.consigneeProvince[1] || null, // 收货区域
        'createTimeStart': Array.isArray(this.query.period) ? this.query.period[0] : null, // 开始时间
        'createTimeEnd': Array.isArray(this.query.period) ? this.query.period[1] : null, // 结束时间
        'expressCode': this.query.supplierId || null, // 快递公司
        'page': page,
        'pageSize': pageSize,
        'productCode': this.query.productCode || null, // 商品
        'productChildType': productChildType, // 商品类型
        'supplierDelivery': this.query.supplierDelivery || null, // 发货方式
        'warehouseNo': Array.isArray(this.query.warehouseNo) ? this.query.warehouseNo[2] : null // 发货仓库
      }
      const ret = await staticicsOrderData(params)
      if (ret.status === 0) {
        const data = ret.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      }
    },
    // 切换tab
    handleTabClick(tab, event) {
      const { name } = tab
      console.log(name, this.activeTab)
    }
  }
}
</script>
<style lang="scss" scoped>
.columns-note {
  color: #aaa;
}
</style>
