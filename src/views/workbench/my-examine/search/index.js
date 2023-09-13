const {
  baseData: {
    productVersion_type,
    onlyStatus_type,
    course_type
  }
} = window
export default [
    {
        prop: 'type',
        label: '审批类型',
        type: 'select', // 选择器,
        defaultVal: '',
        attr: {
          size: 'small',
          placeholder: '请选择审批类型'
        },
        options: productVersion_type
      },
      {
        prop: 'userTel',
        label: '手机号',
        type: 'input', // 选择器,
        defaultVal: '',
        attr: {
          size: 'small',
          placeholder: '手机号'
        }
      },
      // {
      //   prop: 'inputName',
      //   slot: 'handlePeople',
      //   label: 'ID/手机号'
      // },
      // {
      //   prop: 'selectName',
      //   defaultVal: '1',
      //   hide: true,
      //   visible: false
      // },
      {
        prop: 'managementType',
        label: '课程类型',
        type: 'select', // 选择器,
        attr: {
          size: 'small',
          placeholder: '请选择课程类型'
        },
        options: course_type
      },
      {
        prop: 'period',
        label: '课程期数',
        type: 'select', // 选择器,
        visible: true,
        attr: {
          size: 'small',
          multiple: true,
          filterable: true,
          collapseTags: true,
          placeholder: '请选择课程期数'
        },
        options: []
      },
      {
        prop: 'departmentIds',
        slot: 'departmentIds',
        label: '全部部门'
      },
      {
        prop: 'teacherIds',
        label: '老师',
        type: 'select', // 选择器,
        attr: {
          size: 'small',
          placeholder: '请选择老师'
        },
        options: []
      },
      {
        prop: 'abstractContent',
        label: '审批摘要',
        type: 'input', // 选择器,
        attr: {
          size: 'small',
          placeholder: '请输入审批摘要'
        }
      },
      {
        prop: 'id',
        label: '审批单号',
        type: 'input', // 选择器,
        defaultVal: '',
        attr: {
          size: 'small',
          placeholder: '请输入审批单号'
        }
      },
      {
        prop: 'selectedInData',
        label: '时间类型',
        type: 'select', // 选择器,
        defaultVal: '1',
        attr: {
          size: 'small',
          placeholder: '请选择时间类型'
        },
        options: [
          {
            value: '1',
            label: '发起时间'
          },
          {
            value: '2',
            label: '审批时间'
          }
        ]
      },
      {
        prop: 'onlyStatus',
        label: '审批状态',
        type: 'select', // 选择器,
        visible: true,
        attr: {
          size: 'small',
          placeholder: '请选择审批状态'
        },
        options: onlyStatus_type
      }
]
