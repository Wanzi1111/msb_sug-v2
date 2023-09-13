<template>
  <div>
    <div class="title-container">
      <basics-title
        title="物流数据"
        line
        :actions="[
          {
            type: 'button', // 按钮
            label: '创建物流单',
            click: () => jump('ExpressManageCreate'),
            attr: {
              type: 'primary',
              plain: true,
              icon: 'el-icon-plus'
            }
          },
          {
            type: 'button', // 按钮
            label: '批量导入物流单',
            click: () => jump('ExpressManageBatch'),
            attr: {
              type: 'primary',
              plain: true,
              icon: 'el-icon-finished'
            }
          }
        ]"
      />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._logistics_order_queryOrder" :searchs="searchs" @changeSearch="changeSearch" @submitSearch="submitSearch" />
      <el-tabs v-model="activeState">
        <el-tab-pane v-for="(item, index) in stateList" :key="index" :label="item.label" :name="item.value" :disabled="loadings._logistics_order_queryOrder" />
      </el-tabs>
      <basics-action :actions="act" />
      <basics-table
        :key="tableKey"
        ref="table"
        :table="table"
        :loading="loadings._logistics_order_queryOrder"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actions"
        @selection-change="handleSelectionChange"
      >
        <template slot="order" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.orderNo }}</div>
          <div class="columns-note">{{ scope.row.createTime }}</div>
        </template>
        <template slot="product" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.productCode }}</div>
          <div class="columns-note">{{ scope.row.productName }}</div>
        </template>
        <template slot="consignee" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.consigneeName }}&ensp;{{ scope.row.consigneeMobile }}</div>
          <div class="columns-note">{{ scope.row.address }}</div>
        </template>
        <template slot="supplier" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.shipment }}</div>
          <div class="columns-note">{{ scope.row.supplierName }} - {{ scope.row.warehouseName }}</div>
        </template>
        <template slot="express" slot-scope="scope">
          <div class="columns-txt">{{ scope.row.trackingNum }}</div>
          <div class="columns-note">{{ scope.row.expressName }}</div>
        </template>
        <template slot="status" slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.REVIEW" type="warning" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.REVIEW_LABEL }}</el-tag>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.DELIVERED" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.DELIVERED_LABEL }}</el-tag>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.SHIPPED" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.SHIPPED_LABEL }}</el-tag>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.COMPLETED" type="success" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.COMPLETED_LABEL }}</el-tag>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.CANCELLED" type="info" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.CANCELLED_LABEL }}</el-tag>
            <el-tag v-if="scope.row.status === EXPRESS_TYPE.FAILED" type="danger" @click="() => tableAction(scope.row.status, scope.row, scope.$index, 'deliver')">{{ EXPRESS_TYPE.FAILED_LABEL }}</el-tag>
          </div>
          <!--          <div>出库完成，等待第三方物流返回单号</div>-->
        </template>
      </basics-table>
      <!-- 关联订单 -->
      <el-dialog
        title="关联订单"
        :visible.sync="dlState.order"
        width="500px"
        :before-close="() => closeDl('order')"
      >
        <div v-loading="loadings._logistics_order_queryRelatedOrder" class="order-dl">
          <p class="item">
            <span class="key">订单号</span>
            <span class="value">{{ detail.orderNo }}</span>
          </p>
          <p class="item">
            <span class="key">订单来源</span>
            <span class="value">{{ detail.businessName }}</span>
          </p>
          <p class="item">
            <span class="key">关联用户ID</span>
            <span class="value">{{ detail.relatedOrderNo || '-' }}</span>
          </p>
        </div>
      </el-dialog>
      <!-- 查看物流详情 -->
      <el-dialog
        title="查看物流详情"
        :visible.sync="dlState.deliver"
        width="640px"
        :before-close="() => closeDl('deliver')"
      >
        <div :key="dlState.deliver" v-loading="loadings._logistics_order_queryOrderStatusByOrderNo">
          <div v-if="Object.keys(actRow).length" class="deliver-dl">
            <el-row>
              <el-col :span="12">
                <p><span class="label">单号：</span>{{ actRow.orderNo }}</p>
              </el-col>
              <el-col :span="12">
                <p><span class="label">快递公司：</span>{{ actRow.expressName }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <p><span class="label">状态：</span>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.REVIEW" size="small" type="warning">{{ EXPRESS_TYPE.REVIEW_LABEL }}</el-tag>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.DELIVERED" size="small">{{ EXPRESS_TYPE.DELIVERED_LABEL }}</el-tag>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.SHIPPED" size="small">{{ EXPRESS_TYPE.SHIPPED_LABEL }}</el-tag>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.COMPLETED" size="small" type="success">{{ EXPRESS_TYPE.COMPLETED_LABEL }}</el-tag>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.CANCELLED" size="small" type="info">{{ EXPRESS_TYPE.CANCELLED_LABEL }}</el-tag>
                  <el-tag v-if="actRow.status === EXPRESS_TYPE.FAILED" size="small" type="danger">{{ EXPRESS_TYPE.FAILED_LABEL }}</el-tag>
                </p>
              </el-col>
              <el-col :span="12">
                <p><span class="label">快递单号：</span>{{ actRow.trackingNum }}</p>
              </el-col>
            </el-row>
          </div>
          <el-timeline class="time-item">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.orderStatus === '待收货' ? 'el-icon-truck' : ''"
              :type="index === activities.length - 1 ? 'primary' : ''"
              :color="activity.orderStatus === '待收货' ? '#0bbd87' : ''"
              :size="activity.orderStatus === '待收货' ? 'large' : 'normal'"
              :class="index-1< 0 || activity.orderStatus !== activities[index-1].orderStatus ? 'max-timeline': ''"
            >
              <div v-if="activity.orderStatus && (index-1< 0 || activity.orderStatus !== activities[index-1].orderStatus)" style="color: #333; font-size: 16px;line-height: 1.5">{{ activity.orderStatus }}</div>
              <div v-if="activity.note" style="color: #666; font-size: 14px;line-height: 1.5">{{ activity.note }}</div>
              <div class="time">
                <p class="day">{{ moment(activity.thirdCreateTime).format('MM/DD') }}</p>
                <p class="">{{ moment(activity.thirdCreateTime).format('HH:mm:ss') }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
      <!-- 审核物流单 -->
      <el-dialog
        title="审核物流单"
        :visible.sync="dlState.examine"
        width="600px"
        :before-close="() => closeDl('examine')"
      >
        <div :key="dlState.examine" class="examine-dl">
          <div class="info">
            <p class="item">
              <span class="key">物流单信息</span>
              <span class="value">{{ actRow.orderNo }} 待审核 {{ actRow.createTime }}</span>
            </p>
            <p class="item">
              <span class="key">商品名称</span>
              <span class="value value-weight">{{ actRow.productCode }} {{ actRow.productName }}</span>
            </p>
            <div class="item">
              <span class="key">收件人信息</span>
              <p class="value value-near">
                <span class="value-block">{{ actRow.consigneeName }} {{ actRow.consigneeMobile }}</span>
                <span class="value-block">{{ actRow.address }}</span>
              </p>
            </div>
          </div>
          <div class="form">
            <el-form ref="examineForm" :model="examineForm" label-width="100px">
              <el-form-item label="是否通过" prop="ex" :rules="[{ required: true, message: '请选择是否通过', trigger: 'blur' }]">
                <el-radio-group v-model="examineForm.ex">
                  <el-radio :label="1">审核通过</el-radio>
                  <el-radio :label="2">审核失败</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="examineForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_mpOrderVerify" type="primary" @click="submitForm('examineForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('examine')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 批量审核物流单 -->
      <el-dialog
        title="批量审核物流单"
        :visible.sync="dlState.allExamine"
        width="600px"
        :before-close="() => closeDl('allExamine')"
      >
        <div class="examine-dl">
          <div class="info all-examine">
            <p v-for="(item, index) in actRowList" :key="index" class="item">
              <span class="value-all">物流单信息{{ index + 1 }}</span>
              <span class="value-all">{{ item.orderNo }}</span>
              <span class="value-all">{{ item.createTime }}</span>
            </p>
          </div>
          <div class="form">
            <el-form ref="allExamineForm" :model="allExamineForm" label-width="100px">
              <el-form-item label="是否通过" prop="ex" :rules="[{ required: true, message: '请选择是否通过', trigger: 'blur' }]">
                <el-radio-group v-model="allExamineForm.ex">
                  <el-radio :label="1">审核通过</el-radio>
                  <el-radio :label="2">审核失败</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="allExamineForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_mpOrderVerify" type="primary" @click="submitForm('allExamineForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('allExamine')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 撤回物流单 -->
      <el-dialog
        title="撤回"
        :visible.sync="dlState.back"
        width="600px"
        :before-close="() => closeDl('back')"
      >
        <div class="examine-dl">
          <div class="info">
            <p class="item">
              <span class="key">物流单信息</span>
              <span class="value">{{ actRow.orderNo }}  已取消 {{ actRow.createTime }}</span>
            </p>
            <p class="item">
              <span class="key">商品名称</span>
              <span class="value value-weight">{{ actRow.productCode }} {{ actRow.productName }}</span>
            </p>
            <div class="item">
              <span class="key">收件人信息</span>
              <p class="value value-near">
                <span class="value-block">{{ actRow.consigneeName }} {{ actRow.consigneeMobile }}</span>
                <span class="value-block">{{ actRow.address }}</span>
              </p>
            </div>
          </div>
          <div class="form">
            <el-form ref="backForm" :model="backForm" label-width="100px">
              <el-form-item label="撤回原因" prop="ex" :rules="[{ required: true, message: '请选择撤回原因', trigger: 'blur' }]">
                <el-select v-model="backForm.ex" style="width: 220px" filterable placeholder="请选择撤回原因">
                  <el-option v-for="(item, index) in BACK_TYPE" :key="index" :label="item" :value="item" />
                </el-select>
                <el-checkbox v-model="isChargeBack" style="marginLeft: 20px">系统撤单返还</el-checkbox>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="backForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" type="primary" @click="submitForm('backForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('back')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 批量撤回物流单 -->
      <el-dialog
        title="批量撤回"
        :visible.sync="dlState.allBack"
        width="600px"
        :before-close="() => closeDl('allBack')"
      >
        <div class="examine-dl">
          <div class="info all-examine">
            <p v-for="(item, index) in actRowList" :key="index" class="item">
              <span class="value-all">物流单信息{{ index + 1 }}</span>
              <span class="value-all">{{ item.orderNo }}</span>
              <span class="value-all">{{ item.createTime }}</span>
            </p>
          </div>
          <div class="form">
            <el-form ref="allBackForm" :model="allBackForm" label-width="100px">
              <el-form-item label="撤回原因" prop="ex" :rules="[{ required: true, message: '请选择撤回原因', trigger: 'blur' }]">
                <el-select v-model="allBackForm.ex" style="width: 220px" placeholder="请选择撤回原因">
                  <el-option v-for="(item, index) in BACK_TYPE" :key="index" :label="item" :value="item" />
                </el-select>
                <el-checkbox v-model="isChargeBack" style="marginLeft: 20px">系统撤单返还</el-checkbox>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="allBackForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" type="primary" @click="submitForm('allBackForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('allBack')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 回填单号 -->
      <el-dialog
        title="回填单号"
        :visible.sync="dlState.returns"
        width="600px"
        :before-close="() => closeDl('returns')"
      >
        <div class="examine-dl">
          <div class="info">
            <p class="item">
              <span class="key">物流单信息</span>
              <span class="value">{{ actRow.orderNo }} 待发货 {{ actRow.createTime }}</span>
            </p>
            <p class="item">
              <span class="key">商品名称</span>
              <span class="value value-weight">{{ actRow.productCode }} {{ actRow.productName }}</span>
            </p>
            <div class="item">
              <span class="key">收件人信息</span>
              <p class="value value-near">
                <span class="value-block">{{ actRow.consigneeName }} {{ actRow.consigneeMobile }}</span>
                <span class="value-block">{{ actRow.address }}</span>
              </p>
            </div>
          </div>
          <div class="form">
            <el-form ref="returnsForm" :model="returnsForm" label-width="100px">
              <el-form-item label="快递公司" prop="expressCode" :rules="[{ required: true, message: '请选择快递公司', trigger: 'blur' }]">
                <el-select v-model="returnsForm.expressCode" style="width: 220px" placeholder="请选择快递公司">
                  <el-option
                    v-for="item in expressCode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="快递单号" prop="trackingNum" :rules="[{ required: true, message: '请输入快递单号', trigger: 'blur' }]">
                <el-input v-model="returnsForm.trackingNum" style="width: 220px" placeholder="请输入快递单号" maxlength="20" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_backFillTrackingNum" type="primary" @click="submitForm('returnsForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('returns')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 批量回填单号 -->
      <el-dialog
        title="批量回填单号"
        :visible.sync="dlState.imports"
        width="600px"
        :before-close="() => closeDl('imports')"
      >
        <el-form ref="importsForm" label-width="100px">
          <el-form-item label="导入数据">
            <upload
              ref="upload"
              :upload-api="importBackFillData"
              tip="支持扩展名：.xls,.xlsx 且不超过1M"
              :media-rules="{
                size: 1,
                type: '.xls,.xlsx'
              }"
              @uploadEnd="uploadEnd"
            />
          </el-form-item>
          <br>
          <el-form-item>
            <el-button icon="el-icon-check" :loading="loadings._logistics_manage_importBackFillData" type="primary" @click="nowUp">立即上传</el-button>
            <el-button icon="el-icon-close" @click="closeDl('imports')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 重新审核发货 -->
      <el-dialog
        title="重新审核发货"
        :visible.sync="dlState.againExamine"
        width="600px"
        :before-close="() => closeDl('againExamine')"
      >
        <div class="examine-dl">
          <div class="info">
            <p class="item">
              <span class="key">物流单信息</span>
              <span class="value">{{ actRow.orderNo }} 已取消 {{ actRow.createTime }}</span>
            </p>
            <p class="item">
              <span class="key">商品名称</span>
              <span class="value value-weight">{{ actRow.productCode }} {{ actRow.productName }}</span>
            </p>
            <div class="item">
              <span class="key">收件人信息</span>
              <p class="value value-near">
                <span class="value-block">{{ actRow.consigneeName }} {{ actRow.consigneeMobile }}</span>
                <span class="value-block">{{ actRow.address }}</span>
              </p>
            </div>
          </div>
          <div class="form">
            <el-form ref="againExamineForm" :model="againExamineForm" label-width="120px">
              <el-form-item label="是否重审发货" prop="ex" :rules="[{ required: true, message: '请选择是否通过', trigger: 'blur' }]">
                <el-radio-group v-model="againExamineForm.ex">
                  <el-radio :label="3">重审发货</el-radio>
                  <el-radio :label="4">重审修改</el-radio>
                  <el-radio :label="5">用户已签收</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="againExamineForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_mpOrderVerify" type="primary" @click="submitForm('againExamineForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('againExamine')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 批量重新审核发货 -->
      <el-dialog
        title="批量重新审核发货"
        :visible.sync="dlState.allAgainExamine"
        width="600px"
        :before-close="() => closeDl('allAgainExamine')"
      >
        <div class="examine-dl">
          <div class="info all-examine">
            <p v-for="(item, index) in actRowList" :key="index" class="item">
              <span class="value-all">物流单信息{{ index + 1 }}</span>
              <span class="value-all">{{ item.orderNo }}</span>
              <span class="value-all">{{ item.createTime }}</span>
            </p>
          </div>
          <div class="form">
            <el-form ref="allAgainExamineForm" :model="allAgainExamineForm" label-width="120px">
              <el-form-item label="是否重审发货" prop="ex" :rules="[{ required: true, message: '请选择是否通过', trigger: 'blur' }]">
                <el-radio-group v-model="allAgainExamineForm.ex">
                  <el-radio :label="3">重审发货</el-radio>
                  <el-radio :label="4">重审修改</el-radio>
                  <el-radio :label="5">用户已签收</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input v-model="allAgainExamineForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_mpOrderVerify" type="primary" @click="submitForm('allAgainExamineForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('allAgainExamine')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 取消物流单 -->
      <el-dialog
        title="取消物流单"
        :visible.sync="dlState.cancel"
        width="600px"
        :before-close="() => closeDl('cancel')"
      >
        <div :key="dlState.cancel" class="examine-dl">
          <div class="info">
            <p class="item">
              <span class="key">物流单信息</span>
              <span class="value">{{ actRow.orderNo }} 待审核 {{ actRow.createTime }}</span>
            </p>
            <p class="item">
              <span class="key">商品名称</span>
              <span class="value value-weight">{{ actRow.productCode }} {{ actRow.productName }}</span>
            </p>
            <div class="item">
              <span class="key">收件人信息</span>
              <p class="value value-near">
                <span class="value-block">{{ actRow.consigneeName }} {{ actRow.consigneeMobile }}</span>
                <span class="value-block">{{ actRow.address }}</span>
              </p>
            </div>
          </div>
          <div class="form">
            <el-form ref="cancelForm" :model="cancelForm" label-width="100px">
              <el-form-item label="取消原因" prop="ex" :rules="[{ required: true, message: '请选择取消原因', trigger: 'blur' }]">
                <el-select v-model="cancelForm.ex" style="width: 220px" filterable placeholder="请选择取消原因">
                  <el-option v-for="(item, index) in CANCEL_TYPE" :key="index" :label="item" :value="item" />
                </el-select>
                <el-checkbox v-model="isCancelBack" style="marginLeft: 20px">系统取消返还</el-checkbox>
              </el-form-item>
              <el-form-item label="备注" prop="desc">
                <el-input v-model="cancelForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_cancelOrder" type="primary" @click="submitForm('cancelForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('cancel')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!-- 批量取消物流单 -->
      <el-dialog
        title="批量取消物流单"
        :visible.sync="dlState.allCancel"
        width="600px"
        :before-close="() => closeDl('allCancel')"
      >
        <div :key="dlState.allCancel" class="examine-dl">
          <div class="info all-examine">
            <p v-for="(item, index) in actRowList" :key="index" class="item">
              <span class="value-all">物流单信息{{ index + 1 }}</span>
              <span class="value-all">{{ item.orderNo }}</span>
              <span class="value-all">{{ item.createTime }}</span>
            </p>
          </div>
          <div class="form">
            <el-form ref="allCancelForm" :model="allCancelForm" label-width="100px">
              <el-form-item label="取消原因" prop="ex" :rules="[{ required: true, message: '请选择取消原因', trigger: 'blur' }]">
                <el-select v-model="allCancelForm.ex" style="width: 220px" filterable placeholder="请选择取消原因">
                  <el-option v-for="(item, index) in CANCEL_TYPE" :key="index" :label="item" :value="item" />
                </el-select>
                <el-checkbox v-model="isCancelBack" style="marginLeft: 20px">系统取消返还</el-checkbox>
              </el-form-item>
              <el-form-item label="备注" prop="desc">
                <el-input v-model="allCancelForm.desc" type="textarea" maxlength="200" />
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-check" :loading="loadings._logistics_order_cancelOrder" type="primary" @click="submitForm('allCancelForm')">确定</el-button>
                <el-button icon="el-icon-close" @click="closeDl('allCancel')">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryAllExpressCompany } from '@/api/express/supplier'
import { businessList } from '@/api/goods/manage'
import { queryAll } from '@/api/express/national'
import { exportBackFillData, importBackFillData } from '@/api/express/file'
import {
  queryOrder,
  queryOrderStatusByOrderNo,
  mpOrderVerify,
  backFillTrackingNum,
  delOrder,
  cancelOrder,
  batchCancelOrder,
  chargeBack,
  batchChargeBack,
  queryRelatedOrder } from '@/api/express/manage'
import BasicsTitle from '@/components/BasicsTitle'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import Upload from './components/Upload'
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from './columns/list'
import searchs from './searchs/list'
import { default as act } from './actions/list'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { createBlob } from '@/utils'
import { getToken } from '@/utils/auth'

const EXPRESS_TYPE = {
  ALL: 0,
  ALL_LABEL: '全部',
  REVIEW: 1,
  REVIEW_LABEL: '待审核',
  REVIEWED: 2,
  REVIEWED_LABEL: '已审核',
  DELIVERED: 3,
  DELIVERED_LABEL: '待发货',
  SHIPPED: 4,
  SHIPPED_LABEL: '已发货',
  COMPLETED: 5,
  COMPLETED_LABEL: '已完成',
  CANCELLED: 6,
  CANCELLED_LABEL: '已取消',
  FAILED: 7,
  FAILED_LABEL: '出库失败'
}

const EXPRESS_STA = [
  '全部',
  '待审核',
  '已审核',
  '待发货',
  '已发货',
  '已完成',
  '已取消',
  '出库失败'
]

const CANCEL_TYPE = [
  '需要重新发货',
  '地址超区，无法正常揽件',
  '地址不详，无法正常揽件',
  '其他原因'
]

const BACK_TYPE = [
  '错发',
  '商品信息不符',
  '重复订单',
  '用户已退款',
  '其他原因'
]

export default {
  name: 'ExpressManage',
  components: { BasicsTitle, BasicsSearch, BasicsAction, BasicsTable, Upload },
  data() {
    return {
      isCancelBack: false,
      isChargeBack: false,
      EXPRESS_TYPE: EXPRESS_TYPE,
      EXPRESS_STA: EXPRESS_STA,
      CANCEL_TYPE: CANCEL_TYPE,
      BACK_TYPE,
      activeState: '0',
      stateList: [
        { label: EXPRESS_TYPE.ALL_LABEL, value: `${EXPRESS_TYPE.ALL}` },
        { label: EXPRESS_TYPE.REVIEW_LABEL, value: `${EXPRESS_TYPE.REVIEW}` },
        // {label: EXPRESS_TYPE.REVIEWED_LABEL, value: `${EXPRESS_TYPE.REVIEWED}`},
        { label: EXPRESS_TYPE.DELIVERED_LABEL, value: `${EXPRESS_TYPE.DELIVERED}` },
        { label: EXPRESS_TYPE.SHIPPED_LABEL, value: `${EXPRESS_TYPE.SHIPPED}` },
        { label: EXPRESS_TYPE.COMPLETED_LABEL, value: `${EXPRESS_TYPE.COMPLETED}` },
        { label: EXPRESS_TYPE.CANCELLED_LABEL, value: `${EXPRESS_TYPE.CANCELLED}` },
        { label: EXPRESS_TYPE.FAILED_LABEL, value: `${EXPRESS_TYPE.FAILED}` }
      ],
      tableKey: 0,
      table: { stripe: true },
      columns: columns,
      actions: actions({ tableAction: this.tableAction }),
      searchs: searchs,
      act: act({ jump: this.jump, importNum: this.importNum, exportNum: this.exportNum, operation: this.operation }),
      total: 0,
      list: [],
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      dlState: {
        order: false, // 查看订单弹窗
        imports: false, // 批量导入弹窗
        deliver: false, // 物流弹窗
        returns: false, // 回填弹窗
        examine: false, // 审核弹窗
        allExamine: false, // 批量审核弹窗
        deletes: false, // 删除弹窗
        backGoods: false, // 退货弹窗
        allBackGoods: false, // 退货弹窗
        back: false, // 撤回弹窗
        allBack: false, // 批量撤回弹窗
        againExamine: false, // 重新审核发货弹窗
        allAgainExamine: false, // 批量重新审核发货弹窗
        cancel: false, // 取消物流单弹窗
        allCancel: false // 批量取消物流单弹窗
      },
      activities: [], // 物流 - 时间轴
      actRow: {}, // 操作的行
      actRowList: [], // 批量操作的行
      detail: {}, // 查看关联订单
      examineForm: {}, // 审核
      allExamineForm: {}, // 批量审核
      backForm: {}, // 撤回
      allBackForm: {}, // 批量撤回
      expressCode: [], // 快递公司
      returnsForm: {}, // 回填单号
      againExamineForm: {}, // 重新审核发货
      allAgainExamineForm: {}, // 批量重新审核发货
      cancelForm: {}, // 取消物流单
      allCancelForm: {} // 批量取消物流单
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  watch: {
    activeState(val, oldVal) {
      this.actRowList = []
      if (val !== oldVal) {
        // 1:待审核
        // 2:
        // 3:待发货
        // 4:已发货
        // 5:已签收
        // 6:已取消
        // 7:出库失败
        // 那些状态需要多选
        if (![EXPRESS_TYPE.ALL_LABEL].includes(parseInt(val))) {
          this.columns = [
            {
              type: 'selection',
              width: 40,
              align: 'center'
            },
            ...columns
          ]
        } else {
          this.columns = columns
        }
        this.act = act({
          jump: this.jump,
          importNum: this.importNum,
          exportNum: this.exportNum,
          operation: this.operation,
          state: val
        })
        this.tableKey += 1
        this.listQuery = {
          page: 1,
          limit: 10
        }
        this.getList()
      }
    }
  },
  created() {
    this.init()
    this.getBusiness()
    this.getCity()
    this.getExpressCompany()
    // 默认带参数查询
    this.defParam()
  },
  methods: {
    moment,
    importBackFillData,
    init() {
      // 审核
      this.examineForm = { ex: '', desc: '' }
      // 批量审核
      this.allExamineForm = { ex: '', desc: '' }
      // 撤回
      this.backForm = { ex: '', desc: '' }
      // 批量撤回
      this.allBackForm = { ex: '', desc: '' }
      // 回填单号
      this.returnsForm = { expressCode: '', trackingNum: '' }
      // 重新审核发货
      this.againExamineForm = { ex: '', code: '' }
      // 批量重新审核发货
      this.allAgainExamineForm = { ex: '', code: '' }
      // 取消物流单
      this.cancelForm = { ex: '', desc: '' }
      // 批量取消物流单
      this.allCancelForm = { ex: '', desc: '' }
      // 是否取消返还
      this.isCancelBack = false
      // 是否撤单返还
      this.isChargeBack = false
    },
    defParam() {
      const { query } = this.$route
      if (Object.keys(query).length) {
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'defaultVal',
            data: { ...query }
          })
          if (query.status) {
            this.activeState = query.status + ''
          }
          this.$nextTick(() => {
            this.getList()
          })
        })
      } else {
        this.$nextTick(() => {
          this.getList()
        })
      }
    },
    // 获取快递公司
    getExpressCompany() {
      queryAllExpressCompany().then(res => {
        const expressCode = []
        const data = res.data || []
        data.map(item => {
          expressCode.push({
            label: item.expressName,
            value: item.expressCode,
            id: item.id
          })
        })
        this.expressCode = expressCode
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { expressCode: expressCode }
          })
        })
      })
    },
    // 获取业务线
    getBusiness() {
      businessList().then(res => {
        const businessCode = []
        const data = res.data || []
        data.map(item => {
          businessCode.push({
            label: item.businessName,
            value: item.businessCode,
            leaf: false
          })
        })
        this.$nextTick(() => {
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { businessCode: businessCode }
          })
          this.$refs.searchs && this.$refs.searchs.set({
            type: 'options',
            data: { warehouseNo: businessCode }
          })
        })
      })
    },
    // 获取省市区
    getCity() {
      queryAll().then(res => {
        const data = res.data || []
        const loop = list => {
          const arr = []
          list.map(item => {
            const obj = {
              label: item.countyName || item.cityName || item.provinceName,
              value: item.countyName || item.cityName || item.provinceName,
              code: item.countyCode || item.cityCode || item.provinceCode
            }
            if (item.citys && item.citys.length) {
              obj.children = loop(item.citys)
            }
            arr.push(obj)
          })
          return arr
        }
        const city = loop(data)
        this.$refs.searchs && this.$refs.searchs.set({
          type: 'options',
          data: { city: city }
        })
      })
    },
    // 搜索条件改变
    changeSearch(query) {
      this.query = query
    },
    submitSearch(val, sta) {
      if (sta) {
        this.$router.replace({ query: {}})
      }
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 获取列表数据
    getList() {
      const { query, listQuery, activeState } = this
      const city = query.city || []
      const consigneeCity = city[city.length - 1] || ''

      const time = query.time || []
      const createTimeStart = time[0] || ''
      const createTimeEnd = time[1] || ''

      const warehouse = query.warehouseNo || []
      const warehouseNo = warehouse[warehouse.length - 1]
      const data = {
        page: listQuery.page,
        pageSize: listQuery.limit,
        status: activeState !== '0' ? activeState : '',
        consigneeCity: consigneeCity,
        createTimeStart: createTimeStart,
        createTimeEnd: createTimeEnd,

        businessCode: query.businessCode,
        orderNo: query.orderNo,
        productCode: query.productCode,
        warehouseNo: warehouseNo,
        consigneeMobile: query.consigneeMobile,
        expressCode: query.expressCode,
        trackingNum: query.trackingNum,
        batchId: query.batchId
      }
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }

      queryOrder(data).then(res => {
        const data = res.data || {}
        this.list = data.rows || []
        this.total = data.records || 0
      })
    },
    // 勾选数据回调
    handleSelectionChange(e) {
      this.actRowList = e
    },
    // 跳转到创建物流、批量发货页
    jump(name, query) {
      this.$router.push({ name: name, query })
    },
    // 导出待回填数据
    exportNum() {
      this.$confirm('<div><i style="color: green" class="el-icon-download"></i>下载后请在本地浏览器默认的下载文件内查看。</div>', '你确定导出当前条件下的待回填数据吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // type: 'warning'
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '导出中...'

            const { query } = this

            const city = query.city || []
            const consigneeCity = city[city.length - 1] || ''

            const time = query.time || []
            const createTimeStart = time[0] || ''
            const createTimeEnd = time[1] || ''

            const warehouse = query.warehouseNo || []
            const warehouseNo = warehouse[warehouse.length - 1]
            const data = {
              batchId: query.batchId,
              businessCode: query.businessCode,
              consigneeMobile: query.consigneeMobile,
              consigneeCity: consigneeCity,
              createTimeStart: createTimeStart,
              createTimeEnd: createTimeEnd,
              expressCode: query.expressCode,
              orderNo: query.orderNo,
              productCode: query.productCode,
              trackingNum: query.trackingNum,
              warehouseNo: warehouseNo
            }
            for (const name in data) {
              !data[name] && data[name] !== 0 && delete data[name]
            }
            exportBackFillData(data).then(res => {
              createBlob(`待回填数据-${moment().format('YYYY-MM-DD')}.xlsx`, res)
              this.$message.success('导出待回填数据成功')
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    // 导入回填单号
    importNum() {
      this.openDl('imports')
    },
    // 批量操作 - 打开
    operation(name) {
      const { actRowList } = this
      if (!actRowList.length) {
        this.$message.warning('请勾选需要操作的物流单')
        return false
      }
      this.openDl(name)
    },
    // 表格操作
    tableAction(dat, row, index, name) {
      switch (name) {
        case 'order': // 关联订单
          this.openDl(name)
          queryRelatedOrder({ orderNo: row.orderNo }).then(res => {
            this.detail = res.data || {}
          })
          break
        case 'ExpressManageCreate': // 修改
          this.jump(name, { id: row.id })
          break
        case 'deletes': // 删除
          this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该物流单吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'
                delOrder({
                  orderNo: row.orderNo
                }).then(() => {
                  this.$message.success('删除物流单成功')
                  this.getList()
                  done()
                }).finally(() => {
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确定'
                })
              } else {
                done()
              }
            }
          })
          break
        case 'deliver': // 物流详情
          this.activities = []
          this.openDl(name)
          this.actRow = row
          queryOrderStatusByOrderNo({ orderNo: row.orderNo }).then(res => {
            const data = res.data || {}
            this.activities = data.subVo || []
          })
          break
        default:
          this.actRow = row
          this.openDl(name)
          break
      }
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case 'examineForm':
              this.examineSubmit()
              break
            case 'allExamineForm':
              this.allExamineSubmit()
              break
            case 'backForm':
              this.backSubmit()
              break
            case 'allBackForm':
              this.allBackSubmit()
              break
            case 'returnsForm':
              this.returnsSubmit()
              break
            case 'againExamineForm':
              this.againExamineSubmit()
              break
            case 'allAgainExamineForm':
              this.allAgainExamineSubmit()
              break
            case 'cancelForm':
              this.cancelSubmit()
              break
            case 'allCancelForm':
              this.allCancelSubmit()
              break
          }
        } else {
          return false
        }
      })
    },
    // 审核表单
    examineSubmit() {
      const { examineForm, actRow } = this
      const data = {
        note: examineForm.desc,
        orders: [actRow.orderNo],
        status: examineForm.ex // 1: 审核成功，2: 审核失败，3：重审发货 4：重审修改 5：用户已签收
      }
      mpOrderVerify(data).then(() => {
        this.$message.success('审核已提交')
        this.actRow = {}
        this.closeDl('examine')
        this.getList()
        this.init()
      })
    },
    // 批量审核表单
    allExamineSubmit() {
      const { allExamineForm, actRowList } = this
      const orders = []
      actRowList.map(item => {
        orders.push(item.orderNo)
      })
      const data = {
        note: allExamineForm.desc,
        orders: orders,
        status: allExamineForm.ex // 1: 审核成功，2: 审核失败，3：重审发货 4：重审修改 5：用户已签收
      }
      mpOrderVerify(data).then(() => {
        this.$message.success('批量审核已提交')
        this.actRowList = []
        this.closeDl('allExamine')
        this.getList()
        this.init()
      })
    },
    // 撤回表单
    backSubmit() {
      const { backForm, actRow } = this
      const data = {
        note: backForm.desc,
        orderNo: actRow.orderNo,
        cancelCause: backForm.ex,
        operator: getToken('cname'),
        isIncryInventory: this.isChargeBack ? 1 : 0
      }
      chargeBack(data).then(() => {
        this.$message.success('撤回物流单成功')
        this.actRow = {}
        this.closeDl('back')
        this.getList()
        this.init()
      })
    },
    // 批量撤回表单
    allBackSubmit() {
      const orderNos = this.actRowList.map(item => item.orderNo)
      const data = {
        note: this.allBackForm.desc,
        orderNos: orderNos,
        cancelCause: this.allBackForm.ex,
        operator: getToken('cname'),
        isIncryInventory: this.isChargeBack ? 1 : 0
      }
      batchChargeBack(data).then(() => {
        this.$message.success('批量撤回物流单成功')
        this.actRowList = []
        this.closeDl('allBack')
        this.getList()
        this.init()
      })
    },
    // 回填表单
    returnsSubmit() {
      const { returnsForm, actRow } = this
      const data = {
        expressCode: returnsForm.expressCode,
        orderNo: actRow.orderNo,
        trackingNum: returnsForm.trackingNum
      }
      backFillTrackingNum(data).then(() => {
        this.$message.success('回填单号成功')
        this.actRow = {}
        this.closeDl('returns')
        this.getList()
        this.init()
      })
    },
    // 批量回填表单 - 上传
    nowUp() {
      this.$refs.upload.actUp()
    },
    // 上传成功关闭
    uploadEnd() {
      this.activeState = EXPRESS_TYPE.SHIPPED
      this.closeDl('imports')
    },
    // 重新审核发货表单
    againExamineSubmit() {
      const { againExamineForm, actRow } = this
      const data = {
        note: againExamineForm.desc,
        orders: [actRow.orderNo],
        status: againExamineForm.ex // 1: 审核成功，2: 审核失败，3：重审发货 4：重审修改 5：用户已签收
      }
      mpOrderVerify(data).then(() => {
        this.$message.success('重新审核已提交')
        this.actRow = {}
        this.closeDl('againExamine')
        this.getList()
        this.init()
      })
    },
    // 批量重新审核发货表单
    allAgainExamineSubmit() {
      const { allAgainExamineForm, actRowList } = this
      const orders = []
      actRowList.map(item => {
        orders.push(item.orderNo)
      })
      const data = {
        note: allAgainExamineForm.desc,
        orders: orders,
        status: allAgainExamineForm.ex // 1: 审核成功，2: 审核失败，3：重审发货 4：重审修改 5：用户已签收
      }
      mpOrderVerify(data).then(() => {
        this.$message.success('批量重新审核已提交')
        this.actRowList = []
        this.closeDl('allAgainExamine')
        this.getList()
        this.init()
      })
    },
    // 取消物流单
    cancelSubmit() {
      const { cancelForm, actRow } = this
      const data = {
        note: cancelForm.desc,
        orderNo: actRow.orderNo,
        cancelCause: cancelForm.ex,
        isIncryInventory: this.isCancelBack ? 1 : 0
      }
      cancelOrder(data).then(() => {
        this.$message.success('取消物流单成功')
        this.actRow = {}
        this.closeDl('cancel')
        this.getList()
        this.init()
      })
    },
    // 批量取消物流单
    allCancelSubmit() {
      const orderNos = this.actRowList.map(item => item.orderNo)
      const data = {
        note: this.allCancelForm.desc,
        orderNos: orderNos,
        cancelCause: this.allCancelForm.ex,
        isIncryInventory: this.isCancelBack ? 1 : 0
      }
      batchCancelOrder(data).then(() => {
        this.$message.success('批量取消物流单成功')
        this.actRowList = []
        this.closeDl('allCancel')
        this.getList()
        this.init()
      })
    },
    // 打开弹窗
    openDl(key) {
      const { dlState } = this
      this.dlState = {
        ...dlState,
        [key]: true
      }
    },
    // 关闭弹窗
    closeDl(key) {
      this.init()
      const { dlState } = this
      this.dlState = {
        ...dlState,
        [key]: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.columns-txt {
  /*font-weight: bold;*/
  /*color: #333333;*/
  text-align: left;
}
.columns-note {
  color: #999999;
  font-size: 12px;
  text-align: left;
}
.deliver-dl {
  margin: 0 auto 40px;
  p {
    color: #666666;
    margin: 8px;
    font-size: 16px;
  }
  .label {
    color: #333333;
    display: inline-block;
    width: 86px;
    text-align: right;
  }
  /deep/ .el-tag {
    position: absolute;
    top: 5px;
  }
}
.time-item {
  margin: 0 40px 0 60px;
  .time {
    position: absolute;
    left: -70px;
    top: -10px;
    p {
      margin: 2px;
      color: #666666;
      font-size: 14px;
      text-align: right;
    }
    .day {
      color: #333333;
    }
  }
}

.order-dl {
  .item {
    margin: 20px 0;
    font-size: 16px;
    .key {
      display: inline-block;
      width: 120px;
      text-align: right;
      color: #999999;
    }
    .value {
      margin-left: 10px;
      display: inline-block;
      color: #333333;
    }
  }
}

.examine-dl {
  .info {
    border: 1px solid #dddddd;
    background-color: #eeeeee;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    .item {
      margin: 20px 0;
      font-size: 16px;
      display: flex;
      .key {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #999999;
        vertical-align: top;
      }
      .value {
        margin-left: 10px;
        display: inline-block;
        color: #333333;
        flex: 1;
      }
      .value-near {
        margin: 0;
      }
      .value-block {
        margin-left: 10px;
        display: block;
        color: #333333;
        margin-bottom: 5px;
      }
      .value-weight {
        font-weight: bold;
      }
      .value-all {
        margin-left: 10px;
        display: inline-block;
        color: #333333;
      }
    }
  }
  .all-examine {
    max-height: 200px;
    overflow-y: auto;
  }
}
/deep/ .el-timeline-item__node {
  &::after {
    content: '';
    display: block;
    left: 3px;
    width: 6px;
    height: 6px;
    position: absolute;
    background-color: #fff;
    border-radius: 3px;
  }
}
.max-timeline {
  /deep/ .el-timeline-item__node {
    // left: -3px;
    // width: 16px;
    // height: 16px;
    &::after {
      display: none;
    }
  }
}
</style>
