/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ exportDocument, statistics }) => {
  return [
    {
      type: 'alert', // 文本
      label: `试听课: 总课时数: ${statistics.auCount || 0}  参评课时数: ${statistics.auEvaluateStar || 0}  留言课程数：${statistics.auEvaluate || 0}  参评率: ${statistics.auPercenStar || 0}% 留言率:${statistics.auPercen || 0}%  5星: ${statistics.auFive || 0}%  4星: ${statistics.auFour || 0}%  3星: ${statistics.auThree || 0}%  2星: ${statistics.auTwo || 0}%  1星: ${statistics.auOne || 0}%`,
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'button', // 按钮
      label: '导出文档',
      align: 'right',
      click: exportDocument,
      attr: {
        type: 'primary'
      }
    }
  ]
}
