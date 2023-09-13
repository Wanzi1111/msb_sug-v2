<template>
  <div>
    <div class="title-container">
      <basics-title
        title="详情页"
        line
        :actions="[{
          type: 'button', // 按钮
          label: '主操作',
          click: () => {},
        }, {
          type: 'button', // 按钮
          label: '主操作2',
          click: () => {},
          attr: {
            type: 'primary'
          }
        }]"
      />
      <basics-info :info="info" />
    </div>

    <div class="tabs-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="海外" name="1" />
        <el-tab-pane label="1对1" name="2" />
        <!--				<el-tab-pane label="小班课" name="privateClass"/>-->
      </el-tabs>
    </div>

    <div class="app-container">
      <basics-title title="满宽的 BasicsInfo" />
      <basics-info :info="info" />
    </div>
    <div class="app-container">
      <basics-title title="带缩进的 BasicsInfo" />
      <basics-info :info="info" narrow />
    </div>
    <div class="app-container">
      <basics-title title="表格" />
      <demo1 />
    </div>
  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsInfo from '@/components/BasicsInfo'
import Demo1 from '../table/components/Demo1'

export default {
  name: 'BasicsInfos',
  components: { BasicsTitle, BasicsInfo, Demo1 },
  data() {
    return {
      activeName: '1',
      info: [
        {
          label: '用户姓名：',
          value: '付小小'
        },
        {
          label: '联系电话：',
          value: '18100000000'
        },
        {
          label: '常用快递：',
          value: '菜鸟仓储'
        },
        {
          label: '运费：',
          value: '18'
        },
        {
          label: '取货地址：',
          value: '浙江省杭州市西湖区万塘路18号',
          // all 最宽
          // large 中宽
          // default 正常
          // small 窄
          layer: 'large'
        },
        {
          label: '备注：',
          value: '无'
        }
      ]
    }
  },
  methods: {
  }
}
</script>

