<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      :destroy-on-close="true"
      :before-close="handleClose"
      size="50%"
      class="drawer-approval-detail"
    >
      <template v-slot:title>
        <h2>赔付审批</h2>
      </template>
      <div class="approvallk">
        <el-row>
          <el-col :offset="1" :span="23"><h4>审批详情</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请人:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.createName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">申请部门:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.createName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">用户电话:</el-col>
          <el-col :span="19" :offset="1">
            <div v-if="infoData.userMobile" class="columns-txt">
              {{
                infoData.userMobile === disturbMobile
                  ? infoData.userMobile
                  : `${
                    infoData.userMobile && infoData.userMobile.slice(0, 3)
                  }****${infoData.userMobile.slice(-4)}`
              }}
              <svg-icon
                v-show="infoData.userMobile"
                style="cursor: pointer"
                :icon-class="disturbMobileIcone(infoData.userMobile)"
                @click="isDisturbMobile(infoData.userMobile)"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">关联订单:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.outTradeNo || '-' }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">关联工单:</el-col>
          <el-col :span="19" :offset="1">
            <a style="color: #409eff" @click="lookComplaintNoInfo">{{ infoData.complaintNo }}</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付方式:</el-col>
          <el-col :span="19" :offset="1">{{
            currencyTypeAction[infoData.currencyType]
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付额度:</el-col>
          <el-col v-if="infoData.currencyType === 6" :span="19" :offset="1">
            <el-table :data="JSON.parse(infoData.goodsInfo)">
              <el-table-column
                label="商品id"
                prop="productCode"
                align="center"
              />
              <el-table-column
                label="商品名称"
                prop="productName"
                align="center"
              />
              <el-table-column
                label="商品数量"
                prop="productSum"
                align="center"
              />
            </el-table>
          </el-col>
          <el-col v-else :span="19" :offset="1">{{ `${infoData.amount} ${infoData.currencyType === 4 ? channelPidMap[infoData.channelPid] : currencyTypeAction[infoData.currencyType]}` }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付场景:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.scene }}</el-col>
        </el-row>
        <el-row v-if="infoData.reason">
          <el-col :span="4">赔付原因:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.reason }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付说明:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.description }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付历史次数:</el-col>
          <el-col :span="19" :offset="1">{{ infoData.count }}次</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">赔付责任方:</el-col>
          <el-col :span="19" :offset="1">{{
            infoData.responsibleParty
          }}</el-col>
        </el-row>
        <el-row v-if="infoData.images">
          <el-col :span="4">赔付截图:</el-col>
          <el-col :span="19" :offset="1">
            <div class="complain-img">
              <div
                v-for="(itemA, indexA) in infoData.images.split(',')"
                :key="indexA"
                class="complain-img-box"
              >
                <el-image :preview-src-list="[itemA]" :src="itemA" alt="" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="infoData.videos">
          <el-col :span="4">赔付视频:</el-col>
          <el-col :span="19" :offset="1">
            <div
              v-for="(itemB, indexB) in infoData.videos.split(',')"
              :key="indexB"
            >
              <div style="margin-top: 12px">
                <videos v-if="itemB" :key="itemB" :url="itemB" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="rowData.status === 0 && [4, 5].includes(role)">
          <el-col :span="4">审批动作:</el-col>
          <el-col :span="19" :offset="1">
            <div>
              <div class="actions-radio">
                <el-radio-group v-model="actionData.status">
                  <el-radio :label="1">同意</el-radio>
                  <el-radio :label="2">驳回</el-radio>
                </el-radio-group>
              </div>
              <div class="actions-radio">
                <el-input
                  v-if="actionData.status === 2"
                  v-model="actionData.comment"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入驳回理由"
                />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="1" :span="22">
            <el-table
              :data="infoData.record"
              :header-cell-style="{
                background: '#3C56F2',
                color: '#fff',
              }"
            >
              <el-table-column
                prop="createName"
                label="发起人/审核人"
                align="center"
              />
              <el-table-column prop="status" label="审批状态" align="center">
                <template slot-scope="scope">
                  <div>{{ statusAction[scope.row.status] }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="审批意见" align="center" />
              <el-table-column
                prop="createTime"
                label="操作时间"
                align="center"
              />
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="22"
            :offset="1"
            style="text-align: center; padding-top: 5px"
          >
            <el-button @click="handleClose">取 消</el-button>
            <el-button
              v-if="rowData.status === 0 && [4, 5].includes(role)"
              type="primary"
              @click="approvalOperation"
            >提 交</el-button>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getDetailInfo, manualClaims } from '@/api/myExamine'
