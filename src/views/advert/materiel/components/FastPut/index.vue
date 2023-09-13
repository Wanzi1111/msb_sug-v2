<template>
  <div class="app-container">
    <div class="materiel-info">
      <div class="materiel-info-item">
        <label class="materiel-info-item__label">物料信息</label>
        <div class="materiel-info-item__content">
          <div v-if="dat.type === 0" class="materiel-detail">
            <el-image :preview-src-list="[dat.resourceUrl]" :src="dat.resourceUrl" alt="" />
          </div>
          <div v-else class="materiel-detail">
            <video :poster="dat.coverUrl" controls="controls" :src="dat.resourceUrl" />
          </div>
          <div class="materiel-info-item__content">
            <p>物料尺寸: {{ dat.resourceSize }}</p>
            <p>物料类型: {{ dat.type === 1 ? '视频' : '图片' }}</p>
            <p>外链地址: {{ dat.otherUrl }}</p>
          </div>
        </div>
      </div>
    </div>
    <basics-form ref="form" :forms="forms" :actions="actions" @submitForm="submitForm" @changeForm="changeForm" />
  </div>
</template>

<script>
import BasicsForm from '@/components/BasicsForm'
import { listAdvertPublish } from '@/api/advert/put'
import { publish } from '@/api/advert/materiel'
import forms, { actions as formAct } from './forms/index'
import moment from 'moment'
import { Message } from 'element-ui'

export default {
  name: 'FastPut',
  components: { BasicsForm },
  props: {
    dat: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      forms: forms,
      form: {},
      actions: formAct({ quit: this.close })
    }
  },
  mounted() {
    // const { userType } = this.$store.getters.adConfig
    // const userTypeOption = Object.keys(userType[bussinessName]).map(v => {
    //   return {
    //     value: ~~v ? v : userType[bussinessName][v],
    //     label: ~~v ? userType[bussinessName][v] : v
    //   }
    // })
    // console.log('userTypeOption', userTypeOption)
    // this.$refs.form.set({
    //   type: 'options',
    //   data: {
    //     userType: userTypeOption
    //   }
    // })
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
    // this.$refs.form.set({
    //   type: 'defaultVal',
    //   data: {
    //     startTime: moment(this.rowData.startTime),
    //     endTime: moment(this.rowData.endTime),
    //     userType: this.rowData.userType.split(',')
    //   }
    // })
  },
  methods: {
    // 填充广告位
    getAd() {
      const { dat, form } = this
      if (!dat.resourceSize) {
        return false
      }
      const data = {
        advertSize: dat.resourceSize,
        type: 2,
        userType: form.userType.join(','),
        bussinessName: form.businessType
      }
      listAdvertPublish(data).then(res => {
        console.log(res)
        const data = []
        const list = res.data || []
        list.map(item => {
          data.push({
            name: item.advertName,
            num: `${item.usedCount}/${item.totalCount}`,
            value: item.id
          })
        })
        this.$refs.form.set({
          type: 'tableData',
          data: { advertIds: data }
        })
      }).catch(error => {
        console.log(error)
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
      console.log('userTypeOption', userTypeOption)
      this.$refs.form.set({
        type: 'options',
        data: {
          userType: userTypeOption
        }
      })
    },
    // 快速投放 - 变化
    changeForm(val, oldVal) {
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
        this.$refs.form.set({
          type: 'tableData',
          data: {
            advertIds: []
          }
        })
        return
      }
      if (val.businessType !== oldVal.businessType && !oldVal.businessType) {
        this.changeUserTypeOption(val.businessType)
      }
      if (val.userType.join() && val.userType.join() !== oldVal.userType.join()) {
        this.getAd()
      }
      if (val.startTime && val.startTime !== oldVal.startTime) {
        const attr = {
          type: 'datetime',
          defaultTime: '23:59:59',
          placeholder: '请选择投放结束时间',
          pickerOptions: {
            disabledDate: (e) => {
              return e.getTime() < moment(`${moment(val.startTime).format('YYYY-MM-DD')} 00:00:00`).valueOf() || e.getTime() < moment().valueOf() - 86400000
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
    // 快速投放 - 提交
    submitForm(val) {
      const { dat } = this
      const data = {
        ...val,
        enabled: ~~val.enabled,
        resourceId: dat.id,
        userType: val.userType.join(',')
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
      for (const name in data) {
        !data[name] && data[name] !== 0 && delete data[name]
      }
      publish(data, {
        advertIds: val.advertIds.join(',')
      }).then(() => {
        this.$message.success('快速投放成功')
        this.close()
        this.$emit('put-success')
      }).catch(error => {
        console.log(error)
      })
    },
    // 关闭或返回
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

	.materiel-info {

	}

	.materiel-info-item {
		display: flex;
		margin-bottom: 22px;
	}

	.materiel-info-item__label {
		display: block;
		width: 86px !important;
		margin-right: 10px;
		line-height: 36px;
		font-size: 14px;
		color: #606266;
		padding: 0 12px 0 0;
	}
	.materiel-info-item__content {
		flex: 1;

		p {
			margin: 8px 0;
			color: #333;
		}
	}

	.materiel-detail {
		border: 1px solid #f6f6f6;
		width: 300px;
    height: 200px;
    position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
    overflow: hidden;
		/deep/ .el-image {
			margin: 0 auto;
      overflow: initial;
    }
		img,video {
			z-index: 1;
			width: 300px;
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

</style>
