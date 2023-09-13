<template>
  <div class="upload-demo">
    <div tabindex="0" class="el-upload el-upload--text" @click="() => this.$refs.input.click()">
      <div
        :class="{'is-dragover': dragover, 'el-upload-dragger': true}"
        @drop.prevent="onDrop"
        @dragover.prevent="allowDrop"
        @dragleave.prevent="dragover = false"
      ><i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <input ref="input" type="file" name="file" multiple="multiple" class="el-upload__input" @change="importsFile">
    </div>
    <div class="el-upload__tip">{{ tip }}</div>
    <ul class="el-upload-list el-upload-list--text" style="width: 360px;">

      <li v-if="file && 'name' in file" tabindex="0" class="el-upload-list__item is-ready">
        <a class="el-upload-list__item-name"><i class="el-icon-document" />{{ file.name }}</a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check" />
        </label>
        <i class="el-icon-close" @click="delFile" />
        <div style="width: 360px" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" class="el-progress el-progress--line">
          <div class="el-progress-bar">
            <div class="el-progress-bar__outer" style="height: 2px;">
              <div class="el-progress-bar__inner" :style="`width: ${loaded}%;${loaded >= 100 ? 'background-color: #4CAF50' : ''}`" />
            </div>
          </div>
          <div class="el-progress__text" style="font-size: 12.8px;">{{ loaded }}%</div>
        </div>
      </li>

    </ul>
  </div>
</template>

<script>
const mime = require('mime')

export default {
  name: 'Upload',
  props: {
    tip: {
      type: String,
      default: '支持扩展名：.xls，.xlsx，且不超过500kb'
    },
    mediaRules: {
      type: Object,
      default: () => {
      }
    },
    uploadApi: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      dragover: false,
      loaded: 0,
      file: ''
    }
  },
  methods: {
    // 拖拽
    onDrop(e) {
      this.dragover = false
      this.uploadFile(e.dataTransfer.files[0])
    },
    // 拖拽释放
    allowDrop(ev) {
      this.dragover = true
      ev.preventDefault()
    },
    onUploadProgress(e) {
      this.loaded = (e.loaded / e.total * 100).toFixed()
    },
    /**
       * 上传文件校验
       * @param file
       * @param mediaRules
       * @returns {Promise<boolean>}
       */
    async uploadVerification(file, mediaRules = { width: 0, height: 0, ratio: 0, type: '', size: 2048 }) {
      if (!file) {
        return false
      }
      // const isType = mediaRules.type === '' || mediaRules.type.toLowerCase().indexOf(file.type.split('/')[1]) >= 0
      let isType = false
      if (mediaRules.type) {
        mediaRules.type.split(',').map(item => {
          if (!file.type && file.name.includes('.xls')) {
            isType = true
          }
          if (file.type === mime.getType(item)) {
            isType = true
          }
        })
      } else {
        isType = true
      }
      const isBig = file.size / 1024 / 1024 < mediaRules.size
      const getSize = () => {
        return new Promise((resolve, reject) => {
          const image = new Image()
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = file => {
            image.src = file.target.result
            // base64地址图片加载完毕后
            image.onload = img => {
              // reject()
              resolve(image)
            }
            image.onerror = error => {
              reject(error)
            }
          }
          fileReader.onerror = error => {
            reject(error)
          }
        })
      }
      try {
        if (!isType) {
          this.$message.error(`上传格式错误，请选择${mediaRules.type}格式`)
          return false
        }
        if (!isBig) {
          this.$message.error(`上传文件太大，请选择${mediaRules.size}M以下文件`)
          return false
        }
        if (mediaRules.ratio) {
          const sizeDat = await getSize()
          const ratio = parseFloat(mediaRules.ratio)
          if (sizeDat.width / sizeDat.height !== ratio) {
            this.$message.error(`上传比例错误，请选择比例为 1:${1 / mediaRules.ratio} 的图片`)
            return false
          }
        } else if (mediaRules.width || mediaRules.height) {
          const sizeDat = await getSize()
          const width = parseInt(mediaRules.width)
          const height = parseInt(mediaRules.height)
          if (sizeDat.width !== width || sizeDat.height !== height) {
            this.$message.error(`上传尺寸错误，请选择尺寸宽高为 ${mediaRules.width} * ${mediaRules.height} 的图片`)
            return false
          }
        }
        return true
      } catch (e) {
        this.$message.error(`文件识别失败`)
        return false
      }
    },
    // 上传文件
    importsFile(e) {
      this.uploadFile(e.target.files[0])
      this.$refs.input.value = ''
    },
    // 上传文件
    uploadFile(file) {
      this.uploadVerification(file, this.mediaRules).then(sta => {
        if (sta) {
          this.file = file
        } else {
          this.$refs.input.value = ''
        }
      })
    },
    actUp() {
      const { file } = this
      if (!file) {
        this.$message.error('请选择文件')
        return false
      }
      this.loaded = 0
      this.uploadApi({
        file: file,
        onUploadProgress: this.onUploadProgress
      }).then(res => {
        this.$message.success(`文件上传完成`)
        this.$emit('uploadEnd', res.data)
      }).finally(() => {
        setTimeout(() => {
          this.file = ''
          this.loaded = 0
        }, 500)
      })
    },
    delFile() {
      this.file = ''
    }
  }
}
</script>
