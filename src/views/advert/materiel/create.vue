<template>
  <div class="app-container">
    <basics-block title="上传物料">
      <basics-form ref="createMateriel" :loading="loadings._operation_resource_uploadResource" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />
    </basics-block>
  </div>
</template>

<script>
import { materielSize, materielAction } from '@/api/advert/materiel'
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import forms, { actions } from './forms/create'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateMateriel',
  components: { BasicsForm, BasicsBlock },
  computed: {
    ...mapGetters(['loadings'])
  },
  data() {
    return {
      forms: forms,
      actions: actions
    }
  },
  created() {
    this.getSize()
  },
  methods: {
    // 获取物料尺寸下拉框选项
    getSize() {
      materielSize().then(res => {
        const resourceSize = []
        const data = res.data || []
        data.map(item => {
          resourceSize.push({
            label: `${item.osType}(${item.resourceSize})`,
            value: item.resourceSize
          })
        })
        this.$refs.createMateriel.set({
          type: 'options',
          data: { resourceSize: resourceSize }
        })
        if (resourceSize.length) {
          this.$refs.createMateriel.set({
            type: 'defaultVal',
            data: { resourceSize: resourceSize[0].value }
          })
        }
      })
    },
    // 物料类型切换
    changeForm(val, oldVal) {
      if (val.type !== oldVal.type) {
        if (val.type === '1') {
          this.$refs.createMateriel.set({
            type: 'visible',
            data: { resourceUrl: false, coverUrl: true, resourceVideoUrl: true }
          })
        } else {
          this.$refs.createMateriel.set({
            type: 'visible',
            data: { resourceUrl: true, coverUrl: false, resourceVideoUrl: false }
          })
        }
      }
      if (val.resourceSize !== oldVal.resourceSize) {
        const resourceSize = val.resourceSize.split('*')
        const mediaRules = {
          width: resourceSize[0],
          height: resourceSize[1],
          size: 3,
          media: 'img',
          type: 'GIF,PNG,JPG,JPEG'
        }
        this.$refs.createMateriel.set({
          type: 'mediaRules',
          data: { resourceUrl: mediaRules, coverUrl: mediaRules }
        })
        this.$refs.createMateriel.set({
          type: 'defaultVal',
          data: { resourceUrl: '', coverUrl: '' },
          validateField: false
        })
      }
    },
    // 新增物料
    submitForm(val) {
      const data = {
        ...val
      }
      if (val.type === '1') {
        data.resourceUrl = data.resourceVideoUrl
        delete data.resourceVideoUrl
      }
      materielAction(data).then(res => {
        if (res.status === 0) {
          this.$message.success('上传物料成功')
          this.$router.push({ name: 'Materiel' })
        }
      })
    }
  }
}
</script>
