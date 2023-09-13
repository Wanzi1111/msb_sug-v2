
export default [
    {
        prop: 'approvalNo',
        label: '赔付单号',
        align: 'center',
        width: 140
    },
    {
        prop: 'createName',
        label: '申请人-部门',
        align: 'center',
        width: 150
    },
    {
        prop: 'status',
        slot: 'status',
        label: '审批类型',
        align: 'center',
        render(h) {
            return '赔付审批'
        }
    },
    {
        prop: 'userMobile',
        slot: 'userMobile',
        label: '用户电话',
        align: 'center',
        width: 150
    },
    {
        prop: 'courseName',
        label: '课程类型',
        align: 'center',
        minWidth: 180
    },
    {
        prop: 'comment',
        slot: 'comment',
        label: '审批摘要',
        align: 'left',
        minWidth: 220
    },
    {
        prop: 'amount',
        slot: 'amount',
        label: '赔付额度',
        align: 'center',
        showOverflowTooltip: true,
        width: 200
    },
    {
        prop: 'ctime',
        label: '发起时间',
        align: 'center',
        minWidth: 160
    },
    {
        prop: 'staffName',
        label: '审批人',
        align: 'center',
        minWidth: 150
    },
    {
        prop: 'approvalTime',
        label: '审批时间',
        align: 'center',
        minWidth: 160
    },
    {
        prop: 'comment',
        label: '审批意见',
        align: 'center',
        minWidth: 150
    },
    {
        prop: 'status',
        slot: 'status',
        label: '审批状态',
        align: 'center',
        width: 100,
        fixed: 'right'
    },
    {
        action: true,
        name: 'action',
        slot: 'action',
        width: 100,
        prop: 'action',
        label: '操作',
        align: 'center',
        fixed: 'right'
    }
]
