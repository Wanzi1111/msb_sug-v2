<template>
  <el-dialog
    title="获奖信息"
    :visible.sync="visible"
    width="800"
    :before-close="close"
  >
    <div v-loading="gLoadings._ums_api_activity_userPrize_getOneUserPrize">
      <basics-info :info="info" />
      <el-divider />
      <basics-info :info="info1" />
    </div>
  </el-dialog>
</template>

<script>

import moment from 'moment'

export default {
  name: 'View',
  props: {
    id: [Number, String],
    visible: Boolean,
    close: Function
  },
  data() {
    return {
      info: [],
      info1: []
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 获取详情
    getInfo() {
      this.$api.getOneUserPrize({ id: this.id }).then(res => {
        const data = res.payload || {}

        // awardTime: "0"
        // expressCompany: "22"
        // expressNumber: "11"
        // expressType: 0
        // groupName: "2组"
        // id: "1"
        // mid: "0"
        // nickName: "张达"
        // orderNo: ""
        // prizeName: "乐高11"
        // prizeStatus: 4
        // prizeType: 1
        // receiverAddress: "红旗路"
        // receiverMobile: "18610649759"
        // receiverName: "张达"
        // region: "3区"
        // sex: 0
        // teacher: "陈红娜"
        // utime: "1595558892966"

        this.info = [
          { label: '用户ID：', value: data.userId },
          { label: '用户昵称：', value: data.nickName },
          { label: '性别：', value: ['未知', '男', '女'][data.sex] },
          { label: '班主任：', value: data.teacher },
          { label: '组别：', value: data.groupName },
          { label: '大区：', value: data.region },
          { label: '奖品类型：', value: ['', '试听奖励', '分享海报奖励', '排行榜奖励', '月度转介绍活动'][data.prizeType] },
          { label: '领奖时间：', value: data.awardTime && data.awardTime !== '0' ? moment(parseInt(data.awardTime)).format('YYYY-MM-DD') : '' },
          { label: '获奖时间：', value: data.prizeMonth },
          { label: '奖品名称：', value: data.prizeName }
        ]
        this.info1 = [
          { label: '收货人姓名：', value: data.receiverName },
          { label: '联系电话：', value: data.receiverMobile },
          { layer: 'all', label: '邮寄地址：', value: `${data.receiverProvince}${data.receiverCity}${data.receiverArea}${data.receiverAddress}` },
          { layer: 'all', label: '订单号：', value: data.requestId },
          { label: '快递公司：', value: data.expressCompany },
          { label: '快递单号：', value: data.expressNumber }
        ]
      })
    }
  }
}
</script>
