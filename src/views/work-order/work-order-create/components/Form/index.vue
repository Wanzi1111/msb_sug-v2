<template>
  <div v-loading.fullscreen.lock="loadings._k8s_api_complaint_api_v2_complaint_userRemark || loadings._k8s_api_complaint_api_problem_getBypid || loadingAiliyun || loadings._k8s_api_complaint_api_oss_getSignature || loading" class="app-container">
    <basics-block title="创建工单">
      <el-tabs v-model="activeChannelState">
        <el-tab-pane v-for="(item, index) in channelTypeList" :key="index" :label="item.label" :name="item.value" />
      </el-tabs>
      <basics-form ref="sugForm" :key="key" :loading="loadingCreate" :forms="sugForm" :actions="formAction" style="padding-bottom:20px;" class="form-item" @submitForm="submitForm" @changeForm="changeForm">
        <template slot="complaintPeople" slot-scope="scope" class="search-item">
          <el-form-item v-bind="scope.item" class="form-item">
            <el-input v-model="scope.form.userId" placeholder="UID">
              <template slot="append">
                <el-button type="defalut" @click="searchUser(scope.form.userId)">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <!-- 备注问题 -->
        <template slot="userInfo" class="search-item">
          <div class="searchUserInfo complain-detail-list">
            <ul>
              <li>
                <span class="complain-detail-list-tag">
                  用户类型
                </span>
                <span>
                  {{ userType[data.userType] ? userType[data.userType].label : null }}
                </span>
              </li>
              <li class="complain-detail-list-remark-box">
                <span class="complain-detail-list-tag">
                  备注信息
                </span>
                <div class="complain-detail-list-remark">
                  <span>{{ data.userRemarkOne }}: {{ data.userRemarkTwo }} - {{ data.userRemarkThree }} - {{ data.userRemarkFour }} - {{ data.userRemarkFive }} - {{ data.userRemarkSix }} - {{ data.userRemarkSeven }}</span>
                  <span>{{ data.userRemarkEight }}: {{ data.userRemarkNine }}-{{ data.userRemarkTen }} - {{ data.userRemarkEleven }} - {{ data.userRemarkTwelve }} - {{ data.userRemarkThirteen }} - {{ data.userRemarkFourteen }}</span>
                  <!-- <span style="line-height: 20px">
                      {{ data.userRemarkContent }}
                      <a style="color: #409eff" @click="addRemark(data.userRemarkContent)">{{ data.userRemarkContent ? '编辑' : '添加' }}</a>
                    </span> -->
                </div>
              </li>
            </ul>
          </div>
        </template>
      </basics-form>
    </basics-block>
  </div>
</template>
<script>
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import { getProblemChannelId } from '@/api/operate/complainNew'
import { getBypids } from '@/api/operate/question'
import { getUserRemark, createComplaintV2 } from '@/api/operate/createSug'
import { createWorkOrder } from '@/api/work-order'
import { sugForm, actions as formAction } from './forms'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { channelTypeList, userType } from './config'
import { debounce } from 'lodash'

// type
// 1: 工商
// 2: 400客服
// 3: 在线客服
// 4: 黑猫投诉
const {
  work_order_second_map, // 工单类型对应二级分类
  work_order_classification_map // 二级对应的三级分类
     } = window.baseData
