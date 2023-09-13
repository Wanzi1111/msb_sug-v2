<template>
  <div
    v-cloak
    v-loading.fullscreen.lock="
      loadings._k8s_api_complaint_api_v2_complaint_complaintInfo ||
        loadings._k8s_api_complaint_api_v2_complaint_complaintRecords ||
        loadings._k8s_api_complaint_api_v2_complaint_acceptCallComplaint
    "
  >
    <div class="app-container">
      <div class="complain-detail_header">
        <div>
          <span class="complain-act-resolve-edit">
            <svg-icon
              :icon-class="flagSignColordata[data.flagSign ? data.flagSign : 0]"
              style="cursor: pointer"
              @click.stop="clickFlag()"
            />
          </span>
          <span>新售后单</span>
          <span>{{ data.complaintNo }}</span>
        </div>
        <clock
          :key="data.complaintNo"
          :columns="data"
          :disabled="[3, 6, 7, 8, 203, 204]"
        />
      </div>
      <div class="step_style">
        <afterDetailelstep
          v-if="timeData"
          :time-data="timeData"
          :new-as-type="newAsType"
          :approval-data="approvalData"
        />
      </div>
    </div>
    <div class="app-container">
      <div class="complain-detail complain-detail-user">
        <span>申请人信息</span>
      </div>
      <div class="complain-detail-list">
        <ul>
          <li>
            <span class="complain-detail-list-tag"> 姓名 </span>
            <span>{{ `${data.userName} - UID${data.userId}` }}</span>
            <span class="styleIcon el-icon-copy-document" @click.stop="handLeCopy(data.userId)" />
            <span style="margin-left:20px">
              <a
                v-if="data.channelPid == '1011' || data.channelPid == '1021'"
                target="_blank"
                style="color: #409eff"
                :href="
                  BOSS_HOST +
                    '/eas/clueManagement/studentDetails?id=' +
                    data.userId
                "
              >
                查看学员详情
              </a>
              <a
                v-if="
                  ['1031', '1041', '1051', '1081'].includes(data.channelPid)
                "
                target="_blank"
                style="color: #409eff"
                @click="getXiaoxiongGetUser()"
              >
                查看学员详情
              </a>
              <a v-if="data.relationComplaintNo" style="color: #409eff" @click="lookWorkOrder">查看原投诉单</a>
              <a v-if="data.compensationCount && data.channelPid !== '2011'" style="color: #409eff" @click="lookClaims">查看赔付单</a>

            </span>
          </li>
          <li>
            <span class="complain-detail-list-tag">用户手机号</span>
            <span>
              {{
                encryptionMobileIcone ? data.userMobile : data.userCallMobile
              }}
              <svg-icon
                style="cursor: pointer"
                :icon-class="encryptionMobileIcone ? 'eye' : 'eye-open'"
                @click="changeEncryptionMobileIcone(encryptionMobileIcone)"
              />
            </span>
          </li>
          <li v-if="!['1012', '1022', '2011'].includes(data.channelPid)">
            <span class="complain-detail-list-tag"> 赔付历史 </span>
            <span>
              <a style="color: #409eff" @click="openHistoryFlag('claims')">{{ data.compensationCount || "-" }}</a>次
            </span>
          </li>
          <li>
            <span class="complain-detail-list-tag"> 售后次数 </span>
            <span>
              共
              <a
                style="color: #409eff"
                target="_blank"
                :href="
                  '/workOrder/complain?uid=' +
                    data.userId +
                    '&channelPid=' +
                    data.channelPid +
                    '&workType=6'
                "
              >{{ data.totalComplaintsByUId }}</a>
              条处理记录
            </span>
          </li>
          <li>
            <span class="complain-detail-list-tag"> 售后渠道 </span>
            <span>
              {{ data.businessName }} - {{ data.channelPName }} -
              {{ data.channelName }}
            </span>
          </li>
          <li v-if="!['1012', '1022', '1061'].includes(data.channelPid)">
            <span class="complain-detail-list-tag"> 用户订单 </span>
            <a style="color: #409eff" @click="lookOrderForm">查看订单</a>
          </li>
          <li class="complain-detail-list-remark-box">
            <span class="complain-detail-list-tag"> 备注信息 </span>
            <div class="complain-detail-list-remark">
              <span>{{ data.userRemarkOne }}: {{ data.userRemarkTwo }} -
                {{ data.userRemarkThree }} - {{ data.userRemarkFour }} -
                {{ data.userRemarkFive }} - {{ data.userRemarkSix }} -
                {{ data.userRemarkSeven }}</span>
              <span>{{ data.userRemarkEight }}: {{ data.userRemarkNine }}-{{
                data.userRemarkTen
              }}
                - {{ data.userRemarkEleven }} - 体验课开课时间：{{
                  data.userRemarkTwelve
                }}
                - 系统课开课时间： {{ data.userRemarkThirteen }} -
                {{ data.userRemarkFourteen }}</span>
              <span style="line-height: 20px">
                {{ data.userRemarkContent }}
                <a
                  style="color: #409eff"
                  @click="addRemark(data.userRemarkContent)"
                >{{ data.userRemarkContent ? "编辑" : "添加" }}</a>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 售后信息 -->
    <div class="app-container">
      <el-row class="commodity-info">
        <el-col :span="8" class="commodity-list">
          <div class="commodity-title">
            <span>商品信息</span>
          </div>
          <div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 关联订单 </span>
              <span>{{ data.complaintAfterSaleEntity && data.complaintAfterSaleEntity.outTradeNo || "-" }}</span>
            </div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 实付金额 </span>
              <span style="color: red">{{
                data.currency === 5 ? `${parseIntFn(data.payment)}金币 + ${data.realCash || 0}元`:
                parseIntFn(data.payment) + data.currencyInfo || "-"
              }}</span>
            </div>
            <div class="commodity-detail-list">
              <div class="commodity-info-tag"> 商品名称 </div>
              <div class="commodity-detail-remark">
                <span>{{ data.productName || "-" }}</span>
                <div v-if="data.productImg" class="commodity-img-box">
                  <el-image :src="data.productImg" alt="" />
                </div>
              </div>
            </div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 下单时间 </span>
              <span>{{ centerExpressData.buyTimeStr || "-" }}</span>
            </div>
            <div v-for="(item) in data.mailLogisticsList" :key="item.orderNo" class="commodity-detail-list">
              <div class="commodity-info-tag">物流单号:</div>
              <div class="commodity-detail-remark">
                <span>{{ item.orderNo }}</span>
                <span class="commodity-info-tag"> 发货状态: </span>
                <span>{{ item.status }}</span>
                <a style="color: #409eff" @click="openlogisticsTrajectoryFn(item)">查询轨迹</a>
                <span>{{ item.supplier }}</span>
                <span>{{ item.warehouseName }}</span>
              </div>
            </div>
            <div class="commodity-detail-list">
              <div class="commodity-info-tag">收货地址</div>
              <div v-if="shippingAddress && shippingAddress.length !== 0" class="commodity-detail-remark">
                <span>{{
                  shippingAddress.consigneeProvince +
                    shippingAddress.consigneeCity +
                    shippingAddress.consigneeArea +
                    shippingAddress.consigneeAddress
                }}</span>
                <span>联系人：{{ shippingAddress.consigneeName }}</span>
                <span>{{ tmMobile(shippingAddress.consigneeMobile) }}
                  <svg-icon
                    v-show="shippingAddress.consigneeMobile"
                    style="cursor: pointer"
                    :icon-class="disturbMobileIcone(shippingAddress.consigneeMobile)"
                    @click="isDisturbMobile(shippingAddress.consigneeMobile)"
                  />
                </span>
                <span v-if="data.mailLogisticsList && data.mailLogisticsList[0].virtualMobile ">{{ data.mailLogisticsList[0].virtualMobile }}<b style="color: #409eff;margin-left: 5px">虚</b></span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="commodity-list commodity-border">
          <div class="commodity-title">
            <span>售后信息</span>
          </div>
          <div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 售后类型 </span>
              <span>{{ data.problemTwoName || "-" }}</span>
              <el-button
                type="primary"
                size="mini"
                @click="tableAction('editType')"
              >修改售后类型</el-button>
            </div>
            <div v-if="newAsType === '0' || newAsType === '1'" class="commodity-detail">
              <span class="commodity-info-tag"> 退款金额 </span>
              <span style="color: red">{{
                data.currency === 5 ? `${parseIntFn(data.refundAmount)}金币 + ${data.complaintAfterSaleEntity && data.complaintAfterSaleEntity.cash || 0}元`:
                parseIntFn(data.refundAmount) + data.currencyInfo || "-"
              }}</span>
            </div>
            <div class="commodity-detail-list">
              <div class="commodity-info-tag">退款原因</div>
              <div class="commodity-detail-remark">
                <span>{{ data.problemThreeName || "-" }}</span>
              </div>
            </div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 申请说明 </span>
              <span>{{ data.cpComent || "-" }}</span>
            </div>
            <div class="commodity-detail">
              <span class="commodity-info-tag"> 售后历史 </span>
              <span class="styleIcon" @click="openHistoryFlag('after')">{{
                data.allAfterSaleNum || "-"
              }}</span>次
            </div>
          </div>
        </el-col>
        <el-col v-if="['1', '2', '3'].includes(newAsType)" :span="8" class="commodity-list commodity-border">
          <div class="commodity-title">
            <span>{{ newAsType === '3' ?'补发信息':'退货信息' }}</span>
          </div>
          <div>
            <div v-if="['1', '2'].includes(newAsType)" class="commodity-detail-list">
              <div class="commodity-info-tag">退货地址</div>
              <div class="commodity-detail-remark">
                <span
                  v-if="data.recipient && data.recipient.length !== 0"
                >{{
                  data.recipient.consigneeProvince +
                    data.recipient.consigneeCity +
                    data.recipient.consigneeArea +
                    data.recipient.consigneeAddress
                }}</span>
                <span v-else>-</span>
                <span
                  v-if="data.recipient && data.recipient.length !== 0"
                >联系人：{{
                  data.recipient.consigneeName +
                    data.recipient.consigneeMobile
                }}</span>
                <span v-else>-</span>
              </div>
            </div>
            <div v-if="newAsType === '3'" class="commodity-detail-list">
              <div class="commodity-info-tag">补发地址</div>
              <div v-if="approvalData.address && approvalData.address.length !== 0" class="commodity-detail-remark">
                <span>{{
                  approvalData.address.consigneeProvince +
                    approvalData.address.consigneeCity +
                    approvalData.address.consigneeArea +
                    approvalData.address.consigneeAddress
                }}</span>
                <span>联系人：{{ approvalData.address.consigneeName }}</span>
                <span>{{ tmMobile(approvalData.address.consigneeMobile) }}
                  <svg-icon
                    v-show="approvalData.address.consigneeMobile"
                    style="cursor: pointer"
                    :icon-class="disturbMobileIcone(approvalData.address.consigneeMobile)"
                    @click="isDisturbMobile(approvalData.address.consigneeMobile)"
                  />
                </span>
                <span v-if="data.reissueLogisticsDetailDto && data.reissueLogisticsDetailDto.virtualMobile">{{ data.reissueLogisticsDetailDto.virtualMobile }} <b style="color: #409eff">虚</b></span>
              </div>
            </div>
            <div v-if="['1', '2'].includes(newAsType)" class="commodity-detail-list">
              <div class="commodity-info-tag">寄回单号</div>
              <div class="commodity-logisticsCode">
                <el-input
                  v-model="logisticsId"
                  placeholder="请输入寄回快递单号"
                  size="mini"
                />
                <span>{{ logisticsCompany }}</span>
                <el-button
                  v-if="[23, 27].includes(data.cpStatusSub)"
                  type="primary"
                  size="mini"
                  @click="updateLogisticsFn"
                >保存</el-button>
                <div v-if="data.logisticsDetailDto && data.logisticsDetailDto.status" style="margin-top: 10px;">
                  <span>物流状态：{{ data.logisticsDetailDto.status }}</span>
                  <a style="color: #409eff" @click="openlogisticsTrajectoryFn(data.logisticsDetailDto)">查询轨迹</a>
                </div>

              </div>
            </div>
            <div v-if="['2', '3'].includes(newAsType)" class="commodity-detail-list">
              <div class="commodity-info-tag">{{ newAsType === '3' ?'补发单号':'换货单号' }} </div>
              <div class="commodity-detail-remark">
                <span>{{ data.reissueLogisticsDetailDto && data.reissueLogisticsDetailDto.expressName || "-" }}</span>
                <span>{{ data.reissueLogisticsDetailDto && data.reissueLogisticsDetailDto.logisticsId || "-" }}</span>
                <div v-if="data.reissueLogisticsDetailDto && data.reissueLogisticsDetailDto.status" style="margin-top: 10px;">
                  <span>物流状态：{{ data.reissueLogisticsDetailDto.status }}</span>
                  <a style="color: #409eff" @click="openlogisticsTrajectoryFn(data.reissueLogisticsDetailDto)">查询轨迹</a>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="app-container">
      <!-- 操作栏 -->
      <div v-if="afterSaleSourceFlag" class="detail-action">
        <el-button
          v-if="!['1012', '1022', '2011'].includes(data.channelPid)"
          type="default"
          size="mini"
          @click="tableAction('approvalClaims')"
        >创建赔付审批</el-button>
        <el-button
          type="default"
          size="mini"
          @click="tableAction('addBacklog')"
        >添加待办</el-button>
        <el-button
          :disabled="!![6, 7].includes(data.cpStatus) || !data.currentStaffId"
          type="default"
          size="mini"
          @click="tableAction('editStaffUser')"
        >修改操作人</el-button>
        <el-button
          type="default"
          size="mini"
          @click="tableAction('sendNote')"
        >发短信</el-button>
        <el-button
          :disabled="!![4, 6, 7].includes(data.cpStatus)"
          type="primary"
          size="mini"
          @click="tableAction('doItNow')"
        >立即处理</el-button>
      </div>
      <div class="detail-action-main">
        <div>
          <span>解决记录：</span>
          <el-tag type="success">
            {{ data.currentStaffName ? data.currentStaffName : "" }}
          </el-tag>
          <div v-if="allRecords.length > 0" class="sort-icon">
            <span
              style="cursor: pointer"
              class="sorts"
              @click.stop="recordSort(recordSortFlag)"
            >
              <svg-icon
                icon-class="ascendingSort"
                :class="!recordSortFlag ? 'sortactive' : ''"
              />
              <svg-icon
                icon-class="dropSort"
                :class="recordSortFlag ? 'sortactive drop' : 'drop'"
              />
            </span>
          </div>
        </div>
      </div>
      <div v-if="allRecords.length > 0" class="complain-detail-list-user">
        <ul>
          <li v-for="(item, index) in allRecords" :key="index">
            <div>
              <span v-if="item.handleRole === 30" class="userservice" style="background: #3C56F2;">链</span>
              <span v-if="item.handleRole === 1" class="userservice" style="background: #409eff;">买</span>
              <span v-if="![30, 1].includes(item.handleRole)" class="userservice" style="background: #ccc;">服</span>
              <span
                style="color: #1790ff"
              >{{ staffEnumData[item.handleRole] }} {{ item.staffName }}</span>
              <span>{{ OPERATE_TYPE[item.handleOperateType] || "" }}</span>
              <span style="color: #606266">{{ tranTime(item.ctime) }}</span>
              <span v-if="item.handleOperateType === 2">
                <el-tag
                  v-if="item.isAssist === 0"
                  type="success"
                >处理人</el-tag>
                <el-tag
                  v-if="item.isAssist === 1"
                  type="warning"
                >协助人</el-tag>
              </span>
            </div>
            <div class="complain-act-resolve-main">
              <div class="complain-act-resolve">
                <div v-if="item.handleRole !== 9">
                  <p v-if="item.handleComent">
                    <span>内部：</span>
                    <span v-html="brCpComent(item.handleComent)" />
                  </p>
                  <p v-if="item.handleComentUser">
                    <span>用户：</span>
                    <span v-html="brCpComent(item.handleComentUser)" />
                  </p>
                </div>
                <span v-if="item.handleOperateType === 3">
                  已关闭本次投诉，等待回访；
                </span>
                <span v-if="item.handleOperateType === 4">
                  暂时无法解决；
                </span>
                <span v-if="item.handleOperateType === 5"> 介入处理 </span>
              </div>

            </div>
            <div v-if="item.imgUrl" class="complain-img">
              <div
                v-for="(itemA, indexA) in item.imgUrl.split(',')"
                :key="indexA"
                class="complain-img-box"
              >
                <!-- <img :src="itemA"> -->
                <el-image :preview-src-list="[itemA]" :src="itemA" alt="" />
              </div>
            </div>
            <div
              v-for="(itemB, indexB) in item.videoUrl.split(',')"
              :key="indexB"
            >
              <div style="margin-top: 12px">
                <div v-if="itemB.includes('mp3')" style="width: 400px">
                  <audios :url="itemB" />
                </div>
                <videos
                  v-if="!itemB.includes('mp3') && itemB"
                  :key="itemB"
                  :url="itemB"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 立即处理 修改操作人 修改售后类型 弹出框-->
    <el-dialog
      width="700px"
      :title="info.title"
      :visible.sync="dialogNewVisible"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <h2
        style="
          margin-bottom: 20px;
          margin-top: 0;
          font-size: 14px;
          font-weight: 400;
        "
      >
        {{ info.instroduct }}
      </h2>
      <basics-form
        ref="complaintForm"
        :key="dialogNewVisible"
        class="complaint-form-box"
        :loading="
          loadings._k8s_api_complaint_api_v2_complaint_acceptComplaint ||
            loadings._k8s_api_complaint_api_v2_complaint_turnBusinessHandle
        "
        :forms="complaintForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        @submitForm="submitForm"
        @changeForm="changeNewForm"
      />
    </el-dialog>
    <!-- 发短信 -->
    <snedMessage
      v-if="sendMsgFlag"
      :send-msg-flag="sendMsgFlag"
      :row-data="data"
      :user-mobile="uMobile"
      :close-enum-tpye-flag="closeEnumTpyeFlag"
      @cancel="cancel"
    />
    <!-- 添加待办 -->
    <AddBacklogDialog
      :backlog-flag="backlogFlag"
      :complaint-no="complaintNo"
      :channel-pid="data.channelPid"
      @cancel="cancel"
    />
    <!-- 同意审批 -->
    <agreeApproval
      v-if="agreeApprovalFlag"
      :agree-approval-flag="agreeApprovalFlag"
      :row-data="data"
      :approval-data="approvalData"
      :info="info"
      :approval-refund-form="complaintForm"
      @cancel="cancel"
      @getComplain="getComplain"
    />
    <!-- 查询轨迹 -->
    <logisticsTrajectory
      v-if="logisticsTrajectoryFlag"
      :logistics-trajectory-flag="logisticsTrajectoryFlag"
      :row-data="logisticsDetailDto"
      @cancel="cancel"
    />
    <!-- 售后历史 -->
    <afterHistory
      v-if="afterHistoryFlag"
      :after-history-flag="afterHistoryFlag"
      :after-sale-id="data.afterSaleId"
      @cancel="cancel"
    />
    <!-- 赔付历史 -->
    <claimsHistory
      v-if="claimsHistoryFlag"
      :claims-history-flag="claimsHistoryFlag"
      :user-id="actionUserId"
      @cancel="cancel"
    />
    <!-- 创建赔付审批 -->
    <createClaims
      v-if="claimsFlag"
      :claims-flag="claimsFlag"
      :row-data="data"
      :user-mobile="uMobile"
      @cancel="cancel"
      @getComplain="getComplain"
      @getComplaintRecords="getComplaintRecords"
    />
    <el-dialog
      :visible.sync="approvalFlag"
      width="550px"
      :title="info.title"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div v-if="info.instroduct" style="margin-bottom: 20px;color: #666">{{ info.instroduct }}</div>
      <div v-else style="margin-bottom: 20px;color: red">注：该内容用户可查看</div>
      <basics-form
        ref="complaintForm"
        :key="approvalFlag"
        class="complaint-form-box"
        :forms="complaintForm"
        :actions="complaintFormAction"
        style="padding-bottom: 20px"
        @submitForm="submitApprovalForm"
      />
    </el-dialog>

    <div v-if="afterSaleSourceFlag">
      <div v-if="newAsType === '0' && (data.cpStatus === 1 || [20, 22, 27].includes(data.cpStatusSub))" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('automaticRefundYes')">同意退款</el-button>
        <el-button type="default" size="mini" @click="handleApproval('automaticRefundNo')">拒绝退款</el-button>
      </div>

      <div v-if="newAsType === '1' && !approvalData.id && (data.cpStatus === 1 || [20, 22].includes(data.cpStatusSub))" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('returnMoneyYes')">同意退货退款</el-button>
        <el-button type="default" size="mini" @click="handleApproval('returnMoneyNo')">拒绝退货退款</el-button>
      </div>

      <div v-if="['1', '2'].includes(newAsType) && [20, 27].includes(data.cpStatusSub) && approvalData.id" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('supplyApproval')">重新发起供应链审批</el-button>
        <el-button type="default" size="mini" @click="handleApproval('receivingNoteNo')">拒绝收货</el-button>
        <el-button v-if="newAsType === '1'" type="default" size="mini" @click="handleApproval('returnMoneyNo')">拒绝退货退款</el-button>
        <el-button v-if="newAsType === '2'" type="default" size="mini" @click="handleApproval('exchangeGoodsNo')">拒绝换货</el-button>
      </div>

      <div v-if="newAsType === '3' && data.cpStatusSub === 27 && approvalData.id" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('emitReplenishDispatch')">修改补发</el-button>
        <el-button type="default" size="mini" @click="handleApproval('replenishDispatchNo')">拒绝补发</el-button>
      </div>

      <div v-if="newAsType === '2' && !approvalData.id && (data.cpStatus === 1 || [20, 22].includes(data.cpStatusSub))" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('exchangeGoodsYes')">同意换货</el-button>
        <el-button type="default" size="mini" @click="handleApproval('exchangeGoodsNo')">拒绝换货</el-button>
      </div>

      <div v-if="newAsType === '3' && !approvalData.id && (data.cpStatus === 1 || [20, 22].includes(data.cpStatusSub))" class="app-content-footer">
        <el-button type="primary" size="mini" @click="handleApproval('replenishDispatchYes')">同意补发</el-button>
        <el-button type="default" size="mini" @click="handleApproval('replenishDispatchNo')">拒绝补发</el-button>
      </div>
    </div>

    <!-- 用户订单抽屉 -->
    <orderFormDrawer
      v-if="orderFormFlag && actionUserId"
      :order-form-flag="orderFormFlag"
      :channel-pid="data.channelPid"
      :long-user-id="actionUserId"
      @cancel="cancel"
    />
  </div>