import { getToken } from '@/utils/auth'
export default {
  name: 'ClaimsDrawer',
  props: {
    claimsDrawerFlag: { type: Boolean },
    rowData: { type: Object, default: () => {} },
    currencyTypeAction: { type: Object, default: () => {} },
    statusAction: { type: Object, default: () => {} },
    role: { type: Number }

  },
  data() {
    return {
      visible: this.claimsDrawerFlag,
      infoData: {},
      disturbMobile: '',
      actionData: {
        status: '',
        comment: ''
      },
      channelPidMap: {
        1011: '1v1课时',
        1021: '小班课课时'
      }
    }
  },
  computed: {
    // 控制电话眼
    disturbMobileIcone() {
      return function(e) {
        if (e !== this.disturbMobile) {
          return 'eye'
        } else {
          return 'eye-open'
        }
      }
    }
  },
  watch: {
    claimsDrawerFlag(newVal) {
      this.visible = newVal
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.rowData.approvalNo) {
        this.getDetailInfo()
      }
    })
  },
  methods: {
    getDetailInfo() {
      const loading = this.$loading({
        lock: true
      })
      getDetailInfo({
        id: this.rowData.id,
        approvalNo: this.rowData.approvalNo
      }).then((res) => {
        loading.close()
        const { code, payload } = res
        if (!code) {
          this.infoData = payload
        }
      })
    },
    handleClose() {
      this.$emit('handleClose')
    },
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e === this.disturbMobile) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e
      }
    },
    // 人工审批
    approvalOperation() {
      const { rowData, actionData } = this
      if (!actionData.status) return this.$message.error('请选择审批动作~')
      if (!actionData.comment && actionData.status === 2) return this.$message.error('请填写驳回理由~')

      const data = {
        approvalId: rowData.id,
        comment: actionData.comment,
        staffId: getToken('userId'),
        staffName: getToken('cname'),
        status: actionData.status
      }
      const loading = this.$loading({
        lock: true
      })
      manualClaims(data).then((res) => {
        loading.close()
        const { code } = res
        if (!code) {
          this.$message.success('审批成功')
          this.$emit('handleClose')
          this.$emit('getList')
        } else {
          this.$message.error('审批失败')
        }
      })
    },
   //   查看原投诉单或者查看新售后工单
   lookComplaintNoInfo() {
    const { workType, complaintNo } = this.infoData
     if (workType === 4) {
       window.open(`${location.protocol}//${location.host}/workOrder/newAfterSaleDetail/${complaintNo}`)
     } else {
       window.open(`${location.protocol}//${location.host}/workOrder/detail/${complaintNo}`)
     }
   }
  }
}
</script>
<style lang='scss' scoped>
.drawer-approval-detail {
  padding-top: 50px;
  font-size: 16px;
  .el-drawer {
    overflow: auto;
  }
}
// el原类名追加样式
.approvallk {
  padding-left: 10px;
}
.approvallk .el-row {
  margin-bottom: 10px;
}
.approvallk .el-row:nth-last-of-type {
  margin-bottom: 0;
}
.approvallk .el-row .el-col-4 {
  text-align: right;
}
.complain-img {
  display: flex;
  flex-wrap: wrap;
  width: 550px;
  img {
    position: absolute;
    display: block;
    height: 100%;
    margin-top: 14px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
.complain-img-box {
  width: 140px;
  overflow: hidden;
  height: 140px;
  position: relative;
  margin-top: 30px;
  margin-right: 40px;
}
.actions-radio {
  margin-bottom: 10px;
  width: 300px;
}
</style>
