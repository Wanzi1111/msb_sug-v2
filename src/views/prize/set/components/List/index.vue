<template>
  <div>
    <basics-search ref="searchs" :loading="gLoadings._ums_api_activity_prize_getPrize" :searchs="searchs" @submitSearch="submitSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :key="prizeType"
      :loading="gLoadings._ums_api_activity_prize_getPrize"
      :get-list="getList"
      :columns="columns"
      v-bind="gTable"
    />

    <!--新增/修改-->
    <el-dialog
      :title="title"
      :visible.sync="gVisible.visible"
      width="500px"
      :before-close="() => changeGVisible('visible', false)"
    >
      <basics-form
        :key="gVisible.visible"
        ref="addShow"
        :attr="{labelWidth: '110px'}"
        :loading="gLoadings._msb_api_workShow_add"
        :forms="forms"
        :actions="formActions"
        @submitForm="submitForm"
      />
    </el-dialog>

    <!--预览-->
    <preview v-if="gVisible.viewVisible" :row="row" :visible="gVisible.viewVisible" :close="() => changeGVisible('viewVisible', false)" />

  </div>
</template>

<script>
import actions from './actions'
import { actions as tableActions } from './columns'
import searchs from './searchs'
import { actions as formActions } from './forms'
import mixins from '@/mixins'
import moment from 'moment'
import Preview from '../Preview'

export default {
  name: 'Recommend',
  components: { Preview },
  mixins: [mixins.table],
  props: {
    prizeType: Number,
    columns: Array,
    forms: Array
  },
  data() {
    return {
      actions: actions({ add: this.add }),
      searchs: searchs,
      gTable: {
        listQuery: {
          page: 0,
          limit: 10
        },
        actionFunction: tableActions({ view: this.view, edit: this.add, del: this.del })
      },
      formActions: formActions({ closeDl: () => this.changeGVisible('visible', false), isEdit: false }),
      row: {}
    }
  },
  computed: {
    title() {
      let title = ''

      const { gVisible, prizeType } = this
      if (gVisible.isEdit) {
        title += '修改'
      } else {
        title += '设置'
      }
      if (prizeType === 1) {
        title += '试听奖励奖品'
      } else if (prizeType === 2) {
        title += '分享海报奖励奖品'
      } else {
        title += '排行榜奖励奖品'
      }
      return title
    }
  },
  watch: {
    'gVisible.isEdit'(val, oldVal) {
      if (val !== oldVal) {
        this.formActions = formActions({ closeDl: () => this.changeGVisible('visible', false), isEdit: val })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.searchs.search()
    })
  },
  methods: {
    // 获取列表
    getList() {
      const { prizeType } = this
      const { query, listQuery } = this.gTable
      this.$api.getPrize({
        prizeMonth: query.prizeMonth ? moment(query.prizeMonth).format('YYYY-MM') : '',
        prizeType: prizeType,
        pageNo: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.payload || {}
        this.gTable.list = data.content || []
        this.gTable.total = parseInt(data.totalElements || 0)
      })
      // this.gTable.list = [{ id: 1 }, { id: 2 }]
    },
    // 搜索
    submitSearch(val) {
      this.gTable.listQuery = {
        page: 0,
        limit: 10
      }
      this.gTable.query = val
      this.getList()
    },
    // 新增、修改
    submitForm(val) {
      const { gVisible, row, prizeType } = this
      const data = {
        id: '0',
        prizeType: prizeType,
        ...val,
        prizeMonth: moment(val.prizeMonth).format('YYYY-MM')
      }
      if (prizeType === 3) {
        const rank = val.rank || []
        data.rankStart = rank[0] || ''
        data.rankEnd = rank[1] || ''
      }
      delete data.rank
      let msg = '新增奖品成功'
      if (gVisible.isEdit) {
        data.id = row.id
        msg = '修改奖品成功'
      }
      this.$api.savePrize(data).then(res => {
        console.log(res)
        this.$message.success(msg)
        this.changeGVisible(['visible', 'isEdit'], false)
        this.getList()
      })
    },
    view(row) {
      this.row = row
      this.changeGVisible('viewVisible')
    },
    // 新增、修改(sta = true)
    add(sta = false, row) {
      if (sta) {
        this.row = row
      }
      this.changeGVisible('visible')
      this.changeGVisible('isEdit', sta)

      if (sta) {
        const { prizeType } = this
        let data = {
          prizeMonth: moment(row.prizeMonth),
          name: row.name,
          commodityCode: row.commodityCode,
          imageUrl: row.imageUrl
        }
        if (prizeType === 1) {
          data = {
            ...data,
            auditionNumber: row.auditionNumber
          }
        } else if (prizeType === 3) {
          data = {
            ...data,
            rank: [row.rankStart, row.rankEnd]
          }
        }
        this.$nextTick(() => {
          this.$refs.addShow.set({
            type: 'defaultVal',
            data: data
          })
          this.$refs.addShow.set({
            type: 'attr',
            data: {
              prizeMonth: {
                disabled: moment().valueOf() >= moment(row.prizeMonth).startOf('month').valueOf(),
                type: 'month',
                placeholder: '请选择发布月份',
                pickerOptions: {
                  disabledDate: (time) => {
                    return time.getTime() < moment().endOf('month').valueOf()
                  }
                }
              }
            }
          })
        })
      }
    },
    del(row) {
      this.$confirm('删除后将无法恢复，请确认是否删除', '你确定要删除该奖品设置吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            this.$api.delPrize({ id: row.id }).then(res => {
              this.$message.success('删除配置成功')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  display: flex;
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
    vertical-align: middle;
    // width: 300px;
  }
  /deep/ .el-form-item__label {
    display: flex;
    width: 86px !important;
    margin-right: 10px;
    align-items: center;
    justify-content: flex-end;
    align-self: flex-start;
    line-height: 1.3;
    min-height: 36px;
    vertical-align: middle;
    flex-shrink: 0;
  }
}
.form-item-element {
  flex: 1;
  .materiel-info-item__content {
    p {
      margin: 4px 0;
      line-height: 18px;
      color: #333333;
    }
  }
}
</style>
