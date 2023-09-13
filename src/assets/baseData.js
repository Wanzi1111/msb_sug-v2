/* eslint-disable no-unused-vars */

/**
 * @description 全局通用 start
 */
const user_type = [ // 用户类型
  { label: '体验用户', value: '1' },
  { label: '付费用户', value: '2' },
  { label: '在职老师', value: '3' },
  { label: '停职老师', value: '4' },
  { label: '新注册用户', value: '5' }, 
  { label: '体验课用户', value: '6' },
  { label: '系统课用户', value: '7' },
  { label: '已注销用户', value: '8' }
]

const processing_progress = [ // 处理进度
  { label: '发起', value: '0' },
  { label: '介入', value: '1' },
  { label: '处理', value: '2' },
  { label: '关闭', value: '3' },
  { label: '设为无效', value: "4" },
  { label: '修改操作人', value: '5' },
  { label: '设为待处理', value: "6" },
  { label: '回访登记', value: '7' },
  { label: '修改优先级', value: '8' },
  { label: '转教管', value: '9' },
  { label: '转销售', value: '10' },
  { label: '转教辅', value: "11" },
  { label: '转业务', value: "12" },
  { label: '转交', value: "13" },
  { label: '已办理', value: "14" },
  { label: '拒绝', value: "15" },
  { label: '评论', value: "16" },
]

/**
 * @description 全局通用 end  
 */

/**
 * @description 工单管理 start
 */
const work_order_source = [ // 工单来源
  { label: '在线客服', value: '100' },
  { label: '投诉中心', value: '101' },
  { label: '钉钉', value: '102' },
]

const work_order_type = [ // 工单类型
  { label: '投诉工单', value: '1' },
  { label: '技术问题', value: '2' },
  { label: '用户建议', value: '3' },
  { label: '质检工单', value: '4' },
  { label: '售后工单', value: '5' },
]