</template>

<script>
// complaintRecords
import { mapGetters, mapState } from 'vuex'
import { getStaffList } from '@/api/operate/staff-list'
import { getQuestionChildrenList, getBypids } from '@/api/operate/question'
import {
  updateSourceProblemV2,
  complaintInfo,
  complaintRecords,
  getProblemChannelId,
  acceptFirstRecord,
  modifyProblemAccept,
  modifyComplaintRemark,
  updateRecordsCpComent,
  getUserByUserNum,
  getBypid,
  checkAfterSaleNode,
  updateFlagSign,
  afterAcceptComplaint,
  newGetAfterSaleProblem,
  getExpressListByOutTradeNo,
  getLongUserId,
  getApprovalData,
  handleAfterSale,
  updateLogisticsV2,
  getCenterExpressId
} from '@/api/operate/complainNew'
import moment from 'moment'
import {
  doItForm,
  closeForm,
  afterSourceForm,
  editStaffUserForm,
  remarkForm,
  complaintHandleForm,
  approvalNoForm,
  refundYesForm,
  exchangeGoodsYesForm,
  replenishDispatchYesForm,
  actions as complaintFormAction
} from '../forms/complaintForm'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import optionList from '../forms/optionList'
import Clock from '../components/Clock'
import { getUserRemark } from '@/api/operate/createSug'
import { OPERATE_TYPE, USER_TYPE } from './config'
import forms, { formActions } from './form'
import AddBacklogDialog from './components/addBacklogDialog.vue'
import agreeApproval from './components/agreeApproval.vue'
import afterDetailelstep from './components/afterDeatilElStep.vue'
import snedMessage from './components/sendMessage.vue'
import logisticsTrajectory from './components/logisticsTrajectory'
import afterHistory from './components/afterhistory'
import claimsHistory from './components/claimsHistory'
import { findStaffByMobile, getCompensateCheck } from '@/api/myExamine'
import { asTypeNum } from './components/config'
import orderFormDrawer from './components/orderFormDrawer'
import createClaims from './components/createClaims/index.vue'
import { debounce } from 'lodash'
const options = [
  {
    label: '问题已解决',
    value: '1'
  },
  {
    label: '已电话沟通解决',
    value: '2'
  },
  {
    label: '用户已撤回投诉',
    value: '3'
  },
  {
    label: '其他原因',
    value: '4'
  }
]
const createUserMobile = getToken('userMobile')
const {
  work_order_second_map, // 工单类型对应二级分类
  work_order_classification_map // 二级对应的三级分类
} = window.baseData
export default {
  name: 'NewAfterSaleDetail',
  components: {
    Clock,
    AddBacklogDialog,
    agreeApproval,
    afterDetailelstep,
    snedMessage,
    logisticsTrajectory,
    orderFormDrawer,
    afterHistory,
    claimsHistory,
    createClaims
  },
  data() {
    return {
      logisticsId: '',
      logisticsCode: '',
      flagSignColordata: ['huiflag', 'redflag', 'greenflag', 'yellowflag'],
      recordSortFlag: '0',
      previewSrcList: [],
      createUserMobile,
      forms,
      formActions,
      optionList: optionList,
      OPERATE_TYPE,
      USER_TYPE,
      ToTeachval: {},
      id: this.$route.params.id,
      data: {
        userRemarkFourteen: ''
      },
      BOSS_HOST: '',
      BOSS_HOST_XX: '',
      type: [
        {
          value: 1,
          label: '待处理',
          color: 'warning'
        },
        {
          value: 2,
          label: '处理中',
          color: 'success'
        },
        {
          value: 3,
          label: '待回访',
          color: 'danger'
        },
        {
          value: 7,
          label: '已解决',
          color: 'success'
        },
        {
          value: 4,
          label: '评价满意',
          color: 'success'
        },
        {
          value: 5,
          label: '评价不满意',
          color: 'danger'
        },
        {
          value: 6,
          label: '无效投诉',
          color: 'danger'
        }
      ],
      allRecords: [],
      info: {
        title: '',
        instroduct: ''
      },
      orderFormFlag: false,
      backlogFlag: false,
      dialogNewVisible: false,
      sendMsgFlag: false,
      agreeApprovalFlag: false,
      logisticsTrajectoryFlag: false,
      afterHistoryFlag: false,
      claimsHistoryFlag: false,
      approvalFlag: false,
      claimsFlag: false,
      complaintForm: [],
      cpStatus: '',
      complaintNo: '',
      editTypeStatus: '',
      complaintFormAction: complaintFormAction({
        cancel: this.cancel,
        ensure: this.ensure
      }),
      staffList: [],
      oddNumber: '',
      problemTypeCache: [], // 问题列表缓存
      afterSaleProblemCache: [], // 售后类型缓存
      closeEnumTpye: false,
      handleComent: null,
      actionObj: {
        status: 0
      },
      uMobile: '',
      timeData: {},
      second_map: work_order_second_map,
      three_map: work_order_classification_map,
      subjectsObj: {
        1031: 'ART_APP', // 小熊用户
        1041: 'WRITE_APP', // 书法用户
        1071: 'DANCE_APP', // 小熊舞蹈用户
        1051: 'MUSIC_APP', // 小熊音乐
        1081: 'HANDWORK_APP' // 小熊手工
      },
      orderList: [],
      outTradeNoData: [],
      encryptionMobileIcone: true,
      logisticsDetailDto: {},
      approvalData: {},
      asTypeNum,
      spprovalStatus: '',
      centerExpressData: {},
      disturbMobile: ''
    }
  },
  computed: {
    workTypeFlag() {
      const { workType } = this.data
      if (workType && workType === 4) {
        // 新售后单
        return true
      } else {
        // 投诉单
        return false
      }
    },
    afterSaleSourceFlag() {
      const { afterSaleSource } = this.data
      if (afterSaleSource === 2) {
        // 如果是有赞商城的单子
        return false
      } else {
        // 不是有赞的单子其他
        return true
      }
    },
    // 控制回填单号显示
    refundTypeFlag() {
      const { newAsType, data: { logisticsId, workType }} = this
      if (workType === 4) {
        if (newAsType === '1') {
          // 如果newAsType是 REFUND_RETURN 1（退货退款） 的时候 则显示
          return true
        } else if (newAsType === '4' && logisticsId) {
          // 如果newAsType是 AFTER_SALE 4（申请售后） 并且有物流单号的时候 则显示
          return true
        } else {
          // 其他情况不显示
          return false
        }
      } else {
        return false
      }
    },
    typeData() {
      const { cpStatus } = this.data
      const { type } = this
      const arr = type.filter((item) => {
        return item.value === cpStatus
      })
      return arr[0]
    },
    getUser() {
      return `用户ID：${this.name} | ${createUserMobile}`
    },
    staffEnumData() {
      const obj = {
        '30': '供应链专员'
      }
      this.staffEnum.roles?.map((item) => {
        obj[item.value] = item.label
      })
      return obj
    },
    // 关闭投诉单的按钮限制
    closeEnumTpyeFlag() {
      let closeEnumTpyeFlag
      const { workTypeFlag, newAsType, data: { cpStatus, cpStatusSub, afterSaleType }} = this
      if (newAsType === '1' && cpStatus === 203) {
        // 当售后类型是退货退款的时候并且处理成功状态可显示关闭勾选
        closeEnumTpyeFlag = true
      } else if (newAsType === '4') {
        // 售后类型是申请售后
        closeEnumTpyeFlag = true
      } else if (['2', '3'].includes(newAsType) && cpStatusSub === 28) {
        // 换货、补货 （物流已发货）才可点击关闭工单
        closeEnumTpyeFlag = true
      } else {
        // 其他不显示
        closeEnumTpyeFlag = false
      }
      // afterSaleType是2并且是新售后单 或 投诉单的时候可显示关闭投诉单按钮
      return (afterSaleType === '2' && workTypeFlag) || closeEnumTpyeFlag
    },
    // 区分售后类型
    newAsType() {
      const { asType } = this.data
      let type = ''
      switch (asType) {
        case 'REFUND': // 仅退款
          type = '0'
          break
        case 'REFUND_RETURN': // 退货退款
          type = '1'
          break
        case 'EXCHANGE_GOODS': // 换货
          type = '2'
          break
        case 'REPLENISHMENT': // 补发
          type = '3'
          break
        case 'AFTER_SALE': // 申请售后
          type = '4'
          break
      }
      return type
    },
    // 商品信息的收货地址
    shippingAddress() {
      const { approvalData, centerExpressData } = this
      if (centerExpressData?.length !== 0 && centerExpressData?.addressId) {
        return approvalData?.addressList?.find(val => val.id === centerExpressData?.addressId) || {}
      } else {
        return {}
      }
    },
    actionUserId() {
     const { channelPid } = this.data
     if (['1031', '1041', '1051', '1071', '1081', '2011'].includes(channelPid)) {
       return this.data.longUserId
     } else {
       return this.data.userId
     }
    },
    // 特殊权限人
    specialPermission() {
      // 15101169315
      if (createUserMobile === '15101169315') {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['name', 'loadings', 'staffEnum']),
    ...mapState({
      BusinessListData: (state) => state.global.BusinessListData,
      TabList: (state) =>
        state.global.BusinessListData?.businessClassificationLIst,
      allChildLIst: (state) => state.global.BusinessListData?.allChildLIst,
      cpStatusData: (state) => state.global.cpStatusData
    }),
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
  created() {
    this.BOSS_HOST = process.env.VUE_APP_NEW_BOSS_HOST
    this.BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
    this.getComplain()
    this.getComplaintRecords()
    this.getStaffUserList()
    // this.getLogisticsCompanyFn()

    this.$store.dispatch('global/BusinessTypeSupplierNameList')
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.$store.dispatch('user/getBossInfo')
    this.$store.dispatch('global/getComplaintStatusEumDtoEnum')
  },
  methods: {
    parseIntFn(val) {
      if ([1, 4].includes(this.data.currency)) { // 人民币 课时
        return val
      } else if ([2, 3].includes(this.data.currency)) { // 小熊币 金币
        return parseInt(val)
      } else {
        return parseInt(val)
      }
    },
    // 控制手机号是否加密
    changeEncryptionMobileIcone(e) {
      this.encryptionMobileIcone = !e
    },
    // 文本\n转<br>
    brCpComent(val) {
      const text = val ? val.replace(/\n|\r\n/g, '<br>') : ''
      return text
    },
    tmMobile(val) {
      if (val === this.disturbMobile) {
        return val
      } else {
        return val?.replace(/^(.{3}).*(.{4})$/, '$1**$2')
      }
    },
    // 获取投诉人的手机号
    getUserRemarkFn() {
      const data = {
        channelPid: this.data.channelPid,
        userId: this.data.userId
      }
      getUserRemark(data).then((res) => {
        if (res.code === 0) {
          const { userMobile } = res.payload
          this.uMobile = userMobile
        }
      })
    },
    // 获取新售后的售后类型和售后问题
    getAfterSaleProblemFn(val, type, cid, pid, receivingType) {
      const { complaintAfterSaleEntity: { productCode, param }, complaintNo, afterSaleSource } = this.data
      const data = {
        channelPid: val,
        complaintNo: complaintNo,
        afterSaleSource: afterSaleSource,
        problemId: pid || '',
        channelIds: cid || '',
        productCode,
        expressCenterId: JSON.parse(param)?.expressCenterId
      }
      newGetAfterSaleProblem(data).then((res) => {
        const data = res.payload
        const arr = {
          problemIdArr: [],
          problemIdThreeArr1: [],
          problemIdThreeArr2: []
        }
        for (const key in data) {
          data[key].forEach((item) => {
            const obj = {}
            obj.label = item.cpType
            obj.value = item.problemIdNew
            obj.allowType = item.allowType
            obj.complaintType = item.complaintType
            obj.asType = item.asType
            if (item.allowType === 0 || this.specialPermission) {
              if (key === '0') {
                arr.problemIdArr.push(obj)
              }
            }
            if (key === '1') {
              arr.problemIdThreeArr1.push(obj)
            } else if (key === '2') {
              arr.problemIdThreeArr2.push(obj)
            }
          })
        }
        this.$nextTick(() => {
          if (type === 'problemIdThree') { // 售后原因
            this.$refs.complaintForm?.set({
              type: 'options',
              data: {
                [type]: String(receivingType) === '1' ? arr?.problemIdThreeArr1 : arr?.problemIdThreeArr2
              }
            })
          } else if (type === 'problemId') { // 售后类型
            this.$refs.complaintForm?.set({
              type: 'options',
              data: {
                [type]: arr?.problemIdArr
              }
            })
            this.afterSaleProblemCache = arr?.problemIdArr
          }
        })
      })
    },
    // 修改或保存快递公司和单号
    async updateLogisticsFn() {
      const {
        data: { complaintNo },
        logisticsId
      } = this
      const data = {
        complaintNo: complaintNo,
        logisticsId: logisticsId,
        handleStaffId: getToken('userId'),
        handleStaffName: getToken('cname')
      }
      const res = await updateLogisticsV2(data)
      if (res.code === 0) {
        this.$message({
          type: 'success',
          message: '成功'
        })
        this.getComplain()
        this.getComplaintRecords()
      } else {
        this.$message({
          type: 'error',
          message: '失败'
        })
      }
    },
    getStaffUserList() {
      getStaffList({
        pageNum: 0,
        pageSize: 1000
      }).then((res) => {
        if (res.code === 0) {
          const arr = []
          const data = res.payload || {}
          // arr = data.data || []
          data.data.map((item) => {
            if (item.status === 0) {
              arr.push({
                value: item.id,
                label: item.staffName,
                staffId: item.id,
                staffMobile: item.staffMobile,
                staffName: item.staffName
              })
            }
          })
          this.staffList = arr
        }
      })
    },
    acceptFirst() {
      const { id } = this
      const param = {
        complaintNo: id,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      acceptFirstRecord(param)
    },
    onBack() {
      this.$router.push({ name: 'OperateNewComplain' })
    },
    getComplain() {
      const complaintNo = this.id
      complaintInfo({ complaintNo }).then((res) => {
        if (res.code === 0) {
          this.data = res.payload
          this.logisticsCode = res.payload.logisticsCode
          this.logisticsCompany = res.payload.logisticsCompany
          this.logisticsId = res.payload.logisticsId
          this.turnTeachingFn()
          this.getApprovalData()
          this.getLongUserId()
          if (this.data.channelPid && this.data.userId) {
            this.getUserRemarkFn()
            //  一进页面识别是新售后就调用
              this.getAfterSaleProblemFn(
                this.data.channelPid,
                'problemId',
                res.payload.channelId
              )
          }
        } else {
          this.data = {}
        }
      })
    },
    // 获取学员id
    getXiaoxiongGetUser() {
      const userID = this.data.userId
      if ([...userID].length < 18) {
        getUserByUserNum({ userNum: userID, subject: 'ART_APP' })
          .then((res) => {
            const pid = res.payload.id || ''
            this.oprnUrl(pid)
          })
          .catch(() => {
            this.oprnUrl(userID)
          })
      } else {
        this.oprnUrl(userID)
      }
    },
    // 不同类型打开的地址不同
    oprnUrl(pid) {
      switch (this.data.channelPid) {
        case '1031':
          window.open(this.BOSS_HOST_XX + '/users/#/details/' + pid)
          break
        case '1041':
          window.open(this.BOSS_HOST_XX + '/write_app/#/details/' + pid)
          break
        case '1051':
          window.open(this.BOSS_HOST_XX + '/music_app/#/details/' + pid)
          break
        case '1081':
          window.open(this.BOSS_HOST_XX + '/handwork_app/#/details/' + pid)
          break
      }
    },
    getComplaintRecords(id) {
      const complaintNo = this.id
      const sort = this.recordSortFlag ? '0' : undefined
      complaintRecords({ complaintNo, sort }).then((res) => {
        if (res.code === 0) {
          let i = 1
          this.allRecords = res.payload.allRecords.map((item) => {
            item.sort = i++
            return item
          })
          // 过滤关闭的最后一条，用于复现立即处理的关闭投诉
          const closeArr = this.allRecords.filter(
            (item) => item.handleOperateType === 3
          )
          if (closeArr.length) {
            const { handleComent } = closeArr[closeArr.length - 1]
            this.closeEnumTpye = true
            if (handleComent) {
              options.forEach((item) => {
                if (handleComent === item.label) {
                  this.handleComent = item.value
                  // console.log(this.handleComent)
                }
              })
            }
          }
          // this.allRecords = obj.allRecords
        } else {
          this.allRecords = []
        }
      })
    },
    tableAction(name, type) {
      const { data } = this
      const row = data
      switch (name) {
        case 'doItNow': // 立即处理操作
          this.doItNowFn(row)
          this.acceptFirst()
          break
        case 'closeComplaint': // 关闭投诉
          this.closeComplaintFn(row)
          break
        case 'editType': // 修改售后类型
          if (row.cpStatus === 1 || (row.cpStatus === 2 && [13, 20, 23, 27].includes(row.cpStatusSub))) {
            this.editTypeFn(row)
            this.acceptFirst()
            this.getCenterExpressId()
          } else {
           this.$message({
             type: 'error',
             message: '该工单非客服处理节点不可修改售后类型'
           })
          }
          break
        case 'editStaffUser': // 修改操作人
          this.editStaffUser(row)
          break
        case 'sendNote': // 发短信
          this.sendNoteFn(row)
          break
        case 'addBacklog': // 添加待办
          this.addBacklogFn(row)
          break
        case 'approvalClaims': // 创建赔付审批
          this.approvalClaimsFn(row)
          break
      }
    },
    tranTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    ensure() {
      this.$refs.complaintForm.defaultAction('submit')
    },
    cancel() {
      this.agreeApprovalFlag = false
      this.dialogNewVisible = false
      this.backlogFlag = false
      this.sendMsgFlag = false
      this.logisticsTrajectoryFlag = false
      this.afterHistoryFlag = false
      this.claimsHistoryFlag = false
      this.approvalFlag = false
      this.orderFormFlag = false
      this.claimsFlag = false
      this.complaintNo = null // 投诉单号
      this.cpStatus = null
      this.editTypeStatus = null
      this.oddNumber = ''
      this.info = {
        title: '',
        instroduct: ''
      }
    },
    // 发短信
    sendNoteFn(row) {
      this.complaintNo = row.complaintNo
      this.sendMsgFlag = true
    },
    // 查看轨迹
    openlogisticsTrajectoryFn(row) {
    this.logisticsDetailDto = row
    this.logisticsTrajectoryFlag = true
    },
    // 添加备注
    addRemark(val) {
      this.editTypeStatus = 'addRemark'
      this.info = {
        title: val ? '编辑文本备注' : '添加文本备注',
        instroduct: '用户备注信息，不会显示给用户'
      }
      this.complaintForm = remarkForm
      this.dialogNewVisible = true
      this.$nextTick(() => {
        if (val) {
          this.$refs.complaintForm.recoveryForm({ remark: val })
        }
      })
      // modifyComplaintRemark
    },
    setRemark(val) {
      const { complaintNo } = this.data
      const { remark } = val
      const param = {
        complaintNo,
        remark
      }
      modifyComplaintRemark(param).then((res) => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
        }
      })
    },
    editHandle(id, val, cpComentUser) {
      this.oddNumber = id
      this.editTypeStatus = 'editComplaint'
      this.info = {
        title: '修改投诉处理内容',
        instroduct: '请确认处理内容无误后保存修改内容，请勿频繁操作。'
      }
      this.complaintForm = complaintHandleForm
      this.dialogNewVisible = true
      this.$nextTick(() => {
        if (val) {
          this.$refs.complaintForm.recoveryForm({
            cpComent: val,
            cpComentUser: cpComentUser
          })
        }
      })
      // complaintHandleForm
    },
    setHandle(val) {
      const { oddNumber } = this
      const param = {
        id: oddNumber,
        cpComent: val.cpComent,
        cpComentUser: val.cpComentUser
      }
      updateRecordsCpComent(param).then((res) => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
        }
      })
    },
    // 修改售后类型
    editTypeFn(row) {
      this.editTypeStatus = 'editType'
      this.info = {
        title: '确定修改售后类型'
      }
      const arr = [
        'problemId', // 售后类型
        'problemIdThree' // 售后原因
      ]
      arr.map((res) => {
        if (Array.isArray(row[res])) {
          row[res]
        } else if (row[res]) {
          if (row[res] === '0') row[res] = ''
          else row[res] = row[res]?.split(',')
        }
      })
      this.complaintForm = afterSourceForm
      // 售后途径不可选
      this.$nextTick(() => {
        this.$refs.complaintForm?.set({
          type: 'attr',
          data: {
            channelId: { disabled: true }
          }
        })
      })
      this.complaintNo = row.complaintNo
      this.dialogNewVisible = true
      // 根据售后业务线获取售后途径
      getBypid({ pid: row.channelPid }).then((res) => {
        this.setChannel(res.payload, 'channelId', 'form')
      })
      this.$nextTick(() => {
      // 售后类型回显
        this.$refs.complaintForm.recoveryForm({
          channelId: row.channelId, // 售后途径
          receivingType: String(row.complaintAfterSaleEntity?.receivingType) // 是否收到货
        })
       // 新售后 保证已停用的问题在修改售后类型时不会回显
       const afterSaleValueFlag = this.afterSaleProblemCache.some(
        (v) => v.value === row.problemId[0] && v.problemStatus === 0)
        if (afterSaleValueFlag) {
         this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              problemId: this.afterSaleProblemCache
            }
          })
          this.$refs.complaintForm.recoveryForm({
            problemId: row.problemId[0], // 售后类型
            problemIdThree: row.problemIdThree[0]?.toString() // 售后原因
          })
        } else {
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              problemId: this.afterSaleProblemCache
            }
          })
        }
      })
    },
    getSelectList(val) {
      const { problemPid, problemId, problemIdThree, problemIdFour } = val
      this.getProblemChild(problemPid, 'problemId')
      this.getProblemChild(problemId?.toString(), 'problemIdThree')
      this.getProblemChild(problemIdThree?.toString(), 'problemIdFour')
      this.getProblemChild(problemIdFour?.toString(), 'problemIdFive')
    },
    getQuestionChildrenListFn(val, key, type) {
      getQuestionChildrenList({ pid: val }).then((res) => {
        const data = res.payload
          ? res.payload
              ?.filter((v) => v?.problemStatus?.toString() !== '1')
              ?.map((v) => {
                v.id = v.problemIdNew
                return v
              })
          : []
        this.problemTypeCache = res.payload
        this.setChannel(data, key, type)
      })
    },
    // 立即处理按钮
    doItNowFn(row) {
      const {
        newAsType,
        data: {
          isConfirm
        }
      } = this
      this.editTypeStatus = 'doItNow'
      this.info = {
        title: '记录售后处理内容',
        instroduct: '请输入售后处理内容'
      }
      this.complaintForm = doItForm(this.remoteMethodSaleOrderId)
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm?.set({
          type: 'visible',
          data: {
            workType: false,
            refundType: !!(newAsType === '1' && isConfirm === 0),
            closeEnumTpye: this.closeEnumTpyeFlag
          }
        })
      })
      this.complaintNo = row.complaintNo // 投诉单号
      this.cpStatus = '2' // 状态 或者为 3（点击关闭）
      // 复现关闭
      if (this.closeEnumTpye) {
        const handleComent = this.handleComent
        this.$nextTick(() => {
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: {
              closeEnumTpye: ['1'],
              closeEnum: handleComent
            }
          })
        })
      }
    },
    // 获取小熊的长id
    async getLongUserId() {
      const res = await getLongUserId({ userId: this.data.userId })
      const { code, payload } = res
      if (code === 0) {
        this.data.longUserId = payload
        this.getCenterExpressId()
        return payload
      }
    },
  //   查看原投诉单
  lookWorkOrder() {
    const { relationComplaintNo } = this.data
    window.open(`${location.protocol}//${location.host}/workOrder/detail/${relationComplaintNo}`)
  },
    // 转售后拿订单号查物流
    async remoteMethodSaleLogisticsId(val) {
      if (Object.keys(this.subjectsObj).includes(this.data.channelPid)) {
        // 小熊业务线拿关联订单号获取物流单号
        const res = await getExpressListByOutTradeNo({
          outTradeNo: val
        })
        const { code, payload } = res
        if (code === 0) {
          this.outTradeNoData = payload.map((val) => {
            return {
              label: val.centerExpressId,
              value: val.id
            }
          })
        }
      } else {
        // 1v1和小班课直接拿关联订单号映射出对应的物流单号不用接口获取
        this.outTradeNoData = this.orderList
          .filter((i) => i.id === val)
          .map((j) => {
            return {
              label: j.expressCenterId,
              value: j.id
            }
          })
      }
      this.$nextTick(() => {
        this.$refs.complaintForm?.set({
          type: 'options',
          data: {
            afterSaleLogisticsId:
              this.outTradeNoData[0].label &&
              this.outTradeNoData[0].label !== '0'
                ? this.outTradeNoData
                : [] // 若物流单号为空或为0（待发货的暂无物流单号），物流数据为空数组
          }
        })
      })
    },
    // 关闭投诉
    closeComplaintFn(row) {
      this.info = {
        title: '确定关闭投诉',
        instroduct:
          '请确定投诉问题已处理，关闭后用户将对您的处理服务进行满意度评价！'
      }
      this.complaintForm = closeForm
      this.dialogNewVisible = true

      this.complaintNo = row.complaintNo // 投诉单号
      this.cpStatus = '3' // 状态 或者（点击关闭）
    },
    // 获取问题分类列表
    getProblemChannel(val, key, type) {
      return getProblemChannelId({ channelId: val }).then((res) => {
        const data = res.payload
          ? res.payload
              ?.filter((v) => v?.problemStatus?.toString() !== '1')
              ?.map((v) => {
                v.id = v.problemIdNew
                return v
              })
          : []
        this.problemTypeCache = res.payload
        this.setChannel(data, key, type)
      })
    },
    editStaffUser(row) {
      this.editTypeStatus = 'editStaffUser'
      const { staffList, data } = this
      this.info = {
        title: '确定转给他人',
        instroduct: '将问题由当前处理人转给他人处理'
      }
      this.complaintForm = editStaffUserForm
      this.dialogNewVisible = true
      this.$nextTick(() => {
        this.$refs.complaintForm.recoveryForm({
          oldId: data.currentStaffId + ''
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            oldId: staffList
          }
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            id: staffList
          }
        })
      })
    },
    setStaffUser(val) {
      const { staffList, data } = this
      const arr = staffList.filter((item) => item.value === val.id)
      const {
        staffId: newStaffId,
        staffMobile: newStaffMobile,
        staffName: newStaffName
      } = arr[0]
      const param = {
        complaintNo: data.complaintNo,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile'),
        newStaffId,
        newStaffMobile,
        newStaffName
      }
      modifyProblemAccept(param).then((res) => {
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
        }
      })
    },
    // 转化数据
    tranFormData(data) {
      return data.map((item) => {
        return {
          label: item.cpSource || item.cpType,
          value: item.id
        }
      })
    },
    // 设置投诉来源
    setChannel(val, key, type) {
      this.$nextTick(() => {
        if (type === 'form') {
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [key]: this.tranFormData(val)
            }
          })
        }
      })
    },
    // 提交表单
    submitForm(val) {
      const { editTypeStatus, complaintNo, cpStatus } = this
      if (val.imgUrl) {
        const arr = []
        const { imgUrl } = val
        if (imgUrl.length > 0) {
          imgUrl.forEach((item) => {
            arr.push(item.url)
          })
          val.imgUrl = arr.join(',')
        } else {
          val.imgUrl = undefined
        }
      }
      if (val.videoUrl) {
        val.videoUrl = val.videoUrl.url || ''
      } else {
        val.videoUrl = ''
      }
      if (editTypeStatus === 'editType') {
        // 修改售后类型
        this.setQuestion({ ...val, complaintNo })
      } else if (editTypeStatus === 'editStaffUser') {
        // 修改操作人
        this.setStaffUser(val)
      } else if (editTypeStatus === 'addRemark') {
        this.setRemark(val)
      } else if (editTypeStatus === 'editComplaint') {
        this.setHandle(val)
      } else {
        var status = cpStatus
        if (val.closeEnumTpye && val.closeEnumTpye.length > 0) {
          status = '3'
        }
        const { closeEnumNew } = val
        if (closeEnumNew || closeEnumNew === '') {
          val.closeEnum = closeEnumNew
          delete val.closeEnumNew
        }

        if (cpStatus === '6' && val.cpStatusRadio) {
          status = val.cpStatusRadio
          if (val.repeatReason) {
            val.invalidEnum = val.repeatReason
            delete val.repeatReason
          }
          delete val.cpStatusRadio
        }
        const outTradeNoObj = this.outTradeNoData?.find(
          (i) => i.centerExpressId === val.centerExpressId
        )
        this.handleData({
          ...val,
          sync: val.sync === true ? '1' : '0', // 同步开关按钮
          workType: val.workType === '6' ? 4 : val.workType,
          complaintNo,
          cpStatus: status,
          expressId: outTradeNoObj?.value,
          afterSaleLogisticsId: outTradeNoObj?.label,
          currentStaffId: getToken('userId'),
          currentStaffName: getToken('cname'),
          currentStaffMobile: getToken('userMobile')
        })
      }
    },
    // 投诉表单变化
    changeNewForm(val, oldVal) {
      if (val.channelPid !== oldVal.channelPid && oldVal.channelPid) {
        // 根据投诉来源获取投诉途径
        getBypid({ pid: val.channelPid }).then((res) => {
          this.setChannel(res.payload, 'channelId', 'form')
          this.$refs.complaintForm.recoveryForm({
            channelId: '',
            problemPid: '',
            problemId: []
          })
        })
        this.getProblemChild(val.channelPid, 'problemPid')
      }

      if (
        Object.keys(val)?.length === 3 &&
        (Object.keys(val).includes('invalidEnum') ||
          Object.keys(val).includes('repeatReason')) &&
        val.cpStatusRadio !== oldVal.cpStatusRadio
      ) {
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            repeatReason: val.cpStatusRadio === '61'
          }
        })
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            invalidEnum: val.cpStatusRadio === '60'
          }
        })
      }
      if (val.problemPid !== oldVal.problemPid && oldVal.problemPid) {
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            problemId: undefined
          }
        })
        this.getQuestionChildrenListFn(val.problemPid, 'problemId', 'form')
      }
      if (val.closeEnumTpye && val.closeEnumTpye[0] === '1') {
        // this.cpStatus = '3'
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            closeEnum: true
          }
        })
      } else {
        // this.cpStatus = '2'
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            closeEnum: false
          }
        })
      }
      const {
        channelId,
        problemPid,
        problemId,
        receivingType
      } = val
      if (problemPid && problemPid !== oldVal?.problemPid) {
        this.getProblemChild(problemPid, 'problemId')
      } else if (
        (problemId &&
        problemId !== oldVal?.problemId) ||
        (receivingType &&
        receivingType !== oldVal?.receivingType)
      ) {
        // 修改售后来源时的售后类型发生改变触发请求获取对应的售后问题
        this.getAfterSaleProblemFn(
          this.data.channelPid,
          'problemIdThree',
          channelId,
          problemId,
          receivingType
        )
        if ((problemId !== oldVal?.problemId && oldVal?.problemId) || (receivingType !== oldVal?.receivingType && oldVal?.receivingType)) {
          this.$refs.complaintForm.recoveryForm({
            problemIdThree: ''
          })
        }
      }
    },
    // 获取子问题
    getProblemChild(val, key) {
      const params = {
        pids: val
      }
      getBypids(params).then((res) => {
        const data = res.payload || []
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            [key]: this.tranFormChildData(data)
          }
        })
      })
    },
    tranFormChildData(data) {
      return data.map((item) => {
        return {
          label: item.problemStatus ? '（内部）' + item.cpType : item.cpType,
          value: item.problemIdNew
        }
      })
    },
    // 调取处理接口
    handleData(data) {
        // 新售后工单的立即处理
        afterAcceptComplaint(data).then((res) => {
          this.cancel()
          this.$message.success('操作成功')
          this.getComplain()
          this.getComplaintRecords()
        })
    },
    // 特殊限制人员
    actionExpiredFn(val, callBack) {
      const { centerExpressData, afterSaleProblemCache } = this
      const asTypeFind = afterSaleProblemCache.find(i => i.value === val.problemId)
      const asTypeMap = {
        'REFUND_RETURN': 1,
        'REFUND': 2,
        'EXCHANGE_GOODS': 3,
        'REPLENISHMENT': 4
      }
      const asType = asTypeMap[asTypeFind?.asType]
      const overtimeAfter = centerExpressData.expiredFlagMap[asType] // 超售后期 true
      let alertText = ''
      // 商品的售后过售后期
      if (overtimeAfter) {
        alertText = '该用户已过售后期，确认继续售后吗?'
      } else if (asTypeFind?.allowType !== 0) {
        // 不支持的售后类型
        alertText = `该用户不支持${asTypeFind?.label}售后类型，确认继续售后吗`
      } else {
        callBack()
      }

      if (!alertText) return false
      // 提示消息
      this.$confirm(alertText, '提交确认', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        callBack()
      })
    },
    // 修改售后类型
    setQuestion(val) {
      const arr = [
        'problemId',
        'problemIdThree'
      ]
      arr.map((res) => {
        if (Array.isArray(val[res])) {
          val[res] = val[res].toString()
        } else if (val[res]) {
          val[res]
        }
      })
      const data = {
        ...val,
        businessId: val.channelPid ? val.channelPid?.slice(0, 3) : '',
        staffId: getToken('userId'),
        staffName: getToken('cname'),
        staffMobile: getToken('userMobile'),
        workType: 4,
        channelPid: this.data.channelPid
      }
      // 特殊权限人可提示
      if (this.specialPermission) {
        this.actionExpiredFn(data, () => {
          data.exceedStandard = 1
          this.updateSourceProblemV2Fn(data)
        })
      } else {
        data.exceedStandard = 0
        this.updateSourceProblemV2Fn(data)
      }
    },
    updateSourceProblemV2Fn(data) {
      // 修改售后类型接口
      updateSourceProblemV2(data).then((res) => {
        this.cancel()
        this.$message.success('操作成功')
        this.acceptFirst()
        this.getComplain()
        this.getComplaintRecords()
        this.getStaffUserList()
      })
    },
    onFormChange(val, oldVal) {
      // 质检工单默认文案
      if (
        (val.problemOneLevel !== oldVal.problemOneLevel &&
          oldVal.problemOneLevel) ||
        (val.problemOneLevel !== oldVal.problemOneLevel &&
          val.problemOneLevel === '2')
      ) {
        const artServiceLine = ['1031', '1041', '1051', '1071', '1081']
        const oneVoneorClassServiceLine = ['1011', '1012', '1021', '1022']
        let second_mapData_2 = []
        let second_mapData_4 = []
        let second_mapData_5 = []
        let three_mapData_51 = []
        if (artServiceLine.includes(this.data.channelPid)) {
          // 这5个业务线 二级分类： 投诉销售 投诉教辅 投诉客服
          second_mapData_4 = work_order_second_map['4'].filter((item) =>
            ['51', '52', '53'].includes(item.value)
          )
          second_mapData_5 = work_order_second_map['5'].filter((item) =>
            ['101'].includes(item.value)
          )
          three_mapData_51 = work_order_classification_map['51']
          if (this.data.channelPid === '1031') {
            // 小熊美术业务线显示小熊美术app
            second_mapData_2 = work_order_second_map['2'].filter((item) =>
              ['11'].includes(item.value)
            )
          } else if (this.data.channelPid === '1051') {
            // 小熊音乐业务线显示小熊音乐app
            second_mapData_2 = work_order_second_map['2'].filter((item) =>
              ['14'].includes(item.value)
            )
          } else {
            // 其他业务线显示小熊boss和其他
            second_mapData_2 = work_order_second_map['2'].filter((item) =>
              ['12', '13'].includes(item.value)
            )
          }
        } else if (oneVoneorClassServiceLine.includes(this.data.channelPid)) {
          // 小班课 1v1 二级分类：投诉销售 投诉班主任 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter((item) =>
            ['51', '54', '53', '55'].includes(item.value)
          )
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(
            (item) => !['5105'].includes(item.value)
          )
        } else if (this.data.channelPid === '1061') {
          // 书画院 二级分类：投诉销售 投诉学管 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter((item) =>
            ['51', '56', '53', '55'].includes(item.value)
          )
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(
            (item) => !['5105'].includes(item.value)
          )
        }
        this.second_map = {
          2: second_mapData_2,
          4: second_mapData_4,
          5: second_mapData_5
        }
        this.three_map = {
          ...work_order_classification_map,
          51: three_mapData_51
        }

        // 默认出现工单类型展示二级分类
        if (['2', '4', '5'].includes(val.problemOneLevel)) {
          this.$refs.workOrderRef?.set({
            type: 'visible',
            data: {
              problemTwoLevel: true,
              problemThreeLevel: true
            }
          })
          this.$refs.workOrderRef?.set({
            type: 'options',
            data: {
              problemTwoLevel: this.second_map[val.problemOneLevel]
            }
          })
          this.$refs.workOrderRef?.set({
            type: 'defaultVal',
            data: {
              problemTwoLevel: this.second_map[val.problemOneLevel][0]?.value
            }
          })
          // 质检工单默认文案
          if (val.problemOneLevel === '4') {
            this.$refs.workOrderRef?.set({
              type: 'defaultVal',
              data: {
                cpComent:
                  '示例：销售 小红 在 2021.11.11 10:00 与用户沟通，擅自解散群'
              }
            })
          } else {
            this.$refs.workOrderRef?.set({
              type: 'defaultVal',
              data: {
                cpComent: `示例：\n 用户设备：红米手机；Redmi K20 Pro \n APP版本号/浏览器版本：V2.8.0\n 操作异常时间：2021.09.12 12:01\n 操作路径：首页-免费领课-分享海报至朋友圈得赠课,点击分享报错\n 报错信息: 网络异常 `
              }
            })
          }
        } else {
          this.$refs.workOrderRef?.set({
            type: 'visible',
            data: {
              problemTwoLevel: false,
              problemThreeLevel: false
            }
          })
        }
        if (['4', '5'].includes(val.problemOneLevel)) {
          this.$refs.workOrderRef?.set({
            type: 'visible',
            data: {
              dingUserName: true
            }
          })
        } else {
          this.$refs.workOrderRef?.set({
            type: 'visible',
            data: {
              dingUserName: false
            }
          })
        }
      }

      // 二级三级联动效果
      if (
        (val.problemTwoLevel !== oldVal.problemTwoLevel &&
          oldVal.problemTwoLevel) ||
        (val.problemTwoLevel !== oldVal.problemTwoLevel && val.problemTwoLevel)
      ) {
        this.$refs.workOrderRef?.set({
          type: 'options',
          data: {
            problemThreeLevel: this.three_map[val.problemTwoLevel]
          }
        })
        if (this.three_map[val.problemTwoLevel]?.length !== 0) {
          this.$refs.workOrderRef?.set({
            type: 'defaultVal',
            data: {
              problemThreeLevel: this.three_map[val.problemTwoLevel][0]?.value
            }
          })
        }
      }
    },
   // 打开创建赔付审批弹出
    approvalClaimsFn: debounce(async function(row) {
      await this.getCheck(() => {
      this.claimsFlag = true
      })
    }, 500),
    // 弹出添加待办信息
    addBacklogFn(row) {
      this.complaintNo = row.complaintNo
      this.backlogFlag = true
    },
    // 点击查看赔付审批详情 跳入我的审批
    lookClaims() {
     if (this.actionUserId && this.data.channelPid) {
       const openHerf = this.$router.resolve({
         path: '/claimsApproval',
         query: {
           userId: this.actionUserId,
           channelPid: this.data.channelPid
         }
        })
        window.open(openHerf.href, '_blank')
     }
    },
    // 查看当前客服是否在小熊boss上有账号
    getFindStaffByMobile(callBack) {
      const loading = this.$loading({
        lock: true
      })
      findStaffByMobile({
        mobile: getToken('userMobile')
      })
        .then((res) => {
          loading.close()
          const { payload } = res
          if (payload?.id) {
            callBack()
          } else {
            this.$alert(
              '当前账号与小熊boss后台账号手机号不一致，请先修改账号~',
              '',
              {
                confirmButtonText: '知道了',
                dangerouslyUseHTMLString: true
              }
            )
          }
        })
        .catch((err) => {
          this.$message.error(err, '获取失败')
        })
    },
    // 获取当前节点流程
    async turnTeachingFn() {
      const res = await checkAfterSaleNode({
        complaintNo: this.data.complaintNo
      })
      const {
        code,
        payload
      } = res
      if (code === 0) {
        this.timeData = {
          ...payload
        }
      }
    },
    // 列表点击循环变颜色
    clickFlag() {
      const { flagSign, complaintNo } = this.data
      const index =
        this.flagSignColordata[
          flagSign < 0 || flagSign >= 3 ? 0 : flagSign + 1
        ]
      this.data.flagSign = this.flagSignColordata.indexOf(index)
      const indexflagSign = flagSign < 0 || flagSign >= 3 ? 0 : flagSign + 1
      // 改变小彩旗的颜色
      updateFlagSign({
        complaintNo: complaintNo,
        flagSign: indexflagSign
      }).then((res) => {
        console.log(res, 'res')
      })
    },
    // 排序记录
    recordSort(val) {
      this.recordSortFlag = !val
      this.getComplaintRecords()
    },
    // 复制UID
    handLeCopy(uid) {
      const oInput = document.createElement('input')
      oInput.value = uid
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    openHistoryFlag(val) {
      if (val === 'after') {
        this.afterHistoryFlag = true
      } else {
        this.claimsHistoryFlag = true
      }
    },
    // 详情底部的发起审批拒绝
    handleApproval(name) {
      const { data } = this
      const row = data
      switch (name) {
        case 'automaticRefundNo': // 拒绝退款
          this.info.title = '拒绝仅退款'
          this.spprovalStatus = 'automaticRefundNo'
          this.openApprovalFn(row)
          break
        case 'automaticRefundYes':
          this.info.title = '同意退款'
          this.info.instroduct = '请先确认物流是否拦截，拦截物流将生成供应链审批；不拦截物流同意退款后，退款将自动原路退回用户付款账户'
          this.spprovalStatus = 'automaticRefundYes'
          this.automaticRefundYes(row)
          break
        case 'returnMoneyNo': // 拒绝退货退款
          this.info.title = '拒绝退货退款'
          this.spprovalStatus = 'returnMoneyNo'
          this.openApprovalFn(row)
          break
        case 'returnMoneyYes': // 同意退货退款
          this.info.title = '同意退货退款'
          this.info.instroduct = '提交后，用户端展示修改快递单号入口'
          this.spprovalStatus = 'returnMoneyYes'
          this.openApprovalFn(row)
          break
        case 'receivingNoteNo': // 拒绝收货
          this.info.title = '拒绝收货'
          this.info.instroduct = '拒绝后，用户端展示修改快递单号入口，支持重新填写寄回单号'
          this.spprovalStatus = 'receivingNoteNo'
          this.openApprovalFn(row)
          break
        case 'supplyApproval': // 重新发起供应链审批
          this.info.title = '重新发起供应链审批'
          this.info.instroduct = '提交后，供应链后台将重新生成审核任务'
          this.spprovalStatus = 'supplyApproval'
          this.openApprovalFn(row)
          break
        case 'exchangeGoodsNo': // 拒绝换货
          this.info.title = '拒绝换货'
          this.spprovalStatus = 'exchangeGoodsNo'
          this.openApprovalFn(row)
          break
        case 'exchangeGoodsYes':
          this.info.title = '同意换货'
          this.info.instroduct = '同意换货后系统将锁定该商品库存，用户端展示寄回单号入口；待供应链收货后，将自动将换货商品发出'
          this.spprovalStatus = 'exchangeGoodsYes'
          this.exchangeGoodsYes(row)
          break
        case 'replenishDispatchNo': // 拒绝补发
          this.info.title = '拒绝补发'
          this.spprovalStatus = 'replenishDispatchNo'
          this.openApprovalFn(row)
          break
        case 'replenishDispatchYes':
          this.info.title = '同意补发'
          this.spprovalStatus = 'replenishDispatchYes'
          this.replenishDispatchYes(row)
          break
        case 'emitReplenishDispatch': // 修改补发
          this.info.title = '修改补发'
          this.spprovalStatus = 'emitReplenishDispatch'
          this.replenishDispatchYes(row)
          break
      }
    },
    // 获取审批历史
    getApprovalData() {
      const { complaintNo } = this.data
      getApprovalData({ complaintNo }).then(res => {
        const { code, payload } = res
        if (code === 0) {
          this.approvalData = payload
        }
        this.getComplaintRecords()
      })
    },
    openApprovalFn(row) {
      const { spprovalStatus } = this
      this.complaintForm = approvalNoForm
      if (['returnMoneyYes', 'receivingNoteNo', 'supplyApproval'].includes(spprovalStatus)) {
        this.$nextTick(() => {
          this.$refs.complaintForm?.set({
            type: 'attr',
            data: {
              supplement: { placeholder: '内容将同步用户！' }
            }
          })
        })
      }
      this.approvalFlag = true
    },
    // 同意退款
    automaticRefundYes() {
      this.complaintForm = refundYesForm
      this.agreeApprovalFlag = true
    },
    // 同意换货
    exchangeGoodsYes() {
      this.complaintForm = exchangeGoodsYesForm
      this.agreeApprovalFlag = true
    },
    // 同意补发
    replenishDispatchYes() {
      this.complaintForm = replenishDispatchYesForm
      this.agreeApprovalFlag = true
    },
    // 审批表单
    submitApprovalForm: debounce(async function(values) {
      const loading = this.$loading({
        lock: true
      })
      const { data: { asType, complaintNo }, spprovalStatus, approvalData } = this
      const data = {
        ...values,
        id: approvalData.id ? approvalData.id : '',
        complaintNo: complaintNo,
        type: asTypeNum[asType],
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      // 重新发起供应链审批&修改补发=重审
      if (['supplyApproval', 'emitReplenishDispatch'].includes(spprovalStatus)) {
        data.status = 3
      } else if (['returnMoneyYes'].includes(spprovalStatus)) { // 同意
        data.status = 1
      } else { // 拒绝
        data.status = 2
      }
      // 售后取消 拒绝退款/拒绝退货退款/拒绝换货/拒绝补发
      if (['automaticRefundNo', 'returnMoneyNo', 'exchangeGoodsNo', 'replenishDispatchNo'].includes(spprovalStatus)) {
        data.cancelStatus = 0
      } else {
        data.cancelStatus = 1
      }
      await handleAfterSale(data).then(res => {
        loading.close()
        const { code } = res
        if (code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
        this.approvalFlag = false
          this.getComplain()
          this.getApprovalData()
      })
    }, 500),
    // 查看订单抽屉
    lookOrderForm() {
      this.$nextTick(async() => {
        this.orderFormFlag = true
      })
    },
    // 是否支持创建赔付单
    async getCheck(callBack) {
      const { workTypeFlag, data } = this
       const loading = this.$loading({
          lock: true
        })
         getCompensateCheck({
          channelPid: data.channelPid,
          orderId: workTypeFlag ? data.orderId : '0',
          userId: this.actionUserId
        }).then(res => {
           loading.close()
           const { payload } = res
           if (payload) {
               callBack()
           } else {
             this.$alert('该用户非在读学员，不可创建赔付单~', '', {
               confirmButtonText: '知道了',
               dangerouslyUseHTMLString: true
             })
           }
        }).catch(err => {
          loading.close()
          this.$message.error(err, '获取失败')
        })
    },
    // 当前售后商品的详细信息/支持的售后类型/物流id...
    getCenterExpressId() {
      const { actionUserId, data: { channelPid, source, afterSaleId }} = this
      const businessTypeObj = {
        '1011': 'ONETOONE',
        '1012': 'ONETOONE',
        '1021': 'ONETOONE',
        '1022': 'ONETOONE',
        '1031': 'BEAR',
        '1041': 'BEAR',
        '1051': 'BEARMUSIC',
        '1061': 'BEAR',
        '1071': 'BEAR',
        '1081': 'BEAR',
        '2011': 'BEAR'
      }
      const afterSaleIds = afterSaleId.split(';')
      // source 1=积分商城 2=小熊
      const data = {
        shop: source === 1,
        businessType: businessTypeObj[channelPid],
        expressId: afterSaleIds[2],
        productCode: afterSaleIds[1],
        userId: actionUserId,
        orderId: afterSaleIds[0]
      }
      getCenterExpressId(data).then(res => {
        const { code, payload } = res
        if (code === 200) {
          this.centerExpressData = payload
        }
      })
    },
    // 判断电话赋值
    isDisturbMobile(e) {
      if (e === this.disturbMobile) {
        this.disturbMobile = ''
      } else {
        this.disturbMobile = e
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
}
.complain-detail_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.step_style {
  margin-top: 20px;
  width: 100%;
  padding: 0 20px;
}
.complain-detail {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.complain-detail-list {
  li {
    font-size: 14px;
    padding: 6px;
    margin-bottom: 2px;
  }
  .logistics-style {
    display: flex;
  }
  .complain-detail-list-tag {
    font-weight: 500;
    padding-right: 20px;
  }
  .complain-detail-text {
    margin-right: 100px;
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
.complain-detail-list-user {
  li {
    font-size: 14px;
    padding: 6px;
    margin-bottom: 18px;
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
.complain-act {
  width: 500px;
  display: flex;
  align-items: center;
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
  min-height: 36px;
  border-radius: 4px;
  margin: 14px 0 0 0;
  span {
    padding: 10px;
    line-height: 18px;
    word-break: break-all;
    word-wrap: break-word;
  }
}
.complain-act-resolve-main {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.userservice{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  font-size: 14px;
  padding: 2px;
  display: inline-block;
}
.complain-act-resolve {
  width: 500px;
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
  min-height: 36px;
  padding: 10px;
  border-radius: 4px;
  margin: 14px 0 0 0;
  p{
    // padding: 10px 0;
    margin: 0px;
    line-height: 18px;
  }
}
.complain-act-resolve-edit {
  margin-left: 12px;
  margin-top: 14px;
  cursor: pointer;
  font-size: 20px;
  color: #409eff;
}
.styleIcon {
  cursor: pointer;
  font-size: 16px;
  color: #409eff;
}
.detail-action {
  text-align: right;
  margin-bottom: 20px;
  button {
    margin-bottom: 10px;
  }
}
.detail-action-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sort-icon {
  margin-left: 357px;
  display: inline-block;
  height: 100%;
  font-size: 18px;
  .sorts {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-size: 24px;
    color: #bfbfbf;
    .drop {
      position: relative;
      top: -14px;
    }
  }
  .sortactive {
    color: #409eff;
  }
}
.complaint-form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
    .form-item-element {
      width: 100% !important;
    }
  }
}
.form-item {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
}
.app-content-footer {
  width: 100%;
  height: 70px;
  background: #eee;
  position: fixed;
  bottom: 0px;
  text-align:  center;
  line-height: 70px;
  /deep/ .el-button--mini {
    font-size: 20px;
    margin: 10px;
  }
}
.commodity-info {
  display: flex;
  .commodity-list {
    .commodity-title{
      font-weight: 500;
      margin-bottom: 10px;
    }
    .commodity-detail {
      margin-bottom: 2px;
      padding: 8px 0px 8px 10px;
      font-size: 14px;
    }
  }
  .commodity-border {
    border-left: 1px solid #ccc;
    padding-left: 30px;
  }
  .commodity-info-tag {
    font-size: 14px;
    margin-right: 10px;
  }
  .commodity-detail-list {
    display: flex;
    padding: 8px 0px 8px 10px;
    font-size: 14px;
    .el-input {
      width: 35%;
    }
    .el-select {
      width: 35%;
    }
    .commodity-detail-remark {
      width: 300px;
    }
    .commodity-logisticsCode{
      width: 300px;
      position: relative;
      bottom: 5px;
    }
    .commodity-img-box{
      width: 140px;
      margin-top: 10px;
    }
  }
}
</style>
