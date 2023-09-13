/**
 * @author: liwei
 * @description: 正式课
 * @date: 2020/4/7
 */
export default ({ statistics }) => {
  return [
    {
      type: 'alert', // 文本
      label: `正式课: 上课总人数: ${statistics.totalStuNum}  参评人数: ${statistics.alreadyStuNum}  参评率: ${statistics.alreadyPercent}%  5星: ${statistics.fivePercent}%  4星: ${statistics.fourPercent}%  3星: ${statistics.threePercent}%  2星: ${statistics.twoPercent}%  1星: ${statistics.onePercent}%`,
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    }
  ]
}
