<template>
  <div>
    <div class="title-container">
      <basics-title title="商品管理" line />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._logistics_product_list" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :attr="attr"
        :loading="loadings._logistics_product_list"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
      />
      <!-- 新增、修改商品 -->
      <create :business-code="businessCode" :row="row" :is-edit="isEdit" :state="goodsState" @closeDl="closeDl" />
      <warehouse :business-code="businessCode" :state="houseState" :row="row" :type="houseType" @closeDl="closeHouseDl" />
    </div>
  </div>

</template>

<script>
import { businessList, productDelete, productList } from '@/api/goods/manage'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import Create from './components/Create'
import Warehouse from './components/Warehouse'
import searchs from './searchs/list'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsManage',
  components: { BasicsTitle, BasicsSearch, BasicsAction, BasicsTable, Create, Warehouse },
  data() {
    return {
      searchs: searchs,
      act: act({ openDl: this.openDl }),
      attr: { stripe: true },
      columns: columns,
      actions: actions({ set: this.set, editNum: this.editNum, edit: this.edit, del: this.del }),
      total: 0,
      loading: false,
      list: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      goodsState: false,
      query: {},
      isEdit: false,
      businessCode: [],
      row: {},
      houseType: 0, // 0仓库、1库存
      houseState: false
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
    this.getBusiness()
  },
  methods: {
    // 获取业务线
    getBusiness() {
      businessList().then(res => {
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode
          })
        })
        this.businessCode = businessCode
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
        })
      })
    },
    changeSearch(query) {
      this.query = query
    },
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 跳转到创建物流、批量发货页
    jump(name) {
      this.$router.push({ name: name })
    },
    getList() {
      const { query, listQuery } = this
      const type = query.type || []
      const productChildType = []
      type.map(item => {
        productChildType.push(item[item.length - 1])
      })
      const data = {
        page: listQuery.page,
        pageSize: listQuery.limit,
        businessCode: query.businessCode,
        productName: query.productName,
        // productType: productType,
        productChildType: productChildType // 二级分类code
      }
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      productList(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      })
    },
    set(row) {
      this.row = row
      this.openHouseDl(0)
    },
    editNum(row) {
      this.row = row
      this.openHouseDl(1)
    },
    edit(row) {
      this.row = row
      this.isEdit = true
      this.openDl()
    },
    del(row) {
      this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该商品吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            productDelete({ id: row.id }).then(() => {
              this.$message.success('删除商品成功')
              this.getList()
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    openDl() {
      this.goodsState = true
    },
    closeDl(sta = 0) {
      this.goodsState = false
      this.isEdit = false
      this.row = {}
      if (sta) {
        this.getList()
      }
    },
    openHouseDl(type) {
      this.houseState = true
      this.houseType = type
    },
    closeHouseDl() {
      this.houseState = false
      this.houseType = 0
      this.row = {}
    }
  }
}
</script>
