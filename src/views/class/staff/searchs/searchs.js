/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-04 14:20:09
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-16 18:10:03
 */
export default [
  {
    prop: 'businessId',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      // multiple: true,
      size: 'small',
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'role',
    label: '角色',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'status',
    label: '员工状态',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      placeholder: '全部'
    },
    options: [
      {
        label: '禁用',
        value: 1
      },
      {
        label: '启用',
        value: 0
      }
    ]
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入手机号'
    }
  },
  {
    prop: 'staffName',
    label: '员工姓名',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入员工姓名'
    }
  }
]
