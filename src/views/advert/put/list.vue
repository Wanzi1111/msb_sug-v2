<template>
  <div class="app-container">
    <basics-search ref="searchs" :loading="loadings._operation_resource_publishList" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch" />
    <basics-action :actions="actions" />
    <basics-table
      ref="table"
      :table="table"
      :loading="loadings._operation_resource_publishList"
      :list="list"
      :get-list="getList"
      :columns="columns"
      :total="total"
      :list-query="listQuery"
      :action-function="actionFunction"
    />

    <!--排序-->
    <el-dialog
      title="调整顺序"
      :visible.sync="dragVisible"
      width="600px"
      :before-close="closeDragDl"
    >
      <div class="">
        <el-table ref="dragTable" v-loading="dragLoading" :data="dragList" row-key="id" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="顺序" width="65" type="index" />
          <el-table-column align="center" label="物料名称" prop="resourceName" />
          <el-table-column align="center" label="调整" width="80">
            <template slot-scope="{}">
              <svg-icon class="drag-handler" icon-class="drag" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--快速投放-->
    <el-drawer
      title="修改投放"
      :visible.sync="drawer"
      direction="rtl"
      size="640px"
      :before-close="closeDr"
    >
      <edit v-if="drawer" :key="fastDat.id" :dat="fastDat" :row-data="rowData" @close="closeDr" @put-success="putSuccess" />
    </el-drawer>
    <!--预览-->
    <el-dialog
      title="物料预览"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeDl"
    >
      <preview-materiel :preview="preview" />
    </el-dialog>
  </div>
</template>

<script>
import { queryResource } from '@/api/advert/materiel'
import { publishList, materielAttr, sortMateriel } from '@/api/advert/put'
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsAction from '@/components/BasicsAction'
import PreviewMateriel from '../materiel/components/PreviewMateriel/index'
import Edit from './components/Edit'
import columns, { actions as formAct } from './columns/list'
import searchs from './searchs/searchs'
import actions from './actions/list'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'

