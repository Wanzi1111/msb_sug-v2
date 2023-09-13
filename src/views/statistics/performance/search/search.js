/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-19 18:01:45
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-20 16:24:08
 */
export default [
  {
    prop: 'role',
    label: '',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      // multiple: true,
      filterable: true,
      collapseTags: true,
      placeholder: '选择角色'
    },
    options: []
  },
  {
    label: '',
    slot: 'handlePeople',
    prop: 'inputName1'
  },
  {
    prop: 'selectName1',
    defaultVal: '1',
    hide: true,
    visible: false
  }
]
