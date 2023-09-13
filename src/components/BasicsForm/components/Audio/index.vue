<template>
  <audio ref="audio" controls controlslist="nodownload">
    <source :src="url" type="audio/mp3">您的浏览器不支持 HTML5 audio 标签。
  </audio>
</template>

<script>

export default {
  name: 'Audios',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    // alias for $refs.audio
    audio() {
      return this.$refs.audio
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
audio {
  width: 100%;
  height: 40px;
  outline: none;
  filter: invert(180); //c3 filter(滤镜) 属性
}

audio::-webkit-media-controls-enclosure {
  background: rgb(235, 101, 12);
  /* 滤镜反转为 rgba(0, 162, 255, 1);rgba(255, 93, 0, 0.8)  #7eb637   10,10,10  #757575 */
  border-radius: 4px;
}
.media-controls-container,
.media-controls-container * {
  background: rgb(228, 71, 24);
  //滤镜反转为 rgba(0, 162, 255, 1);rgba(255, 93, 0, 0.8)  #7eb637
  border-radius: 4px;
}
audio::-webkit-media-controls-play-button {
  height: 22px;
  width: 22px;
  min-width: 22px;
  border-radius: 50%;
  flex-basis: 22px;
}

// 音量隐藏
audio::-webkit-media-controls-volume-control-container {
  display: none;
}

audio::-webkit-media-controls-current-time-display {
  order: 1; //设置弹性盒对象元素的顺序
  color: #000;
  text-shadow: unset;
}

audio::-webkit-media-controls-time-remaining-display {
  order: 2;
  color: rgba(0, 0, 0, 0.6);
  text-shadow: unset;
}
</style>