const work_order_second_classification = [ // 技术问题工单二级分类
  { label: '小熊美术app', value: '11' },
  { label: '小熊音乐app', value: '14' },
  { label: '小熊BOSS', value: '12' },
  { label: '其它', value: '13' }
]
const work_order_second_quality_testing= [ // 质检工单二级分类
  { label: '投诉销售', value: '51' },
  { label: '投诉教辅', value: '52' },
  { label: '投诉客服', value: '53' },
  { label: '投诉班主任', value: '54' },
  { label: '投诉教学老师', value: '55' },
  { label: '投诉学管', value: '56' },

]
const work_order_second_quality_aftersale= [ // 售后工单二级分类
  { label: '商城售后', value: '101' },
  { label: '体验课售后', value: '102' }
]
const work_order_second_map = { //工单类型对应二级分类
  '2': work_order_second_classification,
  '4': work_order_second_quality_testing,
  '5': work_order_second_quality_aftersale
}
const work_order_three_classification_store_aftersale = [ // 三级分类 商城售后
  { label: '补偿用户金币', value: '10101' },
  { label: '扣除用户金币', value: '10102' },
  { label: '补发货', value: '10103' },
  { label: '退货', value: '10104' },
  { label: '换货', value: '10105' },
  { label: '取消订单', value: '10106' },
  { label: '再次推单', value: '10107' },
  { label: '核对商品信息', value: '10108'},
  { label: '异常问题', value: '10109'},
]
const work_order_three_classification_experience_aftersale = [ // 三级分类 体验课售后
  { label: '预约试听', value: '10201' },
  { label: '申请退费', value: '10202' },
]
const work_order_three_classification_market = [ // 三级分类 投诉销售
  { label: '服务态度差/辱骂用户', value: '5101' },
  { label: '回复不及时', value: '5102' },
  { label: '过度承诺', value: '5103' },
  { label: '规则解答有误', value: '5104' },
  { label: '点评不专业/不及时/敷衍', value: '5105' },
  { label: '随意踢出群', value: '5106' },
  { label: '操作失误', value: '5107' },
  { label: '营销过度/骚扰用户/群发', value: '5108'},
]
const work_order_three_classification_teaching = [ // 三级分类 投诉教辅
  { label: '回复不及时', value: '5201' },
  { label: '服务态度差/辱骂用户', value: '5202' },
  { label: '过度承诺', value: '5203' },
  { label: '随意踢出群', value: '5204' },
  { label: '规则解答有误', value: '5205' },
  { label: '点评不专业/不及时/敷衍', value: '5206' },
  { label: '推卸责任/责任心欠缺', value: '5207' },
  { label: '上课状态中沟通频次少', value: '5209' },
  { label: '换班级或调级', value: '5210'},
  { label: '离职交接', value: '5211'},
  { label: '营销过度/骚扰用户/群发', value: '5208'},

]
const work_order_three_classification_service = [ // 三级分类 投诉客服
  { label: '专业能力不足', value: '5302' },
  { label: '服务态度差/辱骂用户', value: '5301' },
  { label: '过度承诺', value: '5303' },
  { label: '规则解答有误', value: '5305' },
  { label: '操作失误', value: '5304' },
]
const work_order_three_classification_counselor = [ // 三级分类 投诉班主任
  { label: '回复不及时', value: '5401' },
  { label: '服务态度差/辱骂用户', value: '5402' },
  { label: '过度承诺', value: '5403' },
  { label: '随意踢出群', value: '5404' },
  { label: '规则解答有误', value: '5405' },
  { label: '推卸责任/责任心欠缺', value: '5406' },
  { label: '营销过度/骚扰用户/群发', value: '5407' },
  { label: '上课状态中沟通频次少', value: '5408' },
  { label: '换班级或调级', value: '5409'},
  { label: '离职交接', value: '5410'},
]
const work_order_three_classification_teacher = [ // 三级分类 投诉教学老师
  { label: '专业能力不足', value: '5502' },
  { label: '上课敷衍', value: '5501' },
  { label: '不按课程规划上课', value: '5503' },
  { label: '辱骂/批评孩子', value: '5504' },
  { label: '频繁更换老师', value: '5505' },
  { label: '无故缺课/迟到/早退', value: '5506' },
  { label: '课效不满意', value: '5507' },
  { label: '课后报告不规范', value: '5508'},
]
const work_order_three_classification_learntotube = [ // 三级分类 投诉学管
  { label: '回复不及时', value: '5601' },
  { label: '服务态度差/辱骂用户', value: '5602' },
  { label: '过度承诺', value: '5603' },
  { label: '随意踢出群', value: '5604' },
  { label: '规则解答有误', value: '5605' },
  { label: '推卸责任/责任心欠缺', value: '5606' },
  { label: '营销过度/骚扰用户/群发', value: '5607' },
  { label: '上课状态中沟通频次少', value: '5608' },
  { label: '换班级或调级', value: '5609'},
  { label: '离职交接', value: '5610'},
]
const work_order_three_classification_bearapp = [ // 三级分类 小熊美术app
  { label: '课程解锁异常', value: '1101' },
  { label: '放错课程', value: '1102' },
  { label: '课件加载异常', value: '1103' },
  { label: '课程观看不了', value: '1104' },
  { label: '登录异常', value: '1105' },
  { label: '转介绍截图上传失败', value: '1106' },
  { label: '购买/支付异常', value: '1107' },
  { label: '小熊币领取异常', value: '1108'},
  { label: '其他', value: '1109' }
]
const work_order_three_classification_bearboss = [ // 三级分类 小熊BOSS
  { label: '学员基础信息显示异常', value: '1201' },
  { label: '订单显示异常', value: '1202' },
  { label: '物流问题', value: '1203' },
  { label: '地址问题', value: '1204' },
  { label: '审批中心', value: '1205' },
  { label: '其他', value: '1206' }
]

const work_order_three_classification_other = [ // 三级分类 其他
  { label: '其他',value: '1301' }
]

const work_order_classification_map = {
  '11': work_order_three_classification_bearapp,
  '12': work_order_three_classification_bearboss,
  '13': work_order_three_classification_other,
  '14': work_order_three_classification_bearapp,
  '51': work_order_three_classification_market,
  '52': work_order_three_classification_teaching,
  '53': work_order_three_classification_service,
  '54': work_order_three_classification_counselor,
  '55': work_order_three_classification_teacher,
  '56': work_order_three_classification_learntotube,
  '101': work_order_three_classification_store_aftersale,
  '102': work_order_three_classification_experience_aftersale,
}

const work_order_priority = [ // 优先级
  { label: '普通', value: '5' },
  { label: '低', value: '4' },
  { label: '中', value: '3' },
  { label: '高', value: '2' },
  { label: '急', value: "1" }
]

