<template>
  <div class="app-container">
    <basics-block title="更换物料">
      <basics-form ref="editMateriel" :loading="loadings._operation_resource_uploadResource" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm" />
    </basics-block>
  </div>
</template>

<script>
import { queryResource, materielSize, materielAction } from '@/api/advert/materiel'
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import forms, { actions } from './forms/edit'
import { mapGetters } from 'vuex'

export default {
  name: 'EditMateriel',
  components: { BasicsForm, BasicsBlock },
  computed: {
    ...mapGetters(['loadings'])
  },
  data() {
    return {
      forms: forms,
      actions: actions,
      id: this.$route.params.id
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.disabledInit()
  },
  methods: {
    // 更换时禁止改变的组件
    disabledInit() {
      this.$refs.editMateriel.set({
        type: 'attr',
        data: {
          resourceName: { disabled: true },
          resourceSize: { disabled: true },
          type: { disabled: true }
        }
      })
    },
    async init() {
      await this.getSize()
      await this.getDetail()
    },
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
        this.$refs.editMateriel.set({
          type: 'options',
          data: { resourceSize: resourceSize }
        })
      })
    },
    // 获取物料详情
    getDetail() {
      queryResource({ resourceId: this.id }).then(res => {
        const data = { ...res.data }
        data.type = `${data.type}`
        if (data.type === '1') {
          data.resourceVideoUrl = data.resourceUrl
          delete data.resourceUrl
        }
        this.$refs.editMateriel.set({
          type: 'defaultVal',
          data: data
        })
        const resourceSize = data.resourceSize.split('*')
        const mediaRules = {
          width: resourceSize[0],
          height: resourceSize[1],
          size: 3,
          media: 'img',
          type: 'GIF,PNG,JPG,JPEG'
        }
        this.$refs.editMateriel.set({
          type: 'mediaRules',
          data: { resourceUrl: mediaRules, coverUrl: mediaRules }
        })
      })
    },
    // 物料类型切换
    changeForm(val, oldVal) {
      if (val.type !== oldVal.type) {
        if (val.type === '1') {
          this.$refs.editMateriel.set({
            type: 'visible',
            data: { resourceUrl: false, coverUrl: true, resourceVideoUrl: true }
          })
        } else {
          this.$refs.editMateriel.set({
            type: 'visible',
            data: { resourceUrl: true, coverUrl: false, resourceVideoUrl: false }
          })
        }
      }
    },
    // 更换物料
    submitForm(val) {
      const data = {
        id: this.id,
        ...val
      }
      if (val.type === '1') {
        data.resourceUrl = data.resourceVideoUrl
        delete data.resourceVideoUrl
      }
      materielAction(data).then(res => {
        if (res.status === 0) {
          this.$message.success('更换物料成功')
          this.$router.push({ name: 'Materiel' })
        }
      })
    }
  }
}
</script>

