<template>
  <div class="app-container">
    <div class="materiel-info-item__content" style="margin: 0 60px">
      <template v-if="preview.resourceUrl">
        <div v-if="preview.type === 0" class="materiel-detail">
          <el-image :preview-src-list="[preview.resourceUrl]" :src="preview.resourceUrl" alt="" />
        </div>
        <div v-else class="materiel-detail">
          <video :poster="preview.coverUrl" controls="controls" :src="preview.resourceUrl" />
        </div>
      </template>
      <div class="materiel-info-item__content">
        <p>物料尺寸: {{ preview.resourceSize }}</p>
        <p>物料类型: {{ preview.type === 1 ? '视频' : '图片' }}</p>
        <p>外链地址: {{ preview.otherUrl }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewMateriel',
  props: {
    preview: {
      default: () => {},
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
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
			/*height: 200px;*/
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
