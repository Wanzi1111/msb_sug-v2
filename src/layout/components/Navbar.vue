<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div v-show="backlog && backLogList.length !== 0" class="backlogtis">
      <el-carousel height="35px" autoplay indicator-position="none" direction="vertical">
        <el-carousel-item v-for="item in backLogList" :key="item.id">
          <span class="small">{{ item.content }}</span>
          <el-link class="message-link" type="primary" @click="toDetail(item)">
            立即处理
            <i class="el-icon-d-arrow-right" />
          </el-link>
        </el-carousel-item>
      </el-carousel>
      <span class="close" @click="close">
        <i class="el-icon-close" />
      </span>
    </div>
    <div class="right-menu">
      <div class="popover-box">
        <el-popover
          v-model="socketTimeout"
          placement="bottom-start"
          width="400"
          trigger="click"
        >
          <message-card
            :item="socketData"
            :closed="true"
            @closedPopover="closedPopover"
          />
          <div slot="reference" class="popover-b" />
        </el-popover>
      </div>
      <div class="notice-box" @click="openDrawer">
        <svg-icon icon-class="notice" />
        <el-badge v-if="dataList.length" :value="dataList.length" class="item">
          <span>通知</span>
        </el-badge>
        <span v-else>通知</span>
      </div>
      <el-drawer
        size="500px"
        :visible.sync="drawer"
      >
        <div slot="title">
          <b>消息通知</b>
          <b> | 待处理：<span style="color:red;margin-right:5px">{{ pendingNum }}</span>条</b>
        </div>
        <message-list
          :message-data-list="dataList"
          :total="0"
          :get-list="getList"
          :loading="loadings._k8s_api_complaint_api_news_getComplaintNews"
        />
        <div class="drawer-footer">
          <el-button icon="el-icon-refresh" circle @click="getList" />
          <el-button type="primary" @click="allRead">全部置为已读</el-button>
        </div>
      </el-drawer>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>个人中心</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <el-dropdown-item divided>-->
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div>
        <el-tag v-if="AMBIENT_ENV && ENVTextMap[AMBIENT_ENV]" type="success">{{ ENVTextMap[AMBIENT_ENV] }}</el-tag>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import MessageCard from '@/components/MessageCard'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { socketConnect } from '@/utils/service'
