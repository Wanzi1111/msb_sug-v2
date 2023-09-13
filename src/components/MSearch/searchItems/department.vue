<template>
  <div class="search-item">
    <el-cascader
      ref="dept"
      v-model="dataValue"
      collapse-tags
      :size="size"
      class="item-style"
      placeholder="请选择全部部门"
      :options="departmentList"
      :disabled="isDisabled"
      :props="{
        multiple,
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly
      }"
      :show-all-levels="false"
      clearable
      @change="onSelect"
    />
  </div>
</template>

<script>
import { sortByKey } from '@/utils/index'
import {
   getDepartmentList,
   getDepartmentTeacher
} from '@/api/myExamine'

export default {
  name: 'Department',
  props: {
    name: {
      type: String,
      default: ''
    },
    // 回显 - 显示赋值
    value: {
      type: [String, Array],
      default: '' // 483336053873315902
    },
    placeholder: {
      type: String,
      default: '销售部'
    },
    // 有时只需获取 deptid，无须获取teacherids
    onlyDept: {
      type: Number,
      default: 0
    },
    departmentId: {
      type: String,
      default: '0'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    // 单行模式下，选择任意一级选项
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 是否是兼职老师
    isParttimeTeacher: {
      type: Boolean,
      default: false
    },
    // 是否美术后端服务
    isArtsBackService: {
      type: Boolean,
      default: false
    },
    // 是否只显示书法部门
    isOnlyPartWrite: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10000
    },
    size: {
      type: String,
      default: 'mini'
    },
    activeChannelState: {
        type: String,
        default: 'ART_APP'
    }
  },
  data() {
    return {
      departmentList: [],
      dataValue: this.value || ''
    }
  },
  watch: {
    value(val) {
      this.dataValue = val || ''
    }
  },
  mounted() {
  if (this.activeChannelState !== 'null') {
    this.$nextTick(() => {
       this.getDepartment()
    })
    }
  },
  methods: {
    getDepartment() {
      if (this.isDisabled) return

      getDepartmentList({
          departmentId: this.departmentId,
          subject: this.activeChannelState
      }).then((res) => {
        const arr = res.payload || []
        sessionStorage.setItem('departmentData', JSON.stringify(arr))
        this.formatData(arr)
      })
    },
    formatData(arr = []) {
      let department = sortByKey(arr, 'id')
      department.sort(this.handle('sort'))
      this.recursive(department)
      if (this.isParttimeTeacher) {
        department = department.filter((item) => {
          return item.name === '美术兼职老师'
        })
      } else if (this.isArtsBackService) {
        this.departmentList = department.filter((item) => {
          return item.name === '美术后端服务'
        })
      } else {
        this.departmentList = department
      }
      if (this.isOnlyPartWrite) {
        department = department.filter((item) => {
          return item.name === '书法兼职老师' || item.name === '书法后端服务' // ''
        })
      }
      this.departmentList = department
    },
    async onSelect(data) {
      // TODO: 根据选择的销售组，获取销售ID
      // const ids = { department_id: data || [] }
      // 返回选择的节点本身及其包含的了节点
      const allNodes = this.$refs.dept.getCheckedNodes()
      const allNodesId = allNodes.map((item) => item.value)
      const ids = { department_id: allNodesId || [] }
      if (this.onlyDept === 1) {
        // this.$emit('result', { [this.name]: allNodesId })
        this.$emit(
          'result',
          data?.length > 0 ? { [this.name]: allNodesId } : ''
        )
      } else {
        const type = {
          'ART_APP': 0,
          'WRITE_APP': 1,
          'DANCE_APP': 2,
          'MUSIC_APP': 3
        }
        const teacher = await getDepartmentTeacher(
          JSON.stringify(ids),
          this.pageSize,
          this.isParttimeTeacher || this.isOnlyPartWrite,
          this.activeChannelState[type]
        )
        const teacherIds = teacher.data.TeacherList.map((item) => item.id)
        this.$emit(
          'result',
          data === null || data.length > 0 ? { [this.name]: teacherIds } : ''
        )
      }
    },
    handle(property) {
      return function(a, b) {
        const val1 = a[property]
        const val2 = b[property]
        return val2 - val1
      }
    },
    recursive(value) {
      value.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.sort(this.handle('sort'))
          this.recursive(item.children)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.threeSelect {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .el-icon-close {
    display: none;
  }
}
.search-item {
    flex: 1;
  .item-style {
    width: 100%;
    margin-right: 11px;
  }

}
// .el-cascader-panel {
//   max-height: 300px !important;
// }
</style>
