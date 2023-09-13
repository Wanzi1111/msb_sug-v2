
const { baseData: { Agency_follow_up_method }} = window
export const emitBacklogForm = [
      {
        prop: 'complaintNo',
        slot: 'complaintNo',
        label: '待办投诉单'
      },
      {
        prop: 'executeTime',
        slot: 'executeTime',
        label: '跟进时间',
        rules: [
           { required: true, message: '跟进时间不能为空' }
        ]
      },
    {
        prop: 'content',
        label: '跟进内容',
        type: 'textarea', // 多文本
        defaultVal: '',
        attr: {
            placeholder: '请填写跟进内容，例如： 17：00点前给用户打电话'
        },
        rules: [ // 校验
            { required: true, message: '跟进内容必填！' }
        ]
    },
    {
        prop: 'type',
        label: '跟进方式',
        type: 'checkbox',
        defaultVal: ['101'],
        options: Agency_follow_up_method,
        rules: [ // 校验
            { required: true, message: '跟进方式必选！' }
        ]
    },
    {
        prop: 'status',
        label: '是否关闭',
        type: 'checkbox',
        defaultVal: [2],
        options: [
            {
                label: '关闭代办',
                value: 2
            }
        ]
    }

]
export const actions = ({ cancel, ensure }) => {
    return {
        submit: {
            // 默认按钮一
            hide: true // 是否显示 默认false
        },
        back: {
            hide: true
        },
        ensure: {
            click: ensure,
            type: 'button',
            label: '确定',
            attr: {
                type: 'primary'
            }
        },
        cancel: {
            click: cancel,
            type: 'button',
            label: '取消'
        }
    }
}