const work_order_priority_tag_color_map = { // 优先级tag_color映射
  "1": 'danger',
  "2": 'warning',
  "4": 'success',
  "5": 'info'
}

const work_order_service_records = [ // 是否同步服务记录
  { label: '是',value: '1' },
  { label: '否',value: '0' }
]

const work_order_status = [ // 工单状态
  { label: '待处理',value: '1' },
  { label: '处理中',value: '2' },
  { label: '已关闭',value: '3' }
]

const not_disturb_type = [
  { label: '营销勿扰',value: '1' },
  { label: '质检勿扰',value: '2' },
  { label: '短信勿扰',value: '3' }
]
const new_express_type_list = [ //工单列表的处理状态
  {
    value: '0',
    label: '全部'
  },
  {
    value: '1',
    label: '待处理'
  },
  {
    value: '2',
    label: '处理中'
  },
  {
    value: '3',
    label: '已关闭'
  },
  {
    value: '7',
    label: '已回访'
  },
  {
    value: '6',
    label: '无效投诉'
  }
]
const new_express_children_type_list = { // 工单列表的子集筛选项
  '1': [{
    value: '',
    label: '全部'
  }, {
    value: '13',
    label: '超时未处理'
  }, {
    value: '10',
    label: '未处理'
  }, {
    value: '11',
    label: '回访激活'
  }, {
    value: '12',
    label: '无效激活'
  }, {
    value: '12',
    label: '业务方退回'
  }],
  '2': [{
    value: '',
    label: '全部'
  }, {
    value: '22',
    label: '超时未处理'
  }, {
    value: '20',
    label: '客服处理中'
  }, {
    value: '21',
    label: '业务处理中'
  }, {
    value: '23',
    label: '业务处理完成'
  }, {
      value: '2',
      label: '回访退回'
    }],
  '3': [{
    value: '',
    label: '全部'
  }, {
    value: '30',
    label: '待回访'
  }, {
    value: '31',
    label: '业务关闭'
  }],
  '7': [{
    value: '',
    label: '全部'
  }, {
    value: '70',
    label: '已登记'
  }, {
    value: '71',
    label: '待评价'
  }, {
    value: '72',
    label: '评价满意'
  }, {
    value: '73',
    label: '评价不满意'
  }],
  '6': [{
    value: '',
    label: '全部'
  }, {
    value: '60',
    label: '无效投诉'
  }, {
    value: '61',
    label: '重复提交'
  }]
}
const after_sale_type_list = [ //新售后单列表的处理状态
  {
    value: '0',
    label: '全部'
  },
  {
    value: '1',
    label: '待处理'
  },
  {
    value: '2',
    label: '处理中'
  },
  {
    value: '203',
    label: '处理成功'
  },
  {
    value: '204',
    label: '处理失败'
  },
  {
    value: '8',
    label: '已取消'
  },
  {
    value: '3',
    label: '已关闭'
  }
]
const after_sale_children_type_list = { // 新售后单列表的子集筛选项
  '1': [{
    value: '',
    label: '全部'
  }, {
    value: '13',
    label: '超时未处理'
  }, {
    value: '10',
    label: '未处理'
  }],
  '2': [{
    value: '',
    label: '全部'
  }, {
    value: '22',
    label: '超时未处理'
  }, {
    value: '20',
    label: '客服处理中'
  }, {
    value: '23',
    label: '待回填单号'
  },{
    value: '24',
    label: '退款中'
  },{
    value: '25',
    label: '待物流审批'
  },{
    value: '26',
    label: '待财务审批'
  },{
    value: '27',
    label: '供应链驳回'
  },{
    value: '28',
    label: '物流已发货'
  }],
  '203': [{
    value: '',
    label: '全部'
  }],
  '204': [{
    value: '',
    label: '全部'
  }],
  '8': [{
    value: '',
    label: '全部'
  }, {
    value: '82',
    label: '用户取消'
  }],
  '3': [{
    value: '',
    label: '全部'
  },{
    value: '81',
    label: '客服取消'
  }, ],
}
const work_type_list = [ //工单投诉工单和用户建议工单的筛选项
  {
    value: 'allNum',
    label: '全部'
  },
  {
    value: 'myNum',
    label: '我创建的'
  }
]
// 美术、舞蹈的审批类型
const productVersion_type = [
  { label: '退款', value: 'REFUND' },
  { label: '商城物流撤单', value: 'BEAR_GOLD_COIN' },
  { label: '补发货', value: 'REISSUE' },
  { label: '体验课调级', value: 'ADJUSTMENT_SUP_TRIAL' },
  { label: '调期申请', value: 'ADJUSTMENT_STAGE' },
  { label: '调难度申请', value: 'ADJUSTMENT_SUP' },
  { label: '调级别申请', value: 'ADJUSTMENT_LEVEL' },
  { label: '调班申请', value: 'ADJUSTMENT_CLASS' },
  { label: '赠品', value: 'PROMOTIONS' },
  { label: '随材打包', value: 'PACKAGE_BOX' },
  { label: '无归属订单审批', value: 'UNCREDITED' },
  { label: '续费调班', value: 'ADJUSTMENT_RENEW' },
  { label: '学员转班', value: 'CHANGE_CUSTOMER' },
  { label: '判单审批', value: 'JUDGMENT_PAY_TEACHER_ONLINE' },
  { label: '订单转入', value: 'CHANGE_CUSTOMER_IMPORT' }
]
// 音乐的审批类型
const music_app_productVersion = [
  { label: '退款', value: 'REFUND' },
  { label: '商城物流撤单', value: 'BEAR_GOLD_COIN' },
  { label: '补发货', value: 'REISSUE' },
  { label: '体验课调级', value: 'ADJUSTMENT_SUP_TRIAL' },
  { label: '调期申请', value: 'ADJUSTMENT_STAGE' },
  { label: '调难度申请', value: 'ADJUSTMENT_SUP' },
  { label: '调级别申请', value: 'ADJUSTMENT_LEVEL' },
  { label: '调班申请', value: 'ADJUSTMENT_CLASS' },
  { label: '赠品', value: 'PROMOTIONS' },
  { label: '随材打包', value: 'PACKAGE_BOX' },
  { label: '无归属订单审批', value: 'UNCREDITED' },
  { label: '续费调班', value: 'ADJUSTMENT_RENEW' },
  { label: '判单审批', value: 'JUDGMENT_PAY_TEACHER_ONLINE' },
  { label: '硬件补发/维修/退换', value: 'REISSUE_HARDWARE' }
]
// 书法的审批类型
const write_app_productVersion = [
  { label: '退款', value: 'REFUND' },
  { label: '商城物流撤单', value: 'BEAR_GOLD_COIN' },
  { label: '补发货', value: 'REISSUE' },
  { label: '体验课调级', value: 'ADJUSTMENT_SUP_TRIAL' },
  { label: '调期申请', value: 'ADJUSTMENT_STAGE' },
  { label: '调难度申请', value: 'ADJUSTMENT_SUP' },
  { label: '调级别申请', value: 'ADJUSTMENT_LEVEL' },
  { label: '调班申请', value: 'ADJUSTMENT_CLASS' },
  { label: '赠品', value: 'PROMOTIONS' },
  { label: '随材打包', value: 'PACKAGE_BOX' },
  { label: '无归属订单审批', value: 'UNCREDITED' },
  { label: '续费调班', value: 'ADJUSTMENT_RENEW' },
  { label: '判单审批', value: 'JUDGMENT_PAY_TEACHER_ONLINE' }
]
const onlyStatus_type = [
  {
    value: 'PENDING',
    label: '待审批'
  },          
  {
    value: 'REVOCATION',
    label: '审批撤销'
  },          
  {
    value: 'COMPLETED',
    label: '审批通过'
  },          
  {
    value: 'DECLINE',
    label: '审批拒绝'
  }
]
// 美术的课程类型
const course_type = [
  {
  value: 'TESTCOURSE',
  label: '体验课',
  key: '0'
},
{
  value: 'SYSTEMCOURSE',
  label: '系统课',
  key: '1'
},
{
  value: 'CAMPCOURSE',
  label: '训练营',
  key: '3'
},
{
  value: 'MEIYUTHEMECOURSE',
  label: '美育主题课',
  key: '6'
}
]
// 书法的课程类型
const write_app_courseOptions = [
  {
    value: 'TESTCOURSE',
    label: '体验课',
    key: '0'
  },
  {
    value: 'SYSTEMCOURSE',
    label: '系统课',
    key: '1'
  },
  {
    value: 'CAMPCOURSE',
    label: '专项扩展课',
    key: '3'
  }
]
// 音乐的课程类型
const music_app_courseOptions = [
  {
    value: 'TESTCOURSE',
    label: '体验课',
    key: '0'
  },
  {
    value: 'SYSTEMCOURSE',
    label: '系统课',
    key: '1'
  },
  {
    value: 'CAMPCOURSE',
    label: '钢琴课',
    key: '3'
  }
]
// 舞蹈的课程类型
const dance_app_courseOptions = [
  {
    value: 'EXPERIENCE_ONE_WEEK',
    label: '体验课'
  },
  {
    value: 'SPECIFIC',
    label: '精品课'
  }
]
// 手工的课程类型
const handmade_courseOptions = [
  {
    value: 'HANDMADE',
    label: '小熊手工'
  }
]
// 待办跟进方式
const Agency_follow_up_method = [
  {
      label: '电话跟进',
      value: '101'
  },
  {
      label: '短信跟进',
      value: '102'
  },
  {
      label: '钉钉跟进',
      value: '103'
  },
  {
      label: '工单跟进',
      value: '104'
  },
  {
      label: '其他',
      value: '105'
  }
]
const channel_type_list = [
  {
    label: '1v1用户',
    value: '1011'
  },
  {
    label: '1v1老师',
    value: '1012'
  },
  {
    label: '小班课用户',
    value: '1021'
  },
  {
    label: '小班课老师',
    value: '1022'
  },
  {
    label: '小熊用户',
    value: '1031'
  },
  {
    label: '书法用户',
    value: '1041'
  },
  {
    label: '小熊音乐',
    value: '1051'
  },
  {
    label: '书画院用户',
    value: '1061'
  },
  {
    label: '小熊舞蹈用户',
    value: '1071'
  },
  {
    label: '小熊手工',
    value: '1081'
  }
]

