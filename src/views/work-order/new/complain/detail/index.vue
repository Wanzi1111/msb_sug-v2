<!--
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-22 15:56:32
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-12-01 21:01:06
-->
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
        <!-- <span class="back-cont"><i :class="`back el-icon-back`" @click="onBack" />&ensp;|&ensp;</span> -->
        <div>
          <span class="complain-act-resolve-edit">
            <svg-icon :icon-class="flagSignColordata[data.flagSign?data.flagSign:0]" style="cursor: pointer" @click.stop="clickFlag()" />
          </span>
          <span>{{ workTypeFlag ?'新售后单':'投诉单' }}</span>
          <span>{{ data.complaintNo }}</span>
          <span v-if="data.channelName === 'PayPal平台投诉'">PayPal争议单号 {{ data.disputeId }}</span>
          <span v-if="data.channelName === '支付宝平台投诉'">支付宝投诉单号 {{ data.disputeId }}</span>
          <span>
            <el-tag v-if="workTypeFlag && [3, 203, 204].includes(data.cpStatus)" type="success">处理完成</el-tag>
            <el-tag v-else :type="typeData ? typeData.color : 'info'">
              {{ cpStatusData[data.cpStatusSub] }}
            </el-tag>
          </span>
        </div>
        <clock :key="data.complaintNo" :columns="data" :disabled="[3, 6, 7, 8]" />
      </div>
      <div class="step_style">
        <detailElstep
          :work-type="workTypeFlag"
          :active-step="stepcpStatus"
          :active-step-sub="stepcpStatusSub"
          :check-aids="checkAids"
          :time-data="timeData"
          :ali-pay-status="data.aliPayStatus"
        />
      </div>
    </div>
    <div class="app-container">
      <div class="complain-detail complain-detail-user">
        <span>{{ workTypeFlag ?'申请售后人' : '投诉人' }}：</span>
        <span>{{ data.userName }}</span>
        <span>
          <el-tag type="info"> UID{{ data.userId }} </el-tag>
        </span>
      </div>
      <div class="complain-detail-list">
        <ul>
          <li>
            <span class="complain-detail-list-tag"> 工单类型 </span>
            <span>{{ workTypeFlag ?'新售后工单':'投诉工单' }} </span>
          </li>
          <li>
            <span class="complain-detail-list-tag">{{ workTypeFlag ?'售后途径':'投诉来源' }}  </span>
            <span>
              {{ data.businessName }} - {{ data.channelPName }} -
              {{ data.channelName }}
            </span>
          </li>
          <li>
            <span class="complain-detail-list-tag">投诉次数</span>
            <span>
              {{ encryptionMobileIcone ? data.userMobile : data.userCallMobile }}
              <svg-icon
                style="cursor: pointer"
                :icon-class="encryptionMobileIcone ? 'eye':'eye-open'"
                @click="changeEncryptionMobileIcone(encryptionMobileIcone)"
              />
            </span>
            <span>
              （{{ data.handleComplaintsByMobile }}条在处理 共<a
                target="_blank"
                style="color: #409eff"
                :href="
                  '/workOrder/complain?userMobile=' +
                    uMobile +
                    '&channelPid=' +
                    data.channelPid
                "
              >
                {{ data.totalComplaintsByMobile }}</a> 条 <span v-show="data.allChannelTotalComplaintsByMobile">/ {{ data.allChannelTotalComplaintsByMobile }}</span>） UID：
              {{ data.userId }}
              （{{ data.handleComplaintsByUId }} 条在处理 共<a
                style="color: #409eff"
                target="_blank"
                :href="
                  '/workOrder/complain?uid=' +
                    data.userId +
                    '&channelPid=' +
                    data.channelPid
                "
              >{{ data.totalComplaintsByUId }}</a> 条<span v-show="data.allChannelTotalComplaintsByUId">/ {{ data.allChannelTotalComplaintsByUId }}</span>）
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
                v-if="['1031', '1041', '1051', '1081'].includes(data.channelPid)"
                target="_blank"
                style="color: #409eff"
                @click="getXiaoxiongGetUser()"
              >
                查看学员详情
              </a>
              <a v-if="['1031', '1041', '1051', '1081'].includes(data.channelPid)" style="color: #409eff" @click="lookExamine">查看审批记录</a>
              <a v-if="data.compensationCount && data.channelPid !== '2011'" style="color: #409eff" @click="lookClaims">查看赔付单</a>
              <a v-if="data.relationComplaintNo" style="color: #409eff" @click="lookWorkOrder">{{ workTypeFlag ?'查看原投诉单':'查看新售后工单' }}</a>
            </span>
          </li>
          <li v-if="!['1012', '1022', '2011'].includes(data.channelPid)">
            <span class="complain-detail-list-tag"> 赔付历史 </span>
            <span>
              <a style="color: #409eff" @click="openClaimsHistoryFlag">{{ data.compensationCount || "-" }}</a>次
            </span>
          </li>
          <li>
            <span class="complain-detail-list-tag"> 用户类型 </span>
            <span>
              {{ USER_TYPE[data.userType] || "--" }}
            </span>
          </li>
          <li v-if="workTypeFlag">
            <span class="complain-detail-list-tag"> 商品信息 </span>
            <span>
              {{ data.productName }}
            </span>
          </li>
          <li v-for="(item) in data.mailLogisticsList" :key="item.orderNo" class="logistics-style">
            <div v-if="workTypeFlag && item.trackingNum">
              <span class="complain-detail-list-tag"> 物流单号 </span>
              <span class="complain-detail-text">{{ item.trackingNum }}</span>
              <span class="complain-detail-list-tag"> 物流状态 </span>
              <span>{{ item.status }}</span>
              <a style="color: #409eff" @click="openlogisticsTrajectoryFn(item)">查询轨迹</a>
            </div>
          </li>
          <li v-if="workTypeFlag">
            <span class="complain-detail-list-tag"> 实付金额 </span>
            <span>
              {{ data.payment + data.currencyInfo }}
            </span>
          </li>
          <li v-if="workTypeFlag">
            <span class="complain-detail-list-tag"> 退款金额 </span>
            <span>
              {{ data.payment + data.currencyInfo }}
            </span>
          </li>
          <li v-if="workTypeFlag">
            <span class="complain-detail-list-tag"> 关联订单 </span>
            <span>
              {{ data.outTradeNo || '-' }}
            </span>
          </li>
          <li v-if="refundTypeFlag" class="logistics-style">
            <div>
              <span class="complain-detail-list-tag"> 寄回快递单号 </span>
              <span>
                <el-select v-model="logisticsCode" placeholder="请选择快递公司" size="mini" filterable>
                  <el-option
                    v-for="(item, key) in logisticsvalData"
                    :key="key"
                    :label="item.expressName"
                    :value="item.expressCode"
                  />
                </el-select>
                <el-input v-model="logisticsId" placeholder="请输入寄回快递单号" size="mini" />
                <el-button type="primary" size="mini" @click="updateLogisticsFn">保存</el-button>
              </span>
            </div>
          </li>
          <li v-if="workTypeFlag && data.logisticsDetailDto">
            <span class="complain-detail-list-tag"> 寄回物流状态 </span>
            <span>{{ data.logisticsDetailDto? data.logisticsDetailDto.status : '--' }}</span>
            <a style="color: #409eff" @click="openlogisticsTrajectoryFn(data.logisticsDetailDto)">查询轨迹</a>
          </li>
          <li v-if="workTypeFlag" class="complain-detail-list-remark-box">
            <span class="complain-detail-list-tag"> 退货地址 </span>
            <div class="complain-detail-list-remark">
              <span v-if="data.recipient && Object.keys(data.recipient).length">{{ data.recipient.consigneeProvince + data.recipient.consigneeCity + data.recipient.consigneeArea + data.recipient.consigneeAddress }}</span>
              <span v-else>APP已引导联系客服获取</span>
              <span v-if="data.recipient && Object.keys(data.recipient).length">联系人：{{ data.recipient.consigneeName + data.recipient.consigneeMobile }}</span>
            </div>
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
            <!-- <div v-if="!data.userRemarkOne" class="complain-detail-list-remark">
              暂无
              <a style="color: #409eff" @click="addRemark()">添加</a>
            </div> -->
          </li>
          <li v-if="!workTypeFlag && data.complaintSource !==3">
            <span class="complain-detail-list-tag"> 其他信息 </span>
            <span v-show="data.userRemarkFourteen">
              <a style="color: #409eff" @click="openRecord()">{{
                userRemarkFourteenInfo
              }}</a>
            </span>
          </li>
          <li v-if="!workTypeFlag && data.creatUserName">
            <span class="complain-detail-list-tag"> 创 &nbsp;建 &nbsp;人 </span>
            <span>
              {{ data.creatUserName }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 投诉问题  -->
    <div class="app-container">
      <span>{{ workTypeFlag ? '售后类型：' : '投诉问题：' + data.problemPName }}</span>
      <el-tag v-if="data.problemName" type="info">
        {{ data.problemName }}
      </el-tag>
      <el-tag v-if="workTypeFlag && data.customerNode" type="danger">
        {{ data.customerNode }}
      </el-tag>
      <div v-if="recordsUser.length > 0" class="complain-detail-list-user">
        <ul>
          <li v-for="(item, index) in recordsUser" :key="index">
            <div>
              <span style="color: #1790ff">{{
                data.userName ? data.userName : "-"
              }}</span>
              <span>{{
                item.userOperateType === 1
                  ? "发起投诉"
                  : item.userOperateType === 2
                    ? "补充投诉"
                    : item.userOperateType === 3
                      ? "服务评价"
                      : ""
              }}</span>
              <span style="color: #606266">{{ tranTime(item.ctime) }}</span>
              <span v-if="item.userOperateType === 3">
                <el-tag
                  v-if="item.evaluateRes === 0"
                  type="success"
                >评价满意</el-tag>
                <el-tag
                  v-if="item.evaluateRes === 1"
                  type="warning"
                >评价不满意</el-tag>
              </span>
            </div>
            <!-- 是否评价满意 -->
            <div v-if="item.userOperateType === 3">
              <!-- <el-tag v-if="item.evaluateRes === 0" type="success">评价满意</el-tag>
              <el-tag v-if="item.evaluateRes === 1" type="warning">评价不满意</el-tag> -->
              <div v-if="item.evaluateComent" class="complain-act">
                <span>
                  {{ item.evaluateComent }}
                </span>
              </div>
            </div>
            <div
              v-if="item.userOperateType === 1 || item.userOperateType === 2"
              class="complain-act"
            >
              <span v-if="data.channelName === 'PayPal平台投诉'">{{ parseContent(item.cpComent) }}</span>
              <span v-else v-html="brCpComent(item.cpComent)" />
            </div>
            <div
              v-if="item.userOperateType === 1 || item.userOperateType === 2"
            >
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
      <div v-if="recordsUser.length <= 0" class="complain-detail-list-user">
        <ul>
          <li>
            <div>
              <span style="color: #1790ff">{{
                data.userName ? data.userName : "-"
              }}</span>
              <span>发起投诉</span>
              <span style="color: #606266">{{ tranTime(data.ctime) }}</span>
            </div>
            <div class="complain-act">
              <span v-if="data.channelName === 'PayPal平台投诉'">{{ parseContent(data.cpComent) }}</span>
              <span v-else v-html="brCpComent(data.cpComent)" />
            </div>
          </li>
        </ul>
      </div>
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
          v-if="['1031'].includes(data.channelPid) && !workTypeFlag"
          type="default"
          size="mini"
          @click="tableAction('approvalRefund')"
        >创建退款审批</el-button>
        <el-button
          v-if="['1031'].includes(data.channelPid) && !workTypeFlag"
          type="default"
          size="mini"
          @click="tableAction('approvalRepair')"
        >创建补发货审批</el-button>
        <el-button
          type="default"
          size="mini"
          @click="tableAction('addBacklog')"
        >添加待办</el-button>
        <el-button
          v-if="!['2011'].includes(data.channelPid)"
          type="default"
          size="mini"
          @click="tableAction('addOneDisturb')"
        >添加勿扰标签</el-button>
        <el-button
          v-if="!workTypeFlag"
          :disabled="
            [10, 11, 12, 13].includes(data.cpStatusSub) ||
              [1012, 1022].includes(data.channelPid)
          "
          type="default"
          size="mini"
          @click="createWorkOrder"
        >一键创建工单</el-button>
        <el-button
          v-if="
            ['1011', '1021', '1031', '1041', '1051', '1061', '1071'].includes(
              data.channelPid
            ) && !workTypeFlag
          "
          :disabled="
            ![1, 2].includes(data.cpStatus) || data.channelPid == '1061'
          "
          type="default"
          size="mini"
          @click="tableAction('toTeachDeal')"
        >转业务处理</el-button>
        <el-button
          :disabled="!![6, 7].includes(data.cpStatus) || !data.currentStaffId"
          type="default"
          size="mini"
          @click="tableAction('editStaffUser')"
        >修改操作人</el-button>
        <el-button
          v-if="!workTypeFlag"
          :disabled="[4, 6, 7].includes(data.cpStatus)"
          type="default"
          size="mini"
          @click="tableAction('setInvalid')"
        >设为无效</el-button>
        <el-button
          type="default"
          size="mini"
          @click="tableAction('editType')"
        >{{ !workTypeFlag ?'修改渠道来源':'修改售后类型' }}</el-button>
        <el-button
          v-if="!workTypeFlag"
          :disabled="![6].includes(data.cpStatus)"
          type="default"
          size="mini"
          @click="tableAction('setAccecpt')"
        >设为待处理</el-button>
        <el-button
          v-if="!['1012', '1022', '2011'].includes(data.channelPid) && [3].includes(data.cpStatus) && [0].includes(actionObj.status) && !workTypeFlag"
          type="default"
          size="mini"
          :disabled="
            ![3].includes(data.cpStatus)
          "
          @click="tableAction('robotDetail',0)"
        >机器人回访</el-button>
        <el-button
          v-if="!['1012', '1022', '2011'].includes(data.channelPid) && !workTypeFlag"
          type="default"
          size="mini"
          @click="tableAction('robotDetail',1)"
        >机器人回访详情</el-button>
        <el-button
          v-if="!workTypeFlag"
          :disabled="
            !([3].includes(data.cpStatus) || [70].includes(data.cpStatusSub))
          "
          type="default"
          size="mini"
          @click="tableAction('doVisit')"
        >回访登记</el-button>
        <el-button
          type="default"
          size="mini"
          @click="tableAction('sendNote')"
        >发短信</el-button>
        <el-button
          v-if="workTypeFlag"
          type="default"
          size="mini"
          :disabled="data.cpStatus === 8"
          @click="tableAction('cancelAftersale')"
        >取消售后单</el-button>
        <el-button
          v-if="workTypeFlag"
          type="default"
          size="mini"
          @click="tableAction('addComment')"
        >添加评论</el-button>
        <el-button
          v-if="workTypeFlag && data.afterSaleSource === 2"
          type="default"
          size="mini"
          @click="tableAction('examinationRefund')"
        >退款审批</el-button>
        <el-button
          v-if="workTypeFlag && data.asType === 'REFUND_RETURN' && data.afterSaleSource === 1"
          type="default"
          size="mini"
          :disabled="data.asType === 'REFUND_RETURN' && data.logisticsId.length !== 0"
          @click="tableAction('backCommodity')"
        >退回商品</el-button>
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
            投诉专员 {{ data.currentStaffName ? data.currentStaffName : "" }}
          </el-tag>
          <div v-if="recordsStaff.length > 0" class="sort-icon">
            <!-- <svg-icon icon-class="iconSort" style="cursor: pointer" @click.stop="recordSort()" /> -->
            <span style="cursor: pointer" class="sorts" @click.stop="recordSort(recordSortFlag)">
              <svg-icon icon-class="ascendingSort" :class="!recordSortFlag ?'sortactive':''" />
              <svg-icon icon-class="dropSort" :class="recordSortFlag ?'sortactive drop':'drop'" />
            </span>

          </div>
        </div>
      </div>
      <div v-if="recordsStaff.length > 0" class="complain-detail-list-user">
        <ul>
          <li v-for="(item, index) in recordsStaff" :key="index">
            <div>
              <span style="color: #1790ff">{{ staffEnumData[item.handleRole] }} {{ item.staffName }}</span>
              <span>{{ OPERATE_TYPE[item.handleOperateType] || "" }}</span>
              <span style="color: #606266">{{ tranTime(item.ctime) }}</span>
              <span v-if="item.handleOperateType === 2">
                <!-- <el-tag v-if="item.cpStatus === 7" type="danger">回访人</el-tag> -->
                <el-tag
                  v-if="item.isAssist === 0"
                  type="success"
                >处理人</el-tag>
                <el-tag
                  v-if="item.isAssist === 1"
                  type="warning"
                >协助人</el-tag>
              </span>
              <span>
                <el-tag v-if="item.cpStatus === 7" type="danger">回访人</el-tag>
              </span>
            </div>
            <div class="complain-act-resolve-main">
              <div class="complain-act-resolve">
                <span v-if="item.handleOperateType === 4"> 原因： </span>
                <span v-if="item.handleOperateType === 5"> 已更换 </span>
                <!-- 机器人回访日志 -->
                <span v-if="item.handleRole === 9">
                  <span
                    style="color: #1790ff"
                  >
                    {{ item.handleRole === '机器人回访' ? item.staffName : null }}
                  </span>
                  通话结果： <span v-html="brCpComent(item.handleComent)" /><span v-if="item.handleComent">；</span>
                </span>
                <!-- 机器人回访日志 -->
                <span v-if="item.handleRole !== 9">
                  <span
                    v-if="item.handleOperateType === 1"
                    style="color: #1790ff"
                  >
                    {{ item.handleOperateType === 1 ? item.staffName : null }}
                  </span>
                  <span>内部：</span>
                  <span v-if="item.handleComent" v-html="brCpComent(item.handleComent)" /><span v-if="item.handleComent">；</span>
                  <span>展示给用户：</span>
                  <span v-if="item.handleComentUser" v-html="brCpComent(item.handleComentUser)" /><span v-if="item.handleComentUser">；</span>
                </span>
                <span v-if="item.handleOperateType === 3">
                  已关闭本次投诉，等待回访；
                </span>
                <span v-if="item.handleOperateType === 4">
                  暂时无法解决；
                </span>
                <span v-if="item.handleOperateType === 5"> 介入处理 </span>
              </div>
              <div
                v-if="item.handleOperateType === 34"
                class="complain-act-resolve-edit"
              >
                <el-button type="primary" size="mini" @click="sendExamine">发起审批</el-button> <!-- 物流审批被驳回可显示并二次触发 -->
              </div>
              <div
                v-if="item.handleOperateType === 37 || item.handleOperateType === 38"
                class="complain-act-resolve-edit"
              >
                <a
                  style="color: #409eff;fontSize: 14px"
                  target="_blank"
                  :href="`/examine?id=${data.approvalId}&subject=${data.channelPid}` "
                  type="primary"
                  size="mini"
                >查看审批</a><!-- 财务审批通过或者驳回可显示 -->
              </div>
              <div
                v-if="item.handleOperateType === 2"
                class="complain-act-resolve-edit"
              >
                <i
                  class="el-icon-edit"
                  @click="
                    editHandle(
                      item.id,
                      item.handleComent,
                      item.handleComentUser
                    )
                  "
                />
              </div>
              <div
                v-if="index === recordsStaff.length-1"
                class="complain-act-resolve-edit"
              >
                <svg-icon :icon-class="flagSignColordata[data.flagSign?data.flagSign:0]" style="cursor: pointer" @click.stop="clickFlag()" />
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
    <!-- 处理投诉 || 关闭投诉 || 设为无效  || 添加勿扰 弹出框-->
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
      >
        <template slot="PayPal">
          <div class="PayPalStyle">
            <h4>温馨提示</h4>
            <p>1. PayPal回复用户内容需提供给财务在PayPal调解中心发送给用户；</p>
            <p>2. 可酌情申请退款审批单；</p>
          </div>
        </template>
        <template slot="buyTime" slot-scope="scope">
          <el-form-item :label="scope.item.label">
            <span>{{ scope.form.buyTime }}</span>
          </el-form-item>
        </template>
      </basics-form>
    </el-dialog>
    <!-- 转业务处理 || 二次确认 弹出框-->
    <el-dialog
      width="450px"
      title="请再次确认"
      :visible.sync="dialogNewVisibleSecondary"
      center
    >
      <h1 style="text-align: center; font-size: 16px; font-weight: 400">
        确定【 {{ optionList[ToTeachval.type] }} 】吗？
      </h1>
      <span slot="footer" class="dialog-footer">
        <el-tooltip
          class="item"
          effect="light"
          content="确定后不能修改"
          placement="top"
        >
          <el-button
            class="pan-btn light-blue-btn"
            type="primary"
            @click="submitOption()"
          >确 定</el-button>
        </el-tooltip>
        <el-button @click="dialogNewVisibleSecondary = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 一键生成工单 -->
    <el-dialog
      class="dialogForm"
      width="1100px"
      :title="getUser"
      :visible.sync="dialogWorkOrder"
    >
      <basics-form
        ref="workOrderRef"
        :key="dialogWorkOrder"
        :forms="forms"
        :loading="loadings._k8s_api_complaint_api_v2_complaint_createWorkOrder"
        class="form-item"
        :actions="formActions(cancelForm)"
        @changeForm="onFormChange"
        @submitForm="onFormSubmit"
      />
    </el-dialog>
    <!-- 客服聊天记录+客服通话记录 -->
    <serviceChatRecord
      v-if="recorddDalogVisible"
      :recordd-dalog-visible="recorddDalogVisible"
      :row-data="data"
      @cancel="cancel"
    />
    <!-- 机器人回访 -->
    <robotReturn
      v-if="robotFlag"
      :robot-flag="robotFlag"
      :row-data="data"
      :robot-type="RobotType"
      @cancel="cancel"
    />
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
    <!-- 创建退款审批 -->
    <createRefund
      v-if="uMobile && refundFlag"
      :refund-flag="refundFlag"
      :complaint-no="complaintNo"
      :user-mobile="uMobile"
      @cancel="cancel"
    />
    <!-- 创建补发货审批 -->
    <createRepair
      v-if="uMobile && repairFlag"
      :repair-flag="repairFlag"
      :complaint-no="complaintNo"
      :user-mobile="uMobile"
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
    <logisticsTrajectory
      v-if="logisticsTrajectoryFlag"
      :logistics-trajectory-flag="logisticsTrajectoryFlag"
      :row-data="logisticsDetailDto"
      @cancel="cancel"
    />
    <!-- 用户订单抽屉 -->
    <orderFormDrawer
      v-if="orderFormFlag && actionUserId"
      :order-form-flag="orderFormFlag"
      :channel-pid="data.channelPid"
      :long-user-id="actionUserId"
      @cancel="cancel"
    />
    <!-- 赔付历史 -->
    <claimsHistory
      v-if="claimsHistoryFlag"
      :claims-history-flag="claimsHistoryFlag"
      :user-id="actionUserId"
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
  acceptComplaint,
  updateSourceProblem,
  complaintInfo,
  complaintRecords,
  getProblemChannelId,
  acceptFirstRecord,
  modifyProblemAccept,
  modifyComplaintRemark,
  updateRecordsCpComent,
  invalidToUnaccecpt,
  transferProcessing,
  getUserByUserNum,
  getBypid,
  addOrUpdateObNotDisturbNew,
  checkTeachingAids,
  updateFlagSign,
  getLogisticsCompany,
  updateLogistics,
  afterSaleRemark,
  afterAcceptComplaint,
  revokeOpAfterSale,
  getAfterSaleProblem,
  bearRefundApproval,
  getAllOrderList,
  getCenterExpressId,
  getLongUserId,
  feedbackProcessing,
  newGetAfterSaleProblem
} from '@/api/operate/complainNew'
import { createWorkOrderOnce } from '@/api/work-order'
import moment from 'moment'
import {
  doItForm,
  invalidForm,
  closeForm,
  questTypeForm,
  editStaffUserForm,
  toTeachDeal,
  remarkForm,
  complaintHandleForm,
  accecptForm,
  visitForm,
  disturbForm,
  addCommentForm,
  categorieDatas,
  actions as complaintFormAction
} from '../forms/complaintForm'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import optionList from '../forms/optionList'
import Videos from '@/components/BasicsForm/components/Video'
import Audios from '@/components/BasicsForm/components/Audio'
import Clock from '../components/Clock'
import { getUserRemark } from '@/api/operate/createSug'
import { OPERATE_TYPE, USER_TYPE, AS_TYPE_MAP } from './config'
const createUserId = getToken('userId')
const createUserMobile = getToken('userMobile')
import forms, { formActions } from './form'
import AddBacklogDialog from './components/addBacklogDialog.vue'
import {
  getCallRequest
} from '@/api/outboundRecords/index'
import createClaims from './components/createClaims/index.vue'
import createRepair from './components/createRepair.vue'
import createRefund from './components/createRefund.vue'
import detailElstep from './components/deatilElStep.vue'
import snedMessage from './components/sendMessage.vue'
import robotReturn from './components/robotReturn.vue'
import serviceChatRecord from './components/serviceChatRecord.vue'
import logisticsTrajectory from './components/logisticsTrajectory'
import orderFormDrawer from './components/orderFormDrawer'
import { findStaffByMobile, getCompensateCheck } from '@/api/myExamine'
import claimsHistory from './components/claimsHistory'
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
const {
  work_order_second_map, // 工单类型对应二级分类
  work_order_classification_map, // 二级对应的三级分类
  work_order_type // 一键创建工单类型
     } = window.baseData
