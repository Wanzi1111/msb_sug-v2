<template>
  <!--TODO: 预览 外链-->
  <el-drawer
    :title="preview.announcementName"
    :visible.sync="visible"
    direction="rtl"
    size="600px"
    custom-class="preview-container"
    :before-close="closeDr"
  >
    <div :key="preview.id" class="preview-container">
      <div class="preview-container-content">
        <div v-if="preview.showType" v-html="preview.content" />
      </div>
    </div>
  </el-drawer>

</template>
<script>
export default {
  name: 'ArticlePreview',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    preview: {
      default: () => {},
      type: Object
    },
    closeDr: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
	.preview-container {
		padding: 20px;
		.preview-container-content {
			padding: 20px;
			border: 1px solid #ddd;
			border-radius: 8px;
			img {
				/*max-width: 100%;*/
				/*height: auto;*/
			}
		}
		iframe {
			border: 0;
			width: 100%;
			min-height: 800px;
		}
	}
</style>
