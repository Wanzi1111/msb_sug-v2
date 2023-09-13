<template>
  <div>
    <el-dialog
      v-if="visible"
      :title="userRemarkFourteenIndex ? '客服聊天记录' : '客服通话记录'"
      :visible.sync="visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="650px"
      @close="cancel"
    >
      <div v-if="userRemarkFourteenIndex" class="detaillist">
        <ul>
          <li v-for="(item, index) in chattingRecords" :key="index">
            <div
              :class="item.sender_type === 0 ? 'detail_left' : 'detail_right'"
            >
              <div class="column">
                <p>
                  <span> {{ item.ts }} </span>
                  <span>{{ item.sender_name }}</span>
                </p>
                <p class="times">
                  {{ item.msg }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-show="!userRemarkFourteenIndex">
        <div v-if="Object.keys(callRecords).length !== 0" class="callRecords">
          <div class="callRecordslist">
            <span class="detaillisttag"> 接待客服： </span>
            <span>{{ callRecords.staff_name }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 处理状态： </span>
            <span>{{ handleStatus[callRecords.handle_status] }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 呼叫类型： </span>
            <span>{{ callDirection[callRecords.call_direction] }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 挂断方： </span>
            <span>{{ enderStatus[callRecords.ender] }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 呼叫时间： </span>
            <span>{{ callRecords.start_time | timeFormat }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 结束时间： </span>
            <span>{{ callRecords.end_time | timeFormat }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 主叫号码： </span>
            <span>{{ callRecords.caller }}</span>
          </div>
          <div class="callRecordslist">
            <span class="detaillisttag"> 被叫号码： </span>
            <span>{{ callRecords.callee }}</span>
          </div>
        </div>
        <div v-if="callRecords.voice_aliyun_url" class="audios_down">
          <audios :url="callRecords.voice_aliyun_url" />
          <div
            class="downaudio"
            @click="downaudio(callRecords.voice_aliyun_url)"
          >
            下载
          </div>
        </div>
        <div v-else class="divider">暂无数据</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCallRecord } from '@/api/operate/complainNew'
import moment from 'moment'
export default {
  name: 'ServiceChatRecord',
  filters: {
    timeFormat(e) {
      return (e !== '0' && e) ? moment(+e).format('YYYY-MM-DD HH:mm:ss') : '永久'
    }
  },
  props: {
    recorddDalogVisible: { type: Boolean },
    rowData: { type: Object, default: () => {} }
  },
  data() {
    return {
      visible: this.recorddDalogVisible,
      chattingRecords: [],
      callRecords: {},
      handleStatus: {
        '-1': ' 未处理',
        0: '未解决',
        1: '已解决'
      },
      callDirection: {
        0: '呼入',
        1: '呼出',
        11: '咨询客服',
        12: '咨询第三方',
        21: '转接咨询',
        22: '转接客服',
        23: '转接第三方',
        3: '监听',
        4: '强插通话',
        5: '强拆通话'
      },
      enderStatus: {
        0: ' 系统超时挂断',
        1: '客服挂断',
        2: '客户挂断'
      }
    }
  },
  computed: {
    // 判断是客服通话记录还是聊天记录
    userRemarkFourteenIndex() {
      const flag = this.rowData.userRemarkFourteen && this.rowData.userRemarkFourteen.indexOf('-') === -1
      if (flag) { // 没找到-聊天记录
        return true
      } else { // 通话记录
        return false
      }
    }
  },
  created() {
    getCallRecord({ userRemarkFourteen: this.rowData.userRemarkFourteen }).then(
      (res) => {
        if (res.code === 0) {
          if (this.userRemarkFourteenIndex) {
            // 客服聊天记录
            this.chattingRecords = res.payload?.items
          } else {
            // 通话记录
            this.callRecords = res.payload?.items[0] || {}
          }
          this.$message.success(res.payload.ret_msg)
        }
      }
    )
  },
  methods: {
    // 下载录音包
    downaudio(val) {
      window.location.href = val
    },
    // 关闭弹出框
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang='scss' scoped>
.detaillist {
  width: 100%;
  height: 300px;
  overflow: auto;
  ul{
    padding: 0;
  }
  li {
    font-size: 14px;
    padding: 6px;
    margin-bottom: 2px;
  }
  .detail_left{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    .times{
      display: flex;
      flex-direction: column;
      padding: 15px;
      background: #EEE;
      border-radius: 5px;
      position: relative;
    }
    .times::after{
    content: '';
    display: inline-block;
    width: 15px;
    height: 15px;
    background: #EEE;
    position: absolute;
    left: -3px;
    transform: rotateZ(45deg);
    }
  }
  .detail_right{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .times{
      display: flex;
      flex-direction: column;
      padding: 14px;
      text-align: right;
      background: powderblue;
      border-radius: 5px;
      position: relative;
    }
    .times::after{
    content: '';
    display: inline-block;
    width: 15px;
    height: 15px;
    background: powderblue;
    position: absolute;
    right: -3px;
    transform: rotateZ(45deg);
    }

  }
  .detaillisttag {
    font-weight: 500;
    padding-right: 20px;
  }
  .complain-detail-list-remark-box {
    display: flex;
  }
  .complain-detail-list-remark {
    width: 650px;
    margin-left: 4px;
    span {
      display: block;
      margin-bottom: 10px;
    }
  }
}
.callRecords{
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .callRecordslist{
    width: 50%;
    margin: 10px 0px;
  }

}
.audios_down {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin-top: 20px;
  .downaudio {
    margin-left: 10px;
    width: 50px;
    cursor: pointer;
    color: #409eff;
  }
  .downaudio:hover {
    font-weight: bold;
  }
}
.divider{
  padding: 100px;
  text-align: center;
  color: #999;
  font-size: 24px;
}
</style>
