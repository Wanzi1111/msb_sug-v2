/**
 * @author: liwei
 * @description:
 * @date:
 */

const render = (h, val, cg, sta = false) => {
  return sta ? h('el-input', {
    props: {
      value: val
    },
    on: {
      input: e => cg(e)
    }
  }) : h('span', val)
}

export default (sta = false) => {
  return [
    {
      prop: 'user',
      label: '商品ID',
      customRender: (h, dat, row) => {
        return render(h, row.user, e => { row.user = e }, sta)
      }
    },
    {
      prop: 'messageName',
      label: '商品ID',
      align: 'center',
      children: [
        {
          prop: 'name',
          label: '商品ID',
          align: 'center',
          customRender: (h, dat, row) => {
            return render(h, row.name, e => { row.name = e }, sta)
          }
        },
        {
          prop: 'messageName',
          label: '商品ID',
          align: 'center',
          customRender: (h, dat, row) => {
            return render(h, row.messageName, e => { row.messageName = e }, sta)
          }
        }
      ]
    },
    {
      prop: 'group',
      label: '商品名称',
      align: 'center',
      type: 'custom',
      customRender: (h, dat, row) => {
        return render(h, row.group, e => { row.group = e }, sta)
      }
    },
    {
      prop: 'pushType',
      label: '库存数量',
      align: 'center',
      type: 'custom',
      customRender: (h, dat, row) => {
        return render(h, row.pushType, e => { row.pushType = e }, sta)
      }
    }
  ]
}

