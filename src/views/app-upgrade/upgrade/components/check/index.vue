<template>
  <div>
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_web_version_review_getReview"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />
    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      width="480px"
      :before-close="closeAdd"
    >
      <basics-form ref="addCheck" :key="dialogVisible" :loading="loadings._operation_web_version_review_putReview" :forms="forms" :actions="formActions" @changeForm="changeForm" @submitForm="submitForm" />
    </el-dialog>
  </div>
</template>

<script>
import { getVersionDesc } from '@/api/app-upgrade/version'
import { editState, getReview, putReview } from '@/api/app-upgrade/upgrade'
import BasicsAction from '@/components/BasicsAction'
import BasicsTable from '@/components/BasicsTable'
import BasicsForm from '@/components/BasicsForm'
import columns, { actions as act } from './columns/list'
import actions from './actions/list'
import forms, { actions as formAct } from './forms/list'
import { mapGetters } from 'vuex'

export default {
  name: 'Upgrade',
  components: { BasicsAction, BasicsTable, BasicsForm },
  props: {
    labelDrop: {
      type: Object,
      default: () => {}
    } // 初始化客户端和升级类型
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  data() {
    return {
      activeName: 'check',
      table: { stripe: true },
      columns: columns,
      actionFunction: act({ openCloseCheck: this.openCloseCheck }),
      actions: actions({ create: this.create }),
      forms: forms,
      formActions: formAct({ quit: this.closeAdd }),
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 根据客户端和升级类型获取版本号
    getVersion(clientTypeId, upgradeTypeId) {
      getVersionDesc({ clientTypeId: clientTypeId, upgradeTypeId: upgradeTypeId, enableState: 1 }).then(res => {
        const data = res.data || []
        const version = []
        data.map(item => {
          version.push({
            label: item.versiondesc,
            value: item.versiondesc
          })
        })
        this.$refs.addCheck.set({
          type: 'options',
          data: { versionDesc: version }
        })
        this.$refs.addCheck.set({
          type: 'defaultVal',
          data: { versionDesc: '' },
          validateField: false
        })
      })
    },
    // 获取数据统计列表
    getList() {
      const { listQuery } = this
      getReview({
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 跳转到数据详情
    dataDetails(dat, row, index) {
      this.$router.push({ name: 'PutLogDetail', params: { id: row.id }})
    },
    // 新建审核配置
    create() {
      this.dialogVisible = true
      this.$nextTick(() => {
        const { labelDrop } = this
        const { clientDrop, upgradeTypeDrop, reviewTypeDrop } = labelDrop
        this.$refs.addCheck.set({
          type: 'options',
          data: {
            clientTypeId: clientDrop,
            upgradeTypeId: upgradeTypeDrop,
            reviewType: reviewTypeDrop
          }
        })
        if (reviewTypeDrop.length) {
          this.$refs.addCheck.set({
            type: 'defaultVal',
            data: { reviewType: reviewTypeDrop[0].value }
          })
        }
      })
    },
    // 关闭添加
    closeAdd() {
      this.dialogVisible = false
    },
    // 联动下拉框
    changeForm(val, oldVal) {
      if (val.clientTypeId && val.upgradeTypeId && (val.clientTypeId !== oldVal.clientTypeId || val.upgradeTypeId !== oldVal.upgradeTypeId)) {
        this.getVersion(val.clientTypeId, val.upgradeTypeId)
      }
    },
    // 保存版本
    submitForm(val) {
      const data = {
        ...val
      }
      putReview(data).then(res => {
        console.log(res)
        this.closeAdd()
        this.$message.success('添加版本成功')
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    },
    // 启用禁用审核
    openCloseCheck(dat, row, index) {
      const data = {
        reviewId: row.id,
        enableState: row.enableState ^ 1
      }
      editState(data).then(() => {
        this.closeAdd()
        this.$message.success(row.enableState ? '禁用成功' : '启用成功')
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

