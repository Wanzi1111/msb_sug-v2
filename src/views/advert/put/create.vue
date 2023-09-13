<template>
  <div class="app-container">
    <basics-block title="新建投放">
      <basics-form :key="key" ref="form" :loading="loadings._operation_resource_publish" :forms="forms" :actions="actions" @changeForm="changeForm" @submitForm="submitForm">
        <template slot="media" slot-scope="scope">
          <el-form-item v-bind="scope.item" class="form-item">
            <div class="form-item-element">
              <template v-if="scope.form.media && Object.keys(scope.form.media).length">
                <div class="media-item">
                  <el-image v-if="'mediaRules' in scope.item && scope.item.mediaRules.media === 'img'" :preview-src-list="[scope.form.media.url]" :src="scope.form.media.url" alt="" />
                  <video v-else controls="controls" :poster="scope.form.media.coverUrl" :src="scope.form.media.url" />
                  <div class="media-upload-update" @click="triggerMedia"><i class="el-icon-upload" />&ensp;更换</div>
                </div>
                <div>
                  <div class="materiel-info-item__content">
                    <p>物料尺寸: {{ scope.form.media.resourceSize }}</p>
                    <p>物料类型: {{ scope.form.media.type === 1 ? '视频' : '图片' }}</p>
                    <p>外链地址: {{ scope.form.media.otherUrl }}</p>
                  </div>
                </div>
              </template>
              <div v-else class="media-upload" @click="triggerMedia">
                <i class="el-icon-upload" />&ensp;选择
              </div>
              <div class="note info">
                <router-link to="/advert/materiel/create" style="text-decoration: underline; color: rgb(64, 158, 255);">
                  <i class="el-icon-plus" /> 新建物料
                </router-link>
              </div>
            </div>
          </el-form-item>
        </template>
      </basics-form>
      <!--选择物料-->
      <el-dialog
        title="选择物料"
        :visible.sync="dialogVisible"
        width="760px"
        :before-close="closeDl"
      >
        <div>
          <ul v-if="materielData.length" class="materiel-list">
            <li v-for="(item, i) in materielData" :key="i" :class="item.check ? 'img-check' : ''" @click="selectMateriel(i)">
              <img v-if="item.type === 0" :src="item.url" alt="">
              <video v-else :poster="item.coverUrl" :src="item.url" />
              <div v-if="item.check" class="materiel-check">
                <i class="el-icon-check" />
              </div>

              <div>
                <div class="materiel-info-item__content">
                  <p>物料尺寸: {{ item.resourceSize }}</p>
                  <p>物料类型: {{ item.type === 1 ? '视频' : '图片' }}</p>
                  <p>外链地址:</p>
                  <p>{{ item.otherUrl }}</p>
                </div>
              </div>
            </li>
          </ul>
          <div v-else style="margin-bottom: 30px;text-align: center">
            还没有符合该广告位的物料~
          </div>

          <div class="materiel-action">
            <div><el-button type="primary" icon="el-icon-check" @click="dmMateriel">确定</el-button></div>
            <div><el-button icon="el-icon-back" @click="closeDl">返回</el-button></div>
          </div>

        </div>
      </el-dialog>
      <!--投放成功-->
      <el-dialog
        :visible.sync="putSuccessVisible"
        width="500px"
        :before-close="closePutDl"
      >
        <div class="app-container">

          <div class="put-success">
            <i class="el-icon-circle-check" />&ensp;投放成功
          </div>
          <div v-if="morePutList.length" class="put-select">
            <p class="put-select-txt">还有以下可投放的同尺寸广告位:</p>
            <el-checkbox-group v-model="moreCheckPut" class="put-select-group">
              <el-checkbox v-for="(item, i) in morePutList" :key="i" :label="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="morePutList.length" class="put-action">
            <div><el-button :loading="loadings._operation_resource_publish" :type="moreCheckPut.length ? 'primary' : ''" icon="el-icon-upload" @click="fristPutMt">一键投放</el-button></div>
          </div>
        </div>
      </el-dialog>
    </basics-block>
  </div>
</template>

