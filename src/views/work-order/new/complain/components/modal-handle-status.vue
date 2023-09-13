<template>
  <el-dialog title="处理结果" :visible.sync="vis" width="500px" destroy-on-close @close="onClose">
    <div v-loading="loadings._k8s_api_complaint_api_business_workOrderRecord">
      <el-timeline>
        <el-timeline-item
          v-for="(v, index) in list"
          :key="index"
          :timestamp="v.time"
        >
          {{ `${v.currentStaffName || ''}（${v.processing_progress}）` }}
          <div class="table-small-box" style="margin-top: 10px">{{ v.handleComent }}</div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import { getWorkOrderRecord } from '@/api/work-order'
import moment from 'moment'

export default {
  name: 'ModalPriority',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      vis: true,
      list: []
    }
  },
  computed: {
    ...mapGetters(['loadings', 'baseDataMap'])
  },
  mounted() {
    const { data: { complaintNo }, baseDataMap: { processing_progress_map }} = this
    getWorkOrderRecord({ complaintNo }).then(res => {
      if (res?.code === 0) {
        if (res.payload?.length) {
          res.payload.forEach(v => {
            v.time = moment(v.ctime).format('YYYY-MM-DD HH:mm:ss')
            v.processing_progress = processing_progress_map[v.handleType] || ''
          })
        }
        this.list = res.payload
      }
    })
  },
  methods: {
    onClose() {
      this.$emit('handleModalVis', 0)
    }
  }
}
</script>
