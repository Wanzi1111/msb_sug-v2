
<template>
  <div class="addressListDialog">
    <!--书画院用的话，无地址列表情况显示新增地址-->
    <el-button
      v-if="!diffCalligraphy || (diffCalligraphy && !tableData.length)"
      class="addaddress"
      type="primary"
      size="mini"
      plain
      @click="addAddress"
    >新增地址</el-button>
    <ele-table
      :table-size="'small'"
      :data-list="tableData"
      :table-height="tableHeight"
      :size="tabQuery.size"
      :page="tabQuery.page"
      :total="totalElements"
      :show-all-total-num="true"
      :header-row-clas-fn="headerRowClasFn"
      class="mytable"
    >
      <!-- isChina !== scope.row.type &&  -->
      <el-table-column label="收货人" min-width="70" align="center">
        <template slot-scope="scope">
          <div class="consignee" @click="getListInfos(scope.row)">
            <el-radio
              v-model="radio"
              class="radio"
              :label="scope.row.id"
              :disabled="isChina !== scope.row.type"
            ><span class="radio-text">{{
              scope.row.receiptName
            }}</span></el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货电话" min-width="70" align="center">
        <template slot-scope="scope">
          <p>
            <span>{{ scope.row.receiptTel || "-" }}</span>
            <i
              v-if="scope.row.receiptTel"
              class="el-icon-view small-eye"
              :class="[{ 'grey-icon': !scope.row.receiptTel.includes('*') }]"
              @click="handleDisplay(scope.row)"
            />
          </p>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area
          }}{{ scope.row.street }}{{ scope.row.addressDetail }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="!diffCalligraphy"
        label="创建时间"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="!diffCalligraphy"
        label="操作"
        min-width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="changeAddress(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </ele-table>
    <!--书画院用的话，无地址列表情况显示新增地址-->
    <div
      v-if="!diffCalligraphy || (diffCalligraphy && !tableData.length)"
      class="tip"
    >
      当前物流商品为{{
        isChina === 0 ? "中国" : "海外" + chineseCountryName
      }}套餐，仅支持{{
        isChina === 0 ? "中国" : "海外" + chineseCountryName
      }}收货地址
    </div>
    <div class="btns">
      <span class="btnsure" @click="btnsure()">确认</span>
      <span class="btncancel" @click="btncancel()">取消</span>
    </div>
    <!-- 新增修改地址 -->
    <el-dialog
      v-if="addChangeAddress"
      width="550px"
      :title="title"
      :visible.sync="addChangeAddress"
      append-to-body
      destroy-on-close
    >
      <addChangeAddress
        :echo-address="echoAddress"
        :user-id="userId"
        :is-china="isChina"
        :country-code="countryCode"
        :country-name="countryName"
        :chinese-country-name="chineseCountryName"
        :is-default-address="isDefaultAddress"
        :limit-sync="diffCalligraphy"
        @closeAddChangeAddress="closeAddChangeAddress"
      />
    </el-dialog>
  </div>
</template>
<script>
import { formatData } from '@/utils/mini_tool_lk'
import EleTable from '@/components/Table/EleTable'
import addChangeAddress from './addChangeAddress.vue'
import {
  getCenterCountryList,
  getAddressList,
  getAddressByIdUnsafe,
  updateDefaultAddress
} from '@/api/operate/examineApi'
export default {
  name: 'AddressListDialog',
  components: {
    EleTable,
    addChangeAddress
  },
  props: {
    userId: {
      required: true,
      type: String,
      default: ''
    },
    isChina: {
      required: true,
      type: Number,
      default: 0
    },
    addressId: {
      required: true,
      type: String,
      default: ''
    },
    countryCode: {
      required: true,
      type: String,
      default: ''
    },
    countryName: {
      required: true,
      type: String,
      default: ''
    },
    addressList: {
      type: Array,
      default: () => []
    },
    // 书画院专用，特殊逻辑处理
    diffCalligraphy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: '',
      tableHeight: '200',
      tableData: [],
      tabQuery: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      addChangeAddress: false,
      userID: '',
      title: '新增收货信息',
      echoAddress: {},
      country: this.isChina === 2 ? '国外' : '国内',
      isDefaultAddress: 0,
      allItemInfos: {},
      chineseCountryName: ''
    }
  },
  mounted() {
    this.radio = this.addressId
    this.getAddressList()
    this.getChineseName(this.countryCode)
  },
  methods: {
    // 获取海外国家中文名称
    getChineseName(outCountryCode) {
      getCenterCountryList({
        subject: 'ART_APP'
      }).then((res) => {
        if (res.code === 0) {
          // console.log(res.payload.data, '海外国家中文名称')
          for (const item of res.payload.data) {
            if (item.countryCode === outCountryCode) {
              // console.log(item.simpleName)
              this.chineseCountryName = item.simpleName
            }
          }
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    // 新增地址弹窗
    addAddress() {
      if (this.tableData.length >= 10) {
        this.$message({
          message: '收货地址已达上限',
          type: 'error'
        })
      } else {
        this.title = '新增收货地址'
        this.echoAddress = {}
        this.echoAddress.type = this.isChina
        this.addChangeAddress = true
      }
    },
    getListInfos(val) {
      this.allItemInfos = JSON.parse(JSON.stringify(val))
    },
    btnsure() {
      if (!this.allItemInfo) {
        var currentTableObj = this.tableData.filter(
          (item) => item.id === this.radio
        )
        this.$emit('getListInfos', currentTableObj[0])
      } else {
        if (this.isChina !== this.allItemInfos.type) {
          return false
        } else {
          this.$emit('getListInfos', this.allItemInfos)
        }
      }
    },
    btncancel() {
      this.$emit('getListInfos', '')
    },
    // 自定义thead样式
    headerRowClasFn() {
      return 'header-row-class'
    },
    getAddressList() {
      // 如果父组件传来地址列表则不从接口获取
      if (this.diffCalligraphy && this.addressList.length) {
        this.tableData = this.addressList
        return
      }
      getAddressList({
        userId: this.userId,
        subject: 'ART_APP'
      }).then((res) => {
        console.log(res)
        this.tableData = res.payload
        this.$forceUpdate()
      })
    },
    // 时间转化
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    // 修改
    changeAddress(row) {
      console.log(row, '哈哈哈')
      this.isDefaultAddress = row.isDefault
      console.log(this.countryCode)
      if (this.isChina === 0) {
        this.countryName = '中国'
        if (this.countryName === row.countryName) {
          this.title = '修改收货地址'
          this.echoAddress = row
          this.addChangeAddress = true
        }
      } else {
        if (this.countryCode === row.countryCode) {
          this.title = '修改收货地址'
          this.echoAddress = row
          this.addChangeAddress = true
        }
      }
    },
    // 显示手机号
    async handleDisplay(row) {
      if (!row.receiptTel.includes('*')) {
        return
      }
      const res = await getAddressByIdUnsafe({
        addressId: row.id
      })
      if (res.status === 'OK') {
        row.receiptTel = res.payload.receiptTel
      }
    },
    // 关闭closeAddChangeAddress弹窗
    closeAddChangeAddress(val, radio = '2', payload = {}) {
      this.addChangeAddress = false
      if (val !== 'cancel' && radio === '1') {
        const params = {
          addressId: val,
          userId: this.userId,
          module: this.$route?.meta?.title, // 路由title
          client: 'BOSS' // 来源-端
        }
        updateDefaultAddress(params).then((res) => {
          if (res?.code === 0) {
            // this.$message.success('操作成功')
            this.getAddressList()
            this.$emit('getListInfos', res.payload)
            // setTimeout(() => {
            //   this.$emit('modifyAddressExpress')
            // }, 5000)
          }
        })
      } else if (val !== 'cancel' && radio === '2') {
        // 书画院新增地址要显示在列表上
        if (this.diffCalligraphy) {
          this.tableData.unshift({ ...payload })
        } else {
          this.$emit('getListInfos', payload)
        }
      }
      // this.getAddressList()
      // setTimeout(() => {
      //   this.$emit('modifyAddressExpress')
      // }, 5000)
    }
  }
}
</script>
<style lang="scss" scoped>
.addressListDialog {
  .tip {
    color: red;
    margin-top: 10px;
  }
  .consignee {
    display: flex;
    align-items: center;
    cursor: pointer;
    input {
      margin-right: 6px;
      font-size: 12px;
    }
    .radio {
      span.radio-text {
        font-size: 12px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    span {
      display: inline-block;
      width: 60px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btnsure {
      background: #2a75ed;
      color: #fff;
    }
    .btncancel {
      background: #eee;
      color: #000;
      margin-left: 10px;
    }
  }
}
/deep/ .header-row-class th {
  background: #f5f7fa;
  height: 50px;
  text-align: center;
}
.addaddress {
  margin-bottom: 20px;
}
.mytable {
  .small-eye {
    margin-left: 5px;
    color: #2a75ed;
  }
  .grey-icon {
    color: #999;
  }
}
.el-table__body {
  tbody {
    .el-table__row {
      .el-table_1_column_1 {
        .consignee {
          .el-radio,
          .radio {
            .radio-text {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
