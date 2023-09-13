<!--
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-04 14:18:58
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-12 17:23:47
-->
<template>
  <div>
    <div class="app-container title-container">
      <basics-title
        title="员工列表"
        :actions="[{
          type: 'button', // 按钮
          label: '添加员工',
          click: addStaff,
          attr: {
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-plus',
            permission: ['admin']
          }
        }]"
      />
    </div>
    <div class="app-container">
      <basics-search ref="searchs" :loading="loadings._k8s_api_complaint_api_staff_getByPage" :searchs="searchs" @submitSearch="submitSearch" @changeSearch="changeSearch">
        <!-- <template slot="complaintPeople" slot-scope="scope" class="search-item">
          <el-input v-model="scope.form.inputName" placeholder="请输入" class="search-item-element" size="small">
            <el-select slot="prepend" v-model="scope.form.selectName" placeholder="请选择" class="el-input-select">
              <el-option label="手机号" value="1" />
              <el-option label="员工" value="2" />
            </el-select>
          </el-input>
        </template> -->
      </basics-search>
      <!-- <basics-action :actions="act" /> -->
      <basics-table
        ref="table"
        :table="table"
        :loading="loadings._k8s_api_complaint_api_staff_getByPage || openOffLoading"
        :list="list"
        :get-list="getList"
        :columns="columns"
        :total="total"
        :list-query="listQuery"
        :action-function="actionFunction"
      />

      <!-- 弹窗 -->
      <el-dialog width="450px" :title="info.title" :visible.sync="dialogVisible" :class="{'add-form-dialog':type === 'add' || type === 'edit'}">
        <!-- <h2 style="margin-bottom: 20px; margin-top: 0; font-size: 14px;font-weight: 400;">{{ info.instroduct }}</h2> -->
        <template slot>
          <div class="custom-dialog">
            <basics-form ref="staffForm" :key="dialogVisible" :loading="loadingStaff" :forms="staffForm" :actions="formAction" @submitForm="submitForm" @changeForm="changeForm">
              <template slot="serviceProblem" slot-scope="scope">
                <el-form-item :label="scope.item.label" class="slot-item" style="padding-left: 8px;" :rules="[{ required: true, message: '请选择问题分类', trigger: 'change'}]">
                  <el-select v-model="scope.form.problemIdOne" placeholder="请选择问题分类" multiple collapse-tags style="width: 300px; margin-left: 10px;margin-bottom: 10px;" @change="changeProblemIdOne">
                    <el-option
                      v-for="item in problemIdList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="scope.form.problemIdTwo" placeholder="请选择投诉问题" multiple collapse-tags class="select-one">
                    <el-option
                      v-for="item in problemIdTwoList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="scope.form.problemIdThree" placeholder="请选择三级问题" multiple collapse-tags class="select-one">
                    <el-option
                      v-for="item in problemIdThreeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="scope.form.problemIdFour" placeholder="请选择四级问题" multiple collapse-tags class="select-one">
                    <el-option
                      v-for="item in problemIdFourList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="scope.form.problemIdFive" placeholder="请选择五级问题" multiple collapse-tags class="select-one">
                    <el-option
                      v-for="item in problemIdFiveList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </basics-form>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import BasicsSearch from '@/components/BasicsSearch'
import BasicsForm from '@/components/BasicsForm'
import { getBypids } from '@/api/operate/question'
import columns, { actions } from './columns/list'
import { userForm, resetPassword, actions as formAction } from './forms/staffForm'
import { default as act } from './actions/actions'
import searchs from './searchs/searchs'
import { getStaffList, staffAdd, staffUpdate, staffResetPwd, staffDelOrDisable } from '@/api/operate/staff-list'
import { getUserInfoById } from '@/api/settings/assign-complaint'
import { mapGetters } from 'vuex'
import { SERVICE_OBJECT } from './config'
import { debounce } from 'lodash'
import { getToken } from '@/utils/auth'

