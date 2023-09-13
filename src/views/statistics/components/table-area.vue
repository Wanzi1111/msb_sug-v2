<template>
  <div class="components-area-table">
    <div class="table-top">
      <el-radio-group v-model="areaValue" size="small" class="top-radios" @change="changeRadio">
        <el-radio-button v-for="(item, key) in areaOption" :key="key" :label="item.label" />
      </el-radio-group>
      <el-button plain @click="download">下载数据</el-button>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, key) in tableColumns"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="item.prop && item.prop.slice(0, 7) === 'problem'">
              <span>{{ scope.row[`${item.prop}Total`] }}</span>
              <span> ( {{ scope.row[`${item.prop}Rate`] }} ) </span>
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { radioMap, columnMap, typeMap } from './maps/table-area'
import { exportArea } from '@/api/statistics/area'
import { createBlob } from '@/utils'
export default {
  name: 'ComponentProblemsTable',
  props: {
    propData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      areaValue: '',
      areaOption: [],
      tableData: [],
      tableColumns: []
    }
  },
  methods: {
    initRadios(value, areaValue) {
      this.areaOption = radioMap.get(value) || []
      for (let i = 0, len = this.areaOption.length; i < len; i++) {
        if (this.areaOption[i].value === areaValue) {
          this.areaValue = this.areaOption[i].label
          break
        }
      }
    },
    initColumns(value) {
      const columnsData = columnMap.get(value)
      columnsData[0].label = this.areaValue
      this.tableColumns = columnsData
    },
    initList(data) {
      this.tableData = data.areaList
    },
    changeRadio(value) {
      this.$emit('typeChange', typeMap.get(value))
    },
    download() {
      const data = {
        createDateBegin: this.propData.createDateBegin,
        createDateEnd: this.propData.createDateEnd,
        channelPid: this.propData.channelPid,
        type: this.propData.type
      }
      exportArea(data).then(res => {
        createBlob(`投诉大区统计.xls`, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components-area-table {
  .table-top {
    display: flex;
    .top-radios {
      flex: 1;
    }
  }
}
</style>
