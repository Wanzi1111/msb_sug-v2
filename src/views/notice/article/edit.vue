<template>
  <div class="app-container">
    <basics-block title="修改公告文章">
      <basics-form ref="form" :loading="loadings._operation_announcement_updateShowAndHide" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />
      <article-preview :preview="preview" :visible="drawer" :close-dr="closeDr" />
    </basics-block>
  </div>
</template>

<script>
import { articleList, updateShowAndHide } from '@/api/notice/article'
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import ArticlePreview from './components/ArticlePreview/index'
import forms, { actions } from './forms/edit'
import { mapGetters } from 'vuex'

export default {
  name: 'EditArticle',
  components: { BasicsForm, BasicsBlock, ArticlePreview },
  data() {
    return {
      id: this.$route.params.id,
      forms: forms,
      actions: actions({ preview: this.previewArticle, back: this.back }),
      preview: {},
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取详情
    getDetail() {
      articleList({
        id: this.id,
        pageNum: 1,
        pageSize: 1
      }).then(res => {
        const data = res.data || {}
        const list = data.list || []
        const detail = list[0] || {}
        this.$refs.form.set({
          type: 'defaultVal',
          data: {
            ...detail,
            content: detail.showType === 1 ? detail.content : '',
            showType: `${detail.showType}`,
            addr: detail.showType === 0 ? detail.content : ''
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    // 切换显示类型
    changeForm(val, oldVal) {
      if (val.showType !== oldVal.showType) {
        if (val.showType === '1') {
          this.$refs.form.set({
            type: 'visible',
            data: { content: true, addr: false }
          })
          this.$refs.form.setAction({
            type: 'visible',
            data: { preview: true }
          })
        } else {
          this.$refs.form.set({
            type: 'visible',
            data: { content: false, addr: true }
          })
          this.$refs.form.setAction({
            type: 'visible',
            data: { preview: false }
          })
        }
      }
    },
    // 预览
    previewArticle(val) {
      this.drawer = true
      this.preview = {
        announcementName: val.announcementName,
        id: 'edit',
        showType: val.showType,
        content: val.content
      }
    },
    // 修改
    submitForm(val) {
      const data = {
        id: this.id,
        ...val,
        showType: parseInt(val.showType)
      }
      if (val.showType === '0') {
        data.content = val.addr
        delete data.addr
      }
      updateShowAndHide(data).then(() => {
        this.$message.success('修改公告文章成功')
        this.$router.push({ name: 'Article' })
      })
    },
    // 预览 - 关闭
    closeDr() {
      this.drawer = false
      this.preview = {}
    },
    // 返回
    back() {
      this.$router.push({ name: 'Article' })
    }
  }
}
</script>
