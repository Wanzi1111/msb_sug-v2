<template>
  <div>

    <div class="title-container">
      <basics-title title="操作条" line />
    </div>

    <div class="app-container">
      <basics-action :actions="actions" />
      <basics-action :actions="actions2" />
    </div>

  </div>
</template>

<script>
import BasicsTitle from '@/components/BasicsTitle'
import BasicsAction from '@/components/BasicsAction'
import actions, { actions2 } from './actions/actions'

export default {
  name: 'BasicsActions',
  components: { BasicsTitle, BasicsAction },
  data() {
    return {
      actions: actions({ btnClick: this.btnClick, command: this.command }),
      actions2: actions2()
    }
  },
  methods: {
    btnClick() {
      console.log('btnClick')
    },
    command(e) {
      console.log('command', e)
    }
  }
}
</script>

