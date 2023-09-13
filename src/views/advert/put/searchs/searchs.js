/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'resourceName',
    label: '物料名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入物料名称'
    }
  },
  {
    prop: 'businessType',
    label: '业务类型',
    type: 'select', // 选择器,
    options: [],
    attr: {
      placeholder: '请选择业务类型'
    }
  },
  {
    prop: 'clientType',
    label: '客户端',
    type: 'select', // 选择器,
    options: [],
    attr: {
      placeholder: '请选择客户端'
    }
  },
  {
    prop: 'advertType',
    label: '广告类型',
    type: 'select', // 选择器,
    options: [],
    attr: {
      placeholder: '请选择广告类型'
    }
  },
  {
    prop: 'userType',
    label: '用户类型',
    type: 'select', // 选择器,
    options: [],
    attr: {
      placeholder: '请选择用户类型'
    }
  },
  {
    prop: 'publishStatus',
    label: '投放状态',
    type: 'select', // 选择器,
    options: [
      {
        label: '投放中',
        value: '0'
      },
      {
        label: '等待投放',
        value: '1'
      },
      {
        label: '投放结束',
        value: '2'
      },
      {
        label: '未投放',
        value: '3'
      }
    ],
    attr: {
      placeholder: '请选择投放状态'
    }
  },
  {
    prop: 'enabled',
    label: '启用状态',
    type: 'select', // 选择器,
    options: [
      {
        label: '启用',
        value: '1'
      },
      {
        label: '禁用',
        value: '0'
      }
    ],
    attr: {
      placeholder: '请选择启用状态'
    }
  }
]