export const currencyTypeMap = [{
  label: '小熊币',
  value: '2',
  key: 'bearCoins'
}, {
  label: '金币',
  value: '3',
  key: 'goldCoins'
}, {
  label: '课时',
  value: '4',
  key: 'course'
}, {
  label: '实物',
  value: '6',
  key: 'material'
}]
export const statusMap = [{
  label: '待审批',
  value: '0'
}, {
  label: '审批通过',
  value: '1'
}, {
  label: '审批拒绝',
  value: '2'
}, {
  label: '审批撤销',
  value: '3'
},{
  label: '赔付完成',
  value: '4'
},{
  label: '赔付失败',
  value: '5'
}]
// const TRIAL_CLASS_REFUND_TYPE = [ // 体验课
//   { label: '课程退款', value: '1' },
//   { label: '补偿', value: '2' }
// ]

// const TRIAL_CLASS_REFUND_TYPE = [ // 半年系统课
//   { label: '优惠劵退款', value: '1' },
//   { label: '课程退款', value: '2' },
//   { label: '补偿', value: '3' }
// ]

// const TRIAL_CLASS_REFUND_TYPE = [ // 年系统课
//   { label: '优惠劵退款', value: '1' },
//   { label: '课程退款', value: '2' },
//   { label: '补偿', value: '3' }
// ]
export default {
  user_type,
  processing_progress,
  work_order_source,
  work_order_type,
  work_order_second_classification,
  work_order_three_classification_bearapp,
  work_order_three_classification_bearboss,
  work_order_three_classification_other,
  work_order_classification_map,
  work_order_priority,
  work_order_priority_tag_color_map,
  work_order_service_records,
  work_order_status,
  not_disturb_type,
  new_express_type_list,
  after_sale_type_list,
  new_express_children_type_list,
  after_sale_children_type_list,
  work_type_list,
  onlyStatus_type,
  course_type,
  productVersion_type,
  music_app_productVersion,
  write_app_productVersion,
  write_app_courseOptions,
  music_app_courseOptions,
  dance_app_courseOptions,
  handmade_courseOptions,
  work_order_second_quality_testing,
  work_order_three_classification_market,
  work_order_three_classification_teaching,
  work_order_three_classification_service,
  work_order_three_classification_counselor,
  work_order_three_classification_teacher,
  work_order_three_classification_learntotube,
  work_order_second_quality_aftersale,
  work_order_three_classification_store_aftersale,
  work_order_three_classification_experience_aftersale,
  work_order_second_map,
  Agency_follow_up_method,
  channel_type_list,
  currencyTypeMap,
  statusMap,
  
}