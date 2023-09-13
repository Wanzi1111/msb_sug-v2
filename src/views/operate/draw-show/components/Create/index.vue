<template>
  <el-dialog
    title="上传视频"
    :visible.sync="state"
    width="500px"
    :before-close="() => closeDl()"
  >
    <basics-form
      :key="state"
      ref="addShow"
      :loading="loadings._msb_api_workShow_add"
      :forms="forms"
      :actions="actions"
      @submitForm="submitForm"
      @changeForm="changeForm"
    />
  </el-dialog>
</template>

<script>
import { showAdd, showQueryAuthor } from '@/api/operate/draw-show'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'Create',
  components: { BasicsForm },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forms: forms({ remoteMethod: this.remoteMethod }),
      actions: actions({ closeDl: this.closeDl })
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  methods: {
    remoteMethod(e) {
      showQueryAuthor({ authorName: e }).then(res => {
        const authorId = []
        const data = res.data || []
        data.map((item, i) => {
          authorId.push({
            label: `${item.authorId || ''} ${item.username || ''} ${item.mobile || ''}`,
            value: item.authorId
          })
        })
        this.$refs.addShow.set({
          type: 'options',
          data: {
            authorId: authorId
          }
        })
      })
    },
    closeDl(sta = 0) {
      this.$emit('closeDl', sta)
    },
    changeForm(val, oldVal) {
      // if (val.videoUrl.url) {
      //   if (val.videoUrl.poster !== oldVal.videoUrl.poster) {
      //     this.$refs.addShow.set({
      //       type: 'defaultVal',
      //       data: {
      //         coverUrl: val.videoUrl.poster
      //       }
      //     })
      //   }
      // }
      // if (val.coverUrl !== oldVal.coverUrl) {
      //   this.$refs.addShow.set({
      //     type: 'defaultVal',
      //     data: {
      //       videoUrl: {
      //         ...val.videoUrl,
      //         poster: val.coverUrl
      //       }
      //     }
      //   })
      // }
    },
    submitForm(val) {
      const data = {
        cid: getToken('userId'),
        videoUrl: val.videoUrl.url,
        coverUrl: val.coverUrl,
        videoTime: val.videoUrl.duration ? parseInt(val.videoUrl.duration) : 0,
        authorId: val.authorId,
        mid: getToken('userId'),
        opUserId: getToken('userId'),
        opUserName: getToken('cname')
      }
      showAdd(data).then(() => {
        this.$message.success('新增视频成功')
        this.closeDl(1)
      })
    }
  }
}
</script>
