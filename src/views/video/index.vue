<template>
  <div class="container">
    <div id="map">地图加载中...</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      em: null,
      map: null
    }
  },
  created () {
    if (window.plus) {
      this.plusReady()
    } else {
      document.addEventListener('plusready', this.plusReady, false)
    }
  },
  methods: {
    // plus 手机端变量
    plusReady () {
      // 确保DOM解析完成
      if (!this.em || !window.plus || this.map) { return };
      // eslint-disable-next-line no-undef
      this.map = new plus.maps.Map('map')
      // eslint-disable-next-line no-undef
      this.map.centerAndZoom(new plus.maps.Point(116.3977, 39.906016), 12)
    }
  }
}
</script>

<style scope lang="less">
#map {
  width: 100%;
  position: fixed;
  top: 0px;
  bottom: 0px;
  line-height: 200px;
  text-align: center;
  background: #ffffff;
}
</style>
