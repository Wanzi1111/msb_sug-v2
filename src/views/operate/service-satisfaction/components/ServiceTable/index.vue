
<template>
  <div>
    <div class="service-table-title">
      <div class="service-table-header">第{{ servicedate.order }}题:{{ servicedate.title }}</div>
      <div class="service-table-content">本题平均分 {{ servicedate.aveSource }} NPS值:{{ servicedate.nps }}%</div>
    </div>
    <div>
      <el-table v-loading="loadings._operation_question_getGatherQuestion" border style="width: 100%" :data="servicedate.questoinUsers">
        <el-table-column
          prop="order"
          label="选项"
          width="300"
        />
        <el-table-column
          label="选择人数"
          prop="questionUsers"
          width="300"
        />
        <el-table-column label="条形图">
          <template slot-scope="scope">
            <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.proportion" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ServiceTable',
  props: {
    servicedate: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  }
}
</script>

<style lang="scss" scoped>
.service-table-title{
  padding: 1rem 0;
}
</style>
