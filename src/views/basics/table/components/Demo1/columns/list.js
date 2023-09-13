/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
export default [
  {
    type: 'selection',
    width: 40,
    align: 'center'
  },
  {
    width: 60,
    prop: 'id',
    label: '编号',
    align: 'center'
  },
  {
    width: 200,
    prop: 'content',
    label: '物料名称',
    align: 'center',
    fixed: true,
    showOverflowTooltip: true
  },
  {
    prop: 'author',
    label: '物料ID',
    align: 'center'
  },
  {
    prop: 'forecast',
    label: '物料尺寸',
    align: 'center',
    render: (h, dat, row, index) => {
      const stutas = {
        draft: 'success',
        b: 'error'
      }
      return stutas[row.status] || '11'
    }
  },
  {
    name: 'one',
    prop: 'action1',
    label: '操作1',
    align: 'center',
    action: true,
    margin: 'large'
  },
  {
    prop: 'importance',
    label: '物料类型',
    align: 'center'
  },
  {
    name: 'tag',
    action: true,
    prop: 'type',
    label: 'TAG',
    align: 'center'
  },
  {
    name: 'two',
    width: 360,
    prop: 'action',
    label: '操作2',
    align: 'center',
    action: true,
    margin: 'large'
  }
]
export const actions = ({ ok }) => {
  return {
    tag: [
      {
        type: 'tag',
        label: '失败',
        attr: {
          // size: 'mini',
          type: 'danger',
          plain: true
        }
      }
    ],
    one: [
      {
        type: 'button',
        click: ok,
        label: 'ok',
        attr: {
          size: 'mini',
          plain: true
        },
        render(dat, row, index) {
          return 'asdasd'
        }
      }
    ],
    two: [
      {
        type: 'button',
        click: ok,
        label: 'ok',
        attr: {
          size: 'mini',
          type: 'primary'
        },
        render(dat, row, index) {
          return row.author
        }
      },
      {
        type: 'button',
        click: ok,
        label: 'ok',
        attr: {
          size: 'mini',
          plain: true,
          type: 'danger',
          round: true,
          circle: true
        }
      },
      {
        type: 'link',
        label: 'link a',
        href: 'http://baidu.com',
        attr: {
          style: {
            'text-decoration': 'underline',
            color: '#1890ff'
          }
        }
      },
      {
        type: 'a',
        label: 'button a',
        click: ok,
        attr: {
          style: {
            color: '#4CAF50'
          }
        }
      },
      {
        type: 'span',
        label: 'span',
        attr: {
          style: {
            color: '#333'
          }
        }
      }
    ]
  }
}
