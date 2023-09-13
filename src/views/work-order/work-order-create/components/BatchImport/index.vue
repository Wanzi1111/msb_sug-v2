<template>
  <div class="app-container">
    <basics-block title="批量创建投诉单" back>
      <el-form label-width="100px">
        <el-form-item label="批量导入数据">
          <a style="color: #1890ff;" @click="openDl"><i class="el-icon-download" />下载模板</a>
          <upload
            ref="upload"
            :upload-api="importBatchSug"
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
          <el-button icon="el-icon-check" :loading="loadings._k8s_api_complaint_api_v2_complaint_batchCreateComplaint" type="primary" @click="nowUp('importsForm')">立即上传</el-button>
          <!--					<el-button icon="el-icon-check" @click="submitForm('importsForm')">跳过，只上传正常数据</el-button>-->
          <!--					<el-button icon="el-icon-download" @click="submitForm('importsForm')">导出文件</el-button>-->
          <el-button icon="el-icon-back" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 下载模板 -->
      <el-dialog
        title="下载模板"
        :visible.sync="tempState"
        width="500px"
        :before-close="closeDl"
      >
        <basics-form :key="tempState" ref="batchForm" :loading="loadings._k8s_api_complaint_api_v2_complaint_exportTemplate" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />
      </el-dialog>
    </basics-block>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

import { importBatchSug, exportTemplateSug } from '@/api/operate/createSug'
import { getProblemChannelId } from '@/api/operate/complainNew'
import { getQuestionChildrenList } from '@/api/operate/question'
import BasicsBlock from '@/components/BasicsBlock'
import BasicsForm from '@/components/BasicsForm'
import Upload from '../Upload'
import { forms, actions } from './forms/form'
import { createBlob } from '@/utils'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

export default {
  name: 'ImportBatchSug',
  components: { BasicsBlock, Upload, BasicsForm },
  data() {
    return {
      type: this.$route.params.type,
      forms: forms,
      actions: actions({ closeDl: this.closeDl }),
      tempState: false
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  methods: {
    importBatchSug,
    changeForm(val, oldVal) {
      if (val.channelPid && val.channelPid !== oldVal.channelPid) {
        this.setResetVal('problemPid')
        // 请求投诉问题接口
        this.$refs.batchForm.set({
          type: 'defaultVal',
          data: {
            'problemId': []
          }
        })
        this.$refs.batchForm.set({
          type: 'options',
          data: {
            'problemId': []
          }
        })
        this.getProblemChannel(val.channelPid, 'problemPid')
      }
      if (val.problemPid && val.problemPid !== oldVal.problemPid) {
        this.$refs.batchForm.set({
          type: 'defaultVal',
          data: {
            'problemId': []
          }
        })
        this.$refs.batchForm.set({
          type: 'options',
          data: {
            'problemId': []
          }
        })
        // 调取接口
        this.getProblemChild(val.problemPid)
      }
    },
    submitForm(val) {
      const valClone = cloneDeep(val)
      const { type } = this
      var { problemId } = valClone
      if (problemId.length > 0) {
        valClone.problemId = val.problemId.join(',')
      } else {
        valClone.problemId = undefined
      }
      const data = {
        ...valClone,
        type
        // creatUserId: getToken('userId')
      }
      exportTemplateSug(data).then(res => {
        if (res.type === 'application/octet-stream') {
          createBlob(`投诉单创建模版-${moment().format('YYYY-MM-DD')}.xlsx`, res)
          this.$message.success('投诉单创建模版下载成功')
          this.closeDl()
        } else {
          Message.error('导出失败')
        }
      })
    },
    openDl() {
      this.tempState = true
    },
    closeDl() {
      this.tempState = false
    },
    back() {
      this.$router.go(-1)
    },
    nowUp() {
      this.$refs.upload.actUp()
    },
    // 上传成功关闭
    uploadEnd(data) {
      this.$router.back()
    },
    tranFormData(data) {
      return data.map(item => {
        return {
          label: item.cpSource || item.cpType,
          value: item.problemIdNew
        }
      })
    },
    tranFormChildData(data) {
      return data.map(item => {
        return {
          label: item.problemStatus ? '（内部）' + item.cpType : item.cpType,
          value: item.problemIdNew
        }
      })
    },
    // 获取问题分类列表
    getProblemChannel(val, key, type) {
      getProblemChannelId({ channelId: val }).then(res => {
        const data = res.payload ? res.payload?.filter(v => v?.problemStatus?.toString() !== '1')?.map(v => {
          v.id = v.problemIdNew
          return v
        }) : []
        this.setChannel(data, key, type)
      })
    },
    // 获取子问题
    getProblemChild(val) {
      const params = {
        pid: val
      }
      getQuestionChildrenList(params).then(res => {
        const data = res.payload || []
        this.$refs.batchForm.set({
          type: 'options',
          data: {
            'problemId': this.tranFormChildData(data)
          }
        })
      })
    },
    // 清空下拉框的值
    setResetVal(key) {
      this.$refs.batchForm.set({
        type: 'defaultVal',
        data: {
          [key]: undefined
        }
      })
    },
    setChannel(val, key, type) {
      this.$nextTick(() => {
        this.$refs.batchForm?.set({
          type: 'options',
          data: {
            [key]: this.tranFormData(val)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.form-item {
		display: flex;

		/deep/ .el-form-item__content {
			display: flex;
			align-items: center;
			vertical-align: middle;
			// width: 300px;
		}

		/deep/ .el-form-item__label {
			display: flex;
			width: 86px !important;
			margin-right: 10px;
			align-items: center;
			justify-content: flex-end;
			align-self: flex-start;
			line-height: 1.3;
			min-height: 36px;
			vertical-align: middle;
			flex-shrink: 0;
		}

	}
</style>