export default {
  name: 'Put',
  components: { BasicsTable, BasicsSearch, BasicsAction, PreviewMateriel, Edit },
  data() {
    return {
      table: { stripe: true },
      columns: columns,
      actionFunction: formAct({
        viewMateruel: this.viewMateruel,
        adjustOrder: this.adjustOrder,
        stopPut: this.stopPut
      }),
      actions: actions({ create: this.create }),
      searchs: searchs,
      list: null,
      loading: false,
      total: 0,
      query: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      /* 预览*/
      dialogVisible: false,
      preview: {},
      /* 预览*/
      sortable: null,
      dragVisible: false,
      dragLoading: false,
      dragList: [],
      oldList: [],
      newList: [],
      /* 预览*/
      drawer: false,
      fastDat: {},
      rowData: {}
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    // 筛选项联动
    changeSearch(val, oldVal) {
      const { clientType, userType } = this.$store.getters.adConfig
      const { businessType } = val
      if (businessType && businessType !== oldVal.businessType) {
        const clientTypeOption = clientType[businessType].map(v => {
          return {
            label: v,
            value: v
          }
        })
        const userTypeOption = Object.keys(userType[businessType]).map(v => {
          return {
            value: ~~v ? v : userType[businessType][v],
            label: ~~v ? userType[businessType][v] : v
          }
        })
        this.$refs.searchs.set({
          type: 'options',
          data: {
            clientType: clientTypeOption,
            userType: userTypeOption
          }
        })
        if (oldVal.clientType || oldVal.userType) {
          this.$refs.searchs.set({
            type: 'defaultVal',
            data: {
              clientType: '',
              userType: ''
            }
          })
        }
      }
    },
    // 搜索
    submitSearch(val) {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.query = val
      this.getList()
    },
    // 获取配置
    getConfig() {
      const { businessType, advertType } = this.$store.getters.adConfig
      this.$refs.searchs.set({
        type: 'options',
        data: {
          businessType,
          advertType
        }
      })
      this.$refs.searchs.set({
        type: 'defaultVal',
        data: {
          businessType: businessType[0].label || '',
          enabled: '1'
        }
      })
      this.$refs.searchs.search()
    },
    // 获取投放列表
    getList() {
      const { query, listQuery } = this
      const data = {
        ...query,
        userType: parseInt(query.userType),
        enabeld: parseInt(query.enabeld),
        publishStatus: parseInt(query.publishStatus)
      }
      delete data.time
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      publishList(data, {
        pageNum: listQuery.page,
        pageSize: listQuery.limit
      }).then(res => {
        const data = res.data || {}
        this.list = data.list || []
        this.total = data.total || 0
      })
    },
    // 获取物料详情
    getMateriel(id, callback) {
      queryResource({ resourceId: id }).then(res => {
        callback(res.data)
      }).catch(() => {
      })
    },
    // 新建投放
    create() {
      this.$router.push({ name: 'CreatePut' })
    },
    // 查看该投放的物料信息
    viewMateruel(dat, row, index) {
      this.dialogVisible = true
      this.getMateriel(row.resourceId, res => {
        this.preview = res || {}
      })
    },
    // 预览物料弹窗 - 关闭
    closeDl() {
      this.dialogVisible = false
      this.preview = {}
    },
    // 投放排序 - 开弹窗、获取要排序列表、初始化排序插件
    adjustOrder(dat, row, index) {
      this.dragVisible = true
      this.dragLoading = true
      materielAttr({ advertId: row.advertId }).then(res => {
        const data = res.data || []
        const defSequence = []
        let sequence = []
        data.map(item => {
          if (item.sequence === 0) { defSequence.push(item) } else { sequence[item.sequence] = item }
        })
        sequence = sequence.filter(item => item)
        const allSequence = [...defSequence, ...sequence]
        for (let i = 0; i < allSequence.length; i++) {
          allSequence[i].index = i + 1
        }
        this.dragList = allSequence
        this.oldList = allSequence.map(v => v.index)
        this.newList = this.oldList.slice()
        // 排序初始化
        this.$nextTick(() => {
          this.setSort()
        })
      }).finally(() => {
        this.dragLoading = false
      })
    },
    // 调序函数
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const change = (newIndex, oldIndex) => {
            const targetRow = this.dragList.splice(oldIndex, 1)[0]
            this.dragList.splice(newIndex, 0, targetRow)
            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(oldIndex, 1)[0]
            this.newList.splice(newIndex, 0, tempIndex)
          }
          change(evt.newIndex, evt.oldIndex)
          const orderInfo = []
          const dragList = this.dragList
          for (let i = 0; i < this.oldList.length; i++) {
            const index = this.oldList[i] - 1
            orderInfo[index] = {
              key: `${dragList[index].id}`, // 应后台要求id和序号需要String
              value: `${this.oldList[i]}`
            }
          }
          sortMateriel(orderInfo).then(() => {
            this.$message.success('排序已自动保存')
          }).catch(() => {
            change(evt.oldIndex, evt.newIndex)
          })
        }
      })
    },
    // 调序弹窗 - 关闭
    closeDragDl() {
      this.dragVisible = false
      this.dragList = []
      this.oldList = []
      this.newList = []
    },
    // 停止投放或重新投放
    stopPut(dat, row, index) {
      // if (row.enabled) {
      //   this.$confirm('请确认，是否停止当前投放?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.list[index].status = !this.list[index].status
      //     this.list = [...this.list]
      //     stopPublish({ publishId: row.id }).then(() => {
      //       this.$message.success('停止投放成功')
      //       this.getList()
      //     }).catch(() => {
      //     })
      //   }).catch(() => {
      //   })
      // } else {
      this.drawer = true
      this.rowData = row
      this.getMateriel(row.resourceId, res => {
        this.fastDat = res || {}
      })
      // }
    },
    // 快速投放关闭
    closeDr() {
      this.drawer = false
      this.fastDat = {}
      this.rowData = {}
    },
    // 快速投放成功回调
    putSuccess() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
	.materiel-info {

	}

	.materiel-info-item {
		display: flex;
		margin-bottom: 22px;
	}

	.materiel-info-item__label {
		display: block;
		width: 86px !important;
		margin-right: 10px;
		line-height: 36px;
		font-size: 14px;
		color: #606266;
		padding: 0 12px 0 0;
	}

	.materiel-info-item__content {
		flex: 1;

		p {
			margin: 8px 0;
			color: #333;
		}
	}

  .materiel-detail {
    border: 1px solid #f6f6f6;
    width: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /deep/ .el-image {
      margin: 0 auto;
      height: 200px;
    }
    img,video {
      z-index: 1;
      width: 300px;
      height: 200px;
      cursor: pointer;
    }
    svg {
      font-size: 50px;
      z-index: 2;
      color: #1890ff;
      cursor: pointer;
    }
  }
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  .icon-star{
    margin-right:2px;
  }
  .drag-handler{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d{
    margin-top: 15px;
  }
</style>