<script>
import { publish, materielList } from '@/api/advert/materiel'
import { listAdvert } from '@/api/advert/ad-position'
import { listAdvertPublish } from '@/api/advert/put'
import BasicsForm from '@/components/BasicsForm'
import BasicsBlock from '@/components/BasicsBlock'
import forms, { actions } from './forms/create'
import moment from 'moment'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'CreatePut',
  components: { BasicsForm, BasicsBlock },
  data() {
    return {
      key: 1,
      forms: forms,
      actions: actions,
      dialogVisible: false,
      putSuccessVisible: false,
      materielData: [],
      morePutList: [],
      moreCheckPut: [],
      adList: [],
      form: {},
      putMoreData: {},
      saveSize: '',
      checkMediaId: '',
      advertIdsOptions: []
    }
  },
  computed: {
    ...mapGetters(['loadings'])
  },
  created() {
    // this.getAdList()
  },
  mounted() {
    this.$refs.form.set({
      type: 'attr',
      data: { startTime: {
        type: 'datetime',
        defaultTime: '00:00:00',
        placeholder: '请选择投放开始时间',
        pickerOptions: {
          disabledDate: (e) => {
            return e.getTime() < moment().valueOf() - 86400000
          }
        }
      }, endTime: {
        type: 'datetime',
        defaultTime: '23:59:59',
        placeholder: '请选择投放结束时间',
        pickerOptions: {
          disabledDate: (e) => {
            return e.getTime() < moment().valueOf() - 86400000
          }
        }
      }}
    })
    // const { businessType } = this.$store.getters.adConfig
    // this.$refs.form.set({
    //   type: 'defaultVal',
    //   data: {
    //     businessType: businessType[0].label || ''
    //   }
    // })
  },
  methods: {
    getAd() {
      const { form } = this
      const data = {
        advertId: form.advertIds,
        type: 1,
        userType: form.userType.join(','),
        bussinessName: form.businessType
      }
      listAdvertPublish(data).then(res => {
        const data = res.data || []
        const ad = data[0] || {}
        this.$refs.form.set({
          type: 'defaultVal',
          data: { use: `${ad.usedCount > ad.totalCount ? ad.totalCount : ad.usedCount}/${ad.totalCount}` }
        })
      })
    },
    // 获取广告位
    getAdList(businessType) {
      listAdvert({ pageSize: 100, pageNum: 1, businessType }).then(res => {
        const data = res.data || {}
        const list = data.list || []
        const adList = []
        const options = []
        list.map(item => {
          if (item.enabled === 0) {
            options.push({
              label: item.advertName,
              value: item.id
            })
            adList[item.id] = {
              advertName: item.advertName,
              enabled: item.enabled,
              size: item.advertSize
            }
          }
        })
        this.adList = adList
        this.$refs.form.set({
          type: 'options',
          data: { advertIds: options }
        })
      })
    },
    // 用户定向联动
    changeUserTypeOption(businessType) {
      const { userType } = this.$store.getters.adConfig
      const userTypeOption = Object.keys(userType[businessType]).map(v => {
        return {
          value: ~~v ? v : userType[businessType][v],
          label: ~~v ? userType[businessType][v] : v
        }
      })
      this.$refs.form.set({
        type: 'options',
        data: {
          userType: userTypeOption
        }
      })
    },
    // 选择广告位，变化已投放
    changeForm(val, oldVal) {
      console.log(val, oldVal)
      this.form = val
      if (val.businessType !== oldVal.businessType && oldVal.businessType) {
        this.$refs.form.resetFields()
        this.changeUserTypeOption(val.businessType)
        this.$refs.form.set({
          type: 'defaultVal',
          data: {
            businessType: val.businessType || ''
          }
        })
        this.getAdList(val.businessType)
        return
      }
      if (val.businessType !== oldVal.businessType && !oldVal.businessType) {
        this.changeUserTypeOption(val.businessType)
        this.getAdList(val.businessType)
      }
      if (val.advertIds && val.advertIds !== oldVal.advertIds) {
        this.$refs.form.set({
          type: 'defaultVal',
          data: { media: '' },
          validateField: false
        })
        if (val.userType.join(',')) {
          this.getAd()
        }
      }
      if (val.advertIds && val.userType.join(',') && val.userType.join(',') !== oldVal.userType.join(',')) {
        this.getAd()
      }
      if (val.startTime && val.startTime !== oldVal.startTime) {
        const attr = {
          type: 'datetime',
          defaultTime: '23:59:59',
          placeholder: '请选择投放结束时间',
          pickerOptions: {
            disabledDate: (e) => {
              return e.getTime() < moment(`${moment(val.startTime).format('YYYY-MM-DD')} 00:00:00`).valueOf()
            }
          }
        }
        this.$refs.form.set({
          type: 'attr',
          data: { endTime: attr }
        })
      }
      if (val.endTime && val.endTime !== oldVal.endTime) {
        const attr = {
          type: 'datetime',
          defaultTime: '00:00:00',
          placeholder: '请选择投放开始时间',
          pickerOptions: {
            disabledDate: (e) => {
              return e.getTime() > moment(val.endTime).valueOf() || e.getTime() < moment().valueOf() - 86400000
            }
          }
        }
        this.$refs.form.set({
          type: 'attr',
          data: { startTime: attr }
        })
      }
      if (!val.startTime && val.startTime !== oldVal.startTime) {
        const attr = {
          type: 'datetime',
          defaultTime: '23:59:59',
          placeholder: '请选择投放结束时间',
          pickerOptions: {
            disabledDate: (e) => {
              return e.getTime() < moment().valueOf() - 86400000
            }
          }
        }
        this.$refs.form.set({
          type: 'attr',
          data: { endTime: attr }
        })
      }
      if (!val.endTime && val.endTime !== oldVal.endTime) {
        const attr = {
          type: 'datetime',
          defaultTime: '00:00:00',
          placeholder: '请选择投放开始时间',
          pickerOptions: {
            disabledDate: (e) => {
              return e.getTime() < moment().valueOf() - 86400000
            }
          }
        }
        this.$refs.form.set({
          type: 'attr',
          data: { startTime: attr }
        })
      }
    },
    // 点击物料选择框
    triggerMedia() {
      const { form } = this
      if (!form.advertIds) {
        this.$message('请先选择一个广告位')
        return false
      }
      this.dialogVisible = true
      const { adList = [], saveSize, materielData } = this
      // 如果广告位未发生变化，物料列表有上次获取的结果，那么不再重复获取物料
      if (saveSize !== adList[form.advertIds].size || !materielData.length) {
        this.getMateriel()
      }
    },
    // 获取对应尺寸物料 - 列表
    getMateriel() {
      const { form, adList } = this
      materielList({ resourceSize: adList[form.advertIds].size }, {
        pageNum: 1,
        pageSize: 12
      }).then(res => {
        const data = res.data || {}
        const list = data.list || []
        const materielData = []
        list.map(item => {
          materielData.push({
            id: item.id,
            type: item.type,
            url: item.resourceUrl,
            resourceSize: item.resourceSize,
            coverUrl: item.coverUrl,
            otherUrl: item.otherUrl
          })
        })
        this.materielData = materielData
      }).catch(error => {
        console.log(error)
      })
    },
    // 点选物料
    selectMateriel(index) {
      const { materielData } = this
      // 多选
      // for (let i = 0; i < materielData.length; i++) {
      //   if (i === index) {
      //     materielData[i].check = !materielData[i].check
      //     break;
      //   }
      // }
      // 单选
      for (let i = 0; i < materielData.length; i++) {
        materielData[i].check = false
      }
      materielData[index].check = true
      this.materielData = [...materielData]
    },
    // 选择投放物料 - 确定
    dmMateriel() {
      const { materielData } = this
      let checkMediaId = ''
      for (let i = 0; i < materielData.length; i++) {
        if (materielData[i].check) {
          checkMediaId = materielData[i].id
          this.$refs.form.set({
            type: 'defaultVal',
            data: { media: materielData[i] }
          })
          this.$refs.form.set({
            type: 'mediaRules',
            data: { media: { media: materielData[i].type ? 'video' : 'img' }}
          })
          break
        }
      }
      this.checkMediaId = checkMediaId
      this.dialogVisible = false
    },
    // 选择物料的弹窗 - 关闭
    closeDl() {
      this.dialogVisible = false
    },
    // 投放
    put(data, advertIds) {
      return new Promise((resolve, reject) => {
        publish(data, { advertIds: advertIds }).then(() => {
          resolve()
        }).catch(() => {
          reject()
        }).finally(() => {
          reject()
        })
      })
    },
    // 提交投放表单
    submitForm(val) {
      const { checkMediaId } = this
      const use = val.use
      const useList = use.split('/')
      if (parseInt(useList[0]) >= parseInt(useList[1])) {
        Message.closeAll()
        this.$message.error('该广告已投满，请重新选择')
        return false
      }
      const data = {
        ...val,
        enabled: ~~val.enabled,
        userType: val.userType.join(','),
        resourceId: checkMediaId
      }
      data.startTime = data.startTime ? moment(data.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
      data.endTime = data.endTime ? moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
      if (data.startTime && data.endTime) {
        if (moment(data.startTime).valueOf() > moment(data.endTime).valueOf()) {
          Message.closeAll()
          this.$message.error('开始时间不能在结束时间之后')
          return false
        }
      }
      delete data.advertIds
      delete data.use
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      this.put(data, val.advertIds).then(() => {
        this.key = 2
        this.putMoreData = data
        this.putMore(val.advertIds)
      })
    },
    // 投放更多 - 打开
    putMore(id) {
      this.putSuccessVisible = true
      const { form, adList } = this
      const data = {
        advertSize: adList[form.advertIds].size,
        type: 2,
        userType: form.userType.join(',')
      }
      listAdvertPublish(data).then(res => {
        const data = res.data || []
        const morePutList = []
        data.map(item => {
          if (item.id !== id) {
            morePutList.push({
              label: item.advertName,
              value: item.id
            })
          }
        })
        this.morePutList = morePutList
      })
    },
    // 一件投放 - 确认
    fristPutMt() {
      const { putMoreData, moreCheckPut } = this
      if (!moreCheckPut.length) {
        this.$message.error('请选择广告位')
        return false
      }
      this.put(putMoreData, moreCheckPut.join(',')).then(() => {
        this.$message.success('一件投放成功')
        this.putMoreData = {}
        this.putSuccessVisible = false
      })
    },
    // 一件投放的弹窗 - 关闭
    closePutDl() {
      this.putSuccessVisible = false
      this.$router.push({ name: 'Put' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .ad-container {
    padding: 20px;
  }
  .materiel-list {
    margin: 0 -10px 30px 0;
    padding: 0;
    max-height: 330px;
    overflow: auto;

    &:after {
      content: '';
      display: block;
      clear: both;
    }
    li {
      list-style: none;
      float: left;
      width: 225px;
      height: 150px;
      margin-right: 15px;
      margin-bottom: 15px;
      border: 1px dashed #ddd;
      box-sizing: border-box;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      &:hover {
        border: 1px dashed #89c3f9;
        img, video {
          transform: scale(1.1);
        }
        .materiel-info-item__content {
          top: 50px;
        }
      }
      img, video {
        float: left;
        width: 225px;
        transition: all .35s;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .materiel-check {
        z-index: 10;
        width: 100%;
        height: 100%;
        display: flex;
        text-align: center;
        justify-content: center;
        position: absolute;
        align-items: center;
        background-color: rgba(255,255,255,.5);
        border: 1px solid #89c3f9;
        box-sizing: border-box;
        i {
          font-size: 50px;
          color: #1890ff;
          cursor: pointer;
        }
      }
    }
    .img-check {
      border-color: #FFF;
      &:hover {
        border-color: #FFF;
      }
    }
    .materiel-info-item__content {

      z-index: 0;
      position: absolute;
      width: 100%;
      height: 100px;
      background-color: rgba(0,0,0,.3);
      color: #FFFFFF;
      padding-left: 15px;
      padding-top: 10px;
      left: 0;
      top: 150px;
      transition: all .35s;
      p {
        margin: 4px 0;
      }
    }
  }
  .materiel-action {
    display: flex;
    justify-content: center;
    vertical-align: middle;
    >div {
      margin: 0 5px;
    }
  }
  .put-success {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #4CAF50;
    margin-bottom: 30px;
    i {
      font-size: 32px;
    }
  }
  .put-select {
    margin-bottom: 30px;
    padding-left: 30px;
  }
  .put-select-txt {

  }
  .put-select-group {
    /deep/ .el-checkbox {
      margin-bottom: 10px;
    }
  }
  .put-action {
    text-align: center;
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
      width: 86px !important;
      margin-right: 10px;
      align-items: center;
      justify-content: flex-end;
      align-self: flex-start;
      line-height: 1.3;
      min-height: 36px;
      vertical-align: middle;
      flex-shrink: 0;
    }
  }
  .form-item-element {
    flex: 1;
    .materiel-info-item__content {
      p {
        margin: 4px 0;
        line-height: 18px;
        color: #333333;
      }
    }
  }

  .media-item {
    overflow: hidden;
    border: 1px solid #f6f6f6;
    width: 300px;
    height: 200px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img,
    video {
      position: absolute;
      z-index: 1;
      width: 300px;
      height: 200px;
      cursor: pointer;
      outline: none;
    }
    svg {
      font-size: 50px;
      z-index: 2;
      color: #1890ff;
      cursor: pointer;
    }
  }
  .media-upload-update {
    cursor: pointer;
    width: 100%;
    height: 36px;
    position: absolute;
    top: 0;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.3);
    color: #1790ff;
    z-index: 10;
    transition: all 0.35s;
    &:hover {
      background-color: #1790ff;
      color: #fff;
    }
  }
  .media-upload {
    cursor: pointer;
    border: 1px dashed #ddd;
    width: 225px;
    height: 150px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    transition: all 0.35s;
    i {
      font-size: 20px;
      z-index: 2;
    }
    &:hover {
      border: 1px dashed #1890ff;
      color: #1890ff;
    }
  }

</style>
