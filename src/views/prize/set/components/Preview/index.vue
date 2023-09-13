<template>
  <el-dialog
    title="素材预览"
    :visible.sync="visible"
    width="440px"
    :before-close="close"
  >
    <div class="">
      <div class="materiel-info-item__content" style="margin: 0 70px">
        <el-image class="img" :preview-src-list="[src]" :src="src" alt="" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div class="materiel-info-item__content">
          <p>素材尺寸：{{ ratio }}</p>
          <p>素材格式：{{ type }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'PreviewMateriel',
  props: {
    row: Object,
    visible: Boolean,
    close: Function
  },
  data() {
    return {
      src: '',
      ratio: '',
      type: ''
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const { row } = this
      if (row.imageUrl) {
        this.src = row.imageUrl
        const img = new Image()
        img.src = row.imageUrl
        img.onload = () => {
          this.ratio = `${img.width} x ${img.height}`
        }
        this.type = row.imageUrl.slice(row.imageUrl.lastIndexOf('.') + 1)
      }
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

    img, video {
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
  .img {
    width: 260px;
    height: 173px;
    border: 1px solid #ddd;
    /deep/ .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
      font-size: 30px;
    }
  }

</style>
