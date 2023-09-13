
export default [
    {
        prop: 'id',
        label: '审批单号',
        align: 'left',
        width: 120
    },
    {
        prop: 'applyName',
        slot: 'applyName',
        label: '申请人-部门',
        align: 'left',
        width: 150
    },
    {
        prop: 'type',
        slot: 'type',
        label: '审批类型',
        align: 'left',
        width: 180
    },
    {
        prop: 'userTel',
        slot: 'userTel',
        label: '用户电话',
        align: 'left',
        width: 150
    },
    {
        prop: 'periodName',
        slot: 'periodName',
        label: '课程类型',
        align: 'center',
        minWidth: 180
    },
    {
        prop: 'repiarContent',
        slot: 'repiarContent',
        label: '审批摘要',
        align: 'left',
        minWidth: 380
    },
    {
        prop: 'openTime',
        slot: 'openTime',
        label: '发起时间',
        align: 'left',
        minWidth: 160
    },
    {
        prop: 'approvalName',
        slot: 'approvalName',
        label: '审批人',
        align: 'left',
        minWidth: 150
    },
    {
        prop: 'approveTime',
        slot: 'approveTime',
        label: '审批时间',
        align: 'left',
        minWidth: 160
    },
    {
        prop: 'approvalRemark',
        slot: 'approvalRemark',
        label: '审批意见',
        align: 'left',
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
