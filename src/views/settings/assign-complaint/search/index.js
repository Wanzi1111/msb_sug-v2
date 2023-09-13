import { BUSINESS_LIST, ROLE_LIST } from '../config'

export default [
  {
    prop: 'businessId',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      // multiple: true,
      size: 'small',
      placeholder: '请选择业务线'
    },
    options: BUSINESS_LIST
  },
  {
    prop: 'role',
    label: '角色',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      placeholder: '请选择角色'
    },
    options: ROLE_LIST
  },
  {
    prop: 'serviceObject',
    label: '服务对象',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      size: 'small',
      placeholder: '请选择服务对象'
    },
    options: []
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    type: 'input', // 选择器,
    attr: {
      placeholder: '请输入手机号',
      maxLength: 11
    }
  },
  // {
  //   prop: 'problemId',
  //   label: '投诉问题',
  //   type: 'cascader',
  //   attr: {
  //     placeholder: '全部',
  //     options: []
  //   }
  // },
  {
    prop: 'problemIdOne',
    label: '一级分类',
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'problemIdTwo',
    label: '二级分类',
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'problemIdThree',
    label: '三级分类',
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'problemIdFour',
    label: '四级分类',
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'problemIdFive',
    label: '五级分类',
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'staffName',
    label: '客服姓名',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入客服姓名'
    }
  }
]
