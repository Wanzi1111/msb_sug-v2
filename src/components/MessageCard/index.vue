<template>
  <div :class="{ 'tips': item.readStatus ? true : false }" class="message-card" @click="toDetail">
    <div v-if="closed" class="title">
      <b>消息通知</b>
      <b> | 待处理：<span style="color:red;margin-right:5px">{{ item.complaintPendingNum }}</span>条</b>
    </div>
    <i v-if="closed" :class="{ 'closed': closed }" class="el-icon-close" @click.stop="closedPopovers" />
    <div class="message-header">
      <div class="message-title">{{ getHeaderText }}</div>
      <div v-if="item.ctime" class="message-time">{{ item.ctime | getTime }}</div>
    </div>
    <div class="disT">{{ getText }}</div>
    <div class="message-content">
      {{ item.cpComent }}
      <el-link class="message-link" type="primary">
        立即处理
        <i class="el-icon-d-arrow-right" />
      </el-link>
    </div>

  </div>
</template>

<script>
import { immediatelyHandle } from '@/api/message'
import moment from 'moment'
import { HandleOperateTypeList, TextOperateTypeList } from './config'
export default {
  name: 'MessageCard',
  filters: {
    getTime(time) {
      return time?.[4] !== '-' ? time : moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    closed: {
      type: Boolean,
      default: false
    },
    closedPopover: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    getHeaderText() {
      const findItem = HandleOperateTypeList.find((v) => v.key === this.item.handleOperateType)
      return findItem ? findItem.value : '待处理投诉单'
    },
    getText() {
      const findItem = TextOperateTypeList.find((v) => v.key === this.item.handleOperateType)
      return findItem ? findItem.value : '您有1条投诉单已被更新，请及时处理。'
    }
  },
  methods: {
    toDetail() {
      // this.$router.push({ name: 'OperateComplainDetail', params: { id: value }})
      // 点击后刷新页面数据  当数据未读时才会触发读取消息操作
      if (this.item.readStatus) {
        immediatelyHandle([Number(this.item?.id)]).then(res => {
          if (res?.code === 0) {
            this.$emit('getlist')
          }
        })
      }
      window.open(`/workOrder/detail/${this.item?.complaintNo}`)
    },
    closedPopovers() {
      if (this.closedPopover) { this.$emit('closedPopover') }
    }
  }
}
</script>

<style lang="scss" scoped>
.message-card {
  width: 100%;
  padding: 0 16px;
  position: relative;
  cursor: pointer;
  .title{
    width: 100%;
    padding: 10px 0px;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 4px;
  }
  &:hover {
    background: rgb(242,242,242);
    .message-content {
      .message-link {
        background: rgb(242,242,242);
        &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -40px;
        width: 40px;
        height: 20px;
        background: linear-gradient(to right,rgba(0,0,0,0),rgb(242,242,242));
      }
      }
    }
  }
  .closed {
    font-size: 24px;
    position: absolute;
    right: -2px;
    top: -2px;
    z-index: 999;
  }
  .message-header {
    display: flex;
    height: 32px;
    line-height: 32px;
    justify-content: space-between;
    align-content: center;
    .message-title {
      font-size: 14px;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .message-time {
      font-size: 12px;
      color: #999;
      text-align: end;
      flex: 0 0 150px;
    }
  }
  .disT {
    font-size: 14px;
    color: #606266;
  }
  .message-content {
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    max-height: 40px;
    overflow: hidden;
    position: relative;
    line-height: 20px;
    .message-link {
      margin-left: 20px;
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 12px;
      line-height: 20px;
      background: #fff;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -40px;
        width: 40px;
        height: 20px;
        background: linear-gradient(to right,rgba(0,0,0,0),#fff);
      }
    }
    .message-time {
      font-size: 12px;
      color: #999;
    }
  }
}
.tips {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff4949;
    top: 50px;
    left: 0;
  }
}
</style>
