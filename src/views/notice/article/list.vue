<template>
  <div class="app-container">
    <basics-search :loading="loadings._operation_announcement_listAnnouncement" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="act" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_announcement_listAnnouncement"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <article-preview :preview="preview" :visible="drawer" :close-dr="closeDr" />
  </div>
</template>

<script>
import { articleList, updateShowAndHide } from '@/api/notice/article'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import ArticlePreview from './components/ArticlePreview/index'
import { default as act } from './actions/list'
import columns, { actions } from './columns/list'
import searchs from './searchs/list'
import { mapGetters } from 'vuex'

export default {
  name: 'Article',
  components: { BasicsTable, BasicsSearch, BasicsAction, ArticlePreview },
  data() {
    return {
      table: { stripe: true },
      columns: columns({ getList: this.getList }),
      actionFunction: actions({ updateNotice: this.updateNotice, previewNotice: this.previewNotice, changeNotice: this.changeNotice }),
      searchs: searchs,
      list: null,
      act: act({ add: this.create }),
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      drawer: false,
      preview: {},
      sequence: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getList()
  },
  methods: {
    // 点击搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 跳转到 - 添加文章
    create() {
      this.$router.push({ name: 'CreateArticle' })
    },
    // 获取列表
    getList() {
      const { query, listQuery } = this
      const time = query.time || []
      let startTime = ''; let endTime = ''
      if (time.length) {
        startTime = time[0]
        endTime = time[1]
      }
      const data = {
        ...query,
        startTime: startTime,
        endTime: endTime
      }
      delete data.time
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      articleList({
        ...data,
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list ? data.list.map(
          v => {
            v.originSequence = v.sequence
            return v
          }
        ) : []
        this.total = res.data.total
      })
    },
    // 跳转到 - 修改公共
    updateNotice(dat, row) {
      this.$router.push({ name: 'EditArticle', params: { id: row.id }})
    },
    // 预览公告
    previewNotice(dat, row) {
      this.preview = row
      this.drawer = true
    },
    // 预览 - 关闭
    closeDr() {
      this.drawer = false
      this.preview = {}
    },
    // 显示隐藏切换
    changeNotice(dat, row, index) {
      let txt = '请确认，是否隐藏该文章?'
      let message = '隐藏文章成功'
      if (row.abandon) {
        txt = '请确认，是否显示该文章?'
        message = '显示文章成功'
      }
      this.$confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateShowAndHide({
          id: row.id,
          abandon: ~~!row.abandon
        }).then(() => {
          this.$message.success(message)
          this.list[index].abandon = !this.list[index].abandon
          this.list = [...this.list]
        })
      })
    }
  }
}
</script>
