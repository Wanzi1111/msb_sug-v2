<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="推荐试听奖励" name="recommend">
        <recommend v-if="activeName === 'recommend'" />
      </el-tab-pane>
      <el-tab-pane label="分享海报奖励" name="share">
        <share v-if="activeName === 'share'" />
      </el-tab-pane>
      <el-tab-pane label="排行榜奖励" name="ranking">
        <ranking v-if="activeName === 'ranking'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Recommend from './components/Recommend'
import Share from './components/Share'
import Ranking from './components/Ranking'

export default {
  name: 'PrizeSet',
  components: { Recommend, Share, Ranking },
  data() {
    return {
      activeName: 'recommend'
    }
  }
}
</script>
