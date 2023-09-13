<template>
  <el-upload
    :class="uploadLimitMax ? 'upload-hide' : ''"
    :on-remove="uploadRemove"
    :before-upload="uploadBefore"
    :http-request="picUpload"
    class="form-item-element"
    :file-list="value"
    v-bind="item.attr"
  >
    <i v-if="!uploadLimitMax" class="el-icon-plus" />
  </el-upload>
</template>

<script>

import { tranferDataURLtoFile } from '@/utils'

const mime = require('mime')

export default {
  name: 'CustomUpload',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    // 达到允许上传最大数时，隐藏上传图标
    limit() {
      const { item } = this
      if (item && item.attr && item.attr.limit && item.attr.limit > 0) {
        return item.attr.limit
      }
      return 1
    },
    uploadLimitMax() {
      const { value, limit } = this
      return value.length >= limit
    }
  },
  mounted() {
    // 是否可粘贴上传
    if (this.item.paste) {
      this.$nextTick(() => {
        document.addEventListener('paste', this.pasteListener)
      })
    }
  },
  beforeDestroy() {
    if (this.item.paste) {
      document.removeEventListener('paste', this.pasteListener)
    }
  },
  updated() {
    console.log(this.value)
  },
  methods: {
    // 删除上传文件
    uploadRemove(e) {
      const { value } = this
      this.$emit('input', [...value.filter(v => v.uid !== e.uid)])
    },
    /**
       * 上传文件校验
       * @param e
       * @param mediaRules
       * @returns {boolean}
       */
    uploadBefore(e) {
      const { item } = this
      const { mediaRules = { type: '', size: 2048 }} = item
      let isType = false
      if (mediaRules.type) {
        mediaRules.type.split(',').map(item => {
          if (!e.type && e.name.includes('.xls')) {
            isType = true
          }
          if (e.type === mime.getType(item)) {
            isType = true
          }
        })
      } else {
        isType = true
      }
      const isBig = e.size / 1024 / 1024 < mediaRules.size
      if (!isType) {
        this.$message.error(`上传格式错误，请选择${mediaRules.type}格式`)
        return false
      }
      if (!isBig) {
        this.$message.error(`上传文件太大，请选择${mediaRules.size}M以下文件`)
        return false
      }
      return true
    },
    // 上传图片
    picUpload(e) {
      const { item } = this
      this.$emit('upload', { file: e.file, attr: item.attr || {}}, res => {
        this.$emit('input', [...this.value, {
          name: e.file.name,
          url: res
        }])
      })
    },
    // 通过监听粘贴事件 上传文件太
    // TODO: 目前仅支持单文件图片上传、可扩展
    pasteListener(e) {
      const clipboardData = e.clipboardData
      const items = clipboardData.items
      let item = null

      if (items && items.length) {
        for (let i = 0; i < clipboardData.types.length; i++) {
          if (clipboardData.types[i] === 'Files') {
            item = items[i]
            break
          }
        }
      }

      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        const reader = new FileReader()
        reader.readAsDataURL(item.getAsFile())
        reader.onload = () => {
          const file = tranferDataURLtoFile(reader.result)
          const uploadFlag = this.uploadBefore(file)
          if (uploadFlag) {
            // 复制图片超出限制不可出现
            if (this.item.paste && this.value?.length >= this.item.attr.limit) {
              return false
            } else {
              this.picUpload({ file })
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-hide {
  /deep/ .el-upload {
    display: none;
  }
}
/deep/ .is-ready{
  display: none;
}
</style>
