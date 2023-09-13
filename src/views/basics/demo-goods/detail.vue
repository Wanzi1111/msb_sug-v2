<template>
  <div>
    <div class="title-container">
      <basics-title title="商品详情" line />
    </div>

    <div class="app-container">
      <basics-title title="商品信息" />
      <basics-info :info="info" />
    </div>
    <div class="app-container">
      <basics-title
        title="库存信息"
        :actions="[{
          type: 'button', // 按钮
          label: '库存流水',
          click: () => {},
          attr: {
            type: 'primary',
            icon: 'el-icon-sort'
          }
        }]"
      />
      <basics-info :info="info" narrow />
    </div>
  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsInfo from '@/components/BasicsInfo'

export default {
  name: 'BasicsDemoGoodsDetail',
  components: { BasicsTitle, BasicsInfo },
  data() {
    return {
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

