// 对象， 大小写s
export const SUP_LEVEL_LOWER = formatSup('s')
export const SUP_LEVEL_UPPER = formatSup('S')

export const SUP_LEVEL = {
    4: 'S1-基础',
    1: 'S1-进阶',
    2: 'S2-基础',
    5: 'S2-进阶',
    3: 'S3',
    6: 'S3专项技能课'
  }

function formatSup(flag = 'S') {
    const obj = {}
    for (const key in SUP_LEVEL) {
      if (Object.keys(SUP_LEVEL).includes(key)) {
        const item = SUP_LEVEL[key]
        obj[`${flag}${key}`] = item
      }
    }
    return obj
  }

export function formatTeamNameSup(teamName) {
    if (!teamName) return
    const upperName = teamName.toLocaleUpperCase()
    let idx = -1
    if (upperName.indexOf('S1') > -1) {
      idx = upperName.indexOf('S1')
    }
    if (upperName.indexOf('S2') > -1) {
      idx = upperName.indexOf('S2')
    }
    if (upperName.indexOf('S4') > -1) {
      idx = upperName.indexOf('S4')
    }
    if (upperName.indexOf('S5') > -1) {
      idx = upperName.indexOf('S5')
    }
    if (upperName.indexOf('S6') > -1) {
      idx = upperName.indexOf('S6')
    }

    if (
      idx >= 0 &&
      !upperName.includes('基础') &&
      !upperName.includes('进阶') &&
      !upperName.includes('专项技能课')
    ) {
      const s = upperName.substr(idx, 2)
      teamName = teamName.replace(s, SUP_LEVEL_UPPER[s])
    }

    return teamName
  }
  export const SUP_LEVEL_LIST = [
    { id: 4, text: 'S1-基础' },
    { id: 1, text: 'S1-进阶' },
    { id: 2, text: 'S2-基础' },
    { id: 5, text: 'S2-进阶' },
    { id: 3, text: 'S3' },
    { id: 6, text: 'S3专项技能课' }
  ]
/**
 * 用于特殊情况下，体验课
 */
 const trialKey = [1, 2, 3]
  export const SUP_LEVEL_LIST_TRIAL = SUP_LEVEL_LIST.filter((item) =>
  trialKey.includes(item.id)
)
export const TRAINING_CAMP = {
  X1: '动物主题课',
  X2: '建筑主题课',
  X3: '手抄报主题课',
  X4: '宝宝自己画',
  X5: '国画特辑',
  X6: '职业规划师',
  X7: '画说西游',
  X8: '国之韵-书法之门',
  X9: '彩铅·美食绘画篇'
}
export const SUP_LEVEL_LIST_MUSIC = [
  { id: 1, text: 'M1' },
  { id: 2, text: 'M2' },
  { id: 3, text: 'M3' },
  { id: 4, text: 'M4' }
  // { id: 8, text: 'Ma' },
  // { id: 9, text: 'Mb' }
]
