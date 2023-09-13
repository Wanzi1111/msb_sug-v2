<template>
  <div>

    <div class="title-container">
      <basics-title title="BasicsNewTable 数据表格【推荐使用】" line>
        iviewui Table写法，支持slot与render写法，配置精简，功能与BasicsTable一致，https://iviewui.com/components/table#ZDYLMB
      </basics-title>
    </div>

    <div class="app-container">
      <basics-title title="Demo4 最少配置" />
      <demo4 />
    </div>

    <div class="app-container">
      <basics-title title="Demo5 普通表格" />
      <demo5 />
    </div>

    <div class="title-container">
      <basics-title title="BasicsTable 数据表格" line />
    </div>

    <div class="app-container">
      <basics-title title="Demo1 普通表格" />
      <demo1 />
    </div>

    <div class="app-container">
      <basics-title title="Demo2 多表头全局修改表格" />
      <demo2 />
    </div>

    <div class="app-container">
      <basics-title title="Demo3 展开表格" />
      <demo3 />
    </div>

  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'

import Demo1 from './components/Demo1'
import Demo2 from './components/Demo2'
import Demo3 from './components/Demo3'
import Demo4 from './components/Demo4'
import Demo5 from './components/Demo5'

export default {
  name: 'BasicsTables',
  components: { BasicsTitle, Demo1, Demo2, Demo3, Demo4, Demo5 },
  data() {
    return {}
  }
}
</script>
