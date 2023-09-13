const {
    baseDataMap: {
        work_order_second_classification_map,
        work_order_second_quality_testing_map,
        work_order_second_quality_aftersale_map,
        work_order_three_classification_bearapp_map,
        work_order_three_classification_bearboss_map,
        work_order_three_classification_other_map,
        work_order_three_classification_store_aftersale_map,
        work_order_three_classification_experience_aftersale_map,
        work_order_three_classification_market_map,
        work_order_three_classification_teaching_map,
        work_order_three_classification_service_map,
        work_order_three_classification_counselor_map,
        work_order_three_classification_teacher_map,
        work_order_three_classification_learntotube_map,
        work_order_priority_tag_color_map,
        work_order_priority_map,
        work_order_classification_map,
        work_order_status_map,
        work_order_status_key_map
    }
} = window
// 二级工单类型合并
const workOrderSecondMap = {
    ...work_order_second_classification_map,
    ...work_order_second_quality_testing_map,
    ...work_order_second_quality_aftersale_map
}
// 三级工单类型合并
const workOrderThreeMap = {
    ...work_order_three_classification_bearapp_map,
    ...work_order_three_classification_bearboss_map,
    ...work_order_three_classification_other_map,
    ...work_order_three_classification_store_aftersale_map,
    ...work_order_three_classification_experience_aftersale_map,
    ...work_order_three_classification_market_map,
    ...work_order_three_classification_teaching_map,
    ...work_order_three_classification_service_map,
    ...work_order_three_classification_counselor_map,
    ...work_order_three_classification_teacher_map,
    ...work_order_three_classification_learntotube_map
}
const channelTypeList = [
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
    },
    {
      label: '绘本创作',
      value: '2011'
    }
  ]
const userTypeEum = {
    '1011': [
      {
        label: '体验用户',
        value: '1'
      },
      {
        label: '付费用户',
        value: '2'
      }
    ],
    '1012': [
      {
        label: '在职老师',
        value: '3'
      },
      {
        label: '停职老师',
        value: '4'
      }
    ],
    '1021': [
      {
        label: '体验用户',
        value: '1'
      },
      {
        label: '付费用户',
        value: '2'
      }
    ],
    '1022': [
      {
        label: '在职老师',
        value: '3'
      },
      {
        label: '停职老师',
        value: '4'
      }
    ],
    'all': [
      {
        label: '新注册用户',
        value: '5'
      },
      {
        label: '体验课用户',
        value: '6'
      },
      {
        label: '系统课用户',
        value: '7'
      },
      {
        label: '已注销用户',
        value: '8'
      }
    ]
  }
export {
    workOrderSecondMap,
    workOrderThreeMap,
    work_order_priority_tag_color_map,
    work_order_priority_map,
    work_order_classification_map,
    work_order_status_map,
    work_order_status_key_map,
    work_order_second_quality_testing_map,
    work_order_second_quality_aftersale_map,
    channelTypeList,
    userTypeEum
}
