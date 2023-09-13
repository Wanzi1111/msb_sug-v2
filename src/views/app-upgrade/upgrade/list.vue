<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="审核配置" name="check">
        <check :label-drop="labelDrop" />
      </el-tab-pane>
      <el-tab-pane label="升级配置" name="upgrade">
        <upgrade :label-drop="labelDrop" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getLabelDrop } from '@/api/app-upgrade/version'
import check from './components/check'
import upgrade from './components/upgrade'

export default {
  name: 'Upgrade',
  components: { check, upgrade },
  data() {
    return {
      activeName: 'check',
      labelDrop: {
        clientDrop: [],
        upgradeTypeDrop: [],
        reviewTypeDrop: []
      }
    }
  },
  created() {
    this.getLabel()
  },
  methods: {
    // 获取客户端和升级类型
    getLabel() {
      getLabelDrop().then(res => {
        const data = res.data || {}
        const clientDrop = (data.clientDrop || []).map(item => {
          return {
            label: item.value,
            value: item.label
          }
        })
        const upgradeTypeDrop = (data.upgradeTypeDrop || []).map(item => {
          return {
            label: item.value,
            value: item.label
          }
        })
        const reviewTypeDrop = (data.reviewTypeDrop || []).map(item => {
          return {
            label: item.value,
            value: item.label
          }
        })
        this.labelDrop = {
          clientDrop: clientDrop,
          upgradeTypeDrop: upgradeTypeDrop,
          reviewTypeDrop: reviewTypeDrop
        }
      })
    }
  }
}
</script>