export default {
  name: 'SugDetail',
  components: { Videos, Audios, Clock, AddBacklogDialog, createClaims, createRepair, detailElstep, createRefund, snedMessage, robotReturn, serviceChatRecord, logisticsTrajectory, claimsHistory, orderFormDrawer },
  filters: {
    timeFormat(e) {
      return (e !== '0' && e) ? moment(+e).format('YYYY-MM-DD HH:mm:ss') : '永久'
    }
  },
  data() {
    return {
      logisticsId: '',
      logisticsCode: '',
      logisticsvalData: [],
      flagSignColordata: ['huiflag', 'redflag', 'greenflag', 'yellowflag'],
      recordSortFlag: '',
      previewSrcList: [],
      createUserMobile,
      forms,
      formActions,
      optionList: optionList,
      OPERATE_TYPE,
      USER_TYPE,
      AS_TYPE_MAP,
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
      recordsStaff: [],
      recordsUser: [],
      info: {
        title: '',
        instroduct: ''
      },
      orderFormFlag: false,
      backlogFlag: false,
      robotFlag: false,
      dialogNewVisible: false,
      dialogNewVisibleSecondary: false,
      dialogNewVisibleDisturb: false,
      recorddDalogVisible: false,
      sendMsgFlag: false,
      claimsFlag: false,
      refundFlag: false,
      repairFlag: false,
      logisticsTrajectoryFlag: false,
      claimsHistoryFlag: false,
      complaintForm: [],
      DisturbForm: [],
      approvalForm: [],
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
      dialogWorkOrder: false,
      actionObj: {
        status: 0
      },
      RobotType: 0,
      uMobile: '',
      checkAids: 0,
      stepcpStatus: 0,
      stepcpStatusSub: 0,
      timeData: {},
      second_map: work_order_second_map,
      three_map: work_order_classification_map,
      cworkType: work_order_type,
      subjectsObj: {
          '1031': 'ART_APP', // 小熊用户
          '1041': 'WRITE_APP', // 书法用户
          '1071': 'DANCE_APP', // 小熊舞蹈用户
          '1051': 'MUSIC_APP', // 小熊音乐
          '1081': 'HANDWORK_APP', // 小熊手工
          '2011': 'ART_APP' // 绘本创作
      },
      businessTypeObj: {
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
      },
      orderList: [],
      outTradeNoData: [],
      encryptionMobileIcone: true,
      logisticsDetailDto: {},
      productCodeList: [],
      centerExpressData: {}
    }
  },
  computed: {
    workTypeFlag() {
      const { workType } = this.data
      if (workType && workType === 4) { // 新售后单
        return true
      } else { // 投诉单
        return false
      }
    },
    afterSaleSourceFlag() {
      const { afterSaleSource } = this.data
      if (afterSaleSource === 2) { // 如果是有赞商城的单子
        return false
      } else { // 不是有赞的单子其他
        return true
      }
    },
    // 判断是客服通话记录还是聊天记录
    userRemarkFourteenInfo() {
      const flag = this.data.userRemarkFourteen && this.data.userRemarkFourteen.indexOf('-') === -1
      if (flag) { // 没找到-聊天记录
        return '客服聊天记录'
      } else { // 通话记录
        return '客服通话记录'
      }
    },
    // 控制回填单号显示
    refundTypeFlag() {
      const { asType, logisticsId, workType } = this.data
        if (workType === 4) {
          if (asType === 'REFUND_RETURN') { // 如果asType是 REFUND_RETURN（退货退款） 的时候 则显示
            return true
          } else if (asType === 'AFTER_SALE' && logisticsId) { // 如果asType是 AFTER_SALE（申请售后） 并且有物流单号的时候 则显示
            return true
          } else { // 其他情况不显示
            return false
          }
        } else {
          return false
        }
    },
    // 关闭投诉单的按钮限制
    closeEnumTpyeFlag() {
      let closeEnumTpyeFlag
      const { workTypeFlag, data: { cpStatus, asType, afterSaleType, complaintAfterSaleEntity, channelName }} = this
      if (asType === 'REFUND_RETURN' && cpStatus === 203) {
        // 当售后类型是退货退款的时候并且处理成功状态可显示关闭勾选
        closeEnumTpyeFlag = true
      } else if (asType === 'AFTER_SALE') {
        // 售后类型是申请售后
        closeEnumTpyeFlag = true
      } else if (!workTypeFlag) { // 投诉单的时候显示
      if (channelName === '支付宝平台投诉') { // 支付宝平台的投诉单客服不支持关闭工单
        closeEnumTpyeFlag = false
      } else {
        closeEnumTpyeFlag = true
      }
      } else if (!complaintAfterSaleEntity?.type) { // 老售后
         closeEnumTpyeFlag = true
      } else { // 其他不显示
         closeEnumTpyeFlag = false
      }
      // afterSaleType是2并且是新售后单 或 投诉单的时候可显示关闭投诉单按钮
      return (afterSaleType === '2' && workTypeFlag) || closeEnumTpyeFlag
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
      const obj = {}
      this.staffEnum.roles?.map(item => {
        obj[item.value] = item.label
      })
        return obj
    },
    // 区分小熊和1v1长短id
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
      // 15101169315 肖文
      // 17718325982 杜龙飞
      // 15201130897 徐肖洁
      const vipData = ['15101169315', '17718325982', '15201130897']
      if (vipData.includes(createUserMobile)) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['name', 'loadings', 'staffEnum']),
    ...mapState({
      BusinessListData: state => state.global.BusinessListData,
      TabList: state => state.global.BusinessListData?.businessClassificationLIst,
      allChildLIst: state => state.global.BusinessListData?.allChildLIst,
      cpStatusData: state => state.global.cpStatusData
    })
  },
  watch: {
    staffEnum: {
      handler: function(val, oldVal) {
        questTypeForm.map(item => {
          if (item.label === '投诉来源') {
            item.options = val.channelEum
          }
          return item
        })
      },
      deep: true
    }
    },
  created() {
    this.BOSS_HOST = process.env.VUE_APP_NEW_BOSS_HOST
    this.BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
    this.getComplain()
    this.getComplaintRecords()
    this.getStaffUserList()
    this.getCallRequestData()
    this.getLogisticsCompanyFn()

    this.$store.dispatch('global/BusinessTypeSupplierNameList')
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.$store.dispatch('user/getBossInfo')
    this.$store.dispatch('global/getComplaintStatusEumDtoEnum')
  },
  methods: {
    // 控制手机号是否加密
    changeEncryptionMobileIcone(e) {
      this.encryptionMobileIcone = !e
    },
    // 文本\n转<br>
    brCpComent(val) {
      const text = val
        ? val.replace(/\n|\r\n/g, '<br>')
        : ''
      return text
    },
    // 兼容第一版paypal参数cpComent为json数组的情况
    parseContent(val) {
      try {
        if (JSON.parse(val) instanceof Array) {
          return JSON.parse(val)[0].content || ''
        } else {
          return val || ''
      }
      } catch (error) {
        return val
      }
    },
    // 获取投诉人的手机号
    getUserRemarkFn() {
    const data = {
      channelPid: this.data.channelPid,
      userId: this.data.userId
    }
      getUserRemark(data).then(res => {
        if (res.code === 0) {
          const { userMobile } = res.payload
          this.uMobile = userMobile
        }
      })
    },
    // 获取100快递公司
    async  getLogisticsCompanyFn() {
     const res = await getLogisticsCompany()
      if (res.code === 0) {
        this.logisticsvalData = res.payload
      }
    },
    // 获取新售后的售后类型
    getAfterSaleProblemFn(val, type, cid, pid) {
      const data = {
        channelPid: val,
        problemId: pid || '',
        channelIds: cid || ''
      }
      getAfterSaleProblem(data).then(res => {
        const data = res.payload
        const arr = []
        data.forEach(item => {
          if (item.problemStatus === 0) {
            const obj = {}
            obj.label = item.cpType
            obj.value = item.problemIdNew
            obj.problemStatus = item.problemStatus
            arr.push(obj)
          }
        })
        this.$nextTick(() => {
          if (type === 'problemIdThree') {
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [type]: arr
            }
          })
          } else if (type === 'problemId') {
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [type]: arr
            }
          })
           this.afterSaleProblemCache = arr
          }
        })
      })
    },
    // 获取新售后的售后问题
    getnewGetAfterSaleProblem(pid, receivingType, afterSaleSource, productCode, type) {
      const { data: { complaintNo, channelPid }, centerExpressData: { centerExpressId }, specialPermission } = this
      const data = {
        channelPid,
        complaintNo: complaintNo,
        afterSaleSource: afterSaleSource,
        problemId: pid || '',
        productCode,
        expressCenterId: centerExpressId
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
            if (item.allowType === 0 || specialPermission) {
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
          if (type === 'afterSaleProblemId') {
          // 售后类型
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [type]: arr.problemIdArr
            }
          })
          this.afterSaleProblemCache = arr.problemIdArr
          } else if (type === 'afterSaleProblemIdThree') {
          // 售后问题
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              [type]: String(receivingType) === '1' ? arr?.problemIdThreeArr1 : arr?.problemIdThreeArr2
            }
          })
          }
        })
      })
    },
    // 物流驳回后再次发起审批
    sendExamine() {
        this.$confirm('确定再次发起审批?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateLogisticsFn()
        })
    },
    // 修改或保存快递公司和单号
    async updateLogisticsFn() {
      const { data: { complaintNo }, logisticsId, logisticsvalData, logisticsCode } = this
      const data = {
        complaintNo: complaintNo,
        logisticsId: logisticsId,
        logisticsCompany: logisticsvalData.find(val => val.expressCode === logisticsCode)?.expressName,
        logisticsCode: logisticsCode,
        handleStaffId: getToken('userId'),
        handleStaffName: getToken('cname')
      }
      const res = await updateLogistics(data)
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
          this.getLongUserId()
          if (this.data.channelPid && this.data.userId) {
             this.getUserRemarkFn()
          }
          //  一进页面识别是新售后就调用
          if (this.workTypeFlag) {
            this.getAfterSaleProblemFn(this.data.channelPid, 'problemId', res.payload.channelId)
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
          this.recordsStaff = res.payload.recordsStaff.map(item => {
             item.sort = i++
             return item
           })
          this.recordsUser = res.payload.recordsUser

          // 过滤关闭的最后一条，用于复现立即处理的关闭投诉
          const closeArr = this.recordsStaff.filter(
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
          // this.recordsStaff = obj.recordsStaff
          // this.recordsUser = obj.recordsUser
        } else {
          this.recordsStaff = []
          this.recordsUser = []
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
        case 'setInvalid': // 设为无效
          this.setInvalid(row)
          break
        case 'editType': // 修改渠道来源 售后类型
          this.editTypeFn(row)
          this.acceptFirst()
          break
        case 'toTeachDeal': // 转业务处理
          this.toTeachDeal(row)
          this.acceptFirst()
          break
        case 'editStaffUser': // 修改操作人
          this.editStaffUser(row)
          break
        case 'setAccecpt': // 修改无效为待处理状态
          this.setAccecptFn(row)
          break
        case 'robotDetail': // 机器人回访/详情
          this.openRobotDetail(row, type)
          break
        case 'sendNote': // 发短信
          this.sendNoteFn(row)
          break
        case 'doVisit': // 回访登记
          this.doVisitFn(row)
          break
        case 'addBacklog':// 添加待办
          this.addBacklogFn(row)
          break
        case 'approvalClaims': // 创建赔付审批
          this.approvalClaimsFn(row)
          break
        case 'approvalRefund': // 创建退款审批
          this.approvalRefundFn(row)
          break
        case 'approvalRepair': // 创建补发货审批
          this.approvalRepairFn(row)
          break
        case 'addOneDisturb': // 添加勿扰管理
          this.addOneDisturbFn(row)
          this.acceptFirst()
          break
        case 'cancelAftersale': // 取消售后单
        this.cancelAftersaleFn()
        break
        case 'examinationRefund': // 新售后退款审批
        this.cexaminationRefundFn(row)
        break
        case 'backCommodity': // 退回商品
        this.backCommodityFn()
        break
        case 'addComment': // 添加评论
        this.addCommentFn()
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
      this.claimsFlag = false
      this.refundFlag = false
      this.repairFlag = false
      this.dialogNewVisible = false
      this.dialogNewVisibleDisturb = false
      this.backlogFlag = false
      this.sendMsgFlag = false
      this.robotFlag = false
      this.recorddDalogVisible = false
      this.logisticsTrajectoryFlag = false
      this.orderFormFlag = false
      this.claimsHistoryFlag = false
      this.complaintNo = null // 投诉单号
      this.cpStatus = null
      this.editTypeStatus = null
      this.oddNumber = ''
      this.info = {
        title: '',
        instroduct: ''
      }
    },
    // 取消售后单
    cancelAftersaleFn() {
        this.$confirm('取消售后工单? 该操作不可逆', '确定取消售后工单', {
          confirmButtonText: '确定'
        }).then(async() => {
          const data = {
            complaintNo: this.data.complaintNo,
            currentStaffId: getToken('userId')
          }
         const res = await revokeOpAfterSale(data)
         if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '取消成功'
            })
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
         } else {
            this.$message({
              type: 'error',
              message: '取消失败'
            })
         }
        })
    },
    // 退回商品
    backCommodityFn() {
        this.$confirm('是否退回商品？ 确认后用户展示寄回单号按钮', '确定退回商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async() => {
          const data = {
            complaintNo: this.data.complaintNo,
            currentStaffId: getToken('userId')
          }
         const res = await feedbackProcessing(data)
         if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '退回成功'
            })
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
         } else {
            this.$message({
              type: 'error',
              message: '退回失败'
            })
         }
        })
    },
    // 添加评论
    addCommentFn() {
      this.editTypeStatus = 'addComment'
      this.info = {
        title: '添加评论',
        instroduct: '请添加评论内容及上传图片'
      }
      this.complaintForm = addCommentForm
      this.dialogNewVisible = true
    },
    // 新售后退款审批
    cexaminationRefundFn(row) {
        this.$confirm('是否确定退款? 退款后财务进行审批', '是否退款审批', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async() => {
          const res = await bearRefundApproval({
            complaintNo: row.complaintNo,
            currentStaffId: createUserId
          })
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
        })
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
    // 回访登记
    doVisitFn(row) {
      this.info = {
        title: '记录回访登记内容',
        instroduct: '请输入投诉处理内容，并标记问题是否已解决。'
      }
      this.complaintNo = row.complaintNo
      this.editTypeStatus = 'doVisit'
      this.complaintForm = visitForm
      this.dialogNewVisible = true
    },
    // 修改无效为待处理状态
    setAccecptFn(row) {
      this.info = {
        title: '设置为待处理',
        instroduct: '请确定将此问题恢复为待处理状态'
      }
      this.complaintNo = row.complaintNo
      this.editTypeStatus = 'setAccecpt'
      this.complaintForm = accecptForm
      this.dialogNewVisible = true
    },
    // 修改无效为待处理
    invalidToUnaccecptFn(val) {
      const { complaintNo } = this
      const params = {
        complaintNo,
        ...val,
        handleComent: `${val.handleComent}; 回访登记：未解决`,
        currentStaffId: getToken('userId'),
        currentStaffName: getToken('cname'),
        currentStaffMobile: getToken('userMobile')
      }
      invalidToUnaccecpt(params).then((res) => {
        if (res.code === 0) {
          Message.success('操作成功')
          this.cancel()
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
        }
      })
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
    setToTeachDeal(val) {
      const param = {
        complaintNo: this.$route.params.id,
        type: val.type,
        imgUrl: val.imgUrl
      }
      // 转处理
      transferProcessing(param).then((res) => {
        if (res.code === 0) {
          Message.success('转处理成功')
          this.cancel()
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
        }
      })
    },

    // 设为无效
    setInvalid(row) {
      this.editTypeStatus = 'setInvalid'
      this.info = {
        title: '确定设为无效',
        instroduct: '请确定投诉问题为违规或无效问题'
      }
      this.complaintForm = invalidForm
      this.dialogNewVisible = true

      // 向后端传递的值
      this.complaintNo = row.complaintNo // 投诉单号
      this.cpStatus = '6' // 传递的状态
    },
    // 修改渠道来源 售后类型
    editTypeFn(row) {
      this.editTypeStatus = 'editType'
      this.info = {
        title: `确定修改${this.workTypeFlag ? '售后类型' : '渠道来源'}`
        // instroduct: '修改投诉问题类型'
      }
      const { channelPid: channelId } = row
      const arr = [
        'problemId',
        'problemIdThree',
        'problemIdFour',
        'problemIdFive'
      ]
      arr.map((res) => {
        if (Array.isArray(row[res])) {
          row[res]
        } else if (row[res]) {
          if (row[res] === '0') row[res] = ''
          else row[res] = row[res]?.split(',')
        }
      })
      this.complaintForm = questTypeForm
      this.$nextTick(() => {
        if (this.workTypeFlag) {
          this.$refs.complaintForm?.set({
            type: 'visible',
            data: {
              channelPid: false,
              problemPid: false
            }
          })
          this.$refs.complaintForm?.set({
            type: 'attr',
            data: {
              channelId: { disabled: true }
            }
          })
          this.$refs.complaintForm?.set({
            type: 'label',
            data: {
              problemId: '售后类型',
              problemIdThree: '售后问题'
            }
          })
          this.$refs.complaintForm?.set({
            type: 'rules',
            data: {
              problemId: [{ required: true, message: '售后类型必选！' }],
              problemIdThree: [{ required: true, message: '售后问题必选！' }]
            }
          })
        }
      })
      this.complaintNo = row.complaintNo
      this.dialogNewVisible = true
      // 根据投诉来源获取投诉途径
      getBypid({ pid: row.channelPid }).then(res => {
        this.setChannel(res.payload, 'channelId', 'form')
      })
      this.getProblemChannel(channelId, 'problemPid', 'form').then((_) => {
        this.$nextTick(() => {
          this.$refs.complaintForm.recoveryForm({
              channelPid: row.channelPid,
              channelId: row.channelId
          })
          // 保证已停用的问题在修改类型时不会回显
          const upDefaultValueFlag = this.problemTypeCache.some(
            (v) => v.id === row.problemPid && v.problemStatus === 0
          )
          if (!this.workTypeFlag) { // 投诉单时修改渠道的回显
            if (upDefaultValueFlag) {
            this.$refs.complaintForm.recoveryForm({
              problemPid: row.problemPid,
              problemId: row.problemId[0],
              problemIdThree: row.problemIdThree?.toString(),
              problemIdFour: row.problemIdFour?.toString(),
              problemIdFive: row.problemIdFive?.toString()
            })
              this.getSelectList(row)
            }
          }
          // 新售后 保证已停用的问题在修改售后类型时不会回显
          if (this.workTypeFlag) {
            const afterSaleValueFlag = this.afterSaleProblemCache.some(
              (v) => v.value === row.problemId[0] && v.problemStatus === 0
            )
            if (afterSaleValueFlag) {
            this.$refs.complaintForm.recoveryForm({
              problemId: row.problemId[0],
              problemIdThree: row.problemIdThree[0]?.toString(),
              problemIdFour: row.problemIdFour?.toString(),
              problemIdFive: row.problemIdFive?.toString()
            })
              this.$refs.complaintForm?.set({
               type: 'options',
               data: {
                 problemId: this.afterSaleProblemCache
               }
              })
              this.getAfterSaleProblemFn(this.data.channelPid, 'problemIdThree', row.channelId, row.problemId[0]) // 第一次
            } else {
              this.$refs.complaintForm?.set({
               type: 'options',
               data: {
                 problemId: this.afterSaleProblemCache
               }
              })
            }
          }
        })
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
      const { workTypeFlag, closeEnumTpyeFlag, data: { workType, asType, isConfirm, complaintSource, channelName, aliPayStatus }} = this
      if (!workTypeFlag) {
        this.getAllOrderList('1', 'afterSaleOrderId')
      }
      const text = workTypeFlag ? '售后' : '投诉'
      this.editTypeStatus = 'doItNow'
      this.info = {
        title: `记录${text}处理内容`,
        instroduct: `请输入${text}处理内容${!workTypeFlag ? ',如需关闭请选择关闭。' : ''}`
      }
      this.complaintForm = doItForm(this.remoteMethodSaleOrderId)
      this.dialogNewVisible = true

      this.$nextTick(() => {
        this.$refs.complaintForm?.set({
          type: 'defaultVal',
          data: {
            workType: workType + '' || null
          }
        })
        this.$refs.complaintForm?.set({
          type: 'visible',
          data: {
            workType: !workTypeFlag,
            refundType: !!(asType === 'REFUND_RETURN' && isConfirm === 0),
            closeEnumTpye: closeEnumTpyeFlag,
            handleComentUser: channelName !== 'PayPal平台投诉',
            PayPal: channelName === 'PayPal平台投诉'
          }
        })
        // 判断当前单子是否是微信客诉的改变描述信息
        if (complaintSource === 3) {
          this.$refs.complaintForm?.set({
            type: 'label',
            data: {
            handleComentUser: '同步微信回复用户'
            }
          })
        }
        // 投诉单可转新售后工单
        if (!workTypeFlag) {
          const newWorkData = doItForm(this.remoteMethodSaleOrderId).filter(val => val.prop === 'workType')[0].options
          const flag = newWorkData.find(val => val.value === '6')
          if (!flag) {
            newWorkData.push({ label: '新售后工单', value: '6' })
          }
          this.$refs.complaintForm?.set({
            type: 'options',
            data: {
              workType: newWorkData
            }
          })
        }
        // 判断当前是支付宝的单子处理结果字数限制，上传图片数量限制
        if (channelName === '支付宝平台投诉') {
          this.$refs.complaintForm?.set({
            type: 'attr',
            data: {
              // 状态为平台处理中时，补充凭证字数为200 图片长度为4张
              handleComentUser: {
                maxlength: aliPayStatus && aliPayStatus === 'PLATFORM_PROCESSING' ? 200 : 1000,
                placeholder: aliPayStatus && aliPayStatus === 'PLATFORM_PROCESSING' ? '请输入处理内容' : '请填写具体情况（您填写的内容将向用户展示）'
              },
              imgUrl: { limit: aliPayStatus && aliPayStatus === 'PLATFORM_PROCESSING' ? 4 : 5 }
            }
          })
          this.$refs.complaintForm?.set({
            type: 'label',
            data: {
            handleComentUser: aliPayStatus && aliPayStatus === 'PLATFORM_PROCESSING' ? '补充凭证说明' : '同步支付宝回复用户',
            imgUrl: aliPayStatus && aliPayStatus === 'PLATFORM_PROCESSING' ? '补充凭证' : '上传图片'
            }
          })
          this.$refs.complaintForm?.set({
            type: 'visible',
            data: {
              feedbackCode: aliPayStatus && aliPayStatus === 'MERCHANT_PROCESSING'
            }
          })
        }
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
        return payload
     }
    },
    // 投诉转售后1v1/小熊/积分商城关联订单获取
    async getAllOrderList(afterSaleSource, type, outTradeNo) {
      const { data: { channelPid, userId }, subjectsObj, specialPermission, businessTypeObj } = this
      // type afterSaleOrderId 关联订单 productCode 选择商品
      let uid = ''
      if (Object.keys(subjectsObj).includes(channelPid)) {
        uid = await this.actionUserId
      } else {
        uid = userId
      }
      const data = {
        shop: afterSaleSource === '2',
        userId: uid,
        search: outTradeNo,
        businessType: businessTypeObj[channelPid]
      }
      await getAllOrderList(data).then(res => {
        const { code, payload } = res
        if (code === 200) {
          let newData = []
          if (type === 'afterSaleOrderId') {
            const res = new Map()
            const filterData = payload?.filter((item) => !res.has(item.product['outTradeNo']) && res.set(item.product['outTradeNo'], 1) && item.refund === 0)
            newData = filterData?.map(val => {
            return {
              ...val,
              label: val.product?.outTradeNo,
              value: val.product?.outTradeNo
            }
          })
          } else {
           payload?.map(val => {
              if (val.product?.afterSaleConfs?.length || (specialPermission && +val.product?.expressId > 0)) {
                newData.push({
                  ...val,
                  label: val.product?.productCode + '—' + val.product?.productName,
                  value: val.product?.productCode
                })
              }
          })
          this.productCodeList = newData
          }
         this.$nextTick(() => {
           this.$refs.complaintForm?.set({
             type: 'options',
             data: {
               [type]: newData
             }
           })
         })
        }
      })
    },
    // 根据业务线物流id
    getCenterExpressId(receivingType, afterSaleSource, productCode) {
      const { actionUserId, data: { channelPid }, businessTypeObj } = this
      const products = this.productCodeList.filter(val => val.product.productCode === productCode)[0]?.product
      const data = {
        shop: afterSaleSource === '2',
        businessType: businessTypeObj[channelPid],
        expressId: products.expressId,
        productCode,
        userId: actionUserId,
        orderId: products.orderId
      }
      getCenterExpressId(data).then(res => {
        const { code, payload } = res
        if (code === 200) {
          this.centerExpressData = payload
        this.getnewGetAfterSaleProblem('', receivingType, afterSaleSource, productCode, 'afterSaleProblemId')
        }
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
    toTeachDeal(row) {
      this.editTypeStatus = 'toTeachDeal'
      this.info = {
        title: '确定转业务处理',
        instroduct: '将问题标记相应的协助处理对象'
      }
      this.complaintForm = toTeachDeal
      this.dialogNewVisible = true
      const optionList =
        row.channelPid === '1011' || row.channelPid === '1021'
          ? [
              {
                label: '转教务处理',
                value: row.channelPid === '1011' ? '0' : '5'
              },
              {
                label: '转教管处理',
                value: '1',
                disabled: true
              }
              // {
              //   label: '转财务处理',
              //   value: '5'
              // }
            ]
          : row.channelPid === '1031' ||
            row.channelPid === '1041' ||
            row.channelPid === '1051'
          ? [
              {
                label: '转销售处理',
                value: '3'
              },
              {
                label: '转教辅处理',
                value: '4'
              }
              // {
              //   label: '转财务处理',
              //   value: '5'
              // }
            ]
            : row.channelPid === '1071' ? [
              {
                label: '转销售处理',
                value: '3'
              }
              // {
              //   label: '转财务处理',
              //   value: '5'
              // }
            ] : []
      this.$nextTick(() => {
        // this.$refs.complaintForm.recoveryForm({ type: optionList[0].value })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            type: optionList
          }
        })
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
    // 发评论
    async setAfterSaleRemark(val) {
      const data = {
        complaintNo: this.data.complaintNo,
        currentStaffId: getToken('userId'),
        ...val
      }
      const res = await afterSaleRemark(data)
        if (res.code === 0) {
          this.cancel()
          Message.success('操作成功')
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
        }
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
        // 修改渠道来源
        this.setQuestion({ ...val, complaintNo })
      } else if (editTypeStatus === 'editStaffUser') {
        // 修改操作人
        this.setStaffUser(val)
      } else if (editTypeStatus === 'addRemark') {
        this.setRemark(val)
      } else if (editTypeStatus === 'editComplaint') {
        this.setHandle(val)
      } else if (editTypeStatus === 'setAccecpt') {
        this.invalidToUnaccecptFn(val)
      } else if (editTypeStatus === 'doVisit') {
        this.setDoVisit(val)
      } else if (editTypeStatus === 'toTeachDeal') {
        this.dialogNewVisibleSecondary = true
        this.ToTeachval = val
      } else if (editTypeStatus === 'addComment') {
        this.setAfterSaleRemark(val)
      } else if (editTypeStatus === 'addOneDisturb') {
        this.submitDisturbForm(val)
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
        const outTradeNoObj = this.outTradeNoData?.find(i => i.centerExpressId === val.centerExpressId)
        this.handleData({
          ...val,
          sync: val.sync === true ? '1' : '0', // 同步开关按钮
          workType: val.workType === '6' ? 4 : val.workType,
          complaintNo,
          cpStatus: status,
          expressId: outTradeNoObj?.value,
          currentStaffId: getToken('userId'),
          currentStaffName: getToken('cname'),
          currentStaffMobile: getToken('userMobile')
        })
      }
    },
    submitOption() {
      const { ToTeachval } = this
      this.setToTeachDeal(ToTeachval)
      this.dialogNewVisibleSecondary = false
      this.dialogNewVisible = false
    },
    setDoVisit(val) {
      const { handleComent, handleStatus, imgUrl, videoUrl } = val
      const { complaintNo } = this
      if (handleStatus === '70' || handleStatus === '71') {
        this.handleData({
          handleComent,
          complaintNo,
          cpStatus: handleStatus,
          currentStaffId: getToken('userId'),
          currentStaffName: getToken('cname'),
          currentStaffMobile: getToken('userMobile'),
          imgUrl: imgUrl,
          videoUrl: videoUrl
        })
        // 去解决
      } else {
        // 转为待解决
        this.invalidToUnaccecptFn({
          handleComent,
          cpStatus: handleStatus
        })
      }
    },
    // 投诉表单变化
    changeNewForm(val, oldVal) {
      if (val.channelPid !== oldVal.channelPid && oldVal.channelPid) {
         // 根据投诉来源获取投诉途径
         getBypid({ pid: val.channelPid }).then(res => {
           this.setChannel(res.payload, 'channelId', 'form')
            this.$refs.complaintForm.recoveryForm({
              channelId: '',
              problemPid: '',
              problemId: [],
              problemIdThree: '',
              problemIdFour: '',
              problemIdFive: ''
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
      const { channelId, problemPid, problemId, problemIdThree, problemIdFour, receivingType, afterSaleOrderId, afterSaleProblemId, afterSaleSource, productCode, feedbackCode } = val
       if (
        problemPid &&
        problemPid !== oldVal?.problemPid) {
        this.getProblemChild(problemPid, 'problemId')
      } else if (
        !this.workTypeFlag &&
        problemId?.toString() &&
        problemId?.toString() !== oldVal?.problemId?.toString()
      ) {
        this.$refs.complaintForm.set({
          type: 'options',
          data: { problemIdThree: [], problemIdFour: [], problemIdFive: [] }
        })
        this.$refs.complaintForm.recoveryForm({
          problemIdThree: '',
          problemIdFour: '',
          problemIdFive: ''
        })
        this.getProblemChild(problemId.toString(), 'problemIdThree')
      } else if (
        this.workTypeFlag &&
        (problemId &&
        problemId !== oldVal?.problemId)
      ) { // 修改售后来源时的售后类型发生改变触发请求获取对应的售后问题
        this.getAfterSaleProblemFn(this.data.channelPid, 'problemIdThree', channelId, problemId)
        if (problemId !== oldVal?.problemId && oldVal?.problemId) {
        this.$refs.complaintForm.recoveryForm({
          problemIdThree: ''
        })
        }
      } else if (
        !this.workTypeFlag &&
        receivingType &&
        receivingType !== oldVal?.receivingType
      ) { // 立即处理投诉转新售后时的售后类型发生改变触发请求获取对应的售后问题
        this.getnewGetAfterSaleProblem(afterSaleProblemId, receivingType, afterSaleSource, productCode, 'afterSaleProblemIdThree')
        if (receivingType !== oldVal?.receivingType && oldVal?.receivingType) {
        this.$refs.complaintForm.recoveryForm({
          afterSaleProblemIdThree: ''
        })
        }
      } else if (
        !this.workTypeFlag &&
        afterSaleProblemId &&
        afterSaleProblemId !== oldVal?.afterSaleProblemId
      ) { // 立即处理投诉转新售后时的售后类型发生改变触发请求获取对应的售后问题
        this.getnewGetAfterSaleProblem(afterSaleProblemId, receivingType, afterSaleSource, productCode, 'afterSaleProblemIdThree')
        if (afterSaleProblemId !== oldVal?.afterSaleProblemId && oldVal?.afterSaleProblemId) {
        this.$refs.complaintForm.recoveryForm({
          afterSaleProblemIdThree: ''
        })
        }
      } else if (
        problemIdThree?.toString() &&
        problemIdThree?.toString() !== oldVal.problemIdThree?.toString()
      ) {
        this.$refs.complaintForm.set({
          type: 'options',
          data: { problemIdFour: [], problemIdFive: [] }
        })
        this.$refs.complaintForm.recoveryForm({
          problemIdFour: '',
          problemIdFive: ''
        })
        this.getProblemChild(problemIdThree.toString(), 'problemIdFour')
      } else if (
        problemIdFour?.toString() &&
        problemIdFour?.toString() !== oldVal.problemIdFour?.toString()
      ) {
        this.$refs.complaintForm.set({
          type: 'options',
          data: { problemIdFive: [] }
        })
        this.$refs.complaintForm.recoveryForm({ problemIdFive: '' })
        this.getProblemChild(problemIdFour?.toString(), 'problemIdFive')
      } else if (
        afterSaleSource &&
        afterSaleSource !== oldVal.afterSaleSource
      ) {
        this.$refs.complaintForm.recoveryForm({
          afterSaleOrderId: '',
          productCode: '',
          afterSaleProblemId: '',
          afterSaleProblemIdThree: ''
        })
        this.getAllOrderList(afterSaleSource, 'afterSaleOrderId')
      } else if (
        afterSaleOrderId &&
        afterSaleOrderId !== oldVal.afterSaleOrderId
      ) {
        this.$refs.complaintForm.recoveryForm({
          productCode: '',
          afterSaleProblemId: '',
          afterSaleProblemIdThree: ''
        })
        this.getAllOrderList(afterSaleSource, 'productCode', afterSaleOrderId)
      } else if (
        productCode &&
        productCode !== oldVal.productCode
      ) {
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            buyTime: true
           }
        })
        const shopTime = this.productCodeList.filter(i => i.product.productCode === productCode)[0]?.product.buyTime
        this.$refs.complaintForm.set({
          type: 'defaultVal',
          data: {
            buyTime: moment(Number(shopTime)).format('YYYY-MM-DD HH:mm:ss'),
            afterSaleProblemId: '',
            afterSaleProblemIdThree: ''
           }
        })
        this.getCenterExpressId(receivingType, afterSaleSource, productCode)
      } else if (
        feedbackCode &&
        feedbackCode !== oldVal.feedbackCode
      ) {
        this.$refs.complaintForm.set({
          type: 'rules',
          data: {
            handleComentUser: [{ required: true, message: '请输入同步支付宝回复用户' }]
           }
        })
      }
      // 工单类型是新售后的时候显示新售后的表单选项
      if (val.workType === '6' && oldVal.workType && !this.workTypeFlag) {
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            afterSaleProblemId: true,
            afterSaleProblemIdThree: true,
            afterSaleOrderId: true,
            afterSaleSource: true,
            productCode: true,
            // buyTime: true,
            receivingType: true
           }
        })
        this.$refs.complaintForm.set({
          type: 'options',
          data: {
            afterSaleSource: [
           {
             label: 'APP订单',
             value: '1'
           },
           {
             label: '积分商城',
             value: '2',
             disabled: this.data.channelPid === '2011'
           }
         ]
           }
        })
      } else if (val.workType !== '6' && oldVal.workType && !this.workTypeFlag) { // 工单类型不是新售后
        this.$refs.complaintForm.set({
          type: 'visible',
          data: {
            afterSaleProblemId: false,
            afterSaleProblemIdThree: false,
            afterSaleOrderId: false,
            afterSaleSource: false,
            productCode: false,
            buyTime: false,
            receivingType: false
           }
        })
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
    // 特殊限制人员
    actionExpiredFn(val, callBack) {
      const { centerExpressData, afterSaleProblemCache } = this
      const asTypeFind = afterSaleProblemCache.find(i => i.value === val.afterSaleProblemId)
      const asType = AS_TYPE_MAP[asTypeFind?.asType]
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
    // 调取处理接口
    handleData(data) {
        if (this.workTypeFlag) { // 新售后工单的立即处理
          afterAcceptComplaint(data).then(res => {
           this.cancel()
           this.$message.success('操作成功')
           this.getComplain()
           this.getComplaintRecords()
          })
        } else { // 投诉单的立即处理
        const { centerExpressData, productCodeList, afterSaleProblemCache, specialPermission, data: { userId }} = this

        const productData = productCodeList.find(i => i.product.productCode === data.productCode)?.product

        const complaintTypeFind = afterSaleProblemCache.find(i => i.value === data.afterSaleProblemId)
        const newData = {
          ...data,
          ...centerExpressData,
          productName: productData?.productName,
          productImg: productData?.picUrl,
          orderId: productData?.orderId,
          userId,
          refundAmount: centerExpressData?.payment,
          cash: centerExpressData.currency === 5 ? centerExpressData?.rmbAmount : 0, // 组合支付传现金
          expressCenterId: centerExpressData?.centerExpressId,
          complaintType: specialPermission ? AS_TYPE_MAP[complaintTypeFind?.asType] : complaintTypeFind?.complaintType,
          expressId: productData?.expressId
        }
        if (newData.workType === 4 && !centerExpressData?.centerExpressId) {
          return this.$message.error('物流编号不存在，不支持转售后')
        } else {
          delete newData.expiredFlagMap
         // 特殊权限人&&转新售后操作 可提示
         if (specialPermission && newData.workType === 4) {
           this.actionExpiredFn(newData, () => {
            newData.exceedStandard = 1
            this.acceptComplaintFn(newData)
           })
          } else {
            newData.exceedStandard = 0
            this.acceptComplaintFn(newData)
          }
         }
        }
    },
    acceptComplaintFn(newData) {
      acceptComplaint(newData).then(res => {
        this.cancel()
        this.$message.success('操作成功')
        this.acceptFirst()
        this.getComplain()
        this.getComplaintRecords()
        this.getStaffUserList()
      })
    },
    // 处理问题类型
    setQuestion(val) {
      const arr = [
        'problemId',
        'problemIdThree',
        'problemIdFour',
        'problemIdFive'
      ]
      arr.map((res) => {
        if (Array.isArray(val[res])) {
          val[res] = val[res].toString()
        } else if (val[res]) {
          val[res]
        }
      })
      if (!val.problemIdThree) {
        val.problemIdFour = ''
        val.problemIdFive = ''
      } else if (!val.problemIdFour) {
        val.problemIdFive = ''
      }
      const data = {
        ...val,
        businessId: val.channelPid ? val.channelPid?.slice(0, 3) : '',
        staffId: getToken('userId'),
        staffName: getToken('cname'),
        staffMobile: getToken('userMobile'),
        workType: this.workTypeFlag ? 4 : '',
        channelPid: this.workTypeFlag ? this.data.channelPid : val.channelPid
      }
      // 修改渠道来源接口
      updateSourceProblem(data).then((res) => {
        this.cancel()
        this.$message.success('操作成功')
        this.acceptFirst()
        this.getComplain()
        this.getComplaintRecords()
        this.getStaffUserList()
      })
    },
    createWorkOrder() {
      const { data, subjectsObj, cworkType } = this
      this.dialogWorkOrder = true
      this.acceptFirst()
      let problemOneLevelData = []
      if (subjectsObj[data.channelPid]) {
        // 小熊展示 技术问题/用户建议/质检工单/售后工单
        problemOneLevelData = cworkType.filter(val => val.value !== '1')
      } else {
        // 1v1小班课展示 质检工单/售后工单
        problemOneLevelData = cworkType.filter(val => !['1', '2', '3'].includes(val.value))
      }
      const keys = [
        'cpComent',
        'priority',
        'problemOneLevel',
        'problemTwoLevel',
        'problemThreeLevel',
        'userRemarkContent',
        'workUrl',
        'videoUrl'
      ]
      const recoveryObj = {}
      Object.keys(this.data).forEach((v) => {
        if (keys.includes(v)) {
          recoveryObj[v] = this.data[v] && this.data[v] + ''
        }
      })
      let newWorkUrl = null
      if (this.recordsUser[0].imgUrl) {
        newWorkUrl = this.recordsUser[0].imgUrl.split(',').map((v) => {
          return { name: v.split('/')[v.split('/').length - 1], url: v }
        })
      }
      let newvideoUrl = null
      if (this.recordsUser[0].videoUrl) {
        newvideoUrl = this.recordsUser[0].videoUrl.split(',').map((v) => {
          return { name: v.split('/')[v.split('/').length - 1], url: v }
        })
      }
      this.$nextTick(() => {
        this.$refs.workOrderRef.recoveryForm(
          { ...recoveryObj, workUrl: newWorkUrl || [], videoUrl: newvideoUrl?.concat([{}]) || [{}] },
          true
        )
       this.$refs.workOrderRef?.set({
          type: 'options',
          data: {
            problemOneLevel: problemOneLevelData
          }
       })
       this.$refs.workOrderRef?.set({
          type: 'defaultVal',
          data: {
            problemOneLevel: problemOneLevelData[0]?.value
          }
       })
      })
    },
    // 一键创建工单
    onFormSubmit(values) {
      if (!createUserId) {
        this.$message.warning('请确认当前登录人信息是否正确～')
        return
      }
      values = Object.assign(this.data, values)

      const keys = [
        'complaintNo',
        'priority',
        'problemOneLevel',
        'problemTwoLevel',
        'problemThreeLevel',
        'currentStaffId'
      ]
      const queryObj = {}
      Object.keys(values).forEach((v) => {
        if (keys.includes(v)) {
          queryObj[v] = values[v]
        }
      })
      queryObj['currentStaffName'] = this.name
      queryObj['currentStaffMobile'] = createUserMobile
      queryObj['cpComent'] = values.cpComent
      queryObj['channelPid'] = values.channelPid
      queryObj['dingUserName'] = values.dingUserName
      queryObj['userRemarkContent'] = values.userRemarkContent
      queryObj['workUrl'] = values.workUrl?.length
        ? values.workUrl?.map((v) => v.url).join(',')
        : ''
      if (values.videoUrl?.length) {
        queryObj.videoUrl = values.videoUrl.reduce((str, item) => {
          if (item.url) {
            return str ? `${str},${item.url}` : item.url
          } else {
            return str
          }
        }, '')
      } else {
        queryObj.videoUrl = ''
      }
      queryObj.problemOneLevel = Number(queryObj.problemOneLevel - 1) + ''
        // 用户建议是2 所以没有二级三级参数
      queryObj.problemTwoLevel = queryObj.problemOneLevel === '2' ? '' : queryObj.problemTwoLevel
      queryObj.problemThreeLevel = queryObj.problemOneLevel === '2' ? '' : queryObj.problemThreeLevel
      createWorkOrderOnce(queryObj).then((res) => {
        if (res?.code === 0) {
          this.cancel()
          this.$message.success('创建成功～')
          this.acceptFirst()
          this.getComplain()
          this.getComplaintRecords()
          this.getStaffUserList()
          this.dialogWorkOrder = false
        }
      })
    },
    cancelForm() {
      this.dialogWorkOrder = !this.dialogWorkOrder
    },
    onFormChange(val, oldVal) {
        // 质检工单默认文案
        if ((val.problemOneLevel !== oldVal.problemOneLevel && oldVal.problemOneLevel) || (val.problemOneLevel !== oldVal.problemOneLevel)) {
        const artServiceLine = ['1031', '1041', '1051', '1071', '1081', '2011']
        const oneVoneorClassServiceLine = ['1011', '1012', '1021', '1022']
        let second_mapData_2 = []
        let second_mapData_4 = []
        let second_mapData_5 = []
        let three_mapData_51 = []
        if (artServiceLine.includes(this.data.channelPid)) { // 这5个业务线 二级分类： 投诉销售 投诉教辅 投诉客服
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '52', '53'].includes(item.value))
          second_mapData_5 = work_order_second_map['5'].filter(item => ['101'].includes(item.value))
          three_mapData_51 = work_order_classification_map['51']
          if (this.data.channelPid === '1031' || this.data.channelPid === '2011') { // 小熊美术业务线显示小熊美术app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['11'].includes(item.value))
          } else if (this.data.channelPid === '1051') { // 小熊音乐业务线显示小熊音乐app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['14'].includes(item.value))
          } else { // 其他业务线显示小熊boss和其他
            second_mapData_2 = work_order_second_map['2'].filter(item => ['12', '13'].includes(item.value))
          }
        } else if (oneVoneorClassServiceLine.includes(this.data.channelPid)) { // 小班课 1v1 二级分类：投诉销售 投诉班主任 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '54', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        } else if (this.data.channelPid === '1061') { // 书画院 二级分类：投诉销售 投诉学管 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '56', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        }
        this.second_map = {
          '2': second_mapData_2,
          '4': second_mapData_4,
          '5': second_mapData_5
        }
        this.three_map = {
          ...work_order_classification_map,
          '51': three_mapData_51
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
            const cpComent4 = '示例：销售 小红 在 2021.11.11 10:00 与用户沟通，擅自解散群'
            const cpComentRest = `示例：\n 用户设备：红米手机；Redmi K20 Pro \n APP版本号/浏览器版本：V2.8.0\n 操作异常时间：2021.09.12 12:01\n 操作路径：首页-免费领课-分享海报至朋友圈得赠课,点击分享报错\n 报错信息: 网络异常 `
            this.$refs.workOrderRef?.set({
               type: 'defaultVal',
               data: {
                 cpComent: this.data.cpComent || (val.problemOneLevel === '4' ? cpComent4 : cpComentRest)
               }
             })
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
        if ((val.problemTwoLevel !== oldVal.problemTwoLevel && oldVal.problemTwoLevel) || (val.problemTwoLevel !== oldVal.problemTwoLevel && val.problemTwoLevel)) {
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
    // 其他信息打开客服聊天或者通话记录
    openRecord() {
        this.recorddDalogVisible = true
    },
    // 提交勿扰标签的表单二次确认
    submitDisturbForm(values) {
      this.$confirm(
        '<span style="color:red">数据将进行过滤，请谨慎操作</span>',
        '是否确认提交？',
        {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.addOrUpdateObNotDisturbNewFn(values)
      })
    },
    // 提交勿扰标签的表单
    addOrUpdateObNotDisturbNewFn(values) {
      delete values.videoUrl
      const newData = { ...values }
      newData.types = values.types.toString()
      newData.cname = getToken('cname')
      newData.cmobile = getToken('userMobile')
      newData.uid = getToken('userId')
      newData.complaintNo = this.data.complaintNo
      newData.effectDays = +values.effectDays
      newData.mobiles = values.mobiles.replace(/\n/g, ',')
      newData.origin = 4
      newData.ctype = 4
      newData.categories = []
      values.categories.map(val => {
        if ([1, 2].includes(val)) {
          newData.categories.push('30-' + val)
        } else if ([3, 4, 5, 6].includes(val)) {
          newData.categories.push('31-' + val)
        } else {
          newData.categories.push(String(val))
        }
      })
      newData.infos = []
      categorieDatas.map(val => {
        if (values.categories.includes(val.value)) {
          if (values.types.includes(1)) {
            newData.infos.push(val.label + '营销短信勿扰')
          }
          if (values.types.includes(2)) {
            newData.infos.push(val.label + '营销电话勿扰')
          }
        }
      })
      addOrUpdateObNotDisturbNew(newData).then((res) => {
        if (res?.code === 0) {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
        }
        this.getComplaintRecords()
      })
      this.dialogNewVisible = false
    },
    // 打开添加黑名单的弹框
    addOneDisturbFn() {
      this.editTypeStatus = 'addOneDisturb'
        this.info = {
          title: '加入勿扰'
        }
      this.complaintForm = disturbForm
      this.dialogNewVisible = true
        this.$nextTick(() => {
          this.$refs.complaintForm.set({
            type: 'defaultVal',
            data: { mobiles: this.data.userCallMobile }
          })
        })
    },
   // 打开机器人回访
    async openRobotDetail(val, type) {
      // type 0机器人回访 1 机器人回访详情
      this.RobotType = type
      this.robotFlag = true
    },
    // 获取机器人回访模板ID 拨打的手机号 是否是拨打后回访的状态
    async getCallRequestData() {
      const data = {
        complaintNo: this.id
      }
     const res = await getCallRequest(data)
     const { code, payload: { status }} = res
     if (code === 0) {
       //  status  0、没有拨打 1、打过
       this.actionObj.status = status
     }
    },
    // 弹出添加待办信息
    addBacklogFn(row) {
    this.complaintNo = row.complaintNo
    this.backlogFlag = true
    },
   // 点击查看审批详情 跳入我的审批
   lookExamine() {
     if (this.data.userCallMobile && this.data.channelPid) {
       this.$router.push({
         name: 'MyExamine',
         params: {
           userTel: this.data.userCallMobile,
           key: this.data.channelPid
         }
        })
     } else {
       this.$message.error('投诉单手机号未获取，无法跳转~')
     }
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
  //   查看原投诉单或者查看新售后工单
  lookWorkOrder() {
    const { relationComplaintNo } = this.data
    if (this.workTypeFlag) {
      window.open(`${location.protocol}//${location.host}/workOrder/detail/${relationComplaintNo}`)
    } else {
      window.open(`${location.protocol}//${location.host}/workOrder/newAfterSaleDetail/${relationComplaintNo}`)
    }
  },
   // 查看当前客服是否在小熊boss上有账号
     getFindStaffByMobile(callBack) {
       const loading = this.$loading({
          lock: true
        })
         findStaffByMobile({
          mobile: getToken('userMobile')
        }).then(res => {
           loading.close()
           const { payload } = res
           if (payload?.id) {
               callBack()
           } else {
             this.$alert('当前账号与小熊boss后台账号手机号不一致，请先修改账号~', '', {
               confirmButtonText: '知道了',
               dangerouslyUseHTMLString: true
             })
           }
        }).catch(err => {
          loading.close()
          this.$message.error(err, '获取失败')
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
   // 打开创建赔付审批弹出
  approvalClaimsFn: debounce(async function(row) {
    await this.getCheck(() => {
    this.claimsFlag = true
    })
  }, 500),
   // // 打开创建退款审批弹出
   approvalRefundFn(row) {
    this.getFindStaffByMobile(() => {
    this.complaintNo = row.complaintNo
    this.refundFlag = true
    })
   },
   // 打开创建补发货审批
   approvalRepairFn(row) {
    this.getFindStaffByMobile(() => {
    this.complaintNo = row.complaintNo
    this.repairFlag = true
    })
   },
   // 获取当前节点流程
   async turnTeachingFn() {
     const res = await checkTeachingAids({
       complaintNo: this.data.complaintNo
     })
     const { code, payload: { checkAids, cpStatus, cpStatusSub }} = res
     if (code === 0) {
       //  0没有转教辅 1转教辅
       this.checkAids = checkAids
       this.timeData = {
         ...res.payload
       }
       this.stepcpStatus = cpStatus
       this.stepcpStatusSub = cpStatusSub
     }
   },
    // 列表点击循环变颜色
    clickFlag() {
      const { flagSign, complaintNo } = this.data
      const index = this.flagSignColordata[flagSign < 0 || flagSign >= 3 ? 0 : flagSign + 1]
      this.data.flagSign = this.flagSignColordata.indexOf(index)
      const indexflagSign = flagSign < 0 || flagSign >= 3 ? 0 : flagSign + 1
      // 改变小彩旗的颜色
      updateFlagSign({
        complaintNo: complaintNo,
        flagSign: indexflagSign
      }).then(res => {
        console.log(res, 'res')
      })
    },
    // 排序记录
    recordSort(val) {
      this.recordSortFlag = !val
      this.getComplaintRecords()
    },
    // 查看订单抽屉
    lookOrderForm() {
      this.$nextTick(async() => {
        this.orderFormFlag = true
      })
    },
    openClaimsHistoryFlag() {
      this.claimsHistoryFlag = true
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
  .step_style{
    margin-top:20px;
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
  .logistics-style{
    display: flex;
    align-items: center;
      .el-input{
        width: 28%;
      }
      .el-select{
        width: 28%;
      }
  }
  .complain-detail-list-tag {
    font-weight: 500;
    padding-right: 20px;
  }
  .complain-detail-text{
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
  // justify-content: space-between;
  // margin-right: 30px;
  flex-wrap: wrap;
  width: 550px;
  img {
    position: absolute;
    display: block;
    // width: auto;
    height: 100%;
    // margin: 0 auto;
    // margin-right: 20px;
    margin-top: 14px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  // .el-image{
  //   margin-top: 15px;
  // }
}
.complain-act {
  width: 500px;
  display: flex;
  align-items: center;
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
  min-height: 36px;
  // padding: 10px;
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
.complain-act-resolve {
  width: 500px;
  // display: flex;
  // align-items: center;
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
  min-height: 36px;
  padding: 10px;
  border-radius: 4px;
  margin: 14px 0 0 0;
  span {
    padding: 10px 0;
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
.back-cont {
  color: #999999;
  font-weight: 300;
}
.back {
  cursor: pointer;
  font-size: 22px;
  color: #333333;
  vertical-align: middle;
  &:hover {
    color: #1890ff;
  }
}
.detail-action{
  text-align: right;
  margin-bottom: 20px;
  button{
    margin-bottom: 10px;
  }
}
.detail-action-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sort-icon{
    margin-left: 357px;
    display: inline-block;
    height: 100%;
    font-size: 18px;
    .sorts{
      cursor: pointer;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      color: #bfbfbf;
      .drop{
        position: relative;
        top: -14px;
      }
    }
    .sortactive{
      color: #409eff;
    }
}
.complaint-form-box {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
    .form-item-element{
      width: 100% !important;
    }
  }
.PayPalStyle{
  color: red;
  padding: 0 25px;
}
}
.form-item {
  /deep/ {
    .el-form-item__label {
      width: 120px !important;
    }
  }
}

</style>
