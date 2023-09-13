<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="loadings._operation_resource_listResource" :searchs="searchs" @submitSearch="submitSearch" />
    <div class="materiel-action">
      <el-popover
        v-model="popoverVisible"
        placement="bottom"
        trigger="manual"
      >
        <create-materiel v-if="popoverVisible" :cancel="triggerMateriel" :get-size="getSize" />
        <el-button slot="reference" type="primary" class="create-rules" @click="triggerMateriel">新建物料尺寸</el-button>
      </el-popover>
      <basics-action :actions="act" />
    </div>
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_resource_listResource"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <!--快速投放-->
    <el-drawer
      title="快速投放"
      :visible.sync="drawer"
      direction="rtl"
      size="640px"
      :before-close="closeDr"
      destroy-on-close
    >
      <fast-put :key="fastDat.id" :dat="fastDat" @close="closeDr" />
    </el-drawer>
    <!--预览-->
    <el-dialog
      title="物料预览"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeDl"
    >
      <preview-materiel :preview="preview" />
    </el-dialog>
  </div>
</template>

<script>
import { materielList, materielSize } from '@/api/advert/materiel'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import PreviewMateriel from './components/PreviewMateriel/index'
import FastPut from './components/FastPut/index'
import CreateMateriel from './components/CreateMateriel'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import searchs from './searchs/searchs'
import { mapGetters } from 'vuex'

export default {
  name: 'Materiel',
  components: { BasicsTable, BasicsSearch, BasicsAction, PreviewMateriel, FastPut, CreateMateriel },
  computed: {
    ...mapGetters(['loadings'])
  },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: actions({ updateMateruel: this.updateMateruel, previewMateruel: this.previewMateruel, fastPut: this.fastPut }),
      searchs: searchs,
      act: act({ uploadMateriel: this.uploadMateriel, createMateriel: this.createMateriel }),
      list: null,
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      drawer: false,
      fastDat: {},
      dialogVisible: false,
      preview: {},
      popoverVisible: false
    }
  },
  created() {
    this.getSize()
    this.getList()
  },
  methods: {
    // 获取物料尺寸下拉框选项
    getSize() {
      materielSize().then(res => {
        const resourceSize = []
        const data = res.data || []
        data.map(item => {
          resourceSize.push({
            label: `${item.osType}(${item.resourceSize})`,
            value: item.resourceSize
          })
        })
        this.$nextTick(() => {
          this.$refs.searchs.set({
            type: 'options',
            data: { resourceSize: resourceSize }
          })
        })
      })
    },
    // 获取物料列表
    getList() {
      const { query, listQuery } = this
      const time = query.time || []
      const data = {
        startTime: time[0],
        endTime: time[1],
        ...query,
        type: parseInt(query.type)
      }
      delete data.time
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      materielList(data, {
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 跳转到更换物料页面
    updateMateruel(dat, row, index) {
      this.$router.push({ name: 'EditMateriel', params: { id: row.id }})
    },
    // 预览物料
    previewMateruel(dat, row, index) {
      this.dialogVisible = true
      this.preview = row
    },
    // 预览物料 - 关闭
    closeDl() {
      this.dialogVisible = false
      this.preview = {}
    },
    // 快速投放
    fastPut(dat, row, index) {
      this.drawer = true
      this.fastDat = row
    },
    // 点击搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.query = val
      this.getList()
    },
    // 上传物料，跳转到上传物料页
    uploadMateriel() {
      this.$router.push({ name: 'CreateMateriel' })
    },
    // 新建物料尺寸
    triggerMateriel() {
      this.popoverVisible = !this.popoverVisible
    },
    // 快速投放 - 关闭
    closeDr() {
      this.drawer = false
      this.fastDat = {}
    }
  }
}
</script>

<style lang="scss" scoped>
  .materiel-action {
    display: flex;
    .create-rules{
      margin-right: 10px;
    }
  }
</style>