export default {
  components: { BasicsBlock, BasicsForm },
  data() {
    return {
      sugForm,
      input2: '',
      data: {},
      type: this.$route.params.type,
      key: 1,
      activeChannelState: '1011',
      formAction: formAction({ cancel: this.cancel, ensure: this.ensure }),
      channelTypeList,
      userType,
      serviceType: {
        1: '1',
        2: '2',
        3: '3',
        4: '4'
      },
      workChannel: '101',
      second_map: work_order_second_map,
      three_map: work_order_classification_map,
      problemOneLevelType: '1',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['loadings']),
    loadingCreate() {
      return this.loadings._k8s_api_complaint_api_v2_complaint_createComplaintV2
    },
    loadingAiliyun() {
      return this.loadings['https:__one-by-one.oss-cn-hangzhou.aliyuncs.com']
    }
  },
  watch: {
    activeChannelState(val, oldVal) {
      if (val !== oldVal) {
      // this.key++
        this.data = {}
        this.setResetVal('problemPid')
        this.setResetVal('problemIdThree')
        this.setResetVal('problemIdFour')
        this.setResetVal('problemIdFive')
        this.$refs.sugForm.set({
          type: 'defaultVal',
          data: {
            'problemId': [],
            'userName': undefined,
            'userMobile': undefined
          }
        })
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            'problemId': [],
            'problemIdThree': [],
            'problemIdFour': [],
            'problemIdFive': []
          }
        })
        this.getProblemChannel(val, 'problemPid')
        const artServiceLine = ['1031', '1041', '1051', '1071', '1081', '2011']
        const oneVoneorClassServiceLine = ['1011', '1012', '1021', '1022']
        let second_mapData_2 = []
        let second_mapData_4 = []
        let second_mapData_5 = []
        let three_mapData_51 = []
        if (artServiceLine.includes(val)) { // 这5个业务线 二级分类： 投诉销售 投诉教辅 投诉客服
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '52', '53'].includes(item.value))
          second_mapData_5 = work_order_second_map['5'].filter(item => ['101'].includes(item.value))
          three_mapData_51 = work_order_classification_map['51']
          if (val === '1031' || val === '2011') { // 小熊美术业务线显示小熊美术app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['11'].includes(item.value))
          } else if (val === '1051') { // 小熊音乐业务线显示小熊音乐app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['14'].includes(item.value))
          } else { // 其他业务线显示小熊boss和其他
            second_mapData_2 = work_order_second_map['2'].filter(item => ['12', '13'].includes(item.value))
          }
        } else if (oneVoneorClassServiceLine.includes(val)) { // 小班课 1v1 二级分类：投诉销售 投诉班主任 投诉客服 投诉教学老师
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '54', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        } else if (val === '1061') { // 书画院 二级分类：投诉销售 投诉学管 投诉客服 投诉教学老师
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '56', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        }
          this.second_map = {
            '2': second_mapData_2,
            '4': second_mapData_4,
            '5': second_mapData_5
            }
          this.three_map = {
            ...work_order_classification_map,
            '51': three_mapData_51
            }
        // 当工单类型是 技术问题 质检工单 售后工单 切换业务线显示相应的二级和三级
        if (['2', '4', '5'].includes(this.problemOneLevelType)) {
           this.$refs.sugForm.set({
             type: 'options',
             data: {
               problemTwoLevel: this.second_map[this.problemOneLevelType]
             }
           })
           const problemTwoLevel = this.second_map[this.problemOneLevelType][0]?.value
           this.$refs.sugForm.set({
             type: 'options',
             data: {
               problemThreeLevel: this.three_map[problemTwoLevel]
             }
           })
           this.$refs.sugForm.set({
            type: 'defaultVal',
            data: {
              problemTwoLevel: problemTwoLevel,
              problemThreeLevel: this.three_map[problemTwoLevel][0]?.value
            }
          })
          }
      }
    }
  },
  mounted() {
    if (this.$route.params.type === '3' && this.$route.query && this.$route.query.uid) {
      this.$refs.sugForm.set({
        type: 'defaultVal',
        data: {
          userId: this.$route.query.uid
        }
      })
      this.channelTypeList = [this.channelTypeList[0]]
      this.searchUser(this.$route.query.uid)
    }
    this.$nextTick(() => {
      // this.sugForm = userForm
      this.getProblemChannel('1011', 'problemPid')
      this.$refs.sugForm.set({
        type: 'defaultVal',
        data: {
         'videoUrl': [{}]
      }
     })
    })
  },
  beforeDestroy() {
    this.$refs.sugForm.set({
      type: 'defaultVal',
      data: {
        'problemId': [],
        'userName': undefined,
        'userMobile': undefined
      }
    })
    this.$refs.sugForm.set({
      type: 'options',
      data: {
        'problemId': []
      }
    })
    this.$forceUpdate()
  },
  methods: {
    searchUser(id) {
      const { activeChannelState } = this
      const params = {
        channelPid: activeChannelState
      }
      if (id) {
        params.userId = id
      }
      this.getUserRemarkFn(params)
    },
    getUserRemarkFn(params) {
      getUserRemark(params).then(res => {
        if (res.code === 0) {
          this.data = res.payload
          const { userMobile, userName } = res.payload
          this.$refs.sugForm.recoveryForm({ userMobile, userName })
        }
      })
    },
    // submitForm,
    submitForm: debounce(function(val) {
      this.loading = true
      const { type, activeChannelState, serviceType, workChannel } = this
      // 判断uid和手机号至少一项输入
      const { userId = '', userMobile = '' } = val
      if (!(userId.replace(/\s+/g, '')) && !(userMobile.replace(/\s+/g, ''))) {
        Message.warning('请输入uid和手机号至少一项')
        return
      }
      const arr = ['problemId', 'problemIdThree', 'problemIdFour', 'problemIdFive']
      arr.map(res => {
        if (Array.isArray(val[res])) {
          val[res] = val[res].toString()
        } else if (val[res]) {
          val[res]
        }
      })
      if (!val.problemIdThree) {
        val.problemIdFour = ''
        val.problemIdFive = ''
      } else if (!val.problemIdFour) {
        val.problemIdFive = ''
      }
      const data = {
        ...val,
        sync: val.sync === true ? '1' : '0', // 同步开关按钮
        channelPid: activeChannelState,
        businessId: activeChannelState.slice(0, 3),
        type: serviceType[type],
        workChannel,
        createUserId: getToken('userId'),
        createUserMobile: getToken('userMobile'),
        userName: val.userName || ''
      }
      if (val.videoUrl?.length) {
        data.videoUrl = val.videoUrl.reduce((str, item) => {
          if (item.url) {
            return str ? `${str},${item.url}` : item.url
          } else {
            return str
          }
        }, '')
      } else {
        data.videoUrl = ''
      }

      const tabType = ['1031', '1041', '1051', '1071', '1081', '2011']
      if (tabType.includes(activeChannelState)) { // 小熊用户 书法用户 舞蹈用户 小熊手工
        if (val.problemOneLevel === '1') {
          // 投诉工单 -创建投诉单
          this.createComplaintV2Fn(data)
        } else {
          // 技术工单 用户建议 质检工单 售后工单-创建工单
           this.createWorkOrderFn(data)
        }
      } else { // 1v1 小班课
          if (['4', '5'].includes(val.problemOneLevel)) {
            // 质检工单 售后工单 -创建工单
            this.createWorkOrderFn(data)
          } else {
           // 投诉工单 技术工单 用户建议 -创建投诉单
            this.createComplaintV2Fn(data)
          }
      }
    }, 500),
    // 创建投诉单
    createComplaintV2Fn(data) {
        data.creatUserName = getToken('cname')
      const arrImg = []
      var { imgUrl } = data
      if (imgUrl?.length > 0) {
        imgUrl.forEach(item => {
          arrImg.push(item.url)
        })
        data.imgUrl = arrImg.join(',')
      } else {
        data.imgUrl = undefined
      }
      createComplaintV2(data).then(res => {
        this.loading = false
        if (res.code === 0) {
          if (res.payload === 501) {
          Message.success('创建投诉成功，同步服务记录失败')
          } else {
          Message.success('操作成功')
          }
          this.$router.push({ name: 'workOrderCreateList' })
        }
      })
    },
    // 创建工单
    createWorkOrderFn(data) {
        data.createUserName = getToken('cname')
        data.workUrl = data.imgUrl?.length ? data.imgUrl?.map(v => v.url).join(',') : ''
        data.problemOneLevel = Number(data.problemOneLevel - 1) + ''
        // 用户建议是2 所以没有二级三级参数
        data.problemTwoLevel = data.problemOneLevel === '2' ? '0' : data.problemTwoLevel
        data.problemThreeLevel = data.problemOneLevel === '2' ? '0' : data.problemThreeLevel
        // 被投诉人
      createWorkOrder(data).then(res => {
        this.loading = false
        if (res.code === 0) {
          if (res.payload === 501) {
          Message.success('创建投诉成功，同步服务记录失败')
          } else {
          Message.success('操作成功')
          }
          this.$router.push({ name: 'workOrderCreateList' })
        }
      })
    },
    changeForm(val, oldVal) {
      const { problemPid, problemId, problemIdThree, problemIdFour } = val
      if (problemPid && problemPid !== oldVal.problemPid) {
        this.getProblemChild(problemPid, 'problemId')
      } else if (problemId?.toString() && problemId?.toString() !== oldVal?.problemId?.toString()) {
        this.$refs.sugForm.set({ type: 'options', data: { problemIdThree: [], problemIdFour: [], problemIdFive: [] }})
        this.$refs.sugForm.recoveryForm({ problemIdThree: '', problemIdFour: '', problemIdFive: '' })
        this.getProblemChild(problemId.toString(), 'problemIdThree')
      } else if (problemIdThree?.toString() && problemIdThree?.toString() !== oldVal.problemIdThree?.toString()) {
        this.$refs.sugForm.set({ type: 'options', data: { problemIdFour: [], problemIdFive: [] }})
        this.$refs.sugForm.recoveryForm({ problemIdFour: '', problemIdFive: '' })
        this.getProblemChild(problemIdThree.toString(), 'problemIdFour')
      } else if (problemIdFour?.toString() && problemIdFour?.toString() !== oldVal.problemIdFour?.toString()) {
        this.$refs.sugForm.set({ type: 'options', data: { problemIdFive: [] }})
        this.$refs.sugForm.recoveryForm({ problemIdFive: '' })
        this.getProblemChild(problemIdFour?.toString(), 'problemIdFive')
      }
      const { activeChannelState } = this
   // 小熊用户 书法用户 小熊音乐 舞蹈用户 工单类型变化动态筛选是否显示二级或三级选项
    const tabType = ['1031', '1041', '1051', '1071', '1081', '2011']
    const qualityTesting = ['4', '5']
      if (tabType.includes(activeChannelState)) {
        if (val.problemOneLevel === '1') { // 投诉工单
            this.setFilterDataOne(false)
            this.setFilterDataTwo(true)
            this.setFilterDataThree(false)
        } else if (val.problemOneLevel === '2') { // 技术问题
            this.setFilterDataOne(true)
            this.setFilterDataTwo(false)
            this.setFilterDataThree(false)
        } else if (val.problemOneLevel === '3') { // 用户建议
            this.setFilterDataOne(false)
            this.setFilterDataTwo(false)
            this.setFilterDataThree(false)
        }
      } else { // 1v1 小班课
           // 投诉工单 技术问题 用户建议
            this.setFilterDataTwo(true)
            this.setFilterDataOne(false)
            this.setFilterDataThree(false)
      }
      // 质检工单 售后工单显示的创建表单
      if (qualityTesting.includes(val.problemOneLevel)) {
            this.setFilterDataOne(true)
            this.setFilterDataTwo(false)
            this.setFilterDataThree(true)
      }
      // 工单类型联动二级三级效果
      // 2_技术工单二级分类
      // 4_质检工单二级分类
      // 5_售后工单二级分类
      if (val.problemOneLevel !== oldVal.problemOneLevel && oldVal.problemOneLevel) {
        this.problemOneLevelType = val.problemOneLevel
        const artServiceLine = ['1031', '1041', '1051', '1071', '1081', '2011']
        const oneVoneorClassServiceLine = ['1011', '1012', '1021', '1022']
        let second_mapData_2 = []
        let second_mapData_4 = []
        let second_mapData_5 = []
        let three_mapData_51 = []
        if (artServiceLine.includes(activeChannelState)) { // 这5个业务线 二级分类： 投诉销售 投诉教辅 投诉客服
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '52', '53'].includes(item.value))
          second_mapData_5 = work_order_second_map['5'].filter(item => ['101'].includes(item.value))
          three_mapData_51 = work_order_classification_map['51']
          if (activeChannelState === '1031' || activeChannelState === '2011') { // 小熊美术业务线显示小熊美术app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['11'].includes(item.value))
          } else if (activeChannelState === '1051') { // 小熊音乐业务线显示小熊音乐app
            second_mapData_2 = work_order_second_map['2'].filter(item => ['14'].includes(item.value))
          } else { // 其他业务线显示小熊boss和其他
            second_mapData_2 = work_order_second_map['2'].filter(item => ['12', '13'].includes(item.value))
          }
        } else if (oneVoneorClassServiceLine.includes(activeChannelState)) { // 小班课 1v1 二级分类：投诉销售 投诉班主任 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '54', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        } else if (activeChannelState === '1061') { // 书画院 二级分类：投诉销售 投诉学管 投诉客服 投诉教学老师
          second_mapData_2 = work_order_second_map['2']
          second_mapData_4 = work_order_second_map['4'].filter(item => ['51', '56', '53', '55'].includes(item.value))
          second_mapData_5 = work_order_second_map['5']
          three_mapData_51 = work_order_classification_map['51'].filter(item => !['5105'].includes(item.value))
        }
        this.second_map = {
          '2': second_mapData_2,
          '4': second_mapData_4,
          '5': second_mapData_5
        }
        this.three_map = {
          ...work_order_classification_map,
          '51': three_mapData_51
        }
       // 默认出现工单类型展示二级分类
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            problemTwoLevel: this.second_map[val.problemOneLevel]
          }
        })
        if (['2', '4', '5'].includes(val.problemOneLevel)) {
        this.$refs.sugForm.set({
          type: 'defaultVal',
          data: {
            problemTwoLevel: this.second_map[val.problemOneLevel][0].value
          }
        })
        // 质检工单默认文案
        if (val.problemOneLevel === '4') {
          this.$refs.sugForm?.set({
            type: 'defaultVal',
            data: {
              cpComent: '示例：销售 小红 在 2021.11.11 10:00 与用户沟通，擅自解散群'
            }
          })
        } else {
          this.$refs.sugForm?.set({
            type: 'defaultVal',
            data: {
              cpComent: `示例：\n 用户设备：红米手机；Redmi K20 Pro \n APP版本号/浏览器版本：V2.8.0\n 操作异常时间：2021.09.12 12:01\n 操作路径：首页-免费领课-分享海报至朋友圈得赠课,点击分享报错\n 报错信息: 网络异常 `
            }
          })
        }
        }
        // 默认出现二级分类展示三级分类
        let problemTwoLevel = ''
        if (['2', '4', '5'].includes(val.problemOneLevel)) {
           problemTwoLevel = this.second_map[val.problemOneLevel][0]?.value
        }
        if (problemTwoLevel) {
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            problemThreeLevel: this.three_map[problemTwoLevel]
          }
        })
        }
      }
      // 二级三级联动效果
      if (val.problemTwoLevel !== oldVal.problemTwoLevel && oldVal.problemTwoLevel) {
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            problemThreeLevel: this.three_map[val.problemTwoLevel]
          }
        })
        if (val.problemThreeLevel) {
          this.$refs.sugForm.set({
            type: 'defaultVal',
            data: {
              problemThreeLevel: this.three_map[val.problemTwoLevel][0]?.value
            }
          })
        }
      }
    },
    // 遍历有二级分类和三级分类的表单/应用业务=小熊用户/书法用户/小熊音乐/舞蹈用户
    setFilterDataOne(flag) {
      const filterDataOne = ['problemTwoLevel', 'problemThreeLevel']
         filterDataOne.forEach((item) => {
          this.$refs.sugForm?.set({
            type: 'visible',
            data: {
              [item]: flag
            }
          })
         })
    },
    // 遍历初始数据的表单/应用业务=除同上以外的业务类型
    setFilterDataTwo(flag) {
      const filterDataTwo = ['problemIdThree', 'problemIdFour', 'problemIdFive', 'problemPid', 'problemId']
         filterDataTwo.forEach((item) => {
          this.$refs.sugForm?.set({
            type: 'visible',
            data: {
              [item]: flag
            }
          })
         })
    },
    // 是否显示被投诉人字段
    setFilterDataThree(flag) {
      const filterDataThree = ['dingUserName']
         filterDataThree.forEach((item) => {
          this.$refs.sugForm?.set({
            type: 'visible',
            data: {
              [item]: flag
            }
          })
         })
    },
    // 获取子问题
    getProblemChild(val, key) {
      const params = {
        pids: val
      }
      getBypids(params).then(res => {
        const data = res.payload || []
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            [key]: this.tranFormChildData(data)
          }
        })
      })
    },
    cancel() {
      this.$router.back()
    },
    ensure() {
      this.$refs.sugForm.defaultAction('submit')
    },
    tranFormData(data, valueKey) {
      return data.map(item => {
        return {
          label: item.cpSource || item.cpType,
          value: valueKey ? item[valueKey] : item.id
        }
      })
    },
    tranFormChildData(data) {
      return data.map(item => {
        return {
          label: item.problemStatus ? '（内部）' + item.cpType : item.cpType,
          value: item.problemIdNew
        }
      })
    },
    // 获取问题分类列表
    getProblemChannel(val, key, type) {
      getProblemChannelId({ channelId: val }).then(res => {
        res.payload = res.payload?.filter(v => v?.problemStatus?.toString() !== '1')
        this.setChannel(res.payload, key, type, 'problemIdNew')
      })
    },
    // 清空下拉框的值
    setResetVal(key) {
      this.$refs.sugForm.set({
        type: 'defaultVal',
        data: {
          [key]: undefined
        }
      })
    },
    setChannel(val, key, type, valueKey) {
      this.$nextTick(() => {
        this.$refs.sugForm.set({
          type: 'options',
          data: {
            [key]: this.tranFormData(val, valueKey)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{
      list-style: none;
    }
  .form-item {
		display: flex;

		/deep/ .el-form-item__content {
			display: flex;
			align-items: center;
			vertical-align: middle;
			// width: 300px;
		}

		/deep/ .el-form-item__label {
			display: flex;
			width: 100px !important;
			margin-right: 10px;
			align-items: center;
			justify-content: flex-end;
			align-self: flex-start;
			line-height: 1.3;
			min-height: 36px;
			vertical-align: middle;
			flex-shrink: 0;
		}
    /deep/ .el-form-item__content{
      min-width: 380px;
    }
	}
  .complain-detail-list{

    li{
      font-size: 14px;
      padding: 6px;
      margin-bottom: 2px;
    }
    .complain-detail-list-tag{
      font-weight: 500;
      padding-right: 20px;
    }
    .complain-detail-list-remark-box{
      display: flex;
    }
    .complain-detail-list-remark{
      width: 310px;
      margin-left: 4px;
      span{
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  .searchUserInfo{
    margin-left: 54px;
  }
  </style>

