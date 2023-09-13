<template>
  <el-dialog
    :title="title"
    :visible.sync="state"
    width="500px"
    :before-close="() => closeDl()"
  >
    <basics-form
      v-if="type === 'view'"
      :key="state"
      ref="viewDraw"
      :forms="viewForms"
      :actions="viewActions"
    />
    <basics-form
      v-else
      :key="state"
      ref="examineDraw"
      :loading="drawLoading"
      :forms="forms"
      :actions="actions"
      @submitForm="submitForm"
      @changeForm="changeForm"
    />
  </el-dialog>
</template>

<script>
import {
  showQueryAuthor,
  showUpdate,
  showExamine,
  worksShowStatusCause
} from '@/api/operate/draw-show'
import BasicsForm from '@/components/BasicsForm'
import forms, { actions } from './forms/index'
import vForms, { actions as vActions } from './forms/view'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'Examine',
  components: { BasicsForm },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      viewForms: vForms,
      viewActions: vActions({ closeDl: this.closeDl }),
      forms: [],
      actions: actions({ closeDl: this.closeDl })
    }
  },
  computed: {
    title() {
      const { type } = this
      let txt = ''
      switch (type) {
        case 'view':
          txt = '查看视频'
          break
        case 'edit':
          txt = '编辑视频'
          break
        default: // examine
          txt = '审核视频'
          break
      }
      return txt
    },
    ...mapGetters(['loadings']),
    drawLoading() {
      return this.loadings._msb_api_workShow_examine || this.loadings._msb_api_workShow_update
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { type, row } = this
      if (type !== 'view') {
        this.forms = forms({ remoteMethod: this.remoteMethod, isEdit: type === 'edit' })
        const res = await worksShowStatusCause()
        const data = res.data || {}
        const refuseCause = []
        for (const key in data) {
          refuseCause.push({
            label: data[key],
            value: parseInt(key)
          })
        }
        this.$nextTick(() => {
          this.$refs.examineDraw.set({
            type: 'options',
            data: {
              authorId: [
                {
                  label: `${row.authorId || ''} ${row.username || ''} ${row.mobile || ''}`,
                  value: row.authorId
                }
              ],
              refuseCause: refuseCause
            }
          })
          this.$nextTick(() => {
            this.$refs.examineDraw.set({
              type: 'defaultVal',
              data: {
                authorId: row.authorId,
                coverUrl: row.coverUrl,
                videoUrl: {
                  url: row.videoUrl,
                  poster: row.coverUrl,
                  duration: row.videoTime
                },
                status: (row.status === 0 || row.status === 2) ? row.status : '',
                refuseCause: row.refuseCause
              },
              validateField: false
            })
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.viewDraw && this.$refs.viewDraw.set({
            type: 'defaultVal',
            data: {
              authorId: `${row.authorId} / ${row.username} / ${row.mobile}`,
              videoUrl: {
                url: row.videoUrl,
                poster: row.coverUrl,
                duration: row.videoTime
              },
              status: row.status === 0 ? '已驳回' : '审核通过'
            }
          })
        })
      }
    },
    remoteMethod(e) {
      showQueryAuthor({ authorName: e }).then(res => {
        const authorId = []
        const data = res.data || []
        data.map(item => {
          authorId.push({
            label: `${item.authorId || ''} ${item.username || ''} ${item.mobile || ''}`,
            value: item.authorId
          })
        })
        this.$refs.examineDraw.set({
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
      if (val.status !== oldVal.status) {
        if (val.status === 0) {
          this.$refs.examineDraw.set({
            type: 'visible',
            data: {
              refuseCause: true
            }
          })
        } else {
          this.$refs.examineDraw.set({
            type: 'visible',
            data: {
              refuseCause: false
            }
          })
        }
      }
      // if (val.videoUrl.url) {
      //   if (val.videoUrl.poster !== oldVal.videoUrl.poster) {
      //     this.$refs.examineDraw.set({
      //       type: 'defaultVal',
      //       data: {
      //         coverUrl: val.videoUrl.poster
      //       }
      //     })
      //   }
      // }
      // if (val.coverUrl !== oldVal.coverUrl) {
      //   this.$refs.examineDraw.set({
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
      const { row, type } = this
      let data = {}
      if (type === 'edit') {
        data = {
          id: row.id,
          authorId: val.authorId,
          videoUrl: val.videoUrl.url,
          coverUrl: val.coverUrl,
          videoTime: val.videoUrl.duration ? parseInt(val.videoUrl.duration) : 0,
          status: val.status,
          refuseCause: val.refuseCause,
          mid: getToken('userId'),
          opUserId: getToken('userId'),
          opUserName: getToken('cname')
        }
        showUpdate(data).then(() => {
          this.$message.success('修改成功')
          this.closeDl(1)
        })
      } else {
        data = {
          id: row.id,
          status: val.status,
          mid: getToken('userId'),
          opUserId: getToken('userId'),
          opUserName: getToken('cname')
        }
        if (!val.status) {
          data.refuseCause = val.refuseCause
        }
        showExamine(data).then(() => {
          this.$message.success('审核提交成功')
          this.closeDl(1)
        })
      }
    }
  }
}
</script>
