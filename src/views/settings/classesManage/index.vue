
<template>
  <div class="home-container">
    <div class="app-container title-container">
      <basics-title
        title="班次设置"
        :actions="[{
          type: 'button', // 按钮
          label: '添加班次',
          click: addClass,
          attr: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-plus',
            permission: ['admin']
          }
        }]"
      />
    </div>
    <div class="app-container">

      <basics-search :loading="loadings._operation_resource_listResource" :searchs="searchs" @submitSearch="submitSearch" />

      <basics-table
        :table="table"
        :columns="columns"
        :list="list"
        :get-list="getList"
        :total="total"
        :loading="loadings._k8s_api_complaint_api_scheduling_getSchedulingList"
        :list-query="listQuery"
        :action-function="actions"
      >
        <template slot="time" slot-scope="scope">
          <div>{{ scope.row.schedulingBeginTime }} - {{ scope.row.schedulingEndTime }}</div>
        </template>
        <template slot="ctime" slot-scope="scope">
          <div>{{ scope.row.ctime }}</div>
        </template>
      </basics-table>

      <!-- 编辑 -->
      <el-dialog
        v-if="isShowEdit"
        append-to-body
        :title="title"
        :visible.sync="isShowEdit"
        width="500px"
      >
        <basics-form ref="editForm" :forms="editFormData" :actions="editFormActions" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import moment from 'moment'
import { getToken } from '@/utils/auth'
import { addSch, updateSch, delSch, getSchedulingList } from '@/api/classes/classes'
import columns, { tableAction } from './columns'
import searchs from './searchs'
import editFormData, { actions as editFormActions } from './forms/editForm'
const init_pagination = {
  page: 1,
  limit: 20
}

export default {
  name: 'ReviewActivities',
  // components: { ModalRejectRemarks },
  data() {
    return {
      columns,
      searchs,
      list: [],
      total: 0,
      listQuery: { ...init_pagination },
      searchQuery: { type: '2' },
      editFormData: editFormData,
      editFormActions: editFormActions({ cancel: () => { this.isShowEdit = false }, editForm: this.editForm }),
      isShowEdit: false,
      actions: tableAction({ deleteRow: this.deleteRow, editRow: this.editRow }),
      title: '新增',
      table: {
        stripe: false,
        border: false
      }
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },

  mounted() {
    this.getList()
  },
  methods: {
    // 编辑行内数据
    editRow(row) {
      // console.log(row, '[][][]\\\\')
      this.title = '编辑'
      this.isShowEdit = true
      this.$nextTick(() => {
        const { schedulingName, schedulingBeginTime, schedulingEndTime } = row
        this.$refs.editForm.recoveryForm({ schedulingTime: [schedulingBeginTime, schedulingEndTime], schedulingName })
      })
      this.rowId = row.id
    },
    // 删除行内数据
    deleteRow(row) {
      const data = {
        id: parseInt(row.id),
        status: 1
      }
      this.$confirm('此操作将永久删除该班次, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await delSch(data)
          // 重新拉取列表
          this.initPaginationAndGetList()
          this.$message({
            message: '删除班次成功。',
            type: 'success'
          })
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增排班
    addClass() {
      this.isShowEdit = true
      this.rowId = ''
    },
    // 提交编辑
    async editForm(form) {
      this.isShowEdit = false
      const { schedulingName, schedulingTime } = form
      const data = {
        staffId: getToken('userId'),
        staffName: getToken('cname'),
        schedulingName: schedulingName,
        schedulingBeginTime: schedulingTime[0],
        schedulingEndTime: schedulingTime[1]
      }
      if (this.rowId) {
        data.id = this.rowId
        try {
          await updateSch(data)
          // 重新拉取列表
          this.initPaginationAndGetList()
          this.$message({
            message: '编辑班次成功。',
            type: 'success'
          })
        } catch (error) {
          console.log(error)
        }
        this.rowId = ''
      } else {
        try {
          await addSch(data)
          this.initPaginationAndGetList()
          this.$message({
            message: '添加班次成功。',
            type: 'success'
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 导出收益记录
    exportProfit() {
      // await exportProfitRecord()
    },
    // 导出订单记录
    exportOder() {
      // await exportOrderRecord()
    },
    // 提交查询
    submitSearch(data) {
      this.getList(data.schedulingName ? data : {})
    },
    // 重置分页，查询列表
    initPaginationAndGetList() {
      this.listQuery = { ...init_pagination }
      this.getList()
    },
    // 获取 列表数据
    async getList(data) {
      const res = await getSchedulingList(data)
      this.list = res.payload
    },
    // 处理表格事件
    handleTableAction(type, row) {

    },
    handleBusinessTabClick() {
      this.$message.warning('暂未开放，敬请期待～')
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-width: 960px;
  .home-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    span {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 18px;
      line-height: 36px;
    }
  }
}
</style>
