<template>
  <list :prize-type="1" :columns="columns" :forms="forms" />
</template>

<script>
import List from '../List'
import columns from './columns'
import forms from './forms'

export default {
  name: 'Recommend',
  components: { List },
  data() {
    return {
      columns: columns,
      forms: forms
    }
  }
}
</script>
