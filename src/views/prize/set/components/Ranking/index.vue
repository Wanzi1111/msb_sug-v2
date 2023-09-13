<template>
  <list :prize-type="3" :columns="columns" :forms="forms" />
</template>

<script>
import List from '../List'
import columns from './columns'
import forms from './forms'

export default {
  name: 'Ranking',
  components: { List },
  data() {
    return {
      columns: columns,
      forms: forms
    }
  }
}
</script>
