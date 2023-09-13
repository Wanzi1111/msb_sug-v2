/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import { categoryList } from '@/api/goods/category'

export default [
  {
    prop: 'businessCode',
    label: '业务线',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'type',
    label: '商品类型',
    type: 'cascader',
    attr: {
      clearable: true,
      placeholder: '全部',
      collapseTags: true,
      props: {
        lazy: true,
        multiple: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          const { level } = node
          categoryList({
            pcode: level === 1 ? node.value : 0,
            level: level + 1,
            status: 1,
            pageAble: 'false'
          }).then(res => {
            const data = res.data || {}
            const list = data.rows || []

            const nodes = []
            list.map(item => {
              nodes.push({
                value: item.code,
                label: item.typeName,
                leaf: level === 1
              })
            })
            resolve(nodes)
          })
        }
      }
    }
  },
  {
    prop: 'productName',
    label: '商品名称',
    type: 'input',
    attr: {
      clearable: true,
      placeholder: '请输入商品名称'
    }
  }
]

