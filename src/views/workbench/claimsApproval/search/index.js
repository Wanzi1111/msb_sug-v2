const {
    baseData: {
      currencyTypeMap,
      statusMap
    }
  } = window
  export default [
      {
          prop: 'currencyType',
          label: '赔付方式',
          type: 'select', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '选择赔付方式',
            clearable: true
          },
          options: currencyTypeMap
        },
        {
          prop: 'status',
          label: '审批状态',
          type: 'select', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '选择审批状态',
            clearable: true
          },
          options: statusMap
        },
        {
          prop: 'createName',
          label: '申请人员',
          type: 'select', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '选择申请人员',
            clearable: true
          },
          options: []
        },
        {
          label: '用户信息',
          slot: 'userId',
          prop: 'inputName'
        },
        {
          prop: 'selectName',
          defaultVal: '1',
          hide: false,
          visible: false
        },
        {
          prop: 'approvalNo',
          label: '赔付单号',
          type: 'input', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '输入赔付单号',
            clearable: true
          }
        },
        {
          prop: 'orderId',
          label: '关联订单',
          type: 'input', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '输入关联订单'
          }
        },
        {
          prop: 'selectedInData',
          label: '时间类型',
          type: 'select', // 选择器,
          defaultVal: '1',
          attr: {
            size: 'small',
            placeholder: '选择时间类型'
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
          prop: 'complaintNo',
          label: '工单号',
          type: 'input', // 选择器,
          defaultVal: '',
          attr: {
            size: 'small',
            placeholder: '输入审批单号',
            clearable: true
          }
        },
        {
          prop: 'createSource',
          label: '赔付来源',
          type: 'select',
          attr: {
            placeholder: '请选择',
            clearable: true
          },
          options: [{
            label: '工单客服',
            value: '0'
          }, {
            label: '智齿客服',
            value: '1'
          }]
        }
  ]
