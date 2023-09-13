import moment from 'moment'
export default [
    {
        prop: 'twoType',
        label: '分类',
        type: 'select', // 选择器,
        defaultVal: '',
        attr: {
            // multiple: true,
            size: 'small',
            // collapseTags: true,
            placeholder: '请选择分类',
            clearable: true
        },
        options: []
    },
    {
        prop: 'userInfoInputSelect',
        label: '用户查询',
        // layer: 'middle',
        type: 'inputSelect', // 选择器,
        inputSelect: {
            prop: 'userInfoInputSelectProp',
            attr: {
                size: 'small'
            },
            options: [
                {
                    label: 'UID',
                    value: 'uid'
                },
                {
                    label: '手机号',
                    value: 'mobile'
                }
            ]
        },
        attr: {
            size: 'small',
            placeholder: '请输入'
        }
    },
    {
        prop: 'userInfoInputSelectProp',
        defaultVal: 'uid',
        hide: true,
        visible: false
    },
    {
        prop: 'sceneInfoInputSelect',
        label: '场景查询',
        type: 'inputSelect', // 选择器,
        // layer: 'middle',
        inputSelect: {
            prop: 'sceneInfoInputSelectProp',
            attr: {
                size: 'small'
            },
            options: [
                {
                    label: '场景ID',
                    value: 'scenarioId'
                },
                {
                    label: '场景名称',
                    value: 'scenarioName'
                },
                {
                    label: '中台模板ID',
                    value: 'templateId'
                },
                {
                    label: '业务请求ID',
                    value: 'requestId'
                }
            ]
        },
        attr: {
            size: 'small',
            placeholder: '请输入'
        }
    },
    {
        prop: 'sceneInfoInputSelectProp',
        defaultVal: 'scenarioId',
        hide: true,
        visible: false
    },
    {
        prop: 'SMSType',
        label: '短信类型',
        type: 'cascader', // 级联选择器,
        defaultVal: '',
        attr: {
            size: 'small',
            placeholder: '请选择短信类型',
            clearable: true
        },
        options: [
            {
                value: '0',
                label: '国内',
                children: [
                    {
                        value: '0-0',
                        label: '通知短信'
                    },
                    {
                        value: '0-1',
                        label: '营销推广短信'
                    },
                    {
                        value: '0-2',
                        label: '验证码'
                    }
                ]
            },
            {
                value: '1',
                label: '国际',
                children: [
                    {
                        value: '1-0',
                        label: '通知短信'
                    },
                    {
                        value: '1-1',
                        label: '营销推广短信'
                    },
                    {
                        value: '1-2',
                        label: '验证码'
                    }
                ]
            }
        ]
    },
    {
        prop: 'signature',
        label: '短信签名',
        type: 'select', // 选择器,
        defaultVal: '',
        // layer: 'middle',
        attr: {
            size: 'small',
            placeholder: '请选择短信签名',
            clearable: true
        },
        options: []
    },
    {
        prop: 'messageContent',
        label: '短信内容',
        type: 'input',
        // layer: 'middle',
        attr: {
            size: 'small',
            placeholder: '请输入',
            clearable: true
        }
    },
    {
        prop: 'sendTimeList',
        label: '发送时间',
        defaultVal: [moment(new Date() - 29 * 24 * 60 * 60 * 1000).valueOf(), moment(new Date()).valueOf()],
        type: 'daterange',
        // layer: 'middle',
        attr: {
            size: 'small',
            clearable: true,
            placeholder: '选择时间范围'
        }
    }

]
