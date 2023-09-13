<template>
  <el-dialog
    title="导入"
    :visible.sync="visible"
    width="600px"
    :before-close="close"
  >
    <el-form ref="importsForm" label-width="100px">
      <el-form-item label="获奖文件">
        <upload
          ref="upload"
          :upload-api="$api.importUserPrize"
          tip="支持扩展名：.xls,.xlsx 且不超过1M"
          :media-rules="{
            size: 1,
            type: '.xls,.xlsx'
          }"
          @uploadEnd="uploadEnd"
        />
      </el-form-item>
      <br>
      <el-form-item>
        <el-button icon="el-icon-check" :loading="gLoadings._logistics_manage_importBackFillData" type="primary" @click="nowUp">
          立即上传
        </el-button>
        <el-button icon="el-icon-close" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import Upload from './upload'

export default {
  name: 'Imports',
  components: { Upload },
  props: {
    id: Number,
    visible: Boolean,
    close: Function
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    uploadEnd() {
      this.close(1)
    },
    nowUp() {
      this.$refs.upload.actUp()
    }
  }
}
</script>
