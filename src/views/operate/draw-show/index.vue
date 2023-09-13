<template>
  <div>
    <div class="title-container">
      <basics-title title="小画家作品秀" line />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._msb_api_workShow_list" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <basics-action :actions="act" />
      <basics-table
        ref="table"
        :attr="attr"
        :loading="loadings._msb_api_workShow_list"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
      />
      <create :state="addState" @closeDl="closeDl" />
      <examine v-if="examineState" :row="row" :state="examineState" :type="actType" @closeDl="closeExDl" />
    </div>
  </div>
</template>

<script>
import { showList, showRecommend, showExamine } from '@/api/operate/draw-show'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import Create from './components/Create'
import Examine from './components/Examine'
import searchs from './searchs/list'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'OperateDrawShow',
  components: { BasicsTitle, BasicsSearch, BasicsAction, BasicsTable, Create, Examine },
  data() {
    return {
      searchs: searchs,
      act: act({ openDl: this.openDl }),
      attr: { stripe: true },
      columns: columns,
      actions: actions({ tableAction: this.tableAction }),
      total: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      query: {},
      row: {},
      addState: false,
      examineState: false,
      actType: ''
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
  },
  methods: {
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
    getList() {
      const { query, listQuery } = this
      const data = {
        pageNum: listQuery.page,
        pageSize: listQuery.limit,
        ...query
      }
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      showList(data).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    tableAction(dat, row, index, action) {
      this.row = row
      switch (action) {
        case 'recommend':
          this.recommend(row)
          break
        case 'onLine':
          this.onLine(row)
          break
        default: // examine / view / edit
          this.actType = action
          this.openExDl()
          break
      }
    },
    // 推荐、不推荐
    recommend(row) {
      // isRecommend 0:未推荐、1:推荐首页
      const sta = row.isRecommend
      this.$confirm(sta ? '取消推荐该视频后将不会在首页显示' : '推荐该视频后将会在首页显示', sta ? '你确定要取消推荐该视频吗？' : '你确定要推荐该视频吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = sta ? '取消中...' : '推荐中...'
            showRecommend({
              id: row.id,
              isRecommend: sta ? 0 : 1,
              mid: getToken('userId'),
              opUserId: getToken('userId'),
              opUserName: getToken('cname')
            }).then(() => {
              this.$message.success(sta ? '取消成功' : '推荐成功')
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
    // 上、下线
    onLine(row) {
      // status 0:已驳回、1:待审核、2:已上线、3:已下线
      const sta = row.status === 2
      this.$confirm(sta ? '下线视频后将不在作品秀中展示' : '上线视频后将会在作品秀中展示', sta ? '你确定要下线该视频吗？' : '你确定要上线该视频吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = sta ? '下线中...' : '上线中...'
            showExamine({
              id: row.id,
              status: sta ? 3 : 2,
              mid: getToken('userId'),
              opUserId: getToken('userId'),
              opUserName: getToken('cname')
            }).then(() => {
              this.$message.success(sta ? '下线成功' : '上线成功')
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
      this.addState = true
    },
    closeDl(sta = 0) {
      this.addState = false
      if (sta) {
        this.getList()
      }
    },
    openExDl() {
      this.examineState = true
    },
    closeExDl(sta) {
      this.examineState = false
      this.row = {}
      if (sta) {
        this.getList()
      }
    }
  }
}
</script>
