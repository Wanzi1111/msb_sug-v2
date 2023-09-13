<template>
  <div class="search-item small">
    <el-select
      v-model="versionId"
      size="mini"
      clearable
      placeholder="随材版本"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="(item, i) in productVersion"
        :key="i"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import { getAppSubject } from '@/utils/index'
import { getCourseVersion } from '@/api/myExamine'

const subject = getAppSubject()
export default {
  name: '',
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    },
    versionRedeem: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      productVersion: [],
      versionId: null
    }
  },
  watch: {
    versionRedeem: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        console.info(oldValue, '接收', newValue)
        this.versionId = newValue
      }
    }
  },
  created() {
    console.log(subject, '科目')
    this.getProductVersion()
    this.$root.$on('lk', (r) => {
      this.versionId = '' // 补发货清空数据
    })
  },
  methods: {
    compare(property) {
      return function(a, b) {
        const value1 = a[property].replace(/[^0-9]/gi, '')
        const value2 = b[property].replace(/[^0-9]/gi, '')
        if (value1 < value2) {
          return -1
        }
      }
    },
    // 获取多版本盒子
    getProductVersion() {
      getCourseVersion({ type: 'courseVersion' }).then(
        (res) => {
          if (res && res.payload) {
            this.productVersion = res.payload.sort(this.compare('code'))
            // 书法的话过滤v1.1
            if (subject === 'WRITE_APP') {
              this.productVersion = this.productVersion.filter(
                (item) => item.code === 'V1.1' || item.code === 'V1.0'
              )
            }
          }
        }
      )
    },
    onChange(data) {
      console.log(data, '------------data')
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 108px !important;
  }
}
</style>