export default {
  name: 'StaffList',
  components: { BasicsTable, BasicsSearch, BasicsForm },
  data() {
    return {
      table: {
        stripe: false,
        border: false
      },
      columns,
      searchs,
      total: 0,
      list: null,
      query: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      actionFunction: actions({
        tableAction: this.tableAction
      }),
      act: act({ addStaff: this.addStaff }),
      dialogVisible: false,
      info: {
        title: ''
      },
      staffForm: [],
      formAction: formAction({ cancel: this.cancel, ensure: this.ensure }),
      bussinessLineOption: [
        {
          label: '全部',
          value: '1',
          children: []
        }
      ],
      type: '',
      id: '',
      problemIdOne: '',
      problemIdList: [], // 投诉问题字典
      problemIdTwoList: [], // 二级问题字典
      problemIdThreeList: [], // 三级问题字典
      problemIdFourList: [], // 四级问题字典
      problemIdFiveList: [], // 五级问题字典
      openOffLoading: false,
      allFlag: false
    }
  },
  computed: {
    ...mapGetters(['loadings', 'staffEnum']),
    loadingStaff() {
      return this.loadings._k8s_api_complaint_api_staff_add || this.loadings._k8s_api_complaint_api_staff_update || this.loadings._k8s_api_complaint_api_staff_resetPwd
    }
  },
  watch: {
    staffEnum: {
      handler: function(val, oldVal) {
        // 过滤出机器人回访和发短信的角色
        const filterData = ['9', '10']
        this.$refs.searchs.set({
          type: 'options',
          data: {
            businessId: val.businessLine,
            role: val.roles?.filter(val => !filterData.includes(val.value))
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.$store.dispatch('staffEnum/getEnumConfig')
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.searchs.set({
        type: 'options',
        data: {
          businessId: this.staffEnum.businessLine
        }
      })
    })
  },
  methods: {
    // 给服务问题拼接上业务线名称
    transformLabel(data) {
      let allTypeData = [] // 保存所有的业务线数据
      const reg = /\d{4}/
      for (const key in SERVICE_OBJECT) {
        allTypeData.push(SERVICE_OBJECT[key])
      }
      allTypeData = allTypeData.flat() // 变成一维数组

      for (var i = 0; i < data.length; i++) {
        // let type = reg.exec(data[i].id)[0]  // 取出参数中的前四位
        const type = data[i].channelId ? data[i].channelId : reg.exec(data[i].id)[0]
        for (var j = 0; j < allTypeData.length; j++) {
          if (allTypeData[j].value === type) {
            data[i].label = allTypeData[j].label // 给后端返回的数据加上标签
          }
        }
      }
    },
    tranFormChildData(data) {
      this.transformLabel(data)
      return data.map(item => {
        return {
          label: item.problemStatus ? '（内部）' + item.label + ' -' + item.cpType : item.label + ' -' + item.cpType,
          value: item.problemIdNew,
          channelId: item.channelId,
          pid: item.pid
        }
      })
    },
    // 获取问题分类列表
     getProblemChannel(val, key, defaultValue) {
      const params = {
        pids: val
      }
     return getBypids(params).then(async res => {
        const data = res.payload || []
        // 赋值问题树
        this[key] = data?.length > 0 ? [...this.tranFormChildData(data)] : data
        if (key === 'problemIdList' && defaultValue?.problemIdOne.length) {
         const newDefaultValProblemIdOne = await this.problemIdList.filter(i => defaultValue.problemIdOne.includes(i.value)).map(i => i.value)
         this.$nextTick(() => {
            this.$refs.staffForm.set({
             type: 'defaultVal',
             data: {
               problemIdOne: newDefaultValProblemIdOne
             }
           })
        })
        }
        if (key === 'problemIdTwoList' && defaultValue?.problemIdTwo.length) {
         const newDefaultValProblemIdTwo = await this.problemIdTwoList.filter(i => defaultValue.problemIdTwo.includes(i.value)).map(i => i.value)
         this.$nextTick(() => {
            this.$refs.staffForm.set({
             type: 'defaultVal',
             data: {
               problemIdTwo: newDefaultValProblemIdTwo
             }
           })
        })
        }
        if (key === 'problemIdThreeList' && defaultValue?.problemIdThree.length) {
         const newDefaultValproblemIdThree = await this.problemIdThreeList.filter(i => defaultValue.problemIdThree.includes(i.value)).map(i => i.value)
         this.$nextTick(() => {
            this.$refs.staffForm.set({
             type: 'defaultVal',
             data: {
               problemIdThree: newDefaultValproblemIdThree
             }
           })
        })
        }
        if (key === 'problemIdFourList' && defaultValue?.problemIdFour.length) {
         const newDefaultValProblemIdFour = await this.problemIdFourList.filter(i => defaultValue.problemIdFour.includes(i.value)).map(i => i.value)
         this.$nextTick(() => {
            this.$refs.staffForm.set({
             type: 'defaultVal',
             data: {
               problemIdFour: newDefaultValProblemIdFour
             }
           })
        })
        }
        if (key === 'problemIdFiveList' && defaultValue?.problemIdFive.length) {
         const newDefaultValProblemIdFive = await this.problemIdFiveList.filter(i => defaultValue.problemIdFive.includes(i.value)).map(i => i.value)
         this.$nextTick(() => {
            this.$refs.staffForm.set({
             type: 'defaultVal',
             data: {
               problemIdFive: newDefaultValProblemIdFive
             }
           })
        })
        }
      })
    },
    submitSearch(val, state = false) {
      if (!state) {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.query = val
      }
      this.getList()
    },
    changeSearch(val, oldVal) {
      this.query = val
      if (val.selectName && val.selectName !== oldVal.selectName) this.setResetVal('inputName')
    },
    getList() {
      const { query, listQuery } = this
      getStaffList({
        pageNum: (listQuery.page) * 1 - 1,
        pageSize: listQuery.limit,
        ...query
      }).then(res => {
        const data = res.payload || {}
        this.list = data.data || []
        this.total = (data.total) * 1 || 0
      })
    },
    tableAction(dat, row, index, type) {
      this.bussinessLineOption[0].children = this.staffEnum.businessLine
      this.type = type
      switch (type) {
        case 'open': // 停用/启用
          this.openOff(row)
          break
        case 'edit': // 编辑名片
          this.editStaff(row)
          break
        case 'reset': // 重置密码
          this.resetPassword(row)
          break
        case 'delete': // 删除
          this.deleteStaff(row)
          break
      }
    },
    // 启用停用
    openOff(row) {
      const config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        label: '提示',
        text: row.status === 0 ? '确定设为停用吗？' : '确定设为启用吗？'
      }
      // 二次弹窗
      this.$confirm(config.text, config.label, {
        confirmButtonText: config.confirmButtonText,
        cancelButtonText: config.cancelButtonText,
        type: config.type,
        beforeClose: debounce(async(action, instance, done) => {
          if (action === 'confirm') {
            done()
            this.openOffLoading = true
            const { id } = row
            const type = 1
            const status = row.status === 0 ? 1 : 0
            const userId = getToken('userId')
            const res = await getUserInfoById({ userId })
            const uid = res.payload.id
            staffDelOrDisable({ id, type, status }).then(async(res) => {
              if (res.code === 0) {
                this.openOffLoading = false
              }
              if (id === uid) {
                this.$message.success('操作成功，请重新登录')
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              } else {
                this.$message.success('操作成功')
                this.cancel()
                this.getList()
              }
            })
          } else {
            done()
          }
        }, 500)
      }).catch(() => {})
    },
    configMenu() {
      this.$nextTick(() => {
        const { bussinessLineOption } = this
        // 过滤出机器人回访和发短信的角色
        const filterData = ['9', '10']
        this.$refs.staffForm.set({
          type: 'options',
          data: {
            manageBusiness: bussinessLineOption,
            role: this.staffEnum.roles?.filter(val => !filterData.includes(val.value))
          }
        })
      })
    },
    addStaff() {
      this.type = 'add'
      this.bussinessLineOption[0].children = this.staffEnum.businessLine
      this.info.title = '新增员工'
      this.staffForm = userForm
      this.dialogVisible = true
      this.configMenu()
    },
   async editStaff(rowVal) {
      // this.bussinessLineOption[0].children = this.staffEnum.businessLine
      const row = { ...rowVal }
      this.info.title = '编辑员工'
      var form = JSON.parse(JSON.stringify(userForm))
      this.staffForm = form
      // form[0].attr.disabled = true
      form[1].attr.disabled = true
      const { manageBusiness } = row
      row.role = row.role + ''
      const arr = []
      manageBusiness.split(',').map(item => {
        arr.push(['1', item])
      })
      row.manageBusiness = arr
      this.id = row.id
      if (row.serviceObject) {
        row.serviceObject = row.serviceObject.split(',')
      } else {
        delete row.serviceObject
      }
      // 加载对应的服务问题
      const { problemIdFour, problemIdFive, problemIdThree, problemIdTwo, problemIdOne } = rowVal
      if (manageBusiness) {
       await this.getProblemChannel(manageBusiness, 'problemIdList')
      }
      if (problemIdOne) {
       await this.getProblemChannel(problemIdOne, 'problemIdTwoList')
      }
      if (problemIdTwo) {
       await this.getProblemChannel(problemIdTwo, 'problemIdThreeList')
      }
      if (problemIdThree) {
       await this.getProblemChannel(problemIdThree, 'problemIdFourList')
      }
      if (problemIdFour) {
       await this.getProblemChannel(problemIdFour, 'problemIdFiveList')
      }
      row.problemIdOne = problemIdOne ? problemIdOne.split(',') : []
      row.problemIdTwo = problemIdTwo ? problemIdTwo.split(',') : []
      row.problemIdThree = problemIdThree ? problemIdThree.split(',') : []
      row.problemIdFour = problemIdFour ? problemIdFour.split(',') : []
      row.problemIdFive = problemIdFive ? problemIdFive.split(',') : []
      // console.log(row.problemIdTwo, rowVal.problemIdTwo, 'rowVal')
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.staffForm.recoveryForm(row, false)
        this.configMenu()
      })
    },
    resetPassword(row) {
      this.info.title = '重置密码'
      this.staffForm = resetPassword
      this.dialogVisible = true
      this.id = row.id
      this.$nextTick(() => {
        this.$refs.staffForm.recoveryForm(row, false)
      })
    },
    deleteStaff(row) {
      // 二次弹窗
      const config = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        label: '提示',
        text: '确定删除该员工吗？'
      }
      // 二次弹窗
      this.$confirm(config.text, config.label, {
        confirmButtonText: config.confirmButtonText,
        cancelButtonText: config.cancelButtonText,
        type: config.type,
        beforeClose: debounce((action, instance, done) => {
          if (action === 'confirm') {
            done()
            this.openOffLoading = true
            const { id } = row
            const type = 0
            const status = 1
            staffDelOrDisable({ id, type, status }).then(async(res) => {
              // done()
              // this.$message.success('操作成功，请重新登录')
              // await this.$store.dispatch('user/logout')
              // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              // return
              if (res.code === 0) {
                this.openOffLoading = false
                 this.$message.success('操作成功')
                 this.cancel()
                 this.getList()
              }
            })
          } else {
            done()
          }
        }, 500)
      }).catch(() => {})
    },
    submitForm(val) {
      const { manageBusiness, serviceObject } = val
      const arr = []
      manageBusiness?.map(i => {
        const value1 = []
        const value2 = []
        if (i[1] === '101') {
          value1.push(i[1] + '2')
        }
        if (i[1] === '102') {
          value2.push(i[1] + '2')
        }
        arr.push(...value1, ...value2, i[1] + '1')
      })
      if (arr?.length) {
       const newserviceObject = this.getSame(serviceObject, arr)
       val.serviceObject = newserviceObject
      }
      const { type } = this
      switch (type) {
        case 'add':
          this.addStaffFn(val)
          break
        case 'edit':
          this.editStaffFn(val)
          break
        case 'reset':
          this.resetPasswordFn(val)
          break
      }
    },
    getSame(arr1, arr2) {
     const newArr = Array.from(new Set([...arr1].filter(x => arr2.includes(x))))
    return newArr
    },
    // 添加员工接口
    addStaffFn: debounce(function(val) {
      const { manageBusiness } = val
      const arr = manageBusiness.flat(Infinity)
      const arrFt = arr?.filter(item => item !== '1')
      val.manageBusiness = JSON.stringify(arrFt)
      if (val.serviceObject.length) {
        val.serviceObject = val.serviceObject.join(',')
      } else {
        delete val.serviceObject
      }
      const { problemIdOne, problemIdTwo, problemIdThree, problemIdFour, problemIdFive } = val
      val.problemIdOne = problemIdOne && problemIdOne.length ? problemIdOne.filter(i => i !== '0').toString() : ''
      val.problemIdTwo = problemIdTwo && problemIdTwo.length ? problemIdTwo.filter(i => i !== '0').toString() : ''
      val.problemIdThree = problemIdThree && problemIdThree.length ? problemIdThree.filter(i => i !== '0').toString() : ''
      val.problemIdFour = problemIdFour && problemIdFour.length ? problemIdFour.filter(i => i !== '0').toString() : ''
      val.problemIdFive = problemIdFive && problemIdFive.length ? problemIdFive.filter(i => i !== '0').toString() : ''
      staffAdd(val).then(res => {
        this.$message.success('操作成功')
        this.cancel()
        this.getList()
      })
    }, 500),
    editStaffFn: debounce(function(val) {
      const { id } = this
      const { manageBusiness } = val
      const arr = manageBusiness.flat(Infinity)
      const arrFt = arr?.filter(item => item !== '1')
      if (val.serviceObject.length) {
        val.serviceObject = val.serviceObject.join(',')
      } else {
        val.serviceObject = ''
      }
      val.manageBusiness = JSON.stringify(arrFt)
      const { problemIdOne, problemIdTwo, problemIdThree, problemIdFour, problemIdFive } = val
      val.problemIdOne = problemIdOne && problemIdOne.length ? problemIdOne.filter(i => i !== '0').toString() : ''
      val.problemIdTwo = problemIdTwo && problemIdTwo.length ? problemIdTwo.filter(i => i !== '0').toString() : ''
      val.problemIdThree = problemIdThree && problemIdThree.length ? problemIdThree.filter(i => i !== '0').toString() : ''
      val.problemIdFour = problemIdFour && problemIdFour.length ? problemIdFour.filter(i => i !== '0').toString() : ''
      val.problemIdFive = problemIdFive && problemIdFive.length ? problemIdFive.filter(i => i !== '0').toString() : ''
      staffUpdate({ ...val, id }).then(res => {
        this.$message.success('操作成功')
        this.cancel()
        this.getList()
      })
    }, 500),
    resetPasswordFn(val) {
      const { id } = this
      const { password } = val
      staffResetPwd({ id, password }).then(async(res) => {
        this.$message.success('修改密码成功，请使用新密码登录')
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    },
    // 获取子问题
    getProblemChild(val, key) {
      const params = {
        pids: val
      }
      getBypids(params).then(res => {
        const data = res.payload || []
        this[key] = this.tranFormChildData(data)
      })
    },
    // 表单的change事件
    async changeForm(val, oldVal) {
      const { manageBusiness, serviceObject, problemIdOne, problemIdTwo, problemIdThree, problemIdFour } = val
      if (manageBusiness?.length !== oldVal.manageBusiness?.length) {
      const arr = [] // 根据业务线拼接后缀成完整的业务线枚举
      manageBusiness?.map(i => {
        const value1 = []
        const value2 = []
        if (i[1] === '101') {
          value1.push(i[1] + '2')
        }
        if (i[1] === '102') {
          value2.push(i[1] + '2')
        }
        arr.push(...value1, ...value2, i[1] + '1')
      })
      if (arr?.length) {
       const newserviceObject = this.getSame(serviceObject, arr)
       val.serviceObject = newserviceObject
      }
      // 业务线改变联动服务问题消失对应的问题
      const filtersServiceObject = val.serviceObject.filter(i => i !== '0').toString()
      await this.getProblemChannel(filtersServiceObject, 'problemIdList', val)

      const optionsTemp = [] // 业务线取消相应的服务对象消失掉
      manageBusiness.map(v => v[1]).forEach(v => {
        if (SERVICE_OBJECT[v]) {
          optionsTemp.push(...SERVICE_OBJECT[v])
         }
      })
      this.$refs.staffForm.set({
        type: 'options',
        data: {
          serviceObject: optionsTemp
        }
      })
      }
      if (serviceObject && serviceObject?.length && serviceObject.toString() !== oldVal.serviceObject.toString()) {
        const filtersServiceObject = serviceObject.filter(i => i !== '0').toString()
        await this.getProblemChannel(filtersServiceObject, 'problemIdList', val)
      } else if (!serviceObject?.length && JSON.stringify(serviceObject) !== JSON.stringify(oldVal.serviceObject)) {
         this.$refs.staffForm.set({
          type: 'defaultVal',
          data: {
            problemIdOne: [],
            problemIdTwo: [],
            problemIdThree: [],
            problemIdFour: [],
            problemIdFive: []
          }
        })
      this.problemIdList = [] // 投诉问题字典
      this.problemIdTwoList = [] // 二级问题字典
      this.problemIdThreeList = [] // 三级问题字典
      this.problemIdFourList = [] // 四级问题字典
      this.problemIdFiveList = [] // 五级问题字典
      }
      if (problemIdOne.toString() !== oldVal.problemIdOne.toString()) {
        const filtersProblemIdOne = problemIdOne.filter(i => i !== '0').toString()
        await this.getProblemChannel(filtersProblemIdOne, 'problemIdTwoList', val)
      }
      if (problemIdTwo.toString() !== oldVal.problemIdTwo.toString()) {
        const filtersProblemIdTwo = problemIdTwo.filter(i => i !== '0').toString()
        await this.getProblemChannel(filtersProblemIdTwo, 'problemIdThreeList', val)
      }
      if (problemIdThree.toString() !== oldVal.problemIdThree.toString()) {
        const filtersProblemIdThree = problemIdThree.filter(i => i !== '0').toString()
        await this.getProblemChannel(filtersProblemIdThree, 'problemIdFourList', val)
      }
      if (problemIdFour.toString() !== oldVal.problemIdFour.toString()) {
        const filtersProblemIdFour = problemIdFour.filter(i => i !== '0').toString()
        await this.getProblemChannel(filtersProblemIdFour, 'problemIdFiveList', val)
      }
    },
    cancel() {
      this.info.title = ''
      this.staffForm = []
      this.type = ''
      this.id = ''
      this.dialogVisible = false
    },
    ensure() {
      this.$refs.staffForm.defaultAction('submit')
    },
    // 清空下拉框的值
    setResetVal(key) {
      this.$refs.searchs.set({
        type: 'defaultVal',
        data: {
          [key]: undefined
        }
      })
    },
    // 触发局部服务问题表单
    changeProblemIdOne() {
      const refsStaffForm = this.$refs.staffForm
      refsStaffForm.$refs.basicsForm.validateField('problemIdOne')
    }
  }
}
</script>

<style lang="scss" scoped>
// .custom-dialog {
//     max-height: 500px;
//     overflow: scroll;
// }
.select-one {
  width: 300px;
  margin-left: 87px;
  margin-bottom: 10px;
}
/deep/ .el-input-select {
  // background-color: #fff;
  width: 90px;
}
/deep/ .search-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    // justify-content: center;
    height: 36px;
    .search-item-label {
      display: block;
      width: 69px;
      /*text-align-last: justify;*/
      text-align: right;
      margin-right: 10px;
      font-size: 14px;
      color: #606266;
    }
    .search-item-element {
      flex: 1;
      width: 50%;
      margin-right: 10px;
    }
  }
/deep/ .el-form-item__error{
    width: 100px;
  }
/deep/ .add-form-dialog .el-form .el-row .el-col:last-child{
    margin-left: 95px;
    position: relative;
    top: -33px;
}
/deep/.select-item{
  width: 300px;
}
</style>