import { getComplaintNews, immediatelyHandle, getcountByCpStatusAndCurrentStaffId } from '@/api/message'
import { getpendingList } from '@/api/operate/sugDeitail'
import moment from 'moment'
const AMBIENT_ENV = process.env.VUE_APP_AMBIENT_ENV
export default {
  components: {
    Breadcrumb,
    Hamburger,
    MessageCard
  },
  data() {
    return {
      drawer: false,
      backlog: true,
      dataList: [],
      socket: { websocket: null, messageData: null, socketOver: null, socketConnect: null },
      socketData: {},
      socketTimeout: false,
      pendingNum: 0,
      backLogList: [],
      ENVTextMap: {
        development: '开发',
        test: '测试',
        staging: '预发'
      },
      AMBIENT_ENV
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar',
      'device',
      'loadings'
    ])
  },
  watch: {
    socketData(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        if (newVal?.operateType === 1) {
         this.socketTimeout = true
        } else {
         this.socketTimeout = false
        }
      }
    },
    loadings(newVal, oldVal) {
      // 全局发生读取数据操作时刷新当前页面列表数据
      if (newVal._k8s_api_complaint_api_news_immediatelyHandle !==
      oldVal._k8s_api_complaint_api_news_immediatelyHandle &&
      !newVal._k8s_api_complaint_api_news_immediatelyHandle) {
        this.getList()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
      this.wsConnected()
      this.getCountComplaintNum()
      this.getBacklog()
    })
  },
  destroyed() {
    this.socket?.socketOver()
  },
  methods: {
    // // 获取用户当前待处理的单子
    getCountComplaintNum() {
      getcountByCpStatusAndCurrentStaffId({
        staffId: getToken('userId'),
        cpStatus: 1
      }).then(res => {
        const { code, payload } = res
        if (code === 0) {
          this.pendingNum = payload
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('请确认，是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}&type=logout`)
      })
    },
    closedPopover() {
      this.socketTimeout = false
    },
    openDrawer() {
      this.drawer = !this.drawer
      this.$nextTick(() => {
        if (this.drawer) this.getList()
      })
    },
    messageData(data) {
      this.socketData = JSON.parse(data?.data)
      // operateType 1弹窗提示 2刷新待办
      if (this.socketData?.operateType === 2) {
        this.getBacklog()
      } else if (this.socketData?.operateType === 1) {
        const url = '/api_cs/news/immediatelyHandle'
        new Promise((rssolve, reject) => {
        store.dispatch('loading/setLoad', {
          key: url.replace(/\//g, '_'),
          status: true
        })
        rssolve()
      }).then(() => {
        store.dispatch('loading/setLoad', {
          key: url.replace(/\//g, '_'),
          status: false
        })
      })
      }
    },
    wsConnected() {
      // this.socket?.socketOver()
      this.socket.messageData = this.messageData
      this.socket.socketConnect = () => {
        socketConnect(this.socket)
      }
      this.$nextTick(() => {
        socketConnect(this.socket)
      })
    },
    allRead() {
      let data = []
      data = this.dataList.map((v) => Number(v.id))
      immediatelyHandle(data).then(res => {
        if (res?.code === 0) {
          this.getList()
        }
      })
    },
    getList() {
      const data = {
        staffId: getToken('userId'),
        readStatus: 1
      }
      // 获取消息列表数据
      getComplaintNews({
        ...data,
        pageNumber: 0,
        pageSize: 999
      }).then(res => {
        if (res?.code === 0) {
          const { payload } = res
          this.dataList = payload?.data
        }
      })
    },
    // 获取待办轮播列表
    getBacklog() {
              // 获取消息列表数据
        getpendingList({
          type: '101,102,103,104,105',
          executeStartTime: moment().startOf('day').format('x'),
          executeEndTime: moment().endOf('day').format('x'),
          page: 0,
          size: 100,
          status: 1
        }).then((res) => {
          if (res?.code === 0) {
            const { payload } = res
            this.backLogList = payload?.data
          }
        })
    },
    close() {
      this.backlog = false
    },
    // 轮播提示列表点击立即处理跳详情
    toDetail(item) {
      window.open(`/workOrder/detail/${item?.complaintNo}`)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__header {
  color: #000 !important;
}
/deep/ {
  .el-badge__content.is-fixed{
    right: 2px;
    top: 15px;
  }
}
/deep/ {
  .el-divider--horizontal {
    margin: 5px 0;
  }
  .el-drawer__container {
    position: relative;
    .drawer-footer {
      border-top: 1px solid #cecece;
      position: absolute;
      padding: 0 20px;
      width: 100%;
      height: 60px;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #fff;
    }
  }
  .el-drawer__body {
    padding: 0 5px;
    padding-bottom: 60px;
  }
}
.navbar {
  height: 50px;
  // overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    margin-right: 10px;
    &:focus {
      outline: none;
    }
    .popover-box {
      display: flex;
      .popover-b {
        height: 100%;
      }
    }

    .notice-box {
      width: 70px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 15px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .backlogtis{
    width: 60%;
    height: 35px;
    line-height: 35px;
    background: #fce3bf;
    border-radius: 10px;
    top: 7px;
    text-align: center;
    position: absolute;
    z-index: 99;
    left: 240px;
    .el-carousel__item{
      display: flex;
    }
    .small{
      padding: 0px 5px;
      color: #000;
      position: relative;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 800px;
      display: inline-block;
    }
    .message-link{
      width: 100px;
      text-decoration: none;
      font-size: 12px;
    }
    .close{
      position: absolute;
      top:-14px;
      right:-3px;
      cursor: pointer;
      font-size: 18px;
      z-index: 99;
      color: #8a8a8a;

    }
    .close:hover{
      color: #2c2c2c;
    }

  }
}
</style>
