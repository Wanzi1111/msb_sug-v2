<template>
  <div class="app-container">
    <div class="service-satisfaction-header">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="问卷提交数量">
          {{ serviceDate.users }}
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="propValue"
            class="timePicker"
            type="month"
            format="yyyy/MM"
            value-format="yyyy/MM"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loadings._operation_question_getGatherQuestion" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"><a :href="'/operation/question/exportQuestion?date=' + nowDate" download="true">下载文档</a></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-for="(item,index) in serviceDate.questions" :key="index" class="service-satisfaction-table">
      <service-table :servicedate="item" />
    </div>
  </div>
</template>

<script>
import ServiceTable from './components/ServiceTable'
import { getGatherQuestion } from '@/api/operate/service-satisfaction'
import { mapGetters } from 'vuex'
export default {
  name: 'ServiceSatisfaction',
  components: { ServiceTable },
  data() {
    return {
      propValue: '',
      serviceDate: {},
      nowDate: ''
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    // 获取本月时间
    this.nowDate = this.formatDate()
    this.propValue = this.nowDate
    this.serviceTableMessage()
  },
  methods: {
    formatDate() {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      return (year + '/' + month + '/' + '01')
    },
    onSubmit() {
      this.serviceTableMessage()
    },
    timeChange(value) {
      this.nowDate = value + '/01'
    },
    serviceTableMessage() {
      const that = this
      getGatherQuestion({ date: this.nowDate }).then(res => {
        that.serviceDate = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
