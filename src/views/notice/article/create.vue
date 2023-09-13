<template>
  <div class="app-container">
    <basics-block title="添加公告文章">
      <basics-form ref="form" :loading="loadings._operation_announcement_addAnnouncement" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />
      <article-preview :preview="preview" :visible="drawer" :close-dr="closeDr" />
    </basics-block>
  </div>
</template>

<script>
import { createArticle } from '@/api/notice/article'
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import ArticlePreview from './components/ArticlePreview/index'
import forms, { actions } from './forms/create'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateArticle',
  components: { BasicsForm, BasicsBlock, ArticlePreview },
  data() {
    return {
      forms: forms,
      actions: actions({ preview: this.previewArticle, back: this.back }),
      preview: {},
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  methods: {
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
        id: 'create',
        showType: val.showType,
        content: val.content
      }
    },
    // 保存
    submitForm(val) {
      const data = {
        ...val,
        showType: parseInt(val.showType)
      }
      if (val.showType === '0') {
        data.content = val.addr
        delete data.addr
      }
      createArticle(data).then(() => {
        this.$message.success('添加公告文章成功')
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
