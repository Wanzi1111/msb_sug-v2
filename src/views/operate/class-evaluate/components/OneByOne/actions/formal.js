/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ statistics }) => {
  return [
    {
      type: 'alert', // 文本
      label: `正式课: 总课时数: ${statistics.foCount || 0}  参评课时数: ${statistics.foEvaluateStar || 0} 留言课程数：${statistics.foEvaluate || 0}  参评率: ${statistics.foPercenStar || 0}% 留言率:${statistics.foPercen || 0}% 5星: ${statistics.foFive || 0}%  4星: ${statistics.foFour || 0}%  3星: ${statistics.foThree || 0}%  2星: ${statistics.foTwo || 0}%  1星: ${statistics.foOne || 0}%`,
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    }
  ]
}
